import React from "react";
import { Clock, Users, Bell, Shield, Star, Zap } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Clock,
      title: "Real-time Availability",
      description:
        "See live court availability and book instantly without waiting for confirmations.",
    },
    {
      icon: Users,
      title: "Easy Group Booking",
      description:
        "Invite friends or join existing groups. Perfect for doubles matches and tournaments.",
    },
    {
      icon: Bell,
      title: "Smart Reminders",
      description:
        "Get notified about upcoming matches and easily manage cancellations if plans change.",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description:
        "Safe and secure payment processing with instant booking confirmations.",
    },
    {
      icon: Star,
      title: "Player Ratings",
      description:
        "Rate and review players to build a trusted community of sports enthusiasts.",
    },
    {
      icon: Zap,
      title: "Instant Matching",
      description:
        "Get matched with players of similar skill levels for competitive and fun games.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Project Play App?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to discover, book, and enjoy Padle and
            pickleball matches with fellow enthusiasts.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
