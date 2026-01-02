import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import {
  MdVisibility,
  MdDelete,
  MdOutlineRestore,
  MdOutlineSend,
} from "react-icons/md";

const RejectedRiders = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [selectedRider, setSelectedRider] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [allAction, setAllAction] = useState("");

  // Fetch rejected riders
  const { data: riders = [] } = useQuery({
    queryKey: ["rejectedRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/riders/rejected");
      return res.data;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  // Filter riders by NID, License or Name
  const filteredRiders = riders.filter(
    (rider) =>
      rider.nid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rider.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rider.bikeInfo?.license?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ==================== ACTIONS ====================
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      await axiosSecure.delete(`/api/riders/${id}`);
      queryClient.invalidateQueries(["rejectedRiders"]);
      Swal.fire("Deleted!", "Rider has been deleted.", "success");
    }
  };

  const handleMoveToPending = async (id) => {
  const result = await Swal.fire({
    title: "Move to Pending?",
    text: "This rider will be moved to Pending!",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#aaa",
    confirmButtonText: "Yes, move!",
  });

  if (result.isConfirmed) {
    await axiosSecure.patch(`/api/riders/${id}`, {
      status: "pending", 
    });

    queryClient.invalidateQueries(["rejectedRiders"]);
    queryClient.invalidateQueries(["pendingRiders"]);
    Swal.fire("Moved!", "Rider moved to pending.", "success");
  }
};

  const handleAllAction = async () => {
    if (!allAction) return;

    const ids = filteredRiders.map((rider) => rider._id);
    if (ids.length === 0) return;

    if (allAction === "delete") {
      const result = await Swal.fire({
        title: "Delete all filtered riders?",
        text: "This cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete all!",
      });
      if (result.isConfirmed) {
        await Promise.all(
          ids.map((id) => axiosSecure.delete(`/api/riders/${id}`))
        );
        queryClient.invalidateQueries(["rejectedRiders"]);
        Swal.fire("Deleted!", "All riders deleted.", "success");
      }
    } else if (allAction === "move") {
      const result = await Swal.fire({
        title: "Move all filtered riders to Pending?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, move all!",
      });
      if (result.isConfirmed) {
        await Promise.all(
          ids.map((id) =>
            axiosSecure.patch(`/api/riders/${id}`, { status: "pending" })
          )
        );
        queryClient.invalidateQueries(["rejectedRiders"]);
        Swal.fire("Moved!", "All riders moved to pending.", "success");
      }
    }
    setAllAction("");
  };

  const openModal = (rider) => setSelectedRider(rider);
  const closeModal = () => setSelectedRider(null);

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-4">Rejected Riders</h2>

      {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by Name, NID, License"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full md:w-1/3"
        />
        <div className="flex items-center gap-2">
          <select
            value={allAction}
            onChange={(e) => setAllAction(e.target.value)}
            className="select select-bordered"
          >
            <option value="">All Actions</option>
            <option value="delete">Delete All</option>
            <option value="move">Move All to Pending</option>
          </select>

          <button
            onClick={handleAllAction}
            className="btn btn-primary btn-sm text-black flex items-center gap-1"
          >
            {allAction === "delete" && (
              <>
                <MdDelete size={18} /> Delete
              </>
            )}
            {allAction === "move" && (
              <>
                <MdOutlineRestore size={18} /> Move to Pending
              </>
            )}
            {!allAction && (
              <>
                <MdOutlineSend size={18} /> Apply
              </>
            )}
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-600 text-white">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">NID</th>
              <th className="p-2 border">License</th>
              <th className="p-2 border">District</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRiders.map((rider) => (
              <tr key={rider._id}>
                <td className="p-2 border">{rider.name}</td>
                <td className="p-2 border">{rider.phone}</td>
                <td className="p-2 border">{rider.nid}</td>
                <td className="p-2 border">{rider.bikeInfo?.license}</td>
                <td className="p-2 border">{rider.district}</td>
                <td className="p-2 border flex justify-center gap-2">
                  <button
                    onClick={() => openModal(rider)}
                    className="bg-blue-100 text-blue-700 p-2 rounded"
                    title="View"
                  >
                    <MdVisibility size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(rider._id)}
                    className="bg-red-100 text-red-700 p-2 rounded"
                    title="Delete"
                  >
                    <MdDelete size={18} />
                  </button>
                  <button
                    onClick={() => handleMoveToPending(rider._id)}
                    className="bg-yellow-100 text-yellow-700 p-2 rounded"
                    title="Move to Pending"
                  >
                    <MdOutlineRestore size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile / Tablet View */}
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
              <strong>Phone:</strong> {rider.phone}
            </p>
            <p>
              <strong>NID:</strong> {rider.nid}
            </p>
            <p>
              <strong>License:</strong> {rider.bikeInfo?.license}
            </p>
            <p>
              <strong>District:</strong> {rider.district}
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => openModal(rider)}
                className="bg-blue-100 text-blue-700 p-2 rounded"
              >
                <MdVisibility size={18} />
              </button>
              <button
                onClick={() => handleDelete(rider._id)}
                className="bg-red-100 text-red-700 p-2 rounded"
              >
                <MdDelete size={18} />
              </button>
              <button
                onClick={() => handleMoveToPending(rider._id)}
                className="bg-yellow-100 text-yellow-700 p-2 rounded"
              >
                <MdOutlineRestore size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedRider && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[95%] max-w-md p-5 max-h-[90vh] overflow-y-auto">
            {selectedRider.photoURL && (
              <img
                src={selectedRider.photoURL}
                alt=""
                className="w-28 h-28 rounded-full mx-auto mb-3"
              />
            )}

            <div className="space-y-1 text-sm text-black px-4">
              <h3 className="text-lg font-bold mb-2 text-red-500">
                Rider Details
              </h3>
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
                <strong>Rejected At:</strong>
                {selectedRider.rejectedAt
                  ? new Date(selectedRider.rejectedAt).toLocaleString()
                  : "-"}
              </p>

              <p>
                <strong>Reason:</strong> {selectedRider.rejectReason}
              </p>

              <div className="flex justify-between mt-4 gap-2">
                <button
                  onClick={() => handleMoveToPending(selectedRider._id)}
                  className="btn btn-warning btn-sm"
                >
                  Move to Pending
                </button>
                <button
                  onClick={() => handleDelete(selectedRider._id)}
                  className="btn btn-error btn-sm"
                >
                  Delete
                </button>
                <button
                  onClick={closeModal}
                  className="btn md:btn-ghost lg:text-black btn-sm"
                >
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

export default RejectedRiders;
