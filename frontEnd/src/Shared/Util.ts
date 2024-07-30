import {
  // Firestore,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../firebase.js'; // Ensure you have configured Firebase and Firestore
import { STRINGS } from './Constants.js';

interface FirestoreUpdateData {
  [key: string]: boolean;
}

const updateFirestoreDocument = async (
  collectionName: string,
  documentId: string,
  updateData: FirestoreUpdateData
): Promise<void> => {
  const documentRef = doc(db, collectionName, documentId);
  await updateDoc(documentRef, updateData);
};

async function clearFirestoreCollection(collectionName: string): Promise<void> {
  try {
    const collectionRef = collection(db, collectionName);
    const querySnapshot = await getDocs(collectionRef);

    // Batch delete documents
    const deletePromises = querySnapshot.docs.map((docSnap) =>
      deleteDoc(doc(db, collectionName, docSnap.id))
    );

    await Promise.all(deletePromises);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(STRINGS.ERROR_CREATING_COLLECTION, err.message);
      throw new Error(err.message);
    } else {
      console.error(STRINGS.ERROR_UNKNOWN, err);
      throw new Error(STRINGS.ERROR_UNKNOWN);
    }
  }
}

const UTILS = {
  clearFirestoreCollection,
  updateFirestoreDocument,
};

export default UTILS;
