import { FirebaseError, initializeApp } from "firebase/app";
import {
	createUserWithEmailAndPassword,
	getAuth,
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
} from "firebase/auth";
import { doc, Firestore, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { UserDetails } from "../types/authTypes";
import Swal from "sweetalert2";

const FIREBASE_API = process.env.NEXT_PUBLIC_FIREBASE_API;
const FIREBASE_AUTH_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const FIREBASE_STORAGE_BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const FIREBASE_MESSAGING_SENDER_ID = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const FIREBASE_APP_ID = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: FIREBASE_API,
	authDomain: FIREBASE_AUTH_DOMAIN,
	projectId: FIREBASE_PROJECT_ID,
	storageBucket: FIREBASE_STORAGE_BUCKET,
	messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
	appId: FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize google authentication
const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
	prompt: "select_account",
});

// Set-up firebase user authentication
export const auth = getAuth();

// Set-up firestore database
export const db: Firestore = getFirestore(app);

// Create db for newly registered users
export const createUserDocumentFromAuth = async (userId: string, userDetails: UserDetails) => {
	if (!userId) return;

	// Define the document path where user details will be stored
	const userDocRef = doc(db, "users", userId);

	const userSnapshot = await getDoc(userDocRef);

	try {
		if (!userSnapshot.exists()) {
			const createdAt = new Date();
			const role = "";
			const id = userSnapshot.id;

			// Set the user details in Firestore
			await setDoc(userDocRef, { ...userDetails, role, createdAt, id }, { merge: true });

			console.log("User details stored successfully!");
		}

		return userSnapshot;
	} catch (error: unknown) {
		if (error instanceof FirebaseError) {
			console.error("Firebase error creating the user:", error.message);
		} else {
			console.error("Unknown error creating the user:", error);
		}
	}
};

// Create user with Email and Password
export const createAuthUserWithEmailAndPassword = async (email: string, password: string) => {
	try {
		if (!email || !password) return;

		return await createUserWithEmailAndPassword(auth, email, password);
	} catch (error) {
		console.error("Error signing up: ", error);
		Swal.fire({
			position: "top",
			icon: "error",
			html: `Signup error: ${(error as Error).message}`,
			timer: 1500,
			showConfirmButton: false,
			toast: true,
			background: `hsl(0 0% 3.9%)`,
			color: `hsl(0 0% 98%)`,
		});
	}
};

// Sign-in with email and password
export const signInAuthUserWithEmailAndPassword = async (email: string, password: string) => {
	if (!email || !password) return;

	return await signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);

// Get user details
export const getUserDetails = async (userId: string) => {
	try {
		const userDocRef = doc(db, "users", userId);
		const userSnapshot = await getDoc(userDocRef);
		if (userSnapshot.exists()) {
			return userSnapshot.data(); // Contains user details like role
		} else {
			console.log("No user document found");
			return null;
		}
	} catch (error) {
		console.error("Error fetching user details:", error);
		return null;
	}
};

// Sign-out user
export const signOutUser = async (): Promise<void> => await signOut(auth);

// ---------------------------- Artwork Collection -----------------------------
