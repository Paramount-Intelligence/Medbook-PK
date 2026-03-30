"use client";
import type { Hospital } from "@/types";
import HospitalCard from "./HospitalCard";

interface Props {
  hospitals: Hospital[];
  loading: boolean;
  onOpen: (h: Hospital) => void;
}

export default function HospitalGrid({ hospitals, loading, onOpen }: Props) {
  return (
    <div className="hospitals-grid" role="list" aria-label="Available hospitals">
      {loading
        ? Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 380 }} />
          ))
        : hospitals.map((h) => <HospitalCard key={h.id} hospital={h} onOpen={onOpen} />)
      }
    </div>
  );
}
