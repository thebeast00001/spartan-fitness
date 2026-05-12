"use client";

import { useEffect, useRef, MouseEvent, ReactNode, useState } from "react";
import styles from "./TrialForm.module.css";
import { useUser } from "@clerk/nextjs";
import { submitTrialAction } from "@/app/actions";

type GsapModule = typeof import("gsap").default;
let gsapPromise: Promise<GsapModule> | null = null;
const getGsap = () => {
  if (!gsapPromise) {
    gsapPromise = import("gsap").then((m) => m.default);
  }
  return gsapPromise;
};

const MagneticButton = ({ children, className, type = "button", form, disabled }: { children: ReactNode, className?: string, type?: "button" | "submit" | "reset", form?: string, disabled?: boolean }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = async (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || disabled) return;
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    const gsap = await getGsap();
    gsap.to(buttonRef.current, { x: x * 0.4, y: y * 0.4, duration: 1, ease: "power3.out" });
  };

  const handleMouseLeave = async () => {
    if (!buttonRef.current || disabled) return;
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;
    const gsap = await getGsap();
    gsap.to(buttonRef.current, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
  };

  return (
    <button
      ref={buttonRef}
      className={`${styles.magneticBtn} ${className || ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      type={type}
      form={form}
      disabled={disabled}
      style={{ opacity: disabled ? 0 : 1, pointerEvents: disabled ? 'none' : 'auto' }}
    >
      <span className={styles.btnText}>{children}</span>
    </button>
  );
};

const TrialForm = () => {
  const { user } = useUser();
  const containerRef = useRef<HTMLDivElement>(null);
  const receiptRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const jaggedRef = useRef<SVGSVGElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const renderHashtag = (text: string) => {
    return text.split("").map((char, index) => (
      <span key={index} className={styles.hashChar}>{char}</span>
    ));
  };

  const renderWords = (text: string) => {
    return text.split(" ").map((word, index) => (
      <span key={index} className={styles.wordMask}>
        <span className={styles.helperWord}>{word}</span>
      </span>
    ));
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.from(`.${styles.reveal}`, {
          y: 40,
          opacity: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: { trigger: containerRef.current, start: "top 75%" }
        });

        gsap.from(`.${styles.hashChar}`, {
          opacity: 0,
          y: 20,
          stagger: 0.05,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: { trigger: containerRef.current, start: "top 75%" }
        });

        gsap.from(`.${styles.helperWord}`, {
          y: "120%",
          stagger: 0.03,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: containerRef.current, start: "top 75%" }
        });

        gsap.fromTo(`.${styles.drawnLine} path`,
          { strokeDasharray: 150, strokeDashoffset: 150 },
          {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: "power3.out",
            delay: 0.5,
            scrollTrigger: { trigger: containerRef.current, start: "top 75%" }
          }
        );

        gsap.to(`.${styles.architecturalLine}`, {
          y: 200,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      }, containerRef);

      cleanup = () => ctx.revert();
    })();

    return () => { cancelled = true; if (cleanup) cleanup(); };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitted) return;

    const formData = new FormData(e.currentTarget);
    try {
      setErrorMsg(null);
      const result = await submitTrialAction(formData);
      
      if (result && result.error === "already_booked") {
        setErrorMsg(result.message);
        return;
      }

      setIsSubmitted(true);

      const gsap = await getGsap();
      const tl = gsap.timeline();

      tl.to(jaggedRef.current, { opacity: 1, duration: 0.1 })
        .to(receiptRef.current, {
          boxShadow: "0 40px 100px rgba(0,0,0,0.15), 0 10px 40px rgba(0,0,0,0.1)",
          y: -15,
          rotationZ: 1,
          duration: 0.4,
          ease: "power2.out"
        })
        .to(leftContentRef.current, { opacity: 0, duration: 0.4 }, "<")

        .to(receiptRef.current, {
          y: "150vh",
          rotationZ: -8,
          duration: 1.5,
          ease: "power3.in"
        }, "+=0.2")

        .fromTo(successRef.current,
          { opacity: 0, y: 50, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" },
          "-=0.8"
        );
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to submit trial booking.");
    }
  };

  return (
    <section className={styles.trialSection} ref={containerRef} id="trial">
      
      {/* Unique architectural line separating the space */}
      <div className={styles.architecturalLine}></div>
      
      <div className={styles.grid}>
        {/* Left Column */}
        <div className={styles.leftCol}>
          <div className={styles.leftContent} ref={leftContentRef}>
            <div className={styles.helperTextWrapper}>
              <p className={styles.helperText}>
                {renderWords("No contracts. Just raw discipline. Secure your 3-day access and await further instructions.")}
              </p>
            </div>
            <div className={styles.reveal}>
              <MagneticButton type="submit" form="trial-form" disabled={isSubmitted}>
                 Book a Free Trial
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* Right Column (The Receipt Engine) */}
        <div className={styles.rightCol}>
          
          {/* 1. Hidden Success Message (Revealed when receipt falls) */}
          <div className={styles.successState} ref={successRef}>
             <h2 className={styles.successHeadline}>#LETSFUCKINGGO</h2>
             <p className={styles.successText}>
               Your spot is secured. Confirmation sent to {user?.primaryEmailAddress?.emailAddress || "your email"}. Check your inbox for the next steps. See you on the floor.
             </p>
          </div>

          {/* 2. The Physical Receipt */}
          <div className={styles.receipt} ref={receiptRef}>
            {/* The torn jagged paper edge */}
            <svg className={styles.jaggedEdge} viewBox="0 0 100 10" preserveAspectRatio="none" ref={jaggedRef}>
              <polygon points="0,10 5,0 10,10 15,2 20,10 25,0 30,10 35,3 40,10 45,0 50,10 55,2 60,10 65,0 70,10 75,3 80,10 85,0 90,10 95,2 100,10 100,10 0,10" fill="#ffffff" />
            </svg>

            <div className={styles.receiptInner}>
              <div className={styles.hashtag}>{renderHashtag("#NOEXCUSES")}</div>
              <h2 className={`${styles.headline} ${styles.reveal}`}>
                Elite-tier strength and conditioning for those who <span className={styles.highlightWrapper}>refuse to settle<svg className={styles.drawnLine} viewBox="0 0 100 15" preserveAspectRatio="none"><path d="M2,10 Q40,15 70,5 T98,12" stroke="#ff0000" strokeWidth="2.5" fill="none" strokeLinecap="round" /></svg></span>. Claim your 3-day free trial and begin your journey.
              </h2>
              
              <form id="trial-form" className={styles.cleanForm} onSubmit={handleSubmit}>
                <div className={`${styles.inputGroup} ${styles.reveal}`}>
                  <input type="text" name="fullName" placeholder="Full Name or Username" required className={styles.minimalInput} disabled={isSubmitted} defaultValue={user?.username || user?.fullName || ""} />
                  <div className={styles.inputLine}></div>
                </div>
                <div className={`${styles.inputGroup} ${styles.reveal}`}>
                  <input type="email" name="email" placeholder="Email Address" required className={styles.minimalInput} disabled={isSubmitted} defaultValue={user?.primaryEmailAddress?.emailAddress || ""} />
                  <div className={styles.inputLine}></div>
                </div>
                <div className={`${styles.inputGroup} ${styles.reveal}`}>
                  <input type="tel" name="phoneNumber" placeholder="Phone Number" required className={styles.minimalInput} disabled={isSubmitted} />
                  <div className={styles.inputLine}></div>
                </div>
              </form>
              
              {errorMsg && (
                <div className={styles.errorMessage}>
                  {errorMsg}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TrialForm;
