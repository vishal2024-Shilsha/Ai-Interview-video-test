import { useState } from "react";
import { motion } from 'framer-motion'

export default function ImportUsers({ onClose, onSubmit, isVendorImporting }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "text/csv") {
      setError("Only CSV files are allowed.");
      setFile(null);
    } else {
      setError("");
      setFile(selectedFile);
    }
  };
  const handleImport = () => {
    if (!file) return;
    onSubmit(file, true)
  };

  return (
    <motion.div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <motion.div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Import Users (CSV)</h2>
        <p className="text-sm text-gray-500 mb-4">
          Please select a CSV file containing user data. Only CSV files are allowed.
        </p>

        <label
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
        >
          <span className="text-gray-500">{file ? file.name : "Click or drag a CSV file here"}</span>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!file}
            className={`px-4 py-2 text-white rounded ${file ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"
              } transition`}
          >
            {isVendorImporting ? 'Importing' : 'Import'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
