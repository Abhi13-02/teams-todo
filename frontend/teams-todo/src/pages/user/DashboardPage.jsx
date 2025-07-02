import React from 'react';

const DashboardPage = () => {
  return (
    <div className="p-6 text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Tasks</h2>
          <p className="text-4xl font-bold text-blue-400">14</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Assigned to Me</h2>
          <p className="text-4xl font-bold text-green-400">6</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">In Progress</h2>
          <p className="text-4xl font-bold text-yellow-400">3</p>
        </div>
      </div>

      <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Task Summary</h2>
        <p className="text-gray-400">This section will later show charts and filters to analyze tasks.</p>
      </div>
    </div>
  );
};

export default DashboardPage;
