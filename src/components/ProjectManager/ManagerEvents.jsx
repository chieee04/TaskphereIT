import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import fileIcon from "../../assets/file-type-icon.png";

const ManagerEvents = () => {
  const [schedule, setSchedule] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [customUser, setCustomUser] = useState(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      // ✅ Kunin si customUser mula localStorage
      const storedUser = JSON.parse(localStorage.getItem("customUser"));
      if (!storedUser) {
        console.error("No customUser found in localStorage");
        return;
      }
      setCustomUser(storedUser);

      const managerId = storedUser.id; // ito yung UUID na basehan

      // ✅ Kunin lahat ng accounts (para sa pangalan ng panelists, team, etc.)
      const { data: accData, error: accError } = await supabase
        .from("user_credentials")
        .select("*");

      if (accError) {
        console.error("Accounts fetch error:", accError);
        return;
      }
      setAccounts(accData);

      // ✅ Kunin ang schedule kung meron
      const { data: schedData, error: schedError } = await supabase
        .from("user_titledef")
        .select("*")
        .eq("manager_id", managerId) // gamit ang UUID mula localStorage
        .maybeSingle();

      if (schedError) {
        console.error("Schedule fetch error:", schedError);
      } else {
        setSchedule(schedData);
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

      {/* Title Defense - dynamic */}
      <h3 className="defense-header">Title Defense</h3>
      {schedule ? (
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
            <div className="right-value">{getName(schedule.panelist1_id)}</div>
          </div>
          <div className="defense-row">
            <div className="left-label">Date:</div>
            <div className="right-value">{getName(schedule.panelist2_id)}</div>
          </div>
          <div className="defense-row">
            <div className="left-value">
              {new Date(schedule.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <div className="right-value">{getName(schedule.panelist3_id)}</div>
          </div>
          <div className="defense-row">
            <div className="left-label">Time:</div>
            <div className="right-label">Status:</div>
          </div>
          <div className="defense-row">
            <div className="left-value">{schedule.time}</div>
            <div className="right-value">
              <span className="status-pending">{schedule.verdict || "Pending"}</span>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-muted">No schedule found for your team.</p>
      )}
    </div>
  );
};

export default ManagerEvents;
