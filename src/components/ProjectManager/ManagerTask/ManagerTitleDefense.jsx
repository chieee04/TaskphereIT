import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../../supabaseClient";
import taskIcon from "../../../assets/tasks-icon.png";
import createTasksIcon from "../../../assets/create-tasks-icon.png";
import dueDateIcon from "../../../assets/due-date-icon.png";
import timeIcon from "../../../assets/time-icon.png";
import "../../Style/ProjectManager/ManagerTitleDefense.css";
import { openCreateTask, openMethodology} from "../../../services/Manager/ManagerCreateTitleTask";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);



const customUser = JSON.parse(localStorage.getItem("customUser"));
const managerId = customUser?.id; 
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
  const storedUser = JSON.parse(localStorage.getItem("customUser"));
  if (!storedUser) {
    console.error("❌ No customUser found in localStorage");
    return;
  }

  const currentManagerId = storedUser.id;
  console.log("📌 Fetching tasks for Manager:", currentManagerId);

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
      manager_id,
      member:user_credentials!manager_title_task_member_id_fkey(first_name, last_name)
    `)
    .eq("manager_id", currentManagerId)
    .order("created_date", { ascending: false });

  if (error) {
    console.error("❌ Fetch error:", error);
    return;
  }

  // 🔹 Helper para malaman kung Missed
  const isMissed = (task) => {
    if (!task.due_date || !task.due_time) return false;
    const now = new Date();
    const dueDateTime = new Date(`${task.due_date}T${task.due_time}`);
    return now > dueDateTime && task.status !== "Completed";
  };

  // 🔹 Update tasks kung Missed
  const updatedTasks = await Promise.all(
    data.map(async (task) => {
      if (task.status === "Completed") return task;

      if (isMissed(task)) {
        const { error: updateError } = await supabase
          .from("manager_title_task")
          .update({ status: "Missed" })
          .eq("id", task.id);

        if (updateError) {
          console.error(`❌ Error updating task ${task.id}:`, updateError);
        } else {
          console.log(`✅ Task ${task.id} marked as Missed`);
        }

        return { ...task, status: "Missed" };
      }

      return task;
    })
  );


  setTasks(updatedTasks);
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
  // ✅ Update status with SweetAlert confirm for "Completed"
const handleStatusChange = async (taskId, newStatus) => {
  if (newStatus === "Completed") {
    const result = await MySwal.fire({
      title: "Mark as Completed?",
      text: "Do you want to mark this task as completed?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, complete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return; // ❌ cancelled

    // ✅ Get today's date only (YYYY-MM-DD)
    const today = new Date().toISOString().split("T")[0];

    const { error } = await supabase
      .from("manager_title_task")
      .update({ status: newStatus, date_completed: today })
      .eq("id", taskId);

    if (error) {
      console.error("❌ Update status error:", error);
      MySwal.fire("Error", "Failed to update status.", "error");
    } else {
      // ✅ Remove from UI once completed
      setTasks((prev) => prev.filter((t) => t.id !== taskId));

      MySwal.fire("✅ Completed!", "Task has been marked as completed.", "success");
    }
  } else {
    // Normal update kapag hindi Completed
    const { error } = await supabase
      .from("manager_title_task")
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

 
  return (
    <div className="page-wrapper">
      <h2 className="section-title">
        <img src={taskIcon} alt="Tasks Icon" className="icon-image" />
        Title Defense
      </h2>
      <hr className="divider" />

      <div className="header-wrapper">
  {/* Create Task Button */}
  <button
    type="button"
    className="create-task-button"
    onClick={async () => {
      const customUser = JSON.parse(localStorage.getItem("customUser"));
      const currentManagerId = customUser?.id;
      console.log("📌 From ManagerTitleDefense: currentManagerId =", currentManagerId);

      // Default Revision = 1 and Status = "To Do"
      const newTasks = await openCreateTask(currentManagerId, {
        revision: 1,
        status: "To Do",
      });

      if (newTasks && Array.isArray(newTasks)) {
        console.log("✅ New Tasks Created:", newTasks);
        setTasks((prev) => [...newTasks, ...prev]);
      }
    }}
  >
    <img src={createTasksIcon} alt="Create Task Icon" className="create-task-icon" />
    Create Task
  </button>

  {/* Methodology Button (same design) */}
  
  <button
  type="button"
  className="create-task-button"
  onClick={async () => {
    const chosen = await openMethodology(managerId);
    if (chosen) {
      console.log("📌 Methodology saved:", chosen);
    }
  }}
>
  <img src={createTasksIcon} alt="Methodology Icon" className="create-task-icon" />
  Methodology
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
  {tasks
    .filter((task) => task.status !== "Completed") // 🟢 alisin completed
    .map((task, idx) => (
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

        {/* Revision Dropdown (fixed labels) */}
        <td className="center-text">
          <select
            value={task.revision}
            onChange={(e) => handleRevisionChange(task.id, e.target.value)}
          >
            {REVISION_OPTIONS.map((label, i) => (
              <option key={i + 1} value={i + 1}>
                {label}
              </option>
            ))}
          </select>
        </td>

        {/* Status Dropdown */}
        <td className="center-text">
  {task.status === "Missed" ? (
    <span style={{ color: "red", fontWeight: "bold" }}>Missed</span>
  ) : (
    <select
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

export default ManagerTitleDefense;
