import { useState } from "react";
import { PlusCircle } from "lucide-react";
// import CodeTable from "./CodeTable";
import Modal from "../components/ui/Modal";


const CodeGenerationPage = () => {
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

    // "0214638"Input: arr = [1, 2, 4, 5, 7, 8, 3]
    //  "21463"
    const handleCopy = (code) => {
        navigator.clipboard
            .writeText(code)
            .then(() => alert(`Code "${code}" copied to clipboard!`))
            .catch((err) => console.error("Failed to copy: ", err));
    };


    return (
        <>
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

            {/* <CodeTable codes={codes} handleCopy={handleCopy} /> */}
            {
                codes.length === 0 ?
                    (
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
                                        <tr key={index} className="border-b hover:bg-gray-50 transition">
                                            <td className="py-3 px-4">{item.vendor}</td>
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
                    )
            }


            {showModal && (
                <Modal
                    title="Generate New Code"
                    onClose={() => setShowModal(false)}
                    onConfirm={handleGenerate}
                >
                    <input
                        type="text"
                        placeholder="Enter Vendor Name"
                        value={vendorName}
                        onChange={(e) => setVendorName(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
                    />
                </Modal>
            )}
        </>
    );
};

export default CodeGenerationPage;
