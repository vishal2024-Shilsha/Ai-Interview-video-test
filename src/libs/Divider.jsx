export default function Divider() {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-[#E2EDF8]" />
      <span className="text-sm text-[#94B8D8]">or continue with</span>
      <div className="flex-1 h-px bg-[#E2EDF8]" />
    </div>
  );
}


export function Pill({ children, className = "" }) {
  return (
    <div className={`inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 mb-5 ${className}`}>
      <div className="w-2 h-2 rounded-full bg-blue-500" />
      <span className="text-xs font-bold text-blue-500">{children}</span>
    </div>
  );
}

export function SectionHeader({ title, sub, badge }) {
  return (
    <div className="text-center mb-14">
      {badge && <Pill>{badge}</Pill>}
      <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F2744] mb-3 tracking-tight leading-tight">{title}</h2>
      <p className="text-base text-[#3A5068] max-w-lg mx-auto leading-relaxed">{sub}</p>
    </div>
  );
}

export function BulletItem({ color, text }) {
  return (
    <div className="flex gap-2 items-start mb-2.5">
      <div
        className="shrink-0 w-[18px] h-[18px] rounded-full flex items-center justify-center mt-0.5 text-[9px] text-white"
        style={{ background: color }}
      >✓</div>
      <span className="text-sm text-[#3A5068] leading-snug">{text}</span>
    </div>
  );
}

export function FormField({ label, children }) {
  return (
    <div className="mb-4">
      <label className="text-sm font-semibold text-[#3A5068] block mb-1.5">{label}</label>
      {children}
    </div>
  );
}



export const inputClass =
  "w-full px-4 py-3 rounded-xl border-[1.5px] border-[#E2EDF8] text-sm text-[#0F2744] outline-none bg-[#FAFCFF] focus:border-blue-500 transition-colors font-[inherit]";
