import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="scroll-smooth">
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
