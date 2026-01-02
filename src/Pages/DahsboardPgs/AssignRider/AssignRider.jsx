import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { MdTwoWheeler } from "react-icons/md";
import Swal from "sweetalert2";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["assign-rider-parcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/parcels/assign-rider");
      return res.data;
    },
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [riders, setRiders] = useState([]);

  const handleOpenModal = async (parcel) => {
    try {
      const res = await axiosSecure.get("/api/riders/by-district", {
        params: { district: parcel.delivery_district },
      });

      if (!res.data || res.data.length === 0) {
        // SweetAlert for no riders
        Swal.fire({
          icon: "info",
          title: "No active riders in this district!",
          timer: 2000,
          showConfirmButton: false,
          position: "top-end",
          toast: true,
        });
        return;
      }

      setSelectedParcel(parcel);
      setRiders(res.data);
      setModalOpen(true);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed to load riders!",
        timer: 2000,
        showConfirmButton: false,
        position: "top-end",
        toast: true,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  const handleAssignRider = async (rider) => {
    try {
      const res = await axiosSecure.patch(
        `/parcels/assign-rider/${selectedParcel._id}`,
        { riderId: rider._id }
      );

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Rider Assigned",
          timer: 2000,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
        });

        setModalOpen(false);
        queryClient.invalidateQueries(["assign-rider-parcels"]);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Assign failed",
        timer: 2000,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-white">
        Assign Rider Parcels ({parcels.length})
      </h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table-auto w-full min-w-[700px] border-collapse">
          <thead className="bg-gray-300 text-black">
            <tr>
              <th className="px-4 py-2 text-center">NO</th>
              <th className="px-4 py-2 text-left">Parcel</th>
              <th className="px-4 py-2 text-left">Sender</th>
              <th className="px-4 py-2 text-left">Receiver</th>
              <th className="px-4 py-2 text-center">Cost</th>
              <th className="px-4 py-2 text-center">Status</th>
              <th className="px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel, index) => (
              <tr
                key={parcel._id}
                className={
                  index % 2 === 0
                    ? "bg-gray-100 text-black"
                    : "bg-gray-200 text-black"
                }
              >
                <td className="px-4 py-3 text-center">{index + 1}</td>
                <td className="px-4 py-3">{parcel.parcelName}</td>
                <td className="px-4 py-3">{parcel.sender_name}</td>
                <td className="px-4 py-3">{parcel.receiver_name}</td>
                <td className="px-4 py-3 text-center">
                  ৳{parcel.delivery_cost}
                </td>
                <td className="px-4 py-3 text-center">
                  {parcel.delivery_status}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    className="btn btn-sm btn-primary flex items-center gap-2 text-black justify-center"
                    onClick={() => handleOpenModal(parcel)}
                  >
                    <MdTwoWheeler aria-hidden="true" /> Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile / Tablet Cards */}
      <div className="md:hidden grid gap-4">
        {parcels.map((parcel, index) => (
          <div
            key={parcel._id}
            className={`p-4 rounded-lg shadow ${
              index % 2 === 0
                ? "bg-gray-100 text-black"
                : "bg-gray-200 text-black"
            }`}
          >
            <p>
              <span className="font-semibold">Parcel:</span> {parcel.parcelName}
            </p>
            <p>
              <span className="font-semibold">Sender:</span>{" "}
              {parcel.sender_name}
            </p>
            <p>
              <span className="font-semibold">Receiver:</span>{" "}
              {parcel.receiver_name}
            </p>
            <p>
              <span className="font-semibold">Cost:</span> ৳
              {parcel.delivery_cost}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              {parcel.delivery_status}
            </p>
            <button
              className="btn btn-sm btn-primary mt-2 flex text-black items-center gap-2"
              onClick={() => handleOpenModal(parcel)}
            >
              <MdTwoWheeler aria-hidden="true" /> Assign Rider
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && selectedParcel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 p-4 overflow-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-auto">
            <h3 className="text-lg font-semibold mb-4 text-black">
              Assign Rider
            </h3>
            <p className="mb-2 text-black">
              Parcel: {selectedParcel.parcelName}
            </p>

            {/* Desktop Rider Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="table-auto w-full min-w-[600px] border-collapse">
                <thead className="bg-green-300 text-black">
                  <tr>
                    <th className="px-4 py-2 text-center">#</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Phone</th>
                    <th className="px-4 py-2 text-left">Bike Model</th>
                    <th className="px-4 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {riders.map((rider, index) => (
                    <tr
                      key={rider._id}
                      className={
                        index % 2 === 0
                          ? "bg-green-100 text-black"
                          : "bg-green-200 text-black"
                      }
                    >
                      <td className="px-4 py-3 text-center">{index + 1}</td>
                      <td className="px-4 py-3">{rider.name}</td>
                      <td className="px-4 py-3">{rider.email}</td>
                      <td className="px-4 py-3">{rider.phone}</td>
                      <td className="px-4 py-3">
                        {rider.bikeInfo?.model || "-"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          className="btn btn-xs btn-success flex items-center gap-1 justify-center text-white"
                          onClick={() => handleAssignRider(rider)}
                        >
                          <MdTwoWheeler aria-hidden="true" /> Assign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile / Tablet Rider Cards */}
            <div className="sm:hidden grid gap-4 mt-2">
              {riders.map((rider, index) => (
                <div
                  key={rider._id}
                  className={`p-3 rounded-lg shadow ${
                    index % 2 === 0
                      ? "bg-green-100 text-black"
                      : "bg-green-200 text-black"
                  }`}
                >
                  <p>
                    <span className="font-semibold">Name:</span> {rider.name}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span> {rider.email}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span> {rider.phone}
                  </p>
                  <p>
                    <span className="font-semibold">Bike Model:</span>{" "}
                    {rider.bikeInfo?.model || "-"}
                  </p>
                  <button
                    className="btn btn-xs btn-success mt-2 flex items-center gap-1"
                    onClick={() => handleAssignRider(rider)}
                  >
                    <MdTwoWheeler aria-hidden="true" /> Assign
                  </button>
                </div>
              ))}
            </div>

            <button
              className="btn btn-sm btn-error mt-4 text-white"
              onClick={() => setModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignRider;
