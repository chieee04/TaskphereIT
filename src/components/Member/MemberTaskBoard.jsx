import React from "react";
import { useNavigate } from "react-router-dom";

// Icons
import boardIcon from "../../assets/tasks-board-icon.png";
import searchIcon from "../../assets/search-icon.png";
import calendarIcon from "../../assets/calendar-icon.png";
import viewTaskIcon from "../../assets/view-task-icon.png";

// Styles
import "../Style/Member/MemberTaskBoard.css";

const tasks = {
  "To Do": [
    { name: "Mendoza, Et Al", task: "Chapter 4", revision: "No Revision", dueDate: "Feb 25, 2025" },
    { name: "Addrialene M.", task: "Chapter 3 - Implementation", revision: "No Revision", dueDate: "Feb 15, 2025" },
    { name: "Justine P.", task: "Chapter 3", revision: "No Revision", dueDate: "Feb 13, 2025" },
  ],
  "In Progress": [
    { name: "Mendoza, Et Al", task: "Chapter 3", revision: "No Revision", dueDate: "Feb 20, 2025" },
    { name: "Alejandro F.", task: "Chapter 3 - Development", revision: "No Revision", dueDate: "Feb 9, 2025" },
    { name: "John Reagan S.", task: "Chapter 3", revision: "No Revision", dueDate: "Feb 11, 2025" },
  ],
  "To Review": [
    { name: "Julliana C.", task: "Chapter 3 - Implementation", revision: "No Revision", dueDate: "Feb 7, 2025" },
  ],
  "Missed Task": [],
};

const statusColors = {
  "To Do": "#FABC3F",
  "In Progress": "#809D3C",
  "To Review": "#578FCA",
  "Missed Task": "#D32F2F",
};

const MemberTaskBoard = () => {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      <h2 className="section-title">
        <img src={boardIcon} alt="Board Icon" className="icon-image" />
        Tasks Board
      </h2>
      <hr className="divider" />

      {/* 🔍 Search */}
      <div className="search-wrapper">
        <div className="search-bar">
          <img src={searchIcon} alt="Search Icon" className="search-icon" />
          <input type="text" placeholder="Search" className="search-input" />
        </div>
      </div>

      {/* 📋 Columns */}
      <div className="columns">
        {Object.entries(tasks).map(([status, items]) => (
          <div className="column" key={status}>
            <div
              className="column-title"
              style={{ backgroundColor: statusColors[status] }}
            >
              {status}
            </div>
            <div className="task-list">
              {items.map((task, index) => {
                const taskLines = task.task.split(" - ");
                return (
                  <div className="task-card" key={index}>
                    <div
                      className="status-line"
                      style={{ backgroundColor: statusColors[status] }}
                    ></div>
                    <div className="card-content">
                      <div className="card-header">
                        <strong>{task.name}</strong>
                        <button
                          className="view-task-button"
                          onClick={() => navigate("/view-tasksboard")}
                          title="View Task"
                        >
                          <img src={viewTaskIcon} alt="View Task" />
                        </button>
                      </div>
                      <hr className="task-divider" />
                      {taskLines.map((line, idx) => (
                        <p key={idx}>{line}</p>
                      ))}
                      <p>{task.revision}</p>
                      <hr className="task-divider" />
                      <p className="due-date">
                        <img
                          src={calendarIcon}
                          alt="Calendar"
                          className="calendar-icon"
                        />
                        <strong>{task.dueDate}</strong>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberTaskBoard;
