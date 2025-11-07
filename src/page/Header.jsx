import logo from '../assets/ebench_logo.png'

export default function Header() {
    // const avigate = useNavigate()
  return (
    <header className="flex items-center justify-between fixed w-full z-50 bg-white shadow px-8 py-3">
      {/* Left Logo */}
      <div className="flex items-center">
        <img
          src={logo} // <-- replace with your logo path (e.g., /assets/ebench.png)
          alt="eBench Logo"
          className="h-8 cursor-pointer"
          // onClick={() => avigate('/')}
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6 text-[#286a94]">
        {/* Notification Icon */}
        Powered by AI & PostgreSQL
      </div>
    </header>
  );
}
