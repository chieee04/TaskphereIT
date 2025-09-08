import React, { useState, useEffect, useRef } from "react";
import redDropdownIcon from "../../../assets/red-dropdown-icon.png";
import blackCreateTasksIcon from "../../../assets/black-create-tasks-icon.png";
import attachmentIcon from "../../../assets/attachment-icon.png";
import exitIcon from "../../../assets/exit-icon.png";


import "../../Style/ProjectManager/ManagerOralCreate.css"; 

const METHODOLOGY_OPTIONS = ["Agile", "Extreme Programming", "JAD", "RAD", "Prototyping"];

const TASK_CATEGORIES = {
  Documentation: ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4"],
  "Discussion & Review": ["Brainstorming", "Capstone Meeting", "Adviser Consultation", "Mock Defense"],
};

const SUBTASKS_OPTIONS = ["Research", "Design", "Implementation", "Testing", "Deployment"];
const ELEMENTS_OPTIONS = ["UI", "Backend", "Database", "API", "Documentation"];
const ASSIGNED_OPTIONS = ["Julliana Castaneda", "Harzwel Zhen Lacson", "Alejandro Faustino"];

const ManagerOralCreate = ({ onClose, onCreate, taskToEdit, onUpdate }) => {
  const [formData, setFormData] = useState({
    methodology: "",
    projectPhase: "",
    taskCategory: "",
    task: "",
    subtasks: "",
    elements: "",
    dueDate: "",
    time: "",
    assignedInput: "",
    assigned: [],
    comment: "",
  });

  const [showMethodologyDropdown, setShowMethodologyDropdown] = useState(false);
  const [showTaskDropdown, setShowTaskDropdown] = useState(false);
  const [showSubtasksDropdown, setShowSubtasksDropdown] = useState(false);
  const [showElementsDropdown, setShowElementsDropdown] = useState(false);
  const [showAssignedDropdown, setShowAssignedDropdown] = useState(false);

  const mRef = useRef(null);
  const tRef = useRef(null);
  const stRef = useRef(null);
  const elRef = useRef(null);
  const aRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mRef.current && !mRef.current.contains(e.target)) setShowMethodologyDropdown(false);
      if (tRef.current && !tRef.current.contains(e.target)) setShowTaskDropdown(false);
      if (stRef.current && !stRef.current.contains(e.target)) setShowSubtasksDropdown(false);
      if (elRef.current && !elRef.current.contains(e.target)) setShowElementsDropdown(false);
      if (aRef.current && !aRef.current.contains(e.target)) setShowAssignedDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    if (field === "methodology") {
      if (value === "Agile") {
        setFormData((prev) => ({ ...prev, methodology: value, projectPhase: "Design" }));
      } else {
        setFormData((prev) => ({ ...prev, methodology: value, projectPhase: "" }));
      }
    } else if (field === "assignedInput") {
      setFormData((prev) => ({ ...prev, assignedInput: value }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleTaskCategorySelect = (category) => {
    setFormData((prev) => ({ ...prev, taskCategory: category, task: "" }));
  };

  const clearTaskCategory = () => {
    setFormData((prev) => ({ ...prev, taskCategory: "", task: "" }));
  };

  const handleTaskSelect = (taskName) => {
    setFormData((prev) => ({ ...prev, task: taskName }));
    setShowTaskDropdown(false);
  };

  const handleSelect = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setShowMethodologyDropdown(false);
    setShowSubtasksDropdown(false);
    setShowElementsDropdown(false);
  };

  const handleAssignedSelect = (name) => {
    if (!formData.assigned.includes(name)) {
      setFormData((prev) => ({ ...prev, assigned: [...prev.assigned, name], assignedInput: "" }));
    }
    setShowAssignedDropdown(false);
  };

  const handleRemoveAssigned = (name) => {
    setFormData((prev) => ({ ...prev, assigned: prev.assigned.filter((n) => n !== name) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = { ...formData, assigned: formData.assigned };
    if (taskToEdit) {
      onUpdate && onUpdate(finalData);
    } else {
      onCreate && onCreate(finalData);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />

      <form className="modal-container" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="header-container">
          <div className="header-left">
            <img className="header-icon" src={blackCreateTasksIcon} alt="Create Tasks" />
            <h3 className="header-title">{taskToEdit ? "Edit Task" : "Create Task"}</h3>
          </div>
          <img src={exitIcon} alt="Exit" className="exit-icon" onClick={onClose} />
        </div>

        <hr className="header-divider" />

        {/* Form Grid */}
        <div className="form-grid">
          {/* Methodology */}
          <div className="form-field with-icon" ref={mRef}>
            <label htmlFor="methodology">Methodology</label>
            <input
              type="text"
              id="methodology"
              value={formData.methodology}
              onClick={() => setShowMethodologyDropdown(!showMethodologyDropdown)}
              readOnly
              placeholder="Select methodology"
            />
            <img className="dropdown-icon" src={redDropdownIcon} alt="dropdown" />
            {showMethodologyDropdown && (
              <div className="dropdown-menu">
                {METHODOLOGY_OPTIONS.map((option) => (
                  <div key={option} className="dropdown-item" onClick={() => handleSelect("methodology", option)}>
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Project Phase */}
          <div className="form-field">
            <label htmlFor="projectPhase">Project Phase</label>
            <input
              type="text"
              id="projectPhase"
              value={formData.projectPhase}
              onChange={handleInputChange("projectPhase")}
              readOnly={formData.methodology === "Agile"}
            />
          </div>

          {/* Task */}
          <div className="form-field with-icon" ref={tRef}>
            <label htmlFor="task">Task</label>
            <input
              type="text"
              id="task"
              value={formData.task}
              onClick={() => setShowTaskDropdown(!showTaskDropdown)}
              readOnly
              placeholder="Select task"
            />
            <img className="dropdown-icon" src={redDropdownIcon} alt="dropdown" />
            {showTaskDropdown && (
              <div className="dropdown-menu" style={{ maxHeight: "220px" }}>
                {!formData.taskCategory ? (
                  <>
                    {Object.keys(TASK_CATEGORIES).map((category) => (
                      <div key={category} className="dropdown-item" onClick={() => handleTaskCategorySelect(category)}>
                        {category}
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <div className="dropdown-category">
                      <span>{formData.taskCategory}</span>
                      <span className="dropdown-clear" onClick={clearTaskCategory}>
                        ⓧ
                      </span>
                    </div>
                    {TASK_CATEGORIES[formData.taskCategory].map((task) => (
                      <div key={task} className="dropdown-item" onClick={() => handleTaskSelect(task)}>
                        {task}
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Subtasks */}
          <div className="form-field with-icon" ref={stRef}>
            <label htmlFor="subtasks">Subtasks</label>
            <input
              type="text"
              id="subtasks"
              value={formData.subtasks}
              onClick={() => setShowSubtasksDropdown(!showSubtasksDropdown)}
              readOnly
              placeholder="Select subtasks"
            />
            <img className="dropdown-icon" src={redDropdownIcon} alt="dropdown" />
            {showSubtasksDropdown && (
              <div className="dropdown-menu">
                {SUBTASKS_OPTIONS.map((option) => (
                  <div key={option} className="dropdown-item" onClick={() => handleSelect("subtasks", option)}>
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Elements */}
          <div className="form-field with-icon" ref={elRef}>
            <label htmlFor="elements">Elements</label>
            <input
              type="text"
              id="elements"
              value={formData.elements}
              onClick={() => setShowElementsDropdown(!showElementsDropdown)}
              readOnly
              placeholder="Select elements"
            />
            <img className="dropdown-icon" src={redDropdownIcon} alt="dropdown" />
            {showElementsDropdown && (
              <div className="dropdown-menu">
                {ELEMENTS_OPTIONS.map((option) => (
                  <div key={option} className="dropdown-item" onClick={() => handleSelect("elements", option)}>
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Due Date */}
          <div className="form-field">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange("dueDate")}
              placeholder="Select date"
            />
          </div>

          {/* Time */}
          <div className="form-field time-field">
            <label htmlFor="time">Time</label>
            <input
              type="time"
              id="time"
              value={formData.time}
              onChange={handleInputChange("time")}
              placeholder="Select time"
            />
          </div>

          {/* Assigned */}
          <div className="form-field assigned-field-wrapper with-icon" ref={aRef}>
            <label htmlFor="assignedInput">Assigned</label>
            <input
              type="text"
              id="assignedInput"
              value={formData.assignedInput}
              onChange={handleInputChange("assignedInput")}
              onClick={() => setShowAssignedDropdown(!showAssignedDropdown)}
              placeholder="Select assignee"
            />
            <img className="dropdown-icon" src={redDropdownIcon} alt="dropdown" />
            {showAssignedDropdown && (
              <div className="dropdown-menu">
                {ASSIGNED_OPTIONS.filter((option) => !formData.assigned.includes(option)).map((option) => (
                  <div key={option} className="dropdown-item" onClick={() => handleAssignedSelect(option)}>
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assigned List */}
          <div className="assigned-box-wrapper">
            <label>Assigned</label>
            <div className="assigned-list">
              {formData.assigned.map((name) => (
                <div key={name} className="assigned-item">
                  <span className="remove-assigned" onClick={() => handleRemoveAssigned(name)}>
                    ×
                  </span>
                  {name}
                </div>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="form-field form-comment-wrapper">
            <label htmlFor="comment">Comment</label>
            <textarea
              id="comment"
              value={formData.comment}
              onChange={handleInputChange("comment")}
              placeholder="Add comments here..."
            />
            <div className="attachment-placeholder" title="Attach file">
              <img src={attachmentIcon} alt="Attachment" className="attachment-icon" />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="form-actions">
          <button type="submit" className="btn-submit">
            {taskToEdit ? "Update Task" : "Create Task"}
          </button>
        </div>
      </form>
    </>
  );
};

export default ManagerOralCreate;
