// src/components/member-task.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import "../Style/Member/MemberTask.css";

const MemberTask = () => {
  const [tasks, setTasks] = useState([]);

  // Dropdown options
  const STATUS_OPTIONS = ["To Do", "In Progress", "To Review", "Completed"];
  const REVISION_OPTIONS = Array.from({ length: 10 }, (_, i) => {
    const num = i + 1;
    if (num === 1) return "1st Revision";
    if (num === 2) return "2nd Revision";
    if (num === 3) return "3rd Revision";
    return `${num}th Revision`;
  });

  // ✅ Fetch tasks for member
  const fetchTasks = async () => {
    const storedUser = JSON.parse(localStorage.getItem("customUser"));
    if (!storedUser) {
      console.error("❌ No customUser found in localStorage");
      return;
    }

    const currentMemberId = storedUser.id; // 🟢 UUID ng naka-login na member
    console.log("📌 Fetching tasks for Member:", currentMemberId);

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
    manager:user_credentials!manager_title_task_manager_id_fkey(first_name, last_name)
  `)
  .eq("member_id", currentMemberId) // 🔥 filter by member_id
  .order("created_date", { ascending: false });


    if (error) {
      console.error("❌ Fetch error:", error);
      return;
    }

    // 🔹 Current date & time
    const now = new Date();
    const current_date = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const current_time = now.toTimeString().split(" ")[0].slice(0, 5); // HH:mm

    // 🔹 Check overdue (Missed)
    const updatedTasks = await Promise.all(
      data.map(async (task) => {
        if (task.status === "Completed") return task;

        if (
          task.due_date < current_date ||
          (task.due_date === current_date &&
            task.due_time &&
            task.due_time <= current_time)
        ) {
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

  return (
    <div className="member-task-page">
      <h2 className="member-task-title">📋 My Tasks</h2>

      <div className="table-wrapper">
        <table className="member-task-table">
          <thead>
  <tr>
    <th>NO</th>
    <th>Manager</th>
    <th>Task</th>
    <th>Date Created</th>
    <th>Due Date</th>
    <th>Time</th>
    <th>Revision No.</th>
    <th>Status</th>
    <th>Methodology</th>
    <th>Project Phase</th>
  </tr>
</thead>
<tbody>
  {tasks.length > 0 ? (
    tasks.map((t, index) => (
      <tr key={t.id}>
        <td>{index + 1}</td>
        <td>{t.manager?.first_name} {t.manager?.last_name}</td>
        <td>{t.task_name}</td>
        <td>{t.created_date}</td>
        <td>{t.due_date}</td>
        <td>{t.due_time}</td>
        <td>
          <select
            value={t.revision || 1}
            onChange={(e) => handleRevisionChange(t.id, e.target.value)}
          >
            {REVISION_OPTIONS.map((label, i) => (
              <option key={i + 1} value={i + 1}>
                {label}
              </option>
            ))}
          </select>
        </td>
        <td>
          {t.status === "Missed" ? (
            <span style={{ color: "red", fontWeight: "bold" }}>Missed</span>
          ) : (
            <select
              value={t.status}
              onChange={(e) => handleStatusChange(t.id, e.target.value)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}
        </td>
        <td>{t.methodology}</td>
        <td>{t.project_phase}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="10" style={{ textAlign: "center", padding: "1rem" }}>
        No tasks found for you.
      </td>
    </tr>
  )}
</tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberTask;
