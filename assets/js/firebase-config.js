// FLAMIORA — Firebase configuration
// Firebase Web configuration values are not passwords.
// Security is enforced by Firebase Authentication + Firestore Rules.

const firebaseConfig = {
  apiKey: "AIzaSyC7YHA1t8LTW3Ob1oQnRnA5jx78iHuaQQ0",
  authDomain: "flamiora-f0062.firebaseapp.com",
  projectId: "flamiora-f0062",
  storageBucket: "flamiora-f0062.firebasestorage.app",
  messagingSenderId: "995632463964",
  appId: "1:995632463964:web:76c04597312e738acea699",
  measurementId: "G-TF4TVKY6CY"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.apps.length && firebase.storage ? firebase.storage() : null;
