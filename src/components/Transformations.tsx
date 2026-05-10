"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import styles from './Transformations.module.css';

gsap.registerPlugin(ScrollTrigger);

const TRANSFORMATIONS = [
  { id: 1, image: "/t1.jpg", title: "Marcus T", project: "Lean Hypertrophy", date: "08/14", type: "Fat Loss" },
  { id: 2, image: "/t2.jpg", title: "Sarah L", project: "Full Prep", date: "02/28", type: "Powerlifting" },
  { id: 3, image: "/t3.jpg", title: "David K", project: "Recomposition", date: "05/12", type: "Strength" },
  { id: 4, image: "/t4.jpg", title: "Elena R", project: "Cutting Phase", date: "11/04", type: "Aesthetics" },
  { id: 5, image: "/t5.jpg", title: "James C", project: "Mass Building", date: "09/30", type: "Hypertrophy" },
];

export default function Transformations() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    // Awwwards-style Horizontal Scroll Effect
    const getScrollAmount = () => {
      let containerWidth = container.scrollWidth;
      return -(containerWidth - window.innerWidth);
    };

    gsap.to(container, {
      x: getScrollAmount,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${getScrollAmount() * -1}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section className={styles.section} ref={sectionRef} id="transformations">
      <div className={styles.sliderContainer}>
        <div className={styles.slider} ref={containerRef}>
          {TRANSFORMATIONS.map((t, i) => (
            <div key={t.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image 
                  src={t.image} 
                  alt={`${t.title} Transformation`} 
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 80vw, 40vw"
                />
              </div>
              
              {/* Exact Magazine Style Overlay from the Image Reference */}
              <div className={styles.overlayText}>
                <div className={styles.headerRow}>
                  <div className={styles.leftCol}>
                    <p className={styles.smallText}>{t.date.split('/')[1]} August 2024</p>
                  </div>
                  <div className={styles.rightCol}>
                    <p className={styles.smallText}>Coach: Jeff Nippard</p>
                    <p className={styles.smallText}>Type: {t.type}</p>
                    <p className={styles.smallText}>Focus: Discipline</p>
                    <br />
                    <p className={styles.smallText}>spartan-fitness.com</p>
                  </div>
                </div>
                
                <div className={styles.middleRow}>
                  <h3 className={styles.mainTitle}>{t.title}</h3>
                  <h3 className={styles.subTitle}>{t.project}</h3>
                  <h3 className={styles.dateNumber}>{t.date}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
