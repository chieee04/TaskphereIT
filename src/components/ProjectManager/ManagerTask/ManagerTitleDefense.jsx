import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../../supabaseClient";
import { FaPlus, FaCalendarAlt, FaClock, FaCogs, FaTasks, FaTrash, FaSearch, FaTimes, FaFilter, FaChevronDown } from 'react-icons/fa'; 
import "../../Style/ProjectManager/ManagerTitleDefense.css"; 
import { openCreateTask, openMethodology} from "../../../services/Manager/ManagerCreateTitleTask";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// --- Global Constants ---
const customUser = JSON.parse(localStorage.getItem("customUser"));
const managerId = customUser?.id; 

const ManagerTitleDefense = () => {
  const [tasks, setTasks] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedTaskIds, setSelectedTaskIds] = useState([]); 
  const [isSelectionMode, setIsSelectionMode] = useState(false); 
  
  const STATUS_OPTIONS = ["To Do", "In Progress", "To Review", "Completed"];
  const FILTER_OPTIONS = ["All", "To Do", "In Progress", "To Review", "Missed"]; 
  const REVISION_OPTIONS = Array.from({ length: 10 }, (_, i) => {
    const num = i + 1;
    if (num === 1) return "1st Revision";
    if (num === 2) return "2nd Revision";
    if (num === 3) return "3rd Revision";
    return `${num}th Revision`;
  });

  // ✅ Function to get the correct color code
  const getStatusColor = (value) => {
    switch (value) {
      case "To Do": return "#FABC3F";
      case "In Progress": return "#809D3C";
      case "To Review": return "#578FCA";
      case "Completed": return "#AA60C8";
      case "Missed": return "#D60606";
      default: return "#ccc";
    }
  };

  // ✅ Fetch tasks from Supabase (include member alias)
  const fetchTasks = async () => {
    const storedUser = JSON.parse(localStorage.getItem("customUser"));
    if (!storedUser) {
      console.error("❌ No customUser found in localStorage");
      return;
    }

    const currentManagerId = storedUser.id;

    const { data, error } = await supabase
      .from("manager_title_task")
      .select(`
        id,
        task_name,
        due_date,
        due_time,
        created_date,
        created_time,
        methodology,
        project_phase,
        revision,
        status,
        manager_id,
        member:user_credentials!manager_title_task_member_id_fkey(first_name, last_name)
      `)
      .eq("manager_id", currentManagerId)
      .order("created_date", { ascending: false });

    if (error) {
      console.error("❌ Fetch error:", error);
      return;
    }

    // 🔹 Helper para malaman kung Missed
    const isMissed = (task) => {
      if (!task.due_date || !task.due_time) return false;
      const now = new Date();
      const dueDateTime = new Date(`${task.due_date}T${task.due_time}`); 
      return now > dueDateTime && task.status !== "Completed" && task.status !== "Missed";
    };

    // 🔹 Update tasks kung Missed
    const updatedTasks = await Promise.all(
      data.map(async (task) => {
        if (task.status === "Completed") return task;

        if (isMissed(task)) {
          const { error: updateError } = await supabase
            .from("manager_title_task")
            .update({ status: "Missed" })
            .eq("id", task.id);

          if (updateError) {
            console.error(`❌ Error updating task ${task.id}:`, updateError);
          } 

          return { ...task, status: "Missed" };
        }

        return task;
      })
    );


    setTasks(updatedTasks);
  };
  
  useEffect(() => {
    fetchTasks();
  }, []);


  // --- Selection and Deletion Handlers ---

  const handleSelectTask = (taskId, isChecked) => {
    setSelectedTaskIds(prev => 
      isChecked ? [...prev, taskId] : prev.filter(id => id !== taskId)
    );
  };

  const handleSelectAllTasks = (isChecked) => {
    if (isChecked) {
      const allTaskIds = filteredAndSearchedTasks.map(task => task.id);
      setSelectedTaskIds(allTaskIds);
    } else {
      setSelectedTaskIds([]);
    }
  };

  const handleToggleSelectionMode = (enable) => {
    setIsSelectionMode(enable);
    if (!enable) {
      setSelectedTaskIds([]); // Clear selections on cancel
    }
  };

  const handleDeleteSelectedTasks = async () => {
    if (selectedTaskIds.length === 0) {
      MySwal.fire("No Selection", "Please select at least one task to delete.", "warning");
      return;
    }

    const result = await MySwal.fire({
      title: `Delete ${selectedTaskIds.length} Task(s)?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete them",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3B0304", 
    });

    if (!result.isConfirmed) return;

    const { error } = await supabase
      .from("manager_title_task")
      .delete()
      .in("id", selectedTaskIds);

    if (error) {
      console.error("❌ Delete selected tasks error:", error);
      MySwal.fire("Error", "Failed to delete selected tasks.", "error");
    } else {
      setTasks(prev => prev.filter(t => !selectedTaskIds.includes(t.id)));
      setIsSelectionMode(false); // Exit selection mode
      setSelectedTaskIds([]); 
      MySwal.fire("Deleted!", `${selectedTaskIds.length} task(s) have been deleted.`, "success");
    }
  };
  
  // ✅ NEW: Dedicated function for single task deletion
  const handleSingleTaskDelete = async (taskId, taskName) => {
    const result = await MySwal.fire({
      title: `Delete Task: "${taskName}"?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3B0304", 
    });

    if (!result.isConfirmed) return;

    const { error } = await supabase
      .from("manager_title_task")
      .delete()
      .eq("id", taskId);

    if (error) {
      console.error("❌ Single task delete error:", error);
      MySwal.fire("Error", "Failed to delete the task.", "error");
    } else {
      setTasks(prev => prev.filter(t => t.id !== taskId));
      MySwal.fire("Deleted!", `Task "${taskName}" has been deleted.`, "success");
      // If the task was selected in multi-select mode, remove it from selections
      setSelectedTaskIds(prev => prev.filter(id => id !== taskId));
    }
  };


  // --- Update Handlers ---

  // ✅ Update revision
  const handleRevisionChange = async (taskId, revisionText) => {
    const revisionInt = parseInt(revisionText); 
    const { error } = await supabase
      .from("manager_title_task")
      .update({ revision: revisionInt })
      .eq("id", taskId);

    if (error) {
      console.error("❌ Update revision error:", error);
      MySwal.fire("Error", "Failed to update revision.", "error");
    } else {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, revision: revisionInt } : t
        )
      );
    }
  };
  
  // ✅ Update status with SweetAlert confirm for "Completed"
  const handleStatusChange = async (taskId, newStatus) => {
    if (newStatus === "Completed") {
      const result = await MySwal.fire({
        title: "Mark as Completed?",
        text: "Do you want to mark this task as completed?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, complete it",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#3B0304",
      });

      if (!result.isConfirmed) return; 

      const today = new Date().toISOString().split("T")[0];

      const { error } = await supabase
        .from("manager_title_task")
        .update({ status: newStatus, date_completed: today })
        .eq("id", taskId);

      if (error) {
        console.error("❌ Update status error:", error);
        MySwal.fire("Error", "Failed to update status.", "error");
      } else {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        MySwal.fire("✅ Completed!", "Task has been marked as completed.", "success");
      }
    } else {
      const { error } = await supabase
        .from("manager_title_task")
        .update({ status: newStatus })
        .eq("id", taskId);

      if (error) {
        console.error("❌ Update status error:", error);
        MySwal.fire("Error", "Failed to update status.", "error");
      } else {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId ? { ...t, status: newStatus } : t
          )
        );
      }
    }
  };
  
  // --- Filtering and Search Logic ---
  const filteredAndSearchedTasks = tasks
    .filter((task) => task.status !== "Completed")
    .filter((task) => {
      // 1. Filter by Status
      if (selectedFilter !== "All" && task.status !== selectedFilter) {
        return false;
      }
      
      // 2. Filter by Search Term
      if (!searchTerm) return true;

      const lowerSearchTerm = searchTerm.toLowerCase();
      
      // Search Task Name, Member Name, Methodology, and Project Phase
      return (
        task.task_name.toLowerCase().includes(lowerSearchTerm) ||
        `${task.member?.first_name} ${task.member?.last_name}`.toLowerCase().includes(lowerSearchTerm) ||
        task.methodology.toLowerCase().includes(lowerSearchTerm) ||
        task.project_phase.toLowerCase().includes(lowerSearchTerm)
      );
    });

  const allTasksSelected = filteredAndSearchedTasks.length > 0 && selectedTaskIds.length === filteredAndSearchedTasks.length;
  
  return (
    <div className="container-fluid px-4 py-3">
      
      <style>{`
        /* --- General Styles --- */
        .table-scroll-area::-webkit-scrollbar {
          display: none;
        }
        .section-title {
          font-weight: 600;
          color: #3B0304;
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        .divider {
          height: 1.5px;
          background-color: #3B0304;
          width: calc(100% + 50px);
          margin-left: -16px;
          border-radius: 50px;
          margin-bottom: 1.5rem;
          border: none;
        }
        
        /* --- Button Styles (Create, Methodology, Cancel, Delete Selected) --- */
        .primary-button {
          font-size: 0.85rem !important;
          padding: 6px 12px !important;
          border-radius: 6px !important;
          border: 1.5px solid #3B0304 !important;
          background-color: white !important;
          color: #3B0304 !important;
          font-weight: 500 !important;
          cursor: pointer !important;
          transition: background-color 0.2s !important;
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
          white-space: nowrap;
        }
        .primary-button:hover {
          background-color: #f0f0f0 !important;
        }
        /* Delete Selected is styled as a standard primary button (white background) */
        .delete-selected-button-white {
             background-color: white !important;
             color: #3B0304 !important;
             border-color: #3B0304 !important;
        }
        .delete-selected-button-white:hover {
            background-color: #f0f0f0 !important;
        }

        /* --- Search Bar Styles --- */
        .search-input-container {
            position: relative;
            width: 100%; 
            max-width: 200px; 
        }
        .search-input {
            width: 100%;
            padding: 7px 12px 7px 35px; 
            border: 1px solid #B2B2B2;
            border-radius: 6px;
            background-color: white;
            color: #3B0304;
            font-size: 0.85rem;
            box-shadow: none;
            transition: border-color 0.2s;
            height: 34px; 
        }
        .search-input:focus {
            outline: none;
            border-color: #3B0304;
        }
        .search-icon {
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: #B2B2B2;
            font-size: 0.85rem;
        }

        /* --- Filter Styles (White background, gray border, tight width) --- */
        .filter-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            border: 1px solid #B2B2B2; 
            border-radius: 6px;
            background-color: white;
            color: #3B0304;
            font-size: 0.85rem;
            font-weight: 500;
            padding: 6px 8px; 
            gap: 6px;
            cursor: pointer;
            transition: border-color 0.2s, background-color 0.2s;
        }
        .filter-wrapper:hover {
            background-color: #f0f0f0;
            border-color: #3B0304; 
        }
        .filter-select {
            /* Full transparency over the wrapper to capture clicks */
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0; 
            cursor: pointer;
            z-index: 10;
        }
        /* Filter Dropdown Content Styles */
        .filter-select option {
            background-color: white !important; 
            color: black !important; 
        }
        .filter-content {
            display: flex;
            align-items: center;
            gap: 6px;
            pointer-events: none;
        }


        /* --- Table/Dropdown Styles --- */
        .tasks-table th {
          background-color: #f8f9fa !important;
          font-weight: 600 !important;
          color: #3B0304 !important;
          text-transform: uppercase;
          font-size: 0.75rem;
          padding: 12px 6px !important;
          white-space: nowrap;
        }
        .tasks-table td {
          padding: 8px 6px !important;
          font-size: 0.875rem;
          color: #495057;
          border-bottom: 1px solid #dee2e6;
          vertical-align: middle; 
        }
        .tasks-table tbody tr:hover {
          background-color: #f8f9fa;
        }
        
        /* Custom Dropdown Container and Icon Positioning */
        .dropdown-control-wrapper {
            position: relative;
            display: inline-flex;
            align-items: center;
            vertical-align: middle;
            min-width: 90px;
        }
        .dropdown-icon-chevron { 
            position: absolute;
            right: 6px;
            pointer-events: none; 
            font-size: 0.75rem;
            z-index: 2;
        }
        
        /* Custom Dropdown Styling for Revision */
        .revision-select {
            border: 1px solid #ccc !important;
            background-color: white !important;
            color: #3B0304 !important;
            border-radius: 4px !important;
            padding: 4px 20px 4px 6px !important; 
            font-size: 0.85rem !important;
            appearance: none !important; 
            cursor: pointer;
            width: 100%;
        }
        .revision-select:focus {
             outline: 1px solid #3B0304;
        }
        
        /* Status Dropdown Styling (The selected value area) */
        .status-select {
          min-width: 90px;
          padding: 4px 20px 4px 6px !important; 
          border-radius: 4px;
          font-weight: 500;
          color: white;
          border: none;
          appearance: none; 
          cursor: pointer;
          font-size: 0.85rem;
          text-align: center;
          width: 100%;
        }
        
        /* Status Dropdown Option Styles */
        .status-select option {
            color: black !important; 
            background-color: white !important; 
            padding: 4px 8px;
        }

        .status-container {
            display: inline-flex;
            border-radius: 4px;
            overflow: hidden;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1); 
            min-width: 90px;
        }

        /* Helper class for Date/Time centering */
        .center-content-flex {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            height: 100%;
        }
      `}</style>

      <div className="row">
        <div className="col-12">
          {/* Header */}
          <h2 className="section-title">
            <FaTasks className="me-2" size={18} />
            Title Defense
          </h2>
          <hr className="divider" />
        </div>

        <div className="col-12 col-md-12 col-lg-12">
          
          {/* Top Control Buttons (Row 1) */}
          <div className="d-flex align-items-center gap-2 mb-3">
            
            {/* Create Task Button */}
            <button
              type="button"
              className="primary-button"
              onClick={async () => {
                const currentManagerId = customUser?.id;

                const newTasks = await openCreateTask(currentManagerId, {
                  revision: 1,
                  status: "To Do",
                });

                if (newTasks && Array.isArray(newTasks)) {
                  setTasks((prev) => [...newTasks, ...prev]);
                }
              }}
            >
              <FaPlus size={14} /> Create Task
            </button>

            {/* Methodology Button */}
            <button
              type="button"
              className="primary-button"
              onClick={async () => {
                const chosen = await openMethodology(managerId);
                if (chosen) {
                  console.log("📌 Methodology saved:", chosen);
                }
              }}
            >
              <FaCogs size={14} /> Methodology
            </button>
            
          </div>
          
          {/* Search, Delete Selected, and Filter (Row 2) */}
          <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
            
            {/* Search Input (Placeholder Fixed) */}
            <div className="search-input-container">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search member" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Right Side Group: Delete and Filter */}
            <div className="d-flex align-items-center gap-2">
                 
                {/* Cancel Button (Visible in selection mode, NO ICON) */}
                {isSelectionMode && (
                    <button
                        type="button"
                        className="primary-button"
                        onClick={() => handleToggleSelectionMode(false)}
                    >
                        Cancel
                    </button>
                )}
                 
                {/* Delete Button (Now always white/border style) */}
                <button
                    type="button"
                    className={`primary-button ${isSelectionMode ? 'delete-selected-button-white' : ''}`}
                    onClick={() => {
                        if (isSelectionMode) {
                            handleDeleteSelectedTasks();
                        } else {
                            handleToggleSelectionMode(true);
                        }
                    }}
                    disabled={isSelectionMode && selectedTaskIds.length === 0}
                >
                    <FaTrash size={14} /> 
                    {/* Removed task count */}
                    {isSelectionMode ? `Delete Selected` : 'Delete'}
                </button>
                
                
                {/* Filter Dropdown (White background, reduced width) */}
                <div className="filter-wrapper">
                    <span className="filter-content">
                        <FaFilter size={14} /> Filter: {selectedFilter} 
                    </span>
                    
                    <select
                        className="filter-select"
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                    >
                        {FILTER_OPTIONS.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
            </div>
          </div>


          {/* Table Section */}
          <div className="bg-white rounded-lg shadow-md relative">
            <div 
              className="table-scroll-area overflow-x-auto overflow-y-auto"
              style={{ maxHeight: '600px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            > 
              <table className="tasks-table min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    {/* Checkbox for Select All (Only show in selection mode) */}
                    {isSelectionMode && (
                        <th className="center-text" style={{ width: '40px' }}>
                            <input 
                                type="checkbox" 
                                checked={allTasksSelected}
                                onChange={(e) => handleSelectAllTasks(e.target.checked)}
                                disabled={filteredAndSearchedTasks.length === 0}
                            />
                        </th>
                    )}
                    <th className="center-text">NO</th>
                    <th className="center-text">Assigned</th>
                    <th className="center-text">Tasks</th>
                    <th className="center-text">Date Created</th>
                    <th className="center-text">Due Date</th>
                    <th className="center-text">Time</th>
                    <th className="center-text">Revision No.</th>
                    <th className="center-text" style={{ minWidth: '130px' }}>Status</th>
                    <th className="center-text">Methodology</th>
                    <th className="center-text">Project Phase</th>
                    <th className="center-text" style={{ width: '50px' }}>Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSearchedTasks.map((task, idx) => {
                      const statusColor = getStatusColor(task.status);
                      const isMissed = task.status === "Missed";
                      
                      return (
                        <tr key={task.id} className="hover:bg-gray-50 transition duration-150">
                          {/* Checkbox for Single Task Selection (Only show in selection mode) */}
                          {isSelectionMode && (
                              <td className="center-text">
                                  <input 
                                      type="checkbox" 
                                      checked={selectedTaskIds.includes(task.id)}
                                      onChange={(e) => handleSelectTask(task.id, e.target.checked)}
                                  />
                              </td>
                          )}
                          <td className="center-text">{idx + 1}.</td>
                          <td className="center-text">
                            {task.member?.first_name} {task.member?.last_name}
                          </td>
                          <td className="center-text">{task.task_name}</td>
                          <td className="center-text">{task.created_date}</td>
                          
                          {/* Due Date Cell */}
                          <td className="center-text">
                            <div className="center-content-flex">
                                <FaCalendarAlt size={14} style={{ color: '#3B0304' }} />
                                {task.due_date}
                            </div>
                          </td>
                          
                          {/* Time Cell */}
                          <td className="center-text">
                            <div className="center-content-flex">
                                <FaClock size={14} style={{ color: '#3B0304' }} />
                                {task.due_time}
                            </div>
                          </td>

                          {/* Revision Dropdown */}
                          <td className="center-text">
                            <div className="dropdown-control-wrapper" style={{ minWidth: '100px' }}>
                                <select
                                    value={task.revision}
                                    onChange={(e) => handleRevisionChange(task.id, e.target.value)}
                                    className="revision-select"
                                >
                                    {REVISION_OPTIONS.map((label, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                                <FaChevronDown className="dropdown-icon-chevron" style={{ color: '#3B0304' }} />
                            </div>
                          </td>

                          {/* Status Dropdown / Missed Indicator */}
                          <td className="center-text">
                            {isMissed ? (
                                <div 
                                    className="status-container"
                                    style={{ backgroundColor: statusColor }}
                                >
                                    <span style={{ 
                                        padding: '4px 6px', 
                                        color: 'white', 
                                        fontWeight: '500', 
                                        fontSize: '0.85rem',
                                        minWidth: '90px'
                                    }}>
                                        Missed
                                    </span>
                                </div>
                            ) : (
                                <div 
                                    className="dropdown-control-wrapper"
                                    // The background color of the wrapper changes based on the status color
                                    style={{ backgroundColor: statusColor, borderRadius: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
                                >
                                    <select
                                        value={task.status}
                                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                        className="status-select"
                                        // The background color of the select element is also set by the status color
                                        style={{ backgroundColor: statusColor }} 
                                    >
                                        {/* Dropdown options are styled via CSS (status-select option) */}
                                        {STATUS_OPTIONS.filter(s => s !== "Missed").map((s) => (
                                            <option key={s} value={s} >
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                    <FaChevronDown className="dropdown-icon-chevron" style={{ color: 'white' }} />
                                </div>
                            )}
                          </td>

                          <td className="center-text">{task.methodology}</td>
                          <td className="center-text">{task.project_phase}</td>
                          
                          {/* Action Column (Single Delete Button) */}
                          <td className="center-text">
                             <button
                                // ✅ UPDATED: Call the specific single task delete function
                                onClick={() => handleSingleTaskDelete(task.id, task.task_name)} 
                                style={{ 
                                    border: 'none', 
                                    background: 'none', 
                                    color: '#3B0304', 
                                    cursor: 'pointer',
                                    padding: '4px',
                                    transition: 'color 0.15s'
                                }}
                                title="Delete Task"
                            >
                                <FaTrash size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredAndSearchedTasks.length === 0 && (
                        <tr>
                            <td colSpan={isSelectionMode ? "13" : "12"} className="text-center py-4 text-gray-500">
                                No active tasks found matching the current search or filter criteria.
                            </td>
                        </tr>
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerTitleDefense;