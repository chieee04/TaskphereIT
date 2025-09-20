import React, { useState, useEffect } from "react";
import { FaDownload, FaUserGraduate, FaEllipsisV } from "react-icons/fa";
import { supabase } from "../../supabaseClient";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../Style/Instructor/StudentCredentials.css";
 
const StudentCredentials = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdownRow, setOpenDropdownRow] = useState(null);
  const [openHeaderAction, setOpenHeaderAction] = useState(false);
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const MySwal = withReactContent(Swal);
 
  const filteredData = credentials.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
 
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This student will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
 
    if (result.isConfirmed) {
      const { error } = await supabase.from("user_credentials").delete().eq("id", id);
      if (error) {
        console.error("Delete error:", error);
        Swal.fire("Error", "Failed to delete student.", "error");
      } else {
        setCredentials(credentials.filter((row) => row.id !== id));
        Swal.fire("Deleted!", "Student has been deleted.", "success");
      }
    }
  };
 
  const handleEditRow = (row, index) => {
    MySwal.fire({
      title: "Edit Student",
      html: `
        <input id="user_id" class="swal2-input" value="${row.user_id}" placeholder="Student ID" />
        <input id="password" class="swal2-input" value="${row.password}" placeholder="Password" />
        <input id="first_name" class="swal2-input" value="${row.first_name}" placeholder="First Name" />
        <input id="last_name" class="swal2-input" value="${row.last_name}" placeholder="Last Name" />
        <input id="middle_name" class="swal2-input" value="${row.middle_name}" placeholder="Middle Name" />
      `,
      showCancelButton: true,
      confirmButtonText: "Save",
      preConfirm: () => {
        return {
          user_id: document.getElementById("user_id").value,
          password: document.getElementById("password").value,
          first_name: document.getElementById("first_name").value,
          last_name: document.getElementById("last_name").value,
          middle_name: document.getElementById("middle_name").value,
        };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const updatedData = { ...row, ...result.value };
        const { error } = await supabase
          .from("user_credentials")
          .update(updatedData)
          .eq("id", row.id);
 
        if (error) {
          console.error("Update error:", error);
          MySwal.fire("Error", "Failed to update student.", "error");
        } else {
          const updatedCredentials = [...credentials];
          updatedCredentials[index] = updatedData;
          setCredentials(updatedCredentials);
          MySwal.fire("Updated!", "Student updated successfully.", "success");
        }
      }
    });
  };
 
  useEffect(() => {
    const fetchCredentials = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_credentials")
        .select("id, last_name, first_name, middle_name, user_id, password, user_roles")
        .in("user_roles", [1, 2]);
 
      if (error) {
        console.error("Error fetching:", error);
      } else {
        setCredentials(data);
      }
      setLoading(false);
    };
 
    fetchCredentials();
  }, []);
 
  return (
    <div className="container-fluid px-4 py-3">
      <div className="row">
        <div className="col-12 col-md-10 col-lg-9">
          {/* Header */}
          <div className="d-flex align-items-center mb-2 student-cred-header">
            <FaUserGraduate className="me-2" size={18} />
            <strong>Student Credentials</strong>
          </div>
 
          {/* ✅ Updated Divider */}
          <div
            style={{
              height: "1.5px",
              backgroundColor: "#3B0304",
              width: "calc(100% + 70px)", // ✅ made it longer
              marginLeft: "-16px",
              borderRadius: "50px",
              marginBottom: "1.5rem",
            }}
          />
 
          {/* Export Button */}
          <button
            className="btn mb-3"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              border: "1.5px solid #3B0304",
              color: "#3B0304",
              padding: "4px 10px",
              backgroundColor: "white",
              fontWeight: "500",
              fontSize: "0.85rem",
              borderRadius: "6px",
            }}
          >
            <FaDownload size={14} /> Export
          </button>
 
          {/* Table */}
          <div className="student-cred-table">
            <table className="table table-sm align-middle mb-0">
              <thead style={{ backgroundColor: "#f8f8f8" }}>
                {/* Search & Header Action Row */}
                <tr>
                  <th colSpan="5" style={{ padding: "10px 12px", textAlign: "left" }}>
                    <input
                      type="text"
                      placeholder="Search student..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="form-control"
                      style={{ fontSize: "0.9rem", maxWidth: "200px" }}
                    />
                  </th>
                  <th colSpan="2" style={{ textAlign: "right", padding: "10px 12px" }}>
                    <div style={{ position: "relative", display: "inline-block" }}>
                      <button
                        className="btn btn-sm"
                        onClick={() => setOpenHeaderAction(!openHeaderAction)}
                        style={{
                          backgroundColor: "transparent",
                          color: "#3B0304",
                          padding: "4px 8px",
                          border: "none", // ✅ Border removed
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        <FaEllipsisV />
                      </button>
                      {openHeaderAction && (
                        <ul
                          className="dropdown-menu show"
                          style={{
                            position: "absolute",
                            top: "100%",
                            right: 0,
                            zIndex: 10,
                            backgroundColor: "white",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            padding: "0",
                            margin: "4px 0 0 0",
                            minWidth: "160px",
                          }}
                        >
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => setOpenHeaderAction(false)}
                              style={{
                                background: "none",
                                border: "none",
                                width: "100%",
                                padding: "8px 12px",
                                textAlign: "left",
                                cursor: "pointer",
                                fontSize: "0.85rem",
                              }}
                            >
                              Reset All Password
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item text-danger"
                              onClick={() => setOpenHeaderAction(false)}
                              style={{
                                background: "none",
                                border: "none",
                                width: "100%",
                                padding: "8px 12px",
                                textAlign: "left",
                                cursor: "pointer",
                                fontSize: "0.85rem",
                              }}
                            >
                              Delete Selected
                            </button>
                          </li>
                        </ul>
                      )}
                    </div>
                  </th>
                </tr>
 
                {/* Column Headers */}
                <tr>
                  <th>NO</th>
                  <th>Last Name</th>
                  <th>First Name</th>
                  <th>Middle Name</th>
                  <th>Student ID</th>
                  <th>Password</th>
                  <th>Action</th>
                </tr>
              </thead>
 
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">
                      Loading...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">
                      No records available
                    </td>
                  </tr>
                ) : (
                  filteredData.map((row, index) => (
                    <tr
                      key={row.id}
                      style={{
                        backgroundColor: index % 2 === 0 ? "#F0F0F0" : "white",
                      }}
                    >
                      <td>{index + 1}</td>
                      <td>{row.last_name}</td>
                      <td>{row.first_name}</td>
                      <td>{row.middle_name}</td>
                      <td>{row.user_id}</td>
                      <td>{row.password}</td>
                      <td style={{ position: "relative" }}>
                        <button
                          className="btn btn-sm"
                          onClick={() =>
                            setOpenDropdownRow(openDropdownRow === index ? null : index)
                          }
                          style={{
                            background: "transparent",
                            color: "#3B0304",
                            padding: "2px 6px",
                            border: "none",
                            fontSize: "0.9rem",
                          }}
                        >
                          <FaEllipsisV />
                        </button>
                        {openDropdownRow === index && (
                          <ul
                            className="dropdown-menu show"
                            style={{
                              position: "absolute",
                              top: "100%",
                              right: 0,
                              zIndex: 10,
                              backgroundColor: "white",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                              padding: "0",
                              margin: "4px 0 0 0",
                              minWidth: "120px",
                            }}
                          >
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => {
                                  setOpenDropdownRow(null);
                                  handleEditRow(row, index);
                                }}
                                style={{
                                  background: "none",
                                  border: "none",
                                  width: "100%",
                                  padding: "8px 12px",
                                  textAlign: "left",
                                  fontSize: "0.85rem",
                                }}
                              >
                                ✏️ Edit
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => {
                                  setOpenDropdownRow(null);
                                  handleDelete(row.id);
                                }}
                                style={{
                                  background: "none",
                                  border: "none",
                                  width: "100%",
                                  padding: "8px 12px",
                                  textAlign: "left",
                                  fontSize: "0.85rem",
                                }}
                              >
                                🗑 Delete
                              </button>
                            </li>
                          </ul>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default StudentCredentials;