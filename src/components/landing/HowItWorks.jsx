import { SectionHeader } from "../../libs/Divider";

function HowItWorks() {
//   const steps = [
//     { num: "01", title: "Students Take Assessments", desc: "Students attempt coding tests, MCQs, and role-based assessments using their credit balance. Each attempt uses 1 credit.", color: "#2B7FFF", icon: "📝" },
//     { num: "02", title: "AI Analyzes Performance", desc: "Our LLM instantly analyzes results, identifies strengths and gaps, and generates detailed feedback for every stakeholder.", color: "#7C3AED", icon: "🤖" },
//     { num: "03", title: "Colleges & Recruiters Get Insights", desc: "Colleges monitor batch analytics. Recruiters filter top talent using AI summaries, verified scores, and hiring recommendations.", color: "#0FA8E0", icon: "📊" },
//   ];
const steps = [
  {
    num: "01",
    title: "Campus Uploads Candidate Data",
    desc: "Campus import candidate details into the platform. This creates a structured talent pool ready for assessments and tracking.",
    color: "#2B7FFF",
    icon: "📥"
  },
  {
    num: "02",
    title: "Assessment Link Sent",
    desc: "Candidates receive a secure test link to attempt coding tests, MCQs, or role-based assessments using allocated credits.",
    color: "#0FA8E0",
    icon: "🔗"
  },
  {
    num: "03",
    title: "AI Evaluates Performance",
    desc: "Our AI analyzes test results, identifies strengths, weaknesses, and generates detailed performance insights instantly.",
    color: "#7C3AED",
    icon: "🤖"
  },
  {
    num: "04",
    title: "Insights for Vendors & Parents",
    desc: "Vendors get hiring-ready insights, while parents receive AI feedback on their child’s performance with improvement guidance.",
    color: "#F59E0B",
    icon: "📊"
  },
  {
    num: "05",
    title: "Growth & Opportunities",
    desc: "Candidates receive personalized course suggestions, internships, training programs, and job opportunities based on their performance.",
    color: "#10B981",
    icon: "🚀"
  }
];
  return (
    <section id="how-it-works" className="py-24 px-8 bg-linear-to-b from-[#F7FBFF] to-[#EFF6FF]">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title="How It Works"
          sub="Three simple steps from assessment to hire — powered by AI at every stage."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {steps.map((s, i) => (
            <div
              key={i}
              className="relative bg-white rounded-2xl p-8 border border-[#E2EDF8] shadow-[0_8px_32px_rgba(43,127,255,0.07)] overflow-hidden hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(43,127,255,0.14)] transition-all cursor-default"
            >
              <div className="absolute top-2.5 right-1.5 text-7xl font-black text-[#F0F7FF] leading-none select-none">
                {s.num}
              </div>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-2xl"
                style={{ background: s.color, boxShadow: `0 6px 18px ${s.color}50` }}
              >
                {s.icon}
              </div>
              <h3 className="text-lg font-bold text-[#0F2744] mb-2.5">{s.title}</h3>
              <p className="text-sm text-[#3A5068] leading-relaxed m-0">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;