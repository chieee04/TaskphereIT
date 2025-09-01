import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';
import {
  FaDownload,
  FaUpload,
  FaUserGraduate,
  FaEllipsisV,
} from "react-icons/fa";

const Enroll = () => {
  const MySwal = withReactContent(Swal);
  const [importedData, setImportedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);


  const handleDownload = () => {
    Swal.fire({
      title: "Download template?",
      showCancelButton: true,
      confirmButtonText: "Download",
    }).then((result) => {
      if (result.isConfirmed) {
        const worksheet = XLSX.utils.json_to_sheet([
          {
            student_id: "",
            password: "",
            first_name: "",
            last_name: "",
            middle_name: "",
          },
        ]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
        const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, "CCS_Enroll_Capstone_Students.xlsx");
      }
    });
  };
const handleEditRow = (row, index) => {
  MySwal.fire({
    title: '<div style="color:#3B0304;"><i class="bi bi-pencil-square"></i> Edit Student</div>',
    html: `
      <div class="row text-start">
        <div class="col-md-6 mb-2">
          <label class="form-label">Last Name</label>
          <input id="editLastName" class="form-control" value="${row.last_name || ''}" />
        </div>
        <div class="col-md-6 mb-2">
          <label class="form-label">First Name</label>
          <input id="editFirstName" class="form-control" value="${row.first_name || ''}" />
        </div>
        <div class="col-md-6 mb-2">
          <label class="form-label">Middle Name</label>
          <input id="editMiddleName" class="form-control" value="${row.middle_name || ''}" />
        </div>
        <div class="col-md-6 mb-2">
          <label class="form-label">UserID</label>
          <input id="editStudentId" class="form-control" value="${row.student_id || ''}" />
        </div>
        <div class="col-md-12 mb-2">
          <label class="form-label">Password</label>
          <input id="editPassword" class="form-control" value="${row.password || ''}" />
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Update',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#3B0304',
    cancelButtonColor: '#aaa',
    preConfirm: () => {
      const updated = {
        last_name: document.getElementById("editLastName").value.trim(),
        first_name: document.getElementById("editFirstName").value.trim(),
        middle_name: document.getElementById("editMiddleName").value.trim(),
        student_id: document.getElementById("editStudentId").value.trim(),
        password: document.getElementById("editPassword").value.trim()
      };

      if (!updated.student_id || !updated.password || !updated.first_name || !updated.last_name) {
        Swal.showValidationMessage('All required fields must be filled');
        return false;
      }

      return updated;
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const updatedData = [...importedData];
      updatedData[index] = { ...updatedData[index], ...result.value };
      setImportedData(updatedData);

      Swal.fire({
        icon: 'success',
        title: '✓ Updated',
        showConfirmButton: false,
        timer: 1200
      });
    }
  });
};
  const handleImport = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { defval: "" });
      setImportedData(data);
      Swal.fire("Imported", "Excel file imported successfully", "success");
    };
    reader.readAsBinaryString(file);
  };

  const handleUpload = async () => {
  if (importedData.length === 0) {
    Swal.fire("No data to upload", "", "warning");
    return;
  }

  try {
    // ✅ Get existing student_ids
    const resExisting = await fetch("https://mrgbkfkafammosuxqikn.supabase.co/rest/v1/Students", {
  headers: {
    apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZ2JrZmthZmFtbW9zdXhxaWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MjgxNzcsImV4cCI6MjA2MzQwNDE3N30.Xjg2AbMpVQef522RP5tRGHQeeUapdJVCko_0Lls75zU",
    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZ2JrZmthZmFtbW9zdXhxaWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MjgxNzcsImV4cCI6MjA2MzQwNDE3N30.Xjg2AbMpVQef522RP5tRGHQeeUapdJVCko_0Lls75zU"
  }
});
    const existing = await resExisting.json();
    const existingIds = new Set(existing.map((row) => row.student_id));

    // ✅ Filter duplicates
    const cleanedData = importedData
      .filter(row => row.student_id && row.password && !existingIds.has(row.student_id))
      .map(row => ({
        id: uuidv4(),
        role: 1,
        ...row
      }));

    if (cleanedData.length === 0) {
      Swal.fire("All entries already exist", "Nothing new to upload", "info");
      return;
    }

    // ✅ Upload to server
    const res = await fetch("http://localhost:5000/students/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleanedData),
    });

    const result = await res.json();

    if (result.success) {
      Swal.fire("Success", "New students uploaded", "success");
      setImportedData([]);
    } else {
      Swal.fire("Upload Failed", result.message, "error");
    }
  } catch (err) {
    Swal.fire("Server Error", err.message, "error");
  }
};

  const handleCancel = () => {
    Swal.fire({
      title: "Cancel Import?",
      text: "Imported data will be discarded.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, discard",
    }).then((result) => {
      if (result.isConfirmed) {
        setImportedData([]);
        Swal.fire("Canceled", "Import canceled.", "info");
      }
    });
  };

 const filteredData = importedData.filter((row) =>
  Object.values(row)
    .join(" ")
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
);
const handleDeleteRow = (indexToDelete) => {
  Swal.fire({
    title: "Delete this row?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it",
  }).then((result) => {
    if (result.isConfirmed) {
      const updatedData = [...importedData];
      updatedData.splice(indexToDelete, 1);
      setImportedData(updatedData);
      Swal.fire("Deleted!", "The row has been removed.", "success");
    }
  });
};

  return (
    <div className="container-fluid px-4 py-3">
      <div className="row">
        <div className="col-12 col-md-10 col-lg-9">
          <div className="d-flex align-items-center mb-3" style={{ color: "#3B0304" }}>
            <FaUserGraduate className="me-2" size={18} />
            <strong>Enroll » Students » Import</strong>
          </div>

          <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
            <button className="btn border" style={{ color: "#3B0304" }} onClick={handleDownload}>
              <FaDownload className="me-1" /> Download
            </button>

            <label className="btn border mb-0" style={{ color: "#3B0304" }}>
              <FaUpload className="me-1" /> Import
              <input type="file" hidden accept=".xlsx,.xls" onChange={handleImport} />
            </label>

            <button
              className="btn"
              style={{ backgroundColor: "#3B0304", color: "white" }}
              onClick={handleUpload}
              disabled={importedData.length === 0}
            >
              Save
            </button>

            <button
              className="btn text-white"
              style={{ backgroundColor: "#a5a5a5" }}
              onClick={handleCancel}
              disabled={importedData.length === 0}
            >
              Cancel
            </button>

            
          </div>

          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control mb-3"
            style={{ maxWidth: "400px" }}
          />

          <div className="rounded-4 border p-3 bg-white">
            <table className="table table-bordered table-sm align-middle mb-0">
              <thead className="table-light text-center">
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
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{row.student_id}</td>
                    <td>{row.password}</td>
                    <td>{row.first_name}</td>
                    <td>{row.last_name}</td>
                    <td>{row.middle_name}</td>
                    <td>
                      <button
                        className="btn btn-sm"
                        style={{ color: "#3B0304" }}
                        onClick={() =>
                          setOpenDropdown(openDropdown === index ? null : index)
                        }
                      >
                        <FaEllipsisV />
                      </button>
                      {openDropdown === index && (
                        <ul className="dropdown-menu show position-absolute">
                          <li>
                            <button className="dropdown-item" onClick={() => handleEditRow(row, index)}>✏️ Edit</button>

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
