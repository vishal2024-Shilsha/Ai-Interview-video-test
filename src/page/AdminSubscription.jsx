import { useState } from "react";
import Modal from "../components/ui/Modal";
import { PlusCircle, Pencil, Trash } from "lucide-react";


const SubscriptionModule = () => {
    const [plans, setPlans] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [formData, setFormData] = useState({
        planName: "",
        duration: "",
        credits: "",
        price: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = () => {
        if (!formData.planName.trim()) return;

        if (editingIndex !== null) {
            // Update existing plan
            const updatedPlans = [...plans];
            updatedPlans[editingIndex] = formData;
            setPlans(updatedPlans);
        } else {
            // Add new plan
            setPlans([formData, ...plans]);
        }

        setFormData({ planName: "", duration: "", credits: "", price: "" });
        setEditingIndex(null);
        setShowModal(false);
    };

    const handleEdit = (index) => {
        setFormData(plans[index]);
        setEditingIndex(index);
        setShowModal(true);
    };

   
    const handleDelete = (index) => {
        const updatedPlans = plans.filter((_, i) => i !== index);
        setPlans(updatedPlans);
    };
  

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg md:text-xl font-semibold text-gray-700">
                    Subscription Plans
                </h3>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-[#286a94] text-white px-3 md:px-4 py-2 rounded-md hover:bg-[#3e81aa] transition"
                >
                    <PlusCircle className="h-5 w-5" />
                    <span className="hidden sm:inline">Add Plan</span>
                </button>
            </div>

            {plans.length === 0 ? (
                <div className="text-gray-500 text-center mt-10 text-sm md:text-base">
                    No subscription plans yet. Click “Add Plan” to create one.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow rounded-lg text-sm md:text-base">
                        <thead>
                            <tr className="bg-[#286a94] text-white text-left">
                                <th className="py-3 px-4">Plan Name</th>
                                <th className="py-3 px-4">Duration</th>
                                <th className="py-3 px-4">Credits</th>
                                <th className="py-3 px-4">Price</th>
                                <th className="py-3 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {plans.map((plan, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50 transition">
                                    <td className="py-3 px-4">{plan.planName}</td>
                                    <td className="py-3 px-4">{plan.duration}</td>
                                    <td className="py-3 px-4">{plan.credits}</td>
                                    <td className="py-3 px-4">${plan.price}</td>
                                    <td className="py-3 px-4 flex gap-2">
                                        <button
                                            onClick={() => handleEdit(index)}
                                            className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500 transition text-xs flex items-center gap-1"
                                        >
                                            <Pencil className="h-3 w-3" /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(index)}
                                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition text-xs flex items-center gap-1"
                                        >
                                            <Trash className="h-3 w-3" /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )} 

            {showModal && (
                <Modal
                    title={editingIndex !== null ? "Edit Plan" : "Add New Plan"}
                    onClose={() => {
                        setShowModal(false);
                        setEditingIndex(null);
                        setFormData({ planName: "", duration: "", credits: "", price: "" });
                    }}
                    onConfirm={handleSave}
                >
                    <input
                        type="text"
                        name="planName"
                        placeholder="Plan Name"
                        value={formData.planName}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2  focus:outline-none mb-4"
                    />
                    <input
                        type="text"
                        name="duration"
                        placeholder="Duration (e.g., 1 month)"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
                    />
                    <input
                        type="number"
                        name="credits"
                        placeholder="Credits"
                        value={formData.credits}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder="Price ($)"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
                    />
                </Modal>
            )}
        </>
    );
};

export default SubscriptionModule;