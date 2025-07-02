import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: January 2025</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using MatchAce, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Description</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              MatchAce is a mobile application that connects players for paddle and pickleball matches. Our service includes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Court booking and reservation system</li>
              <li>Player matching and communication features</li>
              <li>Payment processing for court fees</li>
              <li>Match scheduling and reminder services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Responsibilities</h2>
            <p className="text-gray-700 leading-relaxed mb-4">As a user of MatchAce, you agree to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Use the service in compliance with all applicable laws</li>
              <li>Respect other players and maintain good sportsmanship</li>
              <li>Honor your booking commitments or cancel with appropriate notice</li>
              <li>Pay all fees associated with your bookings</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Booking and Cancellation Policy</h2>
            
            <h3 className="text-xl font-medium text-gray-900 mb-3">Bookings</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>All bookings are subject to court availability</li>
              <li>Payment is required at the time of booking</li>
              <li>Booking confirmations will be sent via email and app notification</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-900 mb-3">Cancellations</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Cancellations made 24+ hours in advance: Full refund</li>
              <li>Cancellations made 2-24 hours in advance: 50% refund</li>
              <li>Cancellations made less than 2 hours in advance: No refund</li>
              <li>Weather-related cancellations may be eligible for full refund</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Payment Terms</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>All payments are processed securely through third-party providers</li>
              <li>Court fees are set by individual court partners</li>
              <li>MatchAce may charge a service fee for bookings</li>
              <li>Refunds will be processed to the original payment method</li>
              <li>You are responsible for any applicable taxes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Prohibited Activities</h2>
            <p className="text-gray-700 leading-relaxed mb-4">You may not use MatchAce to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Violate any laws or regulations</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Share false or misleading information</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use the service for commercial purposes without permission</li>
              <li>Create multiple accounts to circumvent restrictions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              MatchAce provides the platform to connect players and book courts. We are not responsible for the condition of courts, player conduct during matches, injuries that may occur, or disputes between players. Use of our service is at your own risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Account Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to suspend or terminate accounts that violate these terms. You may also delete your account at any time through the app settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              For questions about these Terms of Service, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                Email: <a href="mailto:legal@matchace.com" className="text-blue-600 hover:text-blue-700">legal@matchace.com</a><br />
                Address: 123 Sports Ave, San Francisco, CA 94102
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;