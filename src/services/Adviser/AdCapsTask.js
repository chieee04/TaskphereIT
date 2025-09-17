// src/components/caps tasks/caps-tasks.jsx/AdCapsTask.js
import { supabase } from "../../supabaseClient";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// ✅ Fetch Tasks
export const fetchTasksFromDB = async (setTasks) => {
  const { data, error } = await supabase
    .from("adviser_oral_def")
    .select("*")
    .order("date_created", { ascending: false });

  if (error) {
    console.error("Error fetching tasks:", error);
    return;
  }

  // check kung existing pa yung team
  for (const t of data) {
    const { data: teamExists } = await supabase
      .from("user_credentials")
      .select("group_number")
      .eq("group_name", t.group_name)
      .maybeSingle();

    if (!teamExists) {
      await supabase.from("adviser_oral_def").delete().eq("id", t.id);
    }
  }

  // refresh tasks
  const { data: cleaned } = await supabase
    .from("adviser_oral_def")
    .select("*")
    .order("date_created", { ascending: false });

  setTasks(cleaned);
};
const taskStructure = {
//DOCUMENTATION


  // === Documentation Tasks ===
  "UI Design": {
    subtasks: [], // same color → disabled
    elements: {}
  },

  // === Chapter 1 ===
  "Prepare: Chapter 1": {
    subtasks: ["Introduction", "Objectives", "Scope and Limitation"],
    elements: {
      "Introduction": [
        "Project Context",
        "Background of the Study",
        "Policies and Procedures",
        "Users Position"
      ],
      "Objectives": [
        "General Objectives",
        "Specific Objectives"
      ],
      "Scope and Limitation": [
        "Scope",
        "Limitation"
      ]
    }
  },
  "Refine: Chapter 1": {
    subtasks: ["Introduction", "Objectives", "Scope and Limitation"],
    elements: {
      "Introduction": [
        "Project Context",
        "Background of the Study",
        "Policies and Procedures",
        "Users Position"
      ],
      "Objectives": [
        "General Objectives",
        "Specific Objectives"
      ],
      "Scope and Limitation": [
        "Scope",
        "Limitation"
      ]
    }
  },

  // === Chapter 2 ===
  "Prepare: Chapter 2": {
    subtasks: ["Related Theories", "Related Literature"],
    elements: {
      "Related Theories": [],
      "Related Literature": []
    }
  },
  "Refine: Chapter 2": {
    subtasks: ["Related Theories", "Related Literature"],
    elements: {
      "Related Theories": [],
      "Related Literature": []
    }
  },

  // === Chapter 3 ===
  "Prepare: Chapter 3": {
    subtasks: ["Implementation", "Development"],
    elements: {
      "Implementation": ["Hardware", "Software", "Peopleware"],
      "Development": ["Hardware", "Software", "Peopleware"]
    }
  },
  "Refine: Chapter 3": {
    subtasks: ["Implementation", "Development"],
    elements: {
      "Implementation": ["Hardware", "Software", "Peopleware"],
      "Development": ["Hardware", "Software", "Peopleware"]
    }
  },

  // === Chapter 4 ===
  "Prepare: Chapter 4": {
    subtasks: [
      "Methodology",
      "Environment",
      "Requirement Specification",
      "Requirements Modeling",
      "Risk Assessment/Analysis",
      "Design"
    ],
    elements: {
      "Methodology": [],
      "Environment": [
        "Locale",
        "Population of the Study",
        "Organizational Chart/Profile"
      ],
      "Requirement Specification": [
        "Operational Feasibility [Fishbone Diagram]",
        "Operational Feasibility [Functional Decomposition Diagram]",
        "Technical Feasibility",
        "Schedule Feasibility",
        "Economic Feasibility"
      ],
      "Requirements Modeling": [
        "Context Diagram",
        "Data Flow Diagram",
        "System Flowchart",
        "Program Flowchart",
        "Use Case Diagram",
        "Use Class Diagram",
        "Sequence  Diagram",
        "Activity Diagram"
      ],
      "Risk Assessment/Analysis": [],
      "Design": [
        "Output and User-interface Design Forms",
        "Data Design",
        "System Architecture [Network Model]",
        "System Architecture [Network Topology]",
        "System Architecture [Network Security]"
      ]
    }
  },
  "Refine: Chapter 4": {
    subtasks: [
      "Methodology",
      "Environment",
      "Requirement Specification",
      "Requirements Modeling",
      "Risk Assessment/Analysis",
      "Design"
    ],
    elements: {
      "Methodology": [],
      "Environment": [
        "Locale",
        "Population of the Study",
        "Organizational Chart/Profile"
      ],
      "Requirement Specification": [
        "Operational Feasibility [Fishbone Diagram]",
        "Operational Feasibility [Functional Decomposition Diagram]",
        "Technical Feasibility",
        "Schedule Feasibility",
        "Economic Feasibility"
      ],
      "Requirements Modeling": [
        "Context Diagram",
        "Data Flow Diagram",
        "System Flowchart",
        "Program Flowchart",
        "Use Case Diagram",
        "Use Class Diagram",
        "Sequence  Diagram",
        "Activity Diagram"
      ],
      "Risk Assessment/Analysis": [],
      "Design": [
        "Output and User-interface Design Forms",
        "Data Design",
        "System Architecture [Network Model]",
        "System Architecture [Network Topology]",
        "System Architecture [Network Security]"
      ]
    }
  },

  // === Appendices ===
  "Prepare: Appendices": {
    subtasks: ["Appendix A", "Appendix B", "Appendix C", "Appendix D", "Appendix E"],
    elements: {}
  },
  "Refine: Appendices": {
    subtasks: ["Appendix A", "Appendix B", "Appendix C", "Appendix D", "Appendix E"],
    elements: {}
  },

  // === Final Review & Defense ===
  "Manuscript Final Review": { subtasks: [], elements: {} },
  "Oral Defense": { subtasks: [], elements: {} },
  "Incorporate Panel Feedback": { subtasks: [], elements: {} },
  "Oral Re-Defense": { subtasks: [], elements: {} },


  //DISCUSSION & REVIEW

  "Interview Client": {
    subtasks: [], // same color → disabled
    elements: {}
  },
  "Capstone Meeting": {
    subtasks: [], // same color → disabled
    elements: {}
  },
  "Manuscript Submission": {
    subtasks: ["Chaper 1", "Chaper 2", "Chaper 3", "Chaper 4", "Appendices", "AI and Plagiarism Check" ], // same color → disabled
    elements: {}
  },
  "Manuscript Re-Submission": {
    subtasks: ["Chaper 1", "Chaper 2", "Chaper 3", "Chaper 4", "Appendices", "AI and Plagiarism Check" ], // same color → disabled
    elements: {}
  },
  "Re-Defense Manuscript Submission": {
    subtasks: ["Chaper 1", "Chaper 2", "Chaper 3", "Chaper 4", "Appendices", "AI and Plagiarism Check" ], // same color → disabled
    elements: {}
  },
  "Adviser Consultation": {
    subtasks: [], // same color → disabled
    elements: {}
  },
  "Manuscript Printing": {
    subtasks: [], // same color → disabled
    elements: {}
  },
  "Prepare: PowerPoint Presentation": {
    subtasks: ["Oral Defense", "Oral Re-Defense"], // same color → disabled
    elements: {}
  },
  "Mock Defense": {
    subtasks: ["Oral Defense", "Oral Re-Defense"], // same color → disabled
    elements: {}
  },

  //Manuscript Submission
//Manuscript Re-Submission
//Re-Defense Manuscript Submission

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

  const uniqueTeams = [
    ...new Map(teams.map((item) => [item.group_number, item])).values(),
  ];

  const teamOptions = uniqueTeams
    .map((t) => `<option value="${t.id}">${t.group_name}</option>`)
    .join("");

  // Dropdown lists
  const methodologyList = ["Agile", "Extreme Programming", "JAD", "Prototyping", "RAD"];
  const methodologyOptionsHtml = [
    `<option value="" disabled selected hidden></option>`,
    ...methodologyList.map((m) => `<option value="${m}">${m}</option>`),
  ].join("");

  const projectPhaseOptionsHtml = [
    `<option value="" disabled selected hidden></option>`,
    `<option value="Designing">Designing</option>`,
    `<option value="Developing">Developing</option>`,
    `<option value="Testing">Testing</option>`,
    `<option value="Deployment">Deployment</option>`,
    `<option value="Review">Review</option>`,
  ].join("");

  const taskList = [
    "UI Design",
    "Prepare: Chapter 1", "Refine: Chapter 1",
    "Prepare: Chapter 2", "Refine: Chapter 2",
    "Prepare: Chapter 3", "Refine: Chapter 3",
    "Prepare: Chapter 4", "Refine: Chapter 4",
    "Prepare: Appendices", "Refine: Appendices",
    "Manuscript Final Review", "Oral Defense",
    "Incorporate Panel Feedback", "Oral Re-Defense",
    "Interview Client", "Capstone Meeting",
    "Manuscript Submission", "Manuscript Re-Submission",
    "Re-Defense Manuscript Submission", "Adviser Consultation",
    "Manuscript Printing", "Prepare: PowerPoint Presentation",
    "Mock Defense"
  ];

  const taskOptionsHtml = [
    `<option value="" disabled selected hidden></option>`,
    ...taskList.map((t) => `<option value="${t}">${t}</option>`),
  ].join("");

  const defaultTaskOptionsHtml = `<option value="" disabled selected hidden></option>`;
  const emptySelectHtml = `<option value="" disabled selected hidden></option>`;

  // ✅ SweetAlert modal
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

  const documentationTasks = [
    "UI Design",
    "Prepare: Chapter 1", "Refine: Chapter 1",
    "Prepare: Chapter 2", "Refine: Chapter 2",
    "Prepare: Chapter 3", "Refine: Chapter 3",
    "Prepare: Chapter 4", "Refine: Chapter 4",
    "Prepare: Appendices", "Refine: Appendices",
    "Manuscript Final Review", "Oral Defense",
    "Incorporate Panel Feedback", "Oral Re-Defense"
  ];

  const discussionTasks = [
    "Interview Client", "Capstone Meeting",
    "Manuscript Submission", "Manuscript Re-Submission",
    "Re-Defense Manuscript Submission", "Adviser Consultation",
    "Manuscript Printing", "Prepare: PowerPoint Presentation",
    "Mock Defense"
  ];

  // ✅ ORIGINAL LOGIC (wag alisin!)
  methodologySelect.addEventListener("change", (e) => {
    const value = e.target.value;
    if (value === "Agile") {
      projectPhaseSelect.value = "Designing";
      taskTypeSelect.innerHTML = `
        <option value="" disabled selected hidden></option>
        <option value="Documentation">Documentation</option>
        <option value="Discussion & Review">Discussion & Review</option>
      `;
      taskTypeSelect.disabled = false;
    } else {
      projectPhaseSelect.value = "";
      taskTypeSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
      taskTypeSelect.disabled = true;
      taskSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
      taskSelect.disabled = true;
    }
  });

  taskTypeSelect.addEventListener("change", (e) => {
  const value = e.target.value;

  // ✅ CLEAR & DISABLE Subtask + Elements every time magpalit ng task type
  subtaskSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
  subtaskSelect.disabled = true;
  elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
  elementsSelect.disabled = true;

  if (value === "Documentation") {
    taskSelect.innerHTML = `
      <option value="" disabled selected hidden></option>
      ${documentationTasks.map((t) => `<option value="${t}">${t}</option>`).join("")}
    `;
    taskSelect.disabled = false;
  } else if (value === "Discussion & Review") {
    taskSelect.innerHTML = `
      <option value="" disabled selected hidden></option>
      ${discussionTasks.map((t) => `<option value="${t}">${t}</option>`).join("")}
    `;
    taskSelect.disabled = false;
  } else {
    taskSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
    taskSelect.disabled = true;
  }
});

  // ✅ NEW LOGIC for Subtasks & Elements
  taskSelect.addEventListener("change", (e) => {
    const task = e.target.value;
    const config = taskStructure[task];

    if (!config) {
      subtaskSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
      subtaskSelect.disabled = true;
      elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
      elementsSelect.disabled = true;
      return;
    }

    if (config.subtasks.length === 0) {
      // same color → disabled
      subtaskSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
      subtaskSelect.disabled = true;
      elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
      elementsSelect.disabled = true;
      return;
    }

    // populate subtasks
    subtaskSelect.innerHTML = `
      <option value="" disabled selected hidden></option>
      ${config.subtasks.map((s) => `<option value="${s}">${s}</option>`).join("")}
    `;
    subtaskSelect.disabled = false;
    elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
    elementsSelect.disabled = true;
  });

  subtaskSelect.addEventListener("change", (e) => {
    const task = taskSelect.value;
    const subtask = e.target.value;
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
}
,
    preConfirm: () => {
      const methodology = document.getElementById("methodology").value;
      const projectPhase = document.getElementById("projectPhase").value;
      const task = document.getElementById("task").value;
      const task_type = document.getElementById("task_type").value;
      const subtask = document.getElementById("subtask").value;
      const elements = document.getElementById("elements").value;
      const assigned = document.getElementById("assigned").value;
      const dueDate = document.getElementById("dueDate").value;
      const time = document.getElementById("time").value;
      const comment = document.getElementById("comment").value.trim();

      if (!task || !assigned || !dueDate) {
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
        assigned,
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
      assigned,
      dueDate,
      time,
      comment,
    } = result.value;

    const teamInfo = uniqueTeams.find((t) => t.id === assigned);

    const adviserIdentifier = adviser.id;
    const { data: managerData, error: managerError } = await supabase
      .from("user_credentials")
      .select("id")
      .eq("group_number", teamInfo.group_number)
      .eq("user_roles", 1)
      .single();

    if (managerError) {
      console.error("Error fetching manager:", managerError);
      Swal.fire("Error", "Failed to fetch manager for this team.", "error");
      return;
    }

    const managerIdentifier = managerData?.id;

    const { data, error: insertError } = await supabase
      .from("adviser_oral_def")
      .insert([
        {
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
          status: "Pending",
        },
      ])
      .select();

    if (insertError) {
      console.error("Insert error:", insertError);
      Swal.fire("Error", "Failed to create task.", "error");
      return;
    }

    setTasks((prev) => [...(prev || []), data[0]]);
    Swal.fire({
      icon: "success",
      title: "✓ Task Created",
      showConfirmButton: false,
      timer: 1500,
    });
  });
};
