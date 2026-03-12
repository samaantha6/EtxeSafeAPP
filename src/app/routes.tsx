import { createBrowserRouter } from "react-router";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import IncidentReport from "./pages/incident-report";
import Camera from "./pages/camera";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/incident-report",
    Component: IncidentReport,
  },
  {
    path: "/camera",
    Component: Camera,
  },
]);
