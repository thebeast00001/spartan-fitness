import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Your Workout Schedule",
  description: "Build and track your elite custom training regimens with Spartan Fitness. Plan your month for maximum progressive overload.",
};

export default function ScheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
