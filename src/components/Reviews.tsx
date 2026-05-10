"use client";

import { useEffect, useRef } from "react";
import styles from "./Reviews.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const REVIEWS = [
  {
    id: "01",
    name: "Vikram Sethi",
    role: "Elite Athlete",
    text: "SANJEEV'S APPROACH TO PHYSICAL CULTURE IS TRANSFORMATIVE. IT'S NOT JUST ABOUT LIFTING WEIGHTS; IT'S ABOUT SCULPTING A LEGACY.",
    image: "/review_1.png",
    type: "portrait",
  },
  {
    id: "02",
    name: "Ananya Rao",
    role: "The Tribe",
    text: "THE DISCIPLINE I'VE GAINED HERE EXTENDS FAR BEYOND THE GYM. SPARTAN FITNESS IS A PHILOSOPHY OF EXCELLENCE.",
    image: "/review_2.png",
    type: "spread",
  },
  {
    id: "03",
    name: "Industrial Power",
    role: "Atmosphere",
    text: "PRECISION, INTENSITY, AND DEEP KNOWLEDGE. IF YOU ARE SERIOUS ABOUT YOUR PHYSIQUE, THIS IS THE ONLY PATH.",
    image: "/review_3.png",
    type: "texture",
  },
];

const Reviews = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const pinWidth = horizontalRef.current?.offsetWidth || 0;
      const windowWidth = window.innerWidth;
      const scrollDistance = pinWidth - windowWidth + 500;

      // Main Horizontal Scroll
      gsap.to(horizontalRef.current, {
        x: () => -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: triggerRef.current,
          pin: true,
          start: "top top",
          end: () => `+=${scrollDistance}`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Background Text Parallax (Opposite direction for depth)
      gsap.to(bgTextRef.current, {
        x: 300,
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Individual Image Parallax within cards
      // We use the horizontal movement to drive the image parallax
      const slides = gsap.utils.toArray(`.${styles.slide}`);
      slides.forEach((slide: any) => {
        const img = slide.querySelector(`.${styles.parallaxImg}`);
        if (img) {
          gsap.to(img, {
            x: 150,
            ease: "none",
            scrollTrigger: {
              trigger: slide,
              containerAnimation: undefined, 
              start: "left right",
              end: "right left",
              scrub: true,
            },
          });
        }
      });

      // Text reveal animation
      const textElements = gsap.utils.toArray(`.${styles.revealText}`);
      textElements.forEach((el: any) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 1,
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
          },
        });
      });

      // Progress Bar
      gsap.to(".progress-bar", {
        width: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: () => `+=${scrollDistance}`,
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className={styles.sectionWrapper}>
      <div ref={triggerRef} className={styles.stickyContainer}>
        {/* Large Parallax Background Text */}
        <div ref={bgTextRef} className={styles.bgText}>
          ELITE ELITE ELITE ELITE
        </div>

        <div className={styles.contentHeader}>
          <span className={styles.eyebrow}>Success Stories</span>
          <h2 className={styles.title}>
            The <span className={styles.accent}>Spartan</span> Standard
          </h2>
        </div>

        <div ref={horizontalRef} className={styles.horizontalScroll}>
          {REVIEWS.map((review, i) => (
            <div key={i} className={`${styles.slide} ${styles[review.type]}`}>
              <div className={styles.mediaWrapper}>
                <div className={styles.imageContainer}>
                  <Image 
                    src={review.image} 
                    alt={review.name} 
                    fill 
                    className={`${styles.image} ${styles.parallaxImg}`}
                    priority
                  />
                  <div className={styles.overlay} />
                </div>
                <div className={styles.number}>{review.id}</div>
              </div>
              
              <div className={styles.textWrapper}>
                <div className={styles.quoteIcon}>
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H5c-1.25 0-2 .75-2 2v3c0 1.25.75 2 2 2h3c0 4-4 6-4 6" />
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-3c-1.25 0-2 .75-2 2v3c0 1.25.75 2 2 2h3c0 4-4 6-4 6" />
                  </svg>
                </div>
                <h3 className={`${styles.quote} reveal-text`}>{review.text}</h3>
                <div className={styles.meta}>
                  <span className={styles.name}>{review.name}</span>
                  <span className={styles.sep}>/</span>
                  <span className={styles.role}>{review.role}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Final Editorial Slide */}
          <div className={`${styles.slide} ${styles.finalSlide}`}>
            <div className={styles.finalContent}>
              <h3 className={styles.finalTitle}>ARE YOU<br/>NEXT?</h3>
              <p className={styles.finalSub}>Step into the forge. Sculpt your legacy.</p>
              <button className={styles.finalBtn}>
                JOIN THE TRIBE
                <span className={styles.btnLine} />
              </button>
            </div>
          </div>
        </div>

        {/* Custom Progress Bar */}
        <div className={styles.progressBarContainer}>
          <div className={`${styles.progressBar} progress-bar`} />
          <div className={styles.progressLabel}>SCROLL TO EXPLORE</div>
        </div>
      </div>
      
      {/* Noise Texture Overlay for entire section */}
      <div className={styles.noise} />
    </div>
  );
};

export default Reviews;
