import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

import {
  MdPendingActions,
  MdTwoWheeler,
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

const RiderDashboard = () => {
  const axiosSecure = useAxiosSecure();

  const { data: summary = {}, isLoading, isError } = useQuery({
    queryKey: ["rider-dashboard-summary"],
    queryFn: async () => {
      const res = await axiosSecure.get("/rider/dashboard/summary");
      return {
        pending: res.data.pending || 0,
        assigned: res.data.assigned || 0,
        in_transit: res.data.in_transit || 0,
        delivered: res.data.delivered || 0,
        totalEarning: res.data.totalEarning || 0,
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
        Failed to load
      </div>
    );

  const chartData = [
    { name: "Pending", value: summary.pending },
    { name: "Assigned", value: summary.assigned },
    { name: "In Transit", value: summary.in_transit },
    { name: "Delivered", value: summary.delivered },
  ];

  const COLORS = ["#ef4444", "#3b82f6", "#facc15", "#22c55e"];
  const renderLabel = ({ percent }) => `${(percent * 100).toFixed(0)}%`;

  return (
    <div className="bg-gray-900 text-white min-h-screen px-4 sm:px-6 lg:px-12 py-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl text-center font-bold text-primary underline mb-6">
        Rider Dashboard
      </h1>
      {/* Responsive cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <Card icon={<MdPendingActions />} color="text-red-400" label="Pending" value={summary.pending} />
        <Card icon={<MdTwoWheeler />} color="text-blue-400" label="Assigned" value={summary.assigned} />
        <Card icon={<MdLocalShipping />} color="text-yellow-400" label="In Transit" value={summary.in_transit} />
        <Card icon={<MdCheckCircle />} color="text-green-400" label="Delivered" value={summary.delivered} />
      </div>

      {/* Responsive chart */}
      <Chart chartData={chartData} renderLabel={renderLabel} colors={COLORS} />

      {/* Total earning */}
      <div className="mt-8 text-center sm:text-left text-lg md:text-2xl font-medium text-green-500">
        Total Earning: <span className="font-bold">${summary.totalEarning.toFixed(2)}</span>
      </div>
    </div>
  );
};

const Card = ({ icon, color, label, value }) => (
  <div className="bg-gray-800 p-4 sm:p-6 rounded-xl flex flex-col items-center shadow hover:bg-gray-700 transition duration-200">
    <div className={`${color} text-4xl sm:text-5xl md:text-6xl mb-3`}>{icon}</div>
    <p className="text-2xl sm:text-3xl md:text-4xl font-bold">{value}</p>
    <p className="text-gray-400 text-sm sm:text-base md:text-lg">{label}</p>
  </div>
);

const Chart = ({ chartData, renderLabel, colors }) => (
  <div className="mt-8 bg-gray-800 rounded-xl p-4 sm:p-6">
    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 text-center">
      Delivery Status Distribution
    </h3>
    <div className="w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px]">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={chartData} dataKey="value" label={renderLabel} outerRadius="80%">
            {chartData.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default RiderDashboard;
