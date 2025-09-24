import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../Sidebar";
import MemberAllocation from "./MemberAllocation";
import MemberTask from "./MemberTask";
import MemberAdviserTasks from "./MemberAdviserTasks";
import MemberTaskBoard from "./MemberTaskBoard";
import MemberTasksRecord from "./MemberTaskRecord";
import MemberEvents from "./MemberEvents";
import Profile from "../Profile";
//import Schedule from "./Schedule"; // ✅ add missing import

const MemberDashboard = () => {
  const location = useLocation();

  // ✅ kunin initial page (galing sa Header o localStorage)
  const initialPage =
    location.state?.activePage ||
    localStorage.getItem("activePage") ||
    "Dashboard";

  const [activePage, setActivePage] = useState(initialPage);

  useEffect(() => {
    if (location.state?.activePage) {
      setActivePage(location.state.activePage);
    }
  }, [location.state]);

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
      case "Profile": // ✅ dagdag
        return <Profile />;
      default:
        return <h4 className="text-center text-muted">MEMBER DASHBOARD</h4>;
    }
  };

  return (
    <div className="d-flex">
      <Sidebar activeItem={activePage} onSelect={setActivePage} />
      <div className="flex-grow-1 p-3">{renderContent()}</div>
    </div>
  );
};

export default MemberDashboard;
