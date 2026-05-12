import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Nav from "@/components/nav/Nav";
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { ui } from '@clerk/ui';
// CustomCursor is already a "use client" component that no-ops on touch
// devices and dynamically imports its heavy inner component on demand.
import CustomCursor from "@/components/CustomCursor";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  preload: true,
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
  weight: ["500", "700"],
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://spartanfitness.com'),
  title: {
    default: "SPARTAN FITNESS | Elite Physical Culture & IFBB Pro Coaching",
    template: "%s | SPARTAN FITNESS"
  },
  description: "Redefining strength and discipline. Elite personal coaching, bodybuilding, and physical culture by IFBB Pro Sanjeev Rajput. Join the Spartan cult.",
  keywords: ["Fitness", "IFBB Pro", "Sanjeev Rajput", "Bodybuilding", "Elite Coaching", "Personal Trainer", "Gym", "Strength Training"],
  authors: [{ name: "Sanjeev Rajput" }],
  creator: "Spartan Fitness",
  publisher: "Spartan Fitness",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "SPARTAN FITNESS | Elite Physical Culture",
    description: "Redefining strength and discipline. Elite personal coaching by IFBB Pro Sanjeev Rajput.",
    url: 'https://spartanfitness.com',
    siteName: 'Spartan Fitness',
    images: [
      {
        url: '/hero_poster.jpg',
        width: 1920,
        height: 1080,
        alt: 'Spartan Fitness Hero Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SPARTAN FITNESS | Elite Physical Culture',
    description: 'Redefining strength and discipline. Elite personal coaching by IFBB Pro Sanjeev Rajput.',
    creator: '@spartanfitness',
    images: ['/hero_poster.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
  viewportFit: "cover",
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HealthAndBeautyBusiness',
  name: 'Spartan Fitness',
  image: 'https://spartanfitness.com/hero_poster.jpg',
  '@id': 'https://spartanfitness.com',
  url: 'https://spartanfitness.com',
  telephone: '+919876543210',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Shop No. 755, Lashwara, Majnu Wala Rd, near Electric Transformer',
    addressLocality: 'Deoband',
    addressRegion: 'Uttar Pradesh',
    postalCode: '247554',
    addressCountry: 'IN'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 29.6974,
    longitude: 77.6834
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ],
    opens: '05:00',
    closes: '22:00'
  },
  sameAs: [
    'https://instagram.com/spartanfitness',
    'https://youtube.com/spartanfitness',
    'https://facebook.com/spartanfitness'
  ]
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
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <Nav />
          <div className="grainOverlay" />
          <CustomCursor />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
