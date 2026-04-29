app.post("/deposit", async (req, res) => {
  try {
    const { phone, amount, country, operator } = req.body;

    const depositId = crypto.randomUUID();

    // 🔥 mapping intelligent
    const correspondents = {
      BEN: {
        MTN: "MTN_MOMO_BEN",
        MOOV: "MOOV_MONEY_BEN"
      },
      CIV: {
        MTN: "MTN_MOMO_CIV",
        ORANGE: "ORANGE_CI"
      },
      CMR: {
        MTN: "MTN_MOMO_CMR",
        ORANGE: "ORANGE_CMR"
      }
    };

    const correspondent = correspondents[country]?.[operator];

    if (!correspondent) {
      return res.status(400).json({ error: "Operateur non supporté" });
    }

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
            value: phone.replace("+", "")
          }
        },
        customerTimestamp: new Date().toISOString(),
        statementDescription: "Paiement ACDH"
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);

  } catch (error) {
    console.log(error.response?.data);
    res.status(500).json(error.response?.data);
  }
});
