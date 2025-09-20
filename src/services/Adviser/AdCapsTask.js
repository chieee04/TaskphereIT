// src/components/caps tasks/caps-tasks.jsx/AdCapsTask.js
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
  //Disscussion and review
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

  /*"Prepare: Chapter 3": {
    subtasks: ["Implementation", "Development"],
    elements: {
      "Implementation": ["Hardware", "Software", "Peopleware"],
      "Development": ["Hardware", "Software", "Peopleware"]
    }
  },*/
};



const methodologyList = ["Agile", "Extreme Programming","Spiral", "Prototyping", "RAD"];

///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////

//update
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

  // 🔄 Update local state agad sa UI
  setTasks((prev) =>
    prev.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    )
  );

  // ✅ Success toast
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

  const uniqueTeams = [
    ...new Map(teams.map((item) => [item.group_number, item])).values(),
  ];

  const teamOptions = uniqueTeams
    .map((t) => `<option value="${t.id}">${t.group_name}</option>`)
    .join("");

  // Dropdown lists

  const methodologyOptionsHtml = [
    `<option value="" disabled selected hidden></option>`,
    ...methodologyList.map((m) => `<option value="${m}">${m}</option>`),
  ].join("");

  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  
// PROJECT PHASE LISTS
  const projectPhaseOptionsHtml = [
    `<option value="" disabled selected hidden></option>`,
    `<option value="Designing">Designing</option>`,
  ].join("");

//lahat ng nasa task
  const taskList = [
    "UI Design",
  "UI and Functionality Finalization",
  "Initial Prototype",
  "Present Prototype to the Users",
  "Gather User/Client Feedback on Prototype Concept",
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

    // ✅ Reset array every modal open (para hindi nadadala sa ibang task creation)
    selectedTeams = [];

    assignedSelect.addEventListener("change", (e) => {
      const teamId = e.target.value;
      const team = uniqueTeams.find((t) => t.id == teamId);

      if (!team) return;

      // add to selected list kung hindi pa
      if (!selectedTeams.some((t) => t.id == team.id)) {
        selectedTeams.push(team);

        // render team badge
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

        // remove kapag na-click ang (-)
        teamBadge.querySelector("button").addEventListener("click", () => {
          selectedTeams = selectedTeams.filter((t) => t.id != team.id);
          teamsListDiv.removeChild(teamBadge);

          // ibalik sa dropdown
          const opt = document.createElement("option");
          opt.value = team.id;
          opt.textContent = team.group_name;
          assignedSelect.appendChild(opt);
        });

        teamsListDiv.appendChild(teamBadge);

        // alisin sa dropdown
        assignedSelect.querySelector(`option[value="${team.id}"]`)?.remove();
        assignedSelect.value = "";
      }
    });
    

// documantion task pagpipilian
  const documentationTasks = [
  "UI Design & Functionalities",
  "Prepare: Chapter 1",
  "Prepare: Chapter 2",
  "Prepare: Chapter 3",
  "Prepare: Chapter 4",
  "Prepare: Appendices",
  "Manuscript Submission",
  "Oral Defense Preparation",
  "Oral Defense",
  "Refinement for Oral Re-Defense",
  "Incorporate Panel Feedback Based on Oral Defense",
  "Refine: Chapter 1",
  "Refinement of UI Design & Functionalities",
  "Refine: Chapter 2",
  "Refine: Chapter 3",
  "Refine: Chapter 4",
  "Refine: Appendices",
  "Manuscript Re-Submission",
  "Oral Re-Defense Preparation",
  "Oral Re-Defense",
  "Incorporate Panel Feedback Based on Oral Re-Defense"
];
//rad
const raddocumentationTasks = [
  "UI Design",
  "Prepare: Chapter 1",
  "Prepare: Chapter 2",
  "Prepare: Chapter 3",
  "Prepare: Chapter 4",
  "Prepare: Appendices",
  "Manuscript Submission",
  "Oral Defense Preparation",
  "Oral Defense",
  "Refinement for Oral Re-Defense",
  "Incorporate Panel Feedback Based on Oral Defense",
  "Refine: Chapter 1",
  "Refinement of UI Design & Functionalities",
  "Refine: Chapter 2",
  "Refine: Chapter 3",
  "Refine: Chapter 4",
  "Refine: Appendices",
  "Manuscript Re-Submission",
  "Oral Re-Defense Preparation",
  "Oral Re-Defense",
  "Incorporate Panel Feedback Based on Oral Re-Defense"
];

 //discussion & review pagpipiliian
  const discussionTasks = [
    "Capstone Meeting", "Adviser Consultation",
    "Interview User/ Client", "Gather Feedback from the User/Clien",
  ];
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
  // ✅ ORIGINAL LOGIC (wag alisin!) logic ng methodology
  methodologySelect.addEventListener("change", (e) => {
    const value = e.target.value;
    //Agile
    if (value === "Agile") {
      taskTypeSelect.disabled = false;
      taskSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
      taskSelect.disabled = true;
      subtaskSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
      subtaskSelect.disabled = true;
      elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
      elementsSelect.disabled = true;
      projectPhaseSelect.value = "Designing";
      taskTypeSelect.innerHTML = `
        <option value="" disabled selected hidden></option>
        <option value="Documentation">Documentation</option>
        <option value="Discussion & Review">Discussion & Review</option>
      `;

    } 
    else if (value === "Extreme Programming"){
      //reset
      taskTypeSelect.disabled = false;
      taskSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
      taskSelect.disabled = true;
      subtaskSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
      subtaskSelect.disabled = true;
      elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
      elementsSelect.disabled = true;
      //auto design
      projectPhaseSelect.value = "Designing";
      taskTypeSelect.innerHTML = `
        <option value="" disabled selected hidden></option>
        <option value="Documentation">Documentation</option>
        <option value="Discussion & Review">Discussion & Review</option>
      `;
      taskTypeSelect.disabled = false;
    }else if (value === "RAD"){
      //reset
      taskTypeSelect.disabled = false;
      taskSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
      taskSelect.disabled = true;
      subtaskSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
      subtaskSelect.disabled = true;
      elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
      elementsSelect.disabled = true;
      //auto design
      projectPhaseSelect.value = "Designing";
      taskTypeSelect.innerHTML = `
        <option value="" disabled selected hidden></option>
        <option value="radDocumentation">Documentation</option>
        <option value="Discussion & Review">Discussion & Review</option>
      `;
      taskTypeSelect.disabled = false;
    }
    else {
      projectPhaseSelect.value = `<option value="" disabled selected hidden></option>`;
      taskTypeSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
      taskTypeSelect.disabled = true;
      taskSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
      taskSelect.disabled = true;
    }
  });
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
  
  taskTypeSelect.addEventListener("change", (e) => {
  const value = e.target.value;

  // ✅ CLEAR & DISABLE Subtask + Elements every time magpalit ng task type
  subtaskSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
  subtaskSelect.disabled = true;
  elementsSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
  elementsSelect.disabled = true;

///////////////////////////////////////////////////////////////////////////////////////////////////////
  if (value === "radDocumentation") {
    taskSelect.innerHTML = `
      <option value="" disabled selected hidden></option>
      ${raddocumentationTasks.map((t) => `<option value="${t}">${t}</option>`).join("")}
    `;
    taskSelect.disabled = false;
  } else if (value === "Discussion & Review") {
    taskSelect.innerHTML = `
      <option value="" disabled selected hidden></option>
      ${discussionTasks.map((t) => `<option value="${t}">${t}</option>`).join("")}
    `;
    taskSelect.disabled = false;
  } else if (value === "Documentation") {
    taskSelect.innerHTML = `
      <option value="" disabled selected hidden></option>
      ${documentationTasks.map((t) => `<option value="${t}">${t}</option>`).join("")}
    `;
    taskSelect.disabled = false;}
  
  
  else {
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
    teams: selectedTeams, // ✅ dito naka-store lahat ng teams
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
};
