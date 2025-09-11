// OralDefense.jsx
import React, { useState, useEffect, useRef } from "react";
import { FaUsers, FaFolder, FaTrash, FaCalendarPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import { supabase } from "../../supabaseClient";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const OralDefense = () => {
  const [allAccounts, setAllAccounts] = useState([]);
  const allAccountsRef = useRef([]);
  const [advisers, setAdvisers] = useState([]);
  const [teamCards, setTeamCards] = useState([]);

  useEffect(() => {
    fetchAccounts();
    window.addEventListener("team-click", handleTeamClick);
    return () => window.removeEventListener("team-click", handleTeamClick);
  }, []);

  // ================================
  // Fetch Accounts
  // ================================
  const fetchAccounts = async () => {
    const { data, error } = await supabase.from("user_credentials").select("*");
    if (!error) {
      // Adviser groups
      const adviserGroups = data
        .filter((d) => d.adviser_group !== null)
        .reduce((acc, row) => {
          if (!acc[row.adviser_group]) acc[row.adviser_group] = [];
          acc[row.adviser_group].push(row);
          return acc;
        }, {});

      const adviserCards = Object.values(adviserGroups).map((group) => {
        const adviser = group.find((g) => g.user_roles === 3);

        const teams = [
          ...new Set(group.filter((m) => m.group_number !== null).map((m) => m.group_name)),
        ];
        const members = group
          .filter((m) => m.user_roles !== 3)
          .map((m) => `${m.first_name} ${m.last_name}`);

        return {
          label: adviser
            ? `${adviser.last_name}, ${adviser.first_name} ${adviser.middle_name || ""}`
            : "Adviser Not Found",
          adviserId: adviser?.id || null,
          adviser_group: adviser?.adviser_group || null,
          teams,
          members,
        };
      });

      setAdvisers(data.filter((s) => s.user_roles === 3));
      setTeamCards(adviserCards);
      setAllAccounts(data);
      allAccountsRef.current = data;
    }
  };

  // ================================
  // Delete Team
  // ================================
  const handleDeleteTeam = async (teamName) => {
    MySwal.fire({
      title: `Delete "${teamName}"?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3B0304",
      cancelButtonColor: "#999",
      confirmButtonText: "Yes, delete it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await supabase
          .from("user_credentials")
          .update({ group_number: null, group_name: null, adviser_group: null })
          .eq("group_name", teamName);

        await fetchAccounts();

        MySwal.fire({
          icon: "success",
          title: "Deleted successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  // ================================
  // Create Schedule
  // ================================
  // ================================
// Create Schedule
// ================================
const handleCreateSchedule = (teamName) => {
  let selectedPanelists = [];

  MySwal.fire({
    title: `<div style="color: #3B0304; font-weight:600; display:flex; align-items:center; gap:8px;">
      <i class="bi bi-calendar-plus"></i> Create Schedule</div>`,
    html: `
      <div class="mb-3">
        <label style="font-weight:600;">Assign Panelists</label>
        <select id="panelSelect" class="form-select">
  <option disabled selected value="">Select</option>
  ${(() => {
    // Hanapin adviser_group ng current team
    const teamMembers = allAccounts.filter((a) => a.group_name === teamName);
    const teamAdviserGroup = teamMembers[0]?.adviser_group || null;

    // Hanapin adviser mismo (role 3 sa adviser_group na iyon)
    const teamAdviser = allAccounts.find(
      (acc) => acc.adviser_group === teamAdviserGroup && acc.user_roles === 3
    );

    // Filter out adviser ng team bago gumawa ng options
    return advisers
      .filter((a) => !teamAdviser || a.id !== teamAdviser.id)
      .map(
        (a) =>
          `<option value="${a.id}">
            ${a.last_name}, ${a.first_name}
          </option>`
      )
      .join("");
  })()}
</select>

      </div>
      <div class="mb-3">
        <label style="font-weight:600;">Date</label>
        <input type="date" id="scheduleDate" class="form-control"/>
      </div>
      <div class="mb-3">
        <label style="font-weight:600;">Time</label>
        <input type="time" id="scheduleTime" class="form-control"/>
      </div>
      <div class="mb-2">
        <label style="font-weight:600;">Selected Panelists</label>
        <div id="panelList" class="form-control d-flex flex-wrap gap-2" 
             style="border-radius:8px; min-height:40px; align-items:center;">
          <span class="text-muted">No panelist selected</span>
        </div>
      </div>`,
    showCancelButton: true,
    confirmButtonText: "Create",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#8B0000",
    width: "600px",
    didOpen: () => {
      const panelSelect = document.getElementById("panelSelect");
      const panelList = document.getElementById("panelList");

      panelSelect.addEventListener("change", () => {
        const selectedId = panelSelect.value;
        const selectedText = panelSelect.options[panelSelect.selectedIndex].text;

        if (!selectedPanelists.includes(selectedId)) {
          selectedPanelists.push(selectedId);

          const tag = document.createElement("div");
          tag.style.cssText =
            "background:#f8f8f8; border-radius:8px; padding:4px 8px; font-size:14px; border:1px solid #ccc; display:flex; align-items:center; gap:6px;";
          tag.innerHTML = `<span>${selectedText}</span><button style="border:none; background:none; font-size:16px; cursor:pointer;">×</button>`;

          tag.querySelector("button").addEventListener("click", () => {
            tag.remove();
            selectedPanelists = selectedPanelists.filter((id) => id !== selectedId);
            if (selectedPanelists.length === 0) {
              panelList.innerHTML = `<span class="text-muted">No panelist selected</span>`;
            }
          });

          if (panelList.querySelector(".text-muted")) {
            panelList.innerHTML = "";
          }
          panelList.appendChild(tag);
        }
      });
    },
    preConfirm: () => {
      const date = document.getElementById("scheduleDate").value;
      const time = document.getElementById("scheduleTime").value;

      if (!date || !time) {
        Swal.showValidationMessage("Date and Time are required");
        return false;
      }
      if (selectedPanelists.length === 0) {
        Swal.showValidationMessage("At least one panelist required");
        return false;
      }

      return { teamName, date, time, panelists: selectedPanelists };
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      const { teamName, date, time, panelists } = result.value;

      const teamManager = allAccounts.find(
        (a) => a.group_name === teamName && a.user_roles === 1
      );

      if (!teamManager) {
        MySwal.fire("Error", "No manager found for this team.", "error");
        return;
      }

      const [p1, p2, p3] = panelists;

      const { error } = await supabase.from("user_oraldef").insert([
        {
          manager_id: teamManager.id,
          date,
          time,
          panelist1_id: p1 || null,
          panelist2_id: p2 || null,
          panelist3_id: p3 || null,
          verdict: 1, // Pending default
        },
      ]);

      if (error) {
        console.error("Insert error:", error);
        MySwal.fire("Error", "Failed to create schedule", "error");
      } else {
        MySwal.fire({
          icon: "success",
          title: "✓ Schedule Created",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  });
};


  // ================================
  // Handle Team Click
  // ================================
  const handleTeamClick = (e) => {
    const clickedLabel = e.detail;
    const foundTeam = teamCards.find((t) => t.label === clickedLabel);

    if (!foundTeam) return;

    const teamButtons = foundTeam.teams
      .map((teamLabel) => {
        return `<div class="team-folder-btn" data-team="${teamLabel}" 
          style="background:white; border-left:10px solid #3B0304; border-radius:12px; padding:10px; margin-bottom:8px; cursor:pointer; display:flex; align-items:center; justify-content:space-between; gap:8px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
            <div style="display:flex; align-items:center; gap:8px;">
              <i class="bi bi-folder-fill" style="color:#3B0304; font-size:20px;"></i>
              <span style="font-size:14px; font-weight:600; color:#3B0304;">${teamLabel}</span>
            </div>
            <div>
              <button class="delete-team-btn" data-team="${teamLabel}" style="background:none; border:none; color:red; font-size:16px; cursor:pointer;">🗑</button>
              <button class="schedule-team-btn" data-team="${teamLabel}" style="background:none; border:none; color:#3B0304; font-size:16px; cursor:pointer;">📅</button>
            </div>
          </div>`;
      })
      .join("");

    MySwal.fire({
      title: `<div style='color:#3B0304;'>📁 ${foundTeam.label}</div>`,
      html: `<div id="adviserTeamList" style="text-align:left; max-height:300px; overflow-y:auto;">${teamButtons}</div>`,
      showConfirmButton: false,
      width: 500,
      didOpen: () => {
        const container = Swal.getPopup().querySelector("#adviserTeamList");

        // Delete
        container.querySelectorAll(".delete-team-btn").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const teamLabel = btn.getAttribute("data-team");
            handleDeleteTeam(teamLabel);
          });
        });

        // Create Schedule
        container.querySelectorAll(".schedule-team-btn").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const teamLabel = btn.getAttribute("data-team");
            handleCreateSchedule(teamLabel);
          });
        });
      },
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold flex items-center gap-2 text-[#3B0304]">
          <FaUsers /> Oral Defense
        </h1>
        <button
          className="px-4 py-2 bg-[#3B0304] text-white rounded-lg shadow hover:bg-[#5c1b1c] transition"
        >
          Oral Re-Defense
        </button>
      </div>

      {/* TEAM CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {teamCards.length === 0 ? (
          <p className="text-gray-500">No adviser folders available.</p>
        ) : (
          teamCards.map((team, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div
                className="flex items-center justify-between text-[#3B0304]"
                onClick={() => handleTeamClick({ detail: team.label })}
              >
                <div className="flex items-center gap-2">
                  <FaFolder /> <span className="font-semibold">{team.label}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OralDefense;
