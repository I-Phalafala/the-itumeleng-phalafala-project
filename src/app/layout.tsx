import type { Metadata } from "next";
import "./globals.css";
import BackgroundFX from "@/components/ui/BackgroundFX";
import SmoothScrollProvider from "@/components/ui/SmoothScrollProvider";

export const metadata: Metadata = {
  title: "Itumeleng Phalafala | QA Engineer & Developer",
  description:
    "Portfolio of Itumeleng Phalafala — Quality Assurance Engineer with 6+ years of experience in manual and automated testing, CI/CD, and software development.",
  keywords: [
    "QA Engineer",
    "Quality Assurance",
    "Test Automation",
    "Software Developer",
    "Itumeleng Phalafala",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-bg text-textPrimary antialiased min-h-screen">
        <SmoothScrollProvider>
          <BackgroundFX />
          <div className="relative isolate min-h-screen">
            {children}
          </div>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
