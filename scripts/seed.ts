/**
 * Firestore Seed Script
 *
 * Seeds the Firestore database with initial data for:
 * - projects (3 documents)
 * - experience (3 documents)
 * - skills (3 documents)
 *
 * Usage:
 *   1. Ensure Firebase environment variables are set in .env.local
 *   2. Run: npx ts-node --compiler-options '{"module":"commonjs"}' scripts/seed.ts
 *
 * Or add seed data manually via the Firebase Console using the
 * document shapes defined below.
 */

import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

// Load environment variables in Node.js context
// eslint-disable-next-line @typescript-eslint/no-require-imports
require("dotenv").config({ path: ".env.local" });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ─── Seed Data ───────────────────────────────────────────────

const projectsSeed = [
  {
    slug: "portfolio-website",
    title: "Portfolio Website",
    description:
      "A personal portfolio built with Next.js, TypeScript, Tailwind CSS, and Firebase to showcase projects and experience.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase"],
    role: "Full-Stack Developer",
    problemStatement: "Needed a modern, performant portfolio to present work and skills.",
    solution:
      "Built a server-rendered Next.js app backed by Firestore for dynamic content management.",
    testingApproach: "Unit tests with Jest and React Testing Library; linting with ESLint.",
    imageUrl: "",
    tags: ["Next.js", "TypeScript", "Firebase"],
    order: 1,
  },
  {
    slug: "ci-cd-dashboard",
    title: "CI/CD Dashboard",
    description:
      "A real-time dashboard for monitoring CI/CD pipeline status across multiple projects.",
    techStack: ["React", "Node.js", "WebSocket", "Jenkins API"],
    role: "Lead Frontend Developer",
    problemStatement:
      "Engineering teams lacked visibility into pipeline health across repositories.",
    solution:
      "Created a WebSocket-powered React dashboard consuming Jenkins and GitHub Actions APIs.",
    testingApproach: "Cypress E2E tests and Jest unit tests with mocked API responses.",
    imageUrl: "",
    tags: ["React", "Node.js", "CI/CD"],
    order: 2,
  },
  {
    slug: "erp-testing-framework",
    title: "ERP Testing Framework",
    description:
      "An automated testing framework for validating ERP modules including supply chain and accounting.",
    techStack: ["C#", ".NET", "Selenium", "xUnit"],
    role: "Test Automation Engineer",
    problemStatement:
      "Manual regression testing of ERP modules was time-consuming and error-prone.",
    solution:
      "Developed a modular test framework using Selenium and xUnit to automate critical workflows.",
    testingApproach: "Data-driven tests with parameterised xUnit test cases.",
    imageUrl: "",
    tags: ["C#", ".NET", "Selenium"],
    order: 3,
  },
];

const experienceSeed = [
  {
    company: "Mobisys GmbH",
    role: "Test Automation Engineer",
    startDate: "2025-03-01",
    endDate: null,
    impact: [
      "Developed and maintained automated test suites using TypeScript, WebdriverIO, Cucumber, and Mocha",
      "Performed manual functional and regression testing across web and mobile interfaces",
    ],
    techStack: ["TypeScript", "WebdriverIO", "Cucumber", "Mocha", "BrowserStack"],
    order: 1,
  },
  {
    company: "LexisNexis",
    role: "Quality Test Engineer III",
    startDate: "2022-04-01",
    endDate: "2024-03-01",
    impact: [
      "Collaborated with engineering and product teams to reduce production defects by 30%",
      "Led the implementation of a CI/CD pipeline integrating automated tests",
    ],
    techStack: ["Cypress", "Selenium", "Cucumber", "Jenkins", "Azure DevOps", "C#"],
    order: 2,
  },
  {
    company: "SYSPRO Africa",
    role: "Junior Developer",
    startDate: "2020-01-01",
    endDate: "2021-09-01",
    impact: [
      "Developed solutions to extend functionality of the standard ERP solution",
      "Performed requirements analysis, architecture design, coding, testing and deployment",
    ],
    techStack: [".NET", "ASP.NET", "C#", "VBScript", "DevOps"],
    order: 3,
  },
];

const skillsSeed = [
  {
    name: "TypeScript",
    category: "Languages",
    order: 1,
  },
  {
    name: "React",
    category: "Frameworks",
    order: 2,
  },
  {
    name: "Cypress",
    category: "Testing",
    order: 3,
  },
];

// ─── Seed Runner ─────────────────────────────────────────────

async function seed() {
  console.log("🌱 Seeding Firestore collections...\n");

  for (const [index, data] of projectsSeed.entries()) {
    const ref = doc(collection(db, "projects"));
    await setDoc(ref, data);
    console.log(`  ✅ projects/${ref.id} (${index + 1}/${projectsSeed.length})`);
  }

  for (const [index, data] of experienceSeed.entries()) {
    const ref = doc(collection(db, "experience"));
    await setDoc(ref, data);
    console.log(`  ✅ experience/${ref.id} (${index + 1}/${experienceSeed.length})`);
  }

  for (const [index, data] of skillsSeed.entries()) {
    const ref = doc(collection(db, "skills"));
    await setDoc(ref, data);
    console.log(`  ✅ skills/${ref.id} (${index + 1}/${skillsSeed.length})`);
  }

  console.log("\n🎉 Seeding complete!");
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
