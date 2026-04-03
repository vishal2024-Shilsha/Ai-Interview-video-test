import { SectionHeader } from "../../libs/Divider";

function Features() {
  const items = [
    { icon: "💻", title: "Coding Tests", desc: "Real challenges with automated evaluation across 30+ languages. Judge code quality, time complexity, and correctness." },
    { icon: "📋", title: "MCQ Assessments", desc: "Adaptive multiple-choice tests covering domain knowledge, aptitude, verbal ability, and logical reasoning." },
    { icon: "🤖", title: "AI Feedback Engine", desc: "LLM-powered analysis generates personalized insights, improvement roadmaps, and hiring recommendations instantly." },
    { icon: "🎯", title: "Role-Based Tests", desc: "Specialized assessments for MBA, B.Tech, BCA, Commerce — aligned with real industry hiring requirements." },
    { icon: "🪙", title: "Credit System", desc: "Fair, transparent model — 1 credit per attempt. Trial credits included free; colleges and companies buy in bulk." },
    { icon: "📈", title: "Analytics Dashboard", desc: "Real-time dashboards for colleges and recruiters — track performance, compare cohorts, and spot top talent." },
  ];
  return (
    <section id="features" className="py-24 px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title="Everything You Need to Hire on Merit"
          sub="A complete assessment ecosystem — from test delivery to AI-powered candidate insights."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-7 border border-[#E2EDF8] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(43,127,255,0.1)] hover:border-blue-200 transition-all cursor-default"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-base font-bold text-[#0F2744] mb-2.5">{f.title}</h3>
              <p className="text-sm text-[#3A5068] leading-relaxed m-0">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features