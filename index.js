const express = require("express");
const axios = require("axios");
const crypto = require("crypto");

const app = express();
app.use(express.json());

// 🔐 API KEY (Render)
const API_KEY = process.env.API_KEY;

// 🔍 Route test
app.get("/", (req, res) => {
  res.send("API Pawapay actif 🚀");
});

// 💰 ROUTE DEPOT
app.post("/deposit", async (req, res) => {
  try {
    const { phone, amount, country } = req.body;

    // 🔁 Adapter selon pays
    let correspondent = "MTN_MOMO_BEN";
    let currency = "XOF";

    if (country === "CMR") {
      correspondent = "MTN_MOMO_CMR";
      currency = "XAF";
    }

    if (country === "CIV") {
      correspondent = "MTN_MOMO_CIV";
      currency = "XOF";
    }

    const response = await axios.post(
      "https://api.pawapay.io/v1/deposits",
      {
        depositId: crypto.randomUUID(),
        amount: amount,
        currency: currency,
        country: country,
        correspondent: correspondent,
        customerTimestamp: new Date().toISOString(),
        payer: {
          type: "MSISDN",
          address: {
            value: phone
          }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});

// 🚀 Lancement serveur
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
