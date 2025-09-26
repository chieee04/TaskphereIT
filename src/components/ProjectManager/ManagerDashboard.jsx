import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // ✅
import Sidebar from "../Sidebar";
import Tasks from "./ManagerTask/ManagerTask";
import AdviserTasks from "./ManagerAdviserTask";
import MemberTaskBoard from "../Member/MemberTaskBoard";
import MemberTaskRecord from "../Member/MemberTaskRecord";
import ManagerTitleDefense from "./ManagerTask/ManagerTitleDefense";
import ManagerOralDefense from "./ManagerTask/ManagerOralDefense";
import ManagerTaskRecord from "./ManagerTaskRecord/ManagerTaskRecord";
import ManagerTitleRecord from "./ManagerTaskRecord/ManagerTitleRecord";
import ManagerTaskBoard from "./ManagerTaskBoard/ManagerTaskBoard";
import ManagerEvents from "./ManagerEvents";
import Profile from "../Profile";
import ManagerOralRecord from "./ManagerTaskRecord/ManagerOralRecord";
import ManagerFinalDefense from "./ManagerTask/ManagerFinalDefense";

const ManagerDashboard = ({ activePageFromHeader }) => {
  const location = useLocation();

  // ✅ kunin yung galing sa navigate state
  const [activePage, setActivePage] = useState(
    location.state?.activePage || activePageFromHeader || "Dashboard"
  );

  useEffect(() => {
    if (location.state?.activePage) {
      setActivePage(location.state.activePage);
    }
  }, [location.state]);

  const renderContent = () => {
    switch (activePage) {
      case "Tasks":
        return <Tasks setActivePage={setActivePage} />;
      case "Adviser Tasks":
        return <AdviserTasks />;
      case "Tasks Board":
        return <ManagerTaskBoard />;
      case "Title Defense":
        return <ManagerTitleDefense />;
      case "Oral Defense":
        return <ManagerOralDefense />;
        case "Final Defense":
        return <ManagerFinalDefense />;
      case "Tasks Record":
        return <ManagerTaskRecord setActivePage={setActivePage} />;
      case "Title Defense Record":
        return <ManagerTitleRecord />;
      case "Oral Defense Record":
        return <ManagerOralRecord />;
        case "Events":
        return <ManagerEvents />;
      case "Profile":
        return <Profile />;
      default:
        return <h4 className="text-center text-muted">PROJECT MANAGER!!!</h4>;
    }
  };

  return (
    <div className="d-flex">
      <Sidebar activeItem={activePage} onSelect={setActivePage} />
      <div className="flex-grow-1 p-3">{renderContent()}</div>
    </div>
  );
};

export default ManagerDashboard;
