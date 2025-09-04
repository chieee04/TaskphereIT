// src/components/ManagerTitleCreate.jsx
import React, { useState, useEffect, useRef } from "react";
import redDropdownIcon from "../../../assets/red-dropdown-icon.png";
import blackCreateTasksIcon from "../../../assets/black-create-tasks-icon.png";
import attachmentIcon from "../../../assets/attachment-icon.png";
import exitIcon from "../../../assets/exit-icon.png";
import "../../Style/ProjectManager/ManagerTitleCreate.css"; // hiwalay na CSS file

const METHODOLOGY_OPTIONS = ["Agile", "Extreme Programming", "JAD", "RAD", "Prototyping"];
const TASK_OPTIONS = ["Brainstorming", "Capstone Meeting", "Title Defense"];
const ASSIGNED_OPTIONS = ["Julliana Castaneda", "Harzwel Zhen Lacson", "Alejandro Faustino"];

const ManagerTitleCreate = ({ onClose, onCreate, taskToEdit, onUpdate }) => {
  const [formData, setFormData] = useState({
    methodology: "",
    projectPhase: "",
    task: "",
    dueDate: "",
    time: "",
    assigned: "",
    comment: "",
  });

  const [showMethodologyDropdown, setShowMethodologyDropdown] = useState(false);
  const [showTaskDropdown, setShowTaskDropdown] = useState(false);
  const [showAssignedDropdown, setShowAssignedDropdown] = useState(false);

  const mRef = useRef(null);
  const tRef = useRef(null);
  const aRef = useRef(null);

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        methodology: taskToEdit.methodology || "",
        projectPhase: taskToEdit.projectPhase || "",
        task: taskToEdit.task || "",
        dueDate: taskToEdit.dueDate || "",
        time: taskToEdit.time || "",
        assigned: taskToEdit.assigned || "",
        comment: taskToEdit.comment || "",
      });
    }
  }, [taskToEdit]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mRef.current && !mRef.current.contains(e.target)) setShowMethodologyDropdown(false);
      if (tRef.current && !tRef.current.contains(e.target)) setShowTaskDropdown(false);
      if (aRef.current && !aRef.current.contains(e.target)) setShowAssignedDropdown(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskToEdit) {
      onUpdate({ ...taskToEdit, ...formData });
    } else {
      onCreate({ id: Date.now(), ...formData });
    }
    onClose();
  };

  return (
    <>
      <div className="modal-overlay" />
      <div className="modal-container" role="dialog" aria-modal="true">
        <div className="header-container">
          <div className="header-left">
            <img src={blackCreateTasksIcon} alt="Create Task Icon" className="header-icon" />
            <h2 className="header-title">{taskToEdit ? "Edit Task" : "Create Task"}</h2>
          </div>

          <img
            src={exitIcon}
            alt="Exit"
            className="exit-icon"
            onClick={onClose}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onClose();
            }}
          />
        </div>

        <hr className="header-divider" />

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Methodology */}
            <div className="form-field with-icon" ref={mRef}>
              <label>Methodology</label>
              <input
                type="text"
                value={formData.methodology}
                readOnly
                onClick={() => setShowMethodologyDropdown(!showMethodologyDropdown)}
                required
              />
              <img src={redDropdownIcon} className="dropdown-icon" alt="Dropdown Icon" />
              {showMethodologyDropdown && (
                <div className="dropdown-menu">
                  {METHODOLOGY_OPTIONS.map((option) => (
                    <div
                      key={option}
                      className="dropdown-item"
                      onClick={() => {
                        handleChange("methodology", option);
                        setShowMethodologyDropdown(false);
                      }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Project Phase */}
            <div className="form-field">
              <label>Project Phase</label>
              <input
                type="text"
                value={formData.projectPhase}
                onChange={(e) => handleChange("projectPhase", e.target.value)}
                required
              />
            </div>

            {/* Task */}
            <div className="form-field with-icon" ref={tRef}>
              <label>Task</label>
              <input
                type="text"
                value={formData.task}
                readOnly
                onClick={() => setShowTaskDropdown(!showTaskDropdown)}
                required
              />
              <img src={redDropdownIcon} className="dropdown-icon" alt="Dropdown Icon" />
              {showTaskDropdown && (
                <div className="dropdown-menu">
                  {TASK_OPTIONS.map((option) => (
                    <div
                      key={option}
                      className="dropdown-item"
                      onClick={() => {
                        handleChange("task", option);
                        setShowTaskDropdown(false);
                      }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Due Date */}
            <div className="form-field">
              <label>Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
                required
              />
            </div>

            {/* Time */}
            <div className="form-field">
              <label>Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleChange("time", e.target.value)}
                required
              />
            </div>

            {/* Assigned */}
            <div className="form-field with-icon assigned-field-wrapper" ref={aRef}>
              <label>Assigned</label>
              <input
                type="text"
                value={formData.assigned}
                readOnly
                onClick={() => setShowAssignedDropdown(!showAssignedDropdown)}
                required
              />
              <img src={redDropdownIcon} className="dropdown-icon" alt="Dropdown Icon" />
              {showAssignedDropdown && (
                <div className="dropdown-menu">
                  {ASSIGNED_OPTIONS.map((option) => (
                    <div
                      key={option}
                      className="dropdown-item"
                      onClick={() => {
                        handleChange("assigned", option);
                        setShowAssignedDropdown(false);
                      }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Assigned Box */}
            <div className="assigned-box-wrapper" />

            {/* Comment */}
            <div className="form-comment-wrapper">
              <label>Leave a Comment</label>
              <textarea
                value={formData.comment}
                onChange={(e) => handleChange("comment", e.target.value)}
              />
              <div className="attachment-placeholder">
                <img src={attachmentIcon} alt="Attach" className="attachment-icon" />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              {taskToEdit ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ManagerTitleCreate;
