"use client";
import type { Hospital } from "@/types";

interface Props {
  hospitals: Hospital[];
  onSearch: (hospital: Hospital | null) => void;
  onOpenChat: () => void;
}

export default function Hero({ hospitals, onSearch, onOpenChat }: Props) {
  return (
    <>
      <section className="hero" aria-label="Hero section">
        <div className="hero-orb hero-orb-1" aria-hidden="true" />
        <div className="hero-orb hero-orb-2" aria-hidden="true" />
        <div className="hero-content">
          {/* Left */}
          <div>
            <div className="hero-eyebrow">Pakistan&apos;s Premier Health Network</div>
            <h1>Healthcare, <em>Reimagined</em> for You</h1>
            <p className="hero-sub">
              Connect with top specialists across Pakistan&apos;s best hospitals.
              Book appointments instantly — our free AI chatbot guides you every step of the way.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => document.getElementById("hospitals")?.scrollIntoView({ behavior: "smooth" })}>
                Find a Doctor →
              </button>
              <button className="btn-outline" onClick={onOpenChat}>
                Chat with AI 🤖
              </button>
            </div>
            <div className="hero-stats">
              <div><div className="stat-num">500+</div><div className="stat-label">Specialists</div></div>
              <div><div className="stat-num">8</div><div className="stat-label">Hospitals</div></div>
              <div><div className="stat-num">24/7</div><div className="stat-label">AI Support</div></div>
              <div><div className="stat-num">98%</div><div className="stat-label">Satisfaction</div></div>
            </div>
          </div>

          {/* Right — floating search card */}
          <div className="hero-search-card" aria-label="Quick search">
            <div className="search-card-title">Find a Specialist</div>
            <select className="search-field" aria-label="Select hospital">
              <option value="">Select Hospital</option>
              <option>Aga Khan University Hospital</option>
              <option>Shaukat Khanum Cancer Centre</option>
              <option>Liaquat National Hospital</option>
              <option>South City Hospital</option>
            </select>
            <select className="search-field" aria-label="Select specialty">
              <option value="">Select Specialty</option>
              <option>Cardiology</option>
              <option>Oncology</option>
              <option>Neurology</option>
              <option>Orthopedics</option>
              <option>Pediatrics</option>
              <option>Internal Medicine</option>
            </select>
            <input className="search-field" type="text" placeholder="Your name" aria-label="Your name" />
            <input className="search-field" type="tel" placeholder="Phone number" aria-label="Phone number" />
            <button
              className="search-btn"
              onClick={() => {
                const h = hospitals.find((h) => !h.comingSoon);
                if (h) onSearch(h);
              }}
            >
              Search &amp; Book →
            </button>
          </div>
        </div>
      </section>

      {/* AI Banner */}
      <div className="ai-banner" role="note">
        <div className="ai-pulse" aria-hidden="true" />
        <div className="ai-badge">Free AI Chatbot</div>
        <div className="ai-text">
          Our <strong>Groq-powered AI assistant</strong> helps you find doctors,
          book appointments, and answer health questions — completely free, 24/7.
        </div>
      </div>
    </>
  );
}
