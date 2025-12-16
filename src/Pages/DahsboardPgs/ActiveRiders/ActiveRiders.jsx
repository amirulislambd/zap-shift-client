import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { MdVisibility, MdOutlinePendingActions } from "react-icons/md";

const ActiveRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [searchNID, setSearchNID] = useState("");
  const [selectedRider, setSelectedRider] = useState(null);

  // Fetch all active riders
  const { data: riders = [], refetch } = useQuery({
    queryKey: ["activeRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/riders/active");
      return res.data;
    },
  });

  // Filter riders by NID
  const filteredRiders = riders.filter((rider) =>
    rider.nid?.toLowerCase().includes(searchNID.toLowerCase())
  );

  // Move to pending page======
  const handleMoveToPending = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This rider will be moved to pending review",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosSecure.patch(`/api/riders/${id}`, {
        status: "pending",
      });

      refetch();

      Swal.fire({
        icon: "success",
        title: "Done",
        text: "Rider moved to pending",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update rider",
        timer: 1800,
        showConfirmButton: false,
      });
    }
  };

  const openModal = (rider) => setSelectedRider(rider);
  const closeModal = () => setSelectedRider(null);

  // Helper to format date safely
  const formatDate = (date) => (date ? new Date(date).toLocaleString() : "-");

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-4">Active Riders</h2>

      <input
        type="text"
        placeholder="Search by NID"
        value={searchNID}
        onChange={(e) => setSearchNID(e.target.value)}
        className="input input-bordered w-full md:max-w-xs mb-4"
      />

      {filteredRiders.length === 0 ? (
        <p>No active riders found.</p>
      ) : (
        <>
          {/* Desktop View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-600 text-white">
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">NID</th>
                  <th className="p-2 border">License</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRiders.map((rider) => (
                  <tr key={rider._id}>
                    <td className="p-2 border">{rider.name}</td>
                    <td className="p-2 border">{rider.email}</td>
                    <td className="p-2 border">{rider.nid}</td>
                    <td className="p-2 border">{rider.bikeInfo?.license}</td>
                    <td className="p-2 border flex justify-center gap-2">
                      <button
                        onClick={() => openModal(rider)}
                        className="bg-blue-100 text-blue-700 p-2 rounded"
                        title="View Details"
                      >
                        <MdVisibility size={18} />
                      </button>
                      <button
                        onClick={() => handleMoveToPending(rider._id)}
                        className="bg-yellow-100 text-yellow-700 p-2 rounded"
                        title="Move to Pending"
                      >
                        <MdOutlinePendingActions size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tablet / Small Desktop */}
          <div className="hidden md:block lg:hidden  overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-600 text-white">
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">NID</th>
                  <th className="p-2 border">Created At</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRiders.map((rider) => (
                  <tr key={rider._id}>
                    <td className="p-2 border">{rider.name}</td>
                    <td className="p-2 border">{rider.nid}</td>
                    <td className="p-2 border">
                      {formatDate(rider.appliedAt)}
                    </td>
                    <td className="p-2 border flex justify-center gap-2">
                      <button
                        onClick={() => openModal(rider)}
                        className="bg-blue-100 text-blue-700 p-2 rounded"
                        title="View Details"
                      >
                        <MdVisibility size={18} />
                      </button>
                      <button
                        onClick={() => handleMoveToPending(rider._id)}
                        className="bg-yellow-100 text-yellow-700 p-2 rounded"
                        title="Move to Pending"
                      >
                        <MdOutlinePendingActions size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredRiders.map((rider) => (
              <div
                key={rider._id}
                className="border rounded-lg p-4 shadow-sm space-y-2"
              >
                <p>
                  <strong>Name:</strong> {rider.name}
                </p>
                <p>
                  <strong>NID:</strong> {rider.nid}
                </p>
                <p>
                  <strong>Email:</strong> {rider.email}
                </p>
                <p>
                  <strong>Created At:</strong> {formatDate(rider.appliedAt)}
                </p>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => openModal(rider)}
                    className="bg-blue-100 text-blue-700 p-2 rounded"
                    title="View Details"
                  >
                    <MdVisibility size={18} />
                  </button>
                  <button
                    onClick={() => handleMoveToPending(rider._id)}
                    className="bg-yellow-100 text-yellow-700 p-2 rounded"
                    title="Move to Pending"
                  >
                    <MdOutlinePendingActions size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal for Rider Details */}
      {selectedRider && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white text-black  rounded-lg w-[95%] max-w-md p-5 max-h-[90vh] overflow-y-auto ">
            <h3 className="text-lg font-bold mb-3">Rider Details</h3>

            {selectedRider.photoURL && (
              <img
                src={selectedRider.photoURL}
                alt=""
                className="w-28 h-28 rounded-full mx-auto mb-3"
              />
            )}

            <div className="space-y-1 text-sm">
              <p>
                <strong>Name:</strong> {selectedRider.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedRider.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedRider.phone}
              </p>
              <p>
                <strong>NID:</strong> {selectedRider.nid}
              </p>
              <p>
                <strong>Bike:</strong> {selectedRider.bikeInfo?.model}
              </p>
              <p>
                <strong>Reg:</strong> {selectedRider.bikeInfo?.registration}
              </p>
              <p>
                <strong>License:</strong> {selectedRider.bikeInfo?.license}
              </p>
              <p>
                <strong>Region:</strong> {selectedRider.region}
              </p>
              <p>
                <strong>District:</strong> {selectedRider.district}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {formatDate(selectedRider.appliedAt)}
              </p>

              <div className="flex justify-end mt-4 gap-2">
                <button onClick={closeModal} className="btn md:btn-ghost lg:text-black btn-sm">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveRiders;
