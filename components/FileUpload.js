import { useState } from 'react';
import axios from 'axios';

export default function FileUpload({ onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // 1. State for the checkboxes
  const [options, setOptions] = useState({
    st3: false,
    exmust: false,
    exdect: false,
    cb: false,
    vt: false,
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle checkbox changes dynamically
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setOptions((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleUpload = async () => {
    if (!file) return alert('Please select a file!');

    setIsUploading(true);
    
    // Use FormData to send both file and boolean flags
    const formData = new FormData();
    formData.append('file', file);
    formData.append('st3', options.st3);
    formData.append('exmust', options.exmust);
    formData.append('exdect', options.exdect);
    formData.append('cb', options.cb);
    formData.append('vt', options.vt);

    try {
      // Send the formData object directly
      const { data } = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert(data.message);
      if (onUploadComplete) onUploadComplete();
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 border border-dashed rounded-lg bg-gray-800 text-white">
      <input type="file" onChange={handleFileChange} className="block mb-4" />

      {/* 2. Checkbox UI Section */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="st3"
            checked={options.st3}
            onChange={handleCheckboxChange}
          />
          ST3
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="exmust"
            checked={options.exmust}
            onChange={handleCheckboxChange}
          />
          ExMust
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="exdect"
            checked={options.exdect}
            onChange={handleCheckboxChange}
          />
          ExDect
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="cb"
            checked={options.cb}
            onChange={handleCheckboxChange}
          />
          CB
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="vt"
            checked={options.vt}
            onChange={handleCheckboxChange}
          />
          VT
        </label>
      </div>

      <button
        onClick={handleUpload}
        className={`mt-2 px-4 py-2 bg-blue-500 text-white rounded w-full ${
          isUploading ? 'opacity-50' : ''
        }`}
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}