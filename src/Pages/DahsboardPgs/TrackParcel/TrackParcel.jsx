import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  FaBox,
  FaMoneyCheckAlt,
  FaUserCheck,
  FaTruck,
  FaCheckCircle,
} from "react-icons/fa";

const statusConfig = {
  submitted: {
    label: "Parcel Submitted",
    icon: <FaBox className="text-blue-500" />,
  },
  paid: {
    label: "Payment Completed",
    icon: <FaMoneyCheckAlt className="text-green-500" />,
  },
  "rider-assigned": {
    label: "Rider Assigned",
    icon: <FaUserCheck className="text-indigo-500" />,
  },
  "picked-up": {
    label: "Parcel Picked Up",
    icon: <FaTruck className="text-yellow-500" />,
  },
  delivered: {
    label: "Parcel Delivered",
    icon: <FaCheckCircle className="text-emerald-600" />,
  },
};

const TrackParcel = () => {
  const { trackingId: paramTrackingId } = useParams();

  const [trackingId, setTrackingId] = useState(paramTrackingId || "");
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (paramTrackingId) {
      fetchTracking(paramTrackingId);
    }
  }, [paramTrackingId]);

  const fetchTracking = async (id) => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `https://zap-shift-server-a7ys5bt86-mdamirulislam313s-projects.vercel.app/tracking/${id}`
      );

      setTrackingData(res.data);
    } catch (err) {
      setTrackingData(null);
      setError("Tracking ID not found");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (trackingId.trim()) {
      fetchTracking(trackingId.trim());
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Track Your Parcel
      </h2>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        <input
          type="text"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          placeholder="Enter Tracking ID"
          className="input input-bordered w-full"
        />
        <button className="btn btn-primary text-black">
          Track Parcel
        </button>
      </form>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500">
          Fetching tracking information...
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-center text-red-500 font-medium">
          {error}
        </p>
      )}

      {/* Tracking Result */}
      {trackingData && (
        <div className="mt-8">
          <p className="mb-4">
            <span className="font-semibold">Tracking ID:</span>{" "}
            {trackingData.trackingId}
          </p>

          <div className="space-y-4">
            {trackingData.updates.map((update, index) => {
              const config =
                statusConfig[update.status] || {};

              return (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 border rounded-lg shadow-sm bg-base-100"
                >
                  <div className="text-2xl mt-1">
                    {config.icon || <FaBox />}
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold">
                      {config.label || update.status}
                    </p>

                    <p className="text-sm ">
                      {new Date(update.date).toLocaleString()}
                    </p>

                    {update.name && (
                      <p className="text-sm">
                        <span className="font-medium">
                          Updated by:
                        </span>{" "}
                        {update.name} ({update.email})
                      </p>
                    )}

                    {update.location && (
                      <p className="text-sm">
                        <span className="font-medium">
                          Location:
                        </span>{" "}
                        {update.location.district},{" "}
                        {update.location.area}
                      </p>
                    )}

                    {update.note && (
                      <p className="text-sm italic ">
                        {update.note}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackParcel;
