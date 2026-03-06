
const Header = ({ setSidebarOpen }) => {
  return (
    <div className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-[#2965b4] text-white flex items-center justify-between px-6 shadow z-30">

      <button className="lg:hidden text-2xl" onClick={() => setSidebarOpen(true)}>
        ☰
      </button>

      <h1 className="font-semibold text-lg"></h1>

      <div className="flex items-center gap-3">
        <> 🔔 </>
        <div className="w-9 h-9 bg-white text-[#5b3cc4] rounded-full flex items-center justify-center font-bold">
          TM
        </div>
        <div className=" text-sm">
          <div className="text-sm font-medium">{localStorage.getItem('name')}</div>
          <div className="text-xs">{localStorage.getItem('email')}</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
