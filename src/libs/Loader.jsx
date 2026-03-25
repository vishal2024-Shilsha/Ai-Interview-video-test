const Loader = ({
  size = 48,            // default outer size (px)
  innerSize = 32,       // default inner size (px)
  className = "",       // container custom classes
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        style={{ width: size, height: size }}
        className="border-2 border-transparent animate-spin border-t-blue-400 rounded-full flex items-center justify-center"
      >
        <div
          style={{ width: innerSize, height: innerSize }}
          className="border-2 border-transparent animate-spin border-t-red-400 rounded-full"
        ></div>
      </div>
    </div>
  );
};

export default Loader;