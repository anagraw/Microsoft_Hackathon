// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
	apiKey: "AIzaSyBzVYRI6r1WsR-p4S2N1oH8rUcNBhCC2jM",
	authDomain: "ms-hack-e0b6b.firebaseapp.com",
	projectId: "ms-hack-e0b6b",
	storageBucket: "ms-hack-e0b6b.appspot.com",
	messagingSenderId: "772768837310",
	appId: "1:772768837310:web:ad397b654b0cd2c0efb8ef",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
