import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Skill } from "@/types/skill";
import { ServiceResponse } from "./types";

const COLLECTION = "skills";

/** Fetch all skills ordered by `order` field. */
export async function getSkills(): Promise<ServiceResponse<Skill[]>> {
  try {
    const q = query(collection(db, COLLECTION), orderBy("order"));
    const snapshot = await getDocs(q);
    const skills = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Skill[];
    return { success: true, data: skills };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch skills",
    };
  }
}

/** Fetch a single skill by ID. Returns `null` data when not found. */
export async function getSkillById(
  id: string,
): Promise<ServiceResponse<Skill | null>> {
  try {
    const docRef = doc(db, COLLECTION, id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return { success: true, data: null };
    return {
      success: true,
      data: { id: snapshot.id, ...snapshot.data() } as Skill,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch skill",
    };
  }
}

/** Add a new skill document. Returns the new document ID. */
export async function createSkill(
  data: Omit<Skill, "id">,
): Promise<ServiceResponse<string>> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), data);
    return { success: true, data: docRef.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create skill",
    };
  }
}

/** Update an existing skill by ID. */
export async function updateSkill(
  id: string,
  data: Partial<Omit<Skill, "id">>,
): Promise<ServiceResponse<void>> {
  try {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, data);
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update skill",
    };
  }
}

/** Delete a skill by ID. */
export async function deleteSkill(
  id: string,
): Promise<ServiceResponse<void>> {
  try {
    const docRef = doc(db, COLLECTION, id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      return { success: false, error: `Skill with id "${id}" not found` };
    }
    await deleteDoc(docRef);
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete skill",
    };
  }
}
