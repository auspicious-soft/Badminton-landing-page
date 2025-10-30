import React from "react";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Mansi Bhandari",
      role: "Pickleball Enthusiast",
      content:
        "Project Play App has completely changed how I find games. I've met so many great players and never struggle to find a court anymore!",
      rating: 5,
      avatar:
        "../../../public/Ellipse 353.png",
    },
    {
      name: "Tushar Thakur",
      role: "Padel Player",
      content:
        "The real-time availability feature is a game-changer. I can book courts on my lunch break and play immediately after work.",
      rating: 5,
      avatar:
        "../../../public/Ellipse 352.png",
    },
    {
      name: "Punnet Kumar",
      role: "Tournament Organizer",
      content:
        "Group booking makes organizing tournaments so much easier. The app handles everything from invites to payment confirmations.",
      rating: 5,
      avatar:
        "../../../public/Ellipse 351.png",
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Players Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied players who've transformed their game
            with Project Play App.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 relative"
            >
              <Quote className="w-8 h-8 text-blue-200 mb-4" />

              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-sm">
            <div className="flex -space-x-2">
              {testimonials.map((testimonial, index) => (
                <img
                  key={index}
                  src={testimonial.avatar}
                  alt=""
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <span className="text-gray-600 text-sm ml-2">
              +2,500 happy players
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
