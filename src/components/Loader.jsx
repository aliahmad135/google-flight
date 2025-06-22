import React from 'react';
import { Plane } from 'lucide-react';

const Loader = ({ message = "Searching for flights..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        {/* Animated plane */}
        <div className="animate-bounce">
          <Plane className="w-12 h-12 text-blue-600" />
        </div>
        
        {/* Loading dots */}
        <div className="flex space-x-1 mt-4 justify-center">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
      
      <p className="text-gray-600 mt-4 text-lg">{message}</p>
      <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
    </div>
  );
};

export default Loader;