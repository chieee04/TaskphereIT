import React, { useState, useEffect } from "react";
import { FaDownload, FaUserGraduate, FaEllipsisV } from "react-icons/fa";
import { supabase } from "../../supabaseClient";
import "../Style/Instructor/AdviserCredentials.css"; // ✅ import css
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const AdviserCredentials = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const MySwal = withReactContent(Swal);

  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);

  const filteredData = credentials.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Delete handler
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This adviser will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const { error } = await supabase
        .from("user_credentials")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Delete error:", error);
        Swal.fire("Error", "Failed to delete adviser.", "error");
      } else {
        setCredentials(credentials.filter((row) => row.id !== id));
        Swal.fire("Deleted!", "Adviser has been deleted.", "success");
      }
    }
  };

  // Edit handler
  const handleEditRow = (row, index) => {
    MySwal.fire({
      title: "Edit Adviser",
      html: `
        <input id="user_id" class="swal2-input" value="${row.user_id}" placeholder="Adviser ID" />
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
          .update({
            user_id: updatedData.user_id,
            password: updatedData.password,
            first_name: updatedData.first_name,
            last_name: updatedData.last_name,
            middle_name: updatedData.middle_name,
          })
          .eq("id", row.id);

        if (error) {
          console.error("Update error:", error);
          MySwal.fire("Error", "Failed to update adviser.", "error");
        } else {
          const newCredentials = [...credentials];
          newCredentials[index] = updatedData;
          setCredentials(newCredentials);

          MySwal.fire("Updated!", "Adviser updated successfully.", "success");
        }
      }
    });
  };

  // Fetch data
  useEffect(() => {
    const fetchCredentials = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_credentials")
        .select("id, last_name, first_name, middle_name, user_id, password, user_roles")
        .eq("user_roles", 3); // advisers lang

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
          {/* Title */}
          <div className="d-flex align-items-center mb-2 adviser-cred-header">
            <FaUserGraduate className="me-2" size={18} />
            <strong>Adviser Credentials</strong>
          </div>

          {/* Divider */}
          <hr className="adviser-cred-divider" />

          {/* Export button */}
          <button className="btn adviser-cred-btn mb-3">
            <FaDownload className="me-1" /> Export
          </button>

          {/* Search bar */}
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control adviser-cred-search mb-3"
          />

          {/* Table */}
          <div className="adviser-cred-table">
            <table className="table table-bordered table-sm align-middle mb-0">
              <thead>
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
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{row.last_name}</td>
                      <td>{row.first_name}</td>
                      <td>{row.middle_name}</td>
                      <td>{row.user_id}</td>
                      <td>{row.password}</td>
                      <td>
                        <div className="position-relative d-inline-block">
                          <button
                            className="btn btn-sm adviser-cred-action-btn"
                            onClick={() =>
                              setOpenDropdown(openDropdown === index ? null : index)
                            }
                          >
                            <FaEllipsisV />
                          </button>
                          {openDropdown === index && (
                            <ul className="dropdown-menu show adviser-cred-dropdown">
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => handleEditRow(row, index)}
                                >
                                  ✏️ Edit
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item text-danger"
                                  onClick={() => handleDelete(row.id)}
                                >
                                  🗑 Delete
                                </button>
                              </li>
                            </ul>
                          )}
                        </div>
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

export default AdviserCredentials;
