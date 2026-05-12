"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Hero.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const videoFrameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Toggle sound on user click (browser requires gesture to unmute)
  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    const next = !isSoundOn;
    video.muted = !next;
    setIsSoundOn(next);
    // If enabling sound, ensure video is playing
    if (next) video.play();
  };

  useEffect(() => {
    // Force video to play muted on mount
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          const playOnInteract = () => {
            video.play();
            document.removeEventListener("click", playOnInteract);
          };
          document.addEventListener("click", playOnInteract);
        });
      }
    }

    const ctx = gsap.context(() => {

      // ── 1. Staggered Entrance ─────────────────────────────────
      const entrance = gsap.timeline({
        defaults: { ease: "power4.out" },
        delay: 0.3,
      });

      // Chars reveal one by one with rotation
      entrance.from(".char", {
        y: "120%",
        rotateX: -80,
        opacity: 0,
        stagger: 0.035,
        duration: 1.4,
      });

      // Video fades in after text starts
      entrance.fromTo(
        videoSectionRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: "power2.inOut" },
        "-=0.5"
      );

      // Frame border fades in synced with video
      entrance.fromTo(
        videoFrameRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: "power2.inOut" },
        "-=1"
      );

      // Scroll hint fades in last
      entrance.to(scrollHintRef.current, {
        opacity: 1,
        duration: 0.6,
      }, "-=0.4");

      // ── 2. Scroll-driven Unfold ──────────────────────────────
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: pinnedRef.current,
          start: "top top",
          end: "+=280%",
          scrub: 2.5,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onLeave: () => {
            // Auto-mute when scrolling past hero
            if (videoRef.current) videoRef.current.muted = true;
            setIsSoundOn(false);
          },
          onEnterBack: () => {
            // Stay muted when returning — user can re-enable via button
          },
        },
      });

      // Clip-path: centred square → bounded frame
      scrollTl.fromTo(
        videoSectionRef.current,
        { clipPath: "inset(35% 37% 35% 37%)" },
        { clipPath: "inset(4% 3% 4% 3%)", ease: "power1.inOut", duration: 1 }
      );

      // Frame border synced with video clip
      scrollTl.fromTo(
        videoFrameRef.current,
        { clipPath: "inset(35% 37% 35% 37%)" },
        { clipPath: "inset(4% 3% 4% 3%)", ease: "power1.inOut", duration: 1 },
        0
      );

      // Video zoom out as it expands
      scrollTl.fromTo(
        videoRef.current,
        { scale: 1.6 },
        { scale: 1, ease: "power1.inOut", duration: 1 },
        0
      );

      // Text fades + shifts slightly upward
      scrollTl.to(
        ".char",
        { opacity: 0, y: "-30px", stagger: 0.02, ease: "power2.in", duration: 0.6 },
        0.1
      );

      // Scroll hint disappears first
      scrollTl.to(
        scrollHintRef.current,
        { opacity: 0, y: -15, duration: 0.15, ease: "power2.in" },
        0
      );

      // Corner markers fade in as video approaches final bounds
      scrollTl.to(
        ".corner-mark",
        { opacity: 1, duration: 0.3, stagger: 0.05, ease: "power2.out" },
        0.7
      );

      // ── THE UNDERGROUND DROP (Fixed & Refined) ──
      // Clean, extremely fast gravity drop without buggy CSS filters
      scrollTl.to(
        containerRef.current,
        {
          y: "150vh",
          scale: 0.5,
          opacity: 0,
          duration: 1.5,
          ease: "power3.in"
        },
        1.2 // Starts right after video unfold completes
      );

    }, heroRef);

    return () => ctx.revert();
  }, []);

  const splitText = (text: string) =>
    text.split("").map((char, i) => (
      <span key={i} className="char" style={{ display: "inline-block" }}>
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  return (
    <div ref={heroRef}>
      <div className={styles.hero} ref={pinnedRef}>
        
        {/* Subliminal Easter Egg (Revealed during the drop) */}
        <div className={styles.subliminalMessage}>
          <h2 className={styles.subliminalText}>Discipline.</h2>
        </div>

        <div 
          className={styles.pinnedContainer} 
          ref={containerRef} 
          style={{ transformOrigin: "bottom center", zIndex: 2 }}
        >

          {/* Video layer */}
          <div className={styles.videoSection} ref={videoSectionRef}>
            {mounted && (
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster="/hero_poster.jpg"
                className={styles.heroVideo}
                style={{ backgroundColor: '#111' }}
              >
                <source src="/hero_video_opt.mp4" type="video/mp4" />
              </video>
            )}
          </div>

          {/* Sound toggle button */}
          <button
            className={styles.soundToggle}
            onClick={toggleSound}
            aria-label={isSoundOn ? "Mute" : "Unmute"}
            suppressHydrationWarning
          >
            <span className={styles.soundIcon}>
              {isSoundOn ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              )}
            </span>
            <span className={styles.soundLabel}>{isSoundOn ? "SOUND ON" : "SOUND OFF"}</span>
          </button>

          {/* Thin border frame synced with video clip */}
          <div className={styles.videoFrame} ref={videoFrameRef} />

          {/* Editorial corner markers */}
          <div className={`${styles.cornerMark} ${styles.topLeft} corner-mark`} />
          <div className={`${styles.cornerMark} ${styles.topRight} corner-mark`} />
          <div className={`${styles.cornerMark} ${styles.bottomLeft} corner-mark`} />
          <div className={`${styles.cornerMark} ${styles.bottomRight} corner-mark`} />

          {/* Headline */}
          <div className={styles.titleContainer}>
            <div className={styles.line}>{splitText("SPARTAN")}</div>
            <div className={styles.line}>{splitText("CULTURE")}</div>
          </div>

          {/* Scroll hint */}
          <div className={styles.scrollHint} ref={scrollHintRef}>
            <span className={styles.scrollHintText}>Scroll to explore</span>
            <div className={styles.scrollLine} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
