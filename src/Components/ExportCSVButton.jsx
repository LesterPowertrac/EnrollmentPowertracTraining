import { CSVLink } from 'react-csv';
import React from 'react';

const ExportCSVButton = ({ enrollments, filename = 'enrollments.csv' }) => {
  const csvHeaders = [
    { label: "Student", key: "user.name" },
    { label: "Course", key: "course.title" },
    { label: "Status", key: "status" },
  ];

  const csvData = enrollments.map(e => ({
    'user.name': e.user?.name || 'N/A',
    'course.title': e.course?.title || 'N/A',
    status: e.status,
  }));

  return (
    <CSVLink
      headers={csvHeaders}
      data={csvData}
      filename={filename}
      className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded inline-block "
    >
      Export Excell
    </CSVLink>
  );
};

export default ExportCSVButton;
