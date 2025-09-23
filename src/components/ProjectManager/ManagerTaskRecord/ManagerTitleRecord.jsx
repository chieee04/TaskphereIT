// src/components/tasks/pm-title-record.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import taskIcon from "../../../assets/tasks-icon.png";
import dueDateIcon from "../../../assets/due-date-icon.png";
import timeIcon from "../../../assets/time-icon.png";
import "../../Style/ProjectManager/ManagerTitleRecord.css";

const ManagerTitleRecord = () => {
  const [tasks, setTasks] = useState([]);

  const STATUS_OPTIONS = ["To Do", "In Progress", "To Review", "Completed"];
  const REVISION_OPTIONS = Array.from({ length: 10 }, (_, i) => {
    const num = i + 1;
    if (num === 1) return "1st Revision";
    if (num === 2) return "2nd Revision";
    if (num === 3) return "3rd Revision";
    return `${num}th Revision`;
  });

  const getStatusColor = (value) => {
    switch (value) {
      case "To Do":
        return "#FABC3F";
      case "In Progress":
        return "#809D3C";
      case "To Review":
        return "#578FCA";
      case "Completed":
        return "#AA60C8";
      default:
        return "#ccc";
    }
  };

  // ✅ Fetch tasks only for logged-in manager
  // ✅ Fetch only Completed tasks for logged-in manager
const fetchTasks = async () => {
  const storedUser = JSON.parse(localStorage.getItem("customUser"));
  if (!storedUser) {
    console.error("❌ No customUser found in localStorage");
    return;
  }

  const managerId = storedUser.id; // UUID ng logged-in manager
  console.log("🟢 Logged-in Manager UUID:", managerId);

  const { data, error } = await supabase
    .from("manager_title_task")
    .select(
      `
      id,
      task_name,
      due_date,
      due_time,
      created_date,
      created_time,
      methodology,
      project_phase,
      revision,
      status,
      manager_id,
      member:user_credentials!manager_title_task_member_id_fkey(first_name, last_name)
    `
    )
    .eq("manager_id", managerId)   // 🔥 tasks for this manager only
    .eq("status", "Completed");    // 🔥 only Completed

  if (error) {
    console.error("❌ Fetch error:", error);
  } else {
    console.log("✅ Completed tasks fetched:", data);
    setTasks(data);
  }
};


  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ Update status
  const handleStatusChange = async (taskId, newStatus) => {
    const { error } = await supabase
      .from("manager_title_task")
      .update({ status: newStatus })
      .eq("id", taskId);

    if (error) {
      console.error("❌ Update status error:", error);
    } else {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
    }
  };

  // ✅ Update revision
  const handleRevisionChange = async (taskId, revisionText) => {
    const revisionInt = parseInt(revisionText);
    const { error } = await supabase
      .from("manager_title_task")
      .update({ revision: revisionInt })
      .eq("id", taskId);

    if (error) {
      console.error("❌ Update revision error:", error);
    } else {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, revision: revisionInt } : t))
      );
    }
  };

  return (
    <div className="page-wrapper">
      <h2 className="section-title">
        <img src={taskIcon} alt="Tasks Icon" className="icon-image" />
        Title Defense Records
      </h2>
      <hr className="divider" />

      <div className="header-wrapper">
        <div className="tasks-container">
          <table className="tasks-table">
            <thead>
              <tr>
                <th className="center-text">NO</th>
                <th className="center-text">Assigned</th>
                <th className="center-text">Tasks</th>
                <th className="center-text">Date Created</th>
                <th className="center-text">Due Date</th>
                <th className="center-text">Time</th>
                <th className="center-text">Revision No.</th>
                <th className="center-text">Status</th>
                <th className="center-text">Methodology</th>
                <th className="center-text">Project Phase</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="10" className="center-text">
                    No tasks assigned to you yet
                  </td>
                </tr>
              ) : (
                tasks.map((task, idx) => (
                  <tr key={task.id}>
                    <td className="center-text">{idx + 1}.</td>
                    <td className="center-text">
                      {task.member?.first_name} {task.member?.last_name}
                    </td>
                    <td className="center-text">{task.task_name}</td>
                    <td className="center-text">{task.created_date}</td>
                    <td className="center-text">
                      <img
                        src={dueDateIcon}
                        alt="Due Date"
                        className="inline-icon"
                      />
                      {task.due_date}
                    </td>
                    <td className="center-text">
                      <img src={timeIcon} alt="Time" className="inline-icon" />
                      {task.due_time}
                    </td>

                    {/* Revision Dropdown */}
                    <td className="center-text">
                      <select
                        value={task.revision}
                        onChange={(e) =>
                          handleRevisionChange(task.id, e.target.value)
                        }
                      >
                        {REVISION_OPTIONS.map((opt, i) => (
                          <option key={i + 1} value={i + 1}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Status Dropdown */}
                    <td className="center-text">
                      <select
                        value={task.status}
                        style={{
                          backgroundColor: getStatusColor(task.status),
                          color: "#fff",
                        }}
                        onChange={(e) =>
                          handleStatusChange(task.id, e.target.value)
                        }
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="center-text">{task.methodology}</td>
                    <td className="center-text">{task.project_phase}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerTitleRecord;
