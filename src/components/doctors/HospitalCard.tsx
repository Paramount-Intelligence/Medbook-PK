"use client";
import type { Hospital } from "@/types";

interface Props {
  hospital: Hospital;
  onOpen: (h: Hospital) => void;
}

export default function HospitalCard({ hospital: h, onOpen }: Props) {
  return (
    <div
      className={`hospital-card${h.featured ? " featured" : ""}${h.comingSoon ? " coming-soon" : ""}`}
      role="button"
      tabIndex={h.comingSoon ? -1 : 0}
      aria-label={`Open ${h.name}`}
      onClick={() => !h.comingSoon && onOpen(h)}
      onKeyDown={(e) => e.key === "Enter" && !h.comingSoon && onOpen(h)}
    >
      <div className="hospital-img">
        <div className="hospital-img-overlay" />
        <div className="hospital-img-icon">{h.emoji}</div>
        <div className="hospital-rating">
          <span className="star">⭐</span> {h.rating}
        </div>
        {h.comingSoon && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,25,35,0.6)", backdropFilter: "blur(3px)", borderRadius: 20 }}>
            <span style={{ background: "rgba(255,255,255,0.9)", color: "var(--teal)", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 600, padding: "8px 20px", borderRadius: 8 }}>Coming Soon</span>
          </div>
        )}
      </div>
      <div className="hospital-body">
        <div className="hospital-tag">{h.tag}</div>
        <div className="hospital-name">{h.name}</div>
        <div className="hospital-loc">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          {h.location}
        </div>
        <div className="hospital-specialties">
          {h.specialties.slice(0, 5).map((s) => (
            <span key={s} className="specialty-pill">{s}</span>
          ))}
        </div>
        <div className="hospital-footer">
          <div className="doc-count"><strong>{h.doctorCount || "—"}</strong> Specialists</div>
          {!h.comingSoon && (
            <button className="book-btn" onClick={(e) => { e.stopPropagation(); onOpen(h); }}>
              Book Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
