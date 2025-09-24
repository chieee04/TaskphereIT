// src/components/ManagerProfile.jsx
import React, { useEffect, useState } from "react";
//import { supabase } from "../../supabaseClient";
import { FaUserCircle } from "react-icons/fa";

const Profile = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("customUser"));
    if (storedUser) {
      setUserData(storedUser);
    }
  }, []);

  if (!userData) {
    return <p style={{ textAlign: "center" }}>Loading profile...</p>;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <FaUserCircle style={{ marginRight: "8px" }} />
        <span style={styles.headerText}>Profile</span>
      </div>

      {/* Profile Section */}
      <div style={styles.profileWrapper}>
        {/* Left: Profile Picture */}
        <div style={styles.leftSection}>
          <p style={styles.sectionTitle}>Profile Picture</p>
          <div style={styles.pictureBox}>
            <FaUserCircle size={80} color="#333" />
          </div>
        </div>

        {/* Right: Details */}
        <div style={styles.rightSection}>
          {/* Personal + Security */}
          <div style={styles.detailsWrapper}>
            {/* Personal Details */}
            <div style={styles.detailSection}>
              <h3 style={styles.subHeader}>Personal Details</h3>
              <label style={styles.label}>Last Name</label>
              <input style={styles.input} value={userData.last_name} readOnly />

              <label style={styles.label}>First Name</label>
              <input style={styles.input} value={userData.first_name} readOnly />

              <label style={styles.label}>Middle Name</label>
              <input style={styles.input} value={userData.middle_name} readOnly />

              <label style={styles.label}>Role</label>
              <input style={styles.input} value="Project Manager" readOnly />
            </div>

            {/* Security Account */}
            <div style={styles.detailSection}>
              <h3 style={styles.subHeader}>Security Account</h3>
              <label style={styles.label}>ID NO</label>
              <input style={styles.input} value={userData.id_no || ""} readOnly />

              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                type="password"
                value="password"
                readOnly
              />
              <span style={styles.forgotLink}>Forgot Password</span>

              <label style={styles.label}>Email</label>
              <input style={styles.input} value={userData.email} readOnly />
            </div>
          </div>
        </div>
      </div>

      {/* Update Button */}
      <div style={{ textAlign: "right", marginTop: "10px" }}>
        <button style={styles.updateBtn}>Update Profile</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    color: "#333",
  },
  header: {
    display: "flex",
    alignItems: "center",
    fontSize: "18px",
    fontWeight: "600",
    borderBottom: "2px solid #5a0d0e",
    paddingBottom: "8px",
    marginBottom: "15px",
  },
  headerText: {
    fontSize: "18px",
    fontWeight: "600",
  },
  profileWrapper: {
    display: "flex",
    gap: "30px",
  },
  leftSection: {
    width: "25%",
  },
  rightSection: {
    flex: 1,
  },
  sectionTitle: {
    fontWeight: "600",
    marginBottom: "10px",
  },
  pictureBox: {
    border: "2px solid #ccc",
    borderRadius: "8px",
    width: "120px",
    height: "120px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "10px",
  },
  detailsWrapper: {
    display: "flex",
    justifyContent: "space-between",
    borderTop: "2px solid #ccc",
    paddingTop: "10px",
  },
  detailSection: {
    width: "45%",
    display: "flex",
    flexDirection: "column",
  },
  subHeader: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "10px",
  },
  label: {
    fontSize: "14px",
    marginBottom: "4px",
    marginTop: "8px",
  },
  input: {
    padding: "6px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginBottom: "6px",
    fontSize: "14px",
  },
  forgotLink: {
    fontSize: "12px",
    color: "#5a0d0e",
    cursor: "pointer",
    alignSelf: "flex-end",
    marginBottom: "10px",
  },
  updateBtn: {
    backgroundColor: "#5a0d0e",
    color: "white",
    padding: "8px 14px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Profile;
