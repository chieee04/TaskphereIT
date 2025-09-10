// TitleDefense.jsx
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaCalendarAlt, FaEllipsisV, FaSearch } from "react-icons/fa";
import { supabase } from "../../supabaseClient";

const MySwal = withReactContent(Swal);

const TitleDefense = () => {
  const [teams, setTeams] = useState([]);
  const [advisers, setAdvisers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [search, setSearch] = useState("");

  // Verdict mapping
  const verdictMap = {
    1: "Pending",
    2: "Re-Def",
    3: "Completed",
  };

  // Fetch accounts and schedules
  useEffect(() => {
    const fetchData = async () => {
      const { data: accData } = await supabase
        .from("user_credentials")
        .select("*");

      if (accData) {
        setAccounts(accData);
        setTeams([
          ...new Set(
            accData
              .filter((d) => d.group_number !== null)
              .map((t) => t.group_name)
          ),
        ]);
        setAdvisers(accData.filter((a) => a.user_roles === 3));
      }

      const { data: schedData } = await supabase
        .from("user_titledef")
        .select("*");

      if (schedData) setSchedules(schedData);
    };

    fetchData();
  }, []);

  // Create schedule
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
              ${teams
                .filter(
                  (t) =>
                    !schedules.some(
                      (s) =>
                        accounts.find((a) => a.id === s.manager_id)?.group_name ===
                        t
                    )
                )
                .map((t) => `<option value="${t}">${t}</option>`)
                .join("")}
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

        // Kapag nagbago ang team
        teamSelect.addEventListener("change", () => {
          const teamName = teamSelect.value;
          const teamMembers = accounts.filter((a) => a.group_name === teamName);
          const teamAdviserGroup = teamMembers[0]?.adviser_group || null;

          // Reset panelists
          selectedPanelists = [];
          panelList.innerHTML =
            '<span class="text-muted">No panelist selected</span>';

          // Populate advisers except adviser_group ng team
          panelSelect.innerHTML = `<option disabled selected value="">Select</option>`;
          advisers.forEach((a) => {
            const opt = document.createElement("option");
            opt.value = a.id;
            opt.textContent = `${a.last_name}, ${a.first_name}`;
            if (teamAdviserGroup && a.adviser_group === teamAdviserGroup) {
              opt.disabled = true;
              opt.textContent += " (Team Adviser)";
            }
            panelSelect.appendChild(opt);
          });
        });

        // Kapag nagselect ng panelist
        panelSelect.addEventListener("change", () => {
          const selectedId = panelSelect.value;
          if (
            selectedId &&
            !selectedPanelists.includes(selectedId) &&
            selectedPanelists.length < 3
          ) {
            selectedPanelists.push(selectedId);
            const person = advisers.find((a) => a.id === selectedId);
            if (panelList.querySelector(".text-muted"))
              panelList.innerHTML = "";
            const tag = document.createElement("span");
            tag.className =
              "badge bg-secondary d-flex align-items-center gap-1";
            tag.textContent = `${person.last_name}, ${person.first_name}`;
            panelList.appendChild(tag);
          }
          panelSelect.value = "";
        });
      },
      preConfirm: () => {
        const team = document.getElementById("teamSelect").value;
        const date = document.getElementById("scheduleDate").value;
        const time = document.getElementById("scheduleTime").value;

        if (!team || !date || !time || selectedPanelists.length === 0) {
          MySwal.showValidationMessage(
            "Please fill all fields and select panelists"
          );
          return false;
        }

        return { team, date, time, panelists: selectedPanelists };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { team, date, time, panelists } = result.value;

        // Hanapin manager_id ng team
        const teamManager = accounts.find(
          (a) => a.group_name === team && a.user_roles === 1
        );

        if (!teamManager) {
          MySwal.fire("Error", "No manager found for this team.", "error");
          return;
        }

        const [p1, p2, p3] = panelists;

        // Insert to Supabase
        const { error, data } = await supabase
          .from("user_titledef")
          .insert([
            {
              manager_id: teamManager.id,
              date,
              time,
              panelist1_id: p1 || null,
              panelist2_id: p2 || null,
              panelist3_id: p3 || null,
              verdict: 1, // default Pending
            },
          ])
          .select();

        if (error) {
          console.error("Insert error:", error);
          MySwal.fire("Error", "Failed to create schedule", "error");
        } else {
          setSchedules((prev) => [...prev, data[0]]);
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

  // Delete schedule
  const handleDelete = async (id) => {
    const confirm = await MySwal.fire({
      title: "Delete Schedule?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      const { error } = await supabase
        .from("user_titledef")
        .delete()
        .eq("id", id);

      if (!error) {
        setSchedules((prev) => prev.filter((s) => s.id !== id));
        MySwal.fire("Deleted!", "Schedule has been deleted.", "success");
      } else {
        MySwal.fire("Error", "Failed to delete schedule.", "error");
      }
    }
  };

  // Filter schedules by search (lahat ng columns)
  const filteredSchedules = schedules.filter((sched) => {
    const teamName =
      accounts.find((a) => a.id === sched.manager_id)?.group_name || "";
    const panelists = [sched.panelist1_id, sched.panelist2_id, sched.panelist3_id]
      .filter(Boolean)
      .map((id) => {
        const person = accounts.find((a) => a.id === id);
        return person
          ? `${person.last_name}, ${person.first_name}`
          : "Unknown";
      })
      .join("; ");

    const verdict = verdictMap[sched.verdict] || "Pending";

    const searchText = search.toLowerCase();

    return (
      teamName.toLowerCase().includes(searchText) ||
      (sched.date || "").toLowerCase().includes(searchText) ||
      (sched.time || "").toLowerCase().includes(searchText) ||
      panelists.toLowerCase().includes(searchText) ||
      verdict.toLowerCase().includes(searchText)
    );
  });

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

      {/* Search + Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="input-group" style={{ maxWidth: "300px" }}>
          <span className="input-group-text">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          className="btn btn-outline-dark border"
          style={{ borderColor: "#3B0304", color: "#3B0304" }}
          onClick={() => handleCreateSchedule()}
        >
          ➕ Create Schedule
        </button>
      </div>

      {/* Table */}
      <div className="adviser-table">
        <table className="table table-bordered table-sm align-middle mb-0">
          <thead>
            <tr>
              <th>NO</th>
              <th>Team</th>
              <th>Date</th>
              <th>Time</th>
              <th>Panelists</th>
              <th>Verdict</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedules.map((sched, index) => {
              const teamName =
                accounts.find((a) => a.id === sched.manager_id)?.group_name ||
                "Unknown";

              const panelists = [sched.panelist1_id, sched.panelist2_id, sched.panelist3_id]
                .filter(Boolean)
                .map((id) => {
                  const person = accounts.find((a) => a.id === id);
                  return person
                    ? `${person.last_name}, ${person.first_name}`
                    : "Unknown";
                })
                .join("; ");

              return (
                <tr key={sched.id}>
                  <td>{index + 1}</td>
                  <td>{teamName}</td>
                  <td>
                    {new Date(sched.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td>{sched.time}</td>
                  <td>{panelists}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={sched.verdict || 1}
                      onChange={async (e) => {
                        const newVerdict = parseInt(e.target.value, 10);
                        const { error } = await supabase
                          .from("user_titledef")
                          .update({ verdict: newVerdict })
                          .eq("id", sched.id);

                        if (!error) {
                          setSchedules((prev) =>
                            prev.map((s) =>
                              s.id === sched.id
                                ? { ...s, verdict: newVerdict }
                                : s
                            )
                          );
                        }
                      }}
                    >
                      <option value={1}>Pending</option>
                      <option value={2}>Re-Def</option>
                      <option value={3}>Completed</option>
                    </select>
                  </td>
                  <td style={{ position: "relative" }}>
                    <button
                      className="btn btn-sm adviser-action-btn"
                      onClick={() =>
                        setOpenDropdown(openDropdown === index ? null : index)
                      }
                    >
                      <FaEllipsisV />
                    </button>
                    {openDropdown === index && (
                      <ul className="adviser-dropdown">
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={() => handleDelete(sched.id)}
                          >
                            🗑 Delete
                          </button>
                        </li>
                      </ul>
                    )}
                  </td>
                </tr>
              );
            })}
            {filteredSchedules.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  No schedules found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TitleDefense;
