import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Signin from "./components/signin";
import Dashboard from "./components/Dashboard";
import Schedule from "./components/Instructor/Schedule"; // ✅ IMPORT THIS
import StudentCredentials from "./components/Instructor/StudentCredentials";
import AdviserCredentials from "./components/Instructor/AdviserCredentials";
import Adviser from "./components/Instructor/Adviser-Enroll";
import Enroll from "./components/Instructor/Enroll-Member";
import Teams from "./components/Instructor/Teams";
import Oral from "./components/Instructor/OralDefense"
import Final from "./components/Instructor/FinalDefense";
import TitleDefense from "./components/Instructor/TitleDefense"
import ManuScript from "./components/Instructor/ManuScript";
import MemberAdviserTasks from "./components/Member/MemberAdviserTasks";
import MemberAllocation from "./components/Member/MemberAllocation";
import MemberTask from "./components/Member/MemberTask";
import MemberTasksBoard from "./components/Member/MemberTaskBoard";
import InstructorDashboard from "./components/Instructor/InstructorDashboard";
import MemberDashboard from "./components/Member/MemberDashboard";
import ManagerDashboard from "./components/ProjectManager/ManagerDashboard";

import ManagerFinalDefense from "./components/ProjectManager/ManagerTask/ManagerFinalDefense";
import ManagerFinalCreate from "./components/ProjectManager/ManagerTask/ManagerFinalCreate";

export const router = createBrowserRouter([


  {
    path: "/",
    element: <App />,   //may Header + Footer
    children: [
      { index: true, element: <ManagerDashboard /> }, // ito ang unang lalabas (default)
      { path: "/ManagerDashboard", element: <ManagerDashboard /> },

  //-----------------------------------------------------------
  //-----------------------------------------------------------

  //IT INSTRUCTOR 
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/Student-Credentials", element: <StudentCredentials /> },
  { path: "/Adviser-Credentials", element: <AdviserCredentials /> },
  { path: "/Adviser-Enroll", element: <Adviser /> },
  { path: "/Student-Enroll", element: <Enroll /> },
  { path: "/Teams", element: <Teams /> },
  { path: "/InstructorDashboard", element: <InstructorDashboard /> },
  { path: "/dashboard", element: <Dashboard /> },
  //SCHEDULE
  { path: "title-defense", element: <Schedule /> },
    //SCHEDULE
    { path: "/Oral", element: <Oral /> },
    { path: "/Final", element: <Final /> },
    { path: "/TitleDefense", element: <TitleDefense /> },
    { path: "/ManuScript", element: <ManuScript /> },

  //-----------------------------------------------------------
  //-----------------------------------------------------------

  //MEMBER
  { path: "/MemberAdviserTasks", element: <MemberAdviserTasks /> },
  { path: "/MemberAllocation", element: <MemberAllocation /> },
  { path: "/MemberTask", element: <MemberTask /> },
  { path: "/MemberTasksBoard", element: <MemberTasksBoard /> },

  //
  

    ],
  },
]);
