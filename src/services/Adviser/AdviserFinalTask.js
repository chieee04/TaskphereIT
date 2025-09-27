// src/services/Adviser/AdviserFinalTask.js
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// Sample static options (pwede mong palitan ng dynamic from DB)
const methodologyOptionsHtml = `
  <option value="" disabled selected hidden></option>
  <option value="Agile">Agile</option>
  <option value="Waterfall">Waterfall</option>
`;

const projectPhaseOptionsHtml = `
  <option value="" disabled selected hidden></option>
`;

const defaultTaskOptionsHtml = `
  <option value="" disabled selected hidden></option>
`;

const taskOptionsHtml = `
  <option value="" disabled selected hidden></option>
`;

const emptySelectHtml = `
  <option value="" disabled selected hidden></option>
`;

const teamOptions = `
  <option value="Team A">Team A</option>
  <option value="Team B">Team B</option>
`;

export const handleCreateTask = async (setTasks) => {
  const { value: formValues } = await MySwal.fire({
    title: `<div style="color:#3B0304; font-weight:600; display:flex; align-items:center; gap:8px;">
      <i class="bi bi-list-check"></i> Create Task</div>`,
    html: `
      <div style="display:grid; grid-template-columns: repeat(3,1fr); gap:12px; width:100%;">
        <div>
          <label style="font-weight:600;">Methodology</label>
          <select id="methodology" class="form-select">
            ${methodologyOptionsHtml}
          </select>
        </div>

        <div>
          <label style="font-weight:600;">Project Phase</label>
          <select id="projectPhase" class="form-select" disabled>
            ${projectPhaseOptionsHtml}
          </select>
        </div>

        <div>
          <label style="font-weight:600;">Task Type</label>
          <select id="task_type" class="form-select" disabled>
            ${defaultTaskOptionsHtml}
          </select>
        </div>

        <div>
          <label style="font-weight:600;">Tasks</label>
          <select id="task" class="form-select" disabled>
            ${taskOptionsHtml}
          </select>
        </div>

        <div>
          <label style="font-weight:600;">Subtasks</label>
          <select id="subtask" class="form-select" disabled>
            ${emptySelectHtml}
          </select>
        </div>

        <div>
          <label style="font-weight:600;">Elements</label>
          <select id="elements" class="form-select" disabled>
            ${emptySelectHtml}
          </select>
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

          <div id="teamsList" style="margin-top:8px; display:flex; flex-wrap:wrap; gap:6px;"></div>
        </div>
      </div>

      <div style="margin-top:10px;">
        <label style="font-weight:600;">Leave Comment</label>
        <textarea id="comment" rows="3" class="form-control"></textarea>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Save Task",
    focusConfirm: false,
    preConfirm: () => {
      return {
        methodology: document.getElementById("methodology").value,
        projectPhase: document.getElementById("projectPhase").value,
        task_type: document.getElementById("task_type").value,
        task: document.getElementById("task").value,
        subtask: document.getElementById("subtask").value,
        elements: document.getElementById("elements").value,
        dueDate: document.getElementById("dueDate").value,
        time: document.getElementById("time").value,
        assigned: document.getElementById("assigned").value,
        comment: document.getElementById("comment").value,
      };
    },
  });

  if (formValues) {
    // ✅ Dummy insert, palitan mo ng Supabase insert query
    setTasks((prev) => [...prev, { id: Date.now(), ...formValues }]);
    MySwal.fire("Task Created!", "Your task has been saved.", "success");
  }
};

// Dummy fetch from DB
export const fetchTasksFromDB = async (setTasks) => {
  setTasks([
    {
      id: 1,
      group_name: "Team A",
      methodology: "Agile",
      project_phase: "Planning",
      task: "Research",
      task_type: "Documentation",
      subtask: "Outline",
      elements: "Content",
      status: "To Do",
      date_created: new Date().toISOString(),
      due_date: new Date().toISOString(),
      time: "09:30",
      comment: "Initial draft",
    },
  ]);
};

// Update status
export const handleUpdateStatus = (id, newStatus, setTasks) => {
  setTasks((prev) =>
    prev.map((task) => (task.id === id ? { ...task, status: newStatus } : task))
  );
};
