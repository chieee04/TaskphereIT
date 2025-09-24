import React from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import Logo from "../assets/img/Logo.png";
import { UserAuth } from "../Contex/AuthContext";
const Header = () => {
  const { user, logout } = UserAuth();

  const handleSignOut = async () => {
    await logout(); // 🔹 clear supabase + localstorage
    window.location.href = "/"; // redirect to homepage
  };

  return (
    <div
      className="mb-3 px-4 py-2"
      style={{
        backgroundColor: "rgba(240, 240, 240, 0.4)",
        borderBottomLeftRadius: "14px",
        borderBottomRightRadius: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "60px",
      }}
    >
      {/* 🔹 Left side - Logo */}
      <a href="/" style={{ display: "inline-block" }}>
        <img src={Logo} width="150" height="120" alt="Logo" />
      </a>

      {/* 🔹 Right side - Extra controls */}
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {/* Toggle */}
          <label className="switch">
            <input type="checkbox" />
            <span className="slider round"></span>
          </label>

          {/* Notification */}
          <button style={{ background: "none", border: "none", cursor: "pointer" }}>
            <FaBell size={20} />
          </button>

          {/* Profile */}
          <button
            style={{ background: "none", border: "none", cursor: "pointer" }}
            onClick={handleSignOut}
          >
            <FaUserCircle size={22} />
          </button>
        </div>
      )}

      <style>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 40px;
          height: 22px;
        }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: #ccc;
          transition: 0.4s;
          border-radius: 22px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 16px; width: 16px;
          left: 3px; bottom: 3px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }
        input:checked + .slider {
          background-color: #007bff;
        }
        input:checked + .slider:before {
          transform: translateX(18px);
        }
      `}</style>
    </div>
  );
};

export default Header;
