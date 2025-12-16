import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/UseAuth";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  console.log("user this isn", user);

  const { parcelId } = useParams();
  const trackingId = parcelId;

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch Parcel
  const { data: parcelInfo = {}, isPending } = useQuery({
    queryKey: ["parcel", trackingId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${trackingId}`);
      return res.data;
    },
  });

  console.log("Parcel Info:", parcelInfo);

  if (isPending)
    return (
      <div className="w-full flex justify-center mt-10">
        <span className="loading loading-dots loading-xl"></span>
      </div>
    );

  // FIX: safe amount
  const amount =
    parcelInfo.delivery_cost || parcelInfo.deliveryCost || parcelInfo.cost || 0;

  const amountInCents = Math.round(amount * 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    try {
      // 1. Create payment method
      const { error: pmError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card,
        });

      if (pmError) return setError(pmError.message);

      // 2. Create payment-intent
      const { data } = await axiosSecure.post("/create-payment-intent", {
        amountInCents,
        parcelId: trackingId,
      });

      const clientSecret = data.clientSecret;

      // 3. Confirm payment
      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: card,
            billing_details: {
              name: user?.displayName || parcelInfo?.sender_name || "Customer",
              email: user?.email || "no-email@example.com",
              phone: user?.phoneNumber || parcelInfo?.sender_phone || null,
              address: {
                line1: parcelInfo?.address_line1 || "",
                line2: parcelInfo?.address_line2 || "",
                city: parcelInfo?.city || "",
                state: parcelInfo?.state || "",
                postal_code: parcelInfo?.postal_code || "",
                country: parcelInfo?.country || "US",
              },
            },
          },
        });

      if (confirmError) return setError(confirmError.message);

      // 4. Update parcel as paid
      //----SAVE PAYMENT HISTORY IN DB---
      if (paymentIntent.status === "succeeded") {
        await axiosSecure.post("/payment/success", {
          parcelId: trackingId,
          user_email: user?.email,
          paymentIntentId: paymentIntent.id,
          amountInCents,
          tracking_id: trackingId,
        });

        setSuccess("Payment successful!");
      }
    } catch (err) {
      console.error(err);
      setError("Payment failed. Please try again.");
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="p-4 border rounded-xl space-y-2 bg-white shadow-md max-w-md mx-auto"
      >
        <h2 className="text-xl font-semibold mb-2 text-green-500">
          Pay Amount: ৳{amount}
        </h2>

        <CardElement className="p-3 border rounded-lg bg-white text-black" />

        <button
          className="btn btn-primary w-full text-black mt-3"
          type="submit"
        >
          Pay ৳{amount}
        </button>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
