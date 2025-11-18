import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

const PrivacyPolicy = () => {

   useEffect(()=>{
      window.scrollTo(0, 0);
    },[]);
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
            Privacy Policy
          </h1>
          <p className="text-gray-600">Last updated: January 2025</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At Project Play App, we respect your privacy and are committed to
              protecting your personal data. This privacy policy explains how we
              collect, use, and safeguard your information when you use our
              mobile application and services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Information We Collect
            </h2>

            <h3 className="text-xl font-medium text-gray-900 mb-3">
              Personal Information
            </h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Name and contact information (email, phone number)</li>
              <li>Profile information (skill level, preferred sports)</li>
              <li>
                Payment information (processed securely through third-party
                providers)
              </li>
              <li>Location data (to show nearby courts and matches)</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-900 mb-3">
              Usage Information
            </h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>App usage patterns and preferences</li>
              <li>Match history and booking details</li>
              <li>Device information and identifiers</li>
              <li>Log data and analytics</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide and improve our booking services</li>
              <li>Match you with other players and available courts</li>
              <li>Process payments and send booking confirmations</li>
              <li>Send important notifications about your matches</li>
              <li>Provide customer support</li>
              <li>Analyze usage patterns to improve our app</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Information Sharing
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell your personal information. We may share your
              information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                With other players when you join matches (name and skill level
                only)
              </li>
              <li>With court partners to facilitate bookings</li>
              <li>With service providers who help us operate our app</li>
              <li>When required by law or to protect our rights</li>
              <li>In connection with a business transfer or merger</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Data Security
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational measures to
              protect your personal information against unauthorized access,
              alteration, disclosure, or destruction. However, no method of
              transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your Rights
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Access and update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of marketing communications</li>
              <li>Request a copy of your data</li>
              <li>Object to certain processing activities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about this Privacy Policy or our data
              practices, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                Email:{" "}
                <a
                  href="mailto:tuckboxventures@gmail.com"
                  className="text-blue-600 hover:text-blue-700"
                >
                  tuckboxventures@gmail.com
                </a>
                <br />
                Address: #447, sector-35A, Chandigarh, 160022. 
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
