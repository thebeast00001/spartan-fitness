"use client";

import Footer from "@/components/Footer";
import TrialForm from "@/components/TrialForm";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";

export default function TrialPage() {
  return (
    <SmoothScroll>
      <main>
        <TrialForm />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
