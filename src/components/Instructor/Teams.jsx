import React, { useState, useEffect } from 'react';
import { FaUsers, FaFolder } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { supabase } from '../../SupabaseClient';

const MySwal = withReactContent(Swal);

const Teams = () => {
  const [advisers, setAdvisers] = useState([]);
  const [students, setStudents] = useState([]);
  const [teamCards, setTeamCards] = useState([]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    const { data, error } = await supabase.from('Students').select('*');
    if (!error) {
      setAdvisers(data.filter((a) => a.role === 2));
      setStudents(data.filter((s) => s.role === 1));
    }
  };

  const handleCreateTeam = () => {
    let selectedMembers = [];

    MySwal.fire({
      title: `
        <div style="color: #3B0304; font-weight: 600; display: flex; align-items: center; gap: 8px;">
          <i class="bi bi-plus-circle"></i> Create Team
        </div>
      `,
      html: `
        <div style="display: flex; gap: 20px; margin-bottom: 15px;">
          <div style="flex: 1;">
            <label style="font-weight: 600;">Project Manager</label>
            <select id="pmSelect" class="form-select" style="
              border-radius: 12px;
              padding: 10px 40px 10px 12px;
              appearance: none;
              font-size: 15px;
              background: url('data:image/svg+xml;utf8,<svg fill='%233B0304' height='16' viewBox='0 0 24 24' width='16' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>') no-repeat right 12px center;
              background-size: 16px 16px;
              border: 1px solid #ccc;
            ">
              ${advisers.map((a) => `
                <option value="${a.id}">${a.last_name}, ${a.first_name} ${a.middle_name || ''}</option>
              `).join('')}
            </select>
          </div>
          <div style="flex: 1;">
            <label style="font-weight: 600;">Team Name</label>
            <input id="teamName" class="form-control" placeholder="Enter team name" style="
              border-radius: 12px;
              height: 42px;
              font-size: 15px;
              padding-left: 12px;
              border: 1px solid #ccc;
            " />
          </div>
        </div>

        <div style="margin-bottom: 12px;">
          <label style="font-weight: 600;">Members</label>
          <select id="memberSelect" class="form-select" style="
            border-radius: 12px;
            padding: 10px 40px 10px 12px;
            appearance: none;
            font-size: 15px;
            background: url('data:image/svg+xml;utf8,<svg fill='%233B0304' height='16' viewBox='0 0 24 24' width='16' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>') no-repeat right 12px center;
            background-size: 16px 16px;
            border: 1px solid #ccc;
          ">
            <option disabled selected>Select</option>
            ${students.map((s) => `
              <option value="${s.id}">${s.last_name}, ${s.first_name} ${s.middle_name || ''}</option>
            `).join('')}
          </select>
        </div>

        <div style="border: 1px solid #ccc; border-radius: 12px; padding: 12px; margin-top: 10px; max-height: 180px; overflow-y: auto;">
          <strong style="display: block; margin-bottom: 8px;">Members List</strong>
          <div id="memberListItems" style="
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 6px;
          "></div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3B0304',
      cancelButtonColor: '#999',
      width: '600px',
      didOpen: () => {
        const memberSelect = Swal.getPopup().querySelector('#memberSelect');
        const memberList = Swal.getPopup().querySelector('#memberListItems');

        memberSelect.addEventListener('change', () => {
          const selectedId = memberSelect.value;
          const selectedText = memberSelect.options[memberSelect.selectedIndex].text;

          if (!selectedMembers.includes(selectedId)) {
            selectedMembers.push(selectedId);

            const div = document.createElement('div');
            div.style.cssText = `
              background: #f8f8f8;
              border-radius: 8px;
              padding: 6px 10px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              border: 1px solid #ddd;
            `;

            div.innerHTML = `
              <span style="font-size: 14px;">${selectedText}</span>
              <button class="btn" style="
                border: none;
                background: none;
                color: #3B0304;
                font-weight: bold;
                font-size: 18px;
                cursor: pointer;
                border-radius: 50%;
                line-height: 1;
              ">⨉</button>
            `;

            div.querySelector('button').addEventListener('click', () => {
              div.remove();
              selectedMembers = selectedMembers.filter((id) => id !== selectedId);
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
    }).then((result) => {
      if (result.isConfirmed) {
        const { teamName, selectedMembers } = result.value;

        const memberNames = selectedMembers.map(id => {
          const s = students.find(st => st.id === id);
          return `${s?.last_name}, ${s?.first_name} ${s?.middle_name || ''}`;
        });

        setTeamCards(prev => [...prev, {
          label: teamName,
          members: memberNames
        }]);

        Swal.fire({
          icon: 'success',
          title: '✓ Team folder created',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  };

  return (
    <div className="container-fluid px-4 py-3">
      {/* Title */}
      <div className="d-flex align-items-center mb-2" style={{ color: '#3B0304' }}>
        <FaUsers className="me-2" />
        <strong>Teams</strong>
      </div>

      {/* Line */}
      <hr style={{ borderTop: '2px solid #3B0304', marginTop: '0', marginBottom: '1rem' }} />

      {/* Buttons */}
      <div className="d-flex gap-2">
        <button
          className="btn border"
          style={{ color: '#3B0304', borderColor: '#3B0304' }}
          onClick={handleCreateTeam}
        >
          ➕ Create Team
        </button>
        <button className="btn border" style={{ color: '#3B0304', borderColor: '#3B0304' }}>
          👤 Assign Adviser
        </button>
      </div>

      {/* Folder Cards */}
      <div className="d-flex flex-wrap gap-3 mt-4">
        {teamCards.map((team, index) => (
          <div
            key={index}
            className="d-flex flex-column align-items-center"
            style={{
              width: '120px',
              height: '130px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              overflow: 'hidden',
              borderLeft: '12px solid #3B0304',
            }}
            onClick={() => {
              MySwal.fire({
                title: `<div style="color:#3B0304;"><i class='bi bi-people'></i> ${team.label}</div>`,
                html: `
                  <div style="text-align:left; padding-top: 10px;">
                    ${team.members.map((name, i) => `
                      <div style="padding: 6px 0; border-bottom: 1px solid #ddd;">👤 ${name}</div>
                    `).join('')}
                  </div>
                `,
                showConfirmButton: false,
                width: 500
              });
            }}
          >
            <div className="d-flex justify-content-center align-items-center flex-grow-1" style={{ paddingTop: '20px' }}>
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
