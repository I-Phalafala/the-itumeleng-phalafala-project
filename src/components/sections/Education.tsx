"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profileData } from "@/constants/profile";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import {
  staggerContainer,
  fadeInLeft,
  fadeInRight,
  accordionReveal,
} from "@/lib/animations";

function PanelToggle({
  title,
  accentClass,
  isOpen,
  onClick,
}: {
  title: string;
  accentClass: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 text-left"
      aria-expanded={isOpen}
    >
      <span className={`text-xl font-semibold font-heading ${accentClass}`}>{title}</span>
      <span
        className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-textSecondary transition-transform duration-300 ${
          isOpen ? "rotate-180" : ""
        }`}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </button>
  );
}

export default function Education() {
  const { education, certificates } = profileData;
  const [openPanel, setOpenPanel] = useState<"education" | "certifications" | null>("education");

  return (
    <section id="education" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Education & Certifications"
          subtitle="Academic background and professional credentials"
        />

        <motion.div
          className="grid lg:grid-cols-2 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {/* Education */}
          <motion.div variants={fadeInLeft}>
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-neonBlue/10 border border-neonBlue/30 rounded-lg flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-neonBlue"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                    />
                  </svg>
                </div>
              </div>
              <PanelToggle
                title="Education"
                accentClass="text-neonBlue"
                isOpen={openPanel === "education"}
                onClick={() => setOpenPanel((current) => (
                  current === "education" ? null : "education"
                ))}
              />
              <AnimatePresence initial={false}>
                {openPanel === "education" && (
                  <motion.div
                    key="education-panel"
                    variants={accordionReveal}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className="overflow-hidden pt-5"
                  >
                    <h4 className="text-lg font-medium text-textPrimary mb-1">
                      {education.degree}
                    </h4>
                    <p className="text-neonPurple font-medium mb-1">
                      {education.institution}
                    </p>
                    <p className="text-sm text-textSecondary mb-4">
                      {education.location} &middot; {education.level}
                    </p>
                    <div>
                      <p className="text-sm font-medium text-textSecondary mb-2">
                        Coursework:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {education.coursework.map((course) => (
                          <span
                            key={course}
                            className="text-xs bg-neonBlue/5 text-neonBlue/80 border border-neonBlue/20 px-2 py-1 rounded"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          {/* Certifications */}
          <motion.div variants={fadeInRight}>
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-neonPink/10 border border-neonPink/30 rounded-lg flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-neonPink"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
              </div>
              <PanelToggle
                title="Certifications"
                accentClass="text-neonPink"
                isOpen={openPanel === "certifications"}
                onClick={() => setOpenPanel((current) => (
                  current === "certifications" ? null : "certifications"
                ))}
              />
              <AnimatePresence initial={false}>
                {openPanel === "certifications" && (
                  <motion.div
                    key="certifications-panel"
                    variants={accordionReveal}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className="max-h-96 overflow-hidden pt-5"
                  >
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                      {certificates.map((cert) => (
                        <div
                          key={cert.name}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors duration-200"
                        >
                          <span className="flex-shrink-0 w-12 text-center text-xs font-bold text-neonPink bg-neonPink/10 border border-neonPink/20 py-1 rounded">
                            {cert.year}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-textPrimary">
                              {cert.name}
                            </p>
                            <p className="text-xs text-textSecondary">{cert.issuer}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
