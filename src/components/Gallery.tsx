"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Gallery.module.css";

const galleryData = [
  {
    id: "01",
    title: "ARSENAL",
    src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "02",
    title: "WEIGHTS",
    src: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "03",
    title: "CARDIO",
    src: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "04",
    title: "TURF",
    src: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop"
  }
];

const Gallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (reduceMotion || isMobile) return; // mobile uses native scroll instead of pin+scrub

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
        const scrollDistance = (galleryData.length - 1) * window.innerHeight * 0.5;

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: `+=${scrollDistance * 3}`,
          pin: true,
          animation: gsap.to(trackRef.current, {
            y: -scrollDistance,
            ease: "none"
          }),
          scrub: 1,
          onUpdate: (self) => {
            const index = Math.round(self.progress * (galleryData.length - 1));
            setActiveIndex(index);
          }
        });
      });

      cleanup = () => ctx.revert();
    })();

    return () => { cancelled = true; if (cleanup) cleanup(); };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <section className={styles.gallerySection} ref={containerRef} id="gallery">
        <div className={styles.gridLines}>
          <div className={styles.lineH1}></div>
          <div className={styles.lineH2}></div>
          <div className={styles.lineV1}></div>
          <div className={styles.lineV2}></div>
        </div>

        <div className={styles.leftContent}>
          <h2 className={styles.massiveText}>FACILITY</h2>
        </div>

        <div className={styles.centerTrackWrapper}>
          <div className={styles.track} ref={trackRef}>
            {galleryData.map((item, index) => (
              <div
                key={item.id}
                className={`${styles.imageContainer} ${activeIndex === index ? styles.active : styles.inactive}`}
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 90vw, 50vw"
                  loading={index === 0 ? "eager" : "lazy"}
                  quality={75}
                  style={{ objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.crosshairs}>
          <div className={`${styles.crosshair} ${styles.tl}`}></div>
          <div className={`${styles.crosshair} ${styles.tr}`}></div>
          <div className={`${styles.crosshair} ${styles.bl}`}></div>
          <div className={`${styles.crosshair} ${styles.br}`}></div>
        </div>

        <div className={styles.rightContent}>
          <div className={styles.counterContainer}>
            {galleryData.map((item, index) => (
              <span
                key={`count-${index}`}
                className={`${styles.counterItem} ${activeIndex === index ? styles.active : ''}`}
              >
                {index + 1}
              </span>
            ))}
          </div>

          <div className={styles.labelsContainer}>
            {galleryData.map((item, index) => (
              <span
                key={`label-${index}`}
                className={`${styles.labelItem} ${activeIndex === index ? styles.active : ''}`}
              >
                {item.title}
              </span>
            ))}
          </div>
        </div>

      </section>
    </div>
  );
};

export default Gallery;
