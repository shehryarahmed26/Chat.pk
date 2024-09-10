  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
  import { GoogleAuthProvider, getAuth, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
  import { getFirestore, collection, addDoc, getDocs  } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";


  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBnixVuvDWFnr66WXhVRv5rjxZrqXyY36k",
    authDomain: "chat-app-react-2c08e.firebaseapp.com",
    projectId: "chat-app-react-2c08e",
    storageBucket: "chat-app-react-2c08e.appspot.com",
    messagingSenderId: "774584429550",
    appId: "1:774584429550:web:d571a207e79f7de87afcff"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  const db = getFirestore(app);


export {
    app,
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    onAuthStateChanged,
    signOut,
    db,
    collection, addDoc,
    getDocs
  }