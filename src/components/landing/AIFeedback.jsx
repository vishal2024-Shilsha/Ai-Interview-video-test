import { useState } from "react";
import { BulletItem, SectionHeader } from "../../libs/Divider";

const feedbackData = {
  College: { name: "IIT Bombay — CS Batch 2024", role: "Batch Analytics", score: 78, tag: "Above Average", tagColor: "#7C3AED", tagBg: "#F3EEFF", strengths: ["Algorithms", "Web Development", "ML Fundamentals"], weaknesses: ["System Design", "Cloud Architecture"], insight: "Batch performance is 12% above national average. 34 students are in the top 10 percentile nationally. Recommend strengthening cloud and distributed systems curriculum.", rec: "82% placement readiness score", recColor: "#7C3AED", recBg: "#F3EEFF" },
  Recruiter: { name: "Rahul Gupta", role: "Full Stack Engineer", score: 91, tag: "Top 5% Nationally", tagColor: "#D97706", tagBg: "#FEF3C7", strengths: ["React & Node.js", "API Design", "Database Optimization"], weaknesses: ["DevOps / CI-CD"], insight: "Rahul is an exceptional full-stack candidate with production-level coding ability. His system design scores place him in the top 5% of all assessments this quarter.", rec: "Strongly Recommended for Senior Dev Roles", recColor: "#16A34A", recBg: "#EAF7ED" },
};

function AIFeedback() {
  const [active, setActive] = useState("College");
  const d = feedbackData[active];

  return (
    <section className="py-24 px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title="Instant AI Feedback for Every Assessment"
          sub="Our LLM analyzes every test in real time — delivering personalized insights for each stakeholder."
          badge="AI-Powered Feedback Engine"
        />
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {Object.keys(feedbackData).map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`px-6 py-2.5 rounded-full border-[1.5px] text-sm font-semibold cursor-pointer transition-all ${
                active === t
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "bg-white border-[#E2EDF8] text-[#6B84A0] hover:border-blue-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-[#E2EDF8] shadow-[0_20px_60px_rgba(43,127,255,0.1)] overflow-hidden">
          <div className="bg-linear-to-r from-[#F0F7FF] to-[#E6F4FF] px-8 py-7 border-b border-[#E2EDF8] flex flex-wrap justify-between items-start gap-4">
            <div>
              <div className="text-[10px] font-bold text-[#6B84A0] mb-1.5 uppercase tracking-wider">
                AI Assessment Report · {active} View
              </div>
              <h3 className="text-xl font-extrabold text-[#0F2744] m-0">{d?.name}</h3>
              <div className="text-sm text-[#6B84A0] mt-1">{d?.role}</div>
            </div>
            <div className="flex gap-4 items-center">
              <div className="text-center">
                <div className="text-4xl font-black text-blue-500 leading-none">{d?.score}</div>
                <div className="text-[10px] text-[#6B84A0] mt-0.5">AI Score</div>
              </div>
              <div
                className="text-xs font-bold px-4 py-1.5 rounded-full"
                style={{ background: d?.tagBg, color: d?.tagColor }}
              >
                {d?.tag}
              </div>
            </div>
          </div>
          <div className="px-8 py-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-[10px] font-bold text-green-600 mb-3 uppercase tracking-wider">✓ Strengths</div>
              {d?.strengths?.map((s) => <BulletItem key={s} color="#16A34A" text={s} />)}
            </div>
            <div>
              <div className="text-[10px] font-bold text-red-600 mb-3 uppercase tracking-wider">⚠ Areas to Improve</div>
              {d?.weaknesses?.map((w) => <BulletItem key={w} color="#DC2626" text={w} />)}
            </div>
          </div>
          <div className="px-8 pb-7">
            <div className="bg-linear-to-br from-blue-50 to-sky-50 rounded-2xl p-5 border border-blue-200">
              <div className="text-xs font-bold text-blue-500 mb-2.5">🤖 AI INSIGHT</div>
              <p className="text-sm text-[#3A5068] leading-relaxed mb-3">{d?.insight}</p>
              <span
                className="text-sm font-semibold px-4 py-2 rounded-lg inline-block"
                style={{ color: d?.recColor, background: d?.recBg }}
              >
                🛡 {d?.rec}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AIFeedback