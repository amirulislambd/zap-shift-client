import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/UseAuth";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { parcelId } = useParams();
  const trackingId = parcelId;

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processing, setProcessing] = useState(false);

  // Fetch Parcel
  const { data: parcelInfo = {}, isPending } = useQuery({
    queryKey: ["parcel", trackingId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${trackingId}`);
      return res.data;
    },
  });

  if (isPending) {
    return (
      <div className="w-full flex justify-center mt-10">
        <span className="loading loading-dots loading-xl"></span>
      </div>
    );
  }

  // already paid?
  const isPaid = parcelInfo?.payload_status === "paid";

  const amount = parcelInfo.delivery_cost || parcelInfo.deliveryCost || 0;

  const amountInCents = Math.round(amount * 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!stripe || !elements || isPaid) return;

    setProcessing(true);

    const card = elements.getElement(CardElement);
    if (!card) return;

    try {
      const { error: pmError } = await stripe.createPaymentMethod({
        type: "card",
        card,
      });

      if (pmError) {
        setProcessing(false);
        return setError(pmError.message);
      }

      const { data } = await axiosSecure.post("/create-payment-intent", {
        amountInCents,
        parcelId: trackingId,
      });

      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: {
            card,
            billing_details: {
              name: user?.displayName || "Customer",
              email: user?.email,
            },
          },
        });

      if (confirmError) {
        setProcessing(false);
        return setError(confirmError.message);
      }

      if (paymentIntent.status === "succeeded") {
        await axiosSecure.post("/payment/success", {
          parcelId: parcelId,
          user_email: user?.email,
          sender_name:
            parcelInfo?.sender_name || user?.displayName || "Customer",
          paymentIntentId: paymentIntent.id,
          amountInCents,
          tracking_id: trackingId,
        });
        setSuccess("Payment successful!");
        setProcessing(false);

        // ⏩ redirect after short delay
        setTimeout(() => {
          navigate("/dashboard/PaymentHistory");
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setProcessing(false);
      setError("Payment failed. Please try again.");
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="p-4 border rounded-xl space-y-3 bg-white shadow-md max-w-md mx-auto"
      >
        <h2 className="text-xl font-semibold text-green-600">
          Pay Amount: ৳{amount}
        </h2>

        {isPaid && (
          <p className="text-blue-600 font-medium">
            ✅ This parcel is already paid
          </p>
        )}

        {!isPaid && (
          <CardElement className="p-3 border rounded-lg bg-white text-black" />
        )}

        <button
          className="btn btn-primary w-full"
          type="submit"
          disabled={!stripe || processing || isPaid}
        >
          {processing
            ? "Processing..."
            : isPaid
            ? "Already Paid"
            : `Pay ৳${amount}`}
        </button>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
