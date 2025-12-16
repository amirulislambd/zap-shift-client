// src/components/SendParcel.jsx
import React, { useMemo, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import { serviceCenters } from "../../Pages/SendParcel/serviceCenters";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import UseAuth from "../../Hooks/useAuth";
import { useNavigate } from "react-router-dom";

// HELPERS
const getRegions = (centers) => [...new Set(centers.map((c) => c.region))];
const getDistrictsForRegion = (centers, region) => [
  ...new Set(centers.filter((c) => c.region === region).map((c) => c.district)),
];
const getCentersForRegionDistrict = (centers, region, district) =>
  centers.filter((c) => c.region === region && c.district === district);

// PRICING
const getPricingBreakdown = (data) => {
  const isDocument = data.type === "document";
  const weight = Number(data.weight || 0);
  const isOutsideDistrict =
    data.pickup_district &&
    data.delivery_district &&
    data.pickup_district !== data.delivery_district;

  let breakdown = [];
  let total = 0;

  if (isDocument) {
    const base = isOutsideDistrict ? 80 : 60;
    breakdown.push({
      label: "Document base price",
      amount: base,
      type: "base",
    });
    total = base;
  } else {
    if (weight <= 3) {
      const base = isOutsideDistrict ? 150 : 110;
      breakdown.push({
        label: "Non-doc base price (up to 3kg)",
        amount: base,
        type: "base",
      });
      total = base;
    } else {
      const extraKg = Math.max(0, weight - 3);
      const base = 110;
      const extra = Math.ceil(extraKg) * 40;
      total = base + extra;
      breakdown.push({
        label: "Non-doc base price (up to 3kg)",
        amount: base,
        type: "base",
      });
      breakdown.push({
        label: `Extra kg charge (${extraKg}kg x ৳40)`,
        amount: extra,
        type: "extraWeight",
        extraKg,
      });
      if (isOutsideDistrict) {
        breakdown.push({
          label: "Outside district extra",
          amount: 40,
          type: "outside",
        });
        total += 40;
      }
    }
  }

  return { breakdown, total };
};

// TRACKING ID
const generateTrackingId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 900000 + 100000);
  return `TRK-${timestamp}-${random}`;
};

const SendParcel = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const axiosSecure = useAxiosSecure();
  const { user } = UseAuth() || {};
  const navigate = useNavigate();

  const [previewData, setPreviewData] = useState(null);
  const [previewCost, setPreviewCost] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const printRef = useRef();

  // Watchers
  const pickupRegion = watch("pickup_region");
  const pickupDistrict = watch("pickup_district");
  const deliveryRegion = watch("delivery_region");
  const deliveryDistrict = watch("delivery_district");
  const type = watch("type");

  // Region & Center logic
  const regions = useMemo(() => getRegions(serviceCenters), []);
  const pickupDistricts = useMemo(
    () => getDistrictsForRegion(serviceCenters, pickupRegion),
    [pickupRegion]
  );
  const deliveryDistricts = useMemo(
    () => getDistrictsForRegion(serviceCenters, deliveryRegion),
    [deliveryRegion]
  );
  const pickupCenters = useMemo(
    () =>
      getCentersForRegionDistrict(serviceCenters, pickupRegion, pickupDistrict),
    [pickupRegion, pickupDistrict]
  );
  const deliveryCenters = useMemo(
    () =>
      getCentersForRegionDistrict(
        serviceCenters,
        deliveryRegion,
        deliveryDistrict
      ),
    [deliveryRegion, deliveryDistrict]
  );

  // Form submit -> preview modal
  const onSubmit = (formData) => {
    const { breakdown, total } = getPricingBreakdown(formData);
    setPreviewData({ ...formData, breakdown });
    setPreviewCost(total);
    setShowConfirmModal(true);
    toast(`Estimated Cost: ৳${total}`, { icon: "💰" });
  };

  // Final confirm -> save parcel + SweetAlert
  const handleConfirm = async () => {
  if (!previewData) return;
  const now = new Date();
  const tracking_id = generateTrackingId();
  const payload = {
    ...previewData,
    pickup_center_id: Number(previewData.pickup_center_id),
    delivery_center_id: Number(previewData.delivery_center_id),
    delivery_cost: previewCost,
    created_by: user?.displayName || user?.name || user?.email || "User",
    sender_email: user?.email,
    user_email: user?.email,
    payload_status: "unpaid",
    delivery_status: "not_collected",
    tracking_id,
    creation_date: now.toISOString(),
  };

  try {
    const res = await axiosSecure.post("/parcels", payload);
    toast.success("Parcel created successfully!");
    setShowConfirmModal(false);
    reset();

    Swal.fire({
      title: "Parcel Created!",
      text: "Where do you want to go?",
      icon: "success",
      showCancelButton: true,
      confirmButtonText: "Payment Page",
      cancelButtonText: "Parcel Details",
      showCloseButton: true,   // <-- close button added
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/dashboard/payment/${res.data.insertedId}`);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        navigate(`/parcel/${tracking_id}`);
      }
      // result.dismiss === Swal.DismissReason.close -> just closed modal
    });
  } catch (error) {
    console.log(error);
    toast.error("Error saving parcel");
  }
};


  // Print function
  const handlePrint = () => {
    if (!printRef.current) return;
    const printWindow = window.open("", "_blank");
    const content = printRef.current.cloneNode(true);
    printWindow.document.body.appendChild(content);

    const btnDiv = printWindow.document.createElement("div");
    btnDiv.style.textAlign = "center";
    btnDiv.style.marginTop = "20px";

    const printBtn = printWindow.document.createElement("button");
    printBtn.innerText = "Print";
    printBtn.style.marginRight = "10px";
    printBtn.onclick = () => printWindow.print();

    const cancelBtn = printWindow.document.createElement("button");
    cancelBtn.innerText = "Cancel";
    cancelBtn.onclick = () => printWindow.close();

    btnDiv.appendChild(printBtn);
    btnDiv.appendChild(cancelBtn);
    printWindow.document.body.appendChild(btnDiv);

    printWindow.document.close();
    printWindow.focus();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-base-200 rounded-lg shadow-md">
      <Toaster />
      <h1 className="text-3xl font-bold text-center mb-4">Send a Parcel</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* ---------------- PARCEL INFO ---------------- */}
        <section className="bg-base-100 p-4 rounded-md shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Parcel Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text">Parcel Name</span>
              </label>
              <input
                {...register("parcelName", {
                  required: "Parcel name is required",
                })}
                className="input input-bordered w-full"
                placeholder="Enter parcel name"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Type</span>
              </label>
              <div className="flex gap-4">
                <label className="flex gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="document"
                    {...register("type", { required: "Select type" })}
                    className="radio radio-success"
                  />
                  <span>Document</span>
                </label>
                <label className="flex gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="non-document"
                    {...register("type", { required: "Select type" })}
                    className="radio radio-success"
                  />
                  <span>Non-document</span>
                </label>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text">Weight (kg)</span>
              </label>
              <input
                type="number"
                step="0.1"
                disabled={type === "document"}
                {...register("weight")}
                className="input input-bordered w-full"
                placeholder={
                  type === "document"
                    ? "Document has no weight"
                    : "Weight in kg"
                }
              />
            </div>
          </div>
        </section>

        {/* ---------- SENDER + RECEIVER -------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sender Info */}
          <section className="bg-base-100 p-4 rounded-md shadow-sm">
            <h2 className="font-semibold mb-2">Sender Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text">Sender Name</span>
                </label>
                <input
                  {...register("sender_name", { required: true })}
                  className="input input-bordered w-full"
                  placeholder="Sender name"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Contact</span>
                </label>
                <input
                  {...register("sender_contact", { required: true })}
                  className="input input-bordered w-full"
                  placeholder="017xxxxxxxx"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Pickup Region</span>
                </label>
                <select
                  {...register("pickup_region", { required: true })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select region</option>
                  {regions.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Pickup District</span>
                </label>
                <select
                  {...register("pickup_district", { required: true })}
                  className="select select-bordered w-full"
                  disabled={!pickupRegion}
                >
                  <option value="">Select district</option>
                  {pickupDistricts.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Service Center</span>
                </label>
                <select
                  {...register("pickup_center_id", { required: true })}
                  className="select select-bordered w-full"
                  disabled={!pickupDistrict}
                >
                  <option value="">Select center</option>
                  {pickupCenters.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="label">
                  <span className="label-text">Pickup Address</span>
                </label>
                <input
                  {...register("pickup_address", { required: true })}
                  className="input input-bordered w-full"
                  placeholder="Enter pickup address"
                />
              </div>
              <div className="md:col-span-2">
                <label className="label">
                  <span className="label-text">Pickup Instruction</span>
                </label>
                <textarea
                  {...register("pickup_instruction")}
                  className="textarea textarea-bordered w-full"
                  placeholder="Enter pickup instructions"
                />
              </div>
            </div>
          </section>

          {/* Receiver Info */}
          <section className="bg-base-100 p-4 rounded-md shadow-sm">
            <h2 className="font-semibold mb-2">Receiver Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text">Receiver Name</span>
                </label>
                <input
                  {...register("receiver_name", { required: true })}
                  className="input input-bordered w-full"
                  placeholder="Receiver name"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Contact</span>
                </label>
                <input
                  {...register("receiver_contact", { required: true })}
                  className="input input-bordered w-full"
                  placeholder="017xxxxxxxx"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Delivery Region</span>
                </label>
                <select
                  {...register("delivery_region", { required: true })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select region</option>
                  {regions.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Delivery District</span>
                </label>
                <select
                  {...register("delivery_district", { required: true })}
                  className="select select-bordered w-full"
                  disabled={!deliveryRegion}
                >
                  <option value="">Select district</option>
                  {deliveryDistricts.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Service Center</span>
                </label>
                <select
                  {...register("delivery_center_id", { required: true })}
                  className="select select-bordered w-full"
                  disabled={!deliveryDistrict}
                >
                  <option value="">Select center</option>
                  {deliveryCenters.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="label">
                  <span className="label-text">Delivery Address</span>
                </label>
                <input
                  {...register("delivery_address", { required: true })}
                  className="input input-bordered w-full"
                  placeholder="Enter delivery address"
                />
              </div>
              <div className="md:col-span-2">
                <label className="label">
                  <span className="label-text">Delivery Instruction</span>
                </label>
                <textarea
                  {...register("delivery_instruction")}
                  className="textarea textarea-bordered w-full"
                  placeholder="Enter delivery instructions"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Buttons */}
        <div className="flex border border-green-500 rounded-lg">
          <button
            type="submit"
            className="btn btn-primary flex-1 rounded-r-none text-black"
          >
            Submit
          </button>
          <button
            type="button"
            className="btn btn-ghost rounded-l-none hover:bg-red-500"
            onClick={() => {
              reset();
              toast("Form reset");
            }}
          >
            Reset
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirmModal && previewData && (
        <div className="modal modal-open">
          <div
            className="modal-box max-w-4xl h-[90vh] overflow-y-auto"
            ref={printRef}
          >
            <h3 className="font-bold text-2xl mb-3 text-center">
              Confirm Parcel Details
            </h3>

            {/* Pricing Breakdown */}
            <div className="bg-base-100 p-4 rounded-md shadow-sm mb-6">
              <h4 className="text-xl font-semibold mb-2">Pricing Breakdown</h4>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                {previewData.breakdown.map((item, idx) => {
                  let details = "";
                  if (item.type === "base") details = "(Base delivery charge)";
                  else if (item.type === "extraWeight")
                    details = `${item.extraKg} kg × ৳40`;
                  else if (item.type === "outside")
                    details = "(Outside district fee)";
                  return (
                    <li key={idx}>
                      {item.label}: <strong>৳{item.amount}</strong>
                      {details && (
                        <div className="text-xs text-gray-500 ml-1">
                          {details}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
              <div className="divider"></div>
              <div className="p-3 rounded text-green-500 text-xl font-bold text-center">
                Total Delivery Cost: ৳{previewCost}
              </div>
            </div>

            {/* Parcel, Sender, Receiver Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold">Parcel Info</h4>
                <p>
                  <strong>Name:</strong> {previewData.parcelName}
                </p>
                <p>
                  <strong>Type:</strong> {previewData.type}
                </p>
                <p>
                  <strong>Weight:</strong>{" "}
                  {previewData.type === "non-document"
                    ? previewData.weight
                    : "N/A"}
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Sender</h4>
                <p>
                  <strong>Name:</strong> {previewData.sender_name}
                </p>
                <p>
                  <strong>Contact:</strong> {previewData.sender_contact}
                </p>
                <p>
                  <strong>Region/District:</strong> {previewData.pickup_region}/
                  {previewData.pickup_district}
                </p>
                <p>
                  <strong>Center ID:</strong> {previewData.pickup_center_id}
                </p>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-semibold">Receiver</h4>
                <p>
                  <strong>Name:</strong> {previewData.receiver_name}
                </p>
                <p>
                  <strong>Contact:</strong> {previewData.receiver_contact}
                </p>
                <p>
                  <strong>Region/District:</strong>{" "}
                  {previewData.delivery_region}/{previewData.delivery_district}
                </p>
                <p>
                  <strong>Center ID:</strong> {previewData.delivery_center_id}
                </p>
              </div>
            </div>
          <div className="modal-action">
            <button
              className="btn btn-ghost"
              onClick={() => setShowConfirmModal(false)}
            >
              Edit
            </button>
            <button
              className="btn btn-primary text-black"
              onClick={handleConfirm}
            >
              Confirm & Proceed
            </button>
            <button className="btn btn-outline" onClick={handlePrint}>
              Print
            </button>
          </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default SendParcel;
