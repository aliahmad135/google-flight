import React from "react";
import { Plane, Clock, ArrowRight } from "lucide-react";

const FlightCard = ({ flight }) => {
  const {
    airline = "Unknown Airline",
    flightNumber = "",
    price = "",
    currency = "",
    departure = {},
    arrival = {},
    duration = "",
    stopInfo = "",
    aircraft = "",
  } = flight || {};

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
      {/* Header - Airline and Price */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Plane className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{airline}</h3>
            <p className="text-sm text-gray-600">{flightNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{price}</div>
          <div className="text-sm text-gray-600">per person</div>
        </div>
      </div>

      {/* Flight Route */}
      <div className="flex items-center justify-between mb-4">
        {/* Departure */}
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {departure.time}
          </div>
          <div className="text-sm text-gray-600">{departure.airport}</div>
          <div className="text-xs text-gray-500">{departure.city}</div>
        </div>

        {/* Flight Path */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="flex-1 border-t border-gray-300 relative">
              <Plane className="w-4 h-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-gray-400" />
            </div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>
        </div>

        {/* Arrival */}
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{arrival.time}</div>
          <div className="text-sm text-gray-600">{arrival.airport}</div>
          <div className="text-xs text-gray-500">{arrival.city}</div>
        </div>
      </div>

      {/* Flight Details */}
      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <span>•</span>
          <span>{stopInfo}</span>
          <span>•</span>
          <span>{aircraft}</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
          <span>Select flight</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FlightCard;
