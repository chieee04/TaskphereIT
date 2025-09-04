// src/components/member-task.jsx
import React from "react";
import "../Style/Member/MemberTask.css"; // hiwalay na CSS

const MemberTask = () => {
  // Sample dummy data (pwede palitan ng dynamic data from DB)
  const tasks = [
    {
      no: 1,
      team: "Team Alpha",
      task: "Develop Login Page",
      subtask: "UI Design",
      element: "React",
      dateCreated: "2025-08-25",
      dueDate: "2025-09-05",
      time: "3:00 PM",
      projectPhase: "Phase 1",
      revisionNo: "2",
      status: "In Progress",
    },
    {
      no: 2,
      team: "Team Beta",
      task: "Database Schema",
      subtask: "ERD Design",
      element: "Postgres",
      dateCreated: "2025-08-28",
      dueDate: "2025-09-10",
      time: "10:00 AM",
      projectPhase: "Phase 2",
      revisionNo: "1",
      status: "Pending",
    },
  ];

  return (
    <div className="member-task-page">
      <h2 className="member-task-title">📋 Member Tasks</h2>

      <div className="table-wrapper">
        <table className="member-task-table">
          <thead>
            <tr>
              <th>NO</th>
              <th>Team</th>
              <th>Task</th>
              <th>Subtask</th>
              <th>Element</th>
              <th>Date Created</th>
              <th>Due Date</th>
              <th>Time</th>
              <th>Project Phase</th>
              <th>Revision NO</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t, index) => (
              <tr key={index} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                <td>{t.no}</td>
                <td>{t.team}</td>
                <td>{t.task}</td>
                <td>{t.subtask}</td>
                <td>{t.element}</td>
                <td>{t.dateCreated}</td>
                <td>{t.dueDate}</td>
                <td>{t.time}</td>
                <td>{t.projectPhase}</td>
                <td>{t.revisionNo}</td>
                <td>
                  <span
                    className={`status-badge ${
                      t.status === "In Progress"
                        ? "status-progress"
                        : t.status === "Pending"
                        ? "status-pending"
                        : "status-completed"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
                <td>
                  <button className="btn-edit">✏️ Edit</button>
                  <button className="btn-delete">🗑 Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberTask;
