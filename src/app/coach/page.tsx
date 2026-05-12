"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./Coach.module.css";

export default function CoachPage() {
  const [mediaInView, setMediaInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroNameRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const mediaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (mediaInView && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [mediaInView]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Lazy load the media block via IntersectionObserver (no GSAP needed for
    // a simple "in view" flag).
    const mediaEl = containerRef.current?.querySelector(`.${styles.mediaGrid}`);
    if (mediaEl) {
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            setMediaInView(true);
            obs.disconnect();
          }
        },
        { rootMargin: "300px 0px" }
      );
      obs.observe(mediaEl);
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (reduceMotion || isMobile) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.5 } });

      const mainHeroImage = containerRef.current?.querySelector(`.${styles.mainHeroImageWrapper}`);
      if (mainHeroImage) {
        tl.fromTo(
          mainHeroImage,
          { scale: 0.95, opacity: 0, y: 50 },
          { scale: 1, opacity: 1, y: 0, duration: 1.8 }
        );
      }

      mediaRefs.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { y: 100, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: "power4.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
            }
          }
        );
      });

      cleanup = () => ScrollTrigger.getAll().forEach(t => t.kill());
    })();

    return () => { cancelled = true; if (cleanup) cleanup(); };
  }, []);

  const renderAnimatedText = (text: string, indexOffset = 0) => {
    const words = text.split(" ");

    const sentenceVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.03,
          delayChildren: indexOffset * 0.03,
        }
      }
    };

    const charVariants = {
      hidden: { y: "100%", rotateX: -90, opacity: 0 },
      visible: {
        y: "0%",
        rotateX: 0,
        opacity: 1,
        transition: {
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
        }
      }
    };

    return (
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sentenceVariants}
        style={{ display: "inline-block" }}
      >
        {words.map((word, wordIndex) => (
          <span key={wordIndex} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {word.split("").map((char, charIndex) => (
              <motion.span
                key={charIndex}
                className={styles.char}
                variants={charVariants}
                style={{ display: "inline-block", transformOrigin: "bottom center" }}
              >
                {char}
              </motion.span>
            ))}
            {wordIndex !== words.length - 1 && <span>&nbsp;</span>}
          </span>
        ))}
      </motion.span>
    );
  };

  return (
    <main className={styles.main} ref={containerRef}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <p className={styles.boldText}>IFBB Pro</p>
          <p className={styles.mutedText}>Founder, Coach</p>
        </div>

        <div className={styles.headerCenter}></div>

        <div className={styles.headerRight}>
          <p className={styles.mutedText}>Social</p>
          <div className={styles.socialLinks}>
            <span>IG</span>
            <span>YT</span>
            <span>X</span>
          </div>
        </div>
      </header>

      <section className={styles.mainHero}>
        <div className={styles.mainHeroSidebar} ref={heroNameRef}>
          <h1 className={styles.heroTitle}>
            {renderAnimatedText("Sanjeev")}
            <br />
            {renderAnimatedText("Rajput", 10)}
          </h1>
          <p className={styles.heroBio}>
            Over 15 years of elite physical conditioning, transforming athletes into champions. I can&apos;t wait to see what the future holds as I continue to push the boundaries of human performance.
          </p>
          <div className={styles.lastUpdated}>
            <span>Role</span>
            <span>Founder &amp; Head Coach</span>
          </div>
        </div>

        <div className={styles.mainHeroImageWrapper}>
          <Image
            src="/jeff.png"
            alt="Sanjeev Rajput"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.mainHeroImage}
            priority
            quality={80}
          />
        </div>
      </section>

      <section className={styles.hero}>
        <div className={styles.heroSidebar} ref={subRef}></div>

        <div className={styles.heroMain}>
          <h1 className={styles.massiveTitle} ref={titleRef}>
            {renderAnimatedText("Elite Coach and")}
            <br />
            {renderAnimatedText("IFBB Pro currently", 15)}
            <br />
            {renderAnimatedText("based in India.", 30)}
          </h1>
        </div>
      </section>

      <section className={styles.mediaGrid}>
        <div
          className={styles.mediaBlockLarge}
          ref={(el) => { if(el) mediaRefs.current[0] = el; }}
        >
          {mediaInView && (
            <video
              ref={videoRef}
              src="/vid_002_opt.mp4"
              muted
              loop
              playsInline
              preload="metadata"
              className={styles.media}
              style={{ backgroundColor: '#111' }}
            />
          )}
        </div>

        <div
          className={styles.mediaBlockSmall}
          ref={(el) => { if(el) mediaRefs.current[1] = el; }}
        >
          {mediaInView && (
            <Image
              src="/sign-up-image.jpg"
              alt="Coach"
              fill
              sizes="(max-width: 768px) 100vw, 30vw"
              quality={75}
              loading="lazy"
              className={styles.media}
              style={{ backgroundColor: '#111', objectFit: 'cover' }}
            />
          )}
        </div>
      </section>

      <section className={styles.process}>
        <div className={styles.processMain}>
          <h1 className={styles.massiveTitle}>
            {renderAnimatedText("Driven by science,")}
            <br />
            {renderAnimatedText("backed by real", 15)}
            <br />
            {renderAnimatedText("world results.", 30)}
          </h1>
        </div>
        <div className={styles.processSidebar}>
          <p>
            The training process is meticulously designed around biomechanics and sustained progressive overload. We cut the noise and focus on pure, unadulterated growth.
          </p>

          <div className={styles.lastUpdated}>
            <span>Methodology</span>
            <span>Science-Based</span>
          </div>
        </div>
      </section>

    </main>
  );
}
