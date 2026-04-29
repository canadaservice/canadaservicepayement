app.post("/deposit", async (req, res) => {
  try {
    const { phone, amount, country, operator } = req.body;

    const depositId = crypto.randomUUID();

    // 🔥 Mapping dynamique opérateur
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
      return res.status(400).json({ error: "Opérateur non supporté" });
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
    console.log(error.response?.data || error.message);

    res.status(500).json({
      error: error.response?.data || error.message
    });
  }
});
