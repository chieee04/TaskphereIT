import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../../supabaseClient";
import taskIcon from "../../../assets/tasks-icon.png";
import createTasksIcon from "../../../assets/create-tasks-icon.png";
import searchIcon from "../../../assets/search-icon.png";
import filterIcon from "../../../assets/filter-icon.png";
import exitIcon from "../../../assets/exit-icon.png";
import dueDateIcon from "../../../assets/due-date-icon.png";
import timeIcon from "../../../assets/time-icon.png";
import redDropdownIcon from "../../../assets/red-dropdown-icon.png";
import dropdownIconWhite from "../../../assets/dropdown-icon-white.png";
import "../../Style/ProjectManager/ManagerTitleDefense.css";
import { openCreateTask } from "../../../services/Manager/ManagerCreateTitleTask";

const ManagerTitleDefense = () => {
  const [tasks, setTasks] = useState([]); 
  const [showStatusDropdown, setShowStatusDropdown] = useState(null); 
  const [showRevisionDropdown, setShowRevisionDropdown] = useState(null);

  const statusRef = useRef(null);
  const revisionRef = useRef(null);
  const filterRef = useRef(null);

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
      case "To Do": return "#FABC3F";
      case "In Progress": return "#809D3C";
      case "To Review": return "#578FCA";
      case "Completed": return "#AA60C8";
      default: return "#ccc";
    }
  };

  // ✅ Fetch tasks from Supabase (include member alias)
  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("manager_title_task")
      .select(`
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
        member:user_credentials!manager_title_task_member_id_fkey(first_name, last_name)
      `)
      .order("created_date", { ascending: false });

    if (error) {
      console.error("❌ Fetch error:", error);
    } else {
      setTasks(data);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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
        prev.map((t) =>
          t.id === taskId ? { ...t, revision: revisionInt } : t
        )
      );
    }
  };

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
        prev.map((t) =>
          t.id === taskId ? { ...t, status: newStatus } : t
        )
      );
    }
  };

  return (
    <div className="page-wrapper">
      <h2 className="section-title">
        <img src={taskIcon} alt="Tasks Icon" className="icon-image" />
        Title Defense
      </h2>
      <hr className="divider" />

      <div className="header-wrapper">
        <button
          type="button"
          className="create-task-button"
          onClick={async () => {
            const customUser = JSON.parse(localStorage.getItem("customUser"));
            const currentManagerId = customUser?.id;
            console.log("📌 From ManagerTitleDefense: currentManagerId =", currentManagerId);

            // 🔹 Ensure new task starts with default Revision = 1 and Status = "To Do"
            const newTasks = await openCreateTask(currentManagerId, {
  revision: 1,
  status: "To Do",
});

if (newTasks && Array.isArray(newTasks)) {
  console.log("✅ New Tasks Created:", newTasks);
  setTasks((prev) => [...newTasks, ...prev]); // prepend lahat ng bago
}
          }}
        >
          <img src={createTasksIcon} alt="Create Task Icon" className="create-task-icon" />
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
                  <td className="center-text">{task.task_name}</td>
                  <td className="center-text">{task.created_date}</td>
                  <td className="center-text">
                    <img src={dueDateIcon} alt="Due Date" className="inline-icon" />
                    {task.due_date}
                  </td>
                  <td className="center-text">
                    <img src={timeIcon} alt="Time" className="inline-icon" />
                    {task.due_time}
                  </td>

                  {/* ✅ Revision Dropdown */}
                  <td className="center-text">
  <select
    value={task.revision}
    onChange={(e) => handleRevisionChange(task.id, e.target.value)}
  >
    {Array.from({ length: 10 }, (_, i) => (
      <option key={i + 1} value={i + 1}>
        {i + 1}th Revision
      </option>
    ))}
  </select>
</td>


                  {/* ✅ Status Dropdown */}
                  <td className="center-text">
  <select
    value={task.status}
    onChange={(e) => handleStatusChange(task.id, e.target.value)}
  >
    {["To Do", "In Progress", "To Review", "Completed"].map((s) => (
      <option key={s} value={s}>
        {s}
      </option>
    ))}
  </select>
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

export default ManagerTitleDefense;
