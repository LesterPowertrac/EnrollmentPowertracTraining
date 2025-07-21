import React, { useRef, useState } from 'react';

const FileUploadButton = ({
  onFileSelect,
  accept = "application/pdf",
  label = "Upload File",
  id,
  variant = "primary",
  size = "md",
}) => {
  const fileInputRef = useRef();
  const [fileName, setFileName] = useState(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-black",
    indigo: "bg-indigo-600 hover:bg-indigo-700 text-white",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <div className="flex items-center space-x-3">
      <button
        type="button"
        onClick={handleClick}
        className={`rounded font-semibold transition duration-200 ${variants[variant]} ${sizes[size]}`}
      >
        {label}
      </button>
      {fileName && (
        <span className="text-sm text-gray-700 truncate max-w-xs">{fileName}</span>
      )}
      <input
        id={id}
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
};

export default FileUploadButton;
