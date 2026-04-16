"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import SkillBadge from "@/components/ui/SkillBadge";
import { getSkills } from "@/lib/firebase/skills";
import { Skill } from "@/types/skill";

const BADGE_VARIANTS: Array<"primary" | "secondary" | "accent"> = [
  "primary",
  "secondary",
  "accent",
];

function variantForCategory(
  category: string
): "primary" | "secondary" | "accent" {
  const hash = category
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return BADGE_VARIANTS[hash % BADGE_VARIANTS.length];
}

function groupByCategory(skills: Skill[]): Record<string, Skill[]> {
  return skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});
}

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSkills()
      .then(setSkills)
      .catch((error) => {
        console.error("Failed to fetch skills:", error);
        setSkills([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const grouped = groupByCategory(skills);
  const categories = Object.keys(grouped);

  return (
    <section id="skills" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Technical Expertise"
          subtitle="Technologies and tools I work with every day"
        />

        {loading ? (
          <p className="text-center text-foreground/50">Loading skills…</p>
        ) : categories.length === 0 ? (
          <p className="text-center text-foreground/50">Skills coming soon</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-background rounded-xl p-6 border border-gray-100"
              >
                <h3 className="text-lg font-semibold font-heading text-primary mb-4">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {grouped[category].map((skill) => (
                    <SkillBadge
                      key={skill.id}
                      label={skill.name}
                      variant={variantForCategory(category)}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
