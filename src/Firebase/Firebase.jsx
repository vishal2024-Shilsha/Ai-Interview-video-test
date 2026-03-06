import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

export const API_KEY = import.meta.env.VITE_API_KEY
export const AUTH_DOMAIN=import.meta.env.VITE_AUTH_DOMAIN
export const PROJECT_ID=import.meta.env.VITE_PROJECT_ID
export const STORAGE_BUCKET=import.meta.env.VITE_STORAGE_BUCKET
export const MESSAGING_SENDER_ID=import.meta.env.VITE_MESSAGING_SENDER_ID
export const API_ID=import.meta.env.VITE_API_ID
export const MEASUREMENT_ID=import.meta.env.VITE_MEASUREMENT_ID


const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: API_ID,
  measurementId: MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);