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
  MdOutlineDoNotDisturb,
  MdAdminPanelSettings,
  MdTwoWheeler,
  MdOutlinePendingActions,
} from "react-icons/md";

import useUserRole from "../Hooks/UseUserRole";

const DashboardLayout = () => {
  const { role, isLoading } = useUserRole();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  // Mapping each link to its active color
  const activeColors = {
    "/dashboard": "text-blue-600",
    "/dashboard/myParcels": "text-green-600",
    "/dashboard/paymentHistory": "text-yellow-600",
    "/dashboard/track": "text-purple-600",
    "/dashboard/updateProfile": "text-pink-600",
    "/dashboard/pendingDeliveries": "text-orange-600",
    "/dashboard/completedDeliveries": "text-teal-600",
    "/dashboard/myEarnings": "text-red-600",
    "/dashboard/assignRider": "text-blue-600",
    "/dashboard/activeRiders": "text-green-600",
    "/dashboard/pendingRiders": "text-yellow-600",
    "/dashboard/rejectedRiders": "text-red-600",
    "/dashboard/makeAdmin": "text-purple-600",
  };

  // Function to generate NavLink classes
  const getLinkClass =
    (path) =>
    ({ isActive }) =>
      `flex items-center gap-3 transition-colors text-xl md:text-2xl p-2 rounded ${
        isActive
          ? `${activeColors[path]} font-bold`
          : "text-gray-400 hover:text-gray-900"
      }`;

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      {/* Drawer content */}
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
                />
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
        <ul className="menu bg-base-100 rounded p-4 w-64 sm:w-72 md:w-80 lg:w-80 overflow-y-auto min-h-full">
          <ZapShiftLogo />

          {/* Common links */}
          <li>
            <NavLink to="/dashboard" end className={getLinkClass("/dashboard")}>
              <HiOutlineHome size={22} />
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/profile"
              className="flex items-center gap-3 hover:text-blue-500 transition-colors text-xl md:text-2xl"
            >
              <MdOutlineAccountCircle size={22} />
              My Profile
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/myParcels"
              className={getLinkClass("/dashboard/myParcels")}
            >
              <MdLocalShipping size={22} />
              My Parcels
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/paymentHistory"
              className={getLinkClass("/dashboard/paymentHistory")}
            >
              <MdPayment size={22} />
              Payment History
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/track"
              className={getLinkClass("/dashboard/track")}
            >
              <MdTrackChanges size={22} />
              Track a Package
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/updateProfile"
              className={getLinkClass("/dashboard/updateProfile")}
            >
              <MdOutlineAccountCircle size={22} />
              Update Profile
            </NavLink>
          </li>

          {/* Rider-specific links */}
          {role === "rider" && (
            <>
              <li>
                <NavLink
                  to="/dashboard/pendingDeliveries"
                  className={getLinkClass("/dashboard/pendingDeliveries")}
                >
                  <MdOutlinePendingActions size={22} />
                  Pending Deliveries
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/completedDeliveries"
                  className={getLinkClass("/dashboard/completedDeliveries")}
                >
                  <MdOutlineVerifiedUser size={22} />
                  Completed Deliveries
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/myEarnings"
                  className={getLinkClass("/dashboard/myEarnings")}
                >
                  <MdOutlineAccountCircle size={22} />
                  My Earnings
                </NavLink>
              </li>
            </>
          )}

          {/* Admin-specific links */}
          {role === "admin" && (
            <>
              <li>
                <NavLink
                  to="/dashboard/assignRider"
                  className={getLinkClass("/dashboard/assignRider")}
                >
                  <MdTwoWheeler size={22} />
                  Assign Rider
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/activeRiders"
                  className={getLinkClass("/dashboard/activeRiders")}
                >
                  <MdOutlineVerifiedUser size={22} />
                  Active Riders
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/pendingRiders"
                  className={getLinkClass("/dashboard/pendingRiders")}
                >
                  <MdOutlinePendingActions size={22} />
                  Pending Riders
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/rejectedRiders"
                  className={getLinkClass("/dashboard/rejectedRiders")}
                >
                  <MdOutlineDoNotDisturb size={22} />
                  Rejected Riders
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/makeAdmin"
                  className={getLinkClass("/dashboard/makeAdmin")}
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
