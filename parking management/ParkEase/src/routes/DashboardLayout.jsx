import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import "./dashboard.css";

function DashboardLayout() {
  return (
    <div className="min-vh-100 bg-light">
      <Sidebar />

      <main className="dashboard-content p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;