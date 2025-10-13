import React from "react";

const CancellationAndRefund = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-16 mt-4">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-3">
          Cancellation & Refund Policy
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
          At Project Play, we strive to provide a fair and transparent experience for all users.
          Please review our cancellation and refund policy carefully before making any bookings.
        </p>
      </div>

      {/* Cancellation Policy */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Cancellation Policy
        </h2>
        <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
          <li>
            Only the <strong>creator of the booking</strong> can cancel or modify it.
          </li>
          <li>
            Cancellations or modifications are allowed only up to{" "}
            <strong>24 hours before the game start time</strong>.
          </li>
          <li>
            Cancellations or modifications are not allowed within 24 hours of the game start time.
          </li>
          <li>
            <strong>Partial cancellations</strong> (for individual players within a booking)
            are not supported.
          </li>
          <li>
            If a game is cancelled by the admin, creator, or system (due to technical reasons or low
            player count), all affected users will automatically receive a refund in Play Coins.
          </li>
        </ul>
      </div>

      {/* Refund Policy */}
      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Refund Policy
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          All payments for bookings on Project Play are collected in advance. Refunds are processed
          instantly in the form of <strong>Play Coins</strong> when a booking is cancelled — either
          by the user (within the allowed time window) or by the admin/creator.
        </p>
        <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
          <li>
            <strong>Refund Processing Time:</strong> Refunds are issued instantly at the time of
            cancellation.
          </li>
          <li>
            <strong>Refund Mode:</strong> All refunds are credited as Play Coins to the user’s
            account. Play Coins can be used for future bookings but cannot be withdrawn or converted
            to real money.
          </li>
          <li>
            Refunds are applicable only if the cancellation occurs at least 24 hours before the game
            start time.
          </li>
          <li>
            No refunds are issued once the game has started or if the user fails to attend
            (no-show).
          </li>
          <li>
            If a game is cancelled by the admin, creator, or system, all affected users will
            automatically receive a full refund in Play Coins.
          </li>
        </ul>
      </div>

      {/* Additional Notes */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Additional Notes</h2>
        <p className="text-gray-700 leading-relaxed mb-3">
          Please plan your bookings carefully and review game details before confirming. All refund
          and cancellation actions follow our automated system to ensure fairness and transparency
          for every player.
        </p>
        <p className="text-gray-700 leading-relaxed">
          For any questions or assistance related to cancellations or Play Coins, please contact our
          support team at{" "}
          <span className="text-indigo-600 font-medium">
            projectplayapp@gmail.com
          </span>.
        </p>
      </div>

      {/* Footer */}
      <div className="text-center">
        <p className="text-gray-600">
          Thank you for playing with Project Play. We’re committed to providing a smooth and fair
          experience for every user.
        </p>
      </div>
    </div>
  );
};

export default CancellationAndRefund;
