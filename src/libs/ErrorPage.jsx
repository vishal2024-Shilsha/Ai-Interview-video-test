
const ErrorPage = ({ title = "Something went wrong", message = "Please try again later." }) => {

  return (
    <div className="min-h-full flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-xl text-center bg-white p-32 rounded-lg shadow-lg">
        <h1 className="text-5xl font-bold text-red-500 mb-4">⚠️</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {title}
        </h2>
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
