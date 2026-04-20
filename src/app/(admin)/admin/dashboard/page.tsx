"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

interface DashboardCounts {
  projects: number;
  experience: number;
  skills: number;
}

interface SummaryCardProps {
  title: string;
  count: number;
  loading: boolean;
  icon: React.ReactNode;
}

function SummaryCard({ title, count, loading, icon }: SummaryCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {loading ? (
          <div className="mt-1 h-7 w-12 animate-pulse rounded bg-gray-200" role="status" aria-label={`Loading ${title} count`}>
            <span className="sr-only">Loading…</span>
          </div>
        ) : (
          <p className="text-2xl font-bold text-gray-900" data-testid={`count-${title.toLowerCase().replace(/\s+/g, "-")}`}>
            {count}
          </p>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<DashboardCounts>({ projects: 0, experience: 0, skills: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [projectsSnap, experienceSnap, skillsSnap] = await Promise.all([
          getDocs(collection(db, "projects")),
          getDocs(collection(db, "experience")),
          getDocs(collection(db, "skills")),
        ]);
        setCounts({
          projects: projectsSnap.size,
          experience: experienceSnap.size,
          skills: skillsSnap.size,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard counts. Please check Firestore permissions and network connectivity.", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCounts();
  }, []);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mb-8 text-sm text-gray-500">Welcome back. Here&apos;s an overview of your content.</p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          title="Total Projects"
          count={counts.projects}
          loading={loading}
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
            </svg>
          }
        />
        <SummaryCard
          title="Experience Entries"
          count={counts.experience}
          loading={loading}
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
        <SummaryCard
          title="Total Skills"
          count={counts.skills}
          loading={loading}
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
      </div>
    </div>
  );
}

