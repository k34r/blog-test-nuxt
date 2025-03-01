import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: config.public.FIREBASE_API_KEY as string,
    authDomain: config.public.FIREBASE_AUTH_DOMAIN as string,
    projectId: config.public.FIREBASE_PROJECT_ID as string,
    storageBucket: config.public.FIREBASE_STORAGE_BUCKET as string,
    messagingSenderId: config.public.FIREBASE_MESSAGING_SENDER_ID as string,
    appId: config.public.FIREBASE_APP_ID as string,
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  nuxtApp.provide('db', db);
  nuxtApp.provide('auth', auth);
});
