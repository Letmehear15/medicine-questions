import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { isDevMode } from "../utils/constant";

const firebaseConfig = {
  apiKey: "AIzaSyAWFEUCjz1oZl4aWxySebSvQKOml5-D3YQ",
  authDomain: "mila-questions.firebaseapp.com",
  projectId: "mila-questions",
  storageBucket: "mila-questions.appspot.com",
  messagingSenderId: "292841640666",
  appId: "1:292841640666:web:14c548194571bf5f85cbe3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const collectionName = isDevMode? 'app-settings-test' :  'app-settings'
export const documentId = isDevMode ? '5z8QfId6ThX24e4Wf3yV' : 'uRmPgg8priQiGehyk911'