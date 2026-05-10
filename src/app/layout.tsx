import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Nav from "@/components/nav/Nav";
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { ui } from '@clerk/ui';
import CustomCursor from "@/components/CustomCursor";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"], 
  variable: "--font-space" 
});

export const metadata: Metadata = {
  title: "SPARTAN | Elite Physical Culture",
  description: "Redefining strength and discipline. Personal coaching by IFBB Pro Sanjeev Rajput.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      ui={ui}
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#e31b23",
          colorBackground: "#111111", // Slightly lighter than pure black to stand out
          colorInputBackground: "#1a1a1a",
          colorInputText: "#ffffff",
          colorText: "#ffffff",
          colorTextSecondary: "#a0a0a0",
          fontFamily: "var(--font-inter)",
          borderRadius: "0px",
          colorDanger: "#e31b23",
        },
        elements: {
          cardBox: {
            boxShadow: "0 40px 100px rgba(0,0,0,1)",
            borderRadius: "0px",
          },
          card: {
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "0px",
            padding: "2rem",
          },
          headerTitle: {
            fontFamily: "var(--font-space)",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontSize: "1.8rem",
            color: "#ffffff",
          },
          headerSubtitle: {
            color: "#a0a0a0",
            textTransform: "uppercase",
            fontSize: "0.75rem",
            letterSpacing: "0.1em",
            marginTop: "0.5rem",
          },
          formButtonPrimary: {
            backgroundColor: "#e31b23",
            border: "1px solid #e31b23",
            color: "#ffffff",
            fontFamily: "var(--font-space)",
            fontWeight: "bold",
            fontSize: "0.95rem",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            padding: "1.2rem 1rem",
            transition: "all 0.3s ease",
            borderRadius: "0px",
            "&:hover": {
              backgroundColor: "#ff333a",
              borderColor: "#ff333a",
              transform: "translateY(-2px)",
              boxShadow: "0 10px 20px rgba(227, 27, 35, 0.4)",
            },
          },
          formFieldInput: {
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "0px",
            padding: "1rem",
            backgroundColor: "#1a1a1a",
            color: "#ffffff",
            fontSize: "1rem",
            transition: "border-color 0.3s ease",
            "&:focus": {
              border: "1px solid #e31b23",
              outline: "none",
              boxShadow: "none",
            },
          },
          formFieldLabel: {
            color: "#a0a0a0",
            textTransform: "uppercase",
            fontSize: "0.7rem",
            letterSpacing: "0.1em",
            marginBottom: "0.4rem",
            fontFamily: "var(--font-space)",
          },
          socialButtonsBlockButton: {
            border: "1px solid rgba(255,255,255,0.2)",
            backgroundColor: "#1a1a1a",
            borderRadius: "0px",
            color: "#ffffff",
            fontFamily: "var(--font-inter)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            fontSize: "0.8rem",
            padding: "1rem",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.4)",
            },
          },
          socialButtonsProviderIcon: {
            filter: "brightness(0) invert(1)",
          },
          dividerLine: {
            background: "rgba(255,255,255,0.2)",
          },
          dividerText: {
            color: "#a0a0a0",
            textTransform: "uppercase",
            fontSize: "0.7rem",
            letterSpacing: "0.1em",
          },
          footerActionLink: {
            color: "#e31b23",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            "&:hover": {
              color: "#ff333a",
            },
          },
          identityPreviewText: {
            color: "#ffffff",
          },
          identityPreviewEditButtonIcon: {
            color: "#e31b23",
          },
          logoBox: {
            display: "none",
          },
          profileSectionTitleText: {
             fontFamily: "var(--font-space)",
             textTransform: "uppercase",
             color: "#ffffff",
          }
        },
      }}
    >
      <html lang="en">
        <body className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
          <Nav />
          <div className="grainOverlay" />
          <CustomCursor />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
