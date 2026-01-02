import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/UseAuth";
import Swal from "sweetalert2";

const CompletedDelivery = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedParcel, setSelectedParcel] = useState(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["completedDeliveries", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/parcels/rider/completed?riderEmail=${user.email}`
      );
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center mt-10 text-white">Loading...</p>;

  // ✅ SAFE destructuring
  const deliveries = data?.deliveries || [];
  const totalEarning = data?.totalEarning || 0;

  const handleCashout = async (id) => {
    const confirm = await Swal.fire({
      title: "Cash Out?",
      text: "You will receive your earning for this delivery",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cash Out",
    });

    if (!confirm.isConfirmed) return;

    await axiosSecure.patch(`/parcels/${id}/cashout`);
    Swal.fire("Success!", "Cashout completed", "success");
    refetch();
  };

  return (
    <div className="p-4 text-white">
      {/* ===== Header ===== */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Completed Deliveries</h2>
        <p className="text-green-400 font-semibold text-lg">
          Total Earned: ৳{totalEarning}
        </p>
      </div>

      {/* ================= SMALL DEVICES ================= */}
      <div className="grid gap-4 lg:hidden">
        {deliveries.map((d) => (
          <div
            key={d._id}
            className="border border-gray-600 rounded-md p-4"
          >
            <p><b>Tracking:</b> {d.tracking_id}</p>
            <p><b>Route:</b> {d.pickup_district} → {d.delivery_district}</p>
            <p><b>Fee:</b> ৳{d.delivery_cost}</p>
            <p className="text-green-400">
              <b>Earning:</b> ৳{d.earning}
            </p>
            <p><b>Picked:</b> {new Date(d.pickedAt).toLocaleString()}</p>
            <p><b>Delivered:</b> {new Date(d.deliveredAt).toLocaleString()}</p>
            <p>
              <b>Status:</b>{" "}
              {d.cashout_status === "paid" ? "Paid" : "Unpaid"}
            </p>

            {d.cashout_status !== "paid" && (
              <button
                onClick={() => handleCashout(d._id)}
                className="btn btn-sm btn-success w-full mt-3"
              >
                Cash Out
              </button>
            )}
          </div>
        ))}

        {deliveries.length === 0 && (
          <p className="text-center">No completed deliveries</p>
        )}
      </div>

      {/* ================= LARGE DEVICES ================= */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Tracking</th>
              <th>Route</th>
              <th>Fee</th>
              <th>Earning</th>
              <th>Status</th>
              <th>View</th>
              <th>Cashout</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((d) => (
              <tr key={d._id}>
                <td>{d.tracking_id}</td>
                <td>{d.pickup_district} → {d.delivery_district}</td>
                <td>৳{d.delivery_cost}</td>
                <td className="text-green-600">৳{d.earning}</td>
                <td>
                  {d.cashout_status === "paid" ? "Paid" : "Unpaid"}
                </td>
                <td>
                  <button
                    onClick={() => setSelectedParcel(d)}
                    className="btn btn-xs btn-info"
                  >
                    View
                  </button>
                </td>
                <td>
                  {d.cashout_status !== "paid" && (
                    <button
                      onClick={() => handleCashout(d._id)}
                      className="btn btn-xs btn-success"
                    >
                      Cash Out
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      {selectedParcel && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-3">Delivery Details</h3>

            <p><b>Tracking:</b> {selectedParcel.tracking_id}</p>
            <p>
              <b>Route:</b>{" "}
              {selectedParcel.pickup_district} →{" "}
              {selectedParcel.delivery_district}
            </p>
            <p><b>Fee:</b> ৳{selectedParcel.delivery_cost}</p>
            <p className="text-green-500">
              <b>Earning:</b> ৳{selectedParcel.earning}
            </p>

            <div className="modal-action">
              <button onClick={() => setSelectedParcel(null)} className="btn">
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default CompletedDelivery;
