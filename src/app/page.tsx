"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";

const Gallery = dynamic(() => import("@/components/Gallery"), { ssr: false });
const Manifesto = dynamic(() => import("@/components/Manifesto"), { ssr: false });
const StaggeredTransition = dynamic(() => import("@/components/StaggeredTransition"), { ssr: false });
const Pricing = dynamic(() => import("@/components/Pricing"), { ssr: false });
const Testimonials = dynamic(() => import("@/components/Testimonials"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

export default function Home() {
  return (
    <SmoothScroll>
      <main>
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
  );
}
