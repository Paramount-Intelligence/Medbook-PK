"use client";
import { useState, useCallback } from "react";
import type { Hospital, Doctor, ModalTab } from "@/types";

export function useBookingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentHospital, setCurrentHospital] = useState<Hospital | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ModalTab>("doctors");

  const openHospital = useCallback((hospital: Hospital) => {
    if (hospital.comingSoon) return;
    setCurrentHospital(hospital);
    setSelectedDoctor(null);
    setSelectedSlot(null);
    setActiveTab("doctors");
    setIsOpen(true);
  }, []);

  const openHospitalWithDoctor = useCallback((hospital: Hospital, doctor: Doctor) => {
    if (hospital.comingSoon) return;
    setCurrentHospital(hospital);

    // Match doctor by ProfileID from URL (most reliable)
    const getProfileId = (url?: string) => {
      const m = String(url ?? "").match(/ProfileID=(\d+)/i);
      return m ? m[1] : null;
    };
    const targetPid = getProfileId(doctor.url);
    let match = targetPid
      ? hospital.doctors.find((d) => getProfileId(d.url) === targetPid)
      : null;
    if (!match) {
      const normName = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
      match = hospital.doctors.find((d) => normName(d.name) === normName(doctor.name)) ?? null;
    }

    setSelectedDoctor(match ?? doctor);
    setSelectedSlot(null);
    setActiveTab("booking");
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const switchTab = useCallback((tab: ModalTab) => {
    setActiveTab(tab);
  }, []);

  return {
    isOpen, currentHospital, selectedDoctor, selectedSlot, activeTab,
    openHospital, openHospitalWithDoctor, closeModal, switchTab,
    setSelectedDoctor, setSelectedSlot, setActiveTab,
  };
}
