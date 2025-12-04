import React, { useEffect } from "react";

const ContactSupport = () => {
  useEffect(()=>{
    window.scroll(0,0)
  },[])
  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-16 mt-4">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-3">Contact Support</h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Need assistance with your account, have technical issues, or want to
          share feedback? Our support team is here to help you with all your
          concerns quickly and effectively.
        </p>
      </div>

      {/* About Support */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          How Our Support Works
        </h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          We value every user and ensure your issues are resolved promptly.
          Whether you’re facing login problems, feature glitches, or simply need
          guidance, our dedicated team reviews every ticket carefully.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Our response time typically ranges from <strong>4 to 24 hours</strong>,
          depending on the complexity of your query. For urgent issues, please
          use the direct contact options provided below.
        </p>
      </div>

      {/* Contact Info */}
      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 mb-12">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
          Ways to Reach Us
        </h3>
        <p className="text-gray-700 mb-3">
          <strong>Email:</strong> projectplayapp@gmail.com
        </p>
        <p className="text-gray-700 mb-3">
          <strong>Phone:</strong>+91-9878163333
        </p>
        <p className="text-gray-700 mb-3">
          <strong>Live Chat:</strong> Available on weekdays from 9 AM – 6 PM IST
        </p>
        <p className="text-gray-700">
          <strong>Office Address:</strong> #447, Sector 35A, Chandigarh
        </p>
      </div>

      {/* Response Time Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-12">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
          Expected Response Time
        </h3>
        <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
          <li>General inquiries: within 24 hours</li>
          <li>Billing or payment issues: within 12 hours</li>
          <li>Technical or login problems: within 6 hours</li>
          <li>Emergency downtime: immediate priority support</li>
        </ul>
      </div>

      {/* FAQ Section */}
      

      {/* Footer Info */}
      <div className="text-center">
        <p className="text-gray-600">
          Thank you for reaching out to us. We’re committed to ensuring your
          experience is smooth and satisfying.
        </p>
       
      </div>
    </div>
  );
};

export default ContactSupport;
