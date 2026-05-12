"use client";

import Footer from "@/components/Footer";
import TrialForm from "@/components/TrialForm";
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
