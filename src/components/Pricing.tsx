"use client";

import { useState } from "react";
import styles from "./Pricing.module.css";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const pricingData = [
  {
    id: "01",
    title: "Initiation",
    subtitle: "1 Month Cycle",
    price: "1000",
    billing: "Billed monthly",
    popular: false,
    features: [
      "Full facility access",
      "Standard equipment",
      "Locker room access",
      "No commitments"
    ]
  },
  {
    id: "02",
    title: "Commitment",
    subtitle: "3 Month Cycle",
    price: "2500",
    billing: "Billed quarterly",
    popular: false,
    features: [
      "Full facility access",
      "Standard equipment",
      "Locker room access",
      "1x Personal Training"
    ]
  },
  {
    id: "03",
    title: "Grind",
    subtitle: "6 Month Cycle",
    price: "4500",
    billing: "Billed bi-annually",
    popular: true,
    features: [
      "Full facility access",
      "Priority equipment booking",
      "Locker room access",
      "3x Personal Training",
      "Nutrition Consultation"
    ]
  },
  {
    id: "04",
    title: "Spartan",
    subtitle: "12 Month Cycle",
    price: "7000",
    billing: "Billed annually",
    popular: true,
    features: [
      "Full facility access",
      "Unlimited classes",
      "Premium locker room",
      "Body Composition Analysis",
      "Spartan Merch Pack"
    ]
  },
  {
    id: "05",
    title: "Valkyrie",
    subtitle: "12 Month (Female)",
    price: "6000",
    billing: "Billed annually",
    popular: false,
    features: [
      "Full facility access",
      "Unlimited classes",
      "Premium locker room",
      "Body Composition Analysis",
      "Spartan Merch Pack"
    ]
  },
  {
    id: "06",
    title: "Duo",
    subtitle: "12 Month (Couple)",
    price: "10000",
    billing: "Billed annually",
    popular: false,
    features: [
      "Access for two",
      "Unlimited classes",
      "Premium locker room",
      "Body Composition Analysis",
      "2x Spartan Merch Packs"
    ]
  }
];

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  // Filter plans based on toggle state
  const displayedPlans = isAnnual
    ? [pricingData[3], pricingData[4], pricingData[5]] // 12 Month plans
    : [pricingData[0], pricingData[1], pricingData[2]]; // 1, 3, 6 Month plans

  // Reused optimal Framer Motion engine from Coach page
  const renderAnimatedText = (text: string, indexOffset = 0) => {
    const words = text.split(" ");
    
    const sentenceVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.03,
          delayChildren: indexOffset * 0.03,
        }
      }
    };

    const charVariants = {
      hidden: { y: "100%", rotateX: -90, opacity: 0 },
      visible: { 
        y: "0%", 
        rotateX: 0, 
        opacity: 1,
        transition: {
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
        }
      }
    };

    return (
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sentenceVariants}
        style={{ display: "inline-block" }}
      >
        {words.map((word, wordIndex) => (
          <span key={wordIndex} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {word.split("").map((char, charIndex) => (
              <motion.span
                key={charIndex}
                className={styles.char}
                variants={charVariants}
                style={{ display: "inline-block", transformOrigin: "bottom center" }}
              >
                {char}
              </motion.span>
            ))}
            {wordIndex !== words.length - 1 && <span>&nbsp;</span>}
          </span>
        ))}
      </motion.span>
    );
  };

  return (
    <section className={styles.pricingSection} id="pricing" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
      <div className={styles.grid}>
        
        {/* Left Sidebar 3fr */}
        <div className={styles.sidebar}>
          <div className={styles.header}>
            <h2 className={styles.massiveTitle}>
              {renderAnimatedText("Commit.")}
              <br />
              {renderAnimatedText("Execute.", 10)}
            </h2>
            
            {/* Metadata layout like Coach Page */}
            <div className={styles.metadata}>
              <div className={styles.metadataItem}>
                <span>Currency</span>
                <span>INR</span>
              </div>
              <div className={styles.metadataItem}>
                <span>Access Level</span>
                <span>Global HQ</span>
              </div>
              <div className={styles.metadataItem}>
                <span>Commitment</span>
                <span>Mandatory</span>
              </div>
            </div>

            {/* Brutalist Toggle */}
            <div className={styles.toggleContainer}>
              <motion.div 
                className={styles.toggleGlider}
                animate={{ x: isAnnual ? 120 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
              <button 
                className={`${styles.toggleBtn} ${!isAnnual ? styles.active : ''}`}
                onClick={() => setIsAnnual(false)}
                suppressHydrationWarning
              >
                Short-Term
              </button>
              <button 
                className={`${styles.toggleBtn} ${isAnnual ? styles.active : ''}`}
                onClick={() => setIsAnnual(true)}
                suppressHydrationWarning
              >
                Annual
              </button>
            </div>
          </div>
        </div>

        {/* Right Main 7fr */}
        <div className={styles.pricingGrid}>
          <AnimatePresence mode="popLayout">
            {displayedPlans.map((plan, index) => (
              <motion.div 
                key={plan.id}
                className={styles.card}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                {plan.popular && (
                  <div className={styles.badge}>[ ELITE TIER ]</div>
                )}
                
                <h3 className={styles.cardTitle}>{plan.title}</h3>
                <div className={styles.cardSubtitle}>{plan.subtitle}</div>
                
                <div className={styles.priceWrapper}>
                  <span className={styles.currency}>₹</span>
                  <span className={styles.price}>{plan.price}</span>
                </div>
                <div className={styles.billing}>{plan.billing}</div>
                
                <ul className={styles.featuresList}>
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className={styles.featureItem}>
                      <span className={styles.featureIcon}>+</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link href={`/checkout?plan=${encodeURIComponent(plan.title + " - " + plan.subtitle)}&price=${plan.price}&duration=${parseInt(plan.subtitle.split(" ")[0])}`} style={{ width: '100%' }}>
                  <button className={styles.actionBtn} suppressHydrationWarning>
                    BUY MEMBERSHIP
                  </button>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
