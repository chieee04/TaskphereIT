import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../Sidebar";

// Pages
import Tasks from "./ManagerTask/ManagerTask";
import AdviserTasks from "./ManagerAdviserTask";
import MemberTaskBoard from "../Member/MemberTaskBoard";
import MemberTaskRecord from "../Member/MemberTaskRecord";
import ManagerTitleDefense from "./ManagerTask/ManagerTitleDefense";
import ManagerOralDefense from "./ManagerTask/ManagerOralDefense";
import ManagerFinalDefense from "./ManagerTask/ManagerFinalDefense";
import ManagerTaskRecord from "./ManagerTaskRecord/ManagerTaskRecord";
import ManagerTitleRecord from "./ManagerTaskRecord/ManagerTitleRecord";
import ManagerOralRecord from "./ManagerTaskRecord/ManagerOralRecord";
import ManagerTaskBoard from "./ManagerTaskBoard/ManagerTaskBoard";
import ManagerEvents from "./ManagerEvents";
import Profile from "../Profile";

const ManagerDashboard = ({ activePageFromHeader }) => {
  const location = useLocation();

  // ✅ Kunin yung galing sa navigate state o header
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
        // === Static dashboard view (from your design snippet) ===
        return (
          <div className="dashboard-content">
            <style>{`
              /* ====== Layout ====== */
              .dashboard-content { padding: 1rem; flex-grow: 1; font-family: Arial, sans-serif; }
              h4 { color:#5b0a0a; margin-bottom:1rem; }

              /* ====== Upcoming Tasks ====== */
              .upcoming-tasks { display:flex; flex-wrap:wrap; gap:1rem; margin-bottom:2rem; }
              .task-card { flex:1 1 150px; background:#fff; border-radius:12px; box-shadow:0 2px 6px rgba(0,0,0,0.15); padding:1rem; text-align:center; position:relative; }
              .task-card h5 { margin:0; font-weight:bold; }
              .task-card p { margin:.3rem 0; font-size:.9rem; }
              .task-card:nth-child(1){border-top:40px solid #4a772f;}
              .task-card:nth-child(2){border-top:40px solid #f0a500;}
              .task-card:nth-child(3){border-top:40px solid #2f6fb1;}
              .task-card:nth-child(4){border-top:40px solid #4a772f;}
              .task-card:nth-child(5){border-top:40px solid #7c9b32;}

              /* ====== Summary & Progress ====== */
              .summary-progress { display:flex; gap:2rem; margin-bottom:2rem; }
              .weekly-summary, .team-progress { flex:1; background:#fff; border-radius:12px; box-shadow:0 2px 6px rgba(0,0,0,0.15); padding:1rem; text-align:center; }
              .bar-chart { display:flex; justify-content:space-around; align-items:flex-end; height:200px; margin-top:1rem; }
              .bar { width:30px; border-radius:4px 4px 0 0; }
              .bar.todo { background:#f4c542; height:40px; }
              .bar.inprogress { background:#6bbf59; height:90px; }
              .bar.toreview { background:#3a8edb; height:150px; }
              .bar.completed { background:#9c59d1; height:180px; }
              .bar.missed { background:#e74c3c; height:20px; }
              .legend {display:flex; justify-content:center; gap:1rem; margin-top:1rem; font-size:.9rem;}
              .legend span {display:flex; align-items:center; gap:.3rem;}
              .legend-box {width:12px; height:12px; display:inline-block;}
              .donut-chart { width:180px; height:180px; border-radius:50%; background:conic-gradient(#3a8edb 0 20%, #f4c542 20% 40%, #6bbf59 40% 60%, #9c59d1 60% 90%, #e74c3c 90% 100%); margin:1rem auto; display:flex; justify-content:center; align-items:center; }
              .donut-chart span { background:#fff; border-radius:50%; width:100px; height:100px; line-height:100px; text-align:center; font-weight:bold; font-size:1.5rem; }

              /* ====== Recent Tasks & Calendar ====== */
              .recent-calendar { display:flex; gap:2rem; margin-top:2rem; }
              .recent-tasks, .calendar { flex:1; background:#fff; border-radius:12px; box-shadow:0 2px 6px rgba(0,0,0,0.15); padding:1rem; }
              .recent-tasks table { width:100%; border-collapse:collapse; }
              .recent-tasks th, .recent-tasks td { padding:0.5rem; border-bottom:1px solid #ddd; text-align:left; font-size:.9rem; }
              .status { padding:.2rem .6rem; border-radius:20px; color:#fff; font-size:.8rem; text-align:center; display:inline-block; }
              .status.review { background:#3a8edb; }
              .status.inprogress { background:#6bbf59; }
              .status.todo { background:#f4c542; color:#000; }
              .calendar table { width:100%; text-align:center; margin-top:1rem; border-collapse:collapse; }
              .calendar th {color:#5b0a0a; padding:.3rem;}
              .calendar td {padding:.5rem; border-radius:50%;}
              .calendar td.highlight {background:#5b0a0a; color:#fff;}
            `}</style>

            {/* ==== UPCOMING TASKS ==== */}
            <h4>UPCOMING TASKS</h4>
            <div className="upcoming-tasks">
              {[{name:"Mendoza, Et Al",chapter:"3",date:"Feb 5, 2025",time:"8:00 AM"},
                {name:"Addrialene M",chapter:"2",date:"Feb 2, 2025",time:"8:00 AM"},
                {name:"Harzwel L",chapter:"3",date:"Feb 5, 2025",time:"8:00 AM"},
                {name:"Julliana C",chapter:"3",date:"Feb 5, 2025",time:"8:00 AM"},
                {name:"Alejandro F",chapter:"3",date:"Feb 5, 2025",time:"8:00 AM"}].map((t,i)=>(
                <div key={i} className="task-card">
                  <h5>{t.name}</h5>
                  <p>Chapter {t.chapter}</p>
                  <p>{t.date}</p>
                  <p>{t.time}</p>
                </div>
              ))}
            </div>

            {/* ==== WEEKLY SUMMARY & TEAM PROGRESS ==== */}
            <div className="summary-progress">
              <div className="weekly-summary">
                <h4>WEEKLY SUMMARY</h4>
                <div className="bar-chart">
                  <div className="bar todo"></div>
                  <div className="bar inprogress"></div>
                  <div className="bar toreview"></div>
                  <div className="bar completed"></div>
                  <div className="bar missed"></div>
                </div>
                <div className="legend">
                  <span><span className="legend-box" style={{background:"#f4c542"}}></span>To Do</span>
                  <span><span className="legend-box" style={{background:"#6bbf59"}}></span>In Progress</span>
                  <span><span className="legend-box" style={{background:"#3a8edb"}}></span>To Review</span>
                  <span><span className="legend-box" style={{background:"#9c59d1"}}></span>Completed</span>
                  <span><span className="legend-box" style={{background:"#e74c3c"}}></span>Missed</span>
                </div>
              </div>
              <div className="team-progress">
                <h4>TEAM PROGRESS</h4>
                <div className="donut-chart"><span>40%</span></div>
                <div className="legend">
                  <span><span className="legend-box" style={{background:"#f4c542"}}></span>To Do</span>
                  <span><span className="legend-box" style={{background:"#6bbf59"}}></span>In Progress</span>
                  <span><span className="legend-box" style={{background:"#3a8edb"}}></span>To Review</span>
                  <span><span className="legend-box" style={{background:"#9c59d1"}}></span>Completed</span>
                  <span><span className="legend-box" style={{background:"#e74c3c"}}></span>Missed</span>
                </div>
              </div>
            </div>

            {/* ==== RECENT TASKS & CALENDAR ==== */}
            <div className="recent-calendar">
              <div className="recent-tasks">
                <h4>RECENT TASKS CREATED</h4>
                <table>
                  <thead>
                    <tr>
                      <th>No</th><th>Assigned</th><th>Task</th><th>Subtask</th>
                      <th>Element</th><th>Date Created</th><th>Due Date</th>
                      <th>Time</th><th>Project Phase</th><th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1.</td><td>Julliana C</td><td>Chapter 3</td><td>Developments</td>
                      <td>Peopleware</td><td>Feb 4, 2025</td><td>Feb 7, 2025</td><td>8:30 AM</td>
                      <td>Analysis</td><td><span className="status review">To Review</span></td>
                    </tr>
                    <tr>
                      <td>2.</td><td>John Reagan S</td><td>Chapter 3</td><td>Implementation</td>
                      <td>Hardware</td><td>Feb 7, 2025</td><td>Feb 11, 2025</td><td>11:50 AM</td>
                      <td>Analysis</td><td><span className="status inprogress">In Progress</span></td>
                    </tr>
                    <tr>
                      <td>3.</td><td>Justine P</td><td>Chapter 3</td><td>Implementation</td><td>Software</td>
                      <td>Feb 11, 2025</td><td>Feb 13, 2025</td><td>10:00 AM</td>
                      <td>Analysis</td><td><span className="status todo">To Do</span></td>
                    </tr>
                    <tr>
                      <td>4.</td><td>Addrialene G</td><td>Chapter 3</td><td>Implementation</td><td>Peopleware</td>
                      <td>Feb 12, 2025</td><td>Feb 15, 2025</td><td>11:00 AM</td>
                      <td>Analysis</td><td><span className="status todo">To Do</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="calendar">
                <h4>CALENDAR</h4>
                <table>
                  <thead>
                    <tr><th colSpan="7">January 2025</th></tr>
                    <tr><th>S</th><th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th></tr>
                  </thead>
                  <tbody>
                    <tr><td></td><td></td><td></td><td>1</td><td>2</td><td>3</td><td>4</td></tr>
                    <tr><td>5</td><td>6</td><td>7</td><td className="highlight">8</td><td>9</td><td>10</td><td>11</td></tr>
                    <tr><td>12</td><td>13</td><td>14</td><td className="highlight">15</td><td>16</td><td>17</td><td>18</td></tr>
                    <tr><td>19</td><td>20</td><td>21</td><td>22</td><td>23</td><td>24</td><td>25</td></tr>
                    <tr><td>26</td><td>27</td><td>28</td><td>29</td><td>30</td><td>31</td><td></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
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
