import React from "react";

const ReusableModal = ({ isOpen, onClose, title, children, width, height }) => {
  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className={`bg-white p-6 rounded-lg shadow-lg ${width} ${height} max-w-md relative`}>
        {/* Close Button */}
        <button 
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
          onClick={onClose}
        >
          ✖️
        </button>

        {/* Modal Title */}
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

        {/* Modal Content */}
        <div>{children}</div>

      </div>
    </div>
  );
};

export default ReusableModal;
