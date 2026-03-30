"use client";
import { useState, useCallback } from "react";
import type { Doctor, Hospital, BookingFormData, ValidationErrors } from "@/types";
import { validateBooking, buildBookingPayload } from "@/lib/validator";
import { submitBooking } from "@/lib/api";
import { CONFIG } from "@/lib/config";

interface Props {
  doctor: Doctor | null;
  hospital: Hospital;
  selectedSlot: string | null;
  onSlotSelect: (slot: string) => void;
  onChangeDoctor: () => void;
  onSuccess: (payload: Record<string, unknown>) => void;
}

const today = new Date().toISOString().split("T")[0];
const maxDate = (() => { const d = new Date(); d.setDate(d.getDate() + 90); return d.toISOString().split("T")[0]; })();
const EMPTY: BookingFormData = { patientName: "", phone: "", email: "", date: "", timeSlot: "", visitType: "", reason: "" };

export default function BookingForm({ doctor, hospital, selectedSlot, onSlotSelect, onChangeDoctor, onSuccess }: Props) {
  const [form, setForm] = useState<BookingFormData>(EMPTY);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const set = (k: keyof BookingFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => { const ne = { ...er }; delete ne[k]; return ne; });
  };
  const handleSlot = (slot: string) => {
    onSlotSelect(slot);
    setForm((f) => ({ ...f, timeSlot: slot }));
    if (errors.timeSlot) setErrors((er) => { const ne = { ...er }; delete ne.timeSlot; return ne; });
  };

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    const fd = { ...form, timeSlot: selectedSlot ?? form.timeSlot };
    const { valid, errors: errs } = validateBooking(fd, doctor);
    if (!valid) { setErrors(errs); return; }
    setSubmitting(true); setSubmitError("");
    const payload = buildBookingPayload(fd, doctor!, hospital);
    try {
      const ok = CONFIG.N8N_BOOKING_WEBHOOK.startsWith("http") && !CONFIG.N8N_BOOKING_WEBHOOK.includes("YOUR");
      if (ok) await submitBooking(payload);
      else { console.group("📋 Booking Payload"); console.table(payload); console.groupEnd(); }
      onSuccess(payload as unknown as Record<string, unknown>);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setSubmitError(msg.includes("timed out") ? "Request timed out." : msg.includes("fetch") ? "Cannot reach server. Check n8n webhook URL." : `Booking failed: ${msg}`);
      setSubmitting(false);
    }
  }, [form, selectedSlot, doctor, hospital, submitting, onSuccess]);

  const slots = doctor?.slots ?? [];

  return (
    <div className="booking-form">
      {/* Doctor pill */}
      {doctor ? (
        <div className="selected-doctor-pill">
          <div className="doc-avatar sm">{doctor.name.split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0,2).toUpperCase()}</div>
          <div>
            <div className="sdp-name">{doctor.name}</div>
            <div className="sdp-spec">{doctor.spec}{doctor.avail ? ` · ${doctor.avail}` : ""}</div>
          </div>
          <button className="sdp-change" onClick={onChangeDoctor}>Change →</button>
        </div>
      ) : (
        <div className="alert-warning">⚠ No doctor selected. <button className="link-btn" onClick={onChangeDoctor}>Go back →</button></div>
      )}

      <div className="form-row">
        <Field label="Patient Full Name" required error={errors.patientName}>
          <input className={`form-input${errors.patientName ? " field-error" : ""}`} type="text" placeholder="e.g. Muhammad Ali Khan" maxLength={80} value={form.patientName} onChange={set("patientName")} autoComplete="name" />
        </Field>
        <Field label="Phone Number" required error={errors.phone}>
          <input className={`form-input${errors.phone ? " field-error" : ""}`} type="tel" placeholder="0300-1234567" maxLength={15} value={form.phone} onChange={set("phone")} autoComplete="tel" />
        </Field>
      </div>
      <div className="form-row">
        <Field label="Email Address" required error={errors.email}>
          <input className={`form-input${errors.email ? " field-error" : ""}`} type="email" placeholder="you@email.com" maxLength={120} value={form.email} onChange={set("email")} autoComplete="email" />
        </Field>
        <Field label="Appointment Date" required error={errors.date}>
          <input className={`form-input${errors.date ? " field-error" : ""}`} type="date" min={today} max={maxDate} value={form.date} onChange={set("date")} />
        </Field>
      </div>

      <Field label="Visit Type" required error={errors.visitType}>
        <select className={`form-input${errors.visitType ? " field-error" : ""}`} value={form.visitType} onChange={set("visitType")}>
          <option value="">— Select visit type —</option>
          <option>In-Person Consultation</option>
          <option>Video Consultation</option>
          <option>Follow-up Visit</option>
          <option>Emergency Consultation</option>
        </select>
      </Field>

      {slots.length > 0 && (
        <Field label="Time Slot" required error={errors.timeSlot}>
          <div className="time-slots">
            {slots.map((s) => (
              <button key={s} type="button" onClick={() => handleSlot(s)}
                className={`time-slot${selectedSlot === s ? " active" : ""}`} aria-checked={selectedSlot === s} role="radio">
                {s}
              </button>
            ))}
          </div>
        </Field>
      )}

      <Field label="Reason for Visit" optional error={errors.reason}>
        <input className={`form-input${errors.reason ? " field-error" : ""}`} type="text" placeholder="Brief description of symptoms…" maxLength={300} value={form.reason} onChange={set("reason")} />
        <span className="char-count" style={{ color: form.reason.length > 280 ? "var(--red)" : undefined }}>{form.reason.length} / 300</span>
      </Field>

      {/* n8n note */}
      <div className="ai-note">
        <div className="ai-icon">⚡</div>
        <div className="ai-note-text"><strong>Powered by n8n:</strong> Your booking is saved to Google Sheets and a confirmation email is sent automatically — 100% free.</div>
      </div>

      {submitError && <div className="alert-error" role="alert">{submitError}</div>}

      <button className="submit-btn" onClick={handleSubmit} disabled={submitting}>
        {submitting ? <><span className="spinner" /><span>Saving…</span></> : <><span>Confirm Appointment</span><span>→</span></>}
      </button>
    </div>
  );
}

function Field({ label, children, required, optional, error }: { label: string; children: React.ReactNode; required?: boolean; optional?: boolean; error?: string }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}{required && <span className="req"> *</span>}{optional && <span className="optional"> (optional)</span>}</label>
      {children}
      {error && <span className="error-msg" role="alert">{error}</span>}
    </div>
  );
}
