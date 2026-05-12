"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Hero.module.css";

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px), (pointer: coarse)");
    setIsMobile(mq.matches);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Slightly delay mount so the rest of the page can paint first
    const timer = setTimeout(() => setMounted(true), reduceMotion ? 0 : 80);
    return () => clearTimeout(timer);
  }, []);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    const next = !isSoundOn;
    video.muted = !next;
    setIsSoundOn(next);
    if (next) video.play().catch(() => {});
  };

  useEffect(() => {
    if (!mounted) return;

    const video = videoRef.current;
    if (video) {
      video.muted = true;
      const p = video.play();
      if (p !== undefined) {
        p.catch(() => {
          const onInteract = () => {
            video.play().catch(() => {});
            document.removeEventListener("click", onInteract);
            document.removeEventListener("touchstart", onInteract);
          };
          document.addEventListener("click", onInteract, { once: true });
          document.addEventListener("touchstart", onInteract, { once: true });
        });
      }
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    // Dynamically load GSAP only when we actually animate (skips ~70KB on
    // reduced-motion / cold paint paths).
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        // ── Staggered Entrance (runs on all viewports) ────────────
        const entrance = gsap.timeline({
          defaults: { ease: "power4.out" },
          delay: 0.2,
        });

        entrance.from(".char", {
          y: "120%",
          rotateX: -80,
          opacity: 0,
          stagger: 0.035,
          duration: 1.2,
        });

        entrance.fromTo(
          videoSectionRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1, ease: "power2.inOut" },
          "-=0.5"
        );

        entrance.fromTo(
          videoFrameRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.8, ease: "power2.inOut" },
          "-=1"
        );

        entrance.to(scrollHintRef.current, { opacity: 1, duration: 0.5 }, "-=0.4");

        // ── Scroll-driven Unfold (desktop only — pinning kills mobile perf) ──
        if (isMobile) {
          // On mobile, just show the final state — no pinning, no heavy scrub.
          gsap.set(videoSectionRef.current, { clipPath: "inset(4% 3% 4% 3%)" });
          gsap.set(videoFrameRef.current, { clipPath: "inset(4% 3% 4% 3%)" });
          gsap.set(videoRef.current, { scale: 1 });
          gsap.set(".corner-mark", { opacity: 1 });
          return;
        }

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
              if (videoRef.current) videoRef.current.muted = true;
              setIsSoundOn(false);
            },
          },
        });

        scrollTl.fromTo(
          videoSectionRef.current,
          { clipPath: "inset(35% 37% 35% 37%)" },
          { clipPath: "inset(4% 3% 4% 3%)", ease: "power1.inOut", duration: 1 }
        );

        scrollTl.fromTo(
          videoFrameRef.current,
          { clipPath: "inset(35% 37% 35% 37%)" },
          { clipPath: "inset(4% 3% 4% 3%)", ease: "power1.inOut", duration: 1 },
          0
        );

        scrollTl.fromTo(
          videoRef.current,
          { scale: 1.6 },
          { scale: 1, ease: "power1.inOut", duration: 1 },
          0
        );

        scrollTl.to(
          ".char",
          { opacity: 0, y: "-30px", stagger: 0.02, ease: "power2.in", duration: 0.6 },
          0.1
        );

        scrollTl.to(
          scrollHintRef.current,
          { opacity: 0, y: -15, duration: 0.15, ease: "power2.in" },
          0
        );

        scrollTl.to(
          ".corner-mark",
          { opacity: 1, duration: 0.3, stagger: 0.05, ease: "power2.out" },
          0.7
        );

        scrollTl.to(
          containerRef.current,
          {
            y: "150vh",
            scale: 0.5,
            opacity: 0,
            duration: 1.5,
            ease: "power3.in",
          },
          1.2
        );
      }, heroRef);

      cleanup = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      if (cleanup) cleanup();
    };
  }, [mounted, isMobile]);

  const splitText = (text: string) =>
    text.split("").map((char, i) => (
      <span key={i} className="char" style={{ display: "inline-block" }}>
        {char === " " ? " " : char}
      </span>
    ));

  return (
    <div ref={heroRef}>
      <div className={styles.hero} ref={pinnedRef}>

        <div className={styles.subliminalMessage}>
          <h2 className={styles.subliminalText}>Discipline.</h2>
        </div>

        <div
          className={styles.pinnedContainer}
          ref={containerRef}
          style={{ transformOrigin: "bottom center", zIndex: 2 }}
        >

          <div className={styles.videoSection} ref={videoSectionRef}>
            {mounted && (
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload={isMobile ? "metadata" : "auto"}
                poster="/hero_poster.jpg"
                className={styles.heroVideo}
                style={{ backgroundColor: '#111' }}
              >
                <source src="/hero_video_opt.mp4" type="video/mp4" />
              </video>
            )}
          </div>

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

          <div className={styles.videoFrame} ref={videoFrameRef} />

          <div className={`${styles.cornerMark} ${styles.topLeft} corner-mark`} />
          <div className={`${styles.cornerMark} ${styles.topRight} corner-mark`} />
          <div className={`${styles.cornerMark} ${styles.bottomLeft} corner-mark`} />
          <div className={`${styles.cornerMark} ${styles.bottomRight} corner-mark`} />

          <div className={styles.titleContainer}>
            <div className={styles.line}>{splitText("SPARTAN")}</div>
            <div className={styles.line}>{splitText("CULTURE")}</div>
          </div>

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
