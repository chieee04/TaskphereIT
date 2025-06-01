import React, { useState } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import Sidebar from '../sidebar'; // Make sure Sidebar has default export
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Dashboard = () => {
  const [importedData, setImportedData] = useState([]);

  const handleDownload = () => {
    const templateData = [
      {
        StudentID: "",
        Password: "",
        FirstName: "",
        MiddleName: "",
        LastName: "",
        Role: "",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "StudentTemplate");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(fileData, "student_template.xlsx");
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { defval: "" });

      console.log("Imported Data:", data);
      setImportedData(data);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="d-flex flex-column vh-100">
      {/* Full-width Header */}
      <Header />

      {/* Body with Sidebar + Main Content */}
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-grow-1 p-3 overflow-auto">
          <h4 className="mb-3">Dashboard - Enroll Students</h4>

          {/* Buttons */}
          <div className="d-flex gap-2 mb-3">
            <button onClick={handleDownload} className="btn btn-primary">
              Download Template
            </button>

            <label className="btn btn-success">
              Import File
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleImport}
                hidden
              />
            </label>
          </div>

          {/* Table Preview */}
          {importedData.length > 0 && (
            <div className="table-responsive">
              <h6>Preview Imported Data:</h6>
              <table className="table table-bordered table-sm">
                <thead>
                  <tr>
                    <th>StudentID</th>
                    <th>Password</th>
                    <th>FirstName</th>
                    <th>MiddleName</th>
                    <th>LastName</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {importedData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.StudentID}</td>
                      <td>{row.Password}</td>
                      <td>{row.FirstName}</td>
                      <td>{row.MiddleName}</td>
                      <td>{row.LastName}</td>
                      <td>{row.Role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Full-width Footer */}
      <Footer />
    </div>
  );
};

export default Dashboard;
