"use client";
import type { RescheduleFormData } from "@/types";

export function BookingSuccess({ payload, onReschedule, onClose }: { payload: Record<string, unknown>; onReschedule: () => void; onClose: () => void }) {
  const formatted = (() => { try { return new Date(String(payload.Date) + "T00:00:00").toLocaleDateString("en-PK", { weekday: "long", year: "numeric", month: "long", day: "numeric" }); } catch { return String(payload.Date); } })();
  return (
    <div className="success-screen">
      <div className="success-icon">✓</div>
      <div className="success-title">Appointment Confirmed!</div>
      <p className="success-sub">Your booking <strong>{String(payload.BookingRef)}</strong> has been saved to Google Sheets. A confirmation email is on its way to <strong>{String(payload.Email)}</strong>.</p>
      <div className="success-detail">
        {[["Booking Ref", payload.BookingRef, true], ["Patient", payload.PatientName], ["Doctor", payload.DoctorName], ["Specialty", payload.Specialty], ["Hospital", payload.Hospital], ["Date", formatted], ["Time", payload.TimeSlot], ["Type", payload.VisitType]].map(([label, val, isBadge]) => (
          <div key={String(label)}>
            <div className="sd-label">{String(label)}</div>
            <div className="sd-val">{isBadge ? <span className="ref-badge">{String(val)}</span> : String(val ?? "")}</div>
          </div>
        ))}
      </div>
      <div className="success-actions">
        <button className="book-btn" style={{ background: "transparent", color: "var(--teal)", border: "1.5px solid var(--teal)" }} onClick={onReschedule}>Reschedule</button>
        <button className="book-btn" onClick={onClose}>Done</button>
      </div>
    </div>
  );
}

export function RescheduleSuccess({ formData, onClose }: { formData: RescheduleFormData; onClose: () => void }) {
  return (
    <div className="success-screen">
      <div className="success-icon" style={{ background: "linear-gradient(135deg,var(--gold),#e2bc62)" }}>🔄</div>
      <div className="success-title">Reschedule Requested</div>
      <p className="success-sub">Your request has been sent. The Google Sheet (Column L) will be updated to <strong>rescheduled</strong>, and a confirmation email will follow.</p>
      <div className="success-detail">
        {[["Reference", formData.reschedRef], ["New Date", formData.reschedDate], ["Time Window", formData.reschedTime], ["Status → Col L", "rescheduled"]].map(([label, val]) => (
          <div key={label}>
            <div className="sd-label">{label}</div>
            <div className="sd-val">{label === "Status → Col L" ? <span className="status-badge">{val}</span> : val}</div>
          </div>
        ))}
      </div>
      <div className="success-actions"><button className="book-btn" onClick={onClose}>Done</button></div>
    </div>
  );
}
