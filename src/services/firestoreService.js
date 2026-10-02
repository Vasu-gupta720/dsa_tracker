import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Fetch the user's saved progress from Firestore.
 * Returns { checked: {}, notes: {} } — empty objects for new users.
 */
export async function getUserProgress(uid) {
  const ref = doc(db, "users", uid, "progress", "data");
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const d = snap.data();
    return {
      checked: d.checked || {},
      notes: d.notes || {},
    };
  }
  return { checked: {}, notes: {} };
}

/**
 * Save the user's progress to Firestore (merge to avoid overwriting other fields).
 */
export async function saveUserProgress(uid, checked, notes) {
  const ref = doc(db, "users", uid, "progress", "data");
  await setDoc(
    ref,
    {
      checked,
      notes,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
