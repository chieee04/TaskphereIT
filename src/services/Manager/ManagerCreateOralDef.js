// ManagerCreateOralDef.js
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { oralDefenseData } from "./OralDefenseData";

const MySwal = withReactContent(Swal);

// Helper
const buildOptions = (arr) =>
  [`<option value="" disabled selected hidden></option>`, ...arr.map((m) => `<option value="${m}">${m}</option>`)].join("");

// Dummy team options (replace if dynamic from DB)
const teamOptions = `
  <option value="1">Team Alpha</option>
  <option value="2">Team Beta</option>
  <option value="3">Team Gamma</option>
`;

export const openCreateOralDefTask = async () => {
  const { value: formData } = await MySwal.fire({
    title: `<div style="color:#3B0304; font-weight:600; display:flex; align-items:center; gap:8px;">
      <i class="bi bi-list-check"></i> Create Oral Defense Task</div>`,
    width: "900px",
    confirmButtonText: "Create Task",
    showCancelButton: true,
    cancelButtonText: "Cancel",
    focusConfirm: false,
    html: `
      <div style="display:grid; grid-template-columns: repeat(3,1fr); gap:12px; width:100%;">
        <div>
          <label style="font-weight:600;">Methodology</label>
          <select id="methodology" class="form-select">
            ${buildOptions(Object.keys(oralDefenseData))}
          </select>
        </div>

        <div>
          <label style="font-weight:600;">Project Phase</label>
          <input id="projectPhase" type="text" class="form-control" disabled />
        </div>

        <div>
          <label style="font-weight:600;">Task Type</label>
          <select id="taskType" class="form-select" disabled>
            <option value="" disabled selected hidden></option>
            <option value="Documentation">Documentation</option>
            <option value="Discussion & Review">Discussion & Review</option>
          </select>
        </div>

        <div>
          <label style="font-weight:600;">Task</label>
          <select id="task" class="form-select" disabled></select>
        </div>

        <div>
          <label style="font-weight:600;">Subtask</label>
          <select id="subtask" class="form-select" disabled></select>
        </div>

        <div>
          <label style="font-weight:600;">Element</label>
          <select id="element" class="form-select" disabled></select>
        </div>

        <div>
          <label style="font-weight:600;">Due Date *</label>
          <input id="dueDate" type="date" class="form-control"/>
        </div>

        <div>
          <label style="font-weight:600;">Time</label>
          <input id="time" type="time" class="form-control"/>
        </div>

        <div style="grid-column: 1 / span 3;">
          <label style="font-weight:600;">Assign Team/s *</label>
          <select id="assigned" class="form-select">
            <option value="" disabled selected hidden></option>
            ${teamOptions}
          </select>
        </div>
      </div>

      <div style="margin-top:10px;">
        <label style="font-weight:600;">Leave Comment</label>
        <textarea id="comment" rows="3" class="form-control"></textarea>
      </div>
    `,
    didOpen: () => {
      const methodology = document.getElementById("methodology");
      const projectPhase = document.getElementById("projectPhase");
      const taskType = document.getElementById("taskType");
      const task = document.getElementById("task");
      const subtask = document.getElementById("subtask");
      const element = document.getElementById("element");

      // Methodology selection
      methodology.addEventListener("change", () => {
        const selected = oralDefenseData[methodology.value];
        projectPhase.value = selected.projectPhase || "";
        taskType.disabled = false;
        task.innerHTML = `<option value="" disabled selected hidden></option>`;
        subtask.innerHTML = `<option value="" disabled selected hidden></option>`;
        element.innerHTML = `<option value="" disabled selected hidden></option>`;
        task.disabled = true;
        subtask.disabled = true;
        element.disabled = true;
      });

      // TaskType selection
      taskType.addEventListener("change", () => {
        const selected = oralDefenseData[methodology.value];
        const data = selected[taskType.value] || {};
        task.innerHTML = buildOptions(Object.keys(data));
        task.disabled = true;
        subtask.disabled = true;
        element.disabled = true;

        if (Object.keys(data).length > 0) {
          task.disabled = false;
        }
      });

      // Task selection
      task.addEventListener("change", () => {
        const selected = oralDefenseData[methodology.value][taskType.value][task.value];
        subtask.innerHTML = buildOptions(Object.keys(selected));
        subtask.disabled = true;
        element.disabled = true;

        if (Object.keys(selected).length > 0) {
          subtask.disabled = false;
        }
      });

      // Subtask selection
      subtask.addEventListener("change", () => {
        const elements = oralDefenseData[methodology.value][taskType.value][task.value][subtask.value];
        element.innerHTML = buildOptions(elements || []);
        element.disabled = true;

        if (elements && elements.length > 0) {
          element.disabled = false;
        }
      });
    },
    preConfirm: () => {
      const methodology = document.getElementById("methodology").value;
      const projectPhase = document.getElementById("projectPhase").value;
      const taskType = document.getElementById("taskType").value;
      const task = document.getElementById("task").value;
      const subtask = document.getElementById("subtask").value;
      const element = document.getElementById("element").value;
      const dueDate = document.getElementById("dueDate").value;
      const time = document.getElementById("time").value;
      const assigned = document.getElementById("assigned").value;
      const comment = document.getElementById("comment").value;

      if (!methodology || !projectPhase || !taskType || !task || !dueDate || !assigned) {
        Swal.showValidationMessage("⚠ Please complete all required fields!");
        return false;
      }

      return {
        methodology,
        projectPhase,
        taskType,
        task,
        subtask,
        element,
        dueDate,
        time,
        assigned,
        comment,
      };
    },
  });

  if (formData) {
    console.log("✅ New Oral Defense Task Created:", formData);
    return formData;
  }
};
