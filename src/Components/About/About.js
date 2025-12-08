export default function About() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6">👯‍♀️ About Us</h1>

        <p className="text-lg text-gray-700 mb-10 leading-relaxed">
          We are friends (and roommates) who enjoy running and keeping track of 
          our and our friends' progress throughout our running journeys!
        </p>

        {/* 3 Vertical Images */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <img
            src="/images/about3.jpeg"
            alt="Us at the last football game"
            className="w-full h-[500px] object-cover rounded-2xl shadow-md"
          />
          <img
            src="/images/about2.jpeg"
            alt="Us in London"
            className="w-full h-[500px] object-cover rounded-2xl shadow-md"
          />
          <img
            src="/images/about1.jpeg"
            alt="Us in the rain in London"
            className="w-full h-[500px] object-cover rounded-2xl shadow-md"
          />
        </div>
      </section>
    </div>
  );
}
