import React from "react";

const Input = ({ label, type = "text", name, value, onChange, placeholder, required = false }) => {
  return (
    <div className="mb-4">
      {label && <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="false"
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-700 focus:outline-none "
        required={required}
      />
    </div>
  );
};

export default Input;
