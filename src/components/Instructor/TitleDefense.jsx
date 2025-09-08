import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaCalendarAlt } from "react-icons/fa";

const MySwal = withReactContent(Swal);

const TitleDefense = () => {
  const handleCreateSchedule = () => {
    MySwal.fire({
      title: `<div style="color: #3B0304; font-weight: 600; display: flex; align-items: center; gap: 8px;">
        <i class="bi bi-calendar-plus"></i> Create Schedule</div>`,
      html: `
        <div style="display: flex; gap: 20px; margin-bottom: 15px;">
          <div style="flex: 1;">
            <label style="font-weight: 600;">Assign Team</label>
            <select id="teamSelect" class="form-select">
              <option>Mendoza, Et Al</option>
              <option>Bernardo, Et Al</option>
              <option>Aguas, Et Al</option>
            </select>
          </div>
          <div style="flex: 1;">
            <label style="font-weight: 600;">Assign Panelists</label>
            <select id="panelSelect" class="form-select">
              <option selected disabled>Select</option>
              <option>Anderson F Dashiell</option>
              <option>Juan Dela Cruz</option>
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
          <label style="font-weight: 600;">Panelists</label>
          <div class="form-control d-flex align-items-center gap-2" style="border-radius: 8px;">
            <i class="bi bi-person-fill"></i> Anderson F Dashiell
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Create",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#8B0000",
      width: "600px",
      preConfirm: () => {
        const team = document.getElementById("teamSelect")?.value;
        const panel = document.getElementById("panelSelect")?.value;
        const date = document.getElementById("scheduleDate")?.value;
        const time = document.getElementById("scheduleTime")?.value;

        if (!team || !panel || !date || !time) {
          Swal.showValidationMessage("All fields are required");
          return false;
        }

        return { team, panel, date, time };
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

      {/* Search + Table */}
      <div className="rounded-4 border p-3 bg-white shadow-sm">
        {/* Search bar */}
        <input
          className="form-control mb-3"
          placeholder="Search..."
          style={{ borderRadius: "12px", maxWidth: "300px" }}
        />

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle mb-0">
            <thead className="table-light text-center">
              <tr>
                <th style={{ width: "5%" }}>No</th>
                <th style={{ width: "20%", textAlign: "left" }}>Team</th>
                <th style={{ width: "15%" }}>Date</th>
                <th style={{ width: "15%" }}>Time</th>
                <th style={{ width: "25%", textAlign: "left" }}>Panelists</th>
                <th style={{ width: "10%" }}>Verdict</th>
                <th style={{ width: "10%" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="7" className="text-center text-muted py-4">
                  No scheduled teams to display.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TitleDefense;
