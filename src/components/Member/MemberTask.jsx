import React from "react";

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
    <div style={{ padding: "20px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px", color: "#3b0304" }}>
        📋 Member Tasks
      </h2>

      <div
        style={{
          border: "1px solid #b2b2b2",
          borderRadius: "12px",
          overflowX: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5", color: "#3b0304" }}>
              <th style={thStyle}>NO</th>
              <th style={thStyle}>Team</th>
              <th style={thStyle}>Task</th>
              <th style={thStyle}>Subtask</th>
              <th style={thStyle}>Element</th>
              <th style={thStyle}>Date Created</th>
              <th style={thStyle}>Due Date</th>
              <th style={thStyle}>Time</th>
              <th style={thStyle}>Project Phase</th>
              <th style={thStyle}>Revision NO</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t, index) => (
              <tr
                key={index}
                style={{
                  backgroundColor: index % 2 === 0 ? "#fafafa" : "white",
                  textAlign: "center",
                }}
              >
                <td style={tdStyle}>{t.no}</td>
                <td style={tdStyle}>{t.team}</td>
                <td style={tdStyle}>{t.task}</td>
                <td style={tdStyle}>{t.subtask}</td>
                <td style={tdStyle}>{t.element}</td>
                <td style={tdStyle}>{t.dateCreated}</td>
                <td style={tdStyle}>{t.dueDate}</td>
                <td style={tdStyle}>{t.time}</td>
                <td style={tdStyle}>{t.projectPhase}</td>
                <td style={tdStyle}>{t.revisionNo}</td>
                <td style={tdStyle}>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "white",
                      backgroundColor:
                        t.status === "In Progress"
                          ? "#f59e0b"
                          : t.status === "Pending"
                          ? "#ef4444"
                          : "#10b981",
                    }}
                  >
                    {t.status}
                  </span>
                </td>
                <td style={tdStyle}>
                  <button style={btnEdit}>✏️ Edit</button>
                  <button style={btnDelete}>🗑 Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Shared styles
const thStyle = {
  padding: "12px 10px",
  whiteSpace: "nowrap",
  borderBottom: "1px solid #ddd",
};

const tdStyle = {
  padding: "12px 10px",
  whiteSpace: "nowrap",
  borderBottom: "1px solid #ddd",
};

const btnEdit = {
  border: "none",
  padding: "6px 10px",
  margin: "0 3px",
  borderRadius: "6px",
  fontSize: "12px",
  cursor: "pointer",
  background: "#3b82f6",
  color: "white",
};

const btnDelete = {
  border: "none",
  padding: "6px 10px",
  margin: "0 3px",
  borderRadius: "6px",
  fontSize: "12px",
  cursor: "pointer",
  background: "#ef4444",
  color: "white",
};

export default MemberTask;
