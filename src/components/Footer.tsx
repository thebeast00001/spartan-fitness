"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (!footerRef.current) return;

    // Use a native IntersectionObserver to lazy-load the video — way cheaper
    // than spinning up a ScrollTrigger for a one-shot "in view" flag.
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );
    obs.observe(footerRef.current);

    // Only set up the parallax reveal if motion is allowed and we're not on mobile.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (reduceMotion || isMobile) return () => obs.disconnect();

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !innerRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.fromTo(innerRef.current,
          { yPercent: -30 },
          {
            yPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top bottom",
              end: "bottom bottom",
              scrub: true,
            }
          }
        );
      });

      cleanup = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      obs.disconnect();
      if (cleanup) cleanup();
    };
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <footer ref={footerRef} className={styles.footer}>
      <div ref={innerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>

        {inView && (
          <video
            ref={videoRef}
            className={styles.footerVideo}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="none"
          >
            <source src="/vid_002_opt.mp4" type="video/mp4" />
          </video>
        )}

        <button
          onClick={toggleMute}
          className={styles.volumeToggle}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
          suppressHydrationWarning
        >
          {isMuted ? (
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          )}
        </button>

        <div ref={cardRef} className={styles.floatingCard}>

          <div className={styles.cardTop}>

            <div className={styles.cardNewsletter}>
              <h2 className={styles.newsletterHeading}>
                READY TO FORGE<br/>
                AN UNBREAKABLE<br/>
                PHYSIQUE & MIND?
              </h2>
              <div className={styles.contactInfo}>
                <div className={styles.contactBlock}>
                  <h4>CONTACT US</h4>
                  <a href="tel:+919876543210" suppressHydrationWarning>+91 98765 43210</a>
                </div>
                <div className={styles.contactBlock}>
                  <h4>EMAIL US</h4>
                  <a href="mailto:elite@spartanfitness.com" suppressHydrationWarning>elite@spartanfitness.com</a>
                </div>
              </div>
            </div>

            <div className={styles.cardMenuContainer}>
              <div className={styles.cardMenu}>
                <h3>MENU</h3>
                <ul>
                  <li><Link href="/">HOME</Link></li>
                  <li><Link href="/trial">FREE TRIAL</Link></li>
                  <li><Link href="/coach">COACH</Link></li>
                  <li><Link href="/schedule">CREATE YOUR WORKOUT</Link></li>
                </ul>
              </div>

            <div className={styles.cardSupport}>
              <h3>HQ</h3>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Shop+No.+755,+Lashwara,+Majnu+Wala+Rd,+near+Electric+Transformer,+Teachers+Colony,+Deoband,+Noorpur+Dehat,+Uttar+Pradesh+247554"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapLink}
              >
                OPEN MAPS ↗
              </a>
              <div style={{ marginTop: '20px', overflow: 'hidden', borderRadius: '4px' }}>
                <Image
                  src="/location.png"
                  alt="Spartan HQ Map"
                  width={600}
                  height={300}
                  sizes="(max-width: 768px) 90vw, 600px"
                  loading="lazy"
                  quality={75}
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>

        </div>

        <div className={styles.cardBottom}>
          <div className={styles.paymentLogos}></div>

          <div className={styles.socialIcons}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" suppressHydrationWarning>IN</a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" suppressHydrationWarning>YT</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" suppressHydrationWarning>FB</a>
          </div>
        </div>

      </div>

        <div className={styles.footerCredits}>
          <div className={styles.copyright}>
            © 2026 Spartan Fitness Inc.
          </div>
        </div>

      </div>
    </footer>
  );
}
