const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 🔐 API KEY (Render ENV)
const API_KEY = process.env.API_KEY;

// ✅ TEST
app.get("/", (req, res) => {
  res.send("API Pawapay actif 🚀");
});

// 🔥 ROUTE DEPOSIT
app.post("/deposit", async (req, res) => {
  try {
    const { phone, amount, country, operator } = req.body;

    // 🔥 mapping opérateurs
    const correspondents = {
      BEN: {
        MTN: "MTN_MOMO_BEN",
        MOOV: "MOOV_BEN"
      },
      CIV: {
        MTN: "MTN_MOMO_CIV",
        ORANGE: "ORANGE_CIV"
      },
      CMR: {
        MTN: "MTN_MOMO_CMR",
        ORANGE: "ORANGE_CMR"
      }
    };

    const correspondent = correspondents[country]?.[operator];

    if (!correspondent) {
      return res.status(400).json({
        error: "Opérateur non supporté"
      });
    }

    const depositId = crypto.randomUUID();

    const response = await axios.post(
      "https://api.pawapay.io/v1/deposits",
      {
        depositId,
        amount,
        currency: "XOF",
        country,
        correspondent,
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
    console.log("❌ ERREUR:", error.response?.data || error.message);

    res.status(500).json({
      error: error.response?.data || error.message
    });
  }
});

// 🚀 START
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Serveur lancé sur port " + PORT);
});
