// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { toast } from "react-toastify";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDmzzgRMCYjHOddKzBB9-QLsHUCXrigdlM",
    authDomain: "netflix-clone-f61e8.firebaseapp.com",
    projectId: "netflix-clone-f61e8",
    storageBucket: "netflix-clone-f61e8.firebasestorage.app",
    messagingSenderId: "264701896585",
    appId: "1:264701896585:web:8ad3892268864052e6a358"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to get user data by UID
const getUserData = async (uid) => {
    const userRef = collection(db, "user");
    const q = query(userRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    let userData = null;
    querySnapshot.forEach((doc) => {
        userData = doc.data(); // Get the user data (name, email, etc.)
    });
    return userData;
};

const signUp = async (name, email, password) => {
    try {
        const response = await createUserWithEmailAndPassword(auth, email, password);
        const user = response.user;
        await addDoc(collection(db, "user"), {
            uid: user.uid,
            name,
            authProvider: "local",
            email,
        });
    }
    catch (error) {
        console.log(error);
        toast.error(error.code.split('/')[1].split('-').join(' '));
    }
}

const login = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } 
    catch (error) {
        console.log(error);
        toast.error(error.code.split('/')[1].split('-').join(' '));
    }
}

const logout = () => {
    signOut(auth);
}

// Function to check for current user
const checkCurrentUser = (setUserData) => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userData = await getUserData(user.uid);
            setUserData(userData); // Set user data in your state (Profile section)
        } else {
            setUserData(null); // User is logged out
        }
    });
};

export {auth, db, signUp, login, logout, checkCurrentUser};
