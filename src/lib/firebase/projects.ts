import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import app from "@/lib/firebase/config";
import { Project } from "@/types/project";

const db = getFirestore(app);

function isValidProject(data: Record<string, unknown>): boolean {
  return (
    typeof data.title === "string" &&
    typeof data.slug === "string" &&
    typeof data.description === "string" &&
    Array.isArray(data.tags)
  );
}

export async function getProjects(): Promise<Project[]> {
  const snapshot = await getDocs(collection(db, "projects"));
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((doc) => isValidProject(doc as Record<string, unknown>)) as Project[];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const q = query(collection(db, "projects"), where("slug", "==", slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  const data = { id: doc.id, ...doc.data() };
  return isValidProject(data as Record<string, unknown>) ? (data as Project) : null;
}
