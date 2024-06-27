import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth"; // Import connectAuthEmulator

const firebaseConfig = {
  apiKey: "AIzaSyAxRvcsw5l8H8DrJZn6N245EbYfgg6Lowo",
  authDomain: "coolie-38613.firebaseapp.com",
  databaseURL:
    "https://coolie-38613-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "coolie-38613",
  storageBucket: "coolie-38613.appspot.com",
  messagingSenderId: "851752918718",
  appId: "1:851752918718:web:33ecc7f382126d989688ef",
  measurementId: "G-5RTZD831FT",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Connect to the Firebase Auth Emulator (for development)
if (process.env.NODE_ENV === "development") {
  connectAuthEmulator(auth, "http://localhost:9099");
}

export { auth };
export default app; // Export the app instance
