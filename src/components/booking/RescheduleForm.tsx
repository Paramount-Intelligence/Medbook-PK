"use client";
import { useState } from "react";
import type { RescheduleFormData, ValidationErrors } from "@/types";
import { validateReschedule, buildReschedulePayload } from "@/lib/validator";
import { submitReschedule } from "@/lib/api";
import { CONFIG } from "@/lib/config";

interface Props {
  onSuccess: (formData: RescheduleFormData) => void;
}

const today = new Date().toISOString().split("T")[0];
const maxDate = (() => { const d = new Date(); d.setDate(d.getDate() + 90); return d.toISOString().split("T")[0]; })();
const EMPTY: RescheduleFormData = { reschedRef: "", reschedDate: "", reschedTime: "", reschedReason: "" };

export default function RescheduleForm({ onSuccess }: Props) {
  const [form, setForm] = useState<RescheduleFormData>(EMPTY);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const set = (k: keyof RescheduleFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => { const ne = { ...er }; delete ne[k]; return ne; });
  };

  const handleSubmit = async () => {
    if (submitting) return;
    const { valid, errors: errs } = validateReschedule(form);
    if (!valid) { setErrors(errs); return; }
    setSubmitting(true);
    const payload = buildReschedulePayload(form);
    try {
      const webhookOk = CONFIG.N8N_RESCHEDULE_WEBHOOK.startsWith("http") && !CONFIG.N8N_RESCHEDULE_WEBHOOK.includes("YOUR");
      if (webhookOk) await submitReschedule(payload);
      else { console.group("🔄 Reschedule Payload"); console.log(payload); console.groupEnd(); }
      onSuccess(form);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : String(err));
      setSubmitting(false);
    }
  };

  return (
    <div className="booking-form">
      <p className="tab-intro">
        Enter your <strong>booking reference</strong> (e.g.{" "}
        <code>AKUH-ABC12</code>) or <strong>phone number</strong> used when booking.
      </p>

      <div className="form-group">
        <label className="form-label">Booking Reference or Phone <span className="req">*</span></label>
        <input
          className={`form-input${errors.reschedRef ? " field-error" : ""}`}
          type="text"
          placeholder="AKUH-ABC12 or 0300-1234567"
          maxLength={30}
          value={form.reschedRef}
          onChange={set("reschedRef")}
        />
        {errors.reschedRef && <span className="error-msg visible" role="alert">{errors.reschedRef}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">New Preferred Date <span className="req">*</span></label>
          <input
            className={`form-input${errors.reschedDate ? " field-error" : ""}`}
            type="date"
            min={today}
            max={maxDate}
            value={form.reschedDate}
            onChange={set("reschedDate")}
          />
          {errors.reschedDate && <span className="error-msg visible" role="alert">{errors.reschedDate}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Preferred Time <span className="req">*</span></label>
          <select
            className={`form-input${errors.reschedTime ? " field-error" : ""}`}
            value={form.reschedTime}
            onChange={set("reschedTime")}
          >
            <option value="">— Select window —</option>
            <option>Morning (8 AM – 12 PM)</option>
            <option>Afternoon (12 PM – 4 PM)</option>
            <option>Evening (4 PM – 8 PM)</option>
          </select>
          {errors.reschedTime && <span className="error-msg visible" role="alert">{errors.reschedTime}</span>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          Reason for Rescheduling{" "}
          <span className="optional">(optional)</span>
        </label>
        <input
          className="form-input"
          type="text"
          placeholder="e.g. Travel conflict, feeling better…"
          maxLength={200}
          value={form.reschedReason ?? ""}
          onChange={set("reschedReason")}
        />
      </div>

      {submitError && <div className="alert-error" role="alert">{submitError}</div>}

      <button className="submit-btn" onClick={handleSubmit} disabled={submitting}>
        {submitting
          ? <><span className="spinner" /><span>Sending…</span></>
          : <><span>Request Reschedule</span><span>→</span></>
        }
      </button>
    </div>
  );
}
