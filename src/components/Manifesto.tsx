"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./Manifesto.module.css";

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
    if (typeof window === "undefined") return;
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

      const ctx = gsap.context(() => {
        const items = itemsRef.current;
        if (items.length < 2) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: `+=${window.innerHeight * (items.length)}`,
            pin: true,
            scrub: 1,
          }
        });

        const headerHeight = 80;

        items.forEach((item, index) => {
          if (index === 0) {
            gsap.set(item, { zIndex: index, y: 0 });
          } else {
            gsap.set(item, { zIndex: index, y: "120%" });
            tl.to(item, {
              y: index * headerHeight,
              duration: 1,
              ease: "power2.inOut"
            });
          }
        });
      });

      cleanup = () => ctx.revert();
    })();

    return () => { cancelled = true; if (cleanup) cleanup(); };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <section className={styles.manifestoSection} ref={containerRef} id="manifesto">
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
                        <Image
                          src={item.src}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 40vw"
                          loading="lazy"
                          quality={75}
                          className={styles.image}
                          style={{ objectFit: "cover" }}
                        />
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
