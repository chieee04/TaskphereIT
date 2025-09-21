// ManuScript.jsx
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaFileAlt, FaEllipsisV, FaSearch } from "react-icons/fa";
import { supabase } from "../../supabaseClient";

const MySwal = withReactContent(Swal);

const ManuScript = () => {
  const [accounts, setAccounts] = useState([]);
  const [teams, setTeams] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [search, setSearch] = useState("");
  const [advisers, setAdvisers] = useState([]);
  const [selectedAdviser, setSelectedAdviser] = useState(null);


  // Verdict mapping
  const verdictMap = {
    1: "Pending",
    2: "Re-Def",
    3: "Completed",
  };
useEffect(() => {
  const fetchAdvisers = async () => {
    const { data, error } = await supabase
      .from("user_credentials")
      .select("*")
      .eq("user_roles", 3)
      .not("adviser_group", "is", null);

    if (!error) {
      setAdvisers(data);
    }
  };
  fetchAdvisers();
}, []);
  // Fetch accounts & manuscript schedules
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
      }

      const { data: schedData } = await supabase
        .from("user_manuscript_sched")
        .select("*");

      if (schedData) setSchedules(schedData);
    };

    fetchData();
  }, []);
const handleAdviserChange = async (e) => {
  const adviserId = e.target.value;
  setSelectedAdviser(adviserId);

  // get adviser_group of selected adviser
  const { data: adviser } = await supabase
    .from("user_credentials")
    .select("adviser_group")
    .eq("id", adviserId)
    .single();

  if (adviser?.adviser_group) {
    // fetch all managers (role=1) under same adviser_group
    const { data: managerTeams } = await supabase
      .from("user_credentials")
      .select("id, group_name, group_number")
      .eq("user_roles", 1)
      .eq("adviser_group", adviser.adviser_group);

    setTeams(managerTeams || []);
  }
};
  // Create schedule
  // Create schedule
const handleCreateSchedule = () => {
  MySwal.fire({
    title: `<div style="color:#3B0304; font-weight:600; display:flex; align-items:center; gap:8px;">
      <i class="bi bi-journal-text"></i> Create Manuscript Schedule</div>`,
    html: `
  <div class="mb-3">
    <label style="font-weight:600;">Assign Adviser</label>
    <select id="adviserSelect" class="form-select">
      <option disabled selected value="">Select Adviser</option>
      ${advisers
        .map(
          (a) => `
            <option value="${a.id}">
              ${a.last_name}, ${a.first_name} (Group ${a.adviser_group})
            </option>`
        )
        .join("")}
    </select>
  </div>

  <div class="mb-3">
    <label style="font-weight:600;">Assign Team</label>
    <select id="teamSelect" class="form-select" disabled>
      <option disabled selected value="">Select Team</option>
    </select>
  </div>

  <div class="mb-3">
    <label style="font-weight:600;">Date</label>
    <input type="date" id="scheduleDate" class="form-control"/>
  </div>
  <div class="mb-3">
    <label style="font-weight:600;">Time</label>
    <input type="time" id="scheduleTime" class="form-control"/>
  </div>`,
    showCancelButton: true,
    confirmButtonText: "Create",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#8B0000",
    width: "500px",didOpen: () => {
  const adviserSelect = document.getElementById("adviserSelect");
  const teamSelect = document.getElementById("teamSelect");

  adviserSelect.addEventListener("change", async (e) => {
    const adviserId = e.target.value;

    // kunin adviser_group ng piniling adviser
    const { data: adviser } = await supabase
      .from("user_credentials")
      .select("adviser_group")
      .eq("id", adviserId)
      .single();

    if (adviser?.adviser_group) {
      // kunin lahat ng managers (role=1) sa adviser_group na iyon
      const { data: managerTeams } = await supabase
        .from("user_credentials")
        .select("group_name")
        .eq("user_roles", 1)
        .eq("adviser_group", adviser.adviser_group);

      // clear + enable teamSelect
      teamSelect.innerHTML = `<option disabled selected value="">Select Team</option>`;
      managerTeams?.forEach((t) => {
        const opt = document.createElement("option");
        opt.value = t.group_name;
        opt.textContent = t.group_name;
        teamSelect.appendChild(opt);
      });
      teamSelect.disabled = false;
    }
  });
},
    preConfirm: () => {
  const adviser = document.getElementById("adviserSelect").value;
  const team = document.getElementById("teamSelect").value;
  const date = document.getElementById("scheduleDate").value;
  const time = document.getElementById("scheduleTime").value;

  if (!adviser || !team || !date || !time) {
    MySwal.showValidationMessage("Please fill all fields");
    return false;
  }
  return { adviser, team, date, time };
},
  }).then(async (result) => {
    if (result.isConfirmed) {
      const { adviser, team, date, time } = result.value;

      // Hanapin manager_id ng team
      const teamManager = accounts.find(
        (a) => a.group_name === team && a.user_roles === 1
      );

      if (!teamManager) {
        MySwal.fire("Error", "No manager found for this team.", "error");
        return;
      }

      const { error, data } = await supabase
        .from("user_manuscript_sched")
        .insert([
          {
            manager_id: teamManager.id,
            adviser_id: adviser, // ✅ bagong field
            date,
            time,
            plagiarism: 0,
            ai: 0,
            file_uploaded: null,
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
        .from("user_manuscript_sched")
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

  // Filter schedules
  const filteredSchedules = schedules.filter((sched) => {
    const teamName =
      accounts.find((a) => a.id === sched.manager_id)?.group_name || "";
    const verdict = verdictMap[sched.verdict] || "Pending";
    const fileName = sched.file_uploaded || "No File";

    const searchText = search.toLowerCase();
    return (
      teamName.toLowerCase().includes(searchText) ||
      (sched.date || "").toLowerCase().includes(searchText) ||
      (sched.time || "").toLowerCase().includes(searchText) ||
      verdict.toLowerCase().includes(searchText) ||
      fileName.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="container-fluid px-4 py-3">
      {/* Header */}
      <div className="d-flex align-items-center mb-2">
        <FaFileAlt className="me-2" style={{ color: "#3B0304" }} />
        <strong style={{ color: "#3B0304", fontSize: "18px" }}>
          Manuscript <span className="mx-2">»</span> Scheduled Teams
        </strong>
      </div>
      <hr style={{ borderTop: "2px solid #3B0304", opacity: 1, marginBottom: "10px" }} />

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
              <th>Plagiarism</th>
              <th>AI</th>
              <th>File Uploaded</th>
              <th>Verdict</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedules.map((sched, index) => {
              const teamName =
                accounts.find((a) => a.id === sched.manager_id)?.group_name ||
                "Unknown";

              return (
                <tr key={sched.id}>
                  <td>{index + 1}</td>
                  <td>{teamName}</td>
                  <td>{sched.date}</td>
                  <td>{sched.time}</td>
                  <td>{sched.plagiarism}%</td>
                  <td>{sched.ai}%</td>
                  <td>{sched.file_uploaded || "No File"}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={sched.verdict || 1}
                      onChange={async (e) => {
                        const newVerdict = parseInt(e.target.value, 10);
                        const { error } = await supabase
                          .from("user_manuscript_sched")
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
                <td colSpan="9" className="text-center text-muted">
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

export default ManuScript;
