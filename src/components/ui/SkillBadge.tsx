interface SkillBadgeProps {
  label: string;
  variant?: "primary" | "secondary" | "accent";
}

const variantStyles = {
  primary: "bg-neonBlue/10 text-neonBlue border border-neonBlue/30 hover:bg-neonBlue/20 hover:shadow-[0_0_10px_rgba(0,217,255,0.3)]",
  secondary: "bg-neonPurple/10 text-neonPurple border border-neonPurple/30 hover:bg-neonPurple/20 hover:shadow-[0_0_10px_rgba(139,92,246,0.3)]",
  accent: "bg-neonPink/10 text-neonPink border border-neonPink/30 hover:bg-neonPink/20 hover:shadow-[0_0_10px_rgba(255,46,159,0.3)]",
};

export default function SkillBadge({ label, variant = "primary" }: SkillBadgeProps) {
  return (
    <span
      className={`inline-block px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 cursor-default ${variantStyles[variant]}`}
    >
      {label}
    </span>
  );
}
