import axios from 'axios';

export default function HistoryTable({ submissions, fetchHistory }) {
  const handleDelete = async (id, file_path) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      await axios.delete('/api/delete', { data: { id, file_path } });
      alert('File deleted successfully');
      fetchHistory();
    } catch (err) {
      alert('Failed to delete the file');
    }
  };

  return (
    <table className="w-full text-white table-auto">
      <thead>
        <tr>
          <th>Filename</th>
          <th>Size</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {submissions.map((submission) => (
          <tr key={submission.id}>
            <td>{submission.filename}</td>
            <td>{(submission.file_size / 1024).toFixed(2)} KB</td>
            <td>{new Date(submission.created_at).toLocaleString()}</td>
            <td>
              <button
                onClick={() => handleDelete(submission.id, submission.file_path)}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}