"use client";
import { useEffect, useRef, useState } from "react";
import type { Doctor, Hospital, RescheduleFormData, ModalTab } from "@/types";
import DoctorsList from "@/components/doctors/DoctorsList";
import BookingForm from "./BookingForm";
import RescheduleForm from "./RescheduleForm";
import { BookingSuccess, RescheduleSuccess } from "./SuccessScreen";

interface Props {
  isOpen: boolean;
  hospital: Hospital | null;
  selectedDoctor: Doctor | null;
  selectedSlot: string | null;
  activeTab: ModalTab;
  onClose: () => void;
  onSelectDoctor: (d: Doctor) => void;
  onSlotSelect: (s: string) => void;
  onSwitchTab: (t: ModalTab) => void;
}

export default function BookingModal({
  isOpen, hospital, selectedDoctor, selectedSlot, activeTab,
  onClose, onSelectDoctor, onSlotSelect, onSwitchTab,
}: Props) {
  const [bookingPayload, setBookingPayload] = useState<Record<string, unknown> | null>(null);
  const [rescheduleData, setRescheduleData] = useState<RescheduleFormData | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = "";
      setBookingPayload(null);
      setRescheduleData(null);
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape" && isOpen) onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen || !hospital) return null;

  const TABS: { key: ModalTab; label: string }[] = [
    { key: "doctors",    label: "👨‍⚕️ Doctors" },
    { key: "booking",    label: "📋 Book Appointment" },
    { key: "reschedule", label: "🔄 Reschedule" },
  ];

  const showTabs = !bookingPayload && !rescheduleData;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog" aria-modal="true"
    >
      <div className="modal" ref={modalRef} tabIndex={-1} style={{ outline: "none" }}>
        {/* Header */}
        <div className="modal-header">
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
          <div className="modal-hospital-name">{hospital.name}</div>
          <div className="modal-hospital-sub">{hospital.type} · {hospital.location} · {hospital.phone}</div>
        </div>

        {/* Tabs */}
        {showTabs && (
          <div className="modal-tabs">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => onSwitchTab(t.key)}
                className={`modal-tab${activeTab === t.key ? " active" : ""}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="modal-body">
          {bookingPayload ? (
            <BookingSuccess payload={bookingPayload} onReschedule={() => { setBookingPayload(null); onSwitchTab("reschedule"); }} onClose={onClose} />
          ) : rescheduleData ? (
            <RescheduleSuccess formData={rescheduleData} onClose={onClose} />
          ) : activeTab === "doctors" ? (
            <DoctorsList doctors={hospital.doctors} selectedDoctor={selectedDoctor} onSelect={onSelectDoctor} onProceed={() => onSwitchTab("booking")} />
          ) : activeTab === "booking" ? (
            <BookingForm doctor={selectedDoctor} hospital={hospital} selectedSlot={selectedSlot} onSlotSelect={onSlotSelect} onChangeDoctor={() => onSwitchTab("doctors")} onSuccess={(p) => setBookingPayload(p)} />
          ) : (
            <RescheduleForm onSuccess={(fd) => setRescheduleData(fd)} />
          )}
        </div>
      </div>
    </div>
  );
}
