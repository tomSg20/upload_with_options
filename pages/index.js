import { useEffect, useState } from 'react';
import axios from 'axios';
import FileUpload from '../components/FileUpload';
import HistoryTable from '../components/HistoryTable';

export default function Home() {
  const [submissions, setSubmissions] = useState([]);

  const fetchHistory = async () => {
    const { data } = await axios.get('/api/get-history');
    setSubmissions(data.data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">By File</h1>
        <FileUpload onUploadComplete={fetchHistory} />
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Upload History</h2>
          <HistoryTable submissions={submissions} fetchHistory={fetchHistory} />
        </div>
      </div>
    </div>
  );
}