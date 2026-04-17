import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Project } from "@/types/project";
import { ServiceResponse } from "./types";

const COLLECTION = "projects";

/** Fetch all projects ordered by `order` field. */
export async function getProjects(): Promise<ServiceResponse<Project[]>> {
  try {
    const q = query(collection(db, COLLECTION), orderBy("order"));
    const snapshot = await getDocs(q);
    const projects = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Project[];
    return { success: true, data: projects };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch projects",
    };
  }
}

/** Fetch a single project by its slug. Returns `null` data when not found. */
export async function getProjectBySlug(
  slug: string,
): Promise<ServiceResponse<Project | null>> {
  try {
    const q = query(collection(db, COLLECTION), where("slug", "==", slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return { success: true, data: null };
    const d = snapshot.docs[0];
    return { success: true, data: { id: d.id, ...d.data() } as Project };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch project",
    };
  }
}

/** Add a new project document. Returns the new document ID. */
export async function createProject(
  data: Omit<Project, "id">,
): Promise<ServiceResponse<string>> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), data);
    return { success: true, data: docRef.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create project",
    };
  }
}

/** Update an existing project by ID. */
export async function updateProject(
  id: string,
  data: Partial<Omit<Project, "id">>,
): Promise<ServiceResponse<void>> {
  try {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, data);
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update project",
    };
  }
}

/** Delete a project by ID. */
export async function deleteProject(
  id: string,
): Promise<ServiceResponse<void>> {
  try {
    const docRef = doc(db, COLLECTION, id);
    // Verify the document exists before deleting
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      return { success: false, error: `Project with id "${id}" not found` };
    }
    await deleteDoc(docRef);
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete project",
    };
  }
}
