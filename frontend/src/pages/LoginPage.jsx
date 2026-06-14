import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from '../config';
import useDocumentTitle from '../hooks/useDocumentTitle';

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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
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
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" x2="22" y1="2" y2="22" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" x2="3" y1="12" y2="12" />
                </svg>
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
