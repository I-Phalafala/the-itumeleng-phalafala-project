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
import { ExperienceItem } from "@/types/experience";
import { ServiceResponse } from "./types";

const COLLECTION = "experience";

/** Fetch all experience items ordered by `order` field. */
export async function getExperience(): Promise<ServiceResponse<ExperienceItem[]>> {
  try {
    const q = query(collection(db, COLLECTION), orderBy("order"));
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as ExperienceItem[];
    return { success: true, data: items };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch experience",
    };
  }
}

/** Fetch a single experience item by ID. Returns `null` data when not found. */
export async function getExperienceById(
  id: string,
): Promise<ServiceResponse<ExperienceItem | null>> {
  try {
    const docRef = doc(db, COLLECTION, id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return { success: true, data: null };
    return {
      success: true,
      data: { id: snapshot.id, ...snapshot.data() } as ExperienceItem,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch experience item",
    };
  }
}

/** Add a new experience document. Returns the new document ID. */
export async function createExperience(
  data: Omit<ExperienceItem, "id">,
): Promise<ServiceResponse<string>> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), data);
    return { success: true, data: docRef.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create experience",
    };
  }
}

/** Update an existing experience item by ID. */
export async function updateExperience(
  id: string,
  data: Partial<Omit<ExperienceItem, "id">>,
): Promise<ServiceResponse<void>> {
  try {
    const docRef = doc(db, COLLECTION, id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      return { success: false, error: `Experience with id "${id}" not found` };
    }
    await updateDoc(docRef, data);
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update experience",
    };
  }
}

/** Delete an experience item by ID. */
export async function deleteExperience(
  id: string,
): Promise<ServiceResponse<void>> {
  try {
    const docRef = doc(db, COLLECTION, id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      return { success: false, error: `Experience with id "${id}" not found` };
    }
    await deleteDoc(docRef);
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete experience",
    };
  }
}
