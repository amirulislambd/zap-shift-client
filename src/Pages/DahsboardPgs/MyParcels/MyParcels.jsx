// src/Pages/MyParcels/MyParcels.jsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UseAuth from "../../../Hooks/UseAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const MyParcels = () => {
  const { user, loading } = UseAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null);

  const {
    data: parcels = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["my-parcels", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/parcels?email=${encodeURIComponent(user.email)}`
      );
      return res.data;
    },
  });

  if (loading) {
    return <div className="text-center mt-10">Checking user...</div>;
  }

  if (isLoading) {
    return <div className="text-center mt-10">Loading parcels...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        Failed to load parcels
      </div>
    );
  }

  const filteredParcels = parcels.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.tracking_id?.toLowerCase().includes(term) ||
      p.pickup_district?.toLowerCase().includes(term) ||
      p.delivery_district?.toLowerCase().includes(term)
    );
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This parcel will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/parcels/${id}`);
          if (res.status === 200) {
            Swal.fire("Deleted!", "Parcel has been deleted.", "success");
            refetch();
          }
        } catch {
          Swal.fire("Error", "Delete failed", "error");
        }
      }
    });
  };

  const handlePay = (id) => {
    toast.success("Redirecting to payment...");
    navigate(`/dashboard/payment/${id}`);
  };
  const modalTotalAmount =
    selectedParcel?.breakdown?.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    ) || 0;
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        My Parcels ({filteredParcels.length})
      </h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by tracking ID or district..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full max-w-md"
        />
      </div>

      {filteredParcels.length === 0 && (
        <div className="text-red-500 bg-amber-100 p-3 rounded">
          No parcels found.
        </div>
      )}

      <div className="space-y-4">
        {filteredParcels.map((parcel) => {
          const totalAmount =
            parcel.breakdown?.reduce(
              (sum, item) => sum + Number(item.amount || 0),
              0
            ) || 0;

          return (
            <div
              key={parcel._id}
              className="p-4 border rounded-lg shadow-sm bg-base-100"
            >
              <div className="md:flex justify-between gap-4">
                <div>
                  <p className="font-semibold">
                    Tracking: {parcel.tracking_id || "N/A"}
                  </p>
                  <p>
                    Parcel: {parcel.parcelName} — {parcel.type}
                  </p>
                  <p>
                    {parcel.pickup_district} → {parcel.delivery_district}
                  </p>

                  <div className="mt-2">
                    {parcel.payload_status === "paid" ? (
                      <span className="badge badge-success text-white">
                        Paid
                      </span>
                    ) : (
                      <span className="badge badge-error text-white">
                        Unpaid
                      </span>
                    )}
                  </div>
                </div>

                <div className="md:text-right">
                  <p className="text-sm">
                    {new Date(parcel.creation_date).toLocaleString("en-GB", {
                      timeZone: "Asia/Dhaka",
                      hour12: true,
                    })}
                  </p>

                  <p className="font-bold text-xl text-primary">
                    Total: {totalAmount} Tk
                  </p>

                  <div className="flex md:justify-end gap-2 mt-3 flex-wrap">
                    <button
                      className="btn btn-sm btn-info text-white"
                      onClick={() => {
                        setSelectedParcel(parcel);
                        setOpenModal(true);
                      }}
                    >
                      View
                    </button>

                    {parcel.payload_status === "unpaid" && (
                      <button
                        onClick={() => handlePay(parcel._id)}
                        className="btn btn-sm btn-success text-white"
                      >
                        Pay
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(parcel._id)}
                      className="btn btn-sm btn-error text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= Parcel View Modal (ONE GLOBAL MODAL) ================= */}
      {openModal && selectedParcel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3">
          <div className="bg-white w-full max-w-xl rounded-lg p-5 relative overflow-scroll">
            <h2 className="text-xl text-center font-semibold mb-4 text-green-500">
              Parcel Details
            </h2>

            <div className=" md:flex  justify-center space-y-2 text-black text-sm md:text-lg lg:text-xl">
              <div>
                <p>
                  <b>Parcel Name:</b> {selectedParcel.parcelName}
                </p>
                <p>
                  <b>Type:</b> {selectedParcel.type}
                </p>
                <p>
                  <b>Weight:</b> {selectedParcel.weight}
                </p>
                <p>
                  <b>Sender:</b> {selectedParcel.sender_name}
                </p>
                <p>
                  <b>Sender Contact:</b> {selectedParcel.sender_contact}
                </p>
                <p>
                  <b>Receiver:</b> {selectedParcel.receiver_name}
                </p>
                <p>
                  <b>Receiver Contact:</b> {selectedParcel.receiver_contact}
                </p>
              </div>
              <div>
                <p>
                  <b>Pickup District:</b> {selectedParcel.pickup_district}
                </p>
                <p>
                  <b>Delivery District:</b> {selectedParcel.delivery_district}
                </p>
                <p>
                  <b>Delivery Address:</b> {selectedParcel.delivery_address}
                </p>
                <p>
                  <b>Status:</b> {selectedParcel.delivery_status}
                </p>
                <p>
                  <b>Payment:</b> {selectedParcel.payload_status}
                </p>
                <p className="text-lg font-bold text-black">
                  Total Amount: ৳{modalTotalAmount}
                </p>
              </div>
            </div>

            <div className="mt-5 text-right">
              <button
                onClick={() => setOpenModal(false)}
                className="btn btn-sm btn-neutral"
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

export default MyParcels;
