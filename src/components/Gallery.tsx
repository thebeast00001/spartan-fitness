"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Gallery.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
    const ctx = gsap.context(() => {
      // 50vh is the height of one image container. Total scroll = (length - 1) * 50vh
      const scrollDistance = (galleryData.length - 1) * window.innerHeight * 0.5;

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        // Multiply scroll length to make it a slow, deliberate scroll experience
        end: `+=${scrollDistance * 3}`, 
        pin: true,
        animation: gsap.to(trackRef.current, {
          y: -scrollDistance,
          ease: "none"
        }),
        scrub: 1,
        onUpdate: (self) => {
          // Determine the active image based on scroll progress
          const index = Math.round(self.progress * (galleryData.length - 1));
          setActiveIndex(index);
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <section className={styles.gallerySection} ref={containerRef} id="gallery">
        {/* Structural Thin Lines */}
        <div className={styles.gridLines}>
          <div className={styles.lineH1}></div>
          <div className={styles.lineH2}></div>
          <div className={styles.lineV1}></div>
          <div className={styles.lineV2}></div>
        </div>

        {/* Left Column: Massive Static Editorial Typography */}
        <div className={styles.leftContent}>
          <h2 className={styles.massiveText}>FACILITY</h2>
        </div>

        {/* Center Column: The Image Track */}
        <div className={styles.centerTrackWrapper}>
          <div className={styles.track} ref={trackRef}>
            {galleryData.map((item, index) => (
              <div 
                key={item.id} 
                className={`${styles.imageContainer} ${activeIndex === index ? styles.active : styles.inactive}`}
              >
                <img src={item.src} alt={item.title} />
              </div>
            ))}
          </div>
        </div>

        {/* Precise Crosshairs matching the grid intersection */}
        <div className={styles.crosshairs}>
          <div className={`${styles.crosshair} ${styles.tl}`}></div>
          <div className={`${styles.crosshair} ${styles.tr}`}></div>
          <div className={`${styles.crosshair} ${styles.bl}`}></div>
          <div className={`${styles.crosshair} ${styles.br}`}></div>
        </div>

        {/* Right Column: Navigation Counter and Labels */}
        <div className={styles.rightContent}>
          
          {/* Horizontal Counter List */}
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

          {/* Vertical Labels List */}
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
