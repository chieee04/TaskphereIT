import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { UserAuth } from '../Contex/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(true);
    const [activeItem, setActiveItem] = useState('Dashboard'); // ✅ Pre-selected item

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const menuItems = [
        { icon: 'bi-speedometer2', label: 'Dashboard' },
        { icon: 'bi-person-plus', label: 'Enroll' },
        { icon: 'bi-person-badge', label: 'Student Credentials' },
        { icon: 'bi-person-workspace', label: 'Adviser Credentials' },
        { icon: 'bi-people', label: 'Teams' },
        { icon: 'bi-calendar-week', label: 'Schedule' },
        { icon: 'bi-arrow-left-right', label: 'Role Transfer' }
    ];

    const { session, signOut } = UserAuth();
    const navigate = useNavigate();

    const handleSignOut = async (e) => {
        e.preventDefault();
        try {
            await signOut();
            navigate("/");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div
            className="d-flex flex-column bg-light p-2 border-end vh-100"
            style={{ width: collapsed ? '70px' : '250px', transition: 'width 0.3s' }}
        >
            <button
                onClick={toggleSidebar}
                className="btn btn-sm btn-outline-secondary mb-3"
                title={collapsed ? 'Expand' : 'Collapse'}
            >
                <i className={`bi ${collapsed ? 'bi-arrow-right' : 'bi-arrow-left'}`}></i>
            </button>

            <ul className="nav nav-pills flex-column mb-auto">
                {menuItems.map((item, index) => (
                    <li className="nav-item mb-2" key={index}>
                        <a
                            href="#"
                            className={`nav-link d-flex align-items-center ${activeItem === item.label ? 'active bg-primary text-white' : 'text-dark'}`}
                            onClick={() => setActiveItem(item.label)}
                        >
                            <i className={`bi ${item.icon} me-2`} style={{ fontSize: '1.2rem' }}></i>
                            {!collapsed && <span>{item.label}</span>}
                        </a>
                    </li>
                ))}
            </ul>

            <div className="mt-auto">
                <button
                    className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
                    onClick={handleSignOut}
                >
                    <i className="bi bi-box-arrow-right"></i>
                    {!collapsed && <span className="ms-2">Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
