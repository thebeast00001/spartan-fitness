import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sanjeev Rajput | IFBB Pro & Elite Coach",
  description: "Train with IFBB Pro Sanjeev Rajput. Over 15 years of elite physical conditioning, transforming athletes into champions. Based in India.",
  openGraph: {
    title: "Sanjeev Rajput | IFBB Pro & Elite Coach",
    description: "Train with IFBB Pro Sanjeev Rajput. Over 15 years of elite physical conditioning.",
    images: [{ url: "/jeff.png" }],
  },
};

export default function CoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
