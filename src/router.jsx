import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Signin from "./components/signin";
import Dashboard from "./components/Dashboard";
import Sidebar from "./components/Sidebar";
import Schedule from "./components/Instructor/Schedule"; // ✅ IMPORT THIS

export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/signin", element: <Signin /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/sidebar", element: <Sidebar /> },
  { path: "title-defense", element: <Schedule /> }, // ✅ ADD THIS ROUTE
]);
