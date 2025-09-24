import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import eventsIcon from "../../../assets/events-icon.png";
import dueDateIcon from "../../../assets/due-date-icon.png";
import timeIcon from "../../../assets/time-icon.png";

export default function AdviserManuResult() {
  const [schedules, setSchedules] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [customUser, setCustomUser] = useState(null);

  const PERCENTAGE_OPTIONS = Array.from({ length: 21 }, (_, i) => i * 5); // 0–100
  const REVISION_OPTIONS = [
    { label: "No Revision", value: 0 },
    { label: "1st Revision", value: 1 },
    { label: "2nd Revision", value: 2 },
    { label: "3rd Revision", value: 3 },
    { label: "4th Revision", value: 4 },
    { label: "5th Revision", value: 5 },
    { label: "6th Revision", value: 6 },
    { label: "7th Revision", value: 7 },
    { label: "8th Revision", value: 8 },
    { label: "9th Revision", value: 9 },
    { label: "10th Revision", value: 10 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const storedUser = JSON.parse(localStorage.getItem("customUser"));
      if (!storedUser) return;
      setCustomUser(storedUser);

      const adviserId = storedUser.id;

      const { data: accData } = await supabase.from("user_credentials").select("*");
      setAccounts(accData || []);

      const { data: schedData, error } = await supabase
        .from("user_manuscript_sched")
        .select("*")
        .eq("adviser_id", adviserId);

      if (!error) {
        setSchedules(
          (schedData || []).map((s) => ({
            ...s,
            plagiarism: s.plagiarism ?? 0,
            ai: s.ai ?? 0,
            status: s.status ?? 0,
          }))
        );
      }
    };
    fetchData();
  }, []);

  const getName = (id) => {
    const person = accounts.find((a) => a.id === id);
    return person ? `${person.last_name}, ${person.first_name}` : "Unknown";
  };

  // ✅ Update field both locally and in Supabase
  const updateField = async (rowId, field, value) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === rowId ? { ...s, [field]: value } : s))
    );

    const { error } = await supabase
      .from("user_manuscript_sched")
      .update({ [field]: value })
      .eq("id", rowId);

    if (error) {
      console.error(`Error updating ${field}:`, error.message);
    }
  };

  return (
    <div className="page-wrapper">
      <h2 className="section-title">
        <img src={eventsIcon} alt="Events Icon" className="icon-image" />
        Manuscript Results
      </h2>
      <hr className="divider" />

      <div className="tasks-container">
        <table className="tasks-table">
          <thead>
            <tr>
              <th>NO</th>
              <th>TEAM</th>
              <th>TITLE</th>
              <th>DUE DATE</th>
              <th>TIME</th>
              <th>PLAGIARISM</th>
              <th>AI</th>
              <th>FILE</th>
              <th>REVISION</th>
            </tr>
          </thead>
          <tbody>
            {schedules.length > 0 ? (
              schedules.map((sched, idx) => (
                <tr key={sched.id}>
                  <td>{idx + 1}.</td>
                  <td>{getName(sched.manager_id)}</td>
                  <td className="wrap-text">{sched.project_title || "Untitled"}</td>
                  <td>
                    <img src={dueDateIcon} alt="Due Date" className="inline-icon" />
                    {sched.date
                      ? new Date(sched.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "N/A"}
                  </td>
                  <td>
                    <img src={timeIcon} alt="Time" className="inline-icon" />
                    {sched.time || "N/A"}
                  </td>

                  {/* ✅ Plagiarism Dropdown */}
                  <td>
                    <select
                      value={sched.plagiarism}
                      onChange={(e) =>
                        updateField(sched.id, "plagiarism", parseInt(e.target.value))
                      }
                    >
                      {PERCENTAGE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}%
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* ✅ AI Dropdown */}
                  <td>
                    <select
                      value={sched.ai}
                      onChange={(e) =>
                        updateField(sched.id, "ai", parseInt(e.target.value))
                      }
                    >
                      {PERCENTAGE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}%
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* File Upload */}
                  <td>
                    <div className="upload-box">Upload</div>
                  </td>

                  {/* ✅ Revision Dropdown */}
                  <td>
                    <select
                      value={sched.status}
                      onChange={(e) =>
                        updateField(sched.id, "status", parseInt(e.target.value))
                      }
                    >
                      {REVISION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
                  No schedules found for you as adviser.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
