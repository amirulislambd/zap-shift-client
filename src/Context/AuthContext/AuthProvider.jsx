import { useEffect, useState } from "react";
import { auth } from "../../Firebase/firebase.init";
import { AuthContext } from "./AuthContext";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";


const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signinWithGoogle = ()=>{
    setLoading(true);
    return signInWithPopup(auth, googleProvider)
  }

  const updateUserProfile = profileInfo =>{
    return updateProfile(auth.currentUser,profileInfo);
  }

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log('user in the auth state change', currentUser)
      setLoading(false);
    });
    return () => {
      unSubscribe();
    };
  }, []);

  const authIfo = {
    user,
    loading,
    createUser,
    signIn,
    signinWithGoogle,
    updateUserProfile,
    logOut,
  };

  return <AuthContext value={authIfo}>{children}</AuthContext>;
};

export default AuthProvider;
