"use client";

import { motion } from "framer-motion";
import { profileData } from "@/constants/profile";
import SectionHeading from "@/components/ui/SectionHeading";
import SkillBadge from "@/components/ui/SkillBadge";

export default function Skills() {
  const categories = [
    {
      title: "Languages",
      items: profileData.languages,
      variant: "primary" as const,
    },
    {
      title: "Frameworks & Libraries",
      items: profileData.frameworks,
      variant: "secondary" as const,
    },
    {
      title: "Tools & Platforms",
      items: profileData.tools,
      variant: "accent" as const,
    },
  ];

  return (
    <section id="skills" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Technical Expertise"
          subtitle="Technologies and tools I work with every day"
        />

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-background rounded-xl p-6 border border-gray-100"
            >
              <h3 className="text-lg font-semibold font-heading text-primary mb-4">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <SkillBadge
                    key={item}
                    label={item}
                    variant={category.variant}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
