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
    await getDocFromServer(doc(db, '_connection_test_', 'test'));
  } catch (error: any) {
    // "Missing or insufficient permissions" is actually a success for a connection test
    // because it means we reached the server and it rejected us based on rules.
    if (error?.code === 'permission-denied') {
      console.log("Firestore connection test: Connected (Server reached).");
      return;
    }
    
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Firestore connection failed: The client is offline. This usually indicates an incorrect firestoreDatabaseId or configuration in firebase-applet-config.json.");
    } else {
      console.error("Firestore connection test error:", error);
    }
  }
}

testConnection();
