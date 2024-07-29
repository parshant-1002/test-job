import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase.js'; // Ensure you have configured Firebase and Firestore

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

export default updateFirestoreDocument;
