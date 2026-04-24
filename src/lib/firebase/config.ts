import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY as string,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID as string,
  ...(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID && {
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  }),
};

// Initialize Firebase (prevent re-initialization in dev with hot reload)
let app: FirebaseApp;
if (getApps().length) {
  app = getApp();
} else {
  app = initializeApp(firebaseConfig);
}

function createServerStub<T>(serviceName: string): T {
  return new Proxy(
    {},
    {
      get() {
        throw new Error(`${serviceName} can only be used in the browser runtime.`);
      },
    }
  ) as T;
}

const isServer = typeof window === "undefined";

// Export singleton service instances
const db: Firestore = isServer ? createServerStub<Firestore>("Firestore") : getFirestore(app);
const auth: Auth = isServer ? createServerStub<Auth>("Auth") : getAuth(app);
const storage: FirebaseStorage = isServer ? createServerStub<FirebaseStorage>("Storage") : getStorage(app);

export { db, auth, storage };
export default app;
