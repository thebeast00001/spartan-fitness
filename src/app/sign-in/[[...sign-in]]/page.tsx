"use client";

import { SignIn } from "@clerk/nextjs";
import { Inter, Space_Grotesk } from "next/font/google";
import Link from "next/link";
import styles from "../../auth.module.css";

const inter = Inter({ subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export default function SignInPage() {
  return (
    <div className={`${styles.authContainer} ${inter.className}`}>
      
      <Link href="/" className={styles.backButton}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>Return to Base</span>
      </Link>

      <div className={styles.authCard}>
        
        {/* LEFT COLUMN - VISUALS */}
        <div className={styles.leftColumn}>
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className={styles.videoBg}
            src="/vid_001.mp4"
          />
          <div className="grainOverlay" />
          
          <div className={styles.leftContent}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e31b23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '40px' }}>
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
          </div>

          <div className={styles.leftContent}>
            <p className={styles.subtitle}>You are entering</p>
            <h1 className={styles.title}>
              The ultimate hub <br/>for discipline and <br/><span className={styles.highlight}>raw power.</span>
            </h1>
          </div>
        </div>

        {/* RIGHT COLUMN - AUTH FORM */}
        <div className={styles.rightColumn}>
          <div className={styles.formWrapper}>
            <SignIn 
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              appearance={{
                elements: {
                  card: {
                    border: "none",
                    boxShadow: "none",
                    background: "transparent",
                    padding: 0,
                    margin: 0,
                  },
                  cardBox: {
                    boxShadow: "none",
                  },
                  headerTitle: {
                    fontSize: "2rem",
                  },
                  headerSubtitle: {
                    fontSize: "0.85rem",
                    lineHeight: "1.5",
                    marginBottom: "1.5rem",
                  },
                  socialButtonsBlockButton: {
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.02)",
                  },
                  formFieldInput: {
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    "&:focus": {
                      border: "1px solid #e31b23",
                    }
                  }
                }
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
