"use client";

import { motion } from "framer-motion";
import { ExperienceItem } from "@/types/experience";
import { experienceData } from "@/constants/experience";
import SectionHeading from "@/components/ui/SectionHeading";
import SkillBadge from "@/components/ui/SkillBadge";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Present";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function formatPeriod(startDate: string, endDate: string | null): string {
  return `${formatDate(startDate)} – ${formatDate(endDate)}`;
}

interface TimelineCardProps {
  item: ExperienceItem;
  index: number;
}

function TimelineCard({ item, index }: TimelineCardProps) {
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative mb-12 md:w-1/2 ${
        isLeft ? "md:pr-12 md:ml-0" : "md:pl-12 md:ml-auto"
      }`}
    >
      {/* Timeline dot */}
      <div
        className={`absolute top-2 w-3 h-3 bg-accent rounded-full border-2 border-white shadow left-[10px] md:left-auto ${
          isLeft ? "md:right-[-6.5px]" : "md:left-[-6.5px]"
        }`}
      />

      <div className="ml-10 md:ml-0 bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
        <div className="flex flex-wrap items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-primary">{item.role}</h3>
          <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
            {formatPeriod(item.startDate, item.endDate)}
          </span>
        </div>
        <p className="text-sm font-medium text-secondary mb-3">{item.company}</p>

        {item.impact.length > 0 && (
          <ul className="space-y-1.5 mb-4">
            {item.impact.map((statement) => (
              <li
                key={statement}
                className="flex items-start gap-2 text-sm text-foreground/70"
              >
                <span className="text-accent mt-1">&#8226;</span>
                {statement}
              </li>
            ))}
          </ul>
        )}

        {item.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.techStack.map((tech) => (
              <SkillBadge key={tech} label={tech} variant="secondary" />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Timeline() {
  const entries = experienceData;

  return (
    <section id="experience" className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Experience"
          subtitle="My professional journey in software development and QA"
        />

        {entries.length === 0 ? (
          <p className="text-center text-foreground/60 text-lg">
            No experience entries yet
          </p>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-primary/20" />

            {entries.map((item, index) => (
              <TimelineCard
                key={`${item.company}-${item.role}-${item.startDate}`}
                item={item}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
