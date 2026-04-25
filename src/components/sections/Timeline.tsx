"use client";

import { motion } from "framer-motion";
import { ExperienceItem } from "@/types/experience";
import { experienceData } from "@/constants/experience";
import SectionHeading from "@/components/ui/SectionHeading";
import SkillBadge from "@/components/ui/SkillBadge";
import { timelineCardLeft, timelineCardRight, timelineLineReveal } from "@/lib/animations";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Present";
  const date = new Date(`${dateStr}T00:00:00Z`);
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
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
      variants={isLeft ? timelineCardLeft : timelineCardRight}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className={`relative mb-12 md:w-1/2 ${
        isLeft ? "md:pr-12 md:ml-0" : "md:pl-12 md:ml-auto"
      }`}
    >
      {/* Timeline dot */}
      <div
        className={`absolute top-3 w-4 h-4 rounded-full border-2 border-neonBlue shadow left-[8px] md:left-auto ${
          isLeft ? "md:right-[-8px]" : "md:left-[-8px]"
        }`}
        style={{
          background: "linear-gradient(135deg, #00D9FF, #8B5CF6)",
          boxShadow: "0 0 10px rgba(0,217,255,0.7), 0 0 20px rgba(0,217,255,0.3)",
        }}
      />

      <div className="ml-10 md:ml-0 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 transition-all duration-300 hover:border-neonBlue/30 hover:shadow-[0_0_25px_rgba(0,217,255,0.1)] hover:bg-white/8">
        <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
          <h3 className="text-lg font-bold text-textPrimary">{item.role}</h3>
          <span className="text-xs font-medium text-neonBlue bg-neonBlue/10 border border-neonBlue/20 px-2 py-1 rounded-full">
            {formatPeriod(item.startDate, item.endDate)}
          </span>
        </div>
        <p className="text-sm font-medium text-neonPurple mb-3">{item.company}</p>

        {item.impact.length > 0 && (
          <ul className="space-y-1.5 mb-4">
            {item.impact.map((statement) => (
              <li
                key={statement}
                className="flex items-start gap-2 text-sm text-textSecondary"
              >
                <span className="text-neonPink mt-1 flex-shrink-0">&#8226;</span>
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
    <section id="experience" className="py-20 section-bg-alt">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Experience"
          subtitle="My professional journey in software development and QA"
        />

        {entries.length === 0 ? (
          <p className="text-center text-textSecondary text-lg">
            No experience entries yet
          </p>
        ) : (
          <div className="relative">
            {/* Animated timeline line */}
            <motion.div
              className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 timeline-line-glow"
              variants={timelineLineReveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
            />

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
