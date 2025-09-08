// Teams.jsx (Full Updated backend for user_credentials table)

import React, { useState, useEffect, useRef } from 'react';
import { FaUsers, FaFolder, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { supabase } from '../../supabaseClient';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Teams = () => {
  const [allAccounts, setAllAccounts] = useState([]);
  const allAccountsRef = useRef([]);
  const [Manager, setManager] = useState([]);
  const [students, setStudents] = useState([]);
  const [advisers, setAdvisers] = useState([]);
  const [teamCards, setTeamCards] = useState(() => {
    const saved = localStorage.getItem("teamCards");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    fetchAccounts();
    window.addEventListener("team-click", handleTeamClick);
    return () => window.removeEventListener("team-click", handleTeamClick);
  }, []);

  useEffect(() => {
    localStorage.setItem("teamCards", JSON.stringify(teamCards));
  }, [teamCards]);

  // ================================
  // Fetch Accounts
  // ================================
  const fetchAccounts = async () => {
    const { data, error } = await supabase.from('user_credentials').select('*');
    if (!error) {
      // grouped teams (members assigned to group_number but no adviser yet)
      const grouped = data.filter((a) => a.group_number !== null && a.adviser_group === null);

      const groupedTeamCards = grouped.reduce((acc, member) => {
        const existing = acc.find(g => g.group_number === member.group_number);
        const manager = data.find(m => m.group_number === member.group_number && m.user_roles === 1);
        const label = `${manager?.last_name || 'Team'}, Et Al.`;

        if (existing) {
          existing.members.push(`${member.first_name} ${member.last_name}`);
        } else {
          acc.push({
            group_number: member.group_number,
            label,
            members: [`${member.first_name} ${member.last_name}`],
            adviser_group: null
          });
        }
        return acc;
      }, []);

      // Adviser groups
      const adviserGroups = data.filter(d => d.adviser_group !== null).reduce((acc, row) => {
        if (!acc[row.adviser_group]) acc[row.adviser_group] = [];
        acc[row.adviser_group].push(row);
        return acc;
      }, {});

      const adviserCards = Object.values(adviserGroups).map(group => {
  const adviser = group.find(g => g.user_roles === 3);

  const teams = [...new Set(
    group.filter(m => m.group_number !== null).map(m => m.group_name)
  )];
  const members = group.filter(m => m.user_roles !== 3).map(m => `${m.first_name} ${m.last_name}`);

  if (!adviser) {
    return {
      label: `Adviser Not Found`,
      adviserId: null,
      adviser_group: group[0]?.adviser_group || null,
      teams,
      members,
    };
  }

  return {
    label: `${adviser.last_name}, ${adviser.first_name} ${adviser.middle_name || ''}`,
    adviserId: adviser.id,
    adviser_group: adviser.adviser_group,
    teams,
    members,
  };
});

      setManager(data.filter((a) => a.user_roles === 1 && a.group_number === null && a.adviser_group === null));
      setStudents(data.filter((s) => s.user_roles === 2 && s.group_number === null && s.adviser_group === null));
      setAdvisers(data.filter((s) => s.user_roles === 3));
      setTeamCards([...groupedTeamCards, ...adviserCards]);
      setAllAccounts(data);
      allAccountsRef.current = data;
    }
  };

  // ================================
  // Delete Team or Adviser Group
  // ================================
  const handleDeleteFolder = async (team) => {
    MySwal.fire({
      title: `Delete "${team.label}"?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3B0304",
      cancelButtonColor: "#999",
      confirmButtonText: "Yes, delete it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (team.group_number) {
            // Delete single team
            await supabase
              .from("user_credentials")
              .update({ group_number: null, group_name: null, adviser_group: null })
              .eq("group_number", team.group_number);
          } else if (team.adviser_group) {
            // Delete adviser group (adviser + teams under it)
            await supabase
              .from("user_credentials")
              .update({ adviser_group: null })
              .eq("adviser_group", team.adviser_group);

            await supabase
              .from("user_credentials")
              .update({ group_number: null, group_name: null })
              .in("group_number", team.teams.map(t => parseInt(t.replace(/[^\d]/g, ""))));
          }

          await fetchAccounts();

          MySwal.fire({
            icon: "success",
            title: "Deleted successfully",
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (err) {
          console.error("Error deleting folder:", err);
          MySwal.fire("Error", "Failed to delete folder", "error");
        }
      }
    });
  };
  // ================================
  // Handle Team Click (view team or adviser folder)
  // ================================
  const handleTeamClick = (e) => {
    const clickedLabel = e.detail;
    const foundTeam = teamCards.find(t => t.label === clickedLabel);

    if (!foundTeam) return;

    if (foundTeam.teams && foundTeam.teams.length > 0) {
      // Adviser folder – show team folders
      const teamButtons = foundTeam.teams.map((teamLabel) => {
  return `<div class="team-folder-btn" data-team="${teamLabel}" style="
    background-color: white;
    border-left: 10px solid #3B0304;
    border-radius: 12px;
    padding: 10px;
    margin-bottom: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  ">
    <div style="display:flex; align-items:center; gap:8px;">
      <i class="bi bi-folder-fill" style="color: #3B0304; font-size: 20px;"></i>
      <span style="font-size: 14px; font-weight: 600; color: #3B0304;">${teamLabel}</span>
    </div>
    <button class="delete-team-btn" data-team="${teamLabel}" style="background:none; border:none; color:red; font-size:16px; cursor:pointer;">🗑</button>
  </div>`;
}).join('');

      MySwal.fire({
        title: `<div style='color:#3B0304;'>📁 ${foundTeam.label}</div>`,
        html: `<div id="adviserTeamList" style="text-align:left; max-height: 300px; overflow-y:auto;">${teamButtons}</div>`,
        showConfirmButton: false,
        width: 500,
        didOpen: () => {
          const container = Swal.getPopup().querySelector('#adviserTeamList');
          container.querySelectorAll('.team-folder-btn').forEach(btn => {
            btn.addEventListener('click', () => {
              const innerTeamLabel = btn.getAttribute('data-team');
const groupMembers = allAccountsRef.current.filter(s => s.group_name === innerTeamLabel);

              const manager = groupMembers.find(m => m.user_roles === 1);
              const members = groupMembers.filter(m => m.user_roles === 2);

              MySwal.fire({
                title: `<div style='color:#3B0304;'>📁 ${innerTeamLabel}</div>`,
                html: `
                  <div style="text-align:left; padding-top: 10px;">
                    <div style="margin-bottom:8px;"><strong>👨‍💼 Manager:</strong><br/> ${manager ? `${manager.first_name} ${manager.last_name}` : 'Not found'}</div>
                    <div><strong>👥 Members:</strong><br/> ${
                      members.length > 0
                        ? members.map(m => `👤 ${m.first_name} ${m.last_name}`).join('<br/>')
                        : 'No members'
                    }</div>
                  </div>`,
                showConfirmButton: false,
                width: 500,
              });
            });
          });
        }
      });
const container = Swal.getPopup().querySelector('#adviserTeamList');

// open team folder
container.querySelectorAll('.team-folder-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-team-btn')) return; // skip if delete button
    const innerTeamLabel = btn.getAttribute('data-team');
    const groupMembers = allAccountsRef.current.filter(s => s.group_name === innerTeamLabel);

    const manager = groupMembers.find(m => m.user_roles === 1);
    const members = groupMembers.filter(m => m.user_roles === 2);

    MySwal.fire({
      title: `<div style='color:#3B0304;'>📁 ${innerTeamLabel}</div>`,
      html: `
        <div style="text-align:left; padding-top: 10px;">
          <div style="margin-bottom:8px;"><strong>👨‍💼 Manager:</strong><br/> ${manager ? `${manager.first_name} ${manager.last_name}` : 'Not found'}</div>
          <div><strong>👥 Members:</strong><br/> ${
            members.length > 0
              ? members.map(m => `👤 ${m.first_name} ${m.last_name}`).join('<br/>')
              : 'No members'
          }</div>
        </div>`,
      showConfirmButton: false,
      width: 500,
    });
  });
});

// delete team inside adviser folder
container.querySelectorAll('.delete-team-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const teamLabel = btn.getAttribute('data-team');
    const targetTeam = {
      group_name: teamLabel,
      group_number: allAccountsRef.current.find(s => s.group_name === teamLabel)?.group_number
    };
    handleDeleteFolder(targetTeam);
  });
});
    } else {
      // Single team clicked
      const groupMembers = allAccounts.filter(s => s.group_number === foundTeam.group_number);
      const manager = groupMembers.find(m => m.user_roles === 1);
      const members = groupMembers.filter(m => m.user_roles === 2);

      MySwal.fire({
        title: `<div style='color:#3B0304;'>📁 ${foundTeam.label}</div>`,
        html: `
        <div style="text-align:left; padding-top: 10px;">
          <div style="margin-bottom:8px;"><strong>👨‍💼 Manager:</strong><br/> ${manager ? `${manager.first_name} ${manager.last_name}` : 'Not found'}</div>
          <div><strong>👥 Members:</strong><br/> ${members.length > 0
            ? members.map(m => `👤 ${m.first_name} ${m.last_name}`).join('<br/>')
            : 'No members'
          }</div>
        </div>`,
        showConfirmButton: false,
        width: 500,
      });
    }
  };

  // ================================
  // Create Team
  // ================================
  const handleCreateTeam = () => {
    if (Manager.length === 0) {
      MySwal.fire("No available Manager", "All Manager are already assigned to groups.", "info");
      return;
    }

    if (students.length === 0) {
      MySwal.fire("No available students", "All students are already assigned to groups.", "info");
      return;
    }

    let selectedMembers = [];

    MySwal.fire({
      title: `<div style="color: #3B0304; font-weight: 600; display: flex; align-items: center; gap: 8px;">
        <i class="bi bi-plus-circle"></i> Create Team</div>`,
      html: `
        <div style="display: flex; gap: 20px; margin-bottom: 15px;">
          <div style="flex: 1;">
            <label style="font-weight: 600;">Project Manager</label>
            <select id="pmSelect" class="form-select">
              <option disabled selected value="">Select</option>
              ${Manager.map((a) => `<option value="${a.id}">${a.last_name}, ${a.first_name} ${a.middle_name || ''}</option>`).join('')}
            </select>
          </div>
          <div style="flex: 1;">
            <label style="font-weight: 600;">Team Name</label>
            <input id="teamName" class="form-control" placeholder="Enter team name" style="border-radius: 12px; height: 42px;" disabled />
          </div>
        </div>

        <div style="margin-bottom: 12px;">
          <label style="font-weight: 600;">Members</label>
          <select id="memberSelect" class="form-select">
            <option disabled selected>Select</option>
            ${students.map((s) => `<option value="${s.id}">${s.last_name}, ${s.first_name} ${s.middle_name || ''}</option>`).join('')}
          </select>
        </div>

        <div style="border: 1px solid #ccc; border-radius: 12px; padding: 12px; margin-top: 10px; max-height: 180px; overflow-y: auto;">
          <strong style="display: block; margin-bottom: 8px;">Members List</strong>
          <div id="memberListItems" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;"></div>
        </div>`,
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3B0304',
      cancelButtonColor: '#999',
      width: '600px',
      didOpen: () => {
        const pmSelect = Swal.getPopup().querySelector('#pmSelect');
        const teamNameInput = Swal.getPopup().querySelector('#teamName');
        const memberSelect = Swal.getPopup().querySelector('#memberSelect');
        const memberList = Swal.getPopup().querySelector('#memberListItems');

        pmSelect.addEventListener('change', () => {
          const selectedOption = pmSelect.options[pmSelect.selectedIndex];
          const lastName = selectedOption.textContent.split(',')[0].trim();
          teamNameInput.value = `${lastName}, Et Al.`;
        });

        memberSelect.addEventListener('change', () => {
          const selectedId = memberSelect.value;
          const selectedText = memberSelect.options[memberSelect.selectedIndex].text;

          if (!selectedMembers.includes(selectedId)) {
            selectedMembers.push(selectedId);

            const div = document.createElement('div');
            div.style.cssText =
              'background: #f8f8f8; border-radius: 8px; padding: 6px 10px; display: flex; align-items: center; justify-content: space-between; border: 1px solid #ddd;';
            div.innerHTML = `<span style="font-size: 14px;">${selectedText}</span><button class="btn" style="border: none; background: none; color: #3B0304; font-weight: bold; font-size: 18px; cursor: pointer;">⨉</button>`;

            div.querySelector('button').addEventListener('click', () => {
              div.remove();
              selectedMembers = selectedMembers.filter(id => id !== selectedId);
            });

            memberList.appendChild(div);
          }
        });
      },
      preConfirm: () => {
        const managerId = Swal.getPopup().querySelector('#pmSelect').value;
        const teamName = Swal.getPopup().querySelector('#teamName').value.trim();

        if (!teamName) {
          Swal.showValidationMessage('Team name is required');
          return false;
        }

        if (selectedMembers.length === 0) {
          Swal.showValidationMessage('At least one member must be selected');
          return false;
        }

        return { managerId, teamName, selectedMembers };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { managerId, teamName, selectedMembers } = result.value;

        const { data: groupData } = await supabase.from("user_credentials").select("group_number");
        const allGroups = groupData.map((s) => s.group_number).filter((g) => g !== null);
        const nextGroup = allGroups.length > 0 ? Math.max(...allGroups) + 1 : 1;

        await supabase.from("user_credentials").update({ group_number: nextGroup, group_name: teamName }).eq("id", managerId);

        for (const studentId of selectedMembers) {
          await supabase.from("user_credentials").update({ group_number: nextGroup, group_name: teamName }).eq("id", studentId);
        }

        await fetchAccounts();

        MySwal.fire({
          icon: 'success',
          title: '✓ Team folder created',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  // ================================
  // Assign Adviser
  // ================================
  const handleAssignAdviser = () => {
    let selectedTeams = [];
    const eligibleTeams = teamCards.filter(tc => !tc.adviser_group);

    MySwal.fire({
      title: '<div style="color: #3B0304; font-weight: 600; display: flex; align-items: center; gap: 8px;"><i class="bi bi-person-lines-fill"></i> Assign Adviser</div>',
      html: `
        <div style="display: flex; gap: 20px; margin-bottom: 15px;">
          <div style="flex: 1;">
            <label style="font-weight: 600;">Team's</label>
            <select id="teamSelect" class="form-select">
              <option disabled selected>Select</option>
              ${eligibleTeams.map(team => `<option value="${team.group_number}">${team.label}</option>`).join('')}
            </select>
          </div>
          <div style="flex: 1;">
            <label style="font-weight: 600;">Advisers</label>
            <select id="adviserSelect" class="form-select">
              <option disabled selected>Select</option>
              ${advisers.map((a) => {
  return `<option value="${a.id}">
    ${a.last_name}, ${a.first_name} ${a.middle_name || ''} 
    ${a.adviser_group ? `(Group ${a.adviser_group})` : ''}
  </option>`;
}).join('')}
            </select>
          </div>
        </div>
        <div style="border: 1px solid #ccc; border-radius: 12px; padding: 12px; max-height: 150px; overflow-y: auto;">
          <strong style="display: block; margin-bottom: 8px;">Selected Teams</strong>
          <div id="selectedTeamList" style="display: flex; flex-wrap: wrap; gap: 6px;"></div>
        </div>`,
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3B0304',
      cancelButtonColor: '#999',
      width: '600px',
      didOpen: () => {
        const teamSelect = Swal.getPopup().querySelector('#teamSelect');
        const listDiv = Swal.getPopup().querySelector('#selectedTeamList');

        teamSelect.addEventListener('change', () => {
          const value = teamSelect.value;
          const label = teamSelect.options[teamSelect.selectedIndex].text;
          if (!selectedTeams.includes(value)) {
            selectedTeams.push(value);
            const tag = document.createElement('div');
            tag.style.cssText = 'background:#f8f8f8; border-radius:8px; padding:4px 8px; font-size:14px; border:1px solid #ccc; display:flex; align-items:center; gap:6px;';
            tag.innerHTML = `<span>${label}</span><button style="border:none; background:none; font-size:16px; cursor:pointer;">×</button>`;
            tag.querySelector('button').addEventListener('click', () => {
              tag.remove();
              selectedTeams = selectedTeams.filter(id => id !== value);
            });
            listDiv.appendChild(tag);
          }
        });
      },
      preConfirm: () => {
        const adviserId = Swal.getPopup().querySelector('#adviserSelect').value;
        if (!adviserId) {
          Swal.showValidationMessage('Adviser must be selected');
          return false;
        }
        if (selectedTeams.length === 0) {
          Swal.showValidationMessage('At least one team must be selected');
          return false;
        }
        return { adviserId, selectedTeams };
      }
    }).then(async (result) => {
  if (result.isConfirmed) {
    const { adviserId, selectedTeams } = result.value;

    // Check kung may adviser_group na si adviser
    const { data: adviserData } = await supabase
  .from("user_credentials")
  .select("adviser_group")
  .eq("id", adviserId)
  .single();

let adviserGroupId = adviserData?.adviser_group;

if (!adviserGroupId) {
  const { data: existing } = await supabase.from("user_credentials").select("adviser_group");
  const currentGroups = existing.map(e => e.adviser_group).filter(e => e !== null);
  adviserGroupId = currentGroups.length > 0 ? Math.max(...currentGroups) + 1 : 1;

  await supabase.from("user_credentials")
    .update({ adviser_group: adviserGroupId })
    .eq("id", adviserId);
}

// assign all selected teams sa adviser_group
for (const groupId of selectedTeams) {
  await supabase.from("user_credentials")
    .update({ adviser_group: adviserGroupId })
    .eq("group_number", parseInt(groupId));
}

    await fetchAccounts();

    MySwal.fire({
      icon: 'success',
      title: '✓ Adviser assigned',
      showConfirmButton: false,
      timer: 1500,
    });
  }
});}

   return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold flex items-center gap-2 text-[#3B0304]">
          <FaUsers /> Teams
        </h1>
        <div className="flex gap-2">
          <button
            onClick={handleCreateTeam}
            className="px-4 py-2 bg-[#3B0304] text-white rounded-lg shadow hover:bg-[#5c1b1c] transition"
          >
            + Create Team
          </button>
          <button
            onClick={handleAssignAdviser}
            className="px-4 py-2 bg-[#3B0304] text-white rounded-lg shadow hover:bg-[#5c1b1c] transition"
          >
            + Assign Adviser
          </button>
        </div>
      </div>

      {/* TEAM CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {teamCards.length === 0 ? (
          <p className="text-gray-500">No teams available.</p>
        ) : (
          teamCards.map((team, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div
                className="flex items-center justify-between text-[#3B0304]"
                onClick={() => handleTeamClick({ detail: team.label })}
              >
                <div className="flex items-center gap-2">
                  <FaFolder /> <span className="font-semibold">{team.label}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFolder(team);
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Teams;