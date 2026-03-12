"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // (validate credentials here)
    router.push("/dashboard"); // ✅ redirect to dashboard
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md px-8 py-10 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/images/logo.png"
            alt="Aspiring Legal Network"
            width={160}
            height={40}
            priority
            className="w-40 h-auto"
          />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">
          Welcome back
        </h2>
        <p className="text-gray-500 mb-8">
          Login with your email and admin password
        </p>

        {/* Email */}
        <div className="text-left mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <FaEnvelope className="absolute right-3 top-3.5 text-gray-400" />
          </div>
        </div>

        {/* Password */}
        <div className="text-left mb-7">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <FaLock className="absolute right-3 top-3.5 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button onClick={handleLogin} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 rounded-lg transition">
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
