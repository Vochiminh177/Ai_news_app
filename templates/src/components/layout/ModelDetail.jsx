const ModelDetail = ({ title, onClose, children, width = "max-w-md" }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`relative ${width} p-6 bg-base-300 rounded-lg shadow-lg`}>
        <button
          className="btn absolute  top-2 right-2 text-lg bg-transparent outline-none border-none hover:bg-transparent"
          onClick={onClose}
        >
          x
        </button>
        <h2 className="mb-4 text-xl font-bold text-center">{title}</h2>
        <div className="space-y-2 overflow-y-auto max-h-[60vh] ">
          {children}
        </div>
      </div>
    </div>
  );
};
export default ModelDetail;
