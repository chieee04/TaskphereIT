import { useState, useEffect, useMemo } from "react";
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
import ManagerAllocation from "./ManagerTask/ManagerAllocation";

// Import the new CSS file
import "../Style/ProjectManager/ManagerDB.css";
import { supabase } from "../../supabaseClient";

const MONTH_NAMES = [
"January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];

const getDaysInMonth = (year, month) => {
return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year, month) => {
return new Date(year, month, 1).getDay();
};

const ManagerDashboard = ({ activePageFromHeader }) => {
const location = useLocation();

const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1));
const [activePage, setActivePage] = useState(
location.state?.activePage || activePageFromHeader || "Dashboard"
);
const [upcomingTasks, setUpcomingTasks] = useState([]);

useEffect(() => {
if (location.state?.activePage) {
setActivePage(location.state.activePage);
}
}, [location.state]);

// 🔹 Fetch Upcoming Tasks
useEffect(() => {
const fetchUpcomingTasks = async () => {
const storedUser = localStorage.getItem("customUser");
if (!storedUser) return;

  const currentUser = JSON.parse(storedUser);

  // 1️⃣ Hanapin ang user record
  const { data: userData, error: userError } = await supabase
    .from("user_credentials")
    .select("id, group_name")
    .eq("user_id", currentUser.user_id)
    .single();

  if (userError || !userData) return;

  // 2️⃣ Hanapin manager ng group na iyon
  const { data: manager, error: managerError } = await supabase
    .from("user_credentials")
    .select("id")
    .eq("group_name", userData.group_name)
    .eq("user_roles", 1) // Manager role
    .single();

  if (managerError || !manager) return;

  const managerId = manager.id;

  // 3️⃣ Kunin lahat ng tasks mula sa tatlong tables
  let allData = [];
  const tables = ["manager_title_task", "manager_oral_task", "manager_final_task"];

  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select("id, task, due_date, time, member_id, status")
      .eq("manager_id", managerId);

    if (!error && data) {
      allData = [...allData, ...data];
    }
  }

  // 4️⃣ Filter tasks with valid due_date at mas malapit sa ngayon
  const today = new Date();
  const upcoming = allData
    .filter(task => task.due_date)
    .map(task => ({
      ...task,
      dueDateObj: new Date(task.due_date + " " + (task.time || "00:00")),
    }))
    .filter(task => task.dueDateObj >= today)
    .sort((a, b) => a.dueDateObj - b.dueDateObj)
    .slice(0, 5);

  // 5️⃣ Kunin pangalan ng members
  const withNames = await Promise.all(
    upcoming.map(async (task) => {
      if (!task.member_id) return { ...task, memberName: "No Member" };

      const { data: member, error: memberError } = await supabase
        .from("user_credentials")
        .select("first_name, last_name")
        .eq("id", task.member_id)
        .single();

      if (memberError || !member) {
        return { ...task, memberName: "Unknown" };
      }

      return {
        ...task,
        memberName: `${member.first_name} ${member.last_name}`,
      };
    })
  );

  setUpcomingTasks(withNames);
};

fetchUpcomingTasks();

}, []);

const year = currentDate.getFullYear();
const month = currentDate.getMonth();
const daysInMonth = getDaysInMonth(year, month);
const firstDay = getFirstDayOfMonth(year, month);

const isJan2025 = year === 2025 && month === 0;
const activeDays = {
filled: [8, 11, 15],
bordered: [5, 17]
};

const handleMonthChange = (e) => {
const [newMonthIndex, newYear] = e.target.value.split("-").map(Number);
setCurrentDate(new Date(newYear, newMonthIndex));
};

const handleNav = (direction) => {
const newMonth = month + direction;
setCurrentDate(new Date(year, newMonth, 1));
};

const calendarGrid = useMemo(() => {
const totalCells = 42;
const days = [];

for (let i = 0; i < firstDay; i++) {
  days.push(null);
}

for (let day = 1; day <= daysInMonth; day++) {
  let type = "normal";
  if (isJan2025) {
    if (activeDays.filled.includes(day)) {
      type = "filled";
    } else if (activeDays.bordered.includes(day)) {
      type = "bordered";
    }
  }
  days.push({ day, type });
}

while (days.length % 7 !== 0 && days.length < totalCells) {
  days.push(null);
}

const grid = [];
for (let i = 0; i < days.length; i += 7) {
  grid.push(days.slice(i, i + 7));
}

return grid;

}, [year, month, daysInMonth, firstDay, isJan2025]);

const CalendarDay = ({ data }) => {
if (!data) return <td></td>;

let className = "";
if (data.type === "filled") {
  className = "primary-active-day";
} else if (data.type === "bordered") {
  className = "secondary-active-day";
}

return (
  <td>
    <span className={className}>{data.day}</span>
  </td>
);

};

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
case "Tasks Allocation":
return <ManagerAllocation />;
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
return ( <div className="dashboard-content">
{/* === Upcoming Tasks === */} <h4>UPCOMING TASKS</h4> <div className="upcoming-activity">
{upcomingTasks.length === 0 ? ( <p className="fst-italic text-muted">No upcoming tasks</p>
) : (
upcomingTasks.map((t, i) => ( <div key={i} className="activity-card"> <div className="activity-header"> <i className="fas fa-user-tag"></i> <span>{t.memberName}</span> </div> <div className="activity-body"> <h5> <i className="fas fa-tasks"></i> {t.task} </h5> <p> <i className="fas fa-calendar-alt"></i>{" "}
{new Date(t.due_date).toLocaleDateString()} </p> <p> <i className="fas fa-clock"></i> {t.time || "No Time"} </p> </div> </div>
))
)} </div>

```
        {/* === Weekly Summary & Team Progress === */}
        <div className="summary-progress-container">
          <div className="weekly-summary">
            <h4>WEEKLY SUMMARY</h4>
            <div className="chart-with-legend">
              <div className="bar-chart-container">
                <div className="chart-axis-y">
                  <span>20</span>
                  <span>18</span>
                  <span>16</span>
                  <span>14</span>
                  <span>12</span>
                  <span>10</span>
                  <span>8</span>
                  <span>6</span>
                  <span>4</span>
                  <span>2</span>
                  <span>0</span>
                </div>
                <div className="chart-wrapper">
                  <div className="background-bars">
                    <div className="background-bar"></div>
                    <div className="background-bar"></div>
                    <div className="background-bar"></div>
                    <div className="background-bar"></div>
                    <div className="background-bar"></div>
                  </div>
                  <div className="bar-chart">
                    <div className="bar todo"></div>
                    <div className="bar inprogress"></div>
                    <div className="bar toreview"></div>
                    <div className="bar completed"></div>
                    <div className="bar missed"></div>
                  </div>
                  <div className="chart-axis-x"></div>
                </div>
              </div>
              <div className="legend">
                <span className="legend-item"><span className="legend-box todo"></span>To Do</span>
                <span className="legend-item"><span className="legend-box inprogress"></span>In Progress</span>
                <span className="legend-item"><span className="legend-box toreview"></span>To Review</span>
                <span className="legend-item"><span className="legend-box completed"></span>Completed</span>
                <span className="legend-item"><span className="legend-box missed"></span>Missed</span>
              </div>
            </div>
          </div>

          <div className="team-progress">
            <h4>TEAM PROGRESS</h4>
            <div className="chart-with-legend">
              <div className="donut-chart"><span>40%</span></div>
              <div className="legend">
                <span className="legend-item"><span className="legend-box todo"></span>To Do</span>
                <span className="legend-item"><span className="legend-box inprogress"></span>In Progress</span>
                <span className="legend-item"><span className="legend-box toreview"></span>To Review</span>
                <span className="legend-item"><span className="legend-box completed"></span>Completed</span>
                <span className="legend-item"><span className="legend-box missed"></span>Missed</span>
              </div>
            </div>
          </div>
        </div>

        {/* === Recent Activity & Calendar === */}
        <div className="recent-calendar-layout">
          <div className="recent-activity">
            <h4>RECENT TASKS CREATED</h4>
            <table>
              <thead>
                <tr>
                  <th>NO</th>
                  <th>Assigned</th>
                  <th>Task</th>
                  <th>Subtask</th>
                  <th>Element</th>
                  <th>Date Created</th>
                  <th>Due Date</th>
                  <th>Time</th>
                  <th>Project Phase</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1.</td>
                  <td>Julliana C</td>
                  <td>Chapter 3</td>
                  <td>Developments</td>
                  <td>Peopleware</td>
                  <td>Feb 4, 2025</td>
                  <td>Feb 7, 2025</td>
                  <td>8:30 AM</td>
                  <td>Analysis</td>
                  <td><span className="status-badge status-to-review">To Review</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="calendar-container">
            <div className="calendar-header-controls">
              <select
                className="calendar-month-select"
                value={`${month}-${year}`}
                onChange={handleMonthChange}
              >
                <option value={`${month}-${year}`}>
                  {MONTH_NAMES[month]} {year}
                </option>
                {(year !== 2025 || month !== 0) && (
                  <option value="0-2025">January 2025</option>
                )}
              </select>
              <div className="calendar-nav-buttons">
                <button onClick={() => handleNav(-1)}>&lt;</button>
                <button onClick={() => handleNav(1)}>&gt;</button>
              </div>
            </div>
            <table className="calendar-table">
              <thead>
                <tr><th>S</th><th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th></tr>
              </thead>
              <tbody>
                {calendarGrid.map((week, weekIndex) => (
                  <tr key={weekIndex}>
                    {week.map((dayData, dayIndex) => (
                      <CalendarDay key={dayIndex} data={dayData} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
}

};

return ( <div className="d-flex"> <Sidebar activeItem={activePage} onSelect={setActivePage} /> <div className="flex-grow-1 p-3">{renderContent()}</div> </div>
);
};

export default ManagerDashboard;
