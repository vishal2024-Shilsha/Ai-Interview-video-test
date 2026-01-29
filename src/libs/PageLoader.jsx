// PageLoader.jsx
export default function PageLoader() {
  return (
    <div className="flex items-center h-screen justify-center bg-white z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 border-4 border-[#4d77b9] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 text-sm">Loading, please wait...</p>
      </div>
    </div>
  );
}
