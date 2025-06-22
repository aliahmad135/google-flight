import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "../components/SearchBar";
import FlightCard from "../components/FlightCard";
import Loader from "../components/Loader";
import { flightAPI } from "../api/skyScrapper";
import { AlertCircle, Plane, Info, CheckCircle, XCircle } from "lucide-react";

const Home = () => {
  const [searchParams, setSearchParams] = useState(null);

  // Test API connection with comprehensive endpoint testing
  const {
    data: testData,
    error: testError,
    isLoading: testLoading,
  } = useQuery({
    queryKey: ["apiTest"],
    queryFn: () => flightAPI.testConnection(),
    retry: 1,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // React Query for flight search
  const {
    data: flightData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["flights", searchParams],
    queryFn: () => flightAPI.searchFlights(searchParams),
    enabled: !!searchParams && testData?.success,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleSearch = (params) => {
    console.log("Search initiated with params:", params);
    setSearchParams(params);
  };

  const renderApiStatus = () => {
    if (testLoading) {
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mt-0.5 mr-3"></div>
            <div>
              <h4 className="text-sm font-medium text-blue-800">
                Testing API Connection
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                Checking multiple endpoints to find the correct API structure...
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (testError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <XCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-800">
                API Connection Failed
              </h4>
              <p className="text-sm text-red-700 mt-1">{testError.message}</p>
              <details className="mt-2">
                <summary className="text-xs text-red-600 cursor-pointer">
                  Show technical details
                </summary>
                <pre className="text-xs text-red-500 mt-1 overflow-auto max-h-32">
                  {JSON.stringify(testError, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        </div>
      );
    }

    if (testData?.success) {
      return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-green-800">
                API Connected Successfully
              </h4>
              <p className="text-sm text-green-700 mt-1">
                Working endpoint:{" "}
                <code className="bg-green-100 px-1 rounded">
                  {testData.endpoint}
                </code>
              </p>
              <p className="text-xs text-green-600 mt-1">
                You can now search for flights.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (testData && !testData.success) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">
                API Partially Accessible
              </h4>
              <p className="text-sm text-yellow-700 mt-1">{testData.message}</p>
              <details className="mt-2">
                <summary className="text-xs text-yellow-600 cursor-pointer">
                  Show API response
                </summary>
                <pre className="text-xs text-yellow-500 mt-1 overflow-auto max-h-32">
                  {JSON.stringify(testData.rootResponse, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        </div>
      );
    }

    return null;
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
          <div className="text-sm text-red-500 mb-4 space-y-1">
            <p>
              <strong>Status:</strong> {error.response?.status || "Unknown"}
            </p>
            <p>
              <strong>URL:</strong> {error.config?.url || "Unknown"}
            </p>
            {error.response?.data && (
              <details className="mt-2">
                <summary className="cursor-pointer">
                  Show full error response
                </summary>
                <pre className="text-xs mt-1 overflow-auto max-h-32 text-left">
                  {JSON.stringify(error.response.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
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

      const flights = Array.isArray(flightData)
        ? flightData
        : flightData?.data || [];

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
              <p className="text-gray-600">{flights.length} flights found</p>
              <p className="text-sm text-gray-500">
                {searchParams.origin} → {searchParams.destination}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {flights.map((flight, idx) => (
              <FlightCard key={flight.id || idx} flight={flight} />
            ))}
          </div>

          {/* API Response Debug Info */}
          <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <details>
              <summary className="text-sm font-medium text-gray-800 cursor-pointer">
                API Response Debug (Click to expand)
              </summary>
              <pre className="text-xs text-gray-600 overflow-auto max-h-40 mt-2">
                {JSON.stringify(flightData, null, 2)}
              </pre>
            </details>
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
        {/* API Status */}
        {renderApiStatus()}

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
              {testData?.success && (
                <p className="text-green-600 text-sm mt-2">
                  ✅ API is connected and ready
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
