// src/Pages/PaymentHistory/PaymentHistory.jsx
import React, { useState } from "react";
import { FiEye, FiTrash2 } from "react-icons/fi";
import UseAuth from "../../../Hooks/UseAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

const PaymentHistory = () => {
  const { user } = UseAuth();
  const axiosSecure = useAxiosSecure();

  const [selectedPayment, setSelectedPayment] = useState(null);

  const { isLoading, data: payments = [] } = useQuery({
    queryKey: ["payments", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axiosSecure.get(`/payments/user/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This payment record will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/payments/${id}`);
        Swal.fire("Deleted!", "Payment record deleted.", "success");
      } catch (err) {
        Swal.fire("Error", "Failed to delete payment", "error");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center mt-10">
        <span className="loading loading-dots loading-xl"></span>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-500">
        No payment history found.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-6 px-2">
      <h2 className="text-2xl font-semibold mb-4">Payment History</h2>

      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="table-auto w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-black">
              <th className="border py-2 px-2">No</th>
              <th className="border py-2 px-3">Email</th>
              <th className="border py-2 px-3">Transaction ID</th>
              <th className="border py-2 px-3">Amount</th>

              <th className="border py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p, index) => (
              <tr key={p.paymentIntentId}>
                <td className="border px-2 py-1 text-center">{index + 1}</td>
                <td className="border px-3 py-1">{p.user_email}</td>
                <td className="border px-3 py-1">{p.paymentIntentId}</td>
                <td className="border px-3 py-1">{p.amount}</td>

                <td className="border px-3 py-1 flex gap-2 justify-center">
                  <button
                    className="btn btn-sm btn-info text-white p-1"
                    title="View"
                    onClick={() => setSelectedPayment(p)}
                  >
                    <FiEye size={18} />
                  </button>
                  <button
                    className="btn btn-sm btn-error text-white p-1"
                    title="Delete"
                    onClick={() => handleDelete(p._id)}
                  >
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="md:hidden space-y-4">
        {payments.map((p, index) => (
          <div
            key={p.paymentIntentId}
            className="border rounded-lg p-4 shadow flex flex-col gap-2"
          >
            <p>
              <span className="font-semibold">No:</span> {index + 1}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {p.user_email}
            </p>
            <p>
              <span className="font-semibold">Transaction ID:</span>{" "}
              {p.paymentIntentId}
            </p>
            <p>
              <span className="font-semibold">Amount:</span> {p.amount}
            </p>
            <p>
              <span className="font-semibold">Date:</span>{" "}
              {new Date(p.createdAt).toLocaleString()}
            </p>
            <div className="flex gap-2 mt-2 justify-end">
              <button
                className="btn btn-sm btn-info text-white p-1"
                title="View"
                onClick={() => setSelectedPayment(p)}
              >
                <FiEye size={18} />
              </button>
              <button
                className="btn btn-sm btn-error text-white p-1"
                title="Delete"
                onClick={() => handleDelete(p._id)}
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for detailed view */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-black">
          <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
            <button
              className="absolute bottom-2 right-2 btn btn-ghost"
              onClick={() => setSelectedPayment(null)}
            >
              ✖
            </button>
            <h3 className="text-xl font-bold mb-4 text-center">
              Payment Details
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">Name:</span>{" "}
                {selectedPayment.sender_name}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {selectedPayment.user_email}
              </p>

              <p>
                <span className="font-semibold">Transaction ID:</span>{" "}
                {selectedPayment.paymentIntentId}
              </p>
              <p>
                <span className="font-semibold">Amount:</span>{" "}
                {selectedPayment.amount}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                {selectedPayment.status || "success"}
              </p>
              <p>
                <span className="font-semibold">Created At:</span>{" "}
                {new Date(selectedPayment.createdAt).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Parcel ID:</span>{" "}
                {selectedPayment.parcelId || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {new Date(selectedPayment.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
