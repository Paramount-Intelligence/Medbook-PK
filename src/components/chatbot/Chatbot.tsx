"use client";
import { useState, useRef, useEffect, useCallback, type MutableRefObject } from "react";
import type { Doctor, Hospital } from "@/types";
import { detectSpecs, isAffirmative, getAllSpecialtyNames, getSeniority } from "@/lib/smap";
import { CONFIG } from "@/lib/config";

/* ── Types ─────────────────────────────────────────────────────────────── */
interface Msg { id: string; role: "user" | "bot"; text: string; doctorIds?: string[]; }
interface GrokDoctor { id: string; name: string; title?: string; spec: string; sub?: string; conditions?: string; edu?: string; url?: string; }

const MAX_HISTORY = 10;

const mdToHtml = (t: string) =>
  t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
   .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
   .replace(/\*(.*?)\*/g, "<em>$1</em>")
   .replace(/\n/g, "<br>");

/* ── System prompt builder ─────────────────────────────────────────────── */
const buildSystemPrompt = (specs: string[], doctors: GrokDoctor[]) => {
  const allSpecs = getAllSpecialtyNames().join(", ");
  const header = "ALL_SPECIALTIES: " + allSpecs;

  let ctx = header;
  if (specs.length && doctors.length) {
    ctx += "\n\nDOCTOR DATABASE FOR THIS QUERY:\n";
    const bySpec: Record<string, GrokDoctor[]> = {};
    for (const d of doctors) bySpec[d.spec] = [...(bySpec[d.spec] ?? []), d];
    for (const spec of specs) {
      const ds = bySpec[spec];
      if (ds?.length) {
        ctx += `\n[${spec} — ${ds.length} doctors]\n`;
        ctx += ds.map((d) => `${d.id}|${d.name}|${d.title ?? ""}|${d.spec}|${d.sub ?? ""}|${(d.conditions ?? "").replace(/\n/g, " ").slice(0, 80)}`).join("\n");
      }
    }
  } else {
    ctx += "\n\nNo specific specialty detected — ask user to describe symptoms.";
  }

  return `You are Zara, an intelligent AI health assistant for MedBook PK — Pakistan's leading doctor appointment booking platform.

PERSONALITY: Warm, caring, professional. Concise. Fluent in English, Urdu, Roman Urdu. Use **bold** for doctor names and medical terms.

HOSPITALS ON MEDBOOK PK:
- Aga Khan University Hospital (AKUH) — Karachi | 021-3486-1234
- Shaukat Khanum Cancer Centre — Lahore
- Liaquat National Hospital — Karachi
- South City Hospital — Karachi
(More hospitals being added continuously)

${ctx}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CRITICAL RULE — DOCTOR IDs:
NEVER suggest or display doctors not listed in DOCTOR DATABASE.
If DOCTOR DATABASE is empty, ask for symptoms. Do NOT embed [[DOCTORS:...]] tag.

SHOWING DOCTOR CARDS:
Embed [[DOCTORS:id1,id2,...]] in your response.
• Show 5 doctors by default; more if user asks
• Only use IDs from DOCTOR DATABASE — only for the matched specialty
• Rank: Professor > Consultant > Assistant Professor > Lecturer
• Do NOT repeat IDs from previous assistant messages

TRIGGERING BOOKING:
When user confirms booking a specific doctor, embed [[BOOK:id]]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEMANTIC SYMPTOM ANALYSIS:
• chest pain + left arm pain + sweating → CARDIAC EMERGENCY → call 1122
• headache + fever + stiff neck → MENINGITIS EMERGENCY → call 1122
• sudden vision loss + weakness one side → STROKE EMERGENCY → call 1122
• yellow eyes + dark urine + fatigue → Gastroenterology (hepatitis)
• frequent urination + thirst + weight loss → Endocrinology (diabetes)
• joint pain + skin rash + fatigue → Rheumatology
• For VAGUE symptoms: ask ONE targeted question
• Understand Roman Urdu/Urdu symptom descriptions

RULES:
1. NEVER invent doctor IDs — only use exact IDs from DOCTOR DATABASE
2. Emergencies → IMMEDIATELY say call 1122
3. Remember full conversation context
4. Do NOT mention any specific hospital by name in greetings

URDU GLOSSARY:
dil=heart, sar/sir=head, kamar=back, pet=stomach, paon/paaon=foot, tang=leg,
ghutna=knee, kandha=shoulder, aankhein=eyes, kan=ear, naak=nose, gala=throat,
gurda=kidney, jigar=liver, dard=pain, sujan=swelling, bukhaar=fever,
khansee=cough, qay=vomiting, kamzori=weakness, bachay=child`;
};

/* ── Main Chatbot Component ─────────────────────────────────────────────── */
interface Props {
  doctors: GrokDoctor[];
  hospitals: Hospital[];
  onBookDoctor: (hospitalId: number, doctor: Doctor) => void;
  onOpenRef?: MutableRefObject<(() => void) | null>;
}

export default function Chatbot({ doctors, hospitals, onBookDoctor, onOpenRef }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const [greeted, setGreeted] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [micState, setMicState] = useState<"idle" | "listening" | "processing">("idle");
  const [lastSpecs, setLastSpecs] = useState<string[]>([]);
  const historyRef = useRef<{ role: "user" | "assistant"; content: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transcriptRef = useRef("");

  // Expose open() to parent via ref
  useEffect(() => {
    if (onOpenRef) onOpenRef.current = () => setIsOpen(true);
    return () => { if (onOpenRef) onOpenRef.current = null; };
  }, [onOpenRef]);

  const scroll = () => setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  const uid = () => Math.random().toString(36).slice(2);

  const getDoctorsForSpecs = useCallback((specs: string[]): GrokDoctor[] => {
    const seen = new Set<string>();
    const result: GrokDoctor[] = [];
    for (const spec of specs) {
      const ds = doctors
        .filter((d) => d.spec === spec || (d.sub ?? "").toLowerCase().includes(spec.toLowerCase()))
        .sort((a, b) => getSeniority(b.title) - getSeniority(a.title));
      for (const d of ds) { if (!seen.has(String(d.id))) { seen.add(String(d.id)); result.push(d); } }
    }
    return result;
  }, [doctors]);

  /* ── Groq API call ──────────────────────────────────────────────────── */
  const callGroq = useCallback(async (
    userText: string,
    specs: string[],
    onChunk: (acc: string) => void
  ): Promise<string> => {
    const apiKey = CONFIG.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;
    if (!apiKey || apiKey === "YOUR_GROQ_API_KEY_HERE") throw new Error("NO_KEY");

    const relevantDoctors = getDoctorsForSpecs(specs);
    historyRef.current = [...historyRef.current, { role: "user", content: userText }].slice(-MAX_HISTORY);

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: buildSystemPrompt(specs, relevantDoctors) },
          ...historyRef.current,
        ],
        max_tokens: 650,
        temperature: 0.6,
        stream: true,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      let msg = `API error ${res.status}`;
      try { msg = JSON.parse(errText).error?.message ?? msg; } catch { /* empty */ }
      throw new Error(msg);
    }

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let full = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      for (const line of decoder.decode(value).split("\n")) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") continue;
        try {
          const delta = JSON.parse(data).choices?.[0]?.delta?.content ?? "";
          if (delta) { full += delta; onChunk(full); }
        } catch { /* empty */ }
      }
    }

    historyRef.current = [...historyRef.current, { role: "assistant", content: full }];
    return full;
  }, [getDoctorsForSpecs]);

  /* ── Send message ───────────────────────────────────────────────────── */
  const sendMessage = useCallback(async (text: string) => {
    if (isWaiting || !text.trim()) return;
    const trimmed = text.trim();
    setInput("");
    setQuickReplies([]);
    setMessages((m) => [...m, { id: uid(), role: "user", text: trimmed }]);
    setIsWaiting(true);
    scroll();

    // Specialty detection
    let specs = detectSpecs(trimmed);
    if (!specs.length) {
      if (lastSpecs.length && (isAffirmative(trimmed) || trimmed.split(/\s+/).length <= 4)) {
        specs = lastSpecs;
      }
    } else {
      setLastSpecs(specs);
    }

    // Typing indicator
    const typingId = uid();
    setMessages((m) => [...m, { id: typingId, role: "bot", text: "__typing__" }]);
    scroll();

    try {
      let botMsgId = uid();
      let doctorIds: string[] = [];

      const fullText = await callGroq(trimmed, specs, (acc) => {
        const display = acc.replace(/\[\[DOCTORS:[^\]]*\]\]/g, "").replace(/\[\[BOOK:[^\]]*\]\]/g, "").trim();
        setMessages((m) =>
          m.map((msg) =>
            msg.id === typingId
              ? { id: botMsgId, role: "bot", text: display }
              : msg.id === botMsgId
              ? { ...msg, text: display }
              : msg
          )
        );
        scroll();
      });

      // Extract [[DOCTORS:...]]
      const doctorMatches = [...fullText.matchAll(/\[\[DOCTORS:([^\]]+)\]\]/g)];
      doctorIds = doctorMatches.flatMap((m) => m[1].split(",").map((s) => s.trim()).filter(Boolean));

      // Update final message with doctorIds
      setMessages((m) =>
        m.map((msg) => (msg.id === botMsgId ? { ...msg, doctorIds } : msg))
      );

      // Handle [[BOOK:id]]
      const bookMatch = fullText.match(/\[\[BOOK:([^\]]+)\]\]/);
      if (bookMatch) {
        const docId = bookMatch[1].trim();
        const doc = doctors.find((d) => String(d.id) === docId);
        if (doc) {
          setTimeout(() => {
            const hospital = hospitals.find((h) => h.id === 1);
            if (hospital) onBookDoctor(1, doc as unknown as Doctor);
          }, 400);
        }
      }

      // Quick replies
      const qr = buildQR(fullText, specs);
      setQuickReplies(qr);

    } catch (err) {
      const error = err as Error;
      setMessages((m) => m.filter((msg) => msg.id !== typingId));
      let errText = "Sorry, couldn't connect. Please try again.";
      if (error.message === "NO_KEY") {
        errText = "⚠️ **Groq API key not configured.**\n\n1. Go to **console.groq.com**\n2. Sign up free → API Keys → Create\n3. Add to `.env.local` as `NEXT_PUBLIC_GROQ_API_KEY`";
      } else if (error.message.includes("401") || error.message.includes("Invalid API")) {
        errText = "⚠️ **Invalid API key.** Check your `.env.local`.\nGet a free key at **console.groq.com**";
      } else if (error.message.includes("429")) {
        errText = "Rate limit reached — please wait a moment and try again.";
      }
      setMessages((m) => [...m, { id: uid(), role: "bot", text: errText }]);
      setQuickReplies(["Try again", "Heart problem", "Back pain", "Child specialist"]);
    }

    setIsWaiting(false);
    scroll();
    inputRef.current?.focus();
  }, [isWaiting, lastSpecs, callGroq, doctors, hospitals, onBookDoctor]);

  /* ── Greeting ───────────────────────────────────────────────────────── */
  const greet = useCallback(async () => {
    if (greeted) return;
    setGreeted(true);
    const typingId = uid();
    setMessages([{ id: typingId, role: "bot", text: "__typing__" }]);

    try {
      const msgId = uid();
      await callGroq(
        "Greet the user warmly as Zara in 2 sentences. You help patients find doctors and book appointments at top hospitals in Pakistan. Be friendly and natural. End by asking what health concern they have today. Do NOT name any specific hospital.",
        [],
        (acc) => {
          const display = acc.replace(/\[\[[^\]]*\]\]/g, "").trim();
          setMessages((m) =>
            m.map((msg) =>
              msg.id === typingId
                ? { id: msgId, role: "bot", text: display }
                : msg.id === msgId
                ? { ...msg, text: display }
                : msg
            )
          );
        }
      );
    } catch {
      setMessages([{ id: uid(), role: "bot", text: "السلام علیکم! 👋 I'm **Zara**, your AI health assistant for MedBook PK.\n\nTell me your symptoms in **English or Urdu** and I'll find the right doctor for you.\n\n_Kya takleef hai aaj?_" }]);
    }

    setQuickReplies(["I have chest pain", "Mere bachay ko bukhaar hai", "Kamar dard", "I feel depressed", "Sugar / thyroid problem"]);
    scroll();
  }, [greeted, callGroq]);

  const toggle = useCallback(() => {
    setIsOpen((o) => {
      if (!o && !greeted) setTimeout(greet, 300);
      return !o;
    });
  }, [greeted, greet]);

  /* ── Book from chat card ─────────────────────────────────────────────── */
  const bookFromCard = useCallback((docId: string) => {
    const doc = doctors.find((d) => String(d.id) === docId);
    if (!doc) return;
    setQuickReplies([]);
    const hospital = hospitals.find((h) => h.id === 1);
    if (hospital) onBookDoctor(1, doc as unknown as Doctor);
    setMessages((m) => [...m, { id: uid(), role: "user", text: `Book ${doc.name}` }]);
    historyRef.current = [...historyRef.current,
      { role: "user", content: `I want to book an appointment with ${doc.name} (${doc.spec})` },
      { role: "assistant", content: `Opening booking form for ${doc.name}.` },
    ];
    setMessages((m) => [...m, { id: uid(), role: "bot", text: `✅ Opening booking form for **${doc.name}** — ${doc.spec}!` }]);
    setQuickReplies(["Book a different doctor", "Done, thank you!"]);
    scroll();
  }, [doctors, hospitals, onBookDoctor]);

  /* ── Voice ──────────────────────────────────────────────────────────── */
  const stopListening = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch { /* empty */ } }
    setMicState("idle");
  }, []);

  const finalizeVoice = useCallback(() => {
    stopListening();
    const text = transcriptRef.current.trim();
    if (!text) return;
    setMicState("processing");
    setTimeout(() => { setMicState("idle"); sendMessage(text); }, 300);
  }, [stopListening, sendMessage]);

  const toggleVoice = useCallback(() => {
    const SR = (window as Window & typeof globalThis & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition
      || (window as Window & typeof globalThis & { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
    if (!SR) {
      setMessages((m) => [...m, { id: uid(), role: "bot", text: "⚠️ Voice input not supported. Please use **Chrome**, **Edge**, or **Safari**." }]);
      return;
    }
    if (micState === "listening") { stopListening(); return; }
    if (isWaiting) return;

    transcriptRef.current = "";
    const rec = new SR();
    recognitionRef.current = rec;
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-PK";

    rec.onstart = () => {
      setMicState("listening");
      silenceTimerRef.current = setTimeout(finalizeVoice, 8000);
    };
    rec.onresult = (event: SpeechRecognitionEvent) => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      let interim = "", final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript + " ";
        else interim += event.results[i][0].transcript;
      }
      if (final) transcriptRef.current += final;
      setInput((transcriptRef.current + interim).trim());
      silenceTimerRef.current = setTimeout(finalizeVoice, 2000);
    };
    rec.onerror = (event: SpeechRecognitionErrorEvent) => {
      stopListening();
      const msgs: Record<string, string | null> = {
        "not-allowed": "🎤 Microphone access denied. Please allow in browser settings.",
        "no-speech": "No speech detected. Please try again.",
        "network": "Network error during voice recognition.",
        "aborted": null,
      };
      const m = msgs[event.error];
      if (m) setMessages((prev) => [...prev, { id: uid(), role: "bot", text: m }]);
    };
    rec.onend = () => {
      if (micState === "listening") {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        if (transcriptRef.current.trim()) finalizeVoice();
        else setMicState("idle");
      }
    };

    try { rec.start(); } catch { setMicState("idle"); }
  }, [micState, isWaiting, stopListening, finalizeVoice]);

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <>
      {/* FAB button */}
      <button
        className="chat-fab"
        id="chatFab"
        onClick={toggle}
        aria-label="Open AI chat assistant"
        aria-expanded={isOpen}
      >
        <span aria-hidden="true">{isOpen ? "✕" : "🤖"}</span>
        {!greeted && !isOpen && <span className="fab-badge" aria-hidden="true" />}
      </button>

      {/* Chat window */}
      <div
        className={`chat-window${isOpen ? " open" : ""}`}
        id="chatWindow"
        role="complementary"
        aria-label="AI Chat Assistant"
      >
        {/* Header */}
        <div className="chat-header">
          <div className="chat-avatar" aria-hidden="true">🏥</div>
          <div className="chat-header-info">
            <div className="chat-name">Zara — AI Health Assistant</div>
            <div className="chat-status">
              <span className="chat-status-dot" aria-hidden="true" />
              Online · English &amp; اردو
            </div>
          </div>
          <button className="chat-close" onClick={toggle} aria-label="Close chat">✕</button>
        </div>

        {/* Messages */}
        <div className="chat-messages" id="chatMessages" aria-live="polite" aria-label="Chat messages">
          {messages.map((msg) => (
            <MessageItem key={msg.id} msg={msg} doctors={doctors} onBook={bookFromCard} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick replies */}
        {quickReplies.length > 0 && !isWaiting && (
          <div className="quick-replies" role="group" aria-label="Quick reply options">
            {quickReplies.map((qr) => (
              <button key={qr} className="qr-btn" onClick={() => { setQuickReplies([]); sendMessage(qr); }}>
                {qr}
              </button>
            ))}
          </div>
        )}

        {/* n8n badge */}
        <div className="n8n-badge">
          Connected to <span>n8n + Google Sheets</span> — bookings save automatically
        </div>

        {/* Input area */}
        <div className="chat-input-area">
          <textarea
            ref={inputRef}
            className="chat-input"
            id="chatInput"
            placeholder="Describe symptoms or ask in Urdu…"
            rows={1}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
            }}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            disabled={isWaiting}
            aria-label="Type your message"
          />
          <button
            id="voiceMicBtn"
            data-state={micState}
            onClick={toggleVoice}
            disabled={isWaiting && micState === "idle"}
            className="chat-mic-btn"
            aria-label={micState === "idle" ? "Click to speak" : micState === "listening" ? "Listening… click to stop" : "Processing…"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M19 10a7 7 0 01-14 0" /><line x1="12" y1="19" x2="12" y2="22" />
            </svg>
          </button>
          <button
            className="chat-send"
            id="chatSendBtn"
            onClick={() => sendMessage(input)}
            disabled={isWaiting || !input.trim()}
            aria-label="Send message"
          >
            {isWaiting ? (
              <span className="send-spinner" aria-hidden="true" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5" fill="none">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </>
  );
}


/* ── Quick replies builder ──────────────────────────────────────────────── */
const SPEC_ACTIONS: Record<string, string> = {
  "Cardiology": "Book a cardiologist",
  "Orthopaedic Surgery": "Book an orthopaedic surgeon",
  "Neurology": "Book a neurologist",
  "Psychiatry": "Book a psychiatrist",
  "Gastroenterology": "Book a gastroenterologist",
  "Dermatology": "Book a dermatologist",
  "Endocrinology": "Book for diabetes / thyroid",
  "General Paediatrics": "Book a paediatrician",
  "Ophthalmology": "Book an eye specialist",
  "ENT (Otolaryngology)": "Book an ENT specialist",
  "Pulmonology": "Book a lung specialist",
  "Nephrology": "Book a kidney specialist",
  "Obstetrics and Gynaecology": "Book a gynaecologist",
  "Internal Medicine": "Book a general physician",
};

function buildQR(responseText: string, specs: string[]): string[] {
  const chips: string[] = [];
  for (const spec of specs) {
    if (SPEC_ACTIONS[spec]) { chips.push(SPEC_ACTIONS[spec]); break; }
  }
  if (responseText.includes("[[DOCTORS:")) chips.push("Show more doctors");
  if (specs.length > 1 && SPEC_ACTIONS[specs[1]] && SPEC_ACTIONS[specs[1]] !== chips[0]) chips.push(SPEC_ACTIONS[specs[1]]);
  if (responseText.toLowerCase().includes("how long") || responseText.toLowerCase().includes("tell me more")) {
    chips.push("It started recently", "It has been months");
  }
  chips.push("Different specialty");
  return Array.from(new Set(chips)).slice(0, 5);
}

/* ── MessageItem ────────────────────────────────────────────────────────── */
function MessageItem({ msg, doctors, onBook }: { msg: Msg; doctors: GrokDoctor[]; onBook: (id: string) => void }) {
  const isBot = msg.role === "bot";
  const isTyping = msg.text === "__typing__";
  const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={`msg ${isBot ? "bot" : "user"}`}>
      {isTyping ? (
        <div className="typing-indicator">
          <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
        </div>
      ) : msg.doctorIds && msg.doctorIds.length > 0 ? (
        <>
          <div className="msg-bubble" dangerouslySetInnerHTML={{ __html: mdToHtml(msg.text) }} />
          <div className="chat-doc-list" style={{ marginTop: 8 }}>
            {msg.doctorIds.map((id) => {
              const doc = doctors.find((d) => String(d.id) === id);
              if (!doc) return null;
              const initials = doc.name.split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
              const cond = (doc.conditions ?? "").replace(/\n/g, " ").trim();
              const condShort = cond.length > 130 ? cond.slice(0, 130) + "…" : cond;
              return (
                <div key={id} className="chat-doc-card">
                  <div className="chat-doc-avatar">{initials}</div>
                  <div className="chat-doc-info">
                    <div className="chat-doc-name">{doc.name}</div>
                    <div className="chat-doc-spec">
                      <span className="chat-doc-title">{doc.title ?? "Specialist"}</span> · <em>{doc.spec}{doc.sub ? ` — ${doc.sub}` : ""}</em>
                    </div>
                    {doc.edu && <div className="chat-doc-edu">🎓 {doc.edu}</div>}
                    {condShort && <div className="chat-doc-cond">Treats: {condShort}</div>}
                    <div className="chat-doc-hospital">🏥 AKUH — Karachi</div>
                  </div>
                  <button
                    className="chat-doc-book-btn"
                    onClick={() => onBook(String(doc.id))}
                    aria-label={`Book ${doc.name}`}
                  >
                    Book →
                  </button>
                </div>
              );
            })}
          </div>
          <div className="msg-time">{now}</div>
        </>
      ) : (
        <>
          <div className="msg-bubble" dangerouslySetInnerHTML={{ __html: mdToHtml(msg.text) }} />
          <div className="msg-time">{now}</div>
        </>
      )}
    </div>
  );
}
