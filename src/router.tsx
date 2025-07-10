import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard";
import EmployeeManagement from "./pages/EmployeeManagement";
import MonthlyPlan from "./pages/MonthlyPlan";
import WorkSchedule from "./pages/WorkSchedule";
import NightHours from "./pages/NightHours";
import MonthlyAttendance from "./pages/MonthlyAttendance";
import MonthlySchedules from "./pages/MonthlySchedules";
import AnnualLeave from "./pages/AnnualLeave";
import EmployeeAdd from "./pages/EmployeeAdd";
import EmployeeEdit from "./pages/EmployeeEdit";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/employees",
        element: <EmployeeManagement />,
      },
      {
        path: "/employees/add",
        element: <EmployeeAdd />,
      },
      {
        path: "/employees/edit",
        element: <EmployeeEdit />,
      },
      {
        path: "/monthly-plan",
        element: <MonthlyPlan />,
      },
      {
        path: "/work-schedule",
        element: <WorkSchedule />,
      },
      {
        path: "/night-hours",
        element: <NightHours />,
      },
      {
        path: "/monthly-attendance",
        element: <MonthlyAttendance />,
      },
      {
        path: "/monthly-schedules",
        element: <MonthlySchedules />,
      },
      {
        path: "/annual-leave",
        element: <AnnualLeave />,
      },
    ],
  },
]);
