// ManagerEvents.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import fileIcon from "../../assets/file-type-icon.png";
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ import bootstrap

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

      // ✅ Accounts
      const { data: accData, error: accError } = await supabase
        .from("user_credentials")
        .select("*");
      if (accError) {
        console.error("Accounts fetch error:", accError);
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
    };

    fetchSchedule();
  }, []);

  const getName = (id) => {
    const person = accounts.find((a) => a.id === id);
    return person ? `${person.last_name}, ${person.first_name}` : "Unknown";
  };

  return (
    <div className="container my-4">
      <h2 className="fw-bold mb-3">Events</h2>

      {/* ===================== Manuscript Section ===================== */}
      <h4 className="mb-3">Manuscript Results</h4>
      <div className="table-responsive mb-4">
        <table className="table table-bordered table-striped text-center align-middle">
          <thead className="table-light">
            <tr>
              <th>No</th>
              <th>Team</th>
              <th>Title</th>
              <th>Due Date</th>
              <th>Time</th>
              <th>Plagiarism</th>
              <th>AI</th>
              <th>File Uploaded</th>
              <th>Adviser</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {manuscript ? (
              <tr>
                <td>1.</td>
                <td>{customUser?.group_name || "Unknown Team"}</td>
                <td>{customUser?.project_title || "No Title"}</td>
                <td>
                  {manuscript.date
                    ? new Date(manuscript.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "No Date"}
                </td>
                <td>{manuscript.time || "N/A"}</td>
                <td className="text-danger fw-bold">
                  {manuscript.plagiarism || 0}%
                </td>
                <td className="text-danger fw-bold">
                  {manuscript.ai || 0}%
                </td>
                <td>
                  {manuscript.file_uploaded ? (
                    <>
                      <img
                        src={fileIcon}
                        alt="File Icon"
                        style={{ width: "20px", height: "20px" }}
                      />{" "}
                      {manuscript.file_uploaded}
                    </>
                  ) : (
                    "No File"
                  )}
                </td>
                <td>{getName(manuscript.adviser_id)}</td>
                <td>
                  <span className="text-success fw-bold">
                    {manuscript.verdict || "Pending"}
                  </span>
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={10} className="text-muted">
                  No manuscript schedule found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===================== Title Defense Section ===================== */}
      <h4 className="mb-3">Title Defense</h4>
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
