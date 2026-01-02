import React, { useMemo, useState } from "react";
import UseAuth from "../../../Hooks/UseAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { serviceCenters } from "../../SendParcel/serviceCenters";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const BeARider = () => {
  const { user } = UseAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [loading, setLoading] = useState(false);

  const regions = useMemo(
    () => [...new Set(serviceCenters.map((c) => c.region))],
    []
  );

  const districts = useMemo(() => {
    if (!region) return [];
    return serviceCenters
      .filter((c) => c.region === region)
      .map((c) => c.district);
  }, [region]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;

    const riderApplication = {
      name: user?.displayName || "",
      email: user?.email || "",
      age: Number(form.age?.value || 0),
      region,
      district,
      phone: form.phone?.value || "",
      nid: form.nid?.value || "",
      bikeInfo: {
        model: form.bikeModel?.value || "",
        registration: form.bikeRegistration?.value || "",
        license: form.drivingLicense?.value || "",
      },
      status: "pending",
      appliedAt: new Date(),
    };

    try {
      const res = await axiosSecure.post("/api/riders", riderApplication);
      if (res.data?.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Application Submitted",
          text: "Your rider application has been submitted successfully!",
          confirmButtonText: "OK",
        });
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Rider apply error:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Something went wrong. Please try again later.",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };
  if(loading||!user) return(
    <p className="text-center">Loading...</p>
  )

  return (
    <div className="max-w-3xl mx-auto p-6 bg-base-100 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-6">Apply to Be a Rider</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Name</label>
          <input
            type="text"
            defaultValue={user?.displayName || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100 text-black"
          />
        </div>

        <div>
          <label className="label">Email</label>
          <input
            type="email"
            value={user?.email || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100 text-black"
          />
        </div>

        <div>
          <label className="label">Age</label>
          <input
            type="number"
            name="age"
            min={18}
            max={50}
            required
            placeholder="Enter your age"
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">Region</label>
          <select
            className="select select-bordered w-full"
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
              setDistrict("");
            }}
            required
          >
            <option value="">Select Region</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">District</label>
          <select
            className="select select-bordered w-full"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            required
            disabled={!region}
          >
            <option value="">Select District</option>
            {districts.map((d, index) => (
              <option key={`${d}-${index}`} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Phone Number</label>
          <input
            type="tel"
            name="phone"
            required
            placeholder="01XXXXXXXXX"
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">National ID</label>
          <input
            type="text"
            name="nid"
            placeholder="Enter your NID number"
            required
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">Bike Model</label>
          <input
            type="text"
            name="bikeModel"
            placeholder="e.g. Honda CD 70"
            required
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">Bike Registration Number</label>
          <input
            type="text"
            name="bikeRegistration"
            placeholder="e.g. DHAKA METRO-XX-1234"
            required
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">Driving License Number</label>
          <input
            type="text"
            name="drivingLicense"
            placeholder="Enter your driving license number"
            required
            className="input input-bordered w-full"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full text-black"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
};

export default BeARider;
