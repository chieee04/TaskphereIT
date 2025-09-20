import { useState } from "react";
import Sidebar from "../Sidebar";
import AdviserTeamSummary from "./AdviserTeamsSummary";
// Sa Task ito ng side bar.
import AdviserTask from "./AdviserTask/AdviserTask";
import AdviserOralDef from "./AdviserTask/AdviserOralDef";
import AdviserFinalDef from "./AdviserTask/AdviserFinalDef";
// Team board
import AdviserTaskRecord from "./TaskRecord/AdviserTaskRecord";
// Task Record 
import AdviserTeamBoard from "./AdviserBoard/AdviserTeamBoard";
import AdviserOralRecord from "./TaskRecord/AdviserOralRecord";
import AdviserFinalRecord from "./TaskRecord/AdviserFinalRecord";
//Events
import AdviserEvents from "./AdviserEvents/AdviserEvents";
import AdviserManuResult from "./AdviserEvents/AdviserManuResult";
import AdviserCapsDefenses from "./AdviserEvents/AdviserCapsDefenses";

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
        return <AdviserTeamBoard />;

      case "Tasks Record":
        return <AdviserTaskRecord setActivePage={setActivePage} />;
        case "Oral Defense Record":
        return <AdviserOralRecord />;
      case "Title Defense Record":
        return <AdviserFinalRecord />;

      case "Events":
        return <AdviserEvents setActivePage={setActivePage}/>;
      case "Manucript Results":
        return <AdviserManuResult />;
      case "Capstone Defenses":
        return <AdviserCapsDefenses />;
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
// AdviserDashboard.jsx



