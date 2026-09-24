import { db } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

const COLLECTION = "gallery";

/**
 * Fetch all gallery entries ordered by date descending.
 * @returns {Promise<Array>}
 */
export async function fetchGallery() {
  const q = query(collection(db, COLLECTION), orderBy("date", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Add a new gallery entry to Firestore.
 * @param {{ title: string, date: string, description: string, category: string, driveFileId: string, imageUrl: string, imageFull: string }} data
 * @returns {Promise<string>} The new document id
 */
export async function addGalleryEntry(data) {
  const docRef = await addDoc(collection(db, COLLECTION), {
    title: data.title || "",
    date: data.date || "",
    description: data.description || "",
    category: data.category || "",
    driveFileId: data.driveFileId || "",
    imageUrl: data.imageUrl || "",
    imageFull: data.imageFull || "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Update an existing gallery entry in Firestore.
 * @param {string} id  Firestore document id
 * @param {{ title?: string, date?: string, description?: string, category?: string, driveFileId?: string, imageUrl?: string, imageFull?: string }} data
 */
export async function updateGalleryEntry(id, data) {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a gallery entry from Firestore.
 * @param {string} id  Firestore document id
 */
export async function deleteGalleryEntry(id) {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
}
