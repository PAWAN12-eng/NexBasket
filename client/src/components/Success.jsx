import React from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-[79vh] flex flex-col items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <svg
          className="mx-auto mb-4 w-16 h-16 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M9 12l2 2l4 -4m5 2a9 9 0 11-18 0a9 9 0 0118 0"
          />
        </svg>
        <h1 className="text-2xl font-semibold mb-2">Order Placed!</h1>
        <p className="text-gray-700 mb-6">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        <button
          onClick={goHome}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Success;
