import { useState } from "react";
import Sidebar from "../Sidebar";
import Tasks from "./ManagerTask/ManagerTask"
import AdviserTasks from "./ManagerAdviserTask"
import MemberTaskBoard from "../Member/MemberTaskBoard";
import MemberTaskRecord from "../Member/MemberTaskRecord";
const ManagerDashboard = () => {
  const [activePage, setActivePage] = useState("Dashboard");

  const renderContent = () => {
    switch (activePage) {
      case "Tasks":
        return <Tasks />;
        case "Adviser Tasks":
        return <AdviserTasks />;
      case "Tasks Board":
        return <MemberTaskBoard />;
      case "Tasks Record":
        return <MemberTaskRecord />;
      case "StudentCredentials":
        return <StudentCredentials />;
      default:
        return <h4 className="text-center text-muted">PROJECT MANAGER!!!</h4>;
    }
  };
  return (
    <div className="d-flex">
      <Sidebar activeItem={activePage} onSelect={setActivePage} />
      <div className="flex-grow-1 p-3">
        {renderContent()}
      </div>
    </div>
  );
};

export default ManagerDashboard;

