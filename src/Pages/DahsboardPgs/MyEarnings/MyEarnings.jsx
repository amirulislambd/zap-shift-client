import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/UseAuth";

const MyEarnings = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [timeframe, setTimeframe] = useState("overall");

  const { data, isLoading } = useQuery({
    queryKey: ["myEarnings", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/parcels/rider/completed?riderEmail=${user.email}`
      );
      return res.data; // { deliveries: [...], totalEarning: 0 }
    },
  });

  if (isLoading)
    return <p className="text-center mt-10 text-white">Loading...</p>;

  const deliveries = data?.deliveries || [];

  // Time-based filtering
  const now = new Date();
  const filterByTime = (d, type) => {
    const deliveredAt = new Date(d.deliveredAt);
    if (type === "today") return deliveredAt.toDateString() === now.toDateString();
    if (type === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return deliveredAt >= weekAgo;
    }
    if (type === "month") return deliveredAt.getMonth() === now.getMonth() && deliveredAt.getFullYear() === now.getFullYear();
    if (type === "year") return deliveredAt.getFullYear() === now.getFullYear();
    return true;
  };

  const totalEarning = deliveries.reduce((sum, d) => sum + d.earning, 0);
  const totalCashedOut = deliveries
    .filter((d) => d.cashout_status === "paid")
    .reduce((sum, d) => sum + d.earning, 0);
  const totalPending = totalEarning - totalCashedOut;

  const earningsByTime = (type) =>
    deliveries
      .filter((d) => filterByTime(d, type))
      .reduce((sum, d) => sum + d.earning, 0);

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-6">My Earnings</h2>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-gray-400">Total Earnings</p>
          <p className="text-green-400 text-2xl font-bold">৳{totalEarning}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-gray-400">Cashed Out</p>
          <p className="text-blue-400 text-2xl font-bold">৳{totalCashedOut}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-gray-400">Pending</p>
          <p className="text-blue-300 text-2xl font-bold">৳{totalPending}</p>
        </div>
      </div>

      {/* Timeframe Earnings */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-gray-400">Today</p>
          <p className="text-green-400 text-xl font-bold">৳{earningsByTime("today")}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-gray-400">This Week</p>
          <p className="text-green-400 text-xl font-bold">৳{earningsByTime("week")}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-gray-400">This Month</p>
          <p className="text-green-400 text-xl font-bold">৳{earningsByTime("month")}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-gray-400">This Year</p>
          <p className="text-green-400 text-xl font-bold">৳{earningsByTime("year")}</p>
        </div>
      </div>
    </div>
  );
};

export default MyEarnings;
