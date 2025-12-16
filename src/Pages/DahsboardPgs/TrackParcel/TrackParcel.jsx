import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";


const TrackParcel = () => {
  const { trackingId: paramId } = useParams();
  const axiosSecure = useAxiosSecure();

  const [trackingId, setTrackingId] = useState(paramId || "");
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (trackingId) fetchTracking(trackingId);
  }, [trackingId]);

  const fetchTracking = async (id) => {
    try {
      const res = await axiosSecure.get(`/tracking/${id}`);
      setTrackingData(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setTrackingData(null);
      setError("Tracking ID not found");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (trackingId) fetchTracking(trackingId);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 ">
      <h2 className="text-2xl font-semibold mb-4">Track Your Parcel</h2>

      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <input
          type="text"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          placeholder="Enter Tracking ID"
          className="input input-bordered flex-1"
        />
        <button type="submit" className="btn btn-primary text-black">
          Track
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {trackingData && (
        <div className="space-y-4">
          <p>
            <span className="font-semibold">Parcel ID:</span>{" "}
            {trackingData.parcelId}
          </p>

          <div className="space-y-2">
            {trackingData.updates.map((u, idx) => (
              <div
                key={idx}
                className="p-3 border rounded-lg  shadow-sm"
              >
                <p>
                  <span className="font-semibold">Status:</span> {u.status}
                </p>
                <p>
                  <span className="font-semibold">Location:</span>{" "}
                  {u.location || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(u.date).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackParcel;
