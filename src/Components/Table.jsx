import React from "react";

const Table = ({ columns, data }) => {
  return (
    <div className="w-auto overflow-x-auto">
      <table className="min-w-[800px] w-full border-collapse border border-gray-300">
        {/* Table Header */}
        <thead className="bg-gray-100 ">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="border p-3 text-gray-700 text-center">
                {col}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="border p-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
