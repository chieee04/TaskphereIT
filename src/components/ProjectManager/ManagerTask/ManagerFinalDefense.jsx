// src/components/tasks/ManagerFinalDefense.jsx
import React, { useState } from "react";
import "../../Style/ProjectManager/ManagerOralDefense.css";

import taskIcon from "../../../assets/tasks-icon.png";
import createTasksIcon from "../../../assets/create-tasks-icon.png";
import dueDateIcon from "../../../assets/due-date-icon.png";
import timeIcon from "../../../assets/time-icon.png";

import { openCreateFinalTask } from "../../../services/Manager/ManagerFinalTask";

const ManagerFinalDefense = () => {
  const [tasks, setTasks] = useState([]);

  // Handler para sa Create Task
  const handleCreateTask = async () => {
    const newTasks = await openCreateFinalTask();

    if (newTasks && Array.isArray(newTasks)) {
      setTasks((prev) => [...newTasks, ...prev]);
    }
  };

  return (
    <div className="page-wrapper">
      <h2 className="section-title">
        <img src={taskIcon} alt="Tasks Icon" className="icon-image" />
        Final Defense
      </h2>
      <hr className="divider" />

      <div className="header-wrapper">
        {/* Create Task Button */}
        <button
          type="button"
          className="create-task-button"
          onClick={handleCreateTask}
        >
          <img
            src={createTasksIcon}
            alt="Create Task Icon"
            className="create-task-icon"
          />
          Create Task
        </button>

        {/* TASKS TABLE */}
        <div className="tasks-container">
          <table className="tasks-table">
            <thead>
              <tr>
                <th className="center-text">NO</th>
                <th className="center-text">Assigned</th>
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
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="12" className="center-text">
                    No Task
                  </td>
                </tr>
              ) : (
                tasks.map((task, idx) => (
                  <tr key={task.id}>
                    <td className="center-text">{idx + 1}.</td>
                    <td className="center-text">
                      {task.member?.first_name} {task.member?.last_name}
                    </td>
                    <td className="center-text">{task.task}</td>
                    <td className="center-text">{task.subtask}</td>
                    <td className="center-text">{task.element}</td>
                    <td className="center-text">{task.created_at}</td>
                    <td className="center-text">
                      <img
                        src={dueDateIcon}
                        alt="Due Date"
                        className="inline-icon"
                      />
                      {task.due_date}
                    </td>
                    <td className="center-text">
                      <img src={timeIcon} alt="Time" className="inline-icon" />
                      {task.time}
                    </td>
                    <td className="center-text">{task.revision}</td>
                    <td className="center-text">{task.status}</td>
                    <td className="center-text">{task.methodology}</td>
                    <td className="center-text">{task.project_phase}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerFinalDefense;
