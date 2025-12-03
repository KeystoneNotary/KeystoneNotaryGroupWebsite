"use client";

import dynamic from "next/dynamic";

// Client-only wrapper to keep the calculator out of the server render path.
const HolographicCalculator = dynamic(
  () => import("./HolographicCalculator"),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function LazyHolographicCalculator() {
  return <HolographicCalculator />;
}
