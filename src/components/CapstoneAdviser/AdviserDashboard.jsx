import { useState } from "react";
import Sidebar from "../Sidebar";
import AdviserTeamSummary from "./AdviserTeamsSummary";
import AdviserTask from "./AdviserTask/AdviserTask";
import AdviserOralDef from "./AdviserTask/AdviserOralDef";
import AdviserFinalDef from "./AdviserTask/AdviserFinalDef";

import AdviserTeamBoard from "./AdviserBoard/AdviserTeamBoard";
const AdviserDashboard = () => {

  const [activePage, setActivePage] = useState("Dashboard");

  const renderContent = () => {
    switch (activePage) {
      
        case "Teams Summary":
        return <AdviserTeamSummary/>;
        case "Tasks":
        return <AdviserTask setActivePage={setActivePage}/>;
      case "Oral Defense":
        return <AdviserOralDef />;
        case "Final Defense":
        return <AdviserFinalDef />;
      case "Teams Board":
        return <AdviserTeamBoard setActivePage={setActivePage} />;
      case "Title Defense":
        return <TitleDefense />;
      case "ManuScript":
        return <ManuScript />;
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

export default AdviserDashboard;

