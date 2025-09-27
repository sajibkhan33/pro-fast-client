import React from "react";
import { useQuery } from "@tanstack/react-query";

import {
  FaCheckCircle,
  FaBoxOpen,
  FaShippingFast,
  FaMoneyBill,
} from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const statusIcons = {
  delivered: <FaCheckCircle className="text-4xl text-success" />,
  in_transit: <FaShippingFast className="text-4xl text-warning" />,
  not_collected: <FaBoxOpen className="text-4xl text-error" />,
};

const paymentIcons = {
  paid: <FaMoneyBill className="text-4xl text-success" />,
  unpaid: <FaMoneyBill className="text-4xl text-error" />,
};

export default function UserDashboard() {
  const axiosSecure = useAxiosSecure();

  const {
    data: parcels = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userParcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/user"); // backend endpoint for user parcels
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  if (isError)
    return (
      <div className="text-center text-red-600 mt-10">
        Error loading data: {error.message}
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Your Parcels</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {parcels.map((parcel) => (
          <div
            key={parcel._id}
            className="card bg-base-100 shadow-md border border-base-200 p-6 flex flex-col gap-3"
          >
            <h2 className="text-lg font-semibold">{parcel.title}</h2>
            <p>Tracking ID: {parcel.tracking_id}</p>
            <p>Status: {parcel.delivery_status}</p>
            <p>Payment: {parcel.payment_status}</p>
            {statusIcons[parcel.delivery_status]}
            {paymentIcons[parcel.payment_status]}
          </div>
        ))}
      </div>
    </div>
  );
}
