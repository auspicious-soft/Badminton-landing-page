import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How do I book a match?",
      answer:
        "Simply browse available courts in your area, select your preferred time slot, and confirm your booking. You'll receive instant confirmation and can invite other players to join your match.",
    },
    {
      question: "Can I cancel or reschedule my booking?",
      answer:
        "Yes, you can cancel or reschedule your bookings up to 2 hours before the match time. Cancellations made within 2 hours may be subject to a cancellation fee depending on the court's policy.",
    },
    {
      question: "How does payment work?",
      answer:
        "Payments are processed securely through the app when you confirm your booking. We accept all major credit cards and digital payment methods. You'll receive a receipt immediately after payment.",
    },
    {
      question: "What if I can't find other players?",
      answer:
        "Project Play App has a player matching feature that connects you with other players of similar skill levels in your area. You can also post open invitations for others to join your matches.",
    },
    {
      question: "Are there different skill levels?",
      answer:
        "Yes, players can set their skill level in their profile (Beginner, Intermediate, Advanced). This helps match you with players of similar abilities for more enjoyable games.",
    },
    {
      question: "What sports are available?",
      answer:
        "Currently, Project Play App supports paddle tennis and pickleball. We're constantly expanding to include more racquet sports based on user demand in different regions.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Got questions? We've got answers. Find everything you need to know
            about booking matches with Project Play App.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg mb-4 overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>

              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
