// src/services/Manager/ManagerFinalTask.js
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { supabase } from "../../supabaseClient";

const MySwal = withReactContent(Swal);

export const openCreateFinalTask = async () => {
  // Kunin manager at members
  const customUser = JSON.parse(localStorage.getItem("customUser"));
  const managerUUID = customUser?.uuid || customUser?.id;

  if (!managerUUID) {
    Swal.fire("Error", "No signed-in user found.", "error");
    return;
  }

  const { data: managerData, error: mgrErr } = await supabase
    .from("user_credentials")
    .select("group_number")
    .eq("id", managerUUID)
    .single();

  if (mgrErr || !managerData) {
    Swal.fire("Error", "Manager not found!", "error");
    return;
  }
  const groupNumber = managerData.group_number;

  // Kunin members ng group
  const { data: members, error: memErr } = await supabase
    .from("user_credentials")
    .select("id, first_name, last_name")
    .eq("group_number", groupNumber)
    .neq("id", managerUUID);

  if (memErr) {
    Swal.fire("Error", "Failed to fetch members!", "error");
    return;
  }

  const memberOptions = members
    .map(
      (m) => `<option value="${m.id}">${m.last_name}, ${m.first_name}</option>`
    )
    .join("");

  // Open form
  const { value: formData } = await MySwal.fire({
    title: `<div style="color:#3B0304; font-weight:600; display:flex; align-items:center; gap:8px;">
      <i class="bi bi-list-check"></i> Create Final Defense Task</div>`,
    width: "900px",
    confirmButtonText: "Create Task",
    showCancelButton: true,
    cancelButtonText: "Cancel",
    focusConfirm: false,
    html: `
      <div style="display:grid; grid-template-columns: repeat(3,1fr); gap:12px; width:100%;">
        <div>
          <label style="font-weight:600;">Methodology</label>
          <select id="methodology" class="form-select" disabled>
            <option value="">(Disabled)</option>
          </select>
        </div>

        <div>
          <label style="font-weight:600;">Project Phase</label>
          <input id="projectPhase" type="text" class="form-control" disabled />
        </div>

        <div>
          <label style="font-weight:600;">Task Type</label>
          <select id="taskType" class="form-select" disabled>
            <option value="">(Disabled)</option>
          </select>
        </div>

        <div>
          <label style="font-weight:600;">Task</label>
          <select id="task" class="form-select" disabled>
            <option value="">(Disabled)</option>
          </select>
        </div>

        <div>
          <label style="font-weight:600;">Subtask</label>
          <select id="subtask" class="form-select" disabled>
            <option value="">(Disabled)</option>
          </select>
        </div>

        <div>
          <label style="font-weight:600;">Element</label>
          <select id="element" class="form-select" disabled>
            <option value="">(Disabled)</option>
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
          <label style="font-weight:600;">Assign Member/s *</label>
          <select id="assignedMembers" class="form-select">
            <option value="" disabled selected hidden>Select member</option>
            ${memberOptions}
          </select>
        </div>

        <!-- Members List -->
        <div style="grid-column: 1 / span 3; margin-top:10px;">
          <label style="font-weight:600;">Member List</label>
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

        membersListDiv.querySelectorAll(".removeMemberBtn").forEach((btn) => {
          btn.addEventListener("click", () => {
            const idToRemove = btn.getAttribute("data-id");
            selectedMembers = selectedMembers.filter((m) => m.id !== idToRemove);

            renderMembersList();
          });
        });
      };

      assignedDropdown.addEventListener("change", () => {
        const selectedId = assignedDropdown.value;
        const selectedText =
          assignedDropdown.options[assignedDropdown.selectedIndex]?.text;

        if (!selectedId) return;

        selectedMembers.push({ id: selectedId, name: selectedText });
        assignedDropdown.querySelector(`option[value="${selectedId}"]`).remove();
        assignedDropdown.value = "";

        renderMembersList();
      });

      window.__finalDefSelectedMembers = selectedMembers;
    },
    preConfirm: () => {
      const dueDate = document.getElementById("dueDate").value;
      const time = document.getElementById("time").value;
      const assignedMembers = (window.__finalDefSelectedMembers || []).map(
        (m) => m.id
      );
      const comment = document.getElementById("comment").value;

      if (!dueDate || assignedMembers.length === 0) {
        Swal.showValidationMessage("⚠ Please complete all required fields!");
        return false;
      }
      return {
        dueDate,
        time,
        assignedMembers,
        comment,
      };
    },
  });

  if (formData) {
    Swal.fire("Ok", "Final Defense Task Created!", "success");
    return []; // walang iinsert muna
  }
};
