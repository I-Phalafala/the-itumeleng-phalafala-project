import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "@/lib/firebase/config";
import { Project } from "@/types/project";

const db = getFirestore(app);

export async function getProjects(): Promise<Project[]> {
  const snapshot = await getDocs(collection(db, "projects"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Project[];
}
