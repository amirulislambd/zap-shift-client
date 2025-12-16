import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { MdVisibility, MdDelete } from "react-icons/md";

const PendingRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedRider, setSelectedRider] = useState(null);
  const [searchLicense, setSearchLicense] = useState("");
const queryClient = useQueryClient();
  // ================= FETCH =================
  const { data: riders = [], refetch } = useQuery({
    queryKey: ["pendingRiders"],
    queryFn: async () => {
      
      const res = await axiosSecure.get("/api/riders/pending");
      return res.data;
    },
  });

  const filteredRiders = riders.filter((r) =>
    r.bikeInfo?.license?.toLowerCase().includes(searchLicense.toLowerCase())
  );

  // ================= ACTIONS =================
  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: "Delete rider?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Delete",
    });

    if (res.isConfirmed) {
      await axiosSecure.delete(`/api/riders/${id}`);
      refetch();
      Swal.fire({
        icon: "success",
        title: "Deleted",
        timer: 1400,
        showConfirmButton: false,
      });
    }
  };

// Accept a rider
 const handleAccept = async (id) => {
  await axiosSecure.patch(`/api/riders/${id}`, {
    status: "active",
    role: "rider",
  });
  queryClient.invalidateQueries(["pendingRiders"]);

  setSelectedRider(null);

  Swal.fire({
    icon: "success",
    title: "Rider Activated as Writer",
    timer: 1400,
    showConfirmButton: false,
  });
};


  // Reject a rider
const handleReject = async (id) => {
  await axiosSecure.patch(`/api/riders/${id}`, {
    status: "rejected",
    role: "rejected rider",   
  });
  refetch();
  setSelectedRider(null);

  Swal.fire({
    icon: "info",
    title: "Rider Rejected",
    timer: 1400,
    showConfirmButton: false,
  });
};

  return (
    <div className="p-3 sm:p-5">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Pending Riders</h2>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by License"
        value={searchLicense}
        onChange={(e) => setSearchLicense(e.target.value)}
        className="input input-bordered w-full sm:max-w-xs mb-4"
      />

      {/* ================= MOBILE (CARD) ================= */}
      <div className="grid gap-4 md:hidden">
        {filteredRiders.map((rider) => (
          <div
            key={rider._id}
            className="border rounded-xl p-4 shadow-sm space-y-2"
          >
            <p>
              <b>Name:</b> {rider.name}
            </p>
            <p>
              <b>Phone:</b> {rider.phone}
            </p>
            <p>
              <b>License:</b> {rider.bikeInfo?.license}
            </p>
            <p className="text-xs text-gray-500">
              Applied:{" "}
              {rider.appliedAt
                ? new Date(rider.appliedAt).toLocaleString()
                : "-"}
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedRider(rider)}
                className="btn btn-sm btn-info"
              >
                <MdVisibility />
              </button>
              <button
                onClick={() => handleDelete(rider._id)}
                className="btn btn-sm btn-error"
              >
                <MdDelete />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= TABLET ================= */}
      <div className="hidden md:block lg:hidden overflow-x-auto">
        <table className="table table-zebra w-full text-sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>License</th>
              <th>District</th>
              <th>Applied</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRiders.map((rider) => (
              <tr key={rider._id}>
                <td>{rider.name}</td>
                <td>{rider.bikeInfo?.license}</td>
                <td>{rider.district}</td>
                <td>
                  {rider.appliedAt
                    ? new Date(rider.appliedAt).toLocaleDateString()
                    : "-"}
                </td>
                <td className="flex justify-center gap-2">
                  <button
                    onClick={() => setSelectedRider(rider)}
                    className="btn btn-xs btn-info"
                  >
                    <MdVisibility />
                  </button>
                  <button
                    onClick={() => handleDelete(rider._id)}
                    className="btn btn-xs btn-error"
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>License</th>
              <th>District</th>
              <th>Applied At</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRiders.map((rider) => (
              <tr key={rider._id}>
                <td>{rider.name}</td>
                <td>{rider.phone}</td>
                <td>{rider.bikeInfo?.license}</td>
                <td>{rider.district}</td>
                <td>
                  {rider.appliedAt
                    ? new Date(rider.appliedAt).toLocaleString()
                    : "-"}
                </td>
                <td className="flex justify-center gap-2">
                  <button
                    onClick={() => setSelectedRider(rider)}
                    className="btn btn-sm btn-info"
                  >
                    <MdVisibility />
                  </button>
                  <button
                    onClick={() => handleDelete(rider._id)}
                    className="btn btn-sm btn-error"
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      {selectedRider && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-3 ">
          <div className="bg-white w-full max-w-md rounded-xl p-5 overflow-y-auto max-h-[90vh]">
            {selectedRider.photoURL && (
              <img
                src={selectedRider.photoURL}
                alt=""
                className="w-24 h-24 rounded-full mx-auto mb-3"
              />
            )}

            <h3 className="text-center font-bold text-lg mb-2 text-green-600">
              Rider Details
            </h3>

            <div className="text-sm space-y-1 text-black md:flex gap-2 ">
              <div>
                <p>
                  <b>Name:</b> {selectedRider.name}
                </p>
                <p>
                  <b>Email:</b> {selectedRider.email}
                </p>
                <p>
                  <b>Phone:</b> {selectedRider.phone}
                </p>
                <p>
                  <b>NID:</b> {selectedRider.nid}
                </p>
                <p>
                  <b>License:</b> {selectedRider.bikeInfo?.license}
                </p>

                <p>
                  <b>Applied:</b>{" "}
                  {selectedRider.appliedAt
                    ? new Date(selectedRider.appliedAt).toLocaleString()
                    : "-"}
                </p>
              </div>
              <div>
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
              </div>
            </div>

            <div className="flex justify-between gap-2 mt-4">
              <button
                onClick={() => handleAccept(selectedRider._id)}
                className="btn btn-success btn-sm"
              >
                Accept
              </button>
              <button
                onClick={() => handleReject(selectedRider._id)}
                className="btn btn-error btn-sm"
              >
                Reject
              </button>
              <button
                onClick={() => setSelectedRider(null)}
                className="btn md:btn-ghost btn-sm md:text-black hover:text-white "
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRiders;
