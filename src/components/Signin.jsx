import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Footer from "./Footer";
import Header from "./Header";
import "../components/Style/Style.css";
import Logo1 from "../assets/img/Dct-Logo.png";
import Logo2 from "../assets/img/Costum.png";
import { UserAuth } from "../Contex/AuthContext";
import { supabase } from "../supabaseClient"; // ⬅️ import Supabase client

const Signin = () => {
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = UserAuth(); 

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userID, 
        password,
      });

      if (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message || "Invalid credentials",
        });
        setError(error.message);
      } else {
        login(data.user);
        navigate("/dashboard");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong. Please try again later.",
      });
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto h-full border rounded-lg py-5 px-3 main-bg-color">
        <div className="w-full md:w-1/2 p-6 flex items-center justify-center b-rd bg-white">
          <form onSubmit={handleSignIn} className="w-full max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to TaskSphere IT</h2>

            <img src={Logo1} alt="Logo" className="mx-auto mb-6 w-24 h-24" />

            <div className="mb-4 text-left">
              <label htmlFor="userID" className="block font-medium mb-1">
                Email
              </label>
              <input
                onChange={(e) => setUserID(e.target.value)}
                className="w-full p-3 border rounded"
                type="email"
                name="userID"
                id="userID"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-4 text-left">
              <label htmlFor="password" className="block font-medium mb-1">
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded"
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded main-bg-color"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            {error && <p className="text-red-600 text-center pt-4">{error}</p>}
          </form>
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-center justify-center main-bg-color text-white rounded-lg p-8 space-y-6">
          <h1 className="text-3xl font-semibold text-center">
            Empowering Collaboration,
            <br />
            Streamlining IT Capstone Success.
          </h1>
          <img
            src={Logo2}
            alt="Team"
            className="w-80 h-auto rounded-lg shadow-md"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signin;
