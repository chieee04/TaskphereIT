// ManagerCreateTitleTask.js
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  methodologyList,
  projectPhaseMap,
  taskTypeList,
  documentationTasks,
  discussionTasks,
} from "./ManagerTitleTaskData";
import { supabase } from "../../supabaseClient"; // ✅ para maka-fetch sa DB

const MySwal = withReactContent(Swal);

// Helper para gumawa ng dropdown options
const buildOptions = (arr) =>
  [`<option value="" disabled selected hidden></option>`, ...arr.map((m) => `<option value="${m}">${m}</option>`)].join("");

// 🟢 Main Function
export const openCreateTask = async (currentManagerId, defaults = {}) => {
  console.log("👉 Current Manager ID:", currentManagerId);

  // 1. Kunin muna ang group_number ng naka-login na manager (gamit UUID)
  const { data: manager, error: mErr } = await supabase
    .from("user_credentials")
    .select("group_number")
    .eq("id", currentManagerId) // ✅ uuid ang gamit
    .single();

  if (mErr || !manager) {
    console.error("❌ Manager fetch error:", mErr);
    Swal.fire("Error", "Manager not found!", "error");
    return;
  }
  console.log("📌 Manager Info:", manager);

  // 2. Kunin lahat ng members sa group na iyon (user_roles = 2 → members)
  const { data: members, error: memErr } = await supabase
    .from("user_credentials")
    .select("id, first_name, last_name")
    .eq("user_roles", 2)
    .eq("group_number", manager.group_number);

  if (memErr) {
    console.error("❌ Members fetch error:", memErr);
    Swal.fire("Error", "Failed to fetch members!", "error");
    return;
  }
  console.log("📌 Members Found:", members);

  // Build members options
  const memberOptions = members
    .map((m) => `<option value="${m.id}">${m.last_name}, ${m.first_name}</option>`)
    .join("");

  // 3. Swal Modal
  const { value: formData } = await MySwal.fire({
    title: `<div style="color:#3B0304; font-weight:600; display:flex; align-items:center; gap:8px;">
      <i class="bi bi-list-check"></i> Create Task</div>`,
    width: "800px",
    confirmButtonText: "Create Task",
    showCancelButton: true,
    cancelButtonText: "Cancel",
    focusConfirm: false,
    html: `
      <div style="display:grid; grid-template-columns: repeat(3,1fr); gap:12px; width:100%;">
        <div>
          <label style="font-weight:600;">Methodology</label>
          <select id="methodology" class="form-select">
            ${buildOptions(methodologyList)}
          </select>
        </div>

        <div>
          <label style="font-weight:600;">Project Phase</label>
          <input id="projectPhase" class="form-control" disabled />
        </div>

        <div>
          <label style="font-weight:600;">Task Type</label>
          <select id="task_type" class="form-select" disabled>
            ${buildOptions(taskTypeList)}
          </select>
        </div>

        <div>
          <label style="font-weight:600;">Tasks</label>
          <select id="task" class="form-select" disabled>
            <option value="" disabled selected hidden></option>
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

        <!-- Assign Members -->
        <div style="grid-column: 1 / span 3;">
          <label style="font-weight:600;">Assign Members *</label>
          <select id="assignedMembers" class="form-select">
            <option value="" disabled selected hidden>Select member</option>
            ${memberOptions}
          </select>
        </div>

        <!-- Members List -->
        <div style="grid-column: 1 / span 3; margin-top:10px;">
          <label style="font-weight:600;">Members List</label>
          <div id="membersList" style="border:1px solid #ccc; border-radius:6px; padding:8px; min-height:40px;">
            <small style="color:#888;">No members assigned</small>
          </div>
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
      const taskType = document.getElementById("task_type");
      const task = document.getElementById("task");

      // 🔄 Cascading Logic
      methodology.addEventListener("change", () => {
        projectPhase.value = projectPhaseMap[methodology.value] || "";
        projectPhase.disabled = true;
        taskType.value = "";
        taskType.disabled = false;
        task.innerHTML = `<option value="" disabled selected hidden></option>`;
        task.disabled = true;
      });

      taskType.addEventListener("change", () => {
        if (taskType.value === "Documentation") {
          task.innerHTML = buildOptions(documentationTasks[methodology.value] || []);
        } else if (taskType.value === "Discussion & Review") {
          task.innerHTML = buildOptions(discussionTasks[methodology.value] || discussionTasks.default);
        } else {
          task.innerHTML = `<option value="" disabled selected hidden></option>`;
        }
        task.disabled = false;
      });

      // 🔽 Members Assign Logic
      const assignedDropdown = document.getElementById("assignedMembers");
      const membersListDiv = document.getElementById("membersList");

      let selectedMembers = [];

      const renderMembersList = () => {
        if (selectedMembers.length === 0) {
          membersListDiv.innerHTML = `<small style="color:#888;">No members assigned</small>`;
          return;
        }

        membersListDiv.innerHTML = selectedMembers
          .map(
            (m) => `
            <div style="display:flex; align-items:center; justify-content:space-between; padding:4px 8px; border:1px solid #ddd; border-radius:16px; margin-bottom:6px; background:#f9f9f9;">
              <span>${m.name}</span>
              <button type="button" class="btn btn-sm btn-danger removeMemberBtn" data-id="${m.id}">x</button>
            </div>`
          )
          .join("");

        // Remove button handler
        membersListDiv.querySelectorAll(".removeMemberBtn").forEach((btn) => {
          btn.addEventListener("click", () => {
            const idToRemove = btn.getAttribute("data-id");
            const removed = selectedMembers.find((m) => m.id === idToRemove);
            selectedMembers = selectedMembers.filter((m) => m.id !== idToRemove);

            // ibalik sa dropdown
            assignedDropdown.innerHTML += `<option value="${removed.id}">${removed.name}</option>`;
            renderMembersList();
          });
        });
      };

      // Auto-move on select
      assignedDropdown.addEventListener("change", () => {
        const selectedId = assignedDropdown.value;
        const selectedText = assignedDropdown.options[assignedDropdown.selectedIndex]?.text;

        if (!selectedId) return;

        selectedMembers.push({ id: selectedId, name: selectedText });

        // alisin sa dropdown
        assignedDropdown.querySelector(`option[value="${selectedId}"]`).remove();
        assignedDropdown.value = "";

        renderMembersList();
      });

      // store globally
      window.__selectedMembers = selectedMembers;
    },
    preConfirm: () => {
      const methodology = document.getElementById("methodology").value;
      const projectPhase = document.getElementById("projectPhase").value;
      const taskType = document.getElementById("task_type").value;
      const task = document.getElementById("task").value;
      const dueDate = document.getElementById("dueDate").value;
      const time = document.getElementById("time").value;
      const assignedMembers = (window.__selectedMembers || []).map((m) => m.id);
      const comment = document.getElementById("comment").value;

      if (!methodology || !projectPhase || !taskType || !task || !dueDate || assignedMembers.length === 0) {
        Swal.showValidationMessage("⚠ Please complete all required fields!");
        return false;
      }

      return { methodology, projectPhase, taskType, task, dueDate, time, assignedMembers, comment };
    },
  });

  // 4. Kapag may data (Create Task button clicked)
// 4. Kapag may data (Create Task button clicked)
if (formData) {
  console.log("✅ New Title Task Created:", formData);

  const now = new Date();
  const createdDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const createdTime = now.toTimeString().split(" ")[0]; // HH:MM:SS

  let insertedTasks = [];

  for (const memberId of formData.assignedMembers) {
    const { data: inserted, error } = await supabase
      .from("manager_title_task")
      .insert([
        {
          manager_id: currentManagerId,
          methodology: formData.methodology,
          project_phase: formData.projectPhase,
          task_type: formData.taskType,
          task_name: formData.task,
          due_date: formData.dueDate,
          due_time: formData.time || null,
          member_id: memberId,
          created_date: createdDate,
          created_time: createdTime,
          revision: 1,
          status: "To Do",
        },
      ])
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
        member:user_credentials!manager_title_task_member_id_fkey(first_name, last_name)
      `)
      .single();

    if (error) {
      console.error("❌ Insert error:", error);
      Swal.fire("Error", "Failed to save task!", "error");
      return null;
    }

    insertedTasks.push(inserted); // 🟢 store lahat ng bagong task
  }

  // ✅ Pagkatapos ng loop, success alert
  Swal.fire("✅ Success", "Task(s) created successfully!", "success");

  return insertedTasks; // 🟢 ibalik lahat ng bagong tasks
}

};
