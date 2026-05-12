"use client";

import Link from "next/link";
import SmoothScroll from "@/components/SmoothScroll";

export default function WorkoutPage() {
  return (
    <SmoothScroll>
      <main style={{ backgroundColor: "#000", color: "#fff", minHeight: "100vh" }}>

        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "20vh",
          paddingBottom: "10vh",
          textAlign: "center",
          fontFamily: "var(--font-space)"
        }}>
          <h1 style={{ fontSize: "clamp(3rem, 8vw, 6rem)", textTransform: "uppercase", lineHeight: 0.9, marginBottom: "2rem" }}>
            CREATE YOUR WORKOUT
          </h1>
          <p style={{ fontSize: "1.2rem", maxWidth: "600px", opacity: 0.8, marginBottom: "4rem" }}>
            The infrastructure for building custom elite training regimens is currently under construction.
          </p>
          <Link
            href="/"
            style={{
              border: "1px solid rgba(255,255,255,0.3)",
              padding: "1rem 3rem",
              borderRadius: "30px",
              textDecoration: "none",
              color: "#fff",
              transition: "all 0.3s ease",
            }}
          >
            RETURN TO BASE
          </Link>
        </div>
      </main>
    </SmoothScroll>
  );
}
