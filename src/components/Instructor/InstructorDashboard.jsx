import { useState } from "react";
import Sidebar from "../Sidebar";
import Teams from "./Teams";
import Schedule from "./Schedule";
import ScheduleAdmin from "./Schedule";
import StudentCredentials from "./StudentCredentials";
import AdviserCredentials from "./AdviserCredentials";
import Enroll from "./Enroll-Member";
import Adviser from "./Adviser-Enroll";
import TitleDefense from "./TitleDefense";
const InstructorDashboard = () => {

  const [activePage, setActivePage] = useState("Dashboard");

  const renderContent = () => {
    switch (activePage) {
      
        case "Students":
        return <Enroll/>;
        case "Advisers":
        return <Adviser />;
      case "Teams":
        return <Teams />;
      case "Schedule":
        return <Schedule setActivePage={setActivePage} />;
      case "Title Defense":
        return <TitleDefense />;
      case "StudentCredentials":
        return <StudentCredentials />;
      case "AdviserCredentials":
        return <AdviserCredentials />;
      default:
        return <h4 className="text-center text-muted">INSTRUCTOR DASHBOARD</h4>;
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

export default InstructorDashboard;

