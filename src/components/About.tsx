"use client";

import { useEffect, useRef } from "react";
import styles from "./About.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Refs for Block 1
  const img1Ref = useRef<HTMLImageElement>(null);
  const img2Ref = useRef<HTMLImageElement>(null);
  const img3Ref = useRef<HTMLImageElement>(null);

  // Refs for Block 2
  const polaroid1Ref = useRef<HTMLImageElement>(null);
  const polaroid2Ref = useRef<HTMLImageElement>(null);

  // Refs for Block 3
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const slicesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // --- Block 1: Staggered Images Parallax ---
      gsap.to(img1Ref.current, {
        y: -150,
        scrollTrigger: { trigger: img1Ref.current, start: "top bottom", end: "bottom top", scrub: 1 }
      });
      gsap.to(img2Ref.current, {
        y: -50,
        scrollTrigger: { trigger: img2Ref.current, start: "top bottom", end: "bottom top", scrub: 1.5 }
      });
      gsap.to(img3Ref.current, {
        y: -200,
        scrollTrigger: { trigger: img3Ref.current, start: "top bottom", end: "bottom top", scrub: 0.8 }
      });

      // --- Block 2: Polaroid Spread ---
      gsap.fromTo(polaroid1Ref.current, 
        { rotation: 0, x: 50 },
        { rotation: -12, x: -20, scrollTrigger: { trigger: polaroid1Ref.current, start: "top bottom", end: "center center", scrub: 1 } }
      );
      gsap.fromTo(polaroid2Ref.current, 
        { rotation: 0, x: -50 },
        { rotation: 8, x: 20, scrollTrigger: { trigger: polaroid2Ref.current, start: "top bottom", end: "center center", scrub: 1 } }
      );

      // --- Block 3: Typography Reveal ---
      const words = headlineRef.current?.children;
      if (words) {
        gsap.fromTo(words,
          { y: 150, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.03,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: headlineRef.current,
              start: "top 80%",
            }
          }
        );
      }

      // --- Block 3: Sliced Image Glitch Parallax ---
      slicesRef.current.forEach((slice, i) => {
        if (!slice) return;
        const direction = i % 2 === 0 ? 1 : -1;
        gsap.to(slice, {
          y: () => `+=${direction * 80}`, // Exaggerated movement on scroll
          scrollTrigger: {
            trigger: slice,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          }
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const text = "Crafted bodies, relentless discipline, and raw iron — built to move people.";
  const words = text.split(" ");

  return (
    <section className={styles.aboutContainer} ref={containerRef}>
      
      {/* --- BLOCK 1: STAGGERED IMAGES --- */}
      <div className={styles.staggeredSection}>
        <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop" className={`${styles.staggerImage} ${styles.img1}`} ref={img1Ref} alt="Gym 1" />
        <img src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop" className={`${styles.staggerImage} ${styles.img2}`} ref={img2Ref} alt="Gym 2" />
        <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" className={`${styles.staggerImage} ${styles.img3}`} ref={img3Ref} alt="Gym 3" />
      </div>

      {/* --- BLOCK 2: POLAROIDS --- */}
      <div className={styles.polaroidSection}>
        <h2 className={styles.polaroidTitle}>The Arsenal</h2>
        <div className={styles.polaroidWrapper}>
          <img src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2069&auto=format&fit=crop" className={`${styles.polaroidImage} ${styles.polaroid1}`} ref={polaroid1Ref} alt="Equipment 1" />
          <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop" className={`${styles.polaroidImage} ${styles.polaroid2}`} ref={polaroid2Ref} alt="Equipment 2" />
        </div>
        <p className={styles.polaroidCaption}>Elite Standards</p>
        <p className={styles.polaroidSubcaption}>Built for dominance</p>
      </div>

      {/* --- BLOCK 3: TYPOGRAPHY & SLICES --- */}
      <div className={styles.typoSection}>
        <h2 className={styles.headline} ref={headlineRef}>
          {words.map((word, i) => (
            <span key={i} className={styles.wordWrapper}>
              <span className={styles.word}>{word}</span>
            </span>
          ))}
        </h2>

        <div className={styles.logosRow}>
          <span className={styles.logo}>eleiko</span>
          <span className={styles.logo}>ROGUE</span>
          <span className={styles.logo}>hammer strength</span>
        </div>

        <div className={styles.slicedImageContainer}>
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className={styles.slice} 
              ref={el => { slicesRef.current[i] = el; }}
            ></div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default About;
