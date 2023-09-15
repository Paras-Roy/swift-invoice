// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import {getAuth } from "firebase/auth";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getFirestore} from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzeTQNLKA3_QOR0I9l5U2wRyuSkXQtMGQ",
  authDomain: "swift-invoice-f02cd.firebaseapp.com",
  projectId: "swift-invoice-f02cd",
  storageBucket: "swift-invoice-f02cd.appspot.com",
  messagingSenderId: "803879962682",
  appId: "1:803879962682:web:d052edf8dce1d28e0c4d03",
  measurementId: "G-9LCVK91HKH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);