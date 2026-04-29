const express = require("express");
const axios = require("axios");
const crypto = require("crypto");

const app = express();
app.use(express.json());

// 🔐 API KEY (depuis Render ENV)
const API_KEY = process.env.API_KEY;

// 🟢 TEST SERVEUR
app.get("/", (req, res) => {
  res.send("API Pawapay actif 🚀");
});

// 🔥 ROUTE DEPOSIT (IMPORTANT)
app.post("/deposit", async (req, res) => {
  try {
    const { phone, amount, country } = req.body;

    const depositId = crypto.randomUUID();

    const response = await axios.post(
      "https://api.pawapay.io/v1/deposits",
      {
        depositId: depositId,
        amount: amount,
        currency: "XOF",
        country: country,
        correspondent: "MTN_MOMO_BEN",
        payer: {
          type: "MSISDN",
          address: {
            value: phone
          }
        },
        customerTimestamp: new Date().toISOString(),
        statementDescription: "Paiement ACDH"
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);

  } catch (error) {
    res.status(500).json({
      error: error.response?.data || error.message
    });
  }
});

// 🚀 LANCEMENT SERVEUR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Serveur lancé sur port " + PORT);
});
