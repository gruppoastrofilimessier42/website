// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// import {
//   GoogleAuthProvider,
//   getAuth,
//   signInWithPopup,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   sendPasswordResetEmail,
//   signOut,
// } from 'firebase/auth'
import { getFirestore} from 'firebase/firestore'
import { firebaseConfig } from './firebaseConfig'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export class Firebase {
  // constructor () {
  //    const app = initializeApp(firebaseConfig)
  //    const auth = getAuth(app)
  //    const db = getFirestore(app)
  // }
  static async initialize() {
    return initializeApp(firebaseConfig)
    // const auth = getAuth(app)
    // const db = getFirestore(app)
  }

  static async initDatabase() {
    return getFirestore()
  }
}
