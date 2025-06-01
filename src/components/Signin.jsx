import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../Contex/AuthContext";
import Footer from "./Footer";
import Header from "./Header";
import "../components/Style/Style.css";
import Logo from "../assets/img/Logo.png"; 
import Logo1 from "../assets/img/Dct-Logo.png";
import Logo2 from "../assets/img/Costum.png";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { signInUser } = UserAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signInUser({ email, password });

      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error.message);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto h-full border rounded-lg py-5 px-3 main-bg-color">
        {/* Left Column: Sign-in Form */}
        <div className="w-full md:w-1/2 p-6 flex items-center justify-center b-rd bg-white">

          <form onSubmit={handleSignIn} className="w-full max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4 break-words">Welcome to TaskSphere IT</h2>

            {/* Image */}
            <img
              src={Logo1}
              alt="TaskSphere Logo"
              className="mx-auto mb-6 w-24 h-24 object-contain"
            />

            {/* User ID */}
            <div className="mb-4 text-left">
              <label htmlFor="email" className="block font-medium mb-1">User ID</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded"
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div className="mb-4 text-left">
              <label htmlFor="password" className="block font-medium mb-1">Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded"
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
              />
            </div>

            {/* Academic Year */}
            <div className="mb-6 text-left">
              <label htmlFor="academicYear" className="block font-medium mb-1">Academic Year</label>
              <input
                className="w-full p-3 border rounded"
                type="date"
                name="academicYear"
                id="academicYear"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded main-bg-color"
            >
              Sign Up
            </button>

            {/* Error Message */}
            {error && <p className="text-red-600 text-center pt-4">{error}</p>}
          </form>
        </div>

        {/* Right Column: Image or Placeholder */}
       <div className="w-full md:w-1/2 flex flex-col items-center justify-center main-bg-color text-white rounded-lg p-8 space-y-6">
  <div className="text-center">
    <h1 className="text-3xl font-semibold">Empowering Collaboration,<br/>Streamlining IT Capstone Success.</h1>
  </div>
  <img src={Logo2} alt="Team Collaboration" className="w-80 h-auto rounded-lg shadow-md" />
</div>


      </div>

      <Footer />
    </div>
  );
};

export default Signin;
