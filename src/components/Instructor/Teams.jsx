// Teams.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FaUsers, FaFolder } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { supabase } from '../../SupabaseClient';
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

  const fetchAccounts = async () => {
    const { data, error } = await supabase.from('Students').select('*');
    if (!error) {
      const grouped = data.filter((a) => a.group !== null && a.adviser_group === null);
      const groupedTeamCards = grouped.reduce((acc, member) => {
  const existing = acc.find(g => g.group === member.group);
  const manager = data.find(m => m.group === member.group && m.role === 3);
  const label = `${manager?.last_name || 'Team'}, Et Al.`;

  if (existing) {
    existing.members.push(`${member.first_name} ${member.last_name}`);
  } else {
    acc.push({
      group: member.group,
      label,
      members: [`${member.first_name} ${member.last_name}`],
      adviser_group: null
    });
  }
  return acc;
}, []);
      const adviserGroups = data.filter(d => d.adviser_group !== null).reduce((acc, row) => {
        if (!acc[row.adviser_group]) acc[row.adviser_group] = [];
        acc[row.adviser_group].push(row);
        return acc;
      }, {});

      const adviserCards = Object.values(adviserGroups).map(group => {
        const adviser = group.find(g => g.role === 2);
        const teams = [...new Set(group.filter(m => m.group !== null).map(m => `s${m.group}`))];
        const members = group.filter(m => m.role !== 2).map(m => `${m.first_name} ${m.last_name}`);
        return {
          label: `${adviser.last_name}, ${adviser.first_name} ${adviser.middle_name || ''}`,
          adviserId: adviser.id,
          adviser_group: adviser.adviser_group,
          teams,
          members,
        };
      });

      setManager(data.filter((a) => a.role === 3 && a.group === null && a.adviser_group === null));
      setStudents(data.filter((s) => s.role === 1 && s.group === null && s.adviser_group === null));
      setAdvisers(data.filter((s) => s.role === 2 && s.adviser_group === null));
      setTeamCards([...groupedTeamCards, ...adviserCards]);
      setAllAccounts(data);
      allAccountsRef.current = data;
    }
  };

  const handleTeamClick = (e) => {
    const clickedLabel = e.detail;
    const foundTeam = teamCards.find(t => t.label === clickedLabel);

    if (!foundTeam) return;

    if (foundTeam.teams && foundTeam.teams.length > 0) {
      // Adviser folder – show team folders inside
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
        gap: 8px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      ">
        <i class="bi bi-folder-fill" style="color: #3B0304; font-size: 20px;"></i>
        <span style="font-size: 14px; font-weight: 600; color: #3B0304;">${teamLabel}</span>
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
  const groupId = innerTeamLabel.replace(/[^\d]/g, '');

  console.log("GroupID:", groupId);
const groupMembers = allAccountsRef.current.filter(s => String(s.group) === groupId);

  console.log("Matching:", groupMembers);

  const manager = groupMembers.find(m => m.role === 3);
  const members = groupMembers.filter(m => m.role === 1);

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

    } else {
      // Normal single team folder clicked
      const groupMembers = allAccounts.filter(s => s.group === foundTeam.group);
      const manager = groupMembers.find(m => m.role === 3);
      const members = groupMembers.filter(m => m.role === 1);

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

        const { data: groupData } = await supabase.from("Students").select("group");
        const allGroups = groupData.map((s) => s.group).filter((g) => g !== null);
        const nextGroup = allGroups.length > 0 ? Math.max(...allGroups) + 1 : 1;

        await supabase.from("Students").update({ group: nextGroup, team_name: teamName }).eq("id", managerId);
for (const studentId of selectedMembers) {
  await supabase.from("Students").update({ group: nextGroup, team_name: teamName }).eq("id", studentId);
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
              ${eligibleTeams.map(team => `<option value="${team.group}">${team.label}</option>`).join('')}
            </select>
          </div>
          <div style="flex: 1;">
            <label style="font-weight: 600;">Advisers</label>
            <select id="adviserSelect" class="form-select">
              <option disabled selected>Select</option>
              ${advisers.map((a) => `<option value="${a.id}">${a.last_name}, ${a.first_name} ${a.middle_name || ''}</option>`).join('')}
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
        const { data: existing } = await supabase.from("Students").select("adviser_group");
        const currentGroups = existing.map(e => e.adviser_group).filter(e => e !== null);
        const nextAdviserGroup = currentGroups.length > 0 ? Math.max(...currentGroups) + 1 : 1;

        for (const groupId of selectedTeams) {
          await supabase.from("Students").update({ adviser_group: nextAdviserGroup }).eq("group", parseInt(groupId));
        }

        await supabase.from("Students").update({ adviser_group: nextAdviserGroup }).eq("id", adviserId);
        await fetchAccounts();

        MySwal.fire({
          icon: 'success',
          title: '✓ Adviser assigned',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };
  const handleDeleteTeam = async (teamIndex) => {
    const team = teamCards[teamIndex];

    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: team.teams
        ? 'This will unassign the adviser and return all teams to the regular group view.'
        : 'This will unassign all members and delete the team.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3B0304',
      cancelButtonColor: '#999',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      if (team.teams && team.adviser_group !== null) {
        // Adviser folder – unassign adviser_group
        await supabase
          .from('Students')
          .update({ adviser_group: null })
          .eq('adviser_group', team.adviser_group);
      } else if (team.group !== null) {
        // Single team – unassign group
        await supabase
          .from('Students')
          .update({ group: null })
          .eq('group', team.group);
      }

      // Reload updated data
      await fetchAccounts();

      MySwal.fire({
        icon: 'success',
        title: '✓ Folder deleted!',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  return (
    <div className="container-fluid px-4 py-3">
      <div className="d-flex align-items-center mb-2" style={{ color: '#3B0304' }}>
        <FaUsers className="me-2" />
        <strong>Teams</strong>
      </div>

      <hr style={{ borderTop: '2px solid #3B0304', marginTop: '0', marginBottom: '1rem' }} />

      <div className="d-flex gap-2">
        <button
          className="btn border"
          style={{ color: '#3B0304', borderColor: '#3B0304' }}
          onClick={handleCreateTeam}
        >
          ➕ Create Team
        </button>
        <button
          className="btn border"
          style={{ color: '#3B0304', borderColor: '#3B0304' }}
          onClick={handleAssignAdviser}
        >
          👤 Assign Adviser
        </button>
      </div>

      <div className="d-flex flex-wrap gap-3 mt-4">
        {teamCards.map((team, index) => (
          <div
            key={index}
            className="position-relative d-flex flex-column align-items-center"
            style={{
              width: '120px', height: '130px', backgroundColor: 'white', borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)', cursor: 'pointer', overflow: 'hidden',
              borderLeft: '12px solid #3B0304'
            }}
          >
            <div className="position-absolute" style={{ top: '5px', right: '5px' }}>
              <div className="dropdown">
                <button
                  className="btn btn-sm"
                  type="button"
                  id={`dropdownMenuButton-${index}`}
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-three-dots"></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby={`dropdownMenuButton-${index}`}>
                  <li>
                    <button className="dropdown-item text-danger" onClick={() => handleDeleteTeam(index)}>
                      🗑 Delete
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div
              className="d-flex justify-content-center align-items-center flex-grow-1"
              style={{ paddingTop: '20px' }}
              onClick={() => {
                if (team.teams) {
                  window.dispatchEvent(new CustomEvent('team-click', { detail: team.label }));
                } else {
                  handleTeamClick({ detail: team.label });
                }
              }}
            >
              <FaFolder size={36} color="#3B0304" />
            </div>
            <div className="text-center px-2 pb-2" style={{ fontSize: '13px', fontWeight: '500', color: '#3B0304' }}>
              {team.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Teams;
