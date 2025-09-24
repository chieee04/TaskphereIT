// src/components/MemberEvents.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import fileIcon from "../../assets/file-type-icon.png";
import "../Style/Member/MemberEvents.css";

const MemberEvents = () => {
  const [customUser, setCustomUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [manuscript, setManuscript] = useState(null);
  const [titleDef, setTitleDef] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const storedUser = JSON.parse(localStorage.getItem("customUser"));
      if (!storedUser) {
        console.error("No customUser found in localStorage");
        return;
      }
      setCustomUser(storedUser);

      // ✅ Get all accounts
      const { data: accData, error: accError } = await supabase
        .from("user_credentials")
        .select("*");
      if (accError) {
        console.error("Accounts fetch error:", accError);
        return;
      }
      setAccounts(accData);

      // ✅ Find manager of this member
      const sameGroup = accData.filter(
        (a) => a.group_number === storedUser.group_number
      );
      const manager = sameGroup.find((a) => a.user_roles === 1);

      if (!manager) {
        console.warn("No manager found for this member");
        return;
      }

      // ✅ Fetch Manuscript sched
      const { data: manuData, error: manuError } = await supabase
        .from("user_manuscript_sched")
        .select("*")
        .eq("manager_id", manager.id)
        .maybeSingle();
      if (manuError) {
        console.error("Manuscript fetch error:", manuError);
      } else {
        setManuscript(manuData);
      }

      // ✅ Fetch Title Defense sched
      const { data: titleDefData, error: titleDefError } = await supabase
        .from("user_titledef")
        .select("*")
        .eq("manager_id", manager.id)
        .maybeSingle();
      if (titleDefError) {
        console.error("Title Defense fetch error:", titleDefError);
      } else {
        setTitleDef(titleDefData);
      }
    };

    fetchData();
  }, []);

  // Helper para pangalan
  const getName = (id) => {
    const person = accounts.find((a) => a.id === id);
    return person ? `${person.last_name}, ${person.first_name}` : "Unknown";
  };

  return (
    <div className="events-wrapper">
      {/* Header */}
      <h2 className="section-title">Events</h2>
      <hr className="divider" />

      {/* Manuscript Results */}
      <h3 className="results-header">Manuscript Results</h3>
      <div className="results-box">
        <div className="results-table">
          <div className="row header">
            <div className="header-cell">No</div>
            <div className="header-cell">Team</div>
            <div className="header-cell">Title</div>
            <div className="header-cell">Due Date</div>
            <div className="header-cell">Time</div>
            <div className="header-cell">Plagiarism</div>
            <div className="header-cell">AI</div>
            <div className="header-cell">File Uploaded</div>
            <div className="header-cell">Status</div>
          </div>

          {manuscript ? (
            <div className="row">
              <div className="cell">1.</div>
              <div className="cell">
                {customUser?.group_name || "Unknown Team"}
              </div>
              <div className="cell">
                {customUser?.project_title || "No Title"}
              </div>
              <div className="cell">
                {manuscript.date
                  ? new Date(manuscript.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "No Date"}
              </div>
              <div className="cell">{manuscript.time || "N/A"}</div>
              <div className="cell" style={{ color: "#3B0304" }}>
                {manuscript.plagiarism || 0}%
              </div>
              <div className="cell" style={{ color: "#3B0304" }}>
                {manuscript.ai || 0}%
              </div>
              <div className="cell">
                {manuscript.file_name ? (
                  <>
                    <img
                      src={fileIcon}
                      alt="File Icon"
                      style={{ width: "20px", height: "20px" }}
                    />{" "}
                    {manuscript.file_name}
                  </>
                ) : (
                  "No File"
                )}
              </div>
              <div className="cell">
                <span className="status-passed">
                  {manuscript.verdict || "Pending"}
                </span>
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="cell" colSpan={9}>
                No manuscript schedule found.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Oral Defense */}
      <h3 className="defense-header">Oral Defense</h3>
      {titleDef ? (
        <div className="oral-defense-card">
          <div className="team-name">
            {customUser?.group_name || "Unknown Team"}
          </div>

          <div className="defense-row">
            <div className="left-label">Title:</div>
            <div className="right-label">Panelists:</div>
          </div>
          <div className="defense-row">
            <div className="left-value">
              {customUser?.project_title || "No Title"}
            </div>
            <div className="right-value">{getName(titleDef.panelist1_id)}</div>
          </div>
          <div className="defense-row">
            <div className="left-label">Date:</div>
            <div className="right-value">{getName(titleDef.panelist2_id)}</div>
          </div>
          <div className="defense-row">
            <div className="left-value">
              {titleDef.date
                ? new Date(titleDef.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "No Date"}
            </div>
            <div className="right-value">{getName(titleDef.panelist3_id)}</div>
          </div>
          <div className="defense-row">
            <div className="left-label">Time:</div>
            <div className="right-label">Status:</div>
          </div>
          <div className="defense-row">
            <div className="left-value">{titleDef.time || "N/A"}</div>
            <div className="right-value">
              <span className="status-pending">
                {titleDef.verdict || "Pending"}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-muted">No oral defense schedule found.</p>
      )}
    </div>
  );
};

export default MemberEvents;
