import React, { useState } from "react";
import { FaDownload, FaUserGraduate, FaEllipsisV } from "react-icons/fa";

import "../Style/Instructor/AdviserCredentials.css"; // ✅ import css

const AdviserCredentials = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);

  const dummyData = []; // backend data later

  const filteredData = dummyData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

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
                {filteredData.map((row, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{row.last_name}</td>
                    <td>{row.first_name}</td>
                    <td>{row.middle_name}</td>
                    <td>{row.student_id}</td>
                    <td>{row.password}</td>
                    <td>
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
                            <button className="dropdown-item">✏️ Edit</button>
                          </li>
                          <li>
                            <button className="dropdown-item text-danger">
                              🗑 Delete
                            </button>
                          </li>
                        </ul>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">
                      No records available
                    </td>
                  </tr>
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
