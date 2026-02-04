import { initializeApp } from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
} from 'firebase/auth'
import { User } from '@types/index'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

// Convert Firebase user to app User
const mapFirebaseUser = (firebaseUser: FirebaseUser): User => {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName || 'User',
    photoURL: firebaseUser.photoURL || undefined,
    role: 'player', // Default role, will be fetched from backend
    createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
  }
}

// Auth methods
export const firebaseAuth = {
  // Sign in with email/password
  signIn: async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return mapFirebaseUser(result.user)
  },

  // Sign up with email/password
  signUp: async (email: string, password: string, displayName: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    // TODO: Update display name
    return mapFirebaseUser(result.user)
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    const result = await signInWithPopup(auth, googleProvider)
    return mapFirebaseUser(result.user)
  },

  // Sign out
  signOut: async () => {
    await signOut(auth)
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        callback(mapFirebaseUser(firebaseUser))
      } else {
        callback(null)
      }
    })
  },

  // Get current user token
  getToken: async (): Promise<string | null> => {
    const user = auth.currentUser
    if (user) {
      return await user.getIdToken()
    }
    return null
  },
}
