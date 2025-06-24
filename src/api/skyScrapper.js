import axios from "axios";

// Decide whether to hit RapidAPI directly or a local proxy
const USE_PROXY = !!import.meta.env.VITE_PROXY_URL;

const skyScrapperAPI = axios.create(
  USE_PROXY
    ? {
        baseURL: import.meta.env.VITE_PROXY_URL, // e.g., http://localhost:5000
      }
    : {
        baseURL: "https://sky-scrapper.p.rapidapi.com",
        headers: {
          "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
          "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
        },
      }
);

// API endpoints based on Sky Scrapper documentation
export const flightAPI = {
  // Search flights using the v2 endpoint
  searchFlights: async (params) => {
    try {
      console.log("Searching flights with params:", params);

      const endpoint = USE_PROXY
        ? "/api/search-flights"
        : "/api/v2/flights/searchFlights";

      const response = await skyScrapperAPI.get(endpoint, {
        params: {
          originSkyId: params.origin,
          destinationSkyId: params.destination,
          originEntityId: params.originEntityId,
          destinationEntityId: params.destinationEntityId,
          date: params.departureDate,
          returnDate: params.returnDate,
          cabinClass: params.cabinClass,
          adults: params.passengers,
          sortBy: "best",
          currency: "USD",
          market: "en-US",
          countryCode: "US",
          // New v2 optional parameters
          limit: params.limit || 100,
          carriersIds: params.carriersIds,
        },
      });

      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Flight Search Error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Search airports for autocomplete
  searchAirports: async (query) => {
    try {
      console.log("Searching airports for:", query);

      const response = await skyScrapperAPI.get(
        "/api/v1/flights/searchAirport",
        {
          params: {
            query,
            locale: "en-US",
          },
        }
      );

      console.log("Airport Search Response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Airport Search Error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default skyScrapperAPI;
