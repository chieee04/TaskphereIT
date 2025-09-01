import React from 'react';
import { FaClipboardList, FaUsers } from 'react-icons/fa';


const ManagerTask = () => {
  

  const taskCards = [
    { label: 'Title Defense', icon: <FaClipboardList size={32} color="#3B0304" /> },
    { label: 'Oral Defense', icon: <FaClipboardList size={32} color="#3B0304" /> },
    { label: 'Final Defense', icon: <FaClipboardList size={32} color="#3B0304" /> },
    { label: 'Tasks Allocation', icon: <FaUsers size={32} color="#3B0304" /> },
  ];

  return (
    <div className="container-fluid px-4 py-3">
      {/* Title */}
      <div className="d-flex align-items-center mb-2" style={{ color: '#3B0304' }}>
        <FaClipboardList className="me-2" />
        <strong>Tasks</strong>
      </div>

      {/* Line */}
      <hr
        style={{
          borderTop: '2px solid #3B0304',
          marginTop: '0',
          marginBottom: '1rem',
        }}
      />

      {/* Task Cards */}
      <div className="d-flex flex-wrap gap-3">
        {taskCards.map((task, index) => (
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
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div
              className="d-flex justify-content-center align-items-center flex-grow-1"
              style={{ paddingTop: '20px' }}
            >
              {task.icon}
            </div>
            <div
              className="text-center px-2 pb-2"
              style={{
                fontSize: '13px',
                fontWeight: '500',
                color: '#3B0304',
              }}
            >
              {task.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerTask;
