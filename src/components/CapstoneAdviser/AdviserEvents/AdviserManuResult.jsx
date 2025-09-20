import React, { useState, useEffect, useRef } from "react";
import eventsIcon from "../../../assets/events-icon.png";
import dueDateIcon from "../../../assets/due-date-icon.png";
import timeIcon from "../../../assets/time-icon.png";
import redDropdownIcon from "../../../assets/red-dropdown-icon.png";
import dropdownIconWhite from "../../../assets/dropdown-icon-white.png";

export default function AdviserManuResult() {
  const [status, setStatus] = useState("Pending");
  const [plagiarism, setPlagiarism] = useState("75%");
  const [aiScore, setAiScore] = useState("20%");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPlagiarismDropdown, setShowPlagiarismDropdown] = useState(false);
  const [showAiDropdown, setShowAiDropdown] = useState(false);

  const statusRef = useRef(null);
  const plagiarismRef = useRef(null);
  const aiRef = useRef(null);

  const STATUS_OPTIONS = ["Pending", "Re‑Check", "Passed"];
  const PERCENTAGE_OPTIONS = Array.from({ length: 101 }, (_, i) => `${i}%`);

  const getStatusColor = (value) => {
    switch (value) {
      case "Pending":
        return "#9E9E9E";
      case "Re‑Check":
        return "#D32F2F";
      case "Passed":
        return "#809D3C";
      default:
        return "#ccc";
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (statusRef.current && !statusRef.current.contains(e.target)) {
        setShowStatusDropdown(false);
      }
      if (plagiarismRef.current && !plagiarismRef.current.contains(e.target)) {
        setShowPlagiarismDropdown(false);
      }
      if (aiRef.current && !aiRef.current.contains(e.target)) {
        setShowAiDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="page-wrapper">
      <h2 className="section-title">
        <img src={eventsIcon} alt="Events Icon" className="icon-image" />
        Manuscript Results
      </h2>
      <hr className="divider" />

      <div className="tasks-container">
        <table className="tasks-table">
          <thead>
            <tr>
              <th>NO</th>
              <th>TEAM</th>
              <th>TITLE</th>
              <th>DUE DATE</th>
              <th>TIME</th>
              <th>PLAGIARISM</th>
              <th>AI</th>
              <th>FILE</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1.</td>
              <td>Team Alpha</td>
              <td className="wrap-text">Automated Watering System</td>
              <td>
                <img src={dueDateIcon} alt="Due Date" className="inline-icon" />
                Sep 25, 2025
              </td>
              <td>
                <img src={timeIcon} alt="Time" className="inline-icon" />
                3:30 PM
              </td>

              {/* Plagiarism */}
              <td ref={plagiarismRef}>
                <div
                  className="dropdown-wrapper narrow"
                  onClick={() =>
                    setShowPlagiarismDropdown(!showPlagiarismDropdown)
                  }
                >
                  <div className="revision-badge">
                    {plagiarism}
                    <img
                      src={redDropdownIcon}
                      alt="▼"
                      className="revision-dropdown-icon"
                    />
                  </div>
                  {showPlagiarismDropdown && (
                    <div className="dropdown-menu">
                      {PERCENTAGE_OPTIONS.map((opt) => (
                        <div
                          key={opt}
                          className="dropdown-item"
                          onClick={() => {
                            setPlagiarism(opt);
                            setShowPlagiarismDropdown(false);
                          }}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </td>

              {/* AI Score */}
              <td ref={aiRef}>
                <div
                  className="dropdown-wrapper narrow ai-wrapper"
                  onClick={() => setShowAiDropdown(!showAiDropdown)}
                >
                  <div className="revision-badge ai-badge">
                    {aiScore}
                    <img
                      src={redDropdownIcon}
                      alt="▼"
                      className="revision-dropdown-icon"
                    />
                  </div>
                  {showAiDropdown && (
                    <div className="dropdown-menu ai-dropdown-menu">
                      {PERCENTAGE_OPTIONS.map((opt) => (
                        <div
                          key={opt}
                          className="dropdown-item"
                          onClick={() => {
                            setAiScore(opt);
                            setShowAiDropdown(false);
                          }}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </td>

              {/* File Upload */}
              <td>
                <div className="upload-box">Upload</div>
              </td>

              {/* Status */}
              <td ref={statusRef}>
                <div className="dropdown-wrapper status-wrapper">
                  <div
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(status) }}
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  >
                    {status}
                    <img
                      src={dropdownIconWhite}
                      alt="▼"
                      className="status-dropdown-icon"
                    />
                  </div>
                  {showStatusDropdown && (
                    <div className="dropdown-menu status-dropdown-menu">
                      {STATUS_OPTIONS.map((opt) => (
                        <div
                          key={opt}
                          className="dropdown-item"
                          onClick={() => {
                            setStatus(opt);
                            setShowStatusDropdown(false);
                          }}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .page-wrapper {
          width: 100%;
          padding: 40px 20px;
        }

        .section-title {
          font-size: 20px;
          font-weight: bold;
          color: #3B0304;
          margin-bottom: 5px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .icon-image {
          width: 24px;
          height: 24px;
        }

        .divider {
          border: none;
          border-top: 2px solid #3B0304;
          margin-bottom: 20px;
        }

        .tasks-container {
          background: #fff;
          border-radius: 20px;
          width: 100%;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          padding: 20px;
          border: 1px solid #B2B2B2;
        }

        .tasks-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .tasks-table th,
        .tasks-table td {
          padding: 10px 6px;
          text-align: center;
          vertical-align: middle;
        }

        .tasks-table th {
          background-color: #fafafa;
          font-weight: bold;
        }

        .wrap-text {
          word-break: break-word;
          white-space: normal;
        }

        .inline-icon {
          width: 14px;
          height: 14px;
          margin-right: 4px;
          vertical-align: middle;
        }

        .dropdown-wrapper {
          position: relative;
          width: 100%;
        }

        .dropdown-wrapper.narrow {
          max-width: 72px;
          margin: auto;
        }

        .ai-wrapper {
          width: 72px;
          margin: auto;
        }

        .ai-badge {
          width: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px 6px;
          border: 1px solid #3B0304;
          border-radius: 12px;
          font-weight: bold;
          color: #3B0304;
          cursor: pointer;
          font-size: 12px;
        }

        .revision-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px 6px;
          border: 1px solid #3B0304;
          border-radius: 12px;
          font-weight: bold;
          color: #3B0304;
          cursor: pointer;
          font-size: 12px;
        }

        .revision-dropdown-icon,
        .status-dropdown-icon {
          width: 12px;
          height: 12px;
          margin-left: 6px;
        }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          background: #fff;
          border: 1px solid #B2B2B2;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          z-index: 1000;
          max-height: 180px;
          overflow-y: auto;
        }

        .ai-dropdown-menu {
          width: 72px;
        }

        .status-wrapper {
          width: 100px;
          margin: auto;
        }

        .status-badge {
          width: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px 10px;
          border-radius: 12px;
          color: #fff;
          cursor: pointer;
          font-weight: bold;
          font-size: 12px;
        }

        .status-dropdown-menu {
          width: 100px;
        }

        .dropdown-item {
          padding: 6px 8px;
          cursor: pointer;
          font-size: 12px;
        }

        .dropdown-item:hover {
          background-color: #f0f0f0;
        }

        .upload-box {
          border: 1px solid #3B0304;
          border-radius: 12px;
          padding: 6px 10px;
          color: #3B0304;
          font-weight: bold;
          font-size: 13px;
          width: 70px;
          margin: auto;
        }
      `}</style>
    </div>
  );
}
