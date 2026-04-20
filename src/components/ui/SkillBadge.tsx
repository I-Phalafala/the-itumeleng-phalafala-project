interface SkillBadgeProps {
  label: string;
  variant?: "primary" | "secondary" | "accent";
}

const variantStyles = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  accent: "bg-accent/20 text-foreground",
};

export default function SkillBadge({ label, variant = "primary" }: SkillBadgeProps) {
  return (
    <span
      className={`inline-block px-3 py-1.5 text-sm font-medium rounded-full ${variantStyles[variant]}`}
    >
      {label}
    </span>
  );
}
