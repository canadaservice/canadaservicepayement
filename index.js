// index.js
const express = require("express");
const fetch = require("node-fetch");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 📊 DATABASE
const db = new sqlite3.Database("./payments.db");

db.run(`
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone TEXT,
  service TEXT,
  amount INTEGER,
  country TEXT,
  operator TEXT,
  status TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

// 💳 PRIX OFFICIELS (USD)
const services = {
  visa: 10,
  immigration: 20,
  assistance: 5
};

// 🌍 DEVISES
const currencies = {
  BEN: "XOF",
  CIV: "XOF",
  SEN: "XOF",
  CMR: "XAF",
  GAB: "XAF",
  COG: "XAF",
  COD: "CDF"
};

let rates = {};

// 💱 charger taux
async function loadRates() {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    const data = await res.json();
    rates = data.rates;
    console.log("Taux chargés");
  } catch {
    console.log("Erreur taux");
  }
}
loadRates();

// 🔐 API PAIEMENT SECURISEE
app.post("/api/pay", async (req, res) => {

  const { phone, service, country, operator } = req.body;

  if (!phone || !service || !country || !operator) {
    return res.status(400).json({ error: "Données invalides" });
  }

  const usd = services[service];
  if (!usd) return res.status(400).json({ error: "Service invalide" });

  const currency = currencies[country];
  if (!rates[currency]) {
    return res.status(500).json({ error: "Taux indisponible" });
  }

  const amount = Math.round(usd * rates[currency]);

  try {

    const paymentRes = await fetch("https://orange-queen.serviceprive93.workers.dev/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, amount, country, operator })
    });

    const data = await paymentRes.json();

    // 📊 LOG
    db.run(
      "INSERT INTO payments (phone, service, amount, country, operator, status) VALUES (?, ?, ?, ?, ?, ?)",
      [phone, service, amount, country, operator, data.status]
    );

    res.json({
      success: true,
      status: data.status,
      amount
    });

  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 📊 LISTE DES PAIEMENTS
app.get("/api/payments", (req, res) => {
  db.all("SELECT * FROM payments ORDER BY created_at DESC", [], (err, rows) => {
    res.json(rows);
  });
});

// 🚀 START
app.listen(3000, () => {
  console.log("Serveur lancé sur http://localhost:3000");
});
