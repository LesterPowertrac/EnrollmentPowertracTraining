import React from "react";
import { useNavigate } from "react-router-dom";

const DropdownHover = ({ icon: Icon, options }) => {
  const navigate = useNavigate();
  return (
    <div className="relative group inline-block">
      {/* Dropdown Trigger */}
      <div className="cursor-pointer p-2 hover:text-black">
        <Icon className="text-xl" />
      </div>

      {/* Dropdown Menu */}
      <div className="absolute right-0 mt-0 w-48 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-opacity duration-300">
        {options.map((option, index) => (
            <button
                key={index}
                onClick={() => {
                if (option.onClick) {
                    option.onClick(); // Call custom function (like logout)
                }
                if (option.path) {
                    navigate(option.path); // Navigate to route if provided
                }
                }}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-black hover:bg-gray-200"
            >
                {option.icon && <option.icon />} {option.label}
            </button>
            ))}
      </div>
    </div>
  );
};

export default DropdownHover;
