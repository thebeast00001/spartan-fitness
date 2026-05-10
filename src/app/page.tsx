"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import Manifesto from "@/components/Manifesto";
import StaggeredTransition from "@/components/StaggeredTransition";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Loader from "@/components/Loader";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <Loader key="loader" onFinished={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      <SmoothScroll>
        <main style={{ opacity: isLoading ? 0 : 1, transition: "opacity 1s ease" }}>
          <Hero />
          
          <StaggeredTransition prevColor="#000" nextColor="#050505" direction="left-to-right" />
          <Gallery />
          
          <StaggeredTransition prevColor="#050505" nextColor="#000" direction="right-to-left" />
          <Manifesto />
          
          <Pricing />
          
          <StaggeredTransition prevColor="#fff" nextColor="#000" direction="right-to-left" />
          <Testimonials />
          
          <StaggeredTransition prevColor="#000" nextColor="#fff" direction="left-to-right" />
          <Footer />
        </main>
      </SmoothScroll>
    </>
  );
}
