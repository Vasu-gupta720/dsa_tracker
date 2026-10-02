import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

/**
 * Firestore path: users/{uid}/code/{questionId}_{language}
 * One document per (user, question, language) combination.
 * Fields: userId, questionId, language, code, createdAt, updatedAt
 */

function codeDocRef(uid, questionId, language) {
  const docId = `${questionId}_${language}`;
  return doc(db, "users", uid, "code", docId);
}

/**
 * Fetch saved code for a specific question + language.
 * Returns { code: string } or null if not found.
 */
export async function getSavedCode(uid, questionId, language) {
  const ref = codeDocRef(uid, questionId, language);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return snap.data().code ?? null;
  }
  return null;
}

/**
 * Save (create or update) code for a specific question + language.
 * Uses setDoc with merge: true to prevent overwriting other language docs.
 */
export async function saveCode(uid, questionId, language, code) {
  const ref = codeDocRef(uid, questionId, language);
  await setDoc(
    ref,
    {
      userId: uid,
      questionId,
      language,
      code,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
