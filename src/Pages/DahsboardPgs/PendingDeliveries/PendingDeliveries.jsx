import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/UseAuth";
import Swal from "sweetalert2";

const PendingDeliveries = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: parcels = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["riderPending", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/parcels/rider/pending?riderEmail=${user.email}`
      );
      return res.data;
    },
  });

  const handlePickup = async (id) => {
    await axiosSecure.patch(`/parcels/${id}/pickup`);
    Swal.fire("Picked Up!", "Parcel is now in transit", "success");
    refetch();
  };

  const handleDelivered = async (id) => {
    await axiosSecure.patch(`/parcels/${id}/delivered`);
    Swal.fire("Delivered!", "Parcel marked as delivered", "success");
    refetch();
  };

  if (isLoading)
    return <p className="text-center mt-10 text-white">Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-white">Pending Deliveries</h2>

      {/* Large screen table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Tracking ID</th>
              <th>Parcel</th>
              <th>Route</th>
              <th>Receiver</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((p) => (
              <tr key={p._id} className="hover:bg-gray-800 rounded">
                <td>{p.tracking_id}</td>
                <td>{p.parcelName}</td>
                <td>
                  {p.pickup_district} → {p.delivery_district}
                </td>
                <td>
                  {p.receiver_name}
                  <br />
                  {p.receiver_contact}
                </td>
                <td>
                  <span className="badge badge-info">{p.delivery_status}</span>
                </td>
                <td className="flex flex-col sm:flex-row gap-2">
                  {p.delivery_status === "rider-assigned" && (
                    <button
                      onClick={() => handlePickup(p._id)}
                      className="btn btn-sm btn-warning"
                    >
                      Picked Up
                    </button>
                  )}
                  {p.delivery_status === "in-transit" && (
                    <button
                      onClick={() => handleDelivered(p._id)}
                      className="btn btn-sm btn-success"
                    >
                      Delivered
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Small screen card view */}
      <div className="lg:hidden flex flex-col gap-3">
        {parcels.map((p) => (
          <div
            key={p._id}
            className="p-4 rounded-md border border-gray-600 flex flex-col gap-1 text-white"
            style={{ backgroundColor: "black" }}
          >
            <p>
              <strong>Tracking ID:</strong> {p.tracking_id}
            </p>
            <p>
              <strong>Parcel:</strong> {p.parcelName}
            </p>
            <p>
              <strong>Route:</strong> {p.pickup_district} →{" "}
              {p.delivery_district}
            </p>
            <p>
              <strong>Receiver:</strong> {p.receiver_name}
            </p>
            <p>
              <strong>Contact:</strong> {p.receiver_contact}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="badge badge-info">{p.delivery_status}</span>
            </p>

            <div className="flex flex-wrap gap-2 mt-2">
              {p.delivery_status === "rider-assigned" && (
                <button
                  onClick={() => handlePickup(p._id)}
                  className="btn btn-sm btn-warning"
                >
                  Picked Up
                </button>
              )}
              {p.delivery_status === "in-transit" && (
                <button
                  onClick={() => handleDelivered(p._id)}
                  className="btn btn-sm btn-success"
                >
                  Delivered
                </button>
              )}
            </div>
          </div>
        ))}

        {parcels.length === 0 && (
          <p className="text-center mt-6 text-white">No pending deliveries</p>
        )}
      </div>
    </div>
  );
};

export default PendingDeliveries;
