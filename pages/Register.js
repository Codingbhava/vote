import React, { useState,useEffect } from "react";
import Link from 'next/link';
import { useRouter } from "next/router";
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import { AUTH,DB } from "@/firebase";
import {
    createUserWithEmailAndPassword,
    updateProfile
} from "firebase/auth";
import { doc, setDoc,Timestamp,getDocs,query,collection,where } from "firebase/firestore";
import { useAuth } from "@/context/authContext";
import { Loading } from "@/components";
function Register() {
  const { currentUser, isLoading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const history = useRouter();
  useEffect(() => {
    if (!isLoading && currentUser) {
        history.push("/");
    }
}, [currentUser, isLoading]);
const handleSignUp = async () => {
  // Basic input validation
  if (!fullName || !email  || !password) {
    setError("All fields are required");
    return;
  }

  // Email validation using a simple regex pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    setError("Please enter a valid email address");
    return;
  }

  try {
    // Check if fullName already exists in the database
    const fullNameSnapshot = await getDocs(query(collection(DB, "users"), where("name", "==", fullName)));
    if (!fullNameSnapshot.empty) {
      setError("Username is already taken. Please try with a different username.");
      return;
    }

    const { user } = await createUserWithEmailAndPassword(
      AUTH,
      email,
      password
    );
    await updateProfile(user, {
      displayName: fullName
    });
    await setDoc(doc(DB, "users", user.uid), {
      id: user.uid,
      name: fullName,
      email: email,
      createTime: Timestamp.now()
    });
    history.push("/");
  } catch (error) {
    const errorCode = error.code;
    let errorMessage = error.message;

    if (errorCode === "auth/weak-password") {
      errorMessage = "Password should be at least 6 characters.";
    } else if (errorCode === "auth/email-already-in-use") {
      errorMessage = "Email id already used.";
    } else if (errorCode === "auth/internal-error") {
      errorMessage = "Check Internet.";
    }
    setError(errorMessage);
  }
};

  return isLoading || (!isLoading && !!currentUser) ? (
    <Loading/>
) : (
    <div className="min-h-screen flex items-center justify-center bg-me_background">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-md m-4 shadow-md">
        <div className="flex items-center justify-center">
          <h2 className="text-xl font-semibold text-white">Register</h2>
        </div>
        <div className="mt-6">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FiUser className="text-white" />
            </div>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              required
              onChange={(e) => setFullName(e.target.value)}
              className="bg-gray-700 pl-10 py-2 text-white rounded-full w-full focus:outline-none focus:ring focus:border-blue-500 transition duration-300"
            />
          </div>
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FiMail className="text-white" />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-700 pl-10 py-2 text-white rounded-full w-full focus:outline-none focus:ring focus:border-blue-500 transition duration-300"
            />
          </div>
          
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FiLock className="text-white" />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-700 pl-10 py-2 text-white rounded-full w-full focus:outline-none focus:ring focus:border-blue-500 transition duration-300"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            onClick={handleSignUp}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full w-full transition duration-300"
          >
            Sign Up
          </button>
          {/* Link to Login Page */}
          <span
            className="text-gray-400 mt-2 block w-full text-center transition duration-300"
          >
            Already have an account? <Link href="/Login"
            className="hover:text-common_accent " >Login </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Register;