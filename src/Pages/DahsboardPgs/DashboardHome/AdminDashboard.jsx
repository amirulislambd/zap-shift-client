import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

import {
  FaUserShield,
  FaUserClock,
  FaUserTimes,
  FaUsers,
} from "react-icons/fa";
import {
  MdLocalShipping,
  MdOutlineAssignmentTurnedIn,
  MdOutlineDeliveryDining,
  MdOutlineInventory,
} from "react-icons/md";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: summary = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-dashboard-summary"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/dashboard/summary");
      return res.data;
    },
  });

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load dashboard data
      </div>
    );

  // ================= Rider Cards =================
  const riderCards = [
    {
      title: "Active Riders",
      value: summary.active_riders ?? 0,
      icon: <FaUsers className="text-green-400 text-3xl" />,
      color: "bg-gray-800",
    },
    {
      title: "Pending Riders",
      value: summary.pending_riders ?? 0,
      icon: <FaUserClock className="text-yellow-400 text-3xl" />,
      color: "bg-gray-800",
    },
    {
      title: "Rejected Riders",
      value: summary.rejected_riders ?? 0,
      icon: <FaUserTimes className="text-red-400 text-3xl" />,
      color: "bg-gray-800",
    },
    {
      title: "Total Admins",
      value: summary.total_admins ?? 0,
      icon: <FaUserShield className="text-indigo-400 text-3xl" />,
      color: "bg-gray-800",
    },
  ];

  // ================= Parcel Cards =================
  const parcelCards = [
    {
      title: "Assigned to Rider",
      value: summary.assigned_to_rider ?? 0,
      icon: <MdOutlineAssignmentTurnedIn className="text-sky-400 text-3xl" />,
      color: "bg-gray-800",
    },
    {
      title: "In Transit",
      value: summary.in_transit ?? 0,
      icon: <MdLocalShipping className="text-purple-400 text-3xl" />,
      color: "bg-gray-800",
    },
    {
      title: "Not Collected",
      value: summary.not_collected ?? 0,
      icon: <MdOutlineInventory className="text-orange-400 text-3xl" />,
      color: "bg-gray-800",
    },
    {
      title: "Delivered",
      value: summary.delivered ?? 0,
      icon: <MdOutlineDeliveryDining className="text-green-400 text-3xl" />,
      color: "bg-gray-800",
    },
  ];

  // ================= Charts Data =================
  const riderChartData = [
    { name: "Active", value: summary.active_riders ?? 0 },
    { name: "Pending", value: summary.pending_riders ?? 0 },
    { name: "Rejected", value: summary.rejected_riders ?? 0 },
  ];

  const parcelChartData = [
    { name: "Assigned", value: summary.assigned_to_rider ?? 0 },
    { name: "In Transit", value: summary.in_transit ?? 0 },
    { name: "Not Collected", value: summary.not_collected ?? 0 },
    { name: "Delivered", value: summary.delivered ?? 0 },
  ];

  const COLORS_RIDERS = ["#22c55e", "#facc15", "#ef4444"];
  const COLORS_PARCEL = ["#0284c7", "#7c3aed", "#f97316", "#16a34a"];

  const renderLabel = ({ name, percent }) =>
    `${name} ${(percent * 100).toFixed(0)}%`;

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl text-center font-bold text-primary underline mb-6">
        Admin Dashboard
      </h1>

      {/* Rider Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {riderCards.map((card, index) => (
          <div
            key={index}
            className="p-4 rounded-lg flex flex-col items-center shadow bg-gray-800 hover:bg-gray-700 transition"
          >
            {card.icon}
            <p className="text-2xl font-bold mt-2">{card.value}</p>
            <p className="text-gray-400">{card.title}</p>
          </div>
        ))}
      </div>

      {/* Rider Chart */}
      <div className="mb-12 bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-center">
          Riders Overview
        </h3>
        <div className="w-full h-[300px] sm:h-[350px] md:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={riderChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="80%"
                label={renderLabel}
              >
                {riderChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS_RIDERS[index % COLORS_RIDERS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Parcel Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {parcelCards.map((card, index) => (
          <div
            key={index}
            className="p-4 rounded-lg flex flex-col items-center shadow bg-gray-800 hover:bg-gray-700 transition"
          >
            {card.icon}
            <p className="text-2xl font-bold mt-2">{card.value}</p>
            <p className="text-gray-400">{card.title}</p>
          </div>
        ))}
      </div>

      {/* Parcel Chart */}
      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-center">
          Parcel Overview
        </h3>
        <div className="w-full h-[300px] sm:h-[350px] md:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={parcelChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="80%"
                label={renderLabel}
              >
                {parcelChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS_PARCEL[index % COLORS_PARCEL.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
