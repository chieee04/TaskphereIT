// src/components/tasks-record.jsx

import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import taskIcon from "../../assets/tasks-record-icon.png";
import recordIcon from "../../assets/records-icon.png";
import "../Style/Member/MemberTaskRecord.css"; // import external css

const MemberTaskRecord = () => {
  const [status, setStatus] = useState("To Review");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const statusDropdownRef = useRef(null);
  const navigate = useNavigate();

  const STATUS_OPTIONS = ["To Do", "In Progress", "To Review", "Missed"];

  const getStatusColor = (value) => {
    switch (value) {
      case "To Do": return "#FABC3F";
      case "In Progress": return "#809D3C";
      case "To Review": return "#578FCA";
      case "Missed": return "#D32F2F";
      default: return "#ccc";
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setShowStatusDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="tasks-record-wrapper">
      <h2 className="section-title">
        <img src={taskIcon} alt="Tasks Record Icon" className="section-icon" />
        Tasks Record
      </h2>
      <hr className="divider" />

      <div className="tasks-record-container">
        <div className="task-card" onClick={() => handleCardClick('/title-tasks-record')}>
          <div className="task-card-icon">
            <img src={recordIcon} alt="Title Defense Icon" className="card-icon" />
          </div>
          <div className="task-card-header">
            <h3 className="task-title">Title<br />Defense</h3>
          </div>
        </div>

        <div className="task-card" onClick={() => handleCardClick('/oral-tasks-record')}>
          <div className="task-card-icon">
            <img src={recordIcon} alt="Oral Defense Icon" className="card-icon" />
          </div>
          <div className="task-card-header">
            <h3 className="task-title">Oral<br />Defense</h3>
          </div>
        </div>

        <div className="task-card" onClick={() => handleCardClick('/final-tasks-record')}>
          <div className="task-card-icon">
            <img src={recordIcon} alt="Final Defense Icon" className="card-icon" />
          </div>
          <div className="task-card-header">
            <h3 className="task-title">Final<br />Defense</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberTaskRecord;
