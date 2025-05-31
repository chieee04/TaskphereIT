import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Signin from "./components/signin";
import Dashboard from "./components/Dashboard";

export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/signin", element: <Signin /> },
  { path: "/dashboard", element: <Dashboard /> },
]);