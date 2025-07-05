import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { supabase } from "../../SupabaseClient";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import {
  FaDownload,
  FaUpload,
  FaUserTie,
  FaPlus,
  FaEllipsisV,
} from "react-icons/fa";

const Adviser = () => {
  const [adviserData, setAdviserData] = useState([]);
  const [importedData, setImportedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    fetchAdvisers();
  }, []);

  const fetchAdvisers = async () => {
    const { data, error } = await supabase.from("Students").select("*");
    if (error) {
      Swal.fire("Error", error.message, "error");
    } else {
      const onlyAdvisers = data.filter((a) => a.role === 2);
      setAdviserData(onlyAdvisers);
      setFilteredData(onlyAdvisers);
    }
  };

  const handleDownload = () => {
    Swal.fire({
      title: "Download adviser template?",
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
            role: 2,
          },
        ]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "AdviserTemplate");
        const buffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, "adviser_template.xlsx");
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

    const cleanedData = importedData
      .filter((row) => row.student_id && row.password)
      .map((row) => ({
        id: uuidv4(),
        ...row,
      }));

    const { data, error } = await supabase.from("Students").insert(cleanedData);

    if (error) {
      Swal.fire("Upload Failed", error.message, "error");
    } else {
      Swal.fire("Success", "Advisers uploaded", "success");
      setImportedData([]);
      fetchAdvisers();
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("Students").delete().eq("id", id);
    if (error) Swal.fire("Delete failed", error.message, "error");
    else {
      Swal.fire("Deleted", "Adviser removed", "success");
      fetchAdvisers();
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = adviserData.filter((a) =>
      a.student_id.toLowerCase().includes(term)
    );
    setFilteredData(filtered);
  };

  return (
    <div className="container-fluid px-4 py-3">
      <div className="row">
        <div className="col-12 col-md-10 col-lg-9">
          {/* Title */}
          <div className="d-flex align-items-center mb-3" style={{ color: "#3B0304" }}>
            <FaUserTie className="me-2" size={18} />
            <strong>Enroll » Advisers » Import</strong>
          </div>

          {/* Buttons */}
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

            <button className="btn text-white" style={{ backgroundColor: "#a5a5a5" }}>
              Cancel
            </button>

            <div className="ms-auto">
              <button className="btn btn-success">
                <FaPlus className="me-1" /> Add Adviser
              </button>
            </div>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search adviser ID..."
            value={searchTerm}
            onChange={handleSearch}
            className="form-control mb-3"
            style={{ maxWidth: "400px" }}
          />

          {/* Table */}
          <div className="rounded-4 border p-3 bg-white">
            <table className="table table-bordered table-sm align-middle mb-0">
              <thead className="table-light text-center">
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
                  <tr key={row.id}>
                    <td>{index + 1}</td>
                    <td>{row.student_id}</td>
                    <td>{row.password}</td>
                    <td>{row.first_name}</td>
                    <td>{row.last_name}</td>
                    <td>{row.middle_name}</td>
                    <td className="position-relative">
                      <button
                        className="btn btn-sm"
                        style={{ color: "#3B0304" }}
                        onClick={() =>
                          setOpenDropdown(openDropdown === row.id ? null : row.id)
                        }
                      >
                        <FaEllipsisV />
                      </button>
                      {openDropdown === row.id && (
                        <ul className="dropdown-menu show position-absolute">
                          <li>
                            <button className="dropdown-item">✏️ Edit</button>
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
