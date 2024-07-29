import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  FirestoreError,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../../firebase.js'; // Ensure you have configured Firebase and Firestore

export interface FirestoreDocument {
  id: string;
  [key: string]: string;
}

const useFirestoreCollection = (collectionName: string) => {
  const [documents, setDocuments] = useState<FirestoreDocument[]>([]);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    const collectionRef = collection(db, collectionName);
    const unsubscribe = onSnapshot(
      collectionRef,
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        setDocuments(
          querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      },
      (errorFireStore: FirestoreError) => {
        setError(errorFireStore);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [collectionName]);

  return { documents, error };
};

export default useFirestoreCollection;
