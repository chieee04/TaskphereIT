// ManagerTaskBoard.jsx
import React, { useState, useEffect } from "react";
import boardIcon from "../../../assets/tasks-board-icon.png";
import searchIcon from "../../../assets/search-icon.png";
import viewTaskIcon from "../../../assets/view-task-icon.png";
import { supabase } from "../../../supabaseClient";
import "bootstrap/dist/css/bootstrap.min.css";

const statusColors = {
  "To Do": "#FABC3F",
  "In Progress": "#809D3C",
  "To Review": "#578FCA",
  "Completed": "#AA60C8",
  "Missed": "#D32F2F",
};

const ManagerTaskBoard = () => {
  const [viewTask, setViewTask] = useState(null);
  const [allTasks, setAllTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tasksByStatus, setTasksByStatus] = useState({
    "To Do": [],
    "In Progress": [],
    "To Review": [],
    "Completed": [],
    "Missed": [],
  });

  // ✅ Fetch tasks created by the logged-in Manager
  useEffect(() => {
    const fetchTasks = async () => {
      const storedUser = localStorage.getItem("customUser");
      if (!storedUser) {
        console.warn("⚠️ No logged-in user found in localStorage");
        return;
      }

      const manager = JSON.parse(storedUser);
      console.log("👤 Logged-in Manager:", manager);

      const { data, error } = await supabase
        .from("manager_title_task")
        .select("*") // ✅ kunin lahat muna for debugging
        .eq("manager_id", manager.id);

      if (error) {
        console.error("❌ Error fetching manager tasks:", error);
        return;
      }

      console.log("✅ Raw tasks fetched:", data);

      setAllTasks(data);
      groupTasksByStatus(data);
    };

    fetchTasks();
  }, []);

  // ✅ Group tasks by status
  const groupTasksByStatus = (tasks) => {
    const grouped = {
      "To Do": [],
      "In Progress": [],
      "To Review": [],
      "Completed": [],
      "Missed": [],
    };

    tasks.forEach((task) => {
      let status = (task.status || "To Do").trim();
      if (!grouped[status]) status = "Missed";
      grouped[status].push(task);
    });

    console.log("📌 Grouped Tasks:", grouped);
    setTasksByStatus(grouped);
  };

  // ✅ Apply search filter
  useEffect(() => {
    const filtered = allTasks.filter((task) =>
      task.task_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    groupTasksByStatus(filtered);
  }, [searchTerm, allTasks]);

  return (
    <div className="container mt-4 adviser-board">
      {!viewTask ? (
        <>
          {/* Header */}
          <div className="d-flex align-items-center mb-3">
            <img
              src={boardIcon}
              alt="Board Icon"
              style={{ width: "24px", marginRight: "10px" }}
            />
            <h2 className="m-0 fs-5 fw-bold">Manager Task Board</h2>
          </div>
          <hr />

          {/* Search Bar */}
          <div className="mb-4">
            <div className="input-group" style={{ maxWidth: "300px" }}>
              <span className="input-group-text">
                <img src={searchIcon} alt="Search" style={{ width: "18px" }} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search task name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Task Columns */}
          <div className="d-flex gap-3 overflow-auto">
            {Object.entries(tasksByStatus).map(([status, items]) => (
              <div
                className="flex-shrink-0"
                style={{ width: "280px" }}
                key={status}
              >
                <div
                  className="text-white px-3 py-2 rounded-top fs-6 fw-bold"
                  style={{ backgroundColor: statusColors[status] }}
                >
                  {status}
                </div>

                <div className="bg-light p-2 rounded-bottom">
                  {items.length === 0 ? (
                    <p className="fst-italic text-muted small">No tasks</p>
                  ) : (
                    items.map((task, index) => {
                      const borderColor = statusColors[status];

                      return (
                        <div
                          className="position-relative bg-white mb-3 p-3 rounded shadow-sm"
                          key={index}
                          style={{ borderLeft: `6px solid ${borderColor}` }}
                        >
                          {/* View Button */}
                          <button
                            onClick={() => setViewTask(task)}
                            title="View Task"
                            className="position-absolute top-0 end-0 m-2 btn btn-sm btn-light p-1 border-0"
                          >
                            <img
                              src={viewTaskIcon}
                              alt="View Task"
                              style={{ width: "18px" }}
                            />
                          </button>

                          <strong className="fs-6">
                            {task.assigned_to || "No Member"}
                          </strong>
                          <hr
                            style={{
                              margin: "7px 0",
                              borderColor: "maroon",
                              borderWidth: "2px",
                            }}
                          />
                          <p className="mb-1">{task.task_name}</p>
                          <p className="mb-1">
                            {task.subtask || "No Subtask"}
                          </p>
                          <hr
                            style={{
                              margin: "4px 0",
                              borderColor: "maroon",
                              borderWidth: "2px",
                            }}
                          />
                          <div className="d-flex align-items-center gap-2 small">
                            <span
                              style={{
                                display: "inline-block",
                                width: "12px",
                                height: "12px",
                                backgroundColor: "red",
                                borderRadius: "50%",
                              }}
                            ></span>
                            <strong>
                              {task.due_date
                                ? new Date(task.due_date).toLocaleDateString()
                                : "No Due Date"}{" "}
                              {task.due_time ? task.due_time : ""}
                            </strong>
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
        <div>
          <button
            onClick={() => setViewTask(null)}
            className="btn btn-secondary mb-3"
          >
            ← Back
          </button>
          <h4>{viewTask.task_name}</h4>
          <p>Assigned to: {viewTask.assigned_to || "No Member"}</p>
          <p>Due: {viewTask.due_date}</p>
          <p>Status: {viewTask.status}</p>
        </div>
      )}
    </div>
  );
};

export default ManagerTaskBoard;
