"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Metrics.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const metricsData = [
  { id: "01", value: 12000, suffix: "+", label: "HOURS TRAINED", desc: "Relentless monitoring and refinement across our elite member base." },
  { id: "02", value: 94, suffix: "%", label: "CLIENT RETENTION", desc: "Our standard is absolute results. Compromise is not an option." },
  { id: "03", value: 7, suffix: "", label: "ELITE COACHES", desc: "Specialists in biomechanics, hypertrophy, and combat sports." },
  { id: "04", value: 24, suffix: "/7", label: "FACILITY ACCESS", desc: "The arsenal is always open for those who demand it." },
];

const Metrics = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleColRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const radarRing2Ref = useRef<HTMLDivElement>(null);
  const radarLineRef = useRef<HTMLDivElement>(null);

  const [sysTime, setSysTime] = useState("00:00:00:00");

  // Real-time ticking clock for technical aesthetic
  useEffect(() => {
    const interval = setInterval(() => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      const s = String(d.getSeconds()).padStart(2, '0');
      const ms = String(d.getMilliseconds()).padStart(3, '0').substring(0, 2);
      setSysTime(`${h}:${m}:${s}:${ms}`);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. Pin the Left Title Column
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: titleColRef.current,
      });

      // 2. Animate Radar Elements
      gsap.to(radarRing2Ref.current, {
        rotation: 360,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1, 
        }
      });

      // Infinite spinning radar line
      gsap.to(radarLineRef.current, {
        rotation: 360,
        repeat: -1,
        ease: "linear",
        duration: 4
      });

      // 3. Text Reveal
      const titleChars = gsap.utils.toArray(".title-char");
      gsap.fromTo(titleChars, 
        { y: "100%", opacity: 0 },
        { 
          y: "0%", 
          opacity: 1, 
          stagger: 0.05, 
          ease: "power4.out", 
          duration: 1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          }
        }
      );

      // 4. Animate each Card
      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        gsap.fromTo(card,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            }
          }
        );

        const numberElement = card.querySelector(".counter-val");
        if (numberElement) {
          const targetValue = metricsData[i].value;
          const obj = { val: 0 };
          
          gsap.to(obj, {
            val: targetValue,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
            },
            onUpdate: () => {
              numberElement.innerHTML = Math.round(obj.val).toLocaleString();
            }
          });
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.innerWidth < 1024) return;
    cardsRef.current.forEach((card) => {
      if (!card) return;
      const x = (e.clientX - window.innerWidth / 2) * 0.02;
      const y = (e.clientY - window.innerHeight / 2) * 0.02;
      gsap.to(card, { x: x, y: y, duration: 1, ease: "power2.out" });
    });
  };

  const splitText = (text: string) => {
    return text.split("").map((char, index) => (
      <span key={index} className="title-char" style={{ display: "inline-block" }}>
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <section className={styles.metricsSection} ref={containerRef} onMouseMove={handleMouseMove}>
      <div className={styles.contentWrapper}>
        
        {/* Left Pinned Dashboard Column */}
        <div className={styles.titleCol} ref={titleColRef}>
          
          <div className={styles.technicalHeader}>
            <span>NODE // ACTIVE</span>
            <span>SYS.{sysTime}</span>
          </div>

          <div className={styles.massiveVerticalText}>
            SPARTAN
          </div>

          {/* Radar Centerpiece */}
          <div className={styles.radarContainer}>
            <div className={styles.radarRing1}></div>
            <div className={styles.radarRing2} ref={radarRing2Ref}></div>
            <div className={styles.radarRing3}></div>
            <div className={styles.radarLine} ref={radarLineRef}></div>
          </div>
          
          <div className={styles.mainTitleBlock}>
            <h2 className={styles.titleSolid}>
              <div style={{ overflow: "hidden" }}>{splitText("TELEMETRY")}</div>
            </h2>
            <h2 className={styles.titleOutline}>
              <div style={{ overflow: "hidden" }}>{splitText("DATA")}</div>
            </h2>
          </div>

        </div>

        {/* Right Scrollable Cards */}
        <div className={styles.cardsCol}>
          {metricsData.map((metric, i) => (
            <div key={metric.id} className={styles.card} ref={el => { cardsRef.current[i] = el; }}>
              <span className={styles.cardId}>[{metric.id}]</span>
              
              <div className={styles.cardNumberWrapper}>
                <h3 className={`${styles.cardNumber} counter-val`}>0</h3>
                <span className={styles.cardSuffix}>{metric.suffix}</span>
              </div>
              
              <h4 className={styles.cardLabel}>{metric.label}</h4>
              <p className={styles.cardDesc}>{metric.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Metrics;
