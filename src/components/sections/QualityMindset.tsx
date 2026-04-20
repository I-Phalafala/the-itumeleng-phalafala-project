"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";

interface QualityCard {
  id: string;
  title: string;
  description: string;
  tools: string[];
  icon: React.ReactNode;
}

const FallbackIcon = () => (
  <div
    data-testid="fallback-icon"
    aria-label="Icon placeholder"
    className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center"
  >
    <span className="text-secondary text-xl font-bold">?</span>
  </div>
);

const UITestingIcon = () => (
  <svg
    aria-hidden="true"
    className="w-10 h-10 text-secondary"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <rect x="3" y="3" width="18" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8M12 17v4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 9l3 3 5-5" />
  </svg>
);

const APITestingIcon = () => (
  <svg
    aria-hidden="true"
    className="w-10 h-10 text-secondary"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3M13 15h3" />
    <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AutomationIcon = () => (
  <svg
    aria-hidden="true"
    className="w-10 h-10 text-secondary"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 9A8 8 0 0 0 7.06 5.06M4 15a8 8 0 0 0 12.94 3.94" />
  </svg>
);

const CICDIcon = () => (
  <svg
    aria-hidden="true"
    className="w-10 h-10 text-secondary"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3M12 18v3M3 12h3M18 12h3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.34 6.34l1.42 1.42M16.24 16.24l1.42 1.42M6.34 17.66l1.42-1.42M16.24 7.76l1.42-1.42" />
  </svg>
);

export const QUALITY_CARDS: Omit<QualityCard, "icon">[] = [
  {
    id: "ui-testing",
    title: "UI Testing",
    description:
      "Ensuring pixel-perfect, accessible interfaces by simulating real user interactions across browsers and devices.",
    tools: ["Cypress", "Playwright", "Selenium", "Testing Library"],
  },
  {
    id: "api-testing",
    title: "API Testing",
    description:
      "Validating REST and GraphQL APIs for correctness, security, and performance under various conditions.",
    tools: ["Postman", "REST-assured", "Supertest", "Pact"],
  },
  {
    id: "test-automation",
    title: "Test Automation",
    description:
      "Building maintainable, scalable test suites that catch regressions early and free teams to ship with confidence.",
    tools: ["Jest", "Vitest", "PyTest", "JUnit", "Mocha"],
  },
  {
    id: "ci-cd",
    title: "CI/CD",
    description:
      "Integrating quality gates into delivery pipelines so every commit is automatically verified before it ships.",
    tools: ["GitHub Actions", "Jenkins", "CircleCI", "Docker"],
  },
];

const ICON_MAP: Record<string, React.ReactNode> = {
  "ui-testing": <UITestingIcon />,
  "api-testing": <APITestingIcon />,
  "test-automation": <AutomationIcon />,
  "ci-cd": <CICDIcon />,
};

interface QualityMindsetProps {
  /** Override the default card data; useful for testing. */
  cards?: Omit<QualityCard, "icon">[];
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function QualityMindset({ cards = QUALITY_CARDS }: QualityMindsetProps) {
  return (
    <section id="quality-mindset" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Quality Mindset"
          subtitle="QA engineering expertise that makes every release trustworthy"
        />

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {cards.map((card) => {
            const icon = ICON_MAP[card.id] ?? <FallbackIcon />;
            const title = card.title || "Untitled";

            return (
              <motion.div
                key={card.id}
                variants={cardVariants}
                className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow flex flex-col gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="shrink-0">{icon}</div>
                  <h3 className="text-lg font-semibold font-heading text-primary">
                    {title}
                  </h3>
                </div>

                <p className="text-foreground/70 leading-relaxed text-sm">
                  {card.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto overflow-hidden">
                  {card.tools.map((tool) => (
                    <span
                      key={tool}
                      className="bg-secondary/10 text-secondary text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap max-w-full overflow-hidden text-ellipsis"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
