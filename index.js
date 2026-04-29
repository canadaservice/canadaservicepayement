const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

const API_KEY = process.env.API_KEY;

// test serveur
app.get("/", (req, res) => {
  res.send("API Pawapay actif 🚀");
});

// endpoint deposit
app.post("/deposit", async (req, res) => {
  try {
    const { phone, amount, country } = req.body;

    const response = await axios.post(
      "https://api.pawapay.io/v1/deposits",
      {
        depositId: crypto.randomUUID(),
        amount: amount,
        currency: "XOF",
        country: country,
        correspondent: "MTN_MOMO_BEN",
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

    res.json(response.data);

  } catch (error) {
    res.status(500).json({
      error: error.response?.data || error.message
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
