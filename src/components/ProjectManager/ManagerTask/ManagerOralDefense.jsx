// src/components/tasks/oral-defense-tasks.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import "../../Style/ProjectManager/ManagerOralDefense.css";

import taskIcon from "../../../assets/tasks-icon.png";
import createTasksIcon from "../../../assets/create-tasks-icon.png";
import dueDateIcon from "../../../assets/due-date-icon.png";
import timeIcon from "../../../assets/time-icon.png";

import { openCreateOralDefTask } from "../../../services/Manager/ManagerCreateOralDef";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const customUser = JSON.parse(localStorage.getItem("customUser"));
const managerId = customUser?.uuid; // 🔹 gamitin na ang uuid


const ManagerOralDefense = () => {
  const [tasks, setTasks] = useState([]);

  const STATUS_OPTIONS = ["To Do", "In Progress", "To Review", "Completed"];
  const REVISION_OPTIONS = Array.from({ length: 11 }, (_, i) => {
    if (i === 0) return "No Revision"; // 0
    if (i === 1) return "1st Revision";
    if (i === 2) return "2nd Revision";
    if (i === 3) return "3rd Revision";
    return `${i}th Revision`;
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

  // ✅ Fetch Oral Defense Tasks from Supabase
  const fetchTasks = async () => {
  const customUser = JSON.parse(localStorage.getItem("customUser"));
  const managerId = customUser?.id; // adjust kung iba yung PK column mo

  if (!managerId) {
    console.warn("⚠️ Walang managerId sa customUser:", customUser);
    return;
  }

  try {
    const { data, error } = await supabase
      .from("manager_oral_task")
      .select(`
        id,
        task,
        subtask,
        element,
        due_date,
        time,
        created_at,
        methodology,
        project_phase,
        revision,
        status,
        task_type,
        comment,
        manager_id,
        member:user_credentials!manager_oral_task_member_id_fkey(first_name,last_name)
      `)
      .eq("manager_id", managerId)
      .neq("status", "Completed")
      .order("created_at", { ascending: false });

    console.log("📌 DEBUG FETCH RESULT =====================");
    console.log("Manager ID:", managerId);
    console.log("customUser:", customUser);
    console.log("Raw Data:", data);
    console.log("Error:", error);
    console.log("==========================================");

    if (error) {
      console.error("❌ Supabase fetch error:", error.message || error);
      return;
    }

    if (!data || data.length === 0) {
      console.warn("⚠️ Walang tasks nakuha para sa manager:", managerId);
    }

    setTasks(data || []);
  } catch (err) {
    console.error("❌ Unexpected fetch error:", err);
  }
};

  useEffect(() => {
  // unang fetch para may data agad
  fetchTasks();

  // setInterval para auto-refresh every 60s
  const interval = setInterval(() => {
    fetchTasks();
  }, 60000);

  // cleanup para hindi mag-leak memory kapag nag-unmount
  return () => clearInterval(interval);
}, []);

  // ✅ Update Revision
  const handleRevisionChange = async (taskId, revisionText) => {
    const revisionInt = parseInt(revisionText);
    const { error } = await supabase
      .from("manager_oral_task")
      .update({ revision: revisionInt })
      .eq("id", taskId);

    if (error) {
      console.error("❌ Update revision error:", error);
    } else {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, revision: revisionInt } : t
        )
      );
    }
  };
  // ✅ Update Status
  // ✅ Update Status
const handleStatusChange = async (taskId, newStatus) => {
  if (newStatus === "Completed") {
    const result = await MySwal.fire({
      title: "Is this task completed?",
      text: "Once confirmed, this task will be marked as completed.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return; // ❌ user cancelled
    }

    // ✅ Get today's date only (YYYY-MM-DD)
    const today = new Date().toISOString().split("T")[0];

    const { error } = await supabase
      .from("manager_oral_task")
      .update({ status: newStatus, date_completed: today })
      .eq("id", taskId);

    if (error) {
      console.error("❌ Update status error:", error);
      MySwal.fire("Error", "Failed to update status.", "error");
    } else {
      // ✅ Remove from UI after completed
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      MySwal.fire("Completed!", "Task has been marked as completed.", "success");
    }
  } else {
    // Normal update kapag hindi Completed
    const { error } = await supabase
      .from("manager_oral_task")
      .update({ status: newStatus })
      .eq("id", taskId);

    if (error) {
      console.error("❌ Update status error:", error);
      MySwal.fire("Error", "Failed to update status.", "error");
    } else {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, status: newStatus } : t
        )
      );
    }
  }
};

  // ✅ Handle Create Task (refresh tasks after creation)
  const handleCreateTask = async () => {
  // ✅ Pass managerId (uuid) directly
const newTasks = await openCreateOralDefTask(managerId);


  if (newTasks && Array.isArray(newTasks)) {
    // Append new tasks to current state
    setTasks((prev) => [...newTasks, ...prev]);
  }
};
  return (
    <div className="page-wrapper">
      <h2 className="section-title">
        <img src={taskIcon} alt="Tasks Icon" className="icon-image" />
        Oral Defense
      </h2>
      <hr className="divider" />

      <div className="header-wrapper">
        {/* Create Task Button */}
        <button
          type="button"
          className="create-task-button"
          onClick={handleCreateTask}
        >
          <img
            src={createTasksIcon}
            alt="Create Task Icon"
            className="create-task-icon"
          />
          Create Task
        </button>

        {/* ✅ TASKS TABLE */}
        <div className="tasks-container">
          <table className="tasks-table">
            <thead>
              <tr>
                <th className="center-text">NO</th>
                <th className="center-text">Assigned</th>
                <th className="center-text">Tasks</th>
                <th className="center-text">Subtasks</th>
                <th className="center-text">Elements</th>
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
              {tasks.map((task, idx) => (
                <tr key={task.id}>
                  <td className="center-text">{idx + 1}.</td>
                  <td className="center-text">
                    {task.member?.first_name} {task.member?.last_name}
                  </td>
                  <td className="center-text">{task.task}</td>
                  <td className="center-text">{task.subtask}</td>
                  <td className="center-text">{task.element}</td>
                  <td className="center-text">{task.created_at}</td>
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
                    {task.time}
                  </td>

                  {/* Revision Dropdown */}
                  <td className="center-text">
                    <select
                      value={task.revision}
                      onChange={(e) =>
                        handleRevisionChange(task.id, e.target.value)
                      }
                    >
                      {REVISION_OPTIONS.map((label, i) => (
                        <option key={i} value={i}>{label}</option>
                      ))}
                    </select>
                  </td>

                  {/* Status Dropdown */}
                  <td className="center-text">
  {task.status === "Missed" ? (
    <span
      style={{
        backgroundColor: "red",
        color: "#fff",
        padding: "2px 8px",
        borderRadius: "5px",
        fontWeight: "600",
      }}
    >
      {task.status}
    </span>
  ) : (
    <select
      style={{
        backgroundColor: getStatusColor(task.status),
        color: "#fff",
        padding: "2px 5px",
        borderRadius: "5px",
      }}
      value={task.status}
      onChange={(e) => handleStatusChange(task.id, e.target.value)}
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  )}
</td>

                  <td className="center-text">{task.methodology}</td>
                  <td className="center-text">{task.project_phase}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerOralDefense;
