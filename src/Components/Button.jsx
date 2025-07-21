import React from "react";

const Button = ({ text, onClick, type = "button", variant = "primary", size = "md", icon: Icon, textColor = 'black', disabled}) => {
  const baseStyles = "font-semibold rounded transition duration-200 flex items-center justify-center gap-2 ";
  
  // Color Variants
  const variants = {
    primary: disabled ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer",
    secondary: disabled ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-gray-500 hover:bg-gray-600 text-white cursor-pointer",
    success: disabled ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white cursor-pointer",
    danger: disabled ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 text-white cursor-pointer",
    warning: disabled ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600 text-black cursor-pointer",
    indigo: disabled ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600 text-black cursor-pointer",    
  };

  // Size Variants
  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    wide: "w-full p-2"
  };

  const textColors={
    black: 'text-black',
    white: 'text-white'
  }

  return (
    <button 
      disabled={disabled}
      type={type} 
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${textColors[textColor]}`}
    >
      {Icon && <Icon className="text-lg" />} {/* Show icon if provided */}
      {text}
    </button>
  );
};

export default Button;
