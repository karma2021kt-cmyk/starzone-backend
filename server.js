// server.js — Buy/Sell System Enabled
import express from "express";
import fetch from "node-fetch";
import crypto from "crypto";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const BASE_URL = process.env.BASE_URL || "https://testnet.binance.vision";
const API_KEY = process.env.BINANCE_API_KEY;
const SECRET_KEY = process.env.BINANCE_SECRET_KEY;

// ✅ Check environment
app.get("/check-env", (req, res) => {
  res.json({
    status: "ok",
    API_KEY: API_KEY ? "✅ Loaded" : "❌ Missing",
    BASE_URL,
  });
});

// ✅ Get account balance (testnet)
app.get("/api/balance", async (req, res) => {
  try {
    const timestamp = Date.now();
    const query = `timestamp=${timestamp}`;
    const signature = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(query)
      .digest("hex");

    const response = await fetch(`${BASE_URL}/api/v3/account?${query}&signature=${signature}`, {
      headers: { "X-MBX-APIKEY": API_KEY },
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Place BUY or SELL order
app.post("/api/order", async (req, res) => {
  try {
    const { symbol, side, quantity } = req.body;
    const timestamp = Date.now();
    const params = `symbol=${symbol}&side=${side}&type=MARKET&quantity=${quantity}&timestamp=${timestamp}`;
    const signature = crypto.createHmac("sha256", SECRET_KEY).update(params).digest("hex");

    const response = await fetch(`${BASE_URL}/api/v3/order?${params}&signature=${signature}`, {
      method: "POST",
      headers: { "X-MBX-APIKEY": API_KEY },
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Health check
app.get("/", (req, res) => {
  res.send("StarZone Backend with Buy/Sell Ready 🚀");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
