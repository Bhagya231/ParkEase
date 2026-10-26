import { NavLink, useNavigate } from "react-router-dom";
import api from "../../util/api";
import { useState } from "react";

import LogoutModal from "../common/LogoutModal";




function Sidebar()
{
    const navigate = useNavigate();

    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [logoutError, setLogoutError] = useState("");


    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");

    const isAdmin = role === "ADMIN";

    const adminLinks = [
        {label: "OverView", path: "/admin", icon: "bi-grid-1x2"},
        {label: "Locations", path:"/admin/locations", icon:"bi-geo-alt"},
        // {label:"Floor Management", path: "/admin/floors", icon: "bi-building"},
        // {label: "Slot Management", path: "/admin/slots", icon: "bi-grid-3x3-gap"},
        // {label: "Users", path: "/admin/users", icon: "bi-people"},
        {label: "Reservations",path: "/admin/reservations",icon: "bi-calendar-check"},
        // {label: "Pricing", path: "/admin/pricing", icon: "bi-currency-rupee"},
        {label: "Sessions", path: "/admin/sessions", icon: "bi-clock-history"},
        {label: "History",path: "/admin/history",  icon: "bi-clock-history"}
    
     
    ];

    const customerLinks = [
        {label: "Home", path: "/customer", icon: "bi-house"},
        {label: "Find Parking",path: "/customer/find-parking", icon: "bi-geo-alt"},
        {label: "My Reservations", path: "/customer/reservations", icon: "bi-calendar-check"},
        {label: "My Sessions", path:"/customer/sessions", icon: "bi-clock-history"},
        {label: "My Vehicles", path:"/customer/vehicles", icon: "bi-car-front"},
        {label: "My History",path: "/customer/history",  icon: "bi-clock-history"}
       
    ];

    const links = isAdmin ? adminLinks : customerLinks;


    async function handleLogout() 
    {
        setLoggingOut(true);
        setLogoutError(""); 
    try {
        const response = await api.post("/auth/logout");

        console.log("Logout response:", response.data);
       

        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("name");

        setShowLogoutModal(false);

        navigate("/login", { replace: true });
    } catch (error) {
        console.error("Logout status:", error.response?.status);
        console.error("Logout error:", error.response?.data);
    } finally {
        setLoggingOut(false);
    }
    }

    return (
        <aside className="dashboard-sidebar bg-success text-white d-flex flex-column p-3" style={{backgroundColor: "#164E3B"}}>
            <div className="d-flex align-item-center gap-2 mb-4 px-2">
                <div className="bg-white text-success rounded-3 p-2 fw-bold fs-4">
                    P

                </div>
                <div>
                    <h4 className="mb-0 fw-bold ">ParkEase</h4>
                    <small className="text-white-50">SMART PARKING</small>
                </div>

            </div>


            <nav className="nav nav-pills flex-column gap-1">     
                {links.map((link) => (
                <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === "/admin" || link.path === "/customer"}
                    className={({ isActive }) =>
                    `nav-link text-white d-flex align-items-center gap-3 ${
                        isActive ? "active bg-light bg-opacity-25" : ""
                    }`}>
                    <i className={`bi ${link.icon} `}></i>
                    {link.label}
                </NavLink>
                ))}


            </nav>

            <div className="mt-auto border-top border-light border-opacity-25 pt-3">
        <div className="d-flex align-items-center gap-2 mb-3 px-2">
          <div className="rounded-circle bg-white text-success d-flex align-items-center justify-content-center fw-bold"
               style={{ width: 38, height: 38 }}>
            {name[0]}
          </div>

          <div>
            <div className="fw-semibold">
              {name}
            </div>
            <small className="text-white-50">
              {isAdmin ? "Administrator" : "Parking Customer"}
            </small>
          </div>
        </div>

        <button
          className="btn btn-outline-light border-0 w-100 text-start"
          onClick={() => {
            setLogoutError("");
            setShowLogoutModal(true); 

          }}
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          Logout
        </button>
      </div>

          
          <LogoutModal
            show={showLogoutModal}
            onCancel={() => setShowLogoutModal(false)}
            onConfirm={handleLogout}
            loading={loggingOut}
        />

            {logoutError && (
                <div className="alert alert-danger mt-2" role="alert">
                    {logoutError}
                </div>
            )}










        </aside>

        
    )



}


export default Sidebar;

