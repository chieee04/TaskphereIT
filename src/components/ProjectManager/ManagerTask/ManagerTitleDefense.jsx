import React, { useState, useEffect, useRef } from "react";
import TitleCreateTasks from "./title-create-tasks";
import taskIcon from "../../../assets/tasks-icon.png";
import createTasksIcon from "../../../assets/create-tasks-icon.png";
import searchIcon from "../../../assets/search-icon.png";
import filterIcon from "../../../assets/filter-icon.png";
import exitIcon from "../../../assets/exit-icon.png";
import dueDateIcon from "../../../assets/due-date-icon.png";
import timeIcon from "../../../assets/time-icon.png";
import redDropdownIcon from "../../../assets/red-dropdown-icon.png";
import dropdownIconWhite from "../../../assets/dropdown-icon-white.png";

// Import external CSS
import "../../Style/ProjectManager/ManagerTitleDefense.css"

const ManagerTitleDefense = () => {
  const [status, setStatus] = useState("To Review");
  const [revision, setRevision] = useState("1st Revision");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showRevisionDropdown, setShowRevisionDropdown] = useState(false);
  const [filterCategory, setFilterCategory] = useState("Filter");
  const [filterValue, setFilterValue] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeSubFilter, setActiveSubFilter] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreate = (newTask) => {
    console.log("New task created:", newTask);
    setIsCreateModalOpen(false);
  };

  const statusRef = useRef(null);
  const revisionRef = useRef(null);
  const filterRef = useRef(null);

  const STATUS_OPTIONS = ["To Do", "In Progress", "To Review", "Completed"];
  const REVISION_OPTIONS = [
    "1st Revision",
    "2nd Revision",
    "3rd Revision",
    "4th Revision",
    "5th Revision",
  ];
  const FILTER_STATUS_OPTIONS = ["To Do", "In Progress", "To Review", "Missed"];
  const PROJECT_PHASES = [
    "Planning",
    "Design",
    "Development",
    "Testing",
    "Deployment",
    "Review",
  ];

  const getStatusColor = (value) => {
    switch (value) {
      case "To Do":
        return "#FABC3F";
      case "In Progress":
        return "#809D3C";
      case "To Review":
        return "#578FCA";
      case "Completed":
        return "#AA60C8";
      default:
        return "#ccc";
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (statusRef.current && !statusRef.current.contains(e.target)) {
        setShowStatusDropdown(false);
      }
      if (revisionRef.current && !revisionRef.current.contains(e.target)) {
        setShowRevisionDropdown(false);
      }
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilterDropdown(false);
        setActiveSubFilter(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClearFilter = (e) => {
    e.stopPropagation();
    setFilterCategory("Filter");
    setFilterValue("");
    setShowFilterDropdown(false);
    setActiveSubFilter(null);
  };

  return (
    <div className="page-wrapper">
      <h2 className="section-title">
        <img src={taskIcon} alt="Tasks Icon" className="icon-image" />
        Title Defense
      </h2>
      <hr className="divider" />

      <div className="header-wrapper">
        <button
          type="button"
          className="create-task-button"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <img
            src={createTasksIcon}
            alt="Create Task Icon"
            className="create-task-icon"
          />
          Create Task
        </button>

        <div className="tasks-container">
          {/* Search & Filter */}
          <div className="search-filter-wrapper">
            <div className="search-bar">
              <img src={searchIcon} alt="Search" className="search-icon" />
              <input type="text" placeholder="Search" className="search-input" />
            </div>

            <div className="filter-wrapper" ref={filterRef}>
              <button
                type="button"
                className="filter-button"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              >
                <img src={filterIcon} alt="Filter" className="filter-icon" />
                {filterValue || filterCategory}
                {filterValue && (
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
                  {!activeSubFilter ? (
                    <>
                      <div
                        className="dropdown-item"
                        onClick={() => setActiveSubFilter("Status")}
                      >
                        Status
                      </div>
                      <div
                        className="dropdown-item"
                        onClick={() => setActiveSubFilter("Project Phase")}
                      >
                        Project Phase
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="dropdown-title">{activeSubFilter}</div>
                      <hr />
                      {(activeSubFilter === "Status"
                        ? FILTER_STATUS_OPTIONS
                        : PROJECT_PHASES
                      ).map((opt) => (
                        <div
                          key={opt}
                          className="dropdown-item"
                          onClick={() => {
                            setFilterValue(opt);
                            setFilterCategory(activeSubFilter);
                            setShowFilterDropdown(false);
                            setActiveSubFilter(null);
                          }}
                        >
                          {opt}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Tasks Table */}
          <table className="tasks-table">
            <thead>
              <tr>
                <th className="center-text">NO</th>
                <th className="center-text">Assigned</th>
                <th className="center-text">Tasks</th>
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
                <td className="center-text">John Doe</td>
                <td className="center-text">Defense Task Example</td>
                <td className="center-text">Jul 20, 2025</td>
                <td className="center-text">
                  <img
                    src={dueDateIcon}
                    alt="Due Date"
                    className="inline-icon"
                  />
                  Jul 25, 2025
                </td>
                <td className="center-text">
                  <img src={timeIcon} alt="Time" className="inline-icon" />
                  2:00 PM
                </td>
                <td className="center-text revision-cell" ref={revisionRef}>
                  <div
                    className="dropdown-wrapper"
                    onClick={() => setShowRevisionDropdown(!showRevisionDropdown)}
                  >
                    <div className="revision-badge">
                      {revision}
                      <img
                        src={redDropdownIcon}
                        alt="▼"
                        className="revision-dropdown-icon"
                      />
                    </div>
                    {showRevisionDropdown && (
                      <div className="dropdown-menu">
                        {REVISION_OPTIONS.map((opt) => (
                          <div
                            key={opt}
                            className="dropdown-item"
                            onClick={() => {
                              setRevision(opt);
                              setShowRevisionDropdown(false);
                            }}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td className="center-text status-cell" ref={statusRef}>
                  <div className="dropdown-wrapper">
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
                <td className="center-text">Qualitative</td>
                <td className="center-text">Planning</td>
              </tr>
            </tbody>
          </table>

          {isCreateModalOpen && (
            <TitleCreateTasks
              onClose={() => setIsCreateModalOpen(false)}
              onCreate={handleCreate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerTitleDefense;
