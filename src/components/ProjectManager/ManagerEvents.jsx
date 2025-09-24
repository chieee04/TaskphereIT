import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import fileIcon from "../../assets/file-type-icon.png";

const ManagerEvents = () => {
  const [titleDef, setTitleDef] = useState(null);
  const [manuscript, setManuscript] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [customUser, setCustomUser] = useState(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      const storedUser = JSON.parse(localStorage.getItem("customUser"));
      if (!storedUser) {
        console.error("No customUser found in localStorage");
        return;
      }
      setCustomUser(storedUser);

      const managerId = storedUser.id;

      // ✅ Kunin lahat ng accounts
      const { data: accData, error: accError } = await supabase
        .from("user_credentials")
        .select("*");

      if (accError) {
        console.error("Accounts fetch error:", accError);
        return;
      }
      setAccounts(accData);

      // ✅ Kunin Title Defense sched
      const { data: titleDefData, error: titleDefError } = await supabase
        .from("user_titledef")
        .select("*")
        .eq("manager_id", managerId)
        .maybeSingle();

      if (titleDefError) {
        console.error("Title Defense fetch error:", titleDefError);
      } else {
        setTitleDef(titleDefData);
      }

      // ✅ Kunin Manuscript sched
      const { data: manuData, error: manuError } = await supabase
        .from("user_manuscript_sched")
        .select("*")
        .eq("manager_id", managerId)
        .maybeSingle();

      if (manuError) {
        console.error("Manuscript fetch error:", manuError);
      } else {
        setManuscript(manuData);
      }
    };

    fetchSchedule();
  }, []);

  // Helper para kunin pangalan galing sa accounts
  const getName = (id) => {
    const person = accounts.find((a) => a.id === id);
    return person ? `${person.last_name}, ${person.first_name}` : "Unknown";
  };

  return (
    <div className="events-wrapper">
      <h2 className="section-title">Events</h2>
      <hr className="divider" />

      {/* Title Defense Section */}
      <h3 className="defense-header">Title Defense</h3>
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
            <div className="left-value">{titleDef.time}</div>
            <div className="right-value">
              <span className="status-pending">
                {titleDef.verdict || "Pending"}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-muted">No schedule found for your team.</p>
      )}

      <hr className="divider" />

      {/* Manuscript Section */}
      <h3 className="defense-header">Manuscript</h3>
      {manuscript ? (
        <div className="oral-defense-card">
          <div className="team-name">
            {customUser?.group_name || "Unknown Team"}
          </div>

          <div className="defense-row">
            <div className="left-label">Title:</div>
            <div className="right-label">Adviser:</div>
          </div>
          <div className="defense-row">
            <div className="left-value">
              {customUser?.project_title || "No Title"}
            </div>
            <div className="right-value">{getName(manuscript.adviser_id)}</div>
          </div>
          <div className="defense-row">
            <div className="left-label">Date:</div>
            <div className="right-value">Plagiarism:</div>
          </div>
          <div className="defense-row">
            <div className="left-value">
              {manuscript.date
                ? new Date(manuscript.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "No Date"}
            </div>
            <div className="right-value">{manuscript.plagiarism || "0"}%</div>
          </div>
          <div className="defense-row">
            <div className="left-label">Time:</div>
            <div className="right-value">AI Score:</div>
          </div>
          <div className="defense-row">
            <div className="left-value">{manuscript.time || "N/A"}</div>
            <div className="right-value">{manuscript.ai || "0"}%</div>
          </div>
          <div className="defense-row">
            <div className="left-label">Revision:</div>
            <div className="right-label">Status:</div>
          </div>
          <div className="defense-row">
            <div className="left-value">{manuscript.status || "0"}</div>
            <div className="right-value">
              <span className="status-pending">
                {manuscript.verdict || "Pending"}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-muted">No manuscript schedule found for your team.</p>
      )}
    </div>
  );
};

export default ManagerEvents;
