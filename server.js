// ✅ STARZONE Backend (Final Version)
// Created for Karma 2021 — Secure Binance Testnet Integration

import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import crypto from "crypto";

// 🧩 Load environment variables from Render (.env)
dotenv.config();

const app = express();
app.use(express.json());

// 🌍 Port setup (Render provides PORT automatically)
const PORT = process.env.PORT || 3000;

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🚀 StarZone TTrade Backend Running Successfully!");
});

// ✅ Environment test route
app.get("/check-env", (req, res) => {
  if (
    process.env.BINANCE_API_KEY &&
    process.env.BINANCE_API_SECRET &&
    process.env.BINANCE_TESTNET_BASE
  ) {
    res.json({ status: "✅ Environment loaded successfully" });
  } else {
    res.json({ status: "❌ Missing environment variables" });
  }
});

// ✅ Binance API example route — check account balance (Testnet)
app.get("/api/balance", async (req, res) => {
  try {
    const timestamp = Date.now();
    const query = `timestamp=${timestamp}`;
    const signature = crypto
      .createHmac("sha256", process.env.BINANCE_API_SECRET)
      .update(query)
      .digest("hex");

    const response = await axios.get(
      `${process.env.BINANCE_TESTNET_BASE}/api/v3/account?${query}&signature=${signature}`,
      {
        headers: {
          "X-MBX-APIKEY": process.env.BINANCE_API_KEY,
        },
      }
    );

    res.json({
      status: "✅ Balance fetched successfully",
      balances: response.data.balances,
    });
  } catch (error) {
    res.status(400).json({
      status: "❌ Error fetching balance",
      error: error.response ? error.response.data : error.message,
    });
  }
});

// ✅ Keep alive route for Render (optional)
app.get("/ping", (req, res) => res.send("pong"));

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`✅ Server live on port ${PORT}`);
});
