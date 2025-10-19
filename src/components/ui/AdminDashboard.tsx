export default function AdminDashboard() {
  return (
    <div className="ml-56 p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-gray-500">User</p>
          <h3 className="text-2xl font-bold text-indigo-600">1,500</h3>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-gray-500">Category</p>
          <h3 className="text-2xl font-bold text-indigo-600">500</h3>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-gray-500">Spending</p>
          <h3 className="text-2xl font-bold text-indigo-600">84,382</h3>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-gray-500">Total Money</p>
          <h3 className="text-2xl font-bold text-indigo-600">$33,493,022</h3>
        </div>
      </div>
    </div>
  );
}
