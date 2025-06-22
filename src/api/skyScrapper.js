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
  // Search flights using the correct endpoint
  searchFlights: async (params) => {
    try {
      console.log("Searching flights with params:", params);

      const endpoint = USE_PROXY
        ? "/api/search-flights"
        : "/api/v1/flights/searchFlights";

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
        },
      });

      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Flight Search Error:",
        error.response?.data || error.message
      );

      // Try alternative endpoint if first fails
      try {
        console.log("Trying alternative endpoint...");
        const altResponse = await skyScrapperAPI.get(
          "/api/v2/flights/searchFlights",
          {
            params: {
              originSkyId: params.origin,
              destinationSkyId: params.destination,
              originEntityId: params.originEntityId,
              destinationEntityId: params.destinationEntityId,
              date: params.departureDate,
              returnDate: params.returnDate,
              adults: params.passengers,
              currency: "USD",
            },
          }
        );

        console.log("Alternative API Response:", altResponse.data);
        return altResponse.data;
      } catch (altError) {
        console.error(
          "Alternative endpoint also failed:",
          altError.response?.data || altError.message
        );
        throw error; // Throw original error
      }
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

      // Try without api prefix
      try {
        const altResponse = await skyScrapperAPI.get("/flights/searchAirport", {
          params: {
            query,
            locale: "en-US",
          },
        });
        return altResponse.data;
      } catch (altError) {
        throw error;
      }
    }
  },

  // Test multiple endpoints to find working ones
  testConnection: async () => {
    const endpoints = [
      "/api/v1/flights/searchAirport",
      "/api/v2/flights/searchAirport",
      "/flights/searchAirport",
      "/v1/flights/searchAirport",
      "/v2/flights/searchAirport",
      "/searchAirport",
      "/api/v1/flights/getPriceCalendar",
      "/flights/getPriceCalendar",
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`Testing endpoint: ${endpoint}`);

        const response = await skyScrapperAPI.get(endpoint, {
          params: {
            query: "New York",
            locale: "en-US",
          },
        });

        console.log(`✅ Working endpoint found: ${endpoint}`, response.data);
        return {
          success: true,
          endpoint,
          data: response.data,
        };
      } catch (error) {
        console.log(
          `❌ Failed endpoint: ${endpoint} - ${
            error.response?.status || error.message
          }`
        );
        continue;
      }
    }

    // If no endpoints work, try a basic GET to see what's available
    try {
      const response = await skyScrapperAPI.get("/");
      console.log("Root endpoint response:", response.data);
      return {
        success: false,
        message: "No working endpoints found, but API is reachable",
        rootResponse: response.data,
      };
    } catch (error) {
      throw new Error(
        `All endpoints failed. API might be down or credentials invalid. Last error: ${error.message}`
      );
    }
  },

  // (Optional) expose root endpoint for manual debug
  getEndpoints: async () => {
    try {
      const response = await skyScrapperAPI.get("/");
      return response.data;
    } catch (error) {
      console.error("Could not get API endpoints:", error.message);
      throw error;
    }
  },
};

export default skyScrapperAPI;
