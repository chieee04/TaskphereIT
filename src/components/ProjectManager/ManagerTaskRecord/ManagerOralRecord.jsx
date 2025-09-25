// src/components/tasks/pm-oral-record.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import taskIcon from "../../../assets/tasks-icon.png";
import dueDateIcon from "../../../assets/due-date-icon.png";
import timeIcon from "../../../assets/time-icon.png";
import "../../Style/ProjectManager/ManagerOralRecord.css";

const ManagerOralRecord = () => {
  const [tasks, setTasks] = useState([]);

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

  // ✅ Fetch Completed Oral Defense tasks
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
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ Update status
  const handleStatusChange = async (taskId, newStatus) => {
    const { error } = await supabase
      .from("manager_oral_task")
      .update({ status: newStatus })
      .eq("id", taskId);

    if (error) {
      console.error("❌ Update status error:", error);
    } else {
      // refresh para mawala kung hindi na Completed
      fetchTasks();
    }
  };

  // ✅ Update revision
  const handleRevisionChange = async (taskId, revisionIndex) => {
    const revisionInt = revisionIndex; // 0 = No Revision, 1..10 = Revision number
    const { error } = await supabase
      .from("manager_oral_task")
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
        Oral Defense Records
      </h2>
      <hr className="divider" />

      <div className="header-wrapper">
        <div className="tasks-container">
          <table className="tasks-table">
            <thead>
              <tr>
                <th className="center-text">NO</th>
                <th className="center-text">Assigned</th>
                <th className="center-text">Subtasks</th>
                <th className="center-text">Elements</th>
                <th className="center-text">Date Created</th>
                <th className="center-text">Due Date</th>
                <th className="center-text">Time</th>
                <th className="center-text">Date Completed</th>
                <th className="center-text">Revision No.</th>
                <th className="center-text">Status</th>
                <th className="center-text">Methodology</th>
                <th className="center-text">Project Phase</th>
                <th className="center-text">Comment</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="13" className="center-text">
                    No completed oral defense tasks yet
                  </td>
                </tr>
              ) : (
                tasks.map((task, idx) => (
                  <tr key={task.id}>
                    <td className="center-text">{idx + 1}.</td>
                    <td className="center-text">
                      {task.member?.first_name} {task.member?.last_name}
                    </td>
                    <td className="center-text">{task.subtask}</td>
                    <td className="center-text">{task.element}</td>
                    <td className="center-text">
                      {new Date(task.created_at).toISOString().split("T")[0]}
                    </td>
                    <td className="center-text">
                      <img src={dueDateIcon} alt="Due Date" className="inline-icon" />
                      {task.due_date}
                    </td>
                    <td className="center-text">
                      <img src={timeIcon} alt="Time" className="inline-icon" />
                      {task.time}
                    </td>
                    <td className="center-text">
                      {task.date_completed
                        ? new Date(task.date_completed).toISOString().split("T")[0]
                        : "-"}
                    </td>

                    {/* Revision Dropdown */}
                    <td className="center-text">
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
                    <td className="center-text">{task.comment || "-"}</td>
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

export default ManagerOralRecord;
