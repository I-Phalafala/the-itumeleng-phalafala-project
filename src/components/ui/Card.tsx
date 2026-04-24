import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 transition-all duration-300 hover:bg-white/8 hover:border-neonBlue/30 hover:shadow-[0_0_30px_rgba(0,217,255,0.12)] ${className}`}
    >
      {children}
    </div>
  );
}
