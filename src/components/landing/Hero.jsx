import { useNavigate } from "react-router-dom";
import { Pill } from "../../libs/Divider";
import { useState, useEffect } from "react";

function HeroDashboard() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_24px_80px_rgba(43,127,255,0.14),0_4px_16px_rgba(0,0,0,0.05)] border border-[#E2EDF8]">
      <div className="flex justify-between items-center mb-5">
        <div>
          <div className="text-xs text-[#6B84A0] mb-0.5">AI Analysis Report</div>
          <div className="text-base font-bold text-[#0F2744]">Arjun Sharma • B.Tech CS</div>
        </div>
        <span className="bg-green-50 text-green-600 text-xs font-bold px-3 py-1.5 rounded-full">Hire Recommended</span>
      </div>
      <div className="flex gap-3 mb-5">
        {[["Overall Score", "87%", "#2B7FFF"], ["Coding", "92%", "#0FA8E0"], ["Problem Solving", "78%", "#7C3AED"]].map(([l, v, c]) => (
          <div key={l} className="flex-1 bg-[#F0F7FF] rounded-xl py-3 text-center">
            <div className="text-2xl font-black" style={{ color: c }}>{v}</div>
            <div className="text-[10px] text-[#6B84A0] mt-0.5 leading-tight">{l}</div>
          </div>
        ))}
      </div>
      {[["Data Structures", 90], ["System Design", 72], ["SQL & Databases", 84]].map(([s, p]) => (
        <div key={s} className="mb-3">
          <div className="flex justify-between mb-1">
            <span className="text-xs font-semibold text-[#3A5068]">{s}</span>
            <span className="text-xs font-bold text-blue-500">{p}%</span>
          </div>
          <div className="h-1.5 bg-[#EBF4FD] rounded-full">
            <div
              className="h-full bg-linear-to-r from-blue-500 to-sky-400 rounded-full"
              style={{ width: `${p}%` }}
            />
          </div>
        </div>
      ))}
      <div className="mt-4 bg-linear-to-br from-blue-50 to-sky-50 rounded-xl p-4 border border-blue-200">
        <div className="text-xs font-bold text-blue-500 mb-1.5">🤖 AI INSIGHT</div>
        <p className="text-xs text-[#3A5068] leading-relaxed m-0">
          Strong algorithmic thinking with exceptional DSA performance. Recommend for senior engineering roles with mentorship in system design.
        </p>
      </div>
    </div>
  );
}

// ─── HERO ──────────────────────────────────────────────────────────────

function Hero({ nav }) {
  const navigate = useNavigate();
  const phrases = ["Skill Assessment", "Talent Matching", "Team Building", "Hiring Decisions"];

  const [displayed, setDisplayed] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex];
    let timeout;

    if (!deleting) {
      if (displayed.length < current.length) {
        timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
      } else {
        timeout = setTimeout(() => setDeleting(true), 1600);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
      } else {
        setDeleting(false);
        setPhraseIndex((i) => (i + 1) % phrases.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, phraseIndex]);
 


  return (
    <section className="relative px-8 py-10 overflow-hidden bg-linear-to-br from-[#F0F7FF] via-[#EBF4FD] to-[#F7FBFF]">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-radial from-blue-500/10 to-transparent pointer-events-none" />
      <div className="absolute -bottom-16 -left-20 w-80 h-80 rounded-full bg-gradient-radial from-sky-400/8 to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto flex flex-wrap gap-16 items-">
        <div className="flex-1 min-w-[300px] max-w-[580px]">
          <Pill>AI-Powered Campus Hiring Platform</Pill>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-[#0F2744] mb-6 tracking-tight">
            Hire Smarter with<br />
            <span className="bg-linear-to-r from-blue-500 to-sky-400 bg-clip-text text-transparent">
              AI-Powered
            </span>
            <p className="">{displayed}</p>
          </h1>
          <p className="text-lg text-[#3A5068] leading-relaxed mb-10 max-w-[480px]">
            Beyond degrees — evaluate real talent with intelligent insights. Coding tests, MCQs, and role-based assessments analyzed by AI in real time.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/vendor-signup")}
              className="text-base cursor-pointer font-bold text-white px-8 py-4 rounded-xl bg-linear-to-r from-blue-500 to-sky-400 shadow-[0_6px_24px_rgba(43,127,255,0.4)] hover:shadow-[0_12px_32px_rgba(43,127,255,0.5)] hover:-translate-y-0.5 transition-all"
            >
              Start Free Trial →
            </button>
            <button onClick={() => navigate('/login')} className=" cursor-pointer text-base font-semibold text-blue-500 px-8 py-4 rounded-xl bg-white border-[1.5px] border-blue-200 hover:bg-[#F0F7FF] hover:border-blue-500 transition-all">
              Login
            </button>
          </div>
          <div className="mt-12 flex flex-wrap gap-9">
            {[["50K+", "Students Assessed"], ["800+", "Companies Hiring"], ["200+", "Colleges Onboard"]].map(([n, l]) => (
              <div key={l}>
                <div className="text-2xl font-extrabold text-[#0F2744]">{n}</div>
                <div className="text-xs text-[#6B84A0] mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 min-w-[320px] mt-8 max-w-[520px]">
          <HeroDashboard />
        </div>
      </div>
    </section>
  );
}

export default Hero
