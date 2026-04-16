import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Skill } from "@/types/skill";

function isValidSkill(data: Record<string, unknown>): boolean {
  return (
    typeof data.name === "string" &&
    data.name.trim() !== "" &&
    typeof data.category === "string" &&
    data.category.trim() !== ""
  );
}

export async function getSkills(): Promise<Skill[]> {
  const snapshot = await getDocs(collection(db, "skills"));
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((doc) => isValidSkill(doc as Record<string, unknown>)) as Skill[];
}
