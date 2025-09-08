import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaCalendarAlt } from "react-icons/fa";
import { supabase } from "../../supabaseClient";

const MySwal = withReactContent(Swal);

const TitleDefense = () => {
  const [teams, setTeams] = useState([]);
  const [advisers, setAdvisers] = useState([]);
  const [accounts, setAccounts] = useState([]);

  // Fetch teams + advisers from DB
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("user_credentials").select("*");
      if (!error && data) {
        setAccounts(data);
        setTeams(
          [...new Set(data.filter((d) => d.group_number !== null).map((t) => t.group_name))]
        );
        setAdvisers(data.filter((a) => a.user_roles === 3));
      }
    };
    fetchData();
  }, []);

  const handleCreateSchedule = () => {
    let selectedPanelists = [];

    MySwal.fire({
      title: `<div style="color: #3B0304; font-weight: 600; display: flex; align-items: center; gap: 8px;">
        <i class="bi bi-calendar-plus"></i> Create Schedule</div>`,
      html: `
        <div style="display: flex; gap: 20px; margin-bottom: 15px;">
          <div style="flex: 1;">
            <label style="font-weight: 600;">Assign Team</label>
            <select id="teamSelect" class="form-select">
              <option disabled selected value="">Select</option>
              ${teams.map((t) => `<option value="${t}">${t}</option>`).join("")}
            </select>
          </div>
          <div style="flex: 1;">
            <label style="font-weight: 600;">Assign Panelists</label>
            <select id="panelSelect" class="form-select">
              <option disabled selected value="">Select</option>
              ${advisers
                .map(
                  (a) =>
                    `<option value="${a.id}">${a.last_name}, ${a.first_name}</option>`
                )
                .join("")}
            </select>
          </div>
        </div>

        <div class="mb-3">
          <label style="font-weight: 600;">Date</label>
          <input type="date" id="scheduleDate" class="form-control" />
        </div>
        <div class="mb-3">
          <label style="font-weight: 600;">Time</label>
          <input type="time" id="scheduleTime" class="form-control" />
        </div>

        <div class="mb-2">
          <label style="font-weight: 600;">Selected Panelists</label>
          <div id="panelList" class="form-control d-flex flex-wrap gap-2" 
               style="border-radius: 8px; min-height:40px; align-items:center;">
            <span class="text-muted">No panelist selected</span>
          </div>
        </div>`,
      showCancelButton: true,
      confirmButtonText: "Create",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#8B0000",
      width: "600px",
      didOpen: () => {
  const teamSelect = document.getElementById("teamSelect");
  const panelSelect = document.getElementById("panelSelect");
  const panelList = document.getElementById("panelList");

  // kapag nagbago ang team
  teamSelect.addEventListener("change", () => {
  const teamName = teamSelect.value;

  // hanapin yung team record mismo
  const teamMembers = accounts.filter((a) => a.group_name === teamName);
  const teamGroupNumber = teamMembers[0]?.group_number || null;
  const teamAdviserGroup = teamMembers[0]?.adviser_group || null;

  // ✅ Reset selected panelists
  selectedPanelists = [];
  panelList.innerHTML = '<span class="text-muted">No panelist selected</span>';

  // clear panelSelect options
  panelSelect.innerHTML = `<option disabled selected value="">Select</option>`;

  // populate advisers except yung nasa adviser_group ng team
  advisers.forEach((a) => {
    const opt = document.createElement("option");
    opt.value = a.id;
    opt.textContent = `${a.last_name}, ${a.first_name}`;

    // disable kung adviser na naka-assign sa adviser_group ng team
    if (teamAdviserGroup && a.adviser_group === teamAdviserGroup) {
      opt.disabled = true;
      opt.textContent += " (Team Adviser)";
    }

    panelSelect.appendChild(opt);
  });
});

  // add panelist chips
  panelSelect.addEventListener("change", () => {
    const id = panelSelect.value;
    const text = panelSelect.options[panelSelect.selectedIndex].text;

    if (!selectedPanelists.includes(id)) {
      selectedPanelists.push(id);
      if (panelList.querySelector(".text-muted")) panelList.innerHTML = "";

      const div = document.createElement("div");
      div.className =
        "px-2 py-1 bg-light border rounded d-flex align-items-center gap-2";
      div.innerHTML = `<span>${text}</span>
        <button style="border:none; background:none; cursor:pointer; color:red;">×</button>`;

      div.querySelector("button").addEventListener("click", () => {
        selectedPanelists = selectedPanelists.filter((p) => p !== id);
        div.remove();
        if (selectedPanelists.length === 0) {
          panelList.innerHTML =
            '<span class="text-muted">No panelist selected</span>';
        }
      });

      panelList.appendChild(div);
    }
  });
},


      preConfirm: () => {
        const team = document.getElementById("teamSelect")?.value;
        const date = document.getElementById("scheduleDate")?.value;
        const time = document.getElementById("scheduleTime")?.value;

        if (!team || !date || !time || selectedPanelists.length === 0) {
          Swal.showValidationMessage("All fields are required");
          return false;
        }
        return { team, date, time, panelists: selectedPanelists };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Schedule created:", result.value);
        MySwal.fire({
          icon: "success",
          title: "✓ Schedule Created",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  return (
    <div className="container-fluid px-4 py-3">
      {/* Header */}
      <div className="d-flex align-items-center mb-2">
        <FaCalendarAlt className="me-2" style={{ color: "#3B0304" }} />
        <strong style={{ color: "#3B0304", fontSize: "18px" }}>
          Title Defense <span className="mx-2">»</span> Scheduled Teams
        </strong>
      </div>
      <hr
        style={{
          borderTop: "2px solid #3B0304",
          opacity: 1,
          marginBottom: "10px",
        }}
      />

      {/* Buttons */}
      <div className="d-flex gap-2 mb-3">
        <button
          className="btn btn-outline-dark border"
          style={{ borderColor: "#3B0304", color: "#3B0304" }}
          onClick={handleCreateSchedule}
        >
          ➕ Create Schedule
        </button>
        <button
          className="btn btn-outline-dark border"
          style={{ borderColor: "#3B0304", color: "#3B0304" }}
        >
          📁 Title Re-Defense
        </button>
      </div>
    </div>
  );
};

export default TitleDefense;
