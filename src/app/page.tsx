import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import SmoothScroll from "@/components/SmoothScroll";

// Below-the-fold sections are split into separate chunks so the initial
// payload only contains Hero + the smooth-scroll shell.
const Gallery = dynamic(() => import("@/components/Gallery"));
const Manifesto = dynamic(() => import("@/components/Manifesto"));
const StaggeredTransition = dynamic(() => import("@/components/StaggeredTransition"));
const Pricing = dynamic(() => import("@/components/Pricing"));
const Testimonials = dynamic(() => import("@/components/Testimonials"));
const Footer = dynamic(() => import("@/components/Footer"));

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
