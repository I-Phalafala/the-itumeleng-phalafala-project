"use client";

import { motion } from "framer-motion";
import { profileData } from "@/constants/profile";
import SectionHeading from "@/components/ui/SectionHeading";
import SkillBadge from "@/components/ui/SkillBadge";
import { fadeUp } from "@/lib/animations";

export default function Experience() {
  return (
    <section id="experience" className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Experience"
          subtitle="My professional journey in software development and QA"
        />

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-primary/20" />

          {profileData.experience.map((exp, index) => (
            <motion.div
              key={`${exp.company}-${exp.role}`}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative mb-12 md:w-1/2 ${
                index % 2 === 0
                  ? "md:pr-12 md:ml-0"
                  : "md:pl-12 md:ml-auto"
              }`}
            >
              {/* Timeline dot */}
              <div
                className={`absolute top-2 w-3 h-3 bg-accent rounded-full border-2 border-white shadow left-[10px] md:left-auto ${
                  index % 2 === 0 ? "md:right-[-6.5px]" : "md:left-[-6.5px]"
                }`}
              />

              <div className="ml-10 md:ml-0 bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-wrap items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-primary">
                    {exp.role}
                  </h3>
                  <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
                    {exp.period}
                  </span>
                </div>
                <p className="text-sm font-medium text-secondary mb-1">
                  {exp.company}
                </p>
                <p className="text-xs text-foreground/50 mb-3">
                  {exp.location}
                </p>
                <p className="text-sm text-foreground/70 mb-3">
                  {exp.description}
                </p>

                {exp.highlights.length > 0 && (
                  <ul className="space-y-1.5 mb-4">
                    {exp.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex items-start gap-2 text-sm text-foreground/70"
                      >
                        <span className="text-accent mt-1">&#8226;</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex flex-wrap gap-1.5">
                  {exp.technologies.map((tech) => (
                    <SkillBadge key={tech} label={tech} variant="secondary" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
