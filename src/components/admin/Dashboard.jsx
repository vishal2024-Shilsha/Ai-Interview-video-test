import React, { useState } from "react";
import { PlusCircle, Code2, Menu, X, UserCircle, LogOut } from "lucide-react";
import logo from '../../assets/logo_white2.png'
import { useNavigate } from "react-router-dom";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [codes, setCodes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [vendorName, setVendorName] = useState("");

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length: 10 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
  };

  const handleGenerate = () => {
    if (!vendorName.trim()) return;
    const newCode = {
      vendor: vendorName,
      code: generateRandomCode(),
      uses: Math.floor(Math.random() * 50) + 1,
      subscription: ["Free", "Pro", "Enterprise"][
        Math.floor(Math.random() * 3)
      ],
    };
    setCodes([newCode, ...codes]);
    setVendorName("");
    setShowModal(false);
  };

  const handleCopy = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => alert(`Code "${code}" copied to clipboard!`))
      .catch((err) => console.error("Failed to copy: ", err));
  };
  const navigate = useNavigate()


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full z-40 bg-[#286a94] text-white transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 w-64 flex flex-col justify-between`}
      >
        <div>
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-b-[#96b7cc]">
            <img
              className="w-9/12 mx-auto h-8 object-contain"
              src={logo}
              alt="Ebench logo"
            />
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="mt-6">
            <div className="flex items-center px-4 py-2 bg-[#6398b9]">
              <Code2 className="h-5 w-5 mr-3" />
              <span>Code Generation</span>
            </div>
          </nav>
        </div>

        {/* Logout Section */}
        <div className=" border-[#96b7cc] p-4">
          <button
            onClick=''
            className="w-full flex items-center gap-3 px-3 py-2 text-white rounded-md hover:bg-[#387aa3] transition"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-semibold text-gray-700">Ebench</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-gray-600 font-medium">
              Admin
            </span>
            <UserCircle className="h-8 w-8 text-gray-600" />
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-700">
              Code Generation
            </h3>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-[#286a94] text-white px-3 md:px-4 py-2 rounded-md hover:bg-[#3e81aa] transition"
            >
              <PlusCircle className="h-5 w-5" />
              <span className="hidden sm:inline">Generate Code</span>
            </button>
          </div>

          {/* Table */}
          {codes.length === 0 ? (
            <div className="text-gray-500 text-center mt-10 text-sm md:text-base">
              No generated codes yet. Click “Generate Code” to create one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow rounded-lg text-sm md:text-base">
                <thead>
                  <tr className="bg-[#286a94] text-white text-left">
                    <th className="py-3 px-4">Vendor Name</th>
                    <th className="py-3 px-4">Generated Code</th>
                    <th className="py-3 px-4">Uses</th>
                    <th className="py-3 px-4">Subscription</th>
                  </tr>
                </thead>
                <tbody>
                  {codes.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="py-3 px-4">{item.vendor}</td>

                      {/* Code + Copy */}
                      <td className="py-3 px-4 font-mono text-[#286a94] flex items-center gap-2">
                        <span className="truncate">{item.code}</span>
                        <button
                          onClick={() => handleCopy(item.code)}
                          className="bg-[#286a94] text-white px-2 py-1 rounded hover:bg-[#1f5777] transition text-xs"
                        >
                          Copy
                        </button>
                      </td>

                      <td className="py-3 px-4">{item.uses}</td>
                      <td className="py-3 px-4">{item.subscription}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Generate New Code
            </h3>
            <input
              type="text"
              placeholder="Enter Vendor Name"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                className="px-4 py-2 bg-[#286a94] text-white rounded-md hover:bg-[#3e7ea7]"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
