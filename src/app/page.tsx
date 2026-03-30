"use client";
import { useCallback, useState, useEffect, useRef } from "react";
import type { Doctor } from "@/types";
import { useHospitals } from "@/hooks/useHospitals";
import { useBookingModal } from "@/hooks/useBookingModal";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/layout/Hero";
import HospitalGrid from "@/components/doctors/HospitalGrid";
import HowItWorks from "@/components/layout/HowItWorks";
import N8nSection from "@/components/layout/N8nSection";
import Footer from "@/components/layout/Footer";
import BookingModal from "@/components/booking/BookingModal";
import Chatbot from "@/components/chatbot/Chatbot";

export default function Home() {
  const { hospitals, loading } = useHospitals();
  const {
    isOpen, currentHospital, selectedDoctor, selectedSlot, activeTab,
    openHospital, openHospitalWithDoctor, closeModal, switchTab, setSelectedDoctor, setSelectedSlot,
  } = useBookingModal();

  const [showBanner, setShowBanner] = useState(false);
  const chatbotOpenRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GROQ_API_KEY ?? "";
    if (!key || key === "YOUR_GROQ_API_KEY_HERE") setShowBanner(true);
  }, []);

  const handleBookDoctor = useCallback((hospitalId: number, doctor: Doctor) => {
    const hospital = hospitals.find((h) => h.id === hospitalId);
    if (hospital) openHospitalWithDoctor(hospital, doctor);
  }, [hospitals, openHospitalWithDoctor]);

  const chatbotDoctors = hospitals.find((h) => h.id === 1)?.doctors ?? [];

  return (
    <>
      <Navbar />

      {showBanner && (
        <div style={{
          background: "#7d4f00", color: "white", textAlign: "center",
          fontSize: "0.8rem", padding: "10px 20px",
          position: "fixed", top: 70, left: 0, right: 0, zIndex: 999,
        }}>
          ⚠️ Groq API key not configured — chatbot AI disabled.
          Add <code style={{ background: "rgba(0,0,0,0.2)", padding: "1px 6px", borderRadius: 4 }}>NEXT_PUBLIC_GROQ_API_KEY</code> to{" "}
          <code style={{ background: "rgba(0,0,0,0.2)", padding: "1px 6px", borderRadius: 4 }}>.env.local</code>
        </div>
      )}

      <main>
        <Hero
          hospitals={hospitals}
          onSearch={(h) => h && openHospital(h)}
          onOpenChat={() => chatbotOpenRef.current?.()}
        />

        <section id="hospitals" aria-label="Hospital network">
          <div className="section">
            <div className="section-header">
              <div className="section-eyebrow">Our Network</div>
              <h2 className="section-title">Premier Hospitals <em>Across Pakistan</em></h2>
            </div>
            <HospitalGrid hospitals={hospitals} loading={loading} onOpen={openHospital} />
          </div>
        </section>

        <HowItWorks />
        <N8nSection />
      </main>

      <Footer />

      <BookingModal
        isOpen={isOpen}
        hospital={currentHospital}
        selectedDoctor={selectedDoctor}
        selectedSlot={selectedSlot}
        activeTab={activeTab}
        onClose={closeModal}
        onSelectDoctor={setSelectedDoctor}
        onSlotSelect={setSelectedSlot}
        onSwitchTab={switchTab}
      />

      {!loading && (
        <Chatbot
          doctors={chatbotDoctors as Parameters<typeof Chatbot>[0]["doctors"]}
          hospitals={hospitals}
          onBookDoctor={handleBookDoctor}
          onOpenRef={chatbotOpenRef}
        />
      )}
    </>
  );
}
