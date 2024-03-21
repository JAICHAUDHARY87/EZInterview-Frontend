import React from "react";
import "./Navbar.css";
import { useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  return (
    <div className="SideNavbarMain">
      <div className="SideNavbar">
        <div className="SideNavbarLogo">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135682.png"
            alt="Logo"
          />
        </div>
        <div className="SideNavbarMenu">
          <ul>
            <li className={location.pathname === "/profile"?"NavItemSelected":""}>
              <a href="/profile" title="Manage Interviews">
                <span class="material-symbols-outlined">account_circle</span>
              </a>
            </li>
            <li className={location.pathname === "/candidate"?"NavItemSelected":""}>
              <a href="/candidate" title="Manage Candidates">
                <span class="material-symbols-outlined">groups</span>
              </a>
            </li>
            <li className={location.pathname === "/interviews"?"NavItemSelected":""}>
              <a href="/interviews" title="Manage Interviews">
                <span class="material-symbols-outlined">devices</span>
              </a>
            </li>
          </ul>
        </div>
        <div>
          <button className="LogoutButton">
            <span class="material-symbols-outlined">logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
