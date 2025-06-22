import React, { useState } from "react";
import { Search, Calendar, Users, ArrowLeftRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useDebounce from "../hooks/useDebounce";
import { flightAPI } from "../api/skyScrapper";

const SearchBar = ({ onSearch, isLoading }) => {
  const [searchData, setSearchData] = useState({
    originInput: "",
    destinationInput: "",
    originSkyId: "",
    originEntityId: "",
    destinationSkyId: "",
    destinationEntityId: "",
    departureDate: "",
    returnDate: "",
    passengers: 1,
    cabinClass: "economy",
  });

  const debouncedOrigin = useDebounce(searchData.originInput);
  const debouncedDest = useDebounce(searchData.destinationInput);

  const { data: originSuggestions } = useQuery({
    queryKey: ["airport", debouncedOrigin],
    queryFn: () => flightAPI.searchAirports(debouncedOrigin),
    enabled: debouncedOrigin.length > 2,
    select: (res) => res?.data || [],
  });

  const { data: destSuggestions } = useQuery({
    queryKey: ["airport", debouncedDest],
    queryFn: () => flightAPI.searchAirports(debouncedDest),
    enabled: debouncedDest.length > 2,
    select: (res) => res?.data || [],
  });

  const handleInputChange = (field, value) => {
    setSearchData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectAirport = (type, suggestion) => {
    setSearchData((prev) => ({
      ...prev,
      [`${type}Input`]: suggestion.presentation.title,
      [`${type}SkyId`]: suggestion.skyId,
      [`${type}EntityId`]: suggestion.entityId,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchData.originSkyId || !searchData.destinationSkyId) return;
    const payload = {
      origin: searchData.originSkyId,
      destination: searchData.destinationSkyId,
      originEntityId: searchData.originEntityId,
      destinationEntityId: searchData.destinationEntityId,
      departureDate: searchData.departureDate,
      returnDate: searchData.returnDate,
      passengers: searchData.passengers,
      cabinClass: searchData.cabinClass,
    };
    onSearch(payload);
  };

  const swapLocations = () => {
    setSearchData((prev) => ({
      ...prev,
      originInput: prev.destinationInput,
      destinationInput: prev.originInput,
      originSkyId: prev.destinationSkyId,
      destinationSkyId: prev.originSkyId,
      originEntityId: prev.destinationEntityId,
      destinationEntityId: prev.originEntityId,
    }));
  };

  // Common airport codes for easy testing
  const popularAirports = [
    { code: "NYCA", name: "New York City Area" },
    { code: "LACA", name: "Los Angeles City Area" },
    { code: "CHIA", name: "Chicago Area" },
    { code: "MIAA", name: "Miami Area" },
    { code: "SFOA", name: "San Francisco Area" },
    { code: "LASA", name: "Las Vegas Area" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Trip Type */}
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="tripType"
              value="roundtrip"
              defaultChecked
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">
              Round trip
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="tripType"
              value="oneway"
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">One way</span>
          </label>
        </div>

        {/* Main Search Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* From */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <div className="relative">
              <input
                type="text"
                list="origin-options"
                value={searchData.originInput}
                onChange={(e) => {
                  const val = e.target.value;
                  handleInputChange("originInput", val);
                  const match = (originSuggestions || []).find(
                    (s) => val.includes(s.skyId) || val === s.presentation.title
                  );
                  if (match) handleSelectAirport("origin", match);
                }}
                placeholder="Type origin city or airport"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <datalist id="origin-options">
                {(originSuggestions || []).map((airport) => (
                  <option
                    key={airport.skyId}
                    value={`${airport.presentation.title} (${airport.skyId})`}
                  />
                ))}
              </datalist>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex items-end justify-center pb-3">
            <button
              type="button"
              onClick={swapLocations}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeftRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* To */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <div className="relative">
              <input
                type="text"
                list="dest-options"
                value={searchData.destinationInput}
                onChange={(e) => {
                  const val = e.target.value;
                  handleInputChange("destinationInput", val);
                  const match = (destSuggestions || []).find(
                    (s) => val.includes(s.skyId) || val === s.presentation.title
                  );
                  if (match) handleSelectAirport("destination", match);
                }}
                placeholder="Type destination city or airport"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <datalist id="dest-options">
                {(destSuggestions || []).map((airport) => (
                  <option
                    key={airport.skyId}
                    value={`${airport.presentation.title} (${airport.skyId})`}
                  />
                ))}
              </datalist>
            </div>
          </div>

          {/* Passengers */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passengers
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={searchData.passengers}
                onChange={(e) =>
                  handleInputChange("passengers", parseInt(e.target.value))
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} passenger{num > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Date Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Departure Date */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departure
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={searchData.departureDate}
                onChange={(e) =>
                  handleInputChange("departureDate", e.target.value)
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Return Date */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Return
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={searchData.returnDate}
                onChange={(e) =>
                  handleInputChange("returnDate", e.target.value)
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Cabin Class */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <select
              value={searchData.cabinClass}
              onChange={(e) => handleInputChange("cabinClass", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="economy">Economy</option>
              <option value="premium_economy">Premium Economy</option>
              <option value="business">Business</option>
              <option value="first">First Class</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors min-w-[140px] justify-center"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Search flights</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
