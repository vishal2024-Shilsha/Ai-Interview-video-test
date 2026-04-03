import { SectionHeader } from "../../libs/Divider";

function Testimonials() {
  const t = [
    { q: "EbenchCampus transformed our placement process. We now filter top 50 candidates in minutes instead of days, and our offer acceptance rate jumped 40%.", n: "Anjali Kapoor", r: "Placement Head, IIT Delhi", i: "AK", c: "#2B7FFF" },
    { q: "The AI feedback was eye-opening. I knew I was weak in system design, but the roadmap it gave me helped me crack three SDE interviews in one month.", n: "Rohan Verma", r: "B.Tech CSE Student, NIT Trichy", i: "RV", c: "#7C3AED" },
    { q: "We've reduced our campus hiring cost by 55%. The AI-generated candidate summaries mean our HR team can shortlist 200 profiles in under an hour.", n: "Vikram Sethi", r: "VP Engineering, Razorpay", i: "VS", c: "#0FA8E0" },
    { q: "As a parent, I finally understand my daughter's academic strengths. The monthly AI reports are clear, actionable, and so much better than a marksheet.", n: "Sunita Menon", r: "Parent, Bengaluru", i: "SM", c: "#D97706" },
  ];
  return (
    <section id="review" className="py-24 px-8 bg-linear-to-b from-[#F7FBFF] to-[#EFF6FF]">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title="Trusted by Thousands"
          sub="Students, colleges, recruiters, and parents — all seeing real results."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.map((x, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-7 border border-[#E2EDF8] shadow-[0_4px_16px_rgba(43,127,255,0.05)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(43,127,255,0.1)] transition-all"
            >
              <div className="flex gap-0.5 mb-3">
                {"⭐⭐⭐⭐⭐".split("").map((s, j) => (
                  <span key={j} className="text-yellow-400 text-sm">{s}</span>
                ))}
              </div>
              <p className="text-sm text-[#3A5068] leading-relaxed mb-5 italic">"{x.q}"</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-extrabold shrink-0"
                  style={{ background: x.c + "20", color: x.c }}
                >
                  {x.i}
                </div>
                <div>
                  <div className="text-sm font-bold text-[#0F2744]">{x.n}</div>
                  <div className="text-xs text-[#6B84A0] mt-0.5">{x.r}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;