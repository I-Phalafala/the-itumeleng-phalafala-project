import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const REQUIRED_ENV_VARS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
] as const;

const isServer = typeof window === "undefined";
const shouldValidateFirebaseEnv = process.env.NODE_ENV === "test" || !isServer;
const missingEnvVars = REQUIRED_ENV_VARS.filter((envVar) => {
  const value = process.env[envVar];
  return typeof value !== "string" || value.trim() === "";
});
const firebaseEnvErrorMessage =
  missingEnvVars.length > 0
    ? `Missing required Firebase environment variable(s): ${missingEnvVars.join(", ")}`
    : null;
const hasFirebaseEnv = firebaseEnvErrorMessage === null;

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

function createUnavailableApp(message: string): FirebaseApp {
  return createUnavailableService<FirebaseApp>("Firebase App", message);
}

function createUnavailableService<T>(serviceName: string, cause: unknown): T {
  const message =
    cause instanceof Error
      ? cause.message
      : typeof cause === "string" && cause.trim() !== ""
        ? cause
        : `${serviceName} failed to initialize.`;

  return new Proxy(
    {},
    {
      get() {
        throw new Error(`${serviceName} is unavailable: ${message}`);
      },
    }
  ) as T;
}

function createBrowserService<T>(serviceName: string, initializer: () => T): T {
  try {
    return initializer();
  } catch (error) {
    console.error(`Failed to initialize ${serviceName}:`, error);
    return createUnavailableService<T>(serviceName, error);
  }
}

if (shouldValidateFirebaseEnv && firebaseEnvErrorMessage) {
  console.warn(firebaseEnvErrorMessage);
}

// Initialize Firebase (prevent re-initialization in dev with hot reload)
let app: FirebaseApp;
if (hasFirebaseEnv) {
  if (getApps().length) {
    app = getApp();
  } else {
    app = initializeApp(firebaseConfig);
  }
} else {
  app = createUnavailableApp(firebaseEnvErrorMessage ?? "Firebase configuration is unavailable.");
}

// Export singleton service instances
const db: Firestore = isServer
  ? createServerStub<Firestore>("Firestore")
  : hasFirebaseEnv
    ? createBrowserService<Firestore>("Firestore", () => getFirestore(app))
    : createUnavailableService<Firestore>("Firestore", firebaseEnvErrorMessage);

const auth: Auth = isServer
  ? createServerStub<Auth>("Auth")
  : hasFirebaseEnv
    ? createBrowserService<Auth>("Auth", () => getAuth(app))
    : createUnavailableService<Auth>("Auth", firebaseEnvErrorMessage);

const storage: FirebaseStorage = isServer
  ? createServerStub<FirebaseStorage>("Storage")
  : hasFirebaseEnv
    ? createBrowserService<FirebaseStorage>("Storage", () => getStorage(app))
    : createUnavailableService<FirebaseStorage>("Storage", firebaseEnvErrorMessage);

export { db, auth, storage };
export default app;
