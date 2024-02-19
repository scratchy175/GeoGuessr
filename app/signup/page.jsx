"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/auth";
import ThreeDotAnimation from "@/components/ThreeDotAnimation";

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const clearInputs = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    registerUser(username, email, password)
      .then((res) => {
        clearInputs();
        setLoading(false);
        router.push("/login");
       
      })
      .catch((e) => {
       
        setError(e.message);
        setLoading(false);
      });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950/25">
      <div className="bg-slate-950/25 p-8 rounded-lg shadow-md w-96 text-white">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-semibold mb-4"> {loading ?  <ThreeDotAnimation text="Signup"/> : "Signup"}</h2>
          {error && <p className="text-orange-700">{error}</p>}

          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-600">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-slate-950/25 text-white border-indigo-500"
              placeholder="Your Username"
              onChange={handleUsernameChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-slate-950/25 text-white border-indigo-500"
              placeholder="Your Email"
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-slate-950/25 text-white border-indigo-500"
              placeholder="Password"
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="text-indigo-500 form-checkbox"
                defaultChecked
              />
              <span className="ml-2 text-gray-600">
                I agree to the{" "}
                <a href="#" className="text-blue-500">
                  Terms of Service
                </a>
              </span>
            </label>
            <Link className="text-indigo-500" rel="stylesheet" href="/login">
              Already Have An Account?{" "}
            </Link>
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300"
            >
              SignUp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
