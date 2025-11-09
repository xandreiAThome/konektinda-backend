import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "dotenv/config";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_AUTH_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_AUTH_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function getIdToken() {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      process.env.FIREBASE_TEST_USER_EMAIL!,
      process.env.FIREBASE_TEST_USER_PASSWORD!
    );

    const idToken = await userCredential.user.getIdToken();
    console.log("Your ID Token (use this in Postman):\n", idToken);
  } catch (error) {
    console.error("Error getting ID token:", error);
  }
}

getIdToken();
