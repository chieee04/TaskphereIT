// src/components/caps teams board/caps-teams-board.jsx
import React, { useState } from "react";
import boardIcon from "../../../assets/tasks-board-icon.png";
import searchIcon from "../../../assets/search-icon.png";
import calendarIcon from "../../../assets/calendar-icon.png";
import viewTaskIcon from "../../../assets/view-task-icon.png";
//import CapsViewTB from "./caps-view-tb";

const tasks = {
  "To Do": [
    {
      name: "Mendoza, Et Al",
      task: "Chapter 4",
      revision: "No Revision",
      dueDate: "Feb 25, 2025",
    },
    {
      name: "Addrialene M.",
      task: "Chapter 3 - Implementation",
      revision: "No Revision",
      dueDate: "Feb 15, 2025",
    },
    {
      name: "Justine P.",
      task: "Chapter 3",
      revision: "No Revision",
      dueDate: "Feb 13, 2025",
    },
  ],
  "In Progress": [
    {
      name: "Mendoza, Et Al",
      task: "Chapter 3",
      revision: "No Revision",
      dueDate: "Feb 20, 2025",
    },
    {
      name: "Alejandro F.",
      task: "Chapter 3 - Development",
      revision: "No Revision",
      dueDate: "Feb 9, 2025",
    },
    {
      name: "John Reagan S.",
      task: "Chapter 3",
      revision: "No Revision",
      dueDate: "Feb 11, 2025",
    },
  ],
  "To Review": [
    {
      name: "Julliana C.",
      task: "Chapter 3 - Implementation",
      revision: "No Revision",
      dueDate: "Feb 7, 2025",
    },
  ],
  "Missed Task": [],
};

const statusColors = {
  "To Do": "#FABC3F",
  "In Progress": "#809D3C",
  "To Review": "#578FCA",
  "Missed Task": "#D32F2F",
};

const AdviserTeamBoard = () => {
  const [viewTask, setViewTask] = useState(false);

  return (
    <div className="page-wrapper">
      {!viewTask ? (
        <>
          <h2 className="section-title">
            <img src={boardIcon} alt="Board Icon" className="icon-image" />
            Teams Board
          </h2>
          <hr className="divider" />

          <div className="search-wrapper">
            <div className="search-bar">
              <img src={searchIcon} alt="Search Icon" className="search-icon" />
              <input type="text" placeholder="Search" className="search-input" />
            </div>
          </div>

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
                              onClick={() => setViewTask(true)}
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
        </>
      ) : (
        <CapsViewTB />
      )}

      <style>{`
        * {
          box-sizing: border-box;
        }

        .page-wrapper {
          width: 100%;
          padding: 40px 20px;
        }

        .section-title {
          font-size: 20px;
          font-weight: bold;
          color: #3B0304;
          margin-bottom: 5px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .icon-image {
          width: 24px;
          height: 24px;
          object-fit: contain;
        }

        .divider {
          border: none;
          border-top: 2px solid #3B0304;
          margin-bottom: 20px;
        }

        .search-wrapper {
          display: flex;
          justify-content: flex-start;
          margin-bottom: 20px;
        }

        .search-bar {
          display: flex;
          align-items: center;
          background: #fff;
          border: 1px solid #3B0304;
          border-radius: 12px;
          padding: 6px 12px;
          width: 200px;
          gap: 6px;
        }

        .search-icon {
          width: 16px;
          height: 16px;
        }

        .search-input {
          border: none;
          outline: none;
          background: transparent;
          font-size: 14px;
          color: #3B0304;
          width: 100%;
        }

        .columns {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding-bottom: 10px;
        }

        .column {
          background: #f9f9f9;
          border-radius: 12px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
          min-width: 260px;
          max-width: 280px;
          flex-shrink: 0;
          border: 1px solid #B2B2B2;
          min-height: 500px;
          max-height: calc(100vh - 200px);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .column-title {
          color: white;
          text-align: center;
          font-size: 15px;
          padding: 10px;
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
        }

        .task-list {
          overflow-y: auto;
          padding: 12px;
        }

        .task-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08);
          display: flex;
          margin-bottom: 12px;
          overflow: hidden;
          border: 1px solid #B2B2B2;
        }

        .status-line {
          width: 16px;
          flex-shrink: 0;
        }

        .card-content {
          padding: 10px;
          flex: 1;
          font-size: 13px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .view-task-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .view-task-button img {
          width: 16px;
          height: 16px;
        }

        .card-content p {
          margin: 2px 0;
        }

        .due-date {
          margin-top: 4px;
          font-size: 12px;
          color: #3B0304;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .calendar-icon {
          width: 14px;
          height: 14px;
        }

        .task-divider {
          border: none;
          border-top: 1px solid #3B0304;
          margin: 6px 0;
        }

        .columns::-webkit-scrollbar {
          height: 8px;
        }

        .columns::-webkit-scrollbar-thumb {
          background-color: #ccc;
          border-radius: 4px;
        }

        .columns::-webkit-scrollbar-track {
          background-color: transparent;
        }

        .task-list::-webkit-scrollbar {
          width: 6px;
        }

        .task-list::-webkit-scrollbar-thumb {
          background-color: #ccc;
          border-radius: 4px;
        }

        .task-list::-webkit-scrollbar-track {
          background-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default AdviserTeamBoard;
