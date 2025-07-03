// src/components/FloatingFilterBar.jsx
import React from 'react';

const FloatingFilterBar = ({ children }) => {
  return (
    <div
      className="bg-base-200/80 backdrop-blur-lg rounded-lg p-4 mb-8
                 flex flex-wrap gap-4 items-center shadow-lg
                 border-b-4 border-primary sticky top-4 z-20"
    >
      {children}
    </div>
  );
};

export default FloatingFilterBar;
