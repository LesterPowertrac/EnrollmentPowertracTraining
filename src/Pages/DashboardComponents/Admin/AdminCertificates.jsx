import { useEffect, useState, useCallback } from 'react';
import axios from '../../../Utils/API/axios';
import Input from '../../../Components/Input';
import FileUploadButton from '../../../Components/FileUploadButton';
import echo from '../../../Utils/API/echo';

const AdminCertificates = () => {
  const [enrollments, setEnrollments] = useState([]);

  const fetchApprovedEnrollments = useCallback(() => {
    axios.get('/api/enrollments?status=approved').then(res => {
      setEnrollments(res.data);
    });
  }, []);

  useEffect(() => {
    fetchApprovedEnrollments();
  }, [fetchApprovedEnrollments]);

  const handleUpload = async (e, enrollmentId) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('certificate', file);

    try {
      await axios.post(`/api/enrollments/${enrollmentId}/upload-certificate`, formData);
      alert('Uploaded successfully');
      fetchApprovedEnrollments(); // Manually refresh after upload
    } catch (err) {
      console.error(err);
      alert('Failed to upload');
    }
  };

  useEffect(() => {
    const channel = echo.channel('enrollments');

    channel.listen('.CertificateUploaded', (event) => {
      console.log('📄 CertificateUploaded event received:', event);
      fetchApprovedEnrollments(); // Refresh list
    });

    return () => {
      echo.leaveChannel('enrollments');
    };
  }, [fetchApprovedEnrollments]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Upload Certificates</h2>
      <table className="min-w-full bg-white shadow rounded">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Student</th>
            <th className="p-2">Course</th>
            <th className="p-2">Upload</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map(e => (
            <tr key={e.id} className="border-t">
              <td className="p-2">{e.user?.name}</td>
              <td className="p-2">{e.course?.title}</td>
              <td className="p-2">
                <FileUploadButton
                  id={`upload-${e.id}`}
                  label={e.certificate_url ? "Already has Certificate" : "Upload Certificate"}
                  variant={e.certificate_url ? "success" : "primary"}
                  onFileSelect={(file) => handleUpload({ target: { files: [file] } }, e.id)}
                  accept="application/pdf"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCertificates;
