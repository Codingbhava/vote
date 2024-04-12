import React, { useState,useEffect } from "react";
import Link from 'next/link';
import { useRouter } from "next/router";
import { AUTH } from "@/firebase";
import { FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from "@/context/authContext";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { Loading } from "@/components";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const history = useRouter();
  const { currentUser, isLoading } = useAuth();
  useEffect(() => {
    if (!isLoading && currentUser) {
        history.push("/");
    }
}, [currentUser, isLoading]);
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(AUTH,email, password);
      history.push("/");
      setError(null);
    } catch (error) {
      const errorCode = error.code;
      let errorMessage = error.message;
      console.log(errorCode);
      if (errorCode === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (errorCode === "auth/user-not-found") {
        errorMessage = "User not found. Please check your email.";
      }
      else if(errorCode=="auth/internal-error"){
          errorMessage = "Check Internet";
      }
      else if(errorCode=="auth/missing-password"){
        errorMessage = "Enter Password";
    }
      
      else if (errorCode === "auth/invalid-email") {
        errorMessage = "Invalid email. Please enter a valid email address.";
      }
      setError(errorMessage);
    }
  };

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(AUTH,email);
      setSuccess('Password reset email sent. Check your inbox.');
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  return isLoading || (!isLoading && !!currentUser) ? (
   <Loading/>
) : (
    <div className="min-h-screen flex items-center justify-center bg-me_background">
      <div className="max-w-md w-full bg-gray-800 p-8 m-4 rounded-md shadow-md">
        <div className="flex items-center justify-center">
          <h2 className="text-xl font-semibold text-white">Login</h2>
        </div>
        <div className="mt-6">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FiMail className="text-white" />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-700 pl-10 py-2 text-white  rounded-full w-full focus:outline-none focus:ring focus:border-gray-400 transition duration-300"
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
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-700 pl-10 py-2 text-white rounded-full w-full focus:outline-none focus:ring focus:border-gray-400 transition duration-300"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
          <button
            onClick={handleLogin}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full w-full transition duration-300"
          >
            Login
          </button>
          <button
            onClick={handleForgotPassword}
            className="text-gray-400 hover:underline hover:text-common_accent mt-2 block w-full text-center transition duration-300"
          >
            Forgot Password?
          </button>
          {/* Link to Register Page */}
          <span
            className="text-gray-400 mt-2 block w-full text-center transition duration-300"
          >
            Don't have an account? <Link href="/Register"
            className="hover:text-common_accent " >Register</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;