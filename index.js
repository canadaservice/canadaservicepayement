app.post("/api/pay", async (req, res) => {

  let { phone, service, country, operator } = req.body;

  // 🔥 garantir format international
  if (!phone.startsWith("+")) {
    phone = "+" + phone;
  }

  const usd = services[service];
  const currency = currencies[country];
  const amount = Math.round(usd * rates[currency]);

  try {

    const paymentRes = await fetch("https://orange-queen.serviceprive93.workers.dev/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone,
        amount,
        country,
        operator
      })
    });

    const data = await paymentRes.json();

    res.json({
      status: data.status,
      amount,
      currency
    });

  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }

});
