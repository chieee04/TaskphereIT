import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  FaDownload,
  FaUpload,
  FaUserGraduate,
  FaEllipsisV,
} from "react-icons/fa";

import "../Style/Instructor/Enroll-Member.css"; // ✅ import css

const Enroll = () => {
  const MySwal = withReactContent(Swal);
  const [importedData, setImportedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);

  // ✅ Download sample Excel file
  const handleDownload = () => {
    const sampleData = [
      {
        student_id: "2025-0001",
        password: "password123",
        first_name: "Juan",
        last_name: "Dela Cruz",
        middle_name: "Santos",
      },
    ];
    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "students_template.xlsx");
  };

  // ✅ Import Excel file
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const processedData = jsonData.map((row) => ({
        id: uuidv4(),
        student_id: row.student_id || "",
        password: row.password || "",
        first_name: row.first_name || "",
        last_name: row.last_name || "",
        middle_name: row.middle_name || "",
      }));

      setImportedData(processedData);
    };
    reader.readAsArrayBuffer(file);
  };

  // ✅ Save data (simulate upload)
  const handleUpload = () => {
    if (importedData.length === 0) {
      MySwal.fire("No Data", "Please import students first.", "warning");
      return;
    }
    MySwal.fire("Success", "Student data uploaded successfully!", "success");
    setImportedData([]);
  };

  // ✅ Cancel import
  const handleCancel = () => {
    setImportedData([]);
    setSearchTerm("");
    MySwal.fire("Cancelled", "Import cancelled.", "info");
  };

  // ✅ Edit row
  const handleEditRow = (row, index) => {
    MySwal.fire({
      title: "Edit Student",
      html: `
        <input id="student_id" class="swal2-input" value="${row.student_id}" placeholder="Student ID" />
        <input id="password" class="swal2-input" value="${row.password}" placeholder="Password" />
        <input id="first_name" class="swal2-input" value="${row.first_name}" placeholder="First Name" />
        <input id="last_name" class="swal2-input" value="${row.last_name}" placeholder="Last Name" />
        <input id="middle_name" class="swal2-input" value="${row.middle_name}" placeholder="Middle Name" />
      `,
      showCancelButton: true,
      confirmButtonText: "Save",
      preConfirm: () => {
        return {
          student_id: document.getElementById("student_id").value,
          password: document.getElementById("password").value,
          first_name: document.getElementById("first_name").value,
          last_name: document.getElementById("last_name").value,
          middle_name: document.getElementById("middle_name").value,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedData = [...importedData];
        updatedData[index] = { ...row, ...result.value };
        setImportedData(updatedData);
        MySwal.fire("Updated!", "Student updated successfully.", "success");
      }
    });
  };

  // ✅ Delete row
  const handleDeleteRow = (index) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "This will remove the student from the list.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedData = importedData.filter((_, i) => i !== index);
        setImportedData(updatedData);
        MySwal.fire("Deleted!", "Student removed.", "success");
      }
    });
  };

  // ✅ Filtered data by search
  const filteredData = importedData.filter(
    (row) =>
      row.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.middle_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid px-4 py-3">
      <div className="row">
        <div className="col-12 col-md-10 col-lg-9">
          {/* Header */}
          <div className="d-flex align-items-center mb-3 enroll-header">
            <FaUserGraduate className="me-2" size={18} />
            <strong>Enroll » Students » Import</strong>
          </div>

          {/* Action buttons */}
          <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
            <button className="btn enroll-btn" onClick={handleDownload}>
              <FaDownload className="me-1" /> Download
            </button>

            <label className="btn enroll-btn mb-0">
              <FaUpload className="me-1" /> Import
              <input type="file" hidden accept=".xlsx,.xls" onChange={handleImport} />
            </label>

            <button
              className="btn enroll-btn-save"
              onClick={handleUpload}
              disabled={importedData.length === 0}
            >
              Save
            </button>

            <button
              className="btn enroll-btn-cancel"
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
            className="form-control enroll-search mb-3"
          />

          {/* Table */}
          <div className="enroll-table">
            <table className="table table-bordered table-sm align-middle mb-0">
              <thead>
                <tr>
                  <th>NO</th>
                  <th>Student ID</th>
                  <th>Password</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Middle Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, index) => (
                  <tr key={row.id}>
                    <td>{index + 1}</td>
                    <td>{row.student_id}</td>
                    <td>{row.password}</td>
                    <td>{row.first_name}</td>
                    <td>{row.last_name}</td>
                    <td>{row.middle_name}</td>
                    <td>
                      <button
                        className="btn btn-sm enroll-action-btn"
                        onClick={() =>
                          setOpenDropdown(openDropdown === index ? null : index)
                        }
                      >
                        <FaEllipsisV />
                      </button>
                      {openDropdown === index && (
                        <ul className="dropdown-menu show enroll-dropdown">
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
                      No students found.
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

export default Enroll;
