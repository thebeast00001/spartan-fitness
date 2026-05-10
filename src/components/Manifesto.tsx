"use client";

import { useEffect, useRef } from "react";
import styles from "./Manifesto.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

gsap.registerPlugin(ScrollTrigger);

const manifestoData = [
  {
    id: "01",
    title: "The Iron Cult",
    description: "Welcome to the real underworld. Heavy circles, chalk dust, and ego lifting. Leave your excuses at the door. Learn More",
    src: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "02",
    title: "Cardio Demons",
    description: "Outrun your demons. High-octane engine building that makes you question your life choices but look godly. Learn More",
    src: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "03",
    title: "Aesthetics",
    description: "Because looking massive in an oversized pump cover is half the battle. We sculpt architecture, not just bodies. Learn More",
    src: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop"
  }
];

const Manifesto = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // The container will be pinned.
      // Each item (after the first) will animate up, covering the previous one.
      const items = itemsRef.current;
      if (items.length < 2) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${window.innerHeight * (items.length)}`, // Scroll duration proportional to items
          pin: true,
          scrub: 1,
        }
      });

      const headerHeight = 80; // Height to leave visible

      items.forEach((item, index) => {
        if (index === 0) {
            // First item starts at top, does not move in initially
            gsap.set(item, { zIndex: index, y: 0 });
        } else {
            // Start lower down
            gsap.set(item, { zIndex: index, y: "120%" });
            tl.to(item, {
                y: index * headerHeight, // Stack below the previous headers
                duration: 1,
                ease: "power2.inOut" // Changed from "none" to a smooth curve
            });
        }
      });
      
    });

    return () => ctx.revert();
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <section className={`${styles.manifestoSection} ${inter.className}`} ref={containerRef} id="manifesto">
        <div className={styles.stackContainer}>
          {manifestoData.map((item, index) => (
            <div 
              key={item.id} 
              className={styles.stackItem}
              ref={(el) => { itemsRef.current[index] = el; }}
            >
              <div className={styles.contentGrid}>
                <div className={styles.leftCol}>
                  <span className={styles.idNumber}>{item.id.replace("0", "")}</span>
                  <h2 className={styles.title}>{item.title}</h2>
                </div>
                
                <div className={styles.centerCol}></div>

                <div className={styles.rightCol}>
                  <div className={styles.textContent}>
                    <p className={styles.description}>
                      {item.description.split("Learn More")[0]}
                      <a href="#" className={styles.learnMore}>
                        <span className={styles.arrow}>↳</span> Learn More
                      </a>
                    </p>
                  </div>
                  
                  <div className={styles.mediaContainer}>
                      <div className={styles.mediaHeader}>
                          <span className={styles.mediaCaption}>Protocol — {item.title}</span>
                          <span className={styles.mediaTag}>{item.title}</span>
                      </div>
                      <div className={styles.imageWrapper}>
                        <img src={item.src} alt={item.title} className={styles.image} />
                      </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Manifesto;
