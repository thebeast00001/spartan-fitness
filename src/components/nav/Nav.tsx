"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./Nav.module.css";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

const NAV_LINKS = [
  { name: "JOIN THE CULT", href: "/#trial" },
  { name: "PRICING", href: "/#pricing" },
  { name: "CREATE YOUR WORKOUT", href: "/schedule" },
  { name: "BOOK A FREE TRIAL", href: "/trial" },
  { name: "LEARN FROM THE BEST", href: "/coach" },
];

const SUB_LINKS = [
  { name: "Privacy Policy", href: "#" },
  { name: "Terms of Service", href: "#" },
];

// Removed exceptionally wide (W, M) and narrow (I, 1) characters to stabilize layout width during scramble
const CHARS = "ABCDEFGHJKLNOPQRSTUVXYZ023456789";

const ScrambleText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<any>(null);

  const handleMouseEnter = () => {
    let iteration = 0;
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(text.split("").map((letter, index) => {
        if (index < iteration) {
          return text[index];
        }
        // Preserve spaces perfectly
        if (letter === " ") return " ";
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join(""));

      if (iteration >= text.length) {
        clearInterval(intervalRef.current);
        setDisplayText(text); // Ensure final exact match
      }

      iteration += 1; // Faster step to prevent lag loop on long text
    }, 20);
  };

  const handleMouseLeave = () => {
    clearInterval(intervalRef.current);
    setDisplayText(text);
  };

  return (
    <span 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
      className={styles.scrambleText}
      data-text={text}
    >
      {displayText}
    </span>
  );
};

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        window.matchMedia("(pointer: coarse)").matches || 
        "ontouchstart" in window || 
        navigator.maxTouchPoints > 0
      );
    };
    checkTouch();
    window.addEventListener("resize", checkTouch);
    return () => window.removeEventListener("resize", checkTouch);
  }, []);
  const { isSignedIn } = useAuth();
  const pathname = usePathname();

  if (pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up")) {
    return null;
  }
  
  // Framer Motion Variants for the Menu Overlay Background
  const menuVariants: any = {
    closed: {
      clipPath: "circle(0px at 50% 40px)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        duration: 0.8
      }
    },
    open: {
      clipPath: "circle(150% at 50% 40px)",
      transition: {
        type: "spring",
        stiffness: 20,
        restDelta: 2,
        duration: 0.8
      }
    }
  };

  // Staggered Text Reveal Variants
  const textContainerVariants: any = {
    closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
    open: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } }
  };

  const textItemVariants: any = {
    closed: { y: 50, opacity: 0, transition: { duration: 0.4, ease: "easeOut" } },
    open: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className={`${styles.navWrapper} ${isOpen ? styles.open : ""} ${inter.className}`}>
      
      {/* Floating Pill Trigger */}
      <div className={styles.pillContainer}>
        <button 
          className={styles.pillBtn} 
          onClick={() => setIsOpen(!isOpen)}
          suppressHydrationWarning
        >
          <div className={styles.iconWrapper}>
            <AnimatePresence mode="wait">
              {!isOpen ? (
                <motion.svg 
                  key="menu"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </motion.svg>
              ) : (
                <motion.svg 
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </motion.svg>
              )}
            </AnimatePresence>
          </div>
          <motion.span 
            className={styles.btnText}
            key={isOpen ? "close" : "menu"}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? "Close" : "Menu"}
          </motion.span>
        </button>

        <Link href="/" className={styles.navLogo} style={{ textDecoration: 'none' }}>
          SPARTAN FITNESS
        </Link>
        <div style={{ paddingLeft: '15px', borderLeft: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', height: '24px' }}>
          {isSignedIn ? (
            <UserButton showName appearance={{ elements: { userButtonOuterIdentifier: { color: "white", marginLeft: "10px", fontSize: "14px", fontFamily: "var(--font-space)" }, userButtonBox: { height: '24px' }, userButtonAvatarBox: { width: '24px', height: '24px' } } }} />
          ) : (
            <Link href="/sign-in" className={styles.signInLink} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* Full Screen Menu Overlay */}
      <motion.div 
        className={styles.menuOverlay}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={menuVariants}
      >
        <div className={styles.menuContent}>
          
          <div className={styles.linksContainer}>
            <motion.div 
              className={styles.mainLinks}
              variants={textContainerVariants}
              initial="closed"
              animate={isOpen ? "open" : "closed"}
            >
              {NAV_LINKS.map((link, i) => (
                <motion.div key={i} variants={textItemVariants} className={styles.linkWrapper}>
                  <Link 
                    href={link.href} 
                    className={styles.mainLink} 
                    onClick={(e) => {
                      setIsOpen(false);
                      if (link.href.startsWith("/#") && window.location.pathname === "/") {
                        e.preventDefault();
                        const targetId = link.href.replace("/#", "");
                        const element = document.getElementById(targetId);
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                          window.history.pushState({}, '', link.href);
                        }
                      }
                    }}
                  >
                    <ScrambleText text={link.name} />
                  </Link>
                </motion.div>
              ))}

              {isSignedIn ? (
                <motion.div variants={textItemVariants} className={styles.linkWrapper} style={{ marginTop: '20px' }}>
                  <UserButton showName appearance={{ elements: { userButtonOuterIdentifier: { color: "white", marginLeft: "15px", fontSize: "24px", fontFamily: "var(--font-space)" }, userButtonBox: { height: '48px' }, userButtonAvatarBox: { width: '48px', height: '48px' } } }} />
                </motion.div>
              ) : (
                <motion.div variants={textItemVariants} className={styles.linkWrapper}>
                  <Link href="/sign-in" className={styles.mainLink} onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '15px', textDecoration: 'none' }}>
                    <ScrambleText text="SIGN IN / SIGN UP" />
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '5px' }}>
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                      <polyline points="10 17 15 12 10 7"></polyline>
                      <line x1="15" y1="12" x2="3" y2="12"></line>
                    </svg>
                  </Link>
                </motion.div>
              )}

            </motion.div>
          </div>

          <div className={styles.mediaContainer}>
            {isOpen && (
              <>
                <div className={styles.menuVideoWrapper}>
                  <video 
                    className={styles.menuVideo} 
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    src="/vid_001.mp4"
                    style={{ backgroundColor: '#111' }}
                  />
                </div>
                <div className={styles.menuVideoWrapper}>
                  <video 
                    className={styles.menuVideo} 
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    src="/vid_002.mp4"
                    style={{ backgroundColor: '#111' }}
                  />
                </div>
              </>
            )}
          </div>

        </div>
      </motion.div>
    </div>
  );
}
