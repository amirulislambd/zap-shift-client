import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

import {
  MdPendingActions,
  MdPayment,
  MdLocalShipping,
  MdCheckCircle,
} from "react-icons/md";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const UserDashboard = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: summary = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user-dashboard-summary"],
    queryFn: async () => {
      const res = await axiosSecure.get("/user/dashboard/summary");
      return {
        unpaid: res.data.unpaid || 0,
        paid: res.data.paid || 0,
        in_delivery: res.data.in_delivery || 0,
        delivered: res.data.delivered || 0,
      };
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

  const chartData = [
    { name: "Unpaid", value: summary.unpaid },
    { name: "Paid", value: summary.paid },
    { name: "In Delivery", value: summary.in_delivery },
    { name: "Delivered", value: summary.delivered },
  ];

  const COLORS = ["#ef4444", "#22c55e", "#facc15", "#3b82f6"];
  const renderLabel = ({ name, percent }) =>
    `${name} ${(percent * 100).toFixed(0)}%`;

  return (
    <div className="bg-gray-900 text-white min-h-screen px-4 sm:px-6 lg:px-12 py-6">
      <h1 className="text-xl sm:text-2xl md:text-4xl text-center font-bold text-primary underline mb-6">
        User Dashboard
      </h1>

      <p className="sm:text-2xl lg:text-3xl font-bold mb-6 md:text-center sm:text-left">
        My Parcel Overview
      </p>

      {/* ===================== STATUS CARDS ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <Card
          icon={<MdPendingActions />}
          color="text-red-400"
          label="Unpaid"
          value={summary.unpaid}
        />
        <Card
          icon={<MdPayment />}
          color="text-green-400"
          label="Paid"
          value={summary.paid}
        />
        <Card
          icon={<MdLocalShipping />}
          color="text-yellow-400"
          label="In Delivery"
          value={summary.in_delivery}
        />
        <Card
          icon={<MdCheckCircle />}
          color="text-blue-400"
          label="Delivered"
          value={summary.delivered}
        />
      </div>

      {/* ===================== PIE CHART ===================== */}
      <div className="mt-8 sm:mt-10 bg-gray-800 rounded-xl p-4 sm:p-6 shadow">
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 text-center">
          Parcel Status Distribution
        </h3>

        {chartData.every((item) => item.value === 0) ? (
          <p className="text-center text-gray-400">
            No delivery data available
          </p>
        ) : (
          <div className="w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  label={renderLabel}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

const Card = ({ icon, color, label, value }) => (
  <div className="bg-gray-800 p-4 sm:p-6 rounded-xl flex flex-col items-center shadow hover:bg-gray-700 transition duration-200">
    <div className={`${color} text-4xl sm:text-5xl md:text-6xl mb-3`}>
      {icon}
    </div>
    <p className="text-2xl sm:text-3xl md:text-4xl font-bold">{value}</p>
    <p className="text-gray-400 text-sm sm:text-base md:text-lg">{label}</p>
  </div>
);

export default UserDashboard;
