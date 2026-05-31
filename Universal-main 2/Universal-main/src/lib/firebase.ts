import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection as firestoreCollection, 
  doc as firestoreDoc, 
  query as firestoreQuery, 
  getDocs as firestoreGetDocs, 
  getDoc as firestoreGetDoc, 
  setDoc as firestoreSetDoc, 
  updateDoc as firestoreUpdateDoc, 
  deleteDoc as firestoreDeleteDoc, 
  addDoc as firestoreAddDoc, 
  onSnapshot as firestoreOnSnapshot,
  serverTimestamp as firestoreServerTimestamp,
  orderBy as firestoreOrderBy,
  where as firestoreWhere,
  limit as firestoreLimit
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export const collection = firestoreCollection;
export const doc = firestoreDoc;
export const query = firestoreQuery;
export const getDocs = firestoreGetDocs;
export const getDoc = firestoreGetDoc;
export const setDoc = firestoreSetDoc;
export const updateDoc = firestoreUpdateDoc;
export const deleteDoc = firestoreDeleteDoc;
export const addDoc = firestoreAddDoc;
export const onSnapshot = firestoreOnSnapshot;
export const serverTimestamp = firestoreServerTimestamp;
export const orderBy = firestoreOrderBy;
export const where = firestoreWhere;
export const limit = firestoreLimit;

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: any, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const testConnection = async () => {
  try {
    const { getDocFromServer } = await import('firebase/firestore');
    await getDocFromServer(firestoreDoc(db, 'test', 'connection'));
  } catch (error: any) {
    if(error.message?.includes('offline')) {
      console.error("Firebase connection test failed: client is offline");
    }
  }
};

