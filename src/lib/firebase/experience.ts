import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { ExperienceItem } from "@/types/experience";

function isStringArray(value: unknown): boolean {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isValidExperience(data: Record<string, unknown>): boolean {
  return (
    typeof data.company === "string" &&
    data.company.trim() !== "" &&
    typeof data.role === "string" &&
    data.role.trim() !== "" &&
    typeof data.startDate === "string" &&
    (data.endDate === null || typeof data.endDate === "string") &&
    isStringArray(data.impact) &&
    isStringArray(data.techStack)
  );
}

export async function getExperience(): Promise<ExperienceItem[]> {
  const snapshot = await getDocs(collection(db, "experience"));
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((doc) => isValidExperience(doc as Record<string, unknown>)) as ExperienceItem[];
}
