/**
 * Transform v2 API response to match the expected flight data format
 * @param {Object} apiResponse - The raw response from the v2 API
 * @returns {Array} - Transformed flight data array
 */
export const transformV2FlightData = (apiResponse) => {
  // Handle different response structures
  if (!apiResponse || !apiResponse.data) {
    console.warn("Invalid API response structure:", apiResponse);
    return [];
  }

  const { data } = apiResponse;
  
  // Check if we have itineraries in the response
  if (!data.itineraries || !Array.isArray(data.itineraries)) {
    console.warn("No itineraries found in API response:", data);
    return [];
  }

  return data.itineraries.map((itinerary) => {
    // Get the first leg (outbound flight)
    const firstLeg = itinerary.legs?.[0];
    
    if (!firstLeg) {
      console.warn("No legs found in itinerary:", itinerary);
      return null;
    }

    // Extract carrier information
    const marketingCarriers = firstLeg.carriers?.marketing || [];
    const operatingCarriers = firstLeg.carriers?.operating || [];
    const primaryCarrier = marketingCarriers[0] || operatingCarriers[0] || {};

    // Extract segment information for flight details
    const segments = firstLeg.segments || [];
    const firstSegment = segments[0] || {};
    const lastSegment = segments[segments.length - 1] || {};

    // Format duration
    const durationInHours = Math.floor(firstLeg.durationInMinutes / 60);
    const durationInMinutes = firstLeg.durationInMinutes % 60;
    const duration = `${durationInHours}h ${durationInMinutes}m`;

    // Format stop information
    const stopCount = firstLeg.stopCount || 0;
    const stopInfo = stopCount === 0 ? "Direct" : 
                    stopCount === 1 ? "1 stop" : 
                    `${stopCount} stops`;

    // Format departure and arrival times
    const formatTime = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    };

    // Format departure and arrival dates
    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    };

    return {
      id: itinerary.id,
      airline: primaryCarrier.name || "Unknown Airline",
      flightNumber: firstSegment.marketingCarrier?.flightNumber || "",
      price: itinerary.price?.formatted || "",
      currency: "USD", // Default currency
      departure: {
        time: formatTime(firstLeg.departure),
        date: formatDate(firstLeg.departure),
        airport: firstLeg.origin?.displayCode || "",
        city: firstLeg.origin?.name || "",
      },
      arrival: {
        time: formatTime(firstLeg.arrival),
        date: formatDate(firstLeg.arrival),
        airport: firstLeg.destination?.displayCode || "",
        city: firstLeg.destination?.name || "",
      },
      duration,
      stopInfo,
      aircraft: firstSegment.aircraft?.name || "",
      // Additional v2 specific data
      score: itinerary.score,
      farePolicy: itinerary.farePolicy,
      segments: segments,
      carriers: firstLeg.carriers,
      // Raw data for debugging
      rawItinerary: itinerary,
    };
  }).filter(Boolean); // Remove null entries
};

/**
 * Extract additional metadata from v2 API response
 * @param {Object} apiResponse - The raw response from the v2 API
 * @returns {Object} - Additional metadata
 */
export const extractV2Metadata = (apiResponse) => {
  if (!apiResponse || !apiResponse.data) {
    return {};
  }

  const { data } = apiResponse;

  return {
    totalResults: data.totalResults,
    context: data.context,
    stopPrices: data.stopPrices,
    alliances: data.alliances,
    destinationImageUrl: data.destinationImageUrl,
    timestamp: apiResponse.timestamp,
  };
}; 