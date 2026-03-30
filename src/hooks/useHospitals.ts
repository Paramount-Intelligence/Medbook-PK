"use client";
import { useState, useEffect } from "react";
import type { Hospital, Doctor } from "@/types";
import { HOSPITALS_BASE, STATIC_DOCTORS } from "@/lib/config";

export function useHospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/agha_khan_doctors.json")
      .then((r) => r.json())
      .then((akuhDoctors: Doctor[]) => {
        const result: Hospital[] = HOSPITALS_BASE.map((h) => ({
          ...h,
          doctors:
            h.id === 1
              ? akuhDoctors
              : (STATIC_DOCTORS[h.id] ?? []),
        }));
        setHospitals(result);
      })
      .catch(() => {
        // fallback: no AKUH doctors loaded
        const result: Hospital[] = HOSPITALS_BASE.map((h) => ({
          ...h,
          doctors: h.id === 1 ? [] : (STATIC_DOCTORS[h.id] ?? []),
        }));
        setHospitals(result);
      })
      .finally(() => setLoading(false));
  }, []);

  return { hospitals, loading };
}
