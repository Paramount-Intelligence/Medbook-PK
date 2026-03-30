"use client";
export default function N8nSection() {
  return (
    <section id="ai" className="n8n-section" aria-label="Automation stack">
      <div className="n8n-inner">
        <div>
          <div className="section-eyebrow">Free Automation Stack</div>
          <h2 className="section-title">Powered by <em>n8n + Groq AI</em></h2>
          <p style={{ color: "#6b7f8a", lineHeight: 1.7, margin: "20px 0 32px", fontSize: "0.95rem" }}>
            100% free tools power the entire booking experience — Groq AI for the chatbot,
            n8n Cloud for automation, Google Sheets for storage, Gmail for confirmation emails.
          </p>
          <div className="n8n-features">
            {[
              { icon: "🤖", title: "Groq AI Chatbot (Free)", desc: "Guides patients to the right doctor and answers questions — Llama 3.3 70B on free tier." },
              { icon: "⚡", title: "n8n Cloud Automation", desc: "Webhook → Validate → Sheets → Gmail. All connected in n8n. Zero code required." },
              { icon: "📊", title: "Google Sheets (Cols A–L)", desc: "BookingRef · PatientName · Phone · Email · DoctorName · Specialty · Hospital · Date · TimeSlot · VisitType · BookedAt · Status" },
              { icon: "📧", title: "Gmail Confirmations", desc: "Instant confirmation emails sent via Gmail node in n8n — completely free." },
            ].map((f) => (
              <div key={f.title} className="n8n-feature">
                <div className="nf-icon" aria-hidden="true">{f.icon}</div>
                <div>
                  <div className="nf-title">{f.title}</div>
                  <div className="nf-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live code display */}
        <div className="n8n-visual" aria-label="n8n workflow code example">
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.65rem", marginBottom: 16 }}>// n8n Webhook → Sheets → Gmail</div>
          <div className="n8n-line"><span className="n8n-dot green" aria-hidden="true" /><span className="key">trigger</span>: <span className="val">&quot;POST /webhook/new-appointment&quot;</span></div>
          <div className="n8n-line" style={{ paddingLeft: 16 }}><span className="key">→ Code</span>: <span className="val">validate &amp; build payload</span></div>
          <div className="n8n-line" style={{ paddingLeft: 16 }}><span className="key">→ Sheets</span>.<span className="val">append</span>&#123; <span className="comment">// Sheet ID: 1tZ9X3m…</span></div>
          <div className="n8n-line" style={{ paddingLeft: 32 }}><span className="key">A</span>: BookingRef, &nbsp;<span className="key">B</span>: PatientName,</div>
          <div className="n8n-line" style={{ paddingLeft: 32 }}><span className="key">C</span>: Phone, &nbsp;&nbsp;&nbsp;&nbsp;<span className="key">D</span>: Email,</div>
          <div className="n8n-line" style={{ paddingLeft: 32 }}><span className="key">E</span>: DoctorName, <span className="key">F</span>: Specialty,</div>
          <div className="n8n-line" style={{ paddingLeft: 32 }}><span className="key">G</span>: Hospital, &nbsp;<span className="key">H</span>: Date,</div>
          <div className="n8n-line" style={{ paddingLeft: 32 }}><span className="key">I</span>: TimeSlot, &nbsp;<span className="key">J</span>: VisitType,</div>
          <div className="n8n-line" style={{ paddingLeft: 32 }}><span className="key">K</span>: BookedAt, &nbsp;<span className="key">L</span>: Status</div>
          <div className="n8n-line" style={{ paddingLeft: 16 }}>&#125; <span className="n8n-dot teal" aria-hidden="true" /></div>
          <div className="n8n-line" style={{ paddingLeft: 16 }}><span className="key">→ Gmail</span>.<span className="val">send</span>(confirmation_email) <span className="n8n-dot gold" aria-hidden="true" /></div>
          <div className="n8n-line"><span className="key">status</span>: <span className="val" style={{ color: "var(--green)" }}>&quot;✓ confirmed&quot;</span> &nbsp;<span className="key">cost</span>: <span className="val" style={{ color: "var(--green)" }}>&quot;$0.00&quot;</span></div>
        </div>
      </div>
    </section>
  );
}
