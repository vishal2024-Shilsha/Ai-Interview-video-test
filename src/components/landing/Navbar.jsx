import { useNavigate } from "react-router-dom";
import logo from '../../assets/ebench_logo.png';
export function Logo({ nav }) {
  return (
    <div
      className="flex items-center gap-2.5 cursor-pointer"
      onClick={() => nav("landing")}
    >
      <div className="w-20 h-12 rounded-[10px] bg-linear-to-br  flex items-center justify-baseline">
        {/* <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg> */}
        <img src={logo} alt="" />
      </div>
      <span className="text-lg font-bold text-[#2d4f79] tracking-tight">
        <span className="text-[#0740a1]">Campu</span>
      </span>
    </div>
  );
}

// ─── NAVBAR ────────────────────────────────────────────────────────────

function Navbar({ nav }) {
  const navigate = useNavigate();

  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const links = [
    { label: "Features", id: "features" },
    { label: "How It Works", id: "how-it-works" },
    { label: "Review", id: "review" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E2EDF8] px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16">
        <Logo nav={nav} />

        <div className="hidden md:flex items-center gap-8 text-sm text-[#6B84A0]">
          {links.map((l) => (
            <span
              key={l.id}
              onClick={() => handleScroll(l.id)}
              className="cursor-pointer font-medium hover:text-blue-500 transition-colors"
            >
              {l.label}
            </span>
          ))}
        </div>

        <div className="flex gap-3 items-center">
          <button
            onClick={() => navigate("/login")}
            className="text-sm cursor-pointer font-semibold text-blue-500 px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Log in
          </button>

          <button
            onClick={() => navigate("/vendor-signup")}
            className="text-sm cursor-pointer font-bold text-white px-5 py-2.5 rounded-xl bg-linear-to-r from-blue-500 to-sky-400 shadow-[0_6px_20px_rgba(43,127,255,0.35)] hover:shadow-[0_8px_24px_rgba(43,127,255,0.45)] hover:-translate-y-0.5 transition-all"
          >
            Start Free Trial
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar