import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, getDocFromCache, getDocFromServer } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseConfig from "../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Connection test
async function testConnection() {
  try {
    // Try to reach the server. This document doesn't need to exist.
    await getDocFromServer(doc(db, '_connection_test_', 'test'));
  } catch (error: any) {
    // If we reach the server, it's a success, even if it's a permission error
    // (though we updated the rules to allow public read for this path).
    if (error?.code === 'permission-denied' || error?.code === 'not-found') {
      return;
    }
    
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Firestore connection failed: The client is offline. This usually indicates an incorrect firestoreDatabaseId or configuration in firebase-applet-config.json.");
    }
  }
}

testConnection();
