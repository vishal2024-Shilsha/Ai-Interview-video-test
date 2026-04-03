import { useNavigate } from "react-router-dom";
import { SectionHeader } from "../../libs/Divider";

function UserSegments({ nav }) {
  const segs = [
    {
      icon: "🏛️",
      title: "Colleges",
      sub: "Universities & Institutes",
      color: "from-purple-500 to-indigo-600",
      perks: [
        "Batch performance analytics",
        "Rank students by skill",
        "AI progress reports",
        "Placement export tools",
      ],
    },
    {
      icon: "💼",
      title: "Recruiters",
      sub: "Companies & Startups",
      color: "from-sky-500 to-cyan-500",
      perks: [
        "Filter by AI score",
        "Verified assessments",
        "AI hiring suggestions",
        "60% faster hiring",
      ],
    },
  ];

  const navigate=useNavigate();

  return (
    <section className="py-24 px-6 bg-linear-to-b from-white to-[#f4f6f8]">
      <SectionHeader
          title="Built for Everyone in the Ecosystem"
          sub="From students improving skills to parents tracking growth — everyone benefits."
        />
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT SIDE (TEXT + IMAGE) */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl  text-gray-900 leading-tight mb-6">
               <span className="text-blue">Every Collages Campus & Company</span>
            </h2>

            <p className="text-gray-600 text-lg">
              Whether you're a college managing placements or a recruiter hiring top talent —
              our AI platform helps you make smarter, faster decisions.
            </p>
          </div>

          {/* IMAGE */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978"
              alt="AI dashboard"
              className="rounded-2xl shadow-xl w-full object-cover"
            />

            {/* subtle overlay card */}
            <div className="absolute -bottom-6 left-6 bg-white rounded-xl shadow-lg p-4 w-48">
              <p className="text-sm font-semibold text-gray-800">
                ⚡ AI Insights
              </p>
              <p className="text-xs text-gray-500">
                Real-time analytics & smart recommendations
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (CARDS) */}
        <div className="space-y-6">
          {segs.map((s, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-xl text-white bg-linear-to-r ${s.color}`}
                >
                  {s.icon}
                </div>

                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    {s.title}
                  </h3>
                  <p className="text-sm text-gray-500">{s.sub}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {s.perks.map((p) => (
                  <div key={p} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-green-500">✔</span>
                    {p}
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate("vendor-signup")}
                className={`w-full cursor-pointer py-2 rounded-lg text-white font-medium bg-linear-to-r ${s.color}`}
              >
                Continue →
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default UserSegments;