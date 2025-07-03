import React from "react";
import { Search, MapPin, Calendar } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Choose Your Game",
      description:
        "Select from Padle or pickleball matches in your area. Filter by skill level and court type.",
    },
    {
      icon: MapPin,
      title: "Pick Location & Time",
      description:
        "Browse available courts near you. Check real-time availability and choose your preferred time slot.",
    },
    {
      icon: Calendar,
      title: "Book and Play",
      description:
        "Confirm your booking instantly. Get reminders and connect with other players before the match.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get on the court in three simple steps. It's never been easier to
            find and book your next match.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-200 transition-colors duration-300">
                  <step.icon className="w-10 h-10 text-blue-600" />
                </div>

                {/* Step number */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>

                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-24 h-0.5 bg-gray-200">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
