// src/components/Signin.jsx
import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import Swal from "sweetalert2";
import "../components/Style/Style.css";
import Logo1 from "../assets/img/Dct-Logo.png";
import Logo2 from "../assets/img/Costum.png";
import { supabase } from "../supabaseClient";
import { UserAuth } from "../Contex/AuthContext"; // ✅ Import AuthContext

const Signin = () => {
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setIsLoggedIn } = useOutletContext();
  const { login } = UserAuth(); // ✅ Use global login function from AuthContext

  // 🔑 Main Sign In Function
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // =====================================================
      // STEP 1: SUBUKAN MUNA KUNG ADMIN (Supabase Auth account)
      // =====================================================
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: userID, // ✅ dapat email kapag Admin
          password,
        });

      if (!authError && authData?.user) {
        // ✅ Admin Login
        login(authData.user); // ✅ Save sa AuthContext
        setIsLoggedIn(true);

        Swal.fire({
          icon: "success",
          title: "Welcome Admin",
          text: `Hello ${authData.user.email}`,
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/InstructorDashboard");
        return;
      }

      // =====================================================
      // STEP 2: CHECK SA CUSTOM TABLE (Managers, Members, Advisers)
      // =====================================================
      const { data: user, error: userError } = await supabase
        .from("user_credentials")
        .select("*")
        .eq("user_id", userID)
        .eq("password", password) // ⚠️ Plaintext (hash in prod)
        .single();
        

      if (userError || !user) {
        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: "Invalid credentials. Please try again.",
        });
        return;
      }

      // ✅ Save custom user sa AuthContext
      login(user);
      localStorage.setItem("customUser", JSON.stringify(user)); // para sa sidebar
      setIsLoggedIn(true);
await supabase.from("current_user").upsert([
  { id: true, user_id: user.id } // ✅ overwrite existing row
]);

      // =====================================================
      // STEP 3: ROLE-BASED NAVIGATION
      // =====================================================
      if (user.user_roles === 1) {
        Swal.fire({
          icon: "success",
          title: "Login successful",
          text: "Welcome Manager",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/ManagerDashboard");
      } else if (user.user_roles === 2) {
        Swal.fire({
          icon: "success",
          title: "Login successful",
          text: "Welcome Member",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/MemberDashboard");
      } else if (user.user_roles === 3) {
        Swal.fire({
          icon: "success",
          title: "Login successful",
          text: "Welcome Adviser",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/AdviserDashboard");
      } else {
        Swal.fire({
          icon: "warning",
          title: "Unknown role",
          text: "Please contact the admin.",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto h-full border rounded-lg py-5 px-3 main-bg-color">
        
        {/* 🔹 LEFT SIDE: Sign In Form */}
        <div className="w-full md:w-1/2 p-6 flex items-center justify-center b-rd bg-white">
          <form onSubmit={handleSignIn} className="w-full max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to TaskSphere IT</h2>

            {/* School Logo */}
            <img src={Logo1} alt="Logo" className="mx-auto mb-6 w-24 h-24" />

            {/* Input: Email (Admin) or UserID (Manager/Member) */}
            <div className="mb-4 text-left">
              <label htmlFor="userID" className="block font-medium mb-1">
                Email / ID
              </label>
              <input
                onChange={(e) => setUserID(e.target.value)}
                value={userID}
                className="w-full p-3 border rounded"
                type="text"
                name="userID"
                id="userID"
                placeholder="Enter your email or ID"
                required
              />
            </div>

            {/* Input: Password */}
            <div className="mb-4 text-left">
              <label htmlFor="password" className="block font-medium mb-1">
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="w-full p-3 border rounded"
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded main-bg-color"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* 🔹 RIGHT SIDE: Info Panel */}
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
    </div>
  );
};

export default Signin;
