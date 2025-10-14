import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// --- Test route ---
app.get("/check-env", (req, res) => {
  res.json({
    status: "ok",
    API_KEY: process.env.BINANCE_API_KEY ? "✅ Loaded" : "❌ Missing",
    BASE_URL: "https://testnet.binance.vision",
  });
});

// --- New route to fetch BTC price ---
app.get("/price", async (req, res) => {
  try {
    const response = await fetch("https://testnet.binance.vision/api/v3/ticker/price?symbol=BTCUSDT");
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching price", details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ StarZone backend running on port ${PORT}`));
