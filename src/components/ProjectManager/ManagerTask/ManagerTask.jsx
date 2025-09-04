import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import tasksIcon from "../../../assets/tasks-icon.png";
import recordIcon from "../../../assets/records-icon.png";
import taskAllocationIcon from "../../../assets/task-allocation-icon.png";

import "../../Style/ProjectManager/ManagerTask.css"; // ⬅️ hiwalay na CSS

export default function Tasks() {
  const [status, setStatus] = useState("To Review");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const statusDropdownRef = useRef(null);
  const navigate = useNavigate();

  const STATUS_OPTIONS = ["To Do", "In Progress", "To Review", "Missed"];

  const getStatusColor = (value) => {
    switch (value) {
      case "To Do":
        return "#FABC3F";
      case "In Progress":
        return "#809D3C";
      case "To Review":
        return "#578FCA";
      case "Missed":
        return "#D32F2F";
      default:
        return "#ccc";
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target)
      ) {
        setShowStatusDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="tasks-record-wrapper">
      <h2 className="section-title">
        <img src={tasksIcon} alt="Tasks Icon" className="section-icon" />
        Tasks
      </h2>
      <hr className="divider" />

      <div className="tasks-record-container">
        {/* Title Defense Card */}
        <div
          className="task-card"
          onClick={() => handleCardClick("/title-tasks-record")}
        >
          <div className="task-card-icon">
            <img
              src={recordIcon}
              alt="Title Defense Icon"
              className="card-icon"
            />
          </div>
          <div className="task-card-header">
            <h3 className="task-title">
              Title
              <br />
              Defense
            </h3>
          </div>
        </div>

        {/* Oral Defense Card */}
        <div
          className="task-card"
          onClick={() => handleCardClick("/oral-tasks-record")}
        >
          <div className="task-card-icon">
            <img
              src={recordIcon}
              alt="Oral Defense Icon"
              className="card-icon"
            />
          </div>
          <div className="task-card-header">
            <h3 className="task-title">
              Oral
              <br />
              Defense
            </h3>
          </div>
        </div>

        {/* Final Defense Card */}
        <div
          className="task-card"
          onClick={() => handleCardClick("/final-tasks-record")}
        >
          <div className="task-card-icon">
            <img
              src={recordIcon}
              alt="Final Defense Icon"
              className="card-icon"
            />
          </div>
          <div className="task-card-header">
            <h3 className="task-title">
              Final
              <br />
              Defense
            </h3>
          </div>
        </div>

        {/* Task Allocation Card */}
        <div
          className="task-card"
          onClick={() => handleCardClick("/task-allocation")}
        >
          <div className="task-card-icon">
            <img
              src={taskAllocationIcon}
              alt="Task Allocation Icon"
              className="card-icon"
            />
          </div>
          <div className="task-card-header">
            <h3 className="task-title">Tasks Allocation</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
