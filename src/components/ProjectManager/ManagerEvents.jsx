import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import fileIcon from "../../assets/file-type-Icon.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCalendarAlt, FaClock, FaDownload, FaListAlt, FaFileAlt, FaShieldAlt } from 'react-icons/fa';

const ManagerEvents = () => {
  const [titleDef, setTitleDef] = useState(null);
  const [manuscript, setManuscript] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [customUser, setCustomUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      const storedUser = JSON.parse(localStorage.getItem("customUser"));
      if (!storedUser) {
        console.error("No customUser found in localStorage");
        setLoading(false);
        return;
      }
      setCustomUser(storedUser);

      const managerId = storedUser.id;

      // ✅ Accounts
      const { data: accData, error: accError } = await supabase
        .from("user_credentials")
        .select("*");
      if (accError) {
        console.error("Accounts fetch error:", accError);
        setLoading(false);
        return;
      }
      setAccounts(accData);

      // ✅ Title Defense
      const { data: titleDefData, error: titleDefError } = await supabase
        .from("user_titledef")
        .select("*")
        .eq("manager_id", managerId)
        .maybeSingle();
      if (!titleDefError) setTitleDef(titleDefData);

      // ✅ Manuscript
      const { data: manuData, error: manuError } = await supabase
        .from("user_manuscript_sched")
        .select("*")
        .eq("manager_id", managerId)
        .maybeSingle();
      if (!manuError) setManuscript(manuData);

      setLoading(false);
    };

    fetchSchedule();
  }, []);

  const getName = (id) => {
    const person = accounts.find((a) => a.id === id);
    return person ? `${person.last_name}, ${person.first_name}` : "Unknown";
  };
  
  // Helper function for manuscript verdict colors
  const getManuscriptVerdictColor = (verdict) => {
    switch (verdict) {
      case "Passed":
        return "#809D3C";
      case "Re-check":
        return "#D60606";
      case "Pending":
      default:
        return "#FABC3F";
    }
  };

  const getTitleDefenseVerdictColor = (verdict) => {
    switch (verdict) {
      case "Approved":
        return "text-success";
      case "Pending":
        return "text-warning";
      case "Rejected":
        return "text-danger";
      default:
        return "text-muted";
    }
  };
  
  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container my-4">

      <style>{`
          /* --- General Table Styles --- */
          .tasks-table th {
            background-color: #f8f9fa !important;
            font-weight: 600 !important;
            color: #3B0304 !important;
            text-transform: uppercase;
            font-size: 0.75rem;
            padding: 12px 6px !important;
            white-space: nowrap;
          }
          .tasks-table td {
            padding: 8px 6px !important;
            font-size: 0.875rem;
            color: #495057;
            border-bottom: 1px solid #dee2e6;
            vertical-align: middle; 
            text-align: center;
          }
          .tasks-table tbody tr:hover {
            background-color: #f8f9fa;
          }
          .center-content-flex {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            height: 100%;
          }
          .file-link {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            color: #3B0304;
            text-decoration: none;
            transition: color 0.2s;
          }
          .file-link:hover {
            color: #578FCA;
          }
          /* Styling for the manuscript status pill */
          .manuscript-status-pill {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 6px; 
            color: white;
            font-weight: 600;
            font-size: 0.8rem;
            white-space: nowrap;
          }
        `}</style>

      {/* Updated "Events" Title with Icon */}
      <h2 className="fw-bold mb-2 d-flex align-items-center">
        <FaListAlt className="me-2" style={{ color: '#3B0304' }} />
        Events
      </h2>
      {/* ✅ UPDATED: Reduced thickness of the horizontal line */}
      <hr style={{ borderTop: "1px solid #3B0304", opacity: 1 }} />

      {/* ===================== Manuscript Section ===================== */}
      <h4 className="mb-3 mt-5 d-flex align-items-center fw-bold">
        <FaFileAlt className="me-2" style={{ color: '#3B0304' }} />
        Manuscript Results
      </h4>
      <div className="bg-white rounded-lg shadow-sm relative">
        <div 
          className="table-scroll-area overflow-x-auto overflow-y-auto"
          style={{ maxHeight: '600px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <table className="tasks-table min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th>No</th>
                <th>Team</th>
                <th>Title</th>
                <th>Adviser</th>
                <th>Due Date</th>
                <th>Time</th>
                <th>Plagiarism</th>
                <th>AI</th>
                <th>File Uploaded</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {manuscript ? (
                <tr key={manuscript.id} className="hover:bg-gray-50 transition duration-150">
                  <td>1.</td>
                  <td>{customUser?.group_name || "Unknown Team"}</td>
                  <td>{customUser?.project_title || "No Title"}</td>
                  <td>{getName(manuscript.adviser_id)}</td>
                  <td>
                    <div className="center-content-flex">
                      <FaCalendarAlt size={14} style={{ color: '#3B0304' }} />
                      {manuscript.date
                        ? new Date(manuscript.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "No Date"}
                    </div>
                  </td>
                  <td>
                    <div className="center-content-flex">
                      <FaClock size={14} style={{ color: '#3B0304' }} />
                      {manuscript.time || "N/A"}
                    </div>
                  </td>
                  <td className="text-danger fw-bold">{manuscript.plagiarism || 0}%</td>
                  <td className="text-danger fw-bold">{manuscript.ai || 0}%</td>
                  <td>
  {manuscript.file_url ? (
    <button
      className="btn btn-sm btn-outline-primary"
      onClick={() => {
        Swal.fire({
          title: "Download File?",
          text: `Do you want to download "${manuscript.file_uploaded}"?`,
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes, Download",
          cancelButtonText: "Cancel",
        }).then((result) => {
          if (result.isConfirmed) {
            const { data } = supabase.storage
              .from("manuscripts")
              .getPublicUrl(manuscript.file_url);

            if (data?.publicUrl) {
              window.open(data.publicUrl, "_blank");
            } else {
              Swal.fire("Error", "File not found in storage.", "error");
            }
          }
        });
      }}
    >
      <img
        src={fileIcon}
        alt="File Icon"
        style={{ width: "20px", height: "20px", marginRight: "5px" }}
      />
      {manuscript.file_uploaded}
    </button>
  ) : (
    "No File"
  )}
</td>
                  <td>
                    <span 
                        className="manuscript-status-pill"
                        style={{ backgroundColor: getManuscriptVerdictColor(manuscript.verdict) }}
                    >
                      {manuscript.verdict || "Pending"}
                    </span>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={10} className="text-center py-4 text-gray-500">
                    No manuscript schedule found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================== Title Defense Section ===================== */}
      <h4 className="mb-3 mt-5 d-flex align-items-center fw-bold">
        <FaShieldAlt className="me-2" style={{ color: '#3B0304' }} />
        Title Defense
      </h4>
      {titleDef ? (
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title fw-bold">
              {customUser?.group_name || "Unknown Team"}
            </h5>

            <div className="row mb-2">
              <div className="col fw-bold">Title:</div>
              <div className="col fw-bold">Panelists:</div>
            </div>
            <div className="row mb-2">
              <div className="col">{customUser?.project_title || "No Title"}</div>
              <div className="col">{getName(titleDef.panelist1_id)}</div>
            </div>

            <div className="row mb-2">
              <div className="col fw-bold">Date:</div>
              <div className="col">{getName(titleDef.panelist2_id)}</div>
            </div>
            <div className="row mb-2">
              <div className="col">
                {titleDef.date
                  ? new Date(titleDef.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "No Date"}
              </div>
              <div className="col">{getName(titleDef.panelist3_id)}</div>
            </div>

            <div className="row mb-2">
              <div className="col fw-bold">Time:</div>
              <div className="col fw-bold">Status:</div>
            </div>
            <div className="row">
              <div className="col">{titleDef.time || "N/A"}</div>
              <div className="col text-warning fw-bold">
                {titleDef.verdict || "Pending"}
              </div>
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