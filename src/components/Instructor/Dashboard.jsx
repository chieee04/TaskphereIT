import React, { useState } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import Sidebar from '../Sidebar';
import Enroll from './Enroll-Student';
import Teams from './Teams';
import Advisers from './Adviser-Enroll';


const Dashboard = () => {
  const [activePage, setActivePage] = useState('Dashboard'); // preselect Dashboard

  return (
    <div className="d-flex flex-column vh-100">
      <Header />
      <div className="d-flex flex-grow-1">
        <Sidebar activeItem={activePage} onSelect={setActivePage} />
        <div className="flex-grow-1 p-3 overflow-auto">
          {activePage === 'Dashboard' && (
            <div>
              {/* Empty or Welcome content for Dashboard */}
              <h4>Welcome to the Dashboard!</h4>
              <p>Select a menu item to get started.</p>
            </div>
          )}
          {activePage === 'Students' && <Enroll/>}
          {activePage === 'Advisers' && <Advisers/>}
          {activePage === 'Teams' && <Teams/>}

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
