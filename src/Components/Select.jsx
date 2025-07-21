import React from "react";

const Select = ({ label, name, options, value, onChange }) => {
  return (
    <div className="mb-4">
      {label && <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-700 focus:outline-none cursor-pointer"
      >
        {options.map((option, index) => (
          <option key={index} value={option.value} hidden={option.hidden}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
