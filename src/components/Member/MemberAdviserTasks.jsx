// src/components/adviser-tasks.jsx
import React, { useState, useEffect, useRef } from "react";
import adviserTasksIcon from "../../assets/adviser-tasks-icon.png"; // 🔁 updated icon
import searchIcon from "../../assets/search-icon.png";
import filterIcon from "../../assets/filter-icon.png";
import exitIcon from "../../assets/exit-icon.png";
import dropdownIconWhite from "../../assets/dropdown-icon-white.png";

const MemberAdviserTasks = () => {
  const [status, setStatus] = useState("To Review");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [filterLabel, setFilterLabel] = useState("Filter");
  const [selectedFilterValue, setSelectedFilterValue] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeFilterCategory, setActiveFilterCategory] = useState(null);

  const statusDropdownRef = useRef(null);
  const filterDropdownRef = useRef(null);

  const STATUS_OPTIONS = ["To Do", "In Progress", "To Review", "Completed", "Missed"];
  const PROJECT_PHASES = ["Planning", "Design", "Development", "Testing", "Deployment", "Review"];

  const getStatusColor = (value) => {
    switch (value) {
      case "To Do":
        return "#FABC3F";
      case "In Progress":
        return "#809D3C";
      case "To Review":
        return "#578FCA";
      case "Completed":
        return "#4CAF50";
      case "Missed":
        return "#D32F2F";
      default:
        return "#ccc";
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target)
      ) {
        setShowStatusDropdown(false);
      }
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target)
      ) {
        setShowFilterDropdown(false);
        setActiveFilterCategory(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClearFilter = (e) => {
    e.stopPropagation();
    setSelectedFilterValue("");
    setFilterLabel("Filter");
    setShowFilterDropdown(false);
    setActiveFilterCategory(null);
  };

  return (
    <div className="page-wrapper">
      <h2 className="section-title">
        <img src={adviserTasksIcon} alt="Adviser Tasks Icon" className="icon-image" />
        Adviser Tasks
      </h2>
      <hr className="divider" />

      <div className="tasks-container">
        <div className="search-filter-wrapper">
          <div className="search-bar">
            <img src={searchIcon} alt="Search Icon" className="search-icon" />
            <input type="text" placeholder="Search" className="search-input" />
          </div>

          <div className="filter-wrapper" ref={filterDropdownRef}>
            <button
              type="button"
              className="filter-button"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <img src={filterIcon} alt="Filter Icon" className="filter-icon" />
              {selectedFilterValue || filterLabel}
              {selectedFilterValue && (
                <img
                  src={exitIcon}
                  alt="Clear Filter"
                  className="clear-icon"
                  onClick={handleClearFilter}
                />
              )}
            </button>
            {showFilterDropdown && (
              <div className="dropdown-menu filter-dropdown-menu">
                {!activeFilterCategory ? (
                  <>
                    <div
                      className="dropdown-item"
                      onClick={() => setActiveFilterCategory("Status")}
                    >
                      Status
                    </div>
                    <div
                      className="dropdown-item"
                      onClick={() => setActiveFilterCategory("Project Phase")}
                    >
                      Project Phase
                    </div>
                  </>
                ) : (
                  <>
                    <div className="dropdown-title">{activeFilterCategory}</div>
                    <hr />
                    {(activeFilterCategory === "Status" ? STATUS_OPTIONS : PROJECT_PHASES).map(
                      (opt) => (
                        <div
                          key={opt}
                          className="dropdown-item"
                          onClick={() => {
                            setSelectedFilterValue(opt);
                            setFilterLabel(activeFilterCategory);
                            setShowFilterDropdown(false);
                            setActiveFilterCategory(null);
                          }}
                        >
                          {opt}
                        </div>
                      )
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

<div className="tasks-table-wrapper">
  <table className="tasks-table">
    <thead>
      <tr>
        <th className="center-text">NO</th>
        <th className="center-text">Team</th>
        <th className="center-text">Tasks</th>
        <th className="center-text">Subtasks</th>
        <th className="center-text">Elements</th>
        <th className="center-text">Date Created</th>
        <th className="center-text">Due Date</th>
        <th className="center-text">Time</th>
        <th className="center-text">Revision No.</th>
        <th className="center-text">Status</th>
        <th className="center-text">Methodology</th>
        <th className="center-text">Project Phase</th>
      </tr>
    </thead>
          <tbody>
            <tr>
              <td className="center-text">1.</td>
              <td className="center-text">Team Phoenix</td>
              <td className="center-text">Prototype Implementation</td>
              <td className="center-text">API Integration</td>
              <td className="center-text">Backend Services</td>
              <td className="center-text">Aug 1, 2025</td>
              <td className="center-text">Aug 15, 2025</td>
              <td className="center-text">10:00 AM</td>
              <td className="center-text revision">1st Revision</td>
              <td className="center-text status-cell">
                <div className="dropdown-wrapper" ref={statusDropdownRef}>
                  <div
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(status) }}
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  >
                    <span className="status-text">{status}</span>
                    <img
                      src={dropdownIconWhite}
                      alt="Dropdown Icon"
                      className="status-dropdown-icon"
                    />
                  </div>
                  {showStatusDropdown && (
                    <div className="dropdown-menu">
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
              <td className="center-text">Agile</td>
              <td className="center-text">Development</td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; }
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
          padding: 20px;
          border: 1px solid #B2B2B2;
        }
        .search-filter-wrapper {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          gap: 12px;
        }
        .search-bar {
          display: flex;
          align-items: center;
          background: #fff;
          border: 1px solid #3B0304;
          border-radius: 12px;
          padding: 6px 12px;
          width: 200px;
        }
        .search-icon {
          width: 16px;
          height: 16px;
        }
        .search-input {
          border: none;
          outline: none;
          font-size: 14px;
          color: #3B0304;
          width: 100%;
          margin-left: 6px;
        }
        .filter-wrapper {
          position: relative;
          width: 160px;
          user-select: none;
        }
        .filter-button {
          display: flex;
          align-items: center;
          background: #fff;
          border: 1px solid #3B0304;
          border-radius: 12px;
          padding: 6px 12px;
          font-size: 14px;
          color: #3B0304;
          width: 100%;
          cursor: pointer;
          gap: 6px;
        }
        .filter-icon {
          width: 18px;
          height: 18px;
        }
        .clear-icon {
          margin-left: auto;
          width: 16px;
          height: 16px;
        }
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 12px);
          left: 0;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          z-index: 10;
          width: 100%;
          padding: 4px 0;
        }
        .filter-dropdown-menu {
          padding: 8px;
        }
        .dropdown-item {
          padding: 10px 12px;
          cursor: pointer;
          font-size: 14px;
        }
        .dropdown-item:hover {
          background-color: #f0f0f0;
        }
        .dropdown-title {
          font-weight: bold;
          padding: 4px 12px;
          font-size: 13px;
          color: #3B0304;
        }
        .tasks-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .tasks-table th,
        .tasks-table td {
          padding: 12px 10px;
          white-space: nowrap;
          text-align: center;
        }
        .tasks-table th {
          background-color: #fafafa;
          font-weight: bold;
        }
        .tasks-table tbody tr:nth-child(even) {
          background-color: #fafafa;
        }
        .revision {
          color: #3B0304;
          font-weight: bold;
        }
        .dropdown-wrapper {
          position: relative;
          display: inline-block;
          width: 120px;
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 12px;
          border-radius: 12px;
          color: #fff;
          cursor: pointer;
          font-weight: bold;
          width: 100%;
        }
        .status-text {
          font-size: 14px;
        }
        .status-dropdown-icon {
          width: 12px;
          height: 12px;
          margin-left: 6px;
        }
        

        .tasks-table-wrapper {
  border: 1px solid #B2B2B2;
  border-radius: 12px;
  overflow-x: auto;   /* pwede mag-scroll horizontally */
  overflow-y: hidden; /* tanggalin lang vertical overflow */
  margin-top: 12px;
}

.tasks-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.tasks-table th,
.tasks-table td {
  padding: 12px 10px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.tasks-table th {
  background-color: #f5f5f5;
  font-weight: bold;
  color: #3B0304;
}

.tasks-table tbody tr:nth-child(even) {
  background-color: #fafafa;
}

.tasks-table tbody tr:last-child td {
  border-bottom: none;
}

      `}</style>
    </div>
  );
};

export default MemberAdviserTasks;
