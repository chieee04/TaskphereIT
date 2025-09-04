import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';
import {
  FaDownload,
  FaUpload,
  FaUserTie,
  FaEllipsisV,
} from "react-icons/fa";

import "../Style/Instructor/Adviser-Enroll.css";   // ✅ import CSS

const Adviser = () => {
  const MySwal = withReactContent(Swal);
  const [importedData, setImportedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);

  // ... iyong logic (no changes)

  return (
    <div className="container-fluid px-4 py-3">
      <div className="row">
        <div className="col-12 col-md-10 col-lg-9">
          
          {/* Title */}
          <div className="d-flex align-items-center mb-3 adviser-header">
            <FaUserTie className="me-2" size={18} />
            <strong>Enroll » Advisers » Import</strong>
          </div>

          {/* Buttons */}
          <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
            <button className="btn adviser-btn" onClick={handleDownload}>
              <FaDownload className="me-1" /> Download
            </button>

            <label className="btn adviser-btn mb-0">
              <FaUpload className="me-1" /> Import
              <input type="file" hidden accept=".xlsx,.xls" onChange={handleImport} />
            </label>

            <button
              className="btn adviser-btn-save"
              onClick={handleUpload}
              disabled={importedData.length === 0}
            >
              Save
            </button>

            <button
              className="btn adviser-btn-cancel"
              onClick={handleCancel}
              disabled={importedData.length === 0}
            >
              Cancel
            </button>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control adviser-search mb-3"
          />

          {/* Table */}
          <div className="adviser-table">
            <table className="table table-bordered table-sm align-middle mb-0">
              <thead>
                <tr>
                  <th>NO</th>
                  <th>Adviser ID</th>
                  <th>Password</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Middle Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{row.student_id}</td>
                    <td>{row.password}</td>
                    <td>{row.first_name}</td>
                    <td>{row.last_name}</td>
                    <td>{row.middle_name}</td>
                    <td>
                      <button
                        className="btn btn-sm adviser-action-btn"
                        onClick={() =>
                          setOpenDropdown(openDropdown === index ? null : index)
                        }
                      >
                        <FaEllipsisV />
                      </button>
                      {openDropdown === index && (
                        <ul className="dropdown-menu show adviser-dropdown">
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
                              onClick={() => handleDeleteRow(index)}
                            >
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
                    <td colSpan="8" className="text-center text-muted">
                      No advisers found.
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

export default Adviser;
