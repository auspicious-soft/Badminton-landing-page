import React from 'react'

const CancellationAndRefund = () => {
   return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-16 mt-4">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-3">
          Cancellation & Refund Policy
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
          We value fair play and flexibility. Please read our policy carefully
          regarding game cancellations, modifications, and refunds.
        </p>
      </div>

      {/* Cancellation Rules */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Who Can Cancel or Modify a Booking?
        </h2>
        <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
          <li>Only the <strong>creator of the booking</strong> can cancel or modify it.</li>
          <li>
            Modifications or cancellations are allowed only up to <strong>24 hours before the game start time</strong>.
          </li>
          <li>
            Private bookings or bookings not created by the user cannot be modified.
          </li>
          <li>
            Cancelled bookings <strong>cannot be modified</strong>.
          </li>
        </ul>
        <p className="text-gray-700  mt-4 font-medium">
          Important Messages:
        </p>
        <ul className="list-disc list-inside text-gray-700  space-y-1 mt-2">
          <li> Modifications are only allowed up to 24 hours before the booking start time.</li>
          <li>Only private and upcoming bookings created by the creator are allowed to modify.</li>
          <li> Cancelled bookings cannot be modified.</li>
        </ul>
      </div>

      {/* Refund Policy */}
      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Refunds
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Payments are collected upfront for all bookings. Refunds are available 
          <strong> only if the game is cancelled</strong> by the creator or admin.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          Refunds will be issued in <strong>Play Coins</strong>, which can be 
          used to book future games on our platform. No cash refunds are provided.
        </p>
        <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
          <li>Refunds are not available for bookings cancelled after 24 hours of the game start time.</li>
          <li>Only the booking creator can trigger cancellations and receive Play Coins.</li>
          <li>Once refunded, Play Coins can be used immediately for new bookings.</li>
        </ul>
      </div>

      {/* Additional Notes */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Additional Notes
        </h2>
        <p className="text-gray-700 leading-relaxed mb-3">
          Please plan your bookings carefully. To ensure fairness and smooth gameplay, 
          cancellations are strictly regulated. Always check your booking details and 
          timing before attempting any modifications.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Our support team is available to assist with cancellations or questions regarding Play Coins. 
          Contact us at <span className="text-indigo-600 font-medium">projectplayapp@gmail.com</span> if needed.
        </p>
      </div>

      {/* Footer */}
      <div className="text-center">
        <p className="text-gray-600">
          Thank you for booking with us. We aim to provide a fair and enjoyable experience for every player.
        </p>
        
      </div>
    </div>
  );
};
export default CancellationAndRefund