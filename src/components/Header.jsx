import React, { useEffect, useState } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/img/Logo.png";
import { UserAuth } from "../Contex/AuthContext";

const Header = () => {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    if (user) {
      setActiveUser(user);
    } else {
      const customUser = localStorage.getItem("customUser");
      const adminUser = localStorage.getItem("adminUser");
      if (customUser) setActiveUser(JSON.parse(customUser));
      else if (adminUser) setActiveUser(JSON.parse(adminUser));
      else setActiveUser(null); // ✅ clear agad pag wala
    }
  }, [user]);

  const handleSignOut = async () => {
    await logout();

    // ✅ clear local storage
    localStorage.removeItem("customUser");
    localStorage.removeItem("adminUser");

    // ✅ clear local state
    setActiveUser(null);

    // redirect
    navigate("/");
  };

  const handleProfileClick = () => {
    const customUser = JSON.parse(localStorage.getItem("customUser"));

    if (customUser?.user_roles === 1) {
      navigate("/ManagerDashboard", { state: { activePage: "Profile" } });
    } else if (customUser?.user_roles === 2) {
      navigate("/MemberDashboard", { state: { activePage: "Profile" } });
    } else if (customUser?.user_roles === 3) {
      navigate("/AdviserDashboard", { state: { activePage: "Profile" } });
    } else {
      navigate("/Profile");
    }
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
      <a href="/" style={{ display: "inline-block" }}>
        <img src={Logo} width="150" height="120" alt="Logo" />
      </a>

      {activeUser && (
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider round"></span>
          </label>

          <button style={{ background: "none", border: "none", cursor: "pointer" }}>
            <FaBell size={20} />
          </button>

          <button
            style={{ background: "none", border: "none", cursor: "pointer" }}
            onClick={handleProfileClick}
          >
            <FaUserCircle size={22} />
          </button>
        </div>
      )}
    </div>
  );
};


export default Header;
