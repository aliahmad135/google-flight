// server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());

app.get("/api/search-flights", async (req, res) => {
  try {
    const response = await axios.get(
      "https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights",
      {
        params: req.query,
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
          "x-rapidapi-host": process.env.RAPIDAPI_HOST,
          "User-Agent": "Mozilla/5.0",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error?.response?.data || error.message);
    res.status(500).json({ error: "Proxy failed", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
