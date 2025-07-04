
const AppShowcase = () => {
  const screenshots = [
    {
      title: "Browse Courts",
      image:
        "../../src/pexels-roger-aribau-gisbert-19420784-8485104.jpg",
    },
    {
      title: "Book Matches",
      image:
        "../../src/high-angle-palettes-balls.jpg",
    },
    {
      title: "Track Games",
      image:
        "../../src/sporty-women-playing-paddle-tennis.jpg",
    },
  ];

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Experience Project Play App
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Intuitive design meets powerful functionality. See how easy it is to
            find and book your next match.
          </p>
        </div>

        <div className="relative">
          {/* Desktop View */}
          <div className="hidden md:flex justify-center items-center gap-8">
            {screenshots.map((screenshot, index) => (
              <div
                key={index}
                className={`relative transform transition-all duration-500 hover:scale-105 ${
                  index === 1 ? "scale-110 z-10" : "scale-100"
                }`}
              >
                <div className="bg-white rounded-3xl shadow-2xl p-2">
                  <img
                    src={screenshot.image}
                    alt={screenshot.title}
                    className="w-64 h-auto rounded-3xl"
                  />
                </div>

                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                  <div className="bg-white rounded-lg shadow-lg px-4 py-2">
                    <p className="font-semibold text-sm text-gray-900">
                      {screenshot.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            <div className="flex overflow-x-auto gap-6 pb-8">
              {screenshots.map((screenshot, index) => (
                <div key={index} className="flex-shrink-0">
                  <div className="bg-white rounded-3xl shadow-xl p-2 w-48">
                    <img
                      src={screenshot.image}
                      alt={screenshot.title}
                      className="w-full h-auto rounded-3xl"
                    />
                  </div>

                  <div className="text-center mt-4">
                    <p className="font-semibold text-sm text-gray-900">
                      {screenshot.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 bg-blue-50 rounded-full px-6 py-3">
            <span className="text-blue-600 font-medium">Available on</span>
            <div className="flex gap-4">
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                <span className="font-semibold text-gray-900">iOS</span>
              </div>
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                <span className="font-semibold text-gray-900">Android</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppShowcase;
