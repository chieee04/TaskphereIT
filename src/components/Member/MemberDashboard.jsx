import { useState } from "react";
import Sidebar from "../Sidebar";
import MemberAllocation from "./MemberAllocation";
import MemberTask from "./MemberTask";
import MemberAdviserTasks from "./MemberAdviserTasks";
import MemberTaskBoard from "./MemberTaskBoard";
import MemberTasksRecord from "./MemberTaskRecord";
import MemberEvents from "./MemberEvents";

const MemberDashboard = () => {
  const [activePage, setActivePage] = useState("Dashboard");

  const renderContent = () => {
    switch (activePage) {
      case "Tasks Allocation":
        return <MemberAllocation />;
        case "Tasks":
        return <MemberTask />;
      case "Adviser Tasks":
        return <MemberAdviserTasks />;
      case "Schedule":
        return <Schedule setActivePage={setActivePage} />;
      case "Tasks Board":
        return <MemberTaskBoard />;
      case "Tasks Record":
        return <MemberTasksRecord />;
        case "Events":
        return <MemberEvents />;
      default:
        return <h4 className="text-center text-muted">MEMBER DASHBOARD</h4>;
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

export default MemberDashboard;
