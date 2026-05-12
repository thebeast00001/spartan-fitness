"use client";

import { useEffect, useRef, useState } from 'react';
import styles from './Testimonials.module.css';

const REVIEWS = [
  { id: 1, text: "I used to be a soft, formless blob. Now I'm a slightly harder, more expensive blob. Thanks Jeff.", name: "Alex Chen", role: "Software Engineer", initials: "AC" },
  { id: 2, text: "My mom finally stopped telling me I look malnourished. That alone is worth the price of admission.", name: "Sarah Jenkins", role: "Graphic Designer", initials: "SJ" },
  { id: 3, text: "I followed the protocol strictly for 6 months. I still can't fly, but I can definitely lift heavier groceries.", name: "Michael T.", role: "Accountant", initials: "MT" },
  { id: 4, text: "Jeff's programs are like dark magic, but with more science and less sacrificing goats. Highly recommend.", name: "David Kim", role: "Marketing Director", initials: "DK" },
  { id: 5, text: "I bought the program so I could eat more pizza without feeling guilty. It worked. 10/10.", name: "Emily R.", role: "Student", initials: "ER" },
  { id: 6, text: "Before this, my primary workout was running away from my responsibilities. Now I lift them.", name: "James Wilson", role: "Entrepreneur", initials: "JW" },
  { id: 7, text: "The app is great, but my favorite part is the existential dread I feel before leg day. Truly character building.", name: "Rachel Adams", role: "Teacher", initials: "RA" },
  { id: 8, text: "I thought 'progressive overload' was a band name. Now I know it's just a fancy word for pain.", name: "Tom Baker", role: "Musician", initials: "TB" },
  { id: 9, text: "I'm not saying this program cured my depression, but it definitely gave me better coping mechanisms than ice cream.", name: "Jessica L.", role: "Nurse", initials: "JL" },
  { id: 10, text: "My t-shirts don't fit anymore. I'm angry about the wardrobe budget, but happy about the biceps.", name: "Kevin Smith", role: "Sales", initials: "KS" },
  { id: 11, text: "I finally understand why gym bros carry those giant jugs of water everywhere. It's a lifestyle.", name: "Amanda P.", role: "Writer", initials: "AP" },
  { id: 12, text: "The science-based approach is cool, but I'm just here so I don't look embarrassing at the beach.", name: "Chris D.", role: "Consultant", initials: "CD" },
  { id: 13, text: "I've replaced my personality entirely with fitness facts. My friends hate me, but my coach is proud.", name: "Laura M.", role: "HR Manager", initials: "LM" },
  { id: 14, text: "I joined the cult. The kool-aid tastes like pre-workout and sweat. No regrets.", name: "Steven G.", role: "Developer", initials: "SG" },
  { id: 15, text: "I paid for the program, so now I'm financially obligated to get swole. It's a flawless system.", name: "Brian K.", role: "Freelancer", initials: "BK" },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [useCssMarquee, setUseCssMarquee] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    // On mobile or reduced-motion use a pure-CSS marquee — no GSAP, no scrub.
    if (reduceMotion || isMobile) {
      setUseCssMarquee(true);
      return;
    }

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      const track = trackRef.current;
      const titleEl = titleRef.current;
      if (!section || !track || !titleEl) return;

      const ctx = gsap.context(() => {
        gsap.fromTo(titleEl,
          { yPercent: 30, opacity: 0 },
          {
            yPercent: -10, opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "top 10%",
              scrub: 1.5,
            }
          }
        );

        const totalWidth = track.scrollWidth;
        const marquee = gsap.to(track, {
          x: () => -(totalWidth / 2),
          ease: "none",
          duration: 50,
          repeat: -1,
          modifiers: {
            x: gsap.utils.unitize((x: string) => parseFloat(x) % (totalWidth / 2))
          }
        });

        gsap.to(marquee, {
          timeScale: 4,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          }
        });

        const cards = track.querySelectorAll(`.${styles.card}`);

        cards.forEach((card, index) => {
          const isEven = index % 2 === 0;
          const rotateDistortion = isEven ? 12 : -15;
          const yDistortion = isEven ? 120 : -80;

          gsap.fromTo(card,
            {
              opacity: 0,
              y: yDistortion,
              rotationZ: rotateDistortion,
              scale: 0.8
            },
            {
              opacity: 1,
              y: 0,
              rotationZ: 0,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top 85%",
                end: "top 30%",
                scrub: 1.5,
              }
            }
          );
        });
      }, section);

      cleanup = () => ctx.revert();
    })();

    return () => { cancelled = true; if (cleanup) cleanup(); };
  }, []);

  return (
    <section className={styles.section} ref={sectionRef} id="testimonials">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title} ref={titleRef}>
            WORDS ON THE STREET.
          </h2>
        </div>

        <div className={styles.marqueeContainer}>
          <div
            className={`${styles.marqueeTrack} ${useCssMarquee ? styles.cssMarquee : ''}`}
            ref={trackRef}
          >
            {[...REVIEWS, ...REVIEWS].map((review, i) => (
              <div key={`${review.id}-${i}`} className={styles.card}>
                <p className={styles.quote}>&quot;{review.text}&quot;</p>

                <div className={styles.author}>
                  <div className={styles.avatarPlaceholder}>
                    {review.initials}
                  </div>
                  <div className={styles.authorInfo}>
                    <h4 className={styles.authorName}>{review.name}</h4>
                    <p className={styles.authorRole}>{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
