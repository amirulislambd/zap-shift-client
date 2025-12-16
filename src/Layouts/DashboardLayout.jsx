import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import ZapShiftLogo from "../Pages/shared/ZapShiftLogo/ZapShiftLogo";
import { HiOutlineHome } from "react-icons/hi";
import {
  MdLocalShipping,
  MdPayment,
  MdTrackChanges,
  MdOutlineAccountCircle,
  MdOutlineVerifiedUser,
  MdOutlinePendingActions,
  MdOutlineDoNotDisturb,
  MdAdminPanelSettings,
  MdTwoWheeler,
  

} from "react-icons/md";
import useUserRole from "../Hooks/UseUserRole";

const DashboardLayout = () => {
  const { role, isLoading } = useUserRole();

  // Show loading spinner while role is fetching
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar for small screens */}
        <div className="navbar bg-base-300 w-full lg:hidden">
          <div className="flex-none">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2 lg:hidden">Dashboard</div>
        </div>

        {/* Page content */}
        <Outlet />
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-4">
          <ZapShiftLogo />

          {/* Common links */}
          <li>
            <NavLink
              to="/dashboard"
              className="flex items-center gap-3 hover:text-blue-500 transition-colors"
            >
              <HiOutlineHome size={22} />
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/myParcels"
              className="flex items-center gap-3 hover:text-blue-500 transition-colors"
            >
              <MdLocalShipping size={22} />
              My Parcels
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/paymentHistory"
              className="flex items-center gap-3 hover:text-blue-500 transition-colors"
            >
              <MdPayment size={22} />
              Payment History
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/track"
              className="flex items-center gap-3 hover:text-blue-500 transition-colors"
            >
              <MdTrackChanges size={22} />
              Track a Package
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/updateProfile"
              className="flex items-center gap-3 hover:text-blue-500 transition-colors"
            >
              <MdOutlineAccountCircle size={22} />
              Update Profile
            </NavLink>
          </li>

          {/* Admin-specific links */}
          {role === "admin" && (
            <>
              <li>
                <NavLink
                  to="/dashboard/assignRider"
                  className="flex items-center gap-3 hover:text-blue-500 transition-colors"
                >
                  <MdTwoWheeler size={22} />
                  Assign Rider
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/activeRiders"
                  className="flex items-center gap-3 hover:text-blue-500 transition-colors"
                >
                  <MdOutlineVerifiedUser size={22} />
                  Active Riders
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/pendingRiders"
                  className="flex items-center gap-3 hover:text-blue-500 transition-colors"
                >
                  <MdOutlinePendingActions size={22} />
                  Pending Riders
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/rejectedRiders"
                  className="flex items-center gap-3 hover:text-blue-500 transition-colors"
                >
                  <MdOutlineDoNotDisturb size={22} />
                  Rejected Riders
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/makeAdmin"
                  className="flex items-center gap-3 hover:text-blue-500 transition-colors"
                >
                  <MdAdminPanelSettings size={22} />
                  Make Admin
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
