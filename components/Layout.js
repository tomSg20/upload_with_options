export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center">
      <div className="max-w-4xl w-full p-4">
        {children}
      </div>
    </div>
  );
}
