import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../Contex/AuthContext';

const Sidebar = ({ activeItem, onSelect }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showEnrollSubmenu, setShowEnrollSubmenu] = useState(false);

  const { user } = UserAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleSignOut = async (e) => {
    e.preventDefault();
    navigate('/');
  };

  const renderMenuItem = (icon, label, onClick, isActive = false) => (
    <li className="nav-item mb-1">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
        className={`nav-link d-flex align-items-center rounded ${
          isActive ? 'bg-primary text-white' : ''
        }`}
        style={{
          transition: 'all 0.2s',
          color: isActive ? '#fff' : '#3B0304',
          backgroundColor: isActive ? '' : 'transparent',
        }}
      >
        <i
          className={`bi ${icon} me-2`}
          style={{ fontSize: '1.2rem', color: isActive ? '#fff' : '#3B0304' }}
        ></i>
        {!collapsed && <span>{label}</span>}
        {!collapsed && label === 'Enroll' && (
          <i
            className={`ms-auto bi ${
              showEnrollSubmenu ? 'bi-chevron-up' : 'bi-chevron-down'
            }`}
            style={{ color: isActive ? '#fff' : '#3B0304' }}
          ></i>
        )}
      </a>
    </li>
  );

  let sidebarItems = [];

  // ✅ Role 0 → Admin Sidebar
  if (user.role === 0) {
  sidebarItems = (
    <>
      {renderMenuItem('bi-speedometer2', 'Dashboard', () => onSelect('Dashboard'), activeItem === 'Dashboard')}
      {renderMenuItem('bi-person-plus', 'Enroll', () => setShowEnrollSubmenu(!showEnrollSubmenu), activeItem === 'Enroll')}

      {!collapsed && showEnrollSubmenu && (
        <div className="ps-4">
          {renderMenuItem('bi-mortarboard', 'Students', () => onSelect('Students'), activeItem === 'Students')}
          {renderMenuItem('bi-person', 'Advisers', () => onSelect('Advisers'), activeItem === 'Advisers')}
          
        </div>
      )}
{renderMenuItem('bi-key', 'Students Credentials', () => onSelect('StudentCredentials'), activeItem === 'StudentCredentials')}
          {renderMenuItem('bi-lock', 'Advisers Credentials', () => onSelect('AdviserCredentials'), activeItem === 'AdviserCredentials')}
      {renderMenuItem('bi-people', 'Teams', () => onSelect('Teams'), activeItem === 'Teams')}
      {renderMenuItem('bi-calendar-week', 'Schedule', () => onSelect('Schedule'), activeItem === 'Schedule')}
      {renderMenuItem('bi-arrow-left-right', 'Role Transfer', () => onSelect('Role Transfer'), activeItem === 'Role Transfer')}
    </>
  );
}





  // ✅ Role 1 → return null
    else if (user.role === 1) {
  sidebarItems = (
    <>
      {renderMenuItem('bi-speedometer2', 'Dashboard', () => onSelect('Dashboard'), activeItem === 'Dashboard')}
      {renderMenuItem('bi-diagram-3', 'Tasks Allocation', () => onSelect('Tasks Allocation'), activeItem === 'Tasks Allocation')}
      {renderMenuItem('bi-list-task', 'Tasks', () => onSelect('Tasks'), activeItem === 'Tasks')}
      {renderMenuItem('bi-person-check', 'Adviser Tasks', () => onSelect('Adviser Tasks'), activeItem === 'Adviser Tasks')}
      {renderMenuItem('bi-kanban', 'Tasks Board', () => onSelect('Tasks Board'), activeItem === 'Tasks Board')}
      {renderMenuItem('bi-journal-text', 'Tasks Record', () => onSelect('Tasks Record'), activeItem === 'Tasks Record')}
      {renderMenuItem('bi-calendar-event', 'Events', () => onSelect('Events'), activeItem === 'Events')}
    </>
  );
}
  
  
  // ✅ Role 3 → Manager Sidebar
  else if (user.role === 3) {
    sidebarItems = (
      <>
        {renderMenuItem('bi-speedometer2', 'Dashboard', () => onSelect('Dashboard'), activeItem === 'Dashboard')}
        {renderMenuItem('bi-list-task', 'Tasks', () => onSelect('Tasks'), activeItem === 'Tasks')}
        {renderMenuItem('bi-person-check', 'Adviser Tasks', () => onSelect('Adviser Tasks'), activeItem === 'Adviser Tasks')}
        {renderMenuItem('bi-kanban', 'Tasks Board', () => onSelect('Tasks Board'), activeItem === 'Tasks Board')}
        {renderMenuItem('bi-journal-text', 'Tasks Record', () => onSelect('Tasks Record'), activeItem === 'Tasks Record')}
        {renderMenuItem('bi-calendar-event', 'Events', () => onSelect('Events'), activeItem === 'Events')}
      </>
    );
  } else {
    return null;
  }

  return (
    <div
      className="d-flex flex-column bg-light p-2 vh-100"
      style={{
        width: collapsed ? '70px' : '250px',
        transition: 'width 0.3s',
      }}
    >
      <button
        onClick={toggleSidebar}
        className="btn btn-sm btn-outline-secondary mb-3 align-self-end"
        title={collapsed ? 'Expand' : 'Collapse'}
      >
        <i className={`bi ${collapsed ? 'bi-chevron-double-right' : 'bi-chevron-double-left'}`} />
      </button>

      <ul className="nav nav-pills flex-column mb-auto">
        {sidebarItems}
      </ul>

      <div className="mt-auto">
        <button
          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
          onClick={handleSignOut}
        >
          <i className="bi bi-box-arrow-right"></i>
          {!collapsed && <span className="ms-2">Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
