"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./Footer.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (!footerRef.current || !innerRef.current) return;

    const ctx = gsap.context(() => {
      // Classic Awwwards footer reveal: the inner content slides down from top
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

    return () => ctx.revert();
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <footer ref={footerRef} className={styles.footer}>
      {/* Inner wrapper for the reveal animation */}
      <div ref={innerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
        
        {/* Video Background */}
        <video 
          key="vid_002"
          ref={videoRef}
          className={styles.footerVideo} 
          autoPlay 
          loop 
          muted={isMuted} 
          playsInline
          preload="none"
        >
          <source src="/about_001.mp4" type="video/mp4" />
        </video>

        {/* Volume Toggle */}
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

        {/* Floating Card */}
        <div ref={cardRef} className={styles.floatingCard}>
          
          {/* Top Section */}
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
                  <li><Link href="/workout">CREATE YOUR WORKOUT</Link></li>
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
                <img src="/location.png" alt="Spartan HQ Map" style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }} />
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className={styles.cardBottom}>
          <div className={styles.paymentLogos}>
            {/* Payment logos removed */}
          </div>

          <div className={styles.socialIcons}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" suppressHydrationWarning>IN</a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" suppressHydrationWarning>YT</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" suppressHydrationWarning>FB</a>
          </div>
        </div>

      </div>

        {/* Copyright overlaying the video */}
        <div className={styles.footerCredits}>
          <div className={styles.copyright}>
            © 2026 Spartan Fitness Inc.
          </div>
        </div>

      </div>
    </footer>
  );
}
