import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.BINANCE_API_KEY;
const API_SECRET = process.env.BINANCE_API_SECRET;
const BASE_URL = "https://testnet.binance.vision";

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🚀 StarZone Backend is Running Successfully!");
});

// ✅ Check env route
app.get("/check-env", (req, res) => {
  res.json({
    status: "ok",
    API_KEY: API_KEY ? "✅ Loaded" : "❌ Missing",
    BASE_URL
  });
});

// ✅ BTC Price route
app.get("/price", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v3/ticker/price?symbol=BTCUSDT`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching price", details: err.message });
  }
});

// ✅ Balance route
app.get("/balance", async (req, res) => {
  try {
    const timestamp = Date.now();
    const query = `timestamp=${timestamp}`;
    const signature = crypto.createHmac("sha256", API_SECRET).update(query).digest("hex");

    const response = await fetch(`${BASE_URL}/api/v3/account?${query}&signature=${signature}`, {
      headers: { "X-MBX-APIKEY": API_KEY }
    });

    const data = await response.json();
    res.json(data.balances || data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching balance", details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ StarZone backend running on port ${PORT}`));
