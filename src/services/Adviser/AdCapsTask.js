import { supabase } from "../../supabaseClient";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
 
const MySwal = withReactContent(Swal);
 
// ✅ Fetch Tasks
// ✅ Fetch Tasks (adviser-specific only)
// ✅ Fetch Tasks (adviser-specific only, with missed logic)
export const fetchTasksFromDB = async (setTasks) => {
  const storedUser = localStorage.getItem("customUser");
  if (!storedUser) return;
 
  const adviser = JSON.parse(storedUser);
  if (adviser.user_roles !== 3) {
    setTasks([]);
    return;
  }
 
  const { data, error } = await supabase
    .from("adviser_oral_def")
    .select("*")
    .eq("adviser_id", adviser.id)
    .order("date_created", { ascending: false });
 
  if (error) {
    console.error("Error fetching tasks:", error);
    return;
  }
 
  const now = new Date();
 
  const updatedData = await Promise.all(
    (data || []).map(async (task) => {
      const dueDate = new Date(task.due_date);
      const [h, m] = (task.time || "00:00").split(":");
      dueDate.setHours(h, m);
 
      if (dueDate < now && task.status !== "Missed" && task.status !== "Completed") {
        // ✅ Update database
        const { error: updateError } = await supabase
          .from("adviser_oral_def")
          .update({ status: "Missed" })
          .eq("id", task.id);
 
        if (updateError) {
          console.error(`Error updating task ${task.id} to Missed:`, updateError);
        }
 
        return { ...task, status: "Missed" };
      }
 
      return task;
    })
  );
  setTasks(updatedData || []);
};
 
const taskStructure = {
  // Task to Subtask to Elements
  "UI Design & Functionalities": {
    subtasks: [],
    elements: {}
  },
  "UI Design": {
    subtasks: ["Initial UI Prototype","Conduct Rapid UI Feedback Session","Iterate UI Prototype Based on User/Client Feedback"],
    elements: {}
  },
  "Prepare: Chapter 1": {
    subtasks: ["Introduction","Objectives","Scope and Limitation"],
    elements: {
      "Introduction":           ["Project Context","Background of the Study","Policies and Procedures","Users Position"],
      "Objectives" :            ["General Objectives","Specific Objectives"],
      "Scope and Limitation" :  ["Scope","Limitation"]
    }
  },
  "Prepare: Chapter 2": {
    subtasks: ["Related Theories","Related Literature"],
    elements: {}
  },
  "Prepare: Chapter 3": {
    subtasks: ["Implementation", "Development"],
    elements: {
      "Implementation":["Hardware","Software","Peopleware"],
      "Development" :["Hardware","Software","Peopleware"]
    }
  },
  "Prepare: Chapter 4": {
    subtasks: ["Methodology", "Environment","Requirement Specification","Design"],
    elements: {
      "Environment":["Locale","Population of the Study","Organizational Chart/Profile"],
      "Requirement Specification":["Operational Feasibility [Fishbone Diagram]","Operational Feasibility [Functional Decomposition Diagram]","Technical Feasibility","Schedule Feasibility","Economic Feasibility","Requirements Modeling [Context Diagram]","Requirements Modeling [Data Flow Diagram]","Requirements Modeling [System Flowchart]","Requirements Modeling [Program Flowchart]","Requirements Modeling [Use Case Diagram]","Requirements Modeling [Use Class Diagram]","Requirements Modeling [Sequence  Diagram]","Requirements Modeling [Activity Diagram]","Risk Assessment/Analysis"],
      "Design":["Output and User-interface Design Forms","Data Design","System Architecture [Network Model]","System Architecture [Network Topology]","System Architecture [Network Security]"]
    }
  },
  "Prepare: Appendices": {
    subtasks: ["Appendix A","Appendix B","Appendix C","Appendix D","Appendix E"],
    elements: {}
  },
  "Manuscript Submission": {
    subtasks: ["Chapter 1","Chapter 2","Chapter 3","Chapter 4","Appendices","AI and Plagiarism Check"],
    elements: {}
  },
  "Oral Defense Preparation": {
    subtasks: ["Manusript Final Review","Prepare: PowerPoint Presentation","Mock Defense","Manuscript Printing"],
    elements: {}
  },
  "Oral Defense": {
    subtasks: [],
    elements: {}
  },
  "Refinement for Oral Re-Defense": {
    subtasks: [],
    elements: {}
  },
  "Incorporate Panel Feedback Based on Oral Defense": {
    subtasks: [],
    elements: {}
  },
  "Refine: Chapter 1": {
    subtasks: ["Introduction","Objectives","Scope and Limitation"],
    elements: {
      "Introduction":           ["Project Context","Background of the Study","Policies and Procedures","Users Position"],
      "Objectives" :            ["General Objectives","Specific Objectives"],
      "Scope and Limitation" :  ["Scope","Limitation"]
    }
  },
  "Refinement of UI Design & Functionalities": {
    subtasks: [],
    elements: {}
  },
  "Refine: Chapter 2": {
    subtasks: ["Related Theories","Related Literature"],
    elements: {}
  },
  "Refine: Chapter 3": {
    subtasks: ["Implementation", "Development"],
    elements: {
      "Implementation":["Hardware","Software","Peopleware"],
      "Development" :["Hardware","Software","Peopleware"]
    }
  },
  "Refine: Chapter 4": {
    subtasks: ["Methodology", "Environment","Requirement Specification","Design"],
    elements: {
      "Environment":["Locale","Population of the Study","Organizational Chart/Profile"],
      "Requirement Specification":["Operational Feasibility [Fishbone Diagram]","Operational Feasibility [Functional Decomposition Diagram]","Technical Feasibility","Schedule Feasibility","Economic Feasibility","Requirements Modeling [Context Diagram]","Requirements Modeling [Data Flow Diagram]","Requirements Modeling [System Flowchart]","Requirements Modeling [Program Flowchart]","Requirements Modeling [Use Case Diagram]","Requirements Modeling [Use Class Diagram]","Requirements Modeling [Sequence  Diagram]","Requirements Modeling [Activity Diagram]","Risk Assessment/Analysis"],
      "Design":["Output and User-interface Design Forms","Data Design","System Architecture [Network Model]","System Architecture [Network Topology]","System Architecture [Network Security]"]
    }
  },
 
  "Refine: Appendices": {
    subtasks: ["Appendix A","Appendix B","Appendix C","Appendix D","Appendix E"],
    elements: {}
  },
  "Manuscript Re-Submission": {
    subtasks: ["Chapter 1","Chapter 2","Chapter 3","Chapter 4","Appendices","AI and Plagiarism Check"],
    elements: {}
  },
  "Oral Re-Defense Preparation": {
     subtasks: ["Manusript Final Review","Prepare: PowerPoint Presentation","Mock Defense","Manuscript Printing"],
    elements: {}
  },
  "Oral Re-Defense": {
    subtasks: [],
    elements: {}
  },
  "Incorporate Panel Feedback Based on Oral Re-Defense": {
    subtasks: [],
    elements: {}
  },
  // Discussion and review
  "Capstone Meeting": {
    subtasks: [],
    elements: {}
  },
  "Adviser Consultation": {
    subtasks: [],
    elements: {}
  },
  "Interview User/ Client": {
    subtasks: [],
    elements: {}
  },
  "Gather Feedback from the User/Client": {
    subtasks: [],
    elements: {}
  },
};
 
const methodologyList = ["Agile", "Extreme Programming","Spiral", "Prototyping", "RAD"];
 
///////////////////////////////////////////////////////////////////////////////////////////////////////
// PART 2 - continuation: update + create task modal + logic (Extreme Programming = Agile except the XP-specific change)
// Also implements Spiral & Prototyping flows per your spec, and adds RAD behavior per user request
///////////////////////////////////////////////////////////////////////////////////////////////////////
 
// update status
export const handleUpdateStatus = async (taskId, newStatus, setTasks) => {
  const { error } = await supabase
    .from("adviser_oral_def")
    .update({ status: newStatus })
    .eq("id", taskId);
 
  if (error) {
    console.error("Error updating status:", error);
    Swal.fire({
      icon: "error",
      title: "Update failed",
      text: "Please try again.",
    });
    return;
  }
 
  // Update local UI state immediately
  setTasks((prev) =>
    prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))
  );
 
  Swal.fire({
    toast: true,
    icon: "success",
    title: "Task status updated!",
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,
  });
};
 
// ✅ Create Task
export const handleCreateTask = async (setTasks) => {
  const storedUser = localStorage.getItem("customUser");
  if (!storedUser) {
    Swal.fire("Error", "No logged in adviser found.", "error");
    return;
  }
  const adviser = JSON.parse(storedUser);
 
  // Fetch adviser's teams
  const { data: teams, error } = await supabase
    .from("user_credentials")
    .select("id, user_id, group_number, group_name")
    .eq("adviser_group", adviser.adviser_group)
    .not("group_number", "is", null);
 
  if (error) {
    console.error("Error fetching teams:", error);
    Swal.fire("Error", "Failed to fetch teams.", "error");
    return;
  }
 
  const uniqueTeams = [...new Map(teams.map((item) => [item.group_number, item])).values()];
 
  const teamOptions = uniqueTeams.map((t) => `<option value="${t.id}">${t.group_name}</option>`).join("");
 
  // Dropdown lists
  const methodologyOptionsHtml = [
    `<option value="" disabled selected hidden></option>`,
    ...methodologyList.map((m) => `<option value="${m}">${m}</option>`),
  ].join("");
 
  // PROJECT PHASE LISTS (default)
  const projectPhaseOptionsHtml = [
    `<option value="" disabled selected hidden></option>`,
    `<option value="Designing">Designing</option>`,
    `<option value="Prototyping">Prototyping</option>`,
  ].join("");
 
  // all tasks list
  const taskList = [
    "UI Design",
    "UI and Functionality Finalization",
    "Initial Prototype",
    "Present Prototype to the Users",
    "Gather User/Client Feedback on Prototype Concept",
    "1.Prepare:",
    "2.Refine: Chapter 1",
    "3.Refine: Chapter 2",
    "4.Refine: Chapter 3",
    "5.Refine: Chapter 4",
    "6.Refine: Appendices",
    "7.Manuscript Final Review",
    "8.Manuscript Submission for AI and Plagiarism Check",
    "Prepare: Chapter 1", "Refine: Chapter 1",
    "Prepare: Chapter 2", "Refine: Chapter 2",
    "Prepare: Chapter 3", "Refine: Chapter 3",
    "Prepare: Chapter 4", "Refine: Chapter 4",
    "Prepare: Appendices", "Refine: Appendices",
    "Manuscript Submission",
    "Manuscript Re-Submission",
    "Manuscript Final Review",
    "Oral Defense Preparation",
    "Oral Defense",
    "Refinement for Oral Re-Defense",
    "Incorporate Panel Feedback Based on Oral Defense",
    "Oral Re-Defense Preparation",
    "Oral Re-Defense",
    "Incorporate Panel Feedback Based on Oral Re-Defense",
    "Capstone Meeting",
    "Adviser Consultation",
    "Interview User/Client",
    "Client Feedback Session"
  ];
 
  const taskOptionsHtml = [
    `<option value="" disabled selected hidden></option>`,
    ...taskList.map((t) => `<option value="${t}">${t}</option>`),
  ].join("");
 
  const defaultTaskOptionsHtml = `<option value="" disabled selected hidden></option>`;
  const emptySelectHtml = `<option value="" disabled selected hidden></option>`;
  let selectedTeams = [];
 
  // RAD-specific tasks (documentation) as requested by user
  const raddocumentationTasks = [
    "Identify Stakeholders and Roles",
    "Submit Recommendation Letter from Client",
    "1.Prepare:",
    "2.Refine: Chapter 1",
    "3.Refine: Chapter 2",
    "4.Refine: Chapter 3",
    "5.Refine: Chapter 4",
    "6.Refine: Appendices",
    "6.Manuscript Final Review",
    "7.Manuscript Submission for AI and Plagiarism Check"
  ];
 
  const radDiscussionTasks = [
    "1.Milestone Review Meeting",
    "2.Adviser Follow-Up and Continuous Improvement Plan"
  ];
 
  // documentation tasks & discussion lists (general)
  const documentationTasks = [
    "Identify Stakeholders and Roles",
    "Submit Recommendation Letter from Client",
    "1.Prepare:",
    "2.Refine: Chapter 1",
    "3.Refine: Chapter 2",
    "4.Refine: Chapter 3",
    "5.Refine: Chapter 4",
    "6.Refine: Appendices",
    "7.Manuscript Final Review",
    "8.Manuscript Submission for AI and Plagiarism Check",
  ];
 
  const discussionTasks = [
    "1.Milestone Review Meeting",
    "2.Adviser Follow-Up and Continuous Improvement Plan",
  ];
 
  // SweetAlert modal
  MySwal.fire({
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
    width: "920px",
    showCancelButton: true,
    confirmButtonText: "Create",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#3B0304",
    cancelButtonColor: "#999",
    didOpen: () => {
      const methodologySelect = document.getElementById("methodology");
      const projectPhaseSelect = document.getElementById("projectPhase");
      const taskTypeSelect = document.getElementById("task_type");
      const taskSelect = document.getElementById("task");
      const subtaskSelect = document.getElementById("subtask");
      const elementsSelect = document.getElementById("elements");
      const assignedSelect = document.getElementById("assigned");
      const teamsListDiv = document.getElementById("teamsList");
 
      // Reset selected teams each modal open
      selectedTeams = [];
 
      // Team selection handler
      assignedSelect.addEventListener("change", (e) => {
        const teamId = e.target.value;
        const team = uniqueTeams.find((t) => t.id == teamId);
        if (!team) return;
 
        if (!selectedTeams.some((t) => t.id == team.id)) {
          selectedTeams.push(team);
 
          // create badge
          const teamBadge = document.createElement("div");
          teamBadge.className = "team-badge";
          teamBadge.style.cssText = `
            background:#eee; padding:4px 8px; border-radius:6px;
            display:flex; align-items:center; gap:6px;
          `;
          teamBadge.dataset.id = team.id;
          teamBadge.innerHTML = `
            <span>${team.group_name}</span>
            <button type="button" style="border:none;background:none;color:red;font-weight:bold;cursor:pointer;">-</button>
          `;
 
          // remove on click
          teamBadge.querySelector("button").addEventListener("click", () => {
            selectedTeams = selectedTeams.filter((t) => t.id != team.id);
            teamsListDiv.removeChild(teamBadge);
 
            const opt = document.createElement("option");
            opt.value = team.id;
            opt.textContent = team.group_name;
            assignedSelect.appendChild(opt);
          });
 
          teamsListDiv.appendChild(teamBadge);
          assignedSelect.querySelector(`option[value="${team.id}"]`)?.remove();
          assignedSelect.value = "";
        }
      });
 
      // -------------------------
      // methodology change handler
      // -------------------------
      methodologySelect.addEventListener("change", (e) => {
        const value = e.target.value;
 
        // AGILE and EXTREME PROGRAMMING behave the same in Task Type & Project Phase (but XP subtasks will be adjusted later)
        if (value === "Agile" || value === "Extreme Programming") {
          // enable and set project phase to Planning/Design (user chooses)
          projectPhaseSelect.disabled = false;
          projectPhaseSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            <option value="Planning">Planning</option>
            <option value="Design">Design</option>
          `;
 
          // Task Type for Agile/XP: Documentation or Discussion & Review
          taskTypeSelect.disabled = false;
          taskTypeSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            <option value="Documentation">Documentation</option>
            <option value="Discussion & Review">Discussion & Review</option>
          `;
 
          // reset task/subtask/elements
          taskSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
          taskSelect.disabled = true;
          subtaskSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
          subtaskSelect.disabled = true;
          elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
          elementsSelect.disabled = true;
          return;
        }
 
        // SPIRAL: per your specification
        if (value === "Spiral") {
          projectPhaseSelect.disabled = false;
          projectPhaseSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            <option value="Plan">Plan</option>
            <option value="Risk Analysis">Risk Analysis</option>
          `;
 
          // For Spiral, we expose Task Type immediately (Plan/Risk Analysis both use same Task Types)
          taskTypeSelect.disabled = false;
          taskTypeSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            <option value="Documentation">Documentation</option>
            <option value="Discussion & Review">Discussion & Review</option>
          `;
 
          // reset lower selects
          taskSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
          taskSelect.disabled = true;
          subtaskSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
          subtaskSelect.disabled = true;
          elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
          elementsSelect.disabled = true;
          return;
        }
 
        // PROTOTYPING: per your new spec
        if (value === "Prototyping") {
          projectPhaseSelect.disabled = false;
          // Project phases requested:
          projectPhaseSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            <option value="Requirements and Gathering Analysis">Requirements and Gathering Analysis</option>
            <option value="Quick Design">Quick Design</option>
            <option value="Build Prototype">Build Prototype</option>
            <option value="Initial User Evaluation">Initial User Evaluation</option>
          `;
 
          // For Prototyping, Task Type is always Documentation or Discussion & Review regardless of chosen project phase
          taskTypeSelect.disabled = false;
          taskTypeSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            <option value="Documentation">Documentation</option>
            <option value="Discussion & Review">Discussion & Review</option>
          `;
 
          // reset lower selects
          taskSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
          taskSelect.disabled = true;
          subtaskSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
          subtaskSelect.disabled = true;
          elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
          elementsSelect.disabled = true;
          return;
        }
 
        // RAD: per user request - show "REQUIREMENTS OR USER DESIGN" in Project Phase,
        // and task types Documentation / Discussion & Review when that project phase is selected
        if (value === "RAD") {
          projectPhaseSelect.disabled = false;
          projectPhaseSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            <option value="REQUIREMENTS">REQUIREMENTS</option>
            <option value="USER DESIGN">USER DESIGN</option>
          `;
 
          // Immediately enable task type selection for RAD (per spec)
          taskTypeSelect.disabled = false;
          taskTypeSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            <option value="Documentation">Documentation</option>
            <option value="Discussion & Review">Discussion & Review</option>
          `;
 
          // reset lower selects
          taskSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
          taskSelect.disabled = true;
          subtaskSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
          subtaskSelect.disabled = true;
          elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
          elementsSelect.disabled = true;
          return;
        }
 
        // default (other methodologies)
        projectPhaseSelect.disabled = true;
        projectPhaseSelect.innerHTML = projectPhaseOptionsHtml;
        taskTypeSelect.disabled = true;
        taskSelect.disabled = true;
        subtaskSelect.disabled = true;
        elementsSelect.disabled = true;
      });
 
      // taskType change handler
      taskTypeSelect.addEventListener("change", (e) => {
        const value = e.target.value;
        const currentMethod = methodologySelect.value;
 
        // clear previous
        subtaskSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
        subtaskSelect.disabled = true;
        elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
        elementsSelect.disabled = true;
 
        // RAD specific docs/discussion
        if (currentMethod === "RAD") {
          if (value === "Documentation") {
            taskSelect.innerHTML = `
              <option value="" disabled selected hidden></option>
              ${raddocumentationTasks.map((t) => `<option value="${t}">${t}</option>`).join("")}
            `;
            taskSelect.disabled = false;
            return;
          }
 
          if (value === "Discussion & Review") {
            taskSelect.innerHTML = `
              <option value="" disabled selected hidden></option>
              ${radDiscussionTasks.map((t) => `<option value="${t}">${t}</option>`).join("")}
            `;
            taskSelect.disabled = false;
            return;
          }
        }
 
        // RAD specific handled above. For other methodologies continue existing behaviors:
 
        // RAD specific docs (legacy fallback)
        if (value === "radDocumentation") {
          taskSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            ${raddocumentationTasks.map((t) => `<option value="${t}">${t}</option>`).join("")}
          `;
          taskSelect.disabled = false;
          return;
        }
 
        // Discussion & Review (general)
        if (value === "Discussion & Review") {
          taskSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            ${discussionTasks.map((t) => `<option value="${t}">${t}</option>`).join("")}
          `;
          taskSelect.disabled = false;
          return;
        }
 
        // Documentation selected (non-RAD)
        if (value === "Documentation") {
          // PROTOTYPING documentation list per your spec
          if (currentMethod === "Prototyping") {
            const prototypingDocs = [
              "Identify Stakeholders and Roles",
              "Submit Recommendation Letter from Client",
              "1.Prepare:",
              "4.Develop Key Modules Based on User Stories",
              "5.UI Forms and Functionalities Evaluation Session",
              "6.Documentation Check In",
              "2.Refine: Chapter 1",
              "3.Refine: Chapter 2",
              "4.Refine: Chapter 3",
              "5.Refine: Chapter 4",
              "6.Refine: Appendices",
              "6.Manuscript Final Review",
              "7.Manuscript Submission for AI and Plagiarism Check"
            ];
            taskSelect.innerHTML = `
              <option value="" disabled selected hidden></option>
              ${prototypingDocs.map((t) => `<option value="${t}">${t}</option>`).join("")}
            `;
            taskSelect.disabled = false;
            return;
          }
 
          // Spiral documentation list when methodology is Spiral
          if (currentMethod === "Spiral") {
            const spiralDocs = [
              "Identify Stakeholders and Roles",
              "Submit Recommendation Letter from Client",
              "1.Prepare:",
              "2.Refine: Chapter 1",
              "3.Refine: Chapter 2",
              "4.Refine: Chapter 3",
              "5.Refine: Chapter 4",
              "6.Refine: Appendices",
              "6.Manuscript Final Review",
              "7.Manuscript Submission for AI and Plagiarism Check",
            ];
            taskSelect.innerHTML = `
              <option value="" disabled selected hidden></option>
              ${spiralDocs.map((t) => `<option value="${t}">${t}</option>`).join("")}
            `;
            taskSelect.disabled = false;
            return;
          }
 
          // default documentation list for others
          taskSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            ${documentationTasks.map((t) => `<option value="${t}">${t}</option>`).join("")}
          `;
          taskSelect.disabled = false;
          return;
        }
 
        // other/default
        taskSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
        taskSelect.disabled = true;
      });
 
      // task change handler (custom mapping for Prepare/Refine numbered items)
      taskSelect.addEventListener("change", (e) => {
        const task = e.target.value;
        const currentMethod = methodologySelect.value; // to know if XP or Agile or Spiral or Prototyping or RAD
 
        // ---------- RAD-specific mappings for subtasks (per user request) ----------
        if (currentMethod === "RAD") {
          // Documentation tasks listed earlier will include "1.Prepare:", "2.Refine: Chapter 1", etc.
          if (task === "1.Prepare:") {
            subtaskSelect.innerHTML = `
              <option value="" disabled selected hidden></option>
              <option value="Chapter 1">Chapter 1</option>
              <option value="Create Wireframes & Rapid Prototypes">Create Wireframes & Rapid Prototypes</option>
              <option value="Chapter 2">Chapter 2</option>
              <option value="Chapter 3">Chapter 3</option>
              <option value="Chapter 4">Chapter 4</option>
              <option value="Appendices">Appendices</option>
            `;
            subtaskSelect.disabled = false;
            elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
            elementsSelect.disabled = true;
            return;
          }
 
          if (task === "2.Refine: Chapter 1") {
            subtaskSelect.innerHTML = `
              <option value="" disabled selected hidden></option>
              <option value="1.Introduction">1.Introduction</option>
              <option value="2.Objectives">2.Objectives</option>
              <option value="3.Scope and Limitation">3.Scope and Limitation</option>
            `;
            subtaskSelect.disabled = false;
            elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
            elementsSelect.disabled = true;
            return;
          }
 
          if (task === "3.Refine: Chapter 2") {
            subtaskSelect.innerHTML = `
              <option value="" disabled selected hidden></option>
              <option value="1.Related Theories">1.Related Theories</option>
              <option value="2.Related Literature">2.Related Literature</option>
            `;
            subtaskSelect.disabled = false;
            elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
            elementsSelect.disabled = true;
            return;
          }
 
          if (task === "4.Refine: Chapter 3") {
            subtaskSelect.innerHTML = `
              <option value="" disabled selected hidden></option>
              <option value="1.Implementation">1.Implementation</option>
              <option value="2.Development">2.Development</option>
            `;
            subtaskSelect.disabled = false;
            elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
            elementsSelect.disabled = true;
            return;
          }
 
          if (task === "5.Refine: Chapter 4") {
            subtaskSelect.innerHTML = `
              <option value="" disabled selected hidden></option>
              <option value="1.Methodology">1.Methodology</option>
              <option value="2.Environment">2.Environment</option>
              <option value="3.Requirement Specification">3.Requirement Specification</option>
              <option value="4.Design">4.Design</option>
            `;
            subtaskSelect.disabled = false;
            elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
            elementsSelect.disabled = true;
            return;
          }
 
          if (task === "6.Refine: Appendices") {
            subtaskSelect.innerHTML = `
              <option value="" disabled selected hidden></option>
              <option value="1.Appendix A">1.Appendix A</option>
              <option value="2.Appendix B">2.Appendix B</option>
              <option value="3.Appendix C">3.Appendix C</option>
              <option value="4.Appendix D">4.Appendix D</option>
              <option value="5.Appendix E">5.Appendix E</option>
            `;
            subtaskSelect.disabled = false;
            elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
            elementsSelect.disabled = true;
            return;
          }
        } // end RAD-specific
 
        // ---------- Prototyping-specific mappings ----------
        if (currentMethod === "Prototyping") {
          // 1.Prepare: subtasks per your spec
          if (
            task === "1.Prepare:" ||
            task === "1.Prepare" ||
            task === "Prepare" ||
            task === "Prepare:" ||
            task === "Prepare: Chapter 1"
          ) {
            subtaskSelect.innerHTML = `
              <option value="" disabled selected hidden></option>
              <option value="Chapter 1">Chapter 1</option>
              <option value="Design Output and User-Interface Forms">Design Output and User-Interface Forms</option>
              <option value="Chapter 2">Chapter 2</option>
              <option value="Chapter 3">Chapter 3</option>
              <option value="Chapter 4">Chapter 4</option>
              <option value="Appendices">Appendices</option>
            `;
            subtaskSelect.disabled = false;
            elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
            elementsSelect.disabled = true;
            return;
          }
 
          // 2.Refine: Chapter 1
          if (task === "2.Refine: Chapter 1" || task === "Refine: Chapter 1") {
            subtaskSelect.innerHTML = `
              <option value="" disabled selected hidden></option>
              <option value="Introduction">Introduction</option>
              <option value="Objectives">Objectives</option>
              <option value="Scope and Limitation">Scope and Limitation</option>
            `;
            subtaskSelect.disabled = false;
            elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
            elementsSelect.disabled = true;
            return;
          }
 
          // 3.Refine: Chapter 2
          if (task === "3.Refine: Chapter 2" || task === "Refine: Chapter 2") {
            subtaskSelect.innerHTML = `
              <option value="" disabled selected hidden></option>
              <option value="Related Theories">Related Theories</option>
              <option value="Related Literature">Related Literature</option>
            `;
            subtaskSelect.disabled = false;
            elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
            elementsSelect.disabled = true;
            return;
          }
 
          // 4.Refine: Chapter 3
          if (task === "4.Refine: Chapter 3" || task === "Refine: Chapter 3") {
            // For prototyping we include numbered subtasks explicitly so mapping picks them up
            subtaskSelect.innerHTML = `
              <option value="" disabled selected hidden></option>
              <option value="1.Implementation">1.Implementation</option>
              <option value="2.Development">2.Development</option>
            `;
            subtaskSelect.disabled = false;
            elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
            elementsSelect.disabled = true;
            return;
          }
 
          // 5.Refine: Chapter 4
          if (task === "5.Refine: Chapter 4" || task === "Refine: Chapter 4") {
            subtaskSelect.innerHTML = `
              <option value="" disabled selected hidden></option>
              <option value="Methodology">Methodology</option>
              <option value="Environment">Environment</option>
              <option value="Requirement Specification">Requirement Specification</option>
              <option value="Design">Design</option>
            `;
            subtaskSelect.disabled = false;
            elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
            elementsSelect.disabled = true;
            return;
          }
 
          // 6.Refine: Appendices
          if (task === "6.Refine: Appendices" || task === "Refine: Appendices") {
            subtaskSelect.innerHTML = `
              <option value="" disabled selected hidden></option>
              <option value="Appendix A">Appendix A</option>
              <option value="Appendix B">Appendix B</option>
              <option value="Appendix C">Appendix C</option>
              <option value="Appendix D">Appendix D</option>
              <option value="Appendix E">Appendix E</option>
            `;
            subtaskSelect.disabled = false;
            elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
            elementsSelect.disabled = true;
            return;
          }
        } // end Prototyping-specific
 
        // ---------- Spiral-specific mappings ----------
        if (currentMethod === "Spiral") {
          // 1.Prepare:
          if (
            task === "1.Prepare:" ||
            task === "1.Prepare" ||
            task === "Prepare" ||
            task === "Prepare:" ||
            task === "Prepare: Chapter 1"
          ) {
            subtaskSelect.innerHTML = `
              <option value="" disabled selected hidden></option>
              <option value="Chapter 1">Chapter 1</option>
              <option value="Chapter 2">Chapter 2</option>
              <option value="Chapter 3">Chapter 3</option>
              <option value="Chapter 4">Chapter 4</option>
              <option value="Schedule Risk Review">Schedule Risk Review</option>
              <option value="Security Threat Modeling [Web-Based]">Security Threat Modeling [Web-Based]</option>
              <option value="Appendices">Appendices</option>
            `;
            subtaskSelect.disabled = false;
            elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
            elementsSelect.disabled = true;
            return;
          }
 
          // 2.Refine: Chapter 1
          if (task === "2.Refine: Chapter 1" || task === "Refine: Chapter 1") {
            subtaskSelect.innerHTML = `
              <option value="" disabled selected hidden></option>
              <option value="Introduction">Introduction</option>
              <option value="Objectives">Objectives</option>
              <option value="Scope and Limitation">Scope and Limitation</option>
            `;
            subtaskSelect.disabled = false;
            elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
            elementsSelect.disabled = true;
            return;
          }
 
          // 3.Refine: Chapter 2
          if (task === "3.Refine: Chapter 2" || task === "Refine: Chapter 2") {
            subtaskSelect.innerHTML = `
              <option value="" disabled selected hidden></option>
              <option value="Related Theories">Related Theories</option>
              <option value="Related Literature">Related Literature</option>
            `;
            subtaskSelect.disabled = false;
            elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
            elementsSelect.disabled = true;
            return;
          }
 
          // 4.Refine: Chapter 3
          if (task === "4.Refine: Chapter 3" || task === "Refine: Chapter 3") {
            subtaskSelect.innerHTML = `
              <option value="" disabled selected hidden></option>
              <option value="Implementation">Implementation</option>
              <option value="Development">Development</option>
            `;
            subtaskSelect.disabled = false;
            elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
            elementsSelect.disabled = true;
            return;
          }
 
          // 5.Refine: Chapter 4 - many repeated Implementation/Development items
          if (task === "5.Refine: Chapter 4" || task === "Refine: Chapter 4") {
            subtaskSelect.innerHTML = `
              <option value="" disabled selected hidden></option>
              <option value="3.Implementation">3.Implementation</option>
              <option value="4.Development">4.Development</option>
              <option value="5.Implementation">5.Implementation</option>
              <option value="6.Development">6.Development</option>
              <option value="7.Implementation">7.Implementation</option>
              <option value="8.Development">8.Development</option>
              <option value="9.Implementation">9.Implementation</option>
              <option value="10.Development">10.Development</option>
              <option value="11.Implementation">11.Implementation</option>
            `;
            subtaskSelect.disabled = false;
            elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
            elementsSelect.disabled = true;
            return;
          }
 
          // 6.Refine: Appendices
          if (task === "6.Refine: Appendices" || task === "Refine: Appendices") {
            subtaskSelect.innerHTML = `
              <option value="" disabled selected hidden></option>
              <option value="Appendix A">Appendix A</option>
              <option value="Appendix B">Appendix B</option>
              <option value="Appendix C">Appendix C</option>
              <option value="Appendix D">Appendix D</option>
              <option value="Appendix E">Appendix E</option>
            `;
            subtaskSelect.disabled = false;
            elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
            elementsSelect.disabled = true;
            return;
          }
        } // end Spiral-specific
 
        // ---------- Custom mapping for Prepare/Refine numbered items for non-Spiral/Prototyping (and includes XP special label) ----------
        if (
          task === "1.Prepare:" ||
          task === "1.Prepare" ||
          task === "Prepare" ||
          task === "Prepare:" ||
          task === "Prepare: Chapter 1"
        ) {
          // For XP only: replace "Design User Interface" -> "Build Wireframes & Prototype"
          const designLabel = (currentMethod === "Extreme Programming") ? "Build Wireframes & Prototype" : "Design User Interface";
 
          subtaskSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            <option value="Chapter 1">Chapter 1</option>
            <option value="${designLabel}">${designLabel}</option>
            <option value="Chapter 2">Chapter 2</option>
            <option value="Chapter 3">Chapter 3</option>
            <option value="Chapter 4">Chapter 4</option>
            <option value="Appendices">Appendices</option>
          `;
          subtaskSelect.disabled = false;
          elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
          elementsSelect.disabled = true;
          return;
        }
 
        if (task === "2.Refine: Chapter 1" || task === "Refine: Chapter 1") {
          subtaskSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            <option value="Introduction">Introduction</option>
            <option value="Objectives">Objectives</option>
            <option value="Scope and Limitation">Scope and Limitation</option>
          `;
          subtaskSelect.disabled = false;
          elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
          elementsSelect.disabled = true;
          return;
        }
 
        if (task === "3.Refine: Chapter 2" || task === "Refine: Chapter 2") {
          subtaskSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            <option value="Related Theories">Related Theories</option>
            <option value="Related Literature">Related Literature</option>
          `;
          subtaskSelect.disabled = false;
          elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
          elementsSelect.disabled = true;
          return;
        }
 
        if (task === "4.Refine: Chapter 3" || task === "Refine: Chapter 3") {
          subtaskSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            <option value="Implementation">Implementation</option>
            <option value="Development">Development</option>
          `;
          subtaskSelect.disabled = false;
          elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
          elementsSelect.disabled = true;
          return;
        }
 
        if (task === "5.Refine: Chapter 4" || task === "Refine: Chapter 4") {
          subtaskSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            <option value="Methodology">Methodology</option>
            <option value="Environment">Environment</option>
            <option value="Requirement Specification">Requirement Specification</option>
            <option value="Design">Design</option>
          `;
          subtaskSelect.disabled = false;
          elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
          elementsSelect.disabled = true;
          return;
        }
 
        if (task === "6.Refine: Appendices" || task === "Refine: Appendices") {
          subtaskSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            <option value="Appendix A">Appendix A</option>
            <option value="Appendix B">Appendix B</option>
            <option value="Appendix C">Appendix C</option>
            <option value="Appendix D">Appendix D</option>
            <option value="Appendix E">Appendix E</option>
          `;
          subtaskSelect.disabled = false;
          elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
          elementsSelect.disabled = true;
          return;
        }
      });
 
      // elements mapping for subtasks (as you specified)
      subtaskSelect.addEventListener("change", (e) => {
        const subtask = e.target.value;
        const methodology = document.getElementById("methodology").value;
 
        // ---------- RAD-specific numbered subtask elements mapping ----------
        if (methodology === "RAD") {
          // 1.Introduction -> Project Context, Background..., Policies..., Users Position
          if (subtask === "1.Introduction") {
            elementsSelect.innerHTML = `
              <option value="" disabled selected hidden></option>
              <option value="Project Context">Project Context</option>
              <option value="Background of the Study">Background of the Study</option>
              <option value="Policies and Procedures">Policies and Procedures</option>
              <option value="Users Position">Users Position</option>
            `;
            elementsSelect.disabled = false;
            return;
          }
 
          // 2.Objectives -> General Objectives / Specific Objectives
          if (subtask === "2.Objectives") {
            elementsSelect.innerHTML = `
              <option value="" disabled selected hidden></option>
              <option value="General Objectives">General Objectives</option>
              <option value="Specific Objectives">Specific Objectives</option>
            `;
            elementsSelect.disabled = false;
            return;
          }
 
          // 3.Scope and Limitation -> Scope / Limitation
          if (subtask === "3.Scope and Limitation") {
            elementsSelect.innerHTML = `
              <option value="" disabled selected hidden></option>
              <option value="Scope">Scope</option>
              <option value="Limitation">Limitation</option>
            `;
            elementsSelect.disabled = false;
            return;
          }
 
          // 1.Implementation -> Hardware / Software / Peopleware
          if (subtask === "1.Implementation") {
            elementsSelect.innerHTML = `
              <option value="" disabled selected hidden></option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Peopleware">Peopleware</option>
            `;
            elementsSelect.disabled = false;
            return;
          }
 
          // 2.Development -> Hardware / Software / Peopleware
          if (subtask === "2.Development") {
            elementsSelect.innerHTML = `
              <option value="" disabled selected hidden></option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Peopleware">Peopleware</option>
            `;
            elementsSelect.disabled = false;
            return;
          }
 
          // 2.Environment -> Locale, Population..., Organizational Chart/Profile
          if (subtask === "2.Environment") {
            elementsSelect.innerHTML = `
              <option value="" disabled selected hidden></option>
              <option value="Locale">Locale</option>
              <option value="Population of the Study">Population of the Study</option>
              <option value="Organizational Chart/Profile">Organizational Chart/Profile</option>
            `;
            elementsSelect.disabled = false;
            return;
          }
 
          // 3.Requirement Specification -> long list
          if (subtask === "3.Requirement Specification") {
            elementsSelect.innerHTML = `
              <option value="" disabled selected hidden></option>
              <option value="Operational Feasibility [Fishbone Diagram]">Operational Feasibility [Fishbone Diagram]</option>
              <option value="Operational Feasibility [Functional Decomposition Diagram]">Operational Feasibility [Functional Decomposition Diagram]</option>
              <option value="Technical Feasibility">Technical Feasibility</option>
              <option value="Schedule Feasibility">Schedule Feasibility</option>
              <option value="Economic Feasibility">Economic Feasibility</option>
              <option value="Requirements Modeling [Context Diagram]">Requirements Modeling [Context Diagram]</option>
              <option value="Requirements Modeling [Data Flow Diagram]">Requirements Modeling [Data Flow Diagram]</option>
              <option value="Requirements Modeling [System Flowchart]">Requirements Modeling [System Flowchart]</option>
              <option value="Requirements Modeling [Program Flowchart]">Requirements Modeling [Program Flowchart]</option>
              <option value="Requirements Modeling [Use Case Diagram]">Requirements Modeling [Use Case Diagram]</option>
              <option value="Requirements Modeling [Use Class Diagram]">Requirements Modeling [Use Class Diagram]</option>
              <option value="Requirements Modeling [Sequence  Diagram]">Requirements Modeling [Sequence  Diagram]</option>
              <option value="Requirements Modeling [Activity Diagram]">Requirements Modeling [Activity Diagram]</option>
              <option value="Risk Assessment/Analysis">Risk Assessment/Analysis</option>
            `;
            elementsSelect.disabled = false;
            return;
          }
 
          // 4.Design -> Output and UI Forms, Data Design, System Architecture...
          if (subtask === "4.Design") {
            elementsSelect.innerHTML = `
              <option value="" disabled selected hidden></option>
              <option value="Output and User-interface Design Forms">Output and User-interface Design Forms</option>
              <option value="Data Design">Data Design</option>
              <option value="System Architecture [Network Model]">System Architecture [Network Model]</option>
              <option value="System Architecture [Network Topology]">System Architecture [Network Topology]</option>
              <option value="System Architecture [Network Security]">System Architecture [Network Security]</option>
            `;
            elementsSelect.disabled = false;
            return;
          }
        } // end RAD-specific elements
 
        // ---------- Prototyping elements mapping (per previous spec) ----------
        // If methodology is Prototyping and subtask is specifically 1.Implementation or 2.Development,
        // override and set elements to Hardware/Software/Peopleware
        if (
          methodology === "Prototyping" &&
          (subtask === "1.Implementation" || subtask === "2.Development")
        ) {
          elementsSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
            <option value="Peopleware">Peopleware</option>
          `;
          elementsSelect.disabled = false;
          return;
        }
 
        // 1.Introduction -> Project Context, Background..., Policies..., Users Position
        if (subtask === "Introduction") {
          elementsSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            <option value="Project Context">Project Context</option>
            <option value="Background of the Study">Background of the Study</option>
            <option value="Policies and Procedures">Policies and Procedures</option>
            <option value="Users Position">Users Position</option>
          `;
          elementsSelect.disabled = false;
          return;
        }
 
        // 2.Objectives -> General Objectives / Specific Objectives
        if (subtask === "Objectives") {
          elementsSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            <option value="General Objectives">General Objectives</option>
            <option value="Specific Objectives">Specific Objectives</option>
          `;
          elementsSelect.disabled = false;
          return;
        }
 
        // 3.Scope and Limitation -> Scope / Limitation
        if (subtask === "Scope and Limitation") {
          elementsSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            <option value="Scope">Scope</option>
            <option value="Limitation">Limitation</option>
          `;
          elementsSelect.disabled = false;
          return;
        }
 
        // Implementation -> Hardware, Software, Peopleware (for prototyping/refine)
        if (
          subtask === "Implementation" ||
          subtask === "1.Implementation" ||
          subtask === "3.Implementation" ||
          subtask === "5.Implementation" ||
          subtask === "7.Implementation" ||
          subtask === "9.Implementation" ||
          subtask === "11.Implementation"
        ) {
          elementsSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
            <option value="Peopleware">Peopleware</option>
          `;
          elementsSelect.disabled = false;
        }
 
        // Development -> Hardware, Software, Peopleware (general)
        if (
          subtask === "Development" ||
          subtask === "2.Development" ||
          subtask === "4.Development" ||
          subtask === "6.Development" ||
          subtask === "8.Development" ||
          subtask === "10.Development"
        ) {
          elementsSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
            <option value="Peopleware">Peopleware</option>
          `;
          elementsSelect.disabled = false;
        }
 
        // Environment -> Locale, Population..., Organizational Chart/Profile
        if (subtask === "Environment" || subtask === "2.Environment") {
          elementsSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            <option value="Locale">Locale</option>
            <option value="Population of the Study">Population of the Study</option>
            <option value="Organizational Chart/Profile">Organizational Chart/Profile</option>
          `;
          elementsSelect.disabled = false;
          return;
        }
 
        // Requirement Specification -> long list (per your spec)
        if (subtask === "Requirement Specification" || subtask === "Requirements Specification" || subtask === "3.Requirement Specification") {
          elementsSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            <option value="Operational Feasibility [Fishbone Diagram]">Operational Feasibility [Fishbone Diagram]</option>
            <option value="Operational Feasibility [Functional Decomposition Diagram]">Operational Feasibility [Functional Decomposition Diagram]</option>
            <option value="Technical Feasibility">Technical Feasibility</option>
            <option value="Schedule Feasibility">Schedule Feasibility</option>
            <option value="Economic Feasibility">Economic Feasibility</option>
            <option value="Requirements Modeling [Context Diagram]">Requirements Modeling [Context Diagram]</option>
            <option value="Requirements Modeling [Data Flow Diagram]">Requirements Modeling [Data Flow Diagram]</option>
            <option value="Requirements Modeling [System Flowchart]">Requirements Modeling [System Flowchart]</option>
            <option value="Requirements Modeling [Program Flowchart]">Requirements Modeling [Program Flowchart]</option>
            <option value="Requirements Modeling [Use Case Diagram]">Requirements Modeling [Use Case Diagram]</option>
            <option value="Requirements Modeling [Use Class Diagram]">Requirements Modeling [Use Class Diagram]</option>
            <option value="Requirements Modeling [Sequence  Diagram]">Requirements Modeling [Sequence  Diagram]</option>
            <option value="Requirements Modeling [Activity Diagram]">Requirements Modeling [Activity Diagram]</option>
            <option value="Risk Assessment/Analysis">Risk Assessment/Analysis</option>
          `;
          elementsSelect.disabled = false;
          return;
        }
 
        // Design -> Output and UI Forms, Data Design, System Architecture...
        if (subtask === "Design" || subtask === "4.Design") {
          elementsSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            <option value="Output and User-interface Design Forms">Output and User-interface Design Forms</option>
            <option value="Data Design">Data Design</option>
            <option value="System Architecture [Network Model]">System Architecture [Network Model]</option>
            <option value="System Architecture [Network Topology]">System Architecture [Network Topology]</option>
            <option value="System Architecture [Network Security]">System Architecture [Network Security]</option>
          `;
          elementsSelect.disabled = false;
          return;
        }
 
        // ---------- Numbered Prototyping specific overrides requested earlier ----------
        // 3.Implementation -> Locale, Population..., Organizational Chart/Profile, Operational Feasibility [Fishbone Diagram]
        if (subtask === "3.Implementation") {
          elementsSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            <option value="Locale">Locale</option>
            <option value="Population of the Study">Population of the Study</option>
            <option value="Organizational Chart/Profile">Organizational Chart/Profile</option>
            <option value="Operational Feasibility [Fishbone Diagram]">Operational Feasibility [Fishbone Diagram]</option>
          `;
          elementsSelect.disabled = false;
          return;
        }
 
        // 4.Development -> Operational Feasibility [Functional Decomposition Diagram]
        if (subtask === "4.Development") {
          elementsSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            <option value="Operational Feasibility [Functional Decomposition Diagram]">Operational Feasibility [Functional Decomposition Diagram]</option>
          `;
          elementsSelect.disabled = false;
          return;
        }
 
        // 5.Implementation -> Technical Feasibility, Schedule Feasibility, Economic Feasibility
        if (subtask === "5.Implementation") {
          elementsSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            <option value="Technical Feasibility">Technical Feasibility</option>
            <option value="Schedule Feasibility">Schedule Feasibility</option>
            <option value="Economic Feasibility">Economic Feasibility</option>
          `;
          elementsSelect.disabled = false;
          return;
        }
 
        // 6.Development -> Requirements Modeling [Context Diagram]
        if (subtask === "6.Development") {
          elementsSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            <option value="Requirements Modeling [Context Diagram]">Requirements Modeling [Context Diagram]</option>
          `;
          elementsSelect.disabled = false;
          return;
        }
 
        // 7.Implementation -> Requirements Modeling [Data Flow Diagram], [System Flowchart], [Program Flowchart]
        if (subtask === "7.Implementation") {
          elementsSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            <option value="Requirements Modeling [Data Flow Diagram]">Requirements Modeling [Data Flow Diagram]</option>
            <option value="Requirements Modeling [System Flowchart]">Requirements Modeling [System Flowchart]</option>
            <option value="Requirements Modeling [Program Flowchart]">Requirements Modeling [Program Flowchart]</option>
          `;
          elementsSelect.disabled = false;
          return;
        }
 
        // 8.Development -> Requirements Modeling [Use Case Diagram]
        if (subtask === "8.Development") {
          elementsSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            <option value="Requirements Modeling [Use Case Diagram]">Requirements Modeling [Use Case Diagram]</option>
          `;
          elementsSelect.disabled = false;
          return;
        }
 
        // 9.Implementation -> Use Class / Sequence / Activity
        if (subtask === "9.Implementation") {
          elementsSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            <option value="Requirements Modeling [Use Class Diagram]">Requirements Modeling [Use Class Diagram]</option>
            <option value="Requirements Modeling [Sequence  Diagram]">Requirements Modeling [Sequence  Diagram]</option>
            <option value="Requirements Modeling [Activity Diagram]">Requirements Modeling [Activity Diagram]</option>
          `;
          elementsSelect.disabled = false;
          return;
        }
 
        // 10.Development -> Risk Assessment/Analysis
        if (subtask === "10.Development") {
          elementsSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            <option value="Risk Assessment/Analysis">Risk Assessment/Analysis</option>
          `;
          elementsSelect.disabled = false;
          return;
        }
 
        // 11.Implementation -> Output & UI Forms, Data Design, System Architecture items
        if (subtask === "11.Implementation") {
          elementsSelect.innerHTML = `
            <option value="" disabled selected hidden></option>
            <option value="Output and User-interface Design Forms">Output and User-interface Design Forms</option>
            <option value="Data Design">Data Design</option>
            <option value="System Architecture [Network Model]">System Architecture [Network Model]</option>
            <option value="System Architecture [Network Topology]">System Architecture [Network Topology]</option>
            <option value="System Architecture [Network Security]">System Architecture [Network Security]</option>
          `;
          elementsSelect.disabled = false;
          return;
        }
 
        // fallback to config if exists
        const task = document.getElementById("task").value;
        const config = taskStructure[task];
        if (!config || !config.elements[subtask]) {
          elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
          elementsSelect.disabled = true;
          return;
        }
 
        const elems = config.elements[subtask];
        elementsSelect.innerHTML = `
          <option value="" disabled selected hidden></option>
          ${elems.map((el) => `<option value="${el}">${el}</option>`).join("")}
        `;
        elementsSelect.disabled = false;
      });
 
      // end didOpen
    }, // didOpen end
    preConfirm: () => {
      const methodology = document.getElementById("methodology").value;
      const projectPhase = document.getElementById("projectPhase").value;
      const task = document.getElementById("task").value;
      const task_type = document.getElementById("task_type").value;
      const subtask = document.getElementById("subtask").value;
      const elements = document.getElementById("elements").value;
      const dueDate = document.getElementById("dueDate").value;
      const time = document.getElementById("time").value;
      const comment = document.getElementById("comment").value.trim();
 
      if (!task || selectedTeams.length === 0 || !dueDate) {
        Swal.showValidationMessage("Task, Team, and Due Date are required!");
        return false;
      }
 
      return {
        methodology,
        projectPhase,
        task,
        task_type,
        subtask,
        elements,
        teams: selectedTeams,
        dueDate,
        time,
        comment,
      };
    },
  }).then(async (result) => {
    if (!result.isConfirmed) return;
 
    const {
      methodology,
      projectPhase,
      task,
      task_type,
      subtask,
      elements,
      teams,
      dueDate,
      time,
      comment,
    } = result.value;
 
    const adviserIdentifier = adviser.id;
 
    for (const teamInfo of teams) {
      const { data: managerData, error: managerError } = await supabase
        .from("user_credentials")
        .select("id")
        .eq("group_number", teamInfo.group_number)
        .eq("user_roles", 1)
        .single();
 
      if (managerError) {
        console.error("Error fetching manager:", managerError);
        Swal.fire("Error", "Failed to fetch manager for a team.", "error");
        continue;
      }
 
      const managerIdentifier = managerData?.id;
 
      const { data, error: insertError } = await supabase
        .from("adviser_oral_def")
        .insert([{
          adviser_id: adviserIdentifier,
          manager_id: managerIdentifier,
          group_name: teamInfo?.group_name || "",
          methodology: methodology || null,
          project_phase: projectPhase || null,
          task,
          task_type,
          subtask: subtask || null,
          elements: elements || null,
          due_date: dueDate || null,
          time: time || null,
          comment: comment || null,
          status: "To Do",
        }])
        .select();
 
      if (!insertError && data) {
        setTasks((prev) => [...(prev || []), data[0]]);
      }
    }
 
    Swal.fire({
      icon: "success",
      title: "✓ Task Created",
      showConfirmButton: false,
      timer: 1500,
    });
  });
}; // end handleCreateTask
 
 
