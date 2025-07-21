import React from "react";

const Textarea = ({ label, name, value, onChange, placeholder }) => {
  return (
    <div className="mb-4">
      {label && <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-700 focus:outline-none"
        rows="4"
      />
    </div>
  );
};

export default Textarea;
