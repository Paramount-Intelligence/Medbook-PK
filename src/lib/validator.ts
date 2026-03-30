import { CONFIG } from "./config";
import type { BookingFormData, RescheduleFormData, ValidationErrors, Doctor, Hospital } from "@/types";

const today = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const parseDate = (str: string): Date | null => {
  if (!str) return null;
  const d = new Date(str + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateField = (fieldName: string, value: unknown): string | null => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rules = (CONFIG.VALIDATION as any)[fieldName];
  if (!rules) return null;

  const str = value === null || value === undefined ? "" : String(value).trim();

  if (rules.required && str === "") return rules.messages.required;
  if (str === "") return null;
  if (rules.minLength && str.length < rules.minLength) return rules.messages.minLength;
  if (rules.maxLength && str.length > rules.maxLength) return rules.messages.maxLength;
  if (rules.pattern && !rules.pattern.test(str)) return rules.messages.pattern;

  if (fieldName === "date" || fieldName === "reschedDate") {
    const d = parseDate(str);
    if (!d) return rules.messages.required;
    const t = today();
    if (d < t) return rules.messages.pastDate;
    const maxDate = new Date(t);
    maxDate.setDate(t.getDate() + 90);
    if (d > maxDate) return rules.messages.tooFarAhead;
  }

  return null;
};

export const validateBooking = (
  formData: BookingFormData,
  selectedDoctor: Doctor | null
): { valid: boolean; errors: ValidationErrors } => {
  const errors: ValidationErrors = {};
  const fields: (keyof BookingFormData)[] = ["patientName", "phone", "email", "date", "timeSlot", "visitType", "reason"];
  fields.forEach((f) => {
    const err = validateField(f, formData[f]);
    if (err) errors[f] = err;
  });
  if (!selectedDoctor) errors.doctor = "Please select a doctor before proceeding.";
  return { valid: Object.keys(errors).length === 0, errors };
};

export const validateReschedule = (
  formData: RescheduleFormData
): { valid: boolean; errors: ValidationErrors } => {
  const errors: ValidationErrors = {};
  (["reschedRef", "reschedDate", "reschedTime"] as const).forEach((f) => {
    const err = validateField(f, formData[f]);
    if (err) errors[f] = err;
  });
  return { valid: Object.keys(errors).length === 0, errors };
};

export const normalizePhone = (raw: string): string => {
  let s = raw.replace(/[\s\-().]/g, "");
  if (s.startsWith("0092")) s = "+92" + s.slice(4);
  if (s.startsWith("0") && !s.startsWith("00")) s = "+92" + s.slice(1);
  if (!s.startsWith("+")) s = "+92" + s;
  return s;
};

export const generateRef = (shortName: string): string => {
  const ts = Date.now().toString(36).toUpperCase().slice(-5);
  const rnd = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `${shortName}-${ts}${rnd}`;
};

export const buildBookingPayload = (
  formData: BookingFormData,
  doctor: Doctor,
  hospital: Hospital
) => ({
  BookingRef: generateRef(hospital.shortName),
  PatientName: formData.patientName.trim(),
  Phone: normalizePhone(formData.phone),
  Email: formData.email.trim().toLowerCase(),
  DoctorName: doctor.name,
  Specialty: doctor.spec,
  Hospital: hospital.name,
  Date: formData.date,
  TimeSlot: formData.timeSlot,
  VisitType: formData.visitType,
  BookedAt: new Date().toISOString(),
  Status: "confirmed",
  _meta: {
    hospitalShortName: hospital.shortName,
    hospitalPhone: hospital.phone,
    doctorQual: doctor.qual ?? "",
    doctorAvail: doctor.avail ?? "",
    sheetId: CONFIG.SHEET_ID,
  },
});

export const buildReschedulePayload = (formData: RescheduleFormData) => ({
  reference: formData.reschedRef.trim(),
  newDate: formData.reschedDate,
  newTime: formData.reschedTime,
  reason: (formData.reschedReason ?? "").trim(),
  requestedAt: new Date().toISOString(),
  Status: "rescheduled",
});
