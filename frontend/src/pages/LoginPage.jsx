import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from '../config';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { User, Lock, Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  useDocumentTitle("Login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token); // Save token
        localStorage.setItem("username", username); // Save username
        navigate("/dashboard"); // Redirect to dashboard
      } else {
        setError("Invalid credentials! Please check your username and password.");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#f8f8fa] text-gray-900 font-sans selection:bg-gray-200 selection:text-gray-900 overflow-hidden">
      {/* Background layers */}
      <div className="landing-gradient-mesh pointer-events-none fixed inset-0 z-0" aria-hidden="true" />
      <div className="landing-dot-grid pointer-events-none fixed inset-0 z-0 opacity-50" aria-hidden="true" />

      {/* Back button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-10 inline-flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors bg-white/80 backdrop-blur-md px-3.5 py-2 rounded-lg border border-gray-200 shadow-sm hover:shadow-md cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div className="relative z-10 w-full max-w-[420px]">
        <form
          onSubmit={handleLogin}
          className="bg-white/80 backdrop-blur-md p-8 md:p-10 rounded-2xl shadow-xl shadow-gray-200/50 w-full border border-gray-200 transition-all duration-300 hover:border-gray-300 hover:shadow-2xl hover:-translate-y-0.5"
        >
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <img 
              src="/logo.png" 
              alt="Yinventory Logo" 
              className="landing-logo h-11 w-auto object-contain cursor-pointer mb-5 animate-fade-in" 
              onClick={() => navigate("/")}
            />
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
              Welcome Back
            </h2>
            <p className="text-xs text-gray-500 mt-1.5 text-center">
              Sign in to manage your inventory and sales
            </p>
          </div>

          {/* Alert Error banner */}
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs font-medium text-red-700 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Username */}
          <div className="mb-5">
            <label className="block text-[10px] font-bold tracking-wider text-gray-500 uppercase mb-2">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <User className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError("");
                }}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-sm outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 hover:border-gray-400"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-[10px] font-bold tracking-wider text-gray-500 uppercase mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                className="w-full pl-10 pr-10 py-3 bg-white border border-gray-300 rounded-lg text-sm outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 hover:border-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-650 transition-colors outline-none cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="h-4.5 w-4.5" />
                ) : (
                  <Eye className="h-4.5 w-4.5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="landing-btn-primary w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-300 disabled:text-gray-500 disabled:transform-none disabled:shadow-none transition-all shadow-sm"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                Sign In
                <LogIn className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Yinventory. Built for speed and accuracy.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
