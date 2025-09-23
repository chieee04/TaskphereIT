import { useState } from "react";
import Sidebar from "../Sidebar";
import Tasks from "./ManagerTask/ManagerTask"
import AdviserTasks from "./ManagerAdviserTask"
import MemberTaskBoard from "../Member/MemberTaskBoard";
import MemberTaskRecord from "../Member/MemberTaskRecord";
import ManagerTitleDefense from "./ManagerTask/ManagerTitleDefense";
import ManagerOralDefense from "./ManagerTask/ManagerOralDefense";
import ManagerTaskRecord from "./ManagerTaskRecord/ManagerTaskRecord";
import ManagerTitleRecord from "./ManagerTaskRecord/ManagerTitleRecord";
import ManagerTaskBoard from "./ManagerTaskBoard/ManagerTaskBoard";
import ManagerEvents from "./ManagerEvents";
ManagerTitleRecord
const ManagerDashboard = () => {
  const [activePage, setActivePage] = useState("Dashboard");

  const renderContent = () => {
    switch (activePage) {
      case "Tasks":
        return <Tasks setActivePage={setActivePage}/>;
case "Adviser Tasks":
        return <AdviserTasks />;
        case "Tasks Board":
        return <ManagerTaskBoard />;
      case "Title Defense":
        return <ManagerTitleDefense />;
      case "Oral Defense":
        return <ManagerOralDefense />;
      case "Tasks Record":
        return <ManagerTaskRecord setActivePage={setActivePage}/>;
      case "Title Defense Record":
        return <ManagerTitleRecord />;
        case "Events":
        return <ManagerEvents />;
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

