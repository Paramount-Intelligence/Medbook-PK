// ── Doctor ────────────────────────────────────────────────────────────────────
export interface Doctor {
  id: number | string;
  name: string;
  spec: string;
  sub?: string;
  qual?: string;
  avail?: string;
  initials: string;
  slots?: string[];
  title?: string;
  url?: string;
  conditions?: string;
  edu?: string;
}

// ── Hospital ──────────────────────────────────────────────────────────────────
export interface Hospital {
  id: number;
  name: string;
  shortName: string;
  location: string;
  type: string;
  rating: number;
  tag: string;
  featured: boolean;
  comingSoon: boolean;
  specialties: string[];
  doctorCount: number;
  emoji: string;
  phone: string;
  doctors: Doctor[];
}

// ── Booking ───────────────────────────────────────────────────────────────────
export interface BookingFormData {
  patientName: string;
  phone: string;
  email: string;
  date: string;
  timeSlot: string;
  visitType: string;
  reason: string;
}

export interface RescheduleFormData {
  reschedRef: string;
  reschedDate: string;
  reschedTime: string;
  reschedReason?: string;
}

export interface BookingPayload extends BookingFormData {
  BookingRef: string;
  DoctorName: string;
  Specialty: string;
  Hospital: string;
  BookedAt: string;
  Status: string;
  _meta: {
    hospitalShortName: string;
    hospitalPhone: string;
    doctorQual: string;
    doctorAvail: string;
    sheetId: string;
  };
}

// ── Chat ──────────────────────────────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
  doctorIds?: string[];
  timestamp: Date;
}

export interface ValidationErrors {
  [key: string]: string;
}

// ── Modal state ───────────────────────────────────────────────────────────────
export type ModalTab = "doctors" | "booking" | "reschedule";
