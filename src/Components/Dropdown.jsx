import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";

const Dropdown = ({ label, icon: Icon, options }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Dropdown Trigger */}
      <div
        className={`flex items-center justify-between p-3 rounded cursor-pointer hover:bg-indigo-500 ${isOpen ? "bg-indigo-500" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon />} {label}
        </div>
        <FaChevronDown className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="ml-6 bg-white shadow-md rounded-md mt-0 border-black border ">
          {options.map((option, index) => (
            <Link
              key={index}
              to={option.path}
              className="block px-4 py-2 hover:bg-indigo-500 text-black"
            >
              {option.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
