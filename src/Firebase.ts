// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAdsuV4r0wgoCbUeNBji2BKTi1Hp9Ra_BE",
    authDomain: "dashboard-a5184.firebaseapp.com",
    databaseURL: "https://dashboard-a5184-default-rtdb.firebaseio.com",
    projectId: "dashboard-a5184",
    storageBucket: "dashboard-a5184.appspot.com",
    messagingSenderId: "898164560194",
    appId: "1:898164560194:web:b87999db8e4e0c6ca9b8db",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
