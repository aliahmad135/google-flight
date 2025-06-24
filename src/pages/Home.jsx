import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "../components/SearchBar";
import FlightCard from "../components/FlightCard";
import Loader from "../components/Loader";
import { flightAPI } from "../api/skyScrapper";
import { transformV2FlightData, extractV2Metadata } from "../utils/flightDataTransformer";
import { AlertCircle, Plane } from "lucide-react";

const Home = () => {
  const [searchParams, setSearchParams] = useState(null);

  // React Query for flight search
  const {
    data: flightData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["flights", searchParams],
    queryFn: () => flightAPI.searchFlights(searchParams),
    enabled: !!searchParams,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleSearch = (params) => {
    console.log("Search initiated with params:", params);
    setSearchParams(params);
  };

  const renderFlightResults = () => {
    if (isLoading) {
      return <Loader message="Searching for the best flights..." />;
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Unable to fetch flights
          </h3>
          <p className="text-red-600 mb-4">
            {error.response?.data?.message ||
              error.message ||
              "There was an error searching for flights."}
          </p>
          <div className="space-x-4">
            <button
              onClick={() => refetch()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    if (flightData) {
      console.log("Flight data received:", flightData);

      // Transform v2 API response to match expected format
      const flights = transformV2FlightData(flightData);
      const metadata = extractV2Metadata(flightData);

      if (flights.length === 0) {
        return (
          <p className="text-center text-gray-600">
            No flights found for the selected criteria.
          </p>
        );
      }

      return (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Available Flights
            </h2>
            <div className="text-right">
              <p className="text-gray-600">
                {metadata.totalResults ? `${metadata.totalResults} total results` : `${flights.length} flights found`}
              </p>
              <p className="text-sm text-gray-500">
                {searchParams.origin} → {searchParams.destination}
              </p>
            </div>
          </div>

          {/* Stop Prices Summary (v2 feature) */}
          {metadata.stopPrices && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Price Summary</h3>
              <div className="flex space-x-6 text-sm">
                {metadata.stopPrices.direct && (
                  <div>
                    <span className="text-blue-600 font-medium">Direct:</span> {metadata.stopPrices.direct.formattedPrice}
                  </div>
                )}
                {metadata.stopPrices.one && (
                  <div>
                    <span className="text-blue-600 font-medium">1 Stop:</span> {metadata.stopPrices.one.formattedPrice}
                  </div>
                )}
                {metadata.stopPrices.twoOrMore && (
                  <div>
                    <span className="text-blue-600 font-medium">2+ Stops:</span> {metadata.stopPrices.twoOrMore.formattedPrice}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {flights.map((flight, idx) => (
              <FlightCard key={flight.id || idx} flight={flight} />
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Plane className="w-12 h-12 mr-3" />
              <h1 className="text-4xl font-bold">FlightSearch</h1>
            </div>
            <p className="text-xl text-blue-100">
              Find and compare flights from hundreds of airlines
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        {/* Results Section */}
        <div className="mt-8">
          {searchParams ? (
            renderFlightResults()
          ) : (
            <div className="text-center py-12">
              <Plane className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Ready to find your next flight?
              </h3>
              <p className="text-gray-500">
                Enter your travel details above to search for available flights
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
