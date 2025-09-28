// src/components/tasks/ManagerOralRecord.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import taskIcon from "../../../assets/tasks-icon.png";
import dueDateIcon from "../../../assets/due-date-icon.png";
import timeIcon from "../../../assets/time-icon.png";
import searchIcon from "../../../assets/search-icon.png";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../../Style/ProjectManager/ManagerOralRecord.css";

const MySwal = withReactContent(Swal);

const ManagerOralRecord = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const STATUS_OPTIONS = ["To Do", "In Progress", "To Review", "Completed"];
  const REVISION_OPTIONS = ["No Revision"].concat(
    Array.from({ length: 10 }, (_, i) => {
      const num = i + 1;
      if (num === 1) return "1st Revision";
      if (num === 2) return "2nd Revision";
      if (num === 3) return "3rd Revision";
      return `${num}th Revision`;
    })
  );

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

  // ✅ Fetch only Completed tasks
  const fetchTasks = async () => {
    const storedUser = JSON.parse(localStorage.getItem("customUser"));
    if (!storedUser) {
      console.error("❌ No customUser found in localStorage");
      return;
    }
    const managerId = storedUser.id;

    const { data, error } = await supabase
      .from("manager_oral_task")
      .select(
        `
        id,
        subtask,
        element,
        due_date,
        time,
        status,
        comment,
        created_at,
        revision,
        date_completed,
        methodology,
        project_phase,
        manager_id,
        member:user_credentials!manager_oral_task_member_id_fkey(first_name, last_name)
      `
      )
      .eq("manager_id", managerId)
      .eq("status", "Completed")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Fetch error:", error);
    } else {
      setTasks(data);
      setFilteredTasks(data);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ Search filter
  useEffect(() => {
    let filtered = tasks;
    if (searchTerm.trim() !== "") {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          `${t.member?.first_name} ${t.member?.last_name}`
            .toLowerCase()
            .includes(lower) ||
          t.subtask?.toLowerCase().includes(lower) ||
          t.element?.toLowerCase().includes(lower) ||
          t.methodology?.toLowerCase().includes(lower) ||
          t.project_phase?.toLowerCase().includes(lower)
      );
    }
    setFilteredTasks(filtered);
  }, [tasks, searchTerm]);

  // ✅ Update revision
  const handleRevisionChange = async (taskId, revisionIndex) => {
    const { error } = await supabase
      .from("manager_oral_task")
      .update({ revision: revisionIndex })
      .eq("id", taskId);

    if (error) {
      console.error("❌ Update revision error:", error);
    } else {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, revision: revisionIndex } : t))
      );
    }
  };

  // ✅ Update status
  const handleStatusChange = async (taskId, newStatus) => {
    const { error } = await supabase
      .from("manager_oral_task")
      .update({ status: newStatus })
      .eq("id", taskId);

    if (error) {
      console.error("❌ Update status error:", error);
    } else {
      fetchTasks(); // refresh (mawawala kapag hindi na Completed)
    }
  };

  return (
    <div className="page-wrapper">
      <h2 className="section-title">
        <img src={taskIcon} alt="Tasks Icon" className="icon-image" />
        Oral Defense Records
      </h2>
      <hr className="divider" />

      {/* 🔎 Search */}
      <div className="header-wrapper">
        <div className="search-wrapper">
          <img src={searchIcon} alt="Search" className="search-icon" />
          <input
            type="text"
            placeholder="Search tasks or members..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 📌 Table */}
      <div className="tasks-container">
        <table className="tasks-table">
          <thead>
            <tr>
              <th>NO</th>
              <th>Assigned</th>
              <th>Subtasks</th>
              <th>Elements</th>
              <th>Date Created</th>
              <th>Due Date</th>
              <th>Time</th>
              <th>Date Completed</th>
              <th>Revision No.</th>
              <th>Status</th>
              <th>Methodology</th>
              <th>Project Phase</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan="13" className="center-text">
                  No completed oral defense tasks yet
                </td>
              </tr>
            ) : (
              filteredTasks.map((task, idx) => (
                <tr key={task.id}>
                  <td>{idx + 1}.</td>
                  <td>
                    {task.member?.first_name} {task.member?.last_name}
                  </td>
                  <td>{task.subtask}</td>
                  <td>{task.element}</td>
                  <td>{new Date(task.created_at).toISOString().split("T")[0]}</td>
                  <td>
                    <img src={dueDateIcon} alt="Due Date" className="inline-icon" />
                    {task.due_date}
                  </td>
                  <td>
                    <img src={timeIcon} alt="Time" className="inline-icon" />
                    {task.time}
                  </td>
                  <td>
                    {task.date_completed
                      ? new Date(task.date_completed).toISOString().split("T")[0]
                      : "-"}
                  </td>

                  {/* Revision Dropdown */}
                  <td>
                    <select
                      value={task.revision ?? 0}
                      onChange={(e) =>
                        handleRevisionChange(task.id, parseInt(e.target.value))
                      }
                    >
                      {REVISION_OPTIONS.map((opt, i) => (
                        <option key={i} value={i}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Status Dropdown */}
                  <td>
                    <select
                      value={task.status}
                      style={{
                        backgroundColor: getStatusColor(task.status),
                        color: "#fff",
                      }}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>{task.methodology}</td>
                  <td>{task.project_phase}</td>
                  <td>{task.comment || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerOralRecord;
