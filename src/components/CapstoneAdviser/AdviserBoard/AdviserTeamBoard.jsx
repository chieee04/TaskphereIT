// src/components/caps teams board/caps-teams-board.jsx
import React, { useState, useEffect } from "react";
import boardIcon from "../../../assets/tasks-board-icon.png";
import searchIcon from "../../../assets/search-icon.png";
import calendarIcon from "../../../assets/calendar-icon.png";
import viewTaskIcon from "../../../assets/view-task-icon.png";
import { supabase } from "../../../supabaseClient";
import AdviserViewBoard from "./AdviserViewBoard";

const statusColors = {
  "To Do": "#FABC3F",
  "In Progress": "#809D3C",
  "To Review": "#578FCA",
  "Missed Task": "#D32F2F",
};

const AdviserTeamBoard = () => {
  const [viewTask, setViewTask] = useState(null); // ❗ store selected task object
  const [tasksByStatus, setTasksByStatus] = useState({
    "To Do": [],
    "In Progress": [],
    "To Review": [],
    "Missed Task": [],
  });

  // 🔄 Fetch adviser tasks from Supabase
  useEffect(() => {
    const fetchTasks = async () => {
      const storedUser = localStorage.getItem("customUser");
      if (!storedUser) return;

      const adviser = JSON.parse(storedUser);

      // ✅ Adviser only
      if (parseInt(adviser.user_roles) !== 3) return;

      const { data, error } = await supabase
        .from("adviser_oral_def")
        .select("*")
        .eq("adviser_id", adviser.id);

      if (error) {
        console.error("Error fetching tasks:", error);
        return;
      }

      // ✅ Group by status
      const grouped = {
        "To Do": [],
        "In Progress": [],
        "To Review": [],
        "Missed Task": [],
      };

      data.forEach((task) => {
        const status = (task.status || "To Do").trim();
        if (!grouped[status]) grouped[status] = [];
        grouped[status].push(task);
      });

      setTasksByStatus(grouped);
    };

    fetchTasks();
  }, []);

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
            {Object.entries(tasksByStatus).map(([status, items]) => (
              <div className="column" key={status}>
                <div
                  className="column-title"
                  style={{ backgroundColor: statusColors[status] }}
                >
                  {status}
                </div>
                <div className="task-list">
                  {items.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">No tasks</p>
                  ) : (
                    items.map((task, index) => {
                      const taskLines = (task.task || "").split(" - ");
                      return (
                        <div className="task-card" key={index}>
                          <div
                            className="status-line"
                            style={{ backgroundColor: statusColors[status] }}
                          ></div>
                          <div className="card-content">
                            <div className="card-header">
                              <strong>{task.group_name}</strong>
                              <button
                                className="view-task-button"
                                onClick={() => setViewTask(task)} // ❗ pass task to view
                                title="View Task"
                              >
                                <img src={viewTaskIcon} alt="View Task" />
                              </button>
                            </div>
                            <hr className="task-divider" />

                            {/* Task / Subtask */}
                            {taskLines.map((line, idx) => (
                              <p key={idx}>{line}</p>
                            ))}
                            <p>{task.subtask || "No Subtask"}</p>

                            {/* Comment */}
                            <p>{task.comment || "No Comment"}</p>

                            <hr className="task-divider" />

                            {/* Due Date */}
                            <p className="due-date">
                              <img
                                src={calendarIcon}
                                alt="Calendar"
                                className="calendar-icon"
                              />
                              <strong>
                                {task.due_date
                                  ? new Date(task.due_date).toLocaleDateString()
                                  : "No Due Date"}
                              </strong>
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <AdviserViewBoard task={viewTask} onBack={() => setViewTask(null)} />
      )}
    </div>
  );
};

export default AdviserTeamBoard;
