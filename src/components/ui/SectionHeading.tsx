interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl sm:text-4xl font-bold font-heading text-primary mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-secondary text-lg max-w-2xl mx-auto">{subtitle}</p>
      )}
      <div className="mt-4 mx-auto w-20 h-1 bg-accent rounded-full" />
    </div>
  );
}
