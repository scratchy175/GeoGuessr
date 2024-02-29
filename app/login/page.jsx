"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import ThreeDotAnimation from "@/components/ThreeDotAnimation";
import React from 'react';



const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const clearInputs = () => {
    setEmail("");
    setPassword("");
    setError("");
  };
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    signIn("credentials", {
      email,
      password,
      redirect: false,
    })
      .then((res) => {
        if (res && res.error) {
          const errorObject = JSON.parse(res.error);
          setError(errorObject.message);

          setLoading(false);
        } else {
          clearInputs();
          setLoading(false);
          router.push("/");
          window.location.reload();
        }
      })
      .catch((error) => {

        setLoading(false);
      });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: 'url("/planete.jpg")' }}
    >
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-md w-96 text-gray-800">
        <h2 className="text-2xl font-semibold mb-4">
          {loading ? <ThreeDotAnimation text="Connexion" /> : "Connexion"}
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Adresse email"
              required
              onChange={handleEmailChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Mot de passe"
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="mb-6">
            <label className="flex items-center">
              <input type="checkbox" className="text-indigo-500 form-checkbox" />
              <span className="ml-2 text-gray-600">Se souvenir de moi</span>
            </label>
          </div>
          <div>
            <button
              className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
              type="submit"
            >
              Se connecter
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Dont have an account?{" "}
            <Link href="/signup" className="text-indigo-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
