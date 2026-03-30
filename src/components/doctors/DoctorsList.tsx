"use client";
import { useState, useMemo } from "react";
import type { Doctor } from "@/types";

const PAGE_SIZE = 12;

interface Props {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  onSelect: (d: Doctor) => void;
  onProceed: () => void;
}

export default function DoctorsList({ doctors, selectedDoctor, onSelect, onProceed }: Props) {
  const [search, setSearch] = useState("");
  const [activeSpec, setActiveSpec] = useState("All");
  const [page, setPage] = useState(0);
  const [showError, setShowError] = useState(false);

  const specialties = useMemo(
    () => ["All", ...Array.from(new Set(doctors.map((d) => d.spec).filter(Boolean))).sort()],
    [doctors]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    let base = activeSpec === "All" ? doctors : doctors.filter((d) => d.spec === activeSpec);
    if (q) base = base.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.spec.toLowerCase().includes(q) ||
        (d.sub ?? "").toLowerCase().includes(q) ||
        (d.conditions ?? "").toLowerCase().includes(q)
    );
    return base;
  }, [doctors, search, activeSpec]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageDocs = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const handleSpec = (spec: string) => { setActiveSpec(spec); setPage(0); };
  const handleSearch = (v: string) => { setSearch(v); setPage(0); };

  const handleProceed = () => {
    if (!selectedDoctor) { setShowError(true); return; }
    setShowError(false);
    onProceed();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Search */}
      <div className="doctors-search">
        <svg className="doctors-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="search"
          placeholder="Search by name, specialty, or condition…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          aria-label="Search doctors"
        />
      </div>

      {/* Specialty filter */}
      <select
        className="specialty-select"
        value={activeSpec}
        onChange={(e) => handleSpec(e.target.value)}
        aria-label="Filter by specialty"
      >
        <option value="All">All Specialties</option>
        {specialties.filter((s) => s !== "All").map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Count bar */}
      <div style={{ fontSize: "0.78rem", color: "#6b7f8a" }}>
        {filtered.length === 0
          ? "No doctors found"
          : `Showing ${Math.min(page * PAGE_SIZE + 1, filtered.length)}–${Math.min(page * PAGE_SIZE + PAGE_SIZE, filtered.length)} of ${filtered.length} doctor${filtered.length !== 1 ? "s" : ""}`}
      </div>

      {/* Doctor cards — 2-col grid matching original */}
      <div className="doctors-grid" role="listbox" aria-label="Doctor list">
        {pageDocs.length === 0 ? (
          <p className="no-results" style={{ gridColumn: "1/-1" }}>No doctors match your search. Try different keywords.</p>
        ) : (
          pageDocs.map((d) => (
            <div
              key={d.id}
              className={`doctor-card${selectedDoctor?.id === d.id ? " selected" : ""}`}
              onClick={() => { onSelect(d); setShowError(false); }}
              onKeyDown={(e) => e.key === "Enter" && onSelect(d)}
              role="option"
              aria-selected={selectedDoctor?.id === d.id}
              tabIndex={0}
            >
              <div className="doc-avatar" aria-hidden="true">
                {String(d.name).split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div className="doc-info">
                <div className="doc-name">{d.name}</div>
                <div className="doc-spec">
                  {d.spec}{d.sub ? <> · <em>{d.sub}</em></> : null}
                </div>
                <div className="doc-qual">
                  {d.title ? `${d.title} · ` : ""}{d.qual ?? ""}
                </div>
                {d.avail && (
                  <div className="doc-avail">
                    <span className="avail-dot" aria-hidden="true" />
                    Available {d.avail}
                  </div>
                )}
                {d.conditions && (
                  <div className="doc-qual" style={{ marginTop: 4 }}>
                    {d.conditions.slice(0, 110)}{d.conditions.length > 110 ? "…" : ""}
                  </div>
                )}
              </div>
              {selectedDoctor?.id === d.id && (
                <div className="doc-check" aria-hidden="true">✓</div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 0}
          >← Prev</button>
          <span style={{ fontSize: "0.82rem", color: "#6b7f8a" }}>Page {page + 1} of {totalPages}</span>
          <button
            className="page-btn"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages - 1}
          >Next →</button>
        </div>
      )}

      {showError && (
        <div className="alert-error" role="alert">⚠ Please select a doctor first.</div>
      )}

      <button className="submit-btn" onClick={handleProceed}>
        <span>Continue to Booking</span><span>→</span>
      </button>
    </div>
  );
}
