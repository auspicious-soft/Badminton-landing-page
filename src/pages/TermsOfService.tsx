import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms and Conditions
          </h1>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Liability for Damages
            </h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>The customer agrees to be liable for any damage caused to the equipment, court, or surrounding areas during the rental period.</li>
              <li>Any damage incurred shall be the responsibility of the customer, and they will be liable for the cost of repair or replacement.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Injury Disclaimer
            </h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>We accept no responsibility for any injury sustained by the customer or any participant during the course of the activity.</li>
              <li>Customers engage in the activity at their own risk and should take appropriate precautions to ensure their safety.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Cancellation & Refund Policy
            </h2>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Cancellations made within 12 hours of the scheduled booking may incur a cancellation fee.</li>
              <li>The specific cancellation fee and the timeframe for cancellations will be communicated at the time of booking.</li>
              <li>
                In case of cancellation of the slot due to factors outside the control of the Company such as Power Failures and Inclement Weather, the Company shall provide the customer with a credit note of the amount paid at the time of booking, to be used within 2 weeks (14 days) from the date of issuance of the Credit Note. The Credit Note shall be non-transferable and in no circumstances can be redeemed for cash.
              </li>
            </ul>
            {/* <h3 className="text-xl font-medium text-gray-900 mb-3">Partial Play Refund Policy</h3> */}
            <p className="text-gray-700 leading-relaxed mb-4">
              In case of reduction of the slot time due to factors outside the control of the Company such as Power Failures and Inclement Weather, the rate applicable will be as follows:
            </p>
            <table className="table-auto w-full text-gray-700 mb-4">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2">Time Played (in Mins)</th>
                  <th className="text-left py-2">Amount Payable (in %)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-2">0-10</td>
                  <td className="py-2">Nil</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2">11-20</td>
                  <td className="py-2">20% of Total Cost</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2">21-30</td>
                  <td className="py-2">30% of Total Cost</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2">31-40</td>
                  <td className="py-2">50% of Total Cost</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2">41-50</td>
                  <td className="py-2">70% of Total Cost</td>
                </tr>
                <tr>
                  <td className="py-2">51-59</td>
                  <td className="py-2">90% of Total Cost</td>
                </tr>
              </tbody>
            </table>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Refunds for cancellations will be subject to the terms outlined in the cancellation policy.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Booking Terms
            </h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>All bookings are subject to availability and must be made in advance.</li>
              <li>Customers are required to strictly adhere to the agreed booking times and durations and the same may not be extended by the Company for any delays caused by the customer.</li>
              <li>
                The Company reserves the right to utilise up to 5 (five) minutes from every slot for turn-over, sanitisation and maintenance of the playing area and the same shall be utilised from the slot of the customer. The company undertakes to keep the said time to a minimum to enable maximum utilisation of the slot by the customer.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Code of Conduct
            </h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Customers are expected to conduct themselves in a respectful manner at all times.</li>
              <li>Any behaviour deemed inappropriate or disruptive may result in the termination of the booking without refund.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Use of Equipment
            </h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Customers are responsible for using the equipment provided in a safe and appropriate manner.</li>
              <li>Any misuse of equipment may result in additional charges or the termination of the booking.</li>
              <li>
                Players are advised to wear appropriate footwear at all times while on the Playing Surface. Spikes, Heels or any other footwear deemed to be detrimental to the Playing Surface by the Management will not be allowed and the Management shall have the right to deny entry to the playing surface to any person deemed not to be in appropriate attire.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Rights of Admission
            </h2>
            <p className="text-gray-700 leading-relaxed">
              The management reserves the right to deny admission to any person it may deem fit for any reason whatsoever.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Indemnity
            </h2>
            <p className="text-gray-700 leading-relaxed">
              By using our facilities, customers agree to indemnify and hold harmless TuckBox Ventures LLP from any claims, damages, or liabilities arising from their use of the courts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Jurisdiction
            </h2>
            <li className="text-gray-700 leading-relaxed">
              These terms and conditions shall be governed by and construed in accordance with the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts in Chandigarh. All disputes shall be resolved by way of Arbitration under the rules of the Arbitration and Conciliation Act, 1996. The proceedings shall be conducted in the English Language and the seat of Arbitration shall be at Chandigarh.
            </li>
            <li className="text-gray-700 leading-relaxed">
              By booking our courts, you acknowledge that you have read, understood, and agree to abide by these terms and conditions.
            </li>
          </section>

          {/* <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Agreement
            </h2> */}
            
          {/* </section> */}

          {/* <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Contact Information
            </h2>
            <p className="text-gray-700 leading-relaxed">
              For questions about these Terms and Conditions, please contact us at:
            </p> */}
            {/* <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                Email:{" "}
                <a
                  href="mailto:support@tuckboxventures.com"
                  className="text-blue-600 hover:text-blue-700"
                >
                  support@tuckboxventures.com
                </a>
                <br />
                Address: TuckBox Ventures LLP, Chandigarh, India
              </p>
            </div> */}
          {/* </section> */}
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;