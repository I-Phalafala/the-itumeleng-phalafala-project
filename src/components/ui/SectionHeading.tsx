interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-3 bg-gradient-to-r from-neonBlue to-neonPink bg-clip-text text-transparent">
        {title}
      </h2>
      {subtitle && (
        <p className="text-textSecondary text-lg max-w-2xl mx-auto">{subtitle}</p>
      )}
      <div className="mt-4 mx-auto w-20 h-0.5 bg-gradient-to-r from-neonBlue to-neonPink rounded-full" />
    </div>
  );
}
