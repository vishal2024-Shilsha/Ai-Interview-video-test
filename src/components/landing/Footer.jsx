import { Logo } from "./Navbar";

function Footer({ nav }) {
  return (
    <footer className="bg-[#0F2744] text-[#94B8D8] px-8 pt-5 pb-7">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 items-baseline mb-12">
          <div className="col-span-2 md:col-span-1 ">
            <Logo nav={nav} item={true} width={190} />
            <p className="text-sm leading-relaxed max-w-[280px] text-[#6B84A0] mt-3">
              AI-powered campus hiring platform connecting students, colleges, and recruiters through skill-based assessments.
            </p>
            <div className="flex gap-2.5 mt-5">
              {["Li", "Tw", "Fb", "Yt"].map((s) => (
                <div
                  key={s}
                  className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400 cursor-pointer hover:bg-blue-500/30 transition-colors"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
          {[["Product", ["Features", "How It Works", "Pricing", "API Docs", "Changelog"]], ["Company", ["About Us", "Blog", "Careers", "Press Kit", "Contact"]], ["Legal", ["Privacy Policy", "Terms of Service", "Cookie Policy", "Security", "GDPR"]]].map(([h, ls]) => (
            <div key={h}>
              <div className="text-xs font-bold text-white mb-4 uppercase tracking-wider">{h}</div>
              {ls.map((l) => (
                <div key={l} className="mb-2.5 text-sm cursor-pointer hover:text-blue-400 transition-colors">{l}</div>
              ))}
            </div>
          ))}
        </div>
        <div className="border-t border-white/7 pt-5 flex flex-wrap justify-between items-center gap-3 text-sm">
          <div>© 2026 EbenchCampu. All rights reserved.</div>
          <div>Made with ❤️ for India's next-gen talent</div>
        </div>
      </div>
    </footer>
  );
}

export default Footer