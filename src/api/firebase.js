import firebase from "firebase";
// <!-- The core Firebase JS SDK is always required and must be listed first -->
// <script src="https://www.gstatic.com/firebasejs/7.16.1/firebase-app.js"></script>

// <!-- TODO: Add SDKs for Firebase products that you want to use
//      https://firebase.google.com/docs/web/setup#available-libraries -->
// <script src="https://www.gstatic.com/firebasejs/7.16.1/firebase-analytics.js"></script>

const config = {
	apiKey: "AIzaSyCj7iSDVfMWPm9uADXy9v0WoqJoQTY_zHg",
	authDomain: "miunu0.firebaseapp.com",
	projectId: "miunu0",
	storageBucket: "miunu0.appspot.com",
	messagingSenderId: "262821720462",
	appId: "1:262821720462:web:50b4bca0b8cf86ecab34df",
	measurementId: "G-S38LT1TV4C",
};
if (!firebase.apps.length) {
	firebase.initializeApp(config);
	// firebase.analytics();
}
const db = firebase.database();
const auth = firebase.auth();
const firestore = firebase.firestore();
const cloudstore = firebase.storage();
export { db, auth, firestore, cloudstore };
