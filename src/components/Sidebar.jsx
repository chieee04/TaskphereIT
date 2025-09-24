// ✅ Sidebar.jsx
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../Contex/AuthContext';
import { supabase } from '../supabaseClient';
import './Style/Sidebar.css'; 

const Sidebar = ({ activeItem, onSelect }) => {
  // 🔹 Collapse/expand toggle
  const [collapsed, setCollapsed] = useState(false);

  // 🔹 Submenu for Enroll (Admin only)
  const [showEnrollSubmenu, setShowEnrollSubmenu] = useState(false);

  // 🔹 Role state
  //    0 = Admin (Supabase Auth)
  //    1 = Manager (table user_roles = 1)
  //    2 = Member  (table user_roles = 2)
  const [user_roles, setuser_roles] = useState(null);

  // 🔹 Current logged in user
  //    Admin → galing sa Supabase Auth
  //    Manager/Member → galing sa custom table login
  const { user } = UserAuth();
  const navigate = useNavigate();

  // ============================================================
  // 🔑 Determine role of the current user
  // ============================================================
  useEffect(() => {
  const fetchRole = async () => {
    // Case 1: Admin via Supabase Auth
    if (user?.email) {
      console.log("✅ Admin detected:", user.email);
      setuser_roles(0); // Role 0 = Admin
      return;
    }

    // Case 2: Table-based users (Manager/Member)
    const customUser = JSON.parse(localStorage.getItem("customUser"));
    console.log("📌 customUser from localStorage:", customUser);

    if (customUser?.user_roles) {
      // Diretso na gamitin yung role na naka-save
      setuser_roles(customUser.user_roles);
      return;
    }
  };

  fetchRole();
}, [user]);



  // ============================================================
  // 🔑 Sign Out
  // ============================================================
  const { logout } = UserAuth();

const handleSignOut = async (e) => {
  e.preventDefault();
  await logout(); // ✅ ito magse-set ng user=null at clear lahat ng storage
  navigate("/");
};


  // ============================================================
  // 🔹 Helper: Render menu item
  // ============================================================
  const renderMenuItem = (icon, label, onClick, isActive = false) => (
    <li className="nav-item mb-1">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
        className={`nav-link ${isActive ? 'active' : ''}`}
      >
        <i className={`bi ${icon} me-2`} />
        {!collapsed && <span>{label}</span>}
        {!collapsed && label === 'Enroll' && (
          <i
            className={`ms-auto bi ${
              showEnrollSubmenu ? 'bi-chevron-up' : 'bi-chevron-down'
            }`}
          />
        )}
      </a>
    </li>
  );

  // ============================================================
  // 🔹 Sidebar items depende sa role
  // ============================================================
  let sidebarItems;

  // ✅ Admin (Supabase Auth, role = 0)
  if (user_roles === 0) {
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

  // ✅ Manager (table, user_roles = 1)
  else if (user_roles === 1) {
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
  }
  else if (user_roles === 3) {
  sidebarItems = (
    <>
      {renderMenuItem(
        'bi-speedometer2',
        'Dashboard',
        () => onSelect('Dashboard'),
        activeItem === 'Dashboard'
      )}
      {renderMenuItem(
        'bi-people',
        'Teams Summary',
        () => onSelect('Teams Summary'),
        activeItem === 'Teams Summary'
      )}
      {renderMenuItem(
        'bi-list-task',
        'Tasks',
        () => onSelect('Tasks'),
        activeItem === 'Tasks'
      )}
      {renderMenuItem(
        'bi-kanban',
        'Teams Board',
        () => onSelect('Teams Board'),
        activeItem === 'Teams Board'
      )}
      {renderMenuItem(
        'bi-journal-text',
        'Tasks Record',
        () => onSelect('Tasks Record'),
        activeItem === 'Tasks Record'
      )}
      {renderMenuItem(
        'bi-calendar-event',
        'Events',
        () => onSelect('Events'),
        activeItem === 'Events'
      )}
    </>
  );
}

  // ✅ Member (table, user_roles = 2)
  else if (user_roles === 2) {
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

  // ❌ No role detected → hide sidebar
  else {
    return null;
  }

  // ============================================================
  // 🔹 Final render
  // ============================================================
  return (
    <div className={`sidebar ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
      {/* Collapse/Expand button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="btn btn-sm btn-outline-secondary sidebar-toggle"
        title={collapsed ? 'Expand' : 'Collapse'}
      >
        <i className={`bi ${collapsed ? 'bi-chevron-double-right' : 'bi-chevron-double-left'}`} />
      </button>

      {/* Menu items */}
      <ul className="nav nav-pills flex-column mb-auto">{sidebarItems}</ul>

      {/* Sign Out */}
      <div className="mt-auto">
        <button
          className="btn btn-outline-danger d-flex align-items-center justify-content-center sidebar-signout"
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
