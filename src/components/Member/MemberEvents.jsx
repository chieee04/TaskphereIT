// src/components/MemberEvents.jsx
import React from "react";
import fileIcon from "../../assets/file-type-icon.png";
import "../Style/Member/MemberEvents.css"; // hiwalay na css file

const MemberEvents = () => {
  return (
    <div className="events-wrapper">
      {/* Header */}
      <h2 className="section-title">Events</h2>
      <hr className="divider" />

      {/* Manuscript Results */}
      <h3 className="results-header">Manuscript Results</h3>
      <div className="results-box">
        <div className="results-table">
          <div className="row header">
            <div className="header-cell">No</div>
            <div className="header-cell">Team</div>
            <div className="header-cell">Title</div>
            <div className="header-cell">Due Date</div>
            <div className="header-cell">Time</div>
            <div className="header-cell">Plagiarism</div>
            <div className="header-cell">AI</div>
            <div className="header-cell">File Uploaded</div>
            <div className="header-cell">Status</div>
          </div>
          <div className="row">
            <div className="cell">1.</div>
            <div className="cell">Mendoza, Et Al</div>
            <div className="cell">TaskSphere IT</div>
            <div className="cell">Mar 25, 2025</div>
            <div className="cell">8:00 AM</div>
            <div className="cell" style={{ color: "#3B0304" }}>6%</div>
            <div className="cell" style={{ color: "#3B0304" }}>6%</div>
            <div className="cell">
              <img
                src={fileIcon}
                alt="File Icon"
                style={{ width: "20px", height: "20px" }}
              />{" "}
              Mendoza.pdf
            </div>
            <div className="cell">
              <span className="status-passed">Passed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Oral Defense */}
      <h3 className="defense-header">Oral Defense</h3>
      <div className="oral-defense-card">
        <div className="team-name">Mendoza, Et Al</div>

        <div className="defense-row">
          <div className="left-label">Title:</div>
          <div className="right-label">Panelists:</div>
        </div>
        <div className="defense-row">
          <div className="left-value">TaskSphere IT</div>
          <div className="right-value">Anderson F. Dashiell</div>
        </div>
        <div className="defense-row">
          <div className="left-label">Date:</div>
          <div className="right-value">Adam B. Apostol</div>
        </div>
        <div className="defense-row">
          <div className="left-value">March 31, 2025</div>
          <div className="right-value">Von Jacob P. Yu</div>
        </div>
        <div className="defense-row">
          <div className="left-label">Time:</div>
          <div className="right-label">Status:</div>
        </div>
        <div className="defense-row">
          <div className="left-value">1:00 PM - 3:00 PM</div>
          <div className="right-value">
            <span className="status-pending">Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberEvents;
