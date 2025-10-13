// server.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Environment variables
const API_KEY = process.env.BINANCE_API_KEY;
const API_SECRET = process.env.BINANCE_API_SECRET;
const BASE_URL = process.env.BINANCE_TESTNET_BASE || "https://testnet.binance.vision";

// ✅ Check server health
app.get("/", (req, res) => {
  res.send("✅ StarZone Trading backend is running successfully!");
});

// ✅ Endpoint to check environment variables
app.get("/check-env", (req, res) => {
  if (API_KEY && API_SECRET && BASE_URL) {
    res.json({ status: "ok", API_KEY: "✅ Loaded", BASE_URL });
  } else {
    res.json({ status: "error", message: "Missing environment variables" });
  }
});

// ✅ Example endpoint to get Binance account balance
app.get("/balance", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v3/ping`);
    res.json({
      message: "Connection successful (Testnet Ping OK)",
      binanceResponse: response.data,
    });
  } catch (error) {
    console.error("Error fetching from Binance:", error.message);
    res.status(500).json({ error: "Failed to reach Binance API" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
