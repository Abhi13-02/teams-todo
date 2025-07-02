import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Welcome to Teams Task Manager
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Manage tasks, collaborate with your team, and boost productivity — all in one place.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
