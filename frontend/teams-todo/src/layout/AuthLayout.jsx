import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-900 text-gray-100">
      {/* Left side - placeholder for image/animation */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-gray-800 to-gray-700 items-center justify-center">
        <div className="p-6">
          {/* Replace this div with your image/animation component */}
          <div className="w-80 h-80 bg-gray-600 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Right side - form area */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;