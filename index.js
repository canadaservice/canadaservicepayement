const express = require("express");
const fetch = require("node-fetch");
const crypto = require("crypto");

const app = express();
app.use(express.json());

// Test serveur
app.get("/", (req, res) => {
  res.send("Serveur PawaPay actif ✅");
});

// API dépôt
app.post("/deposit", async (req, res) => {
  try {
    const { phone, amount, country } = req.body;

    const response = await fetch("https://api.pawapay.io/v1/deposits", {
      method: "POST",
      headers: {
        "Authorization": "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjI4NzMiLCJtYXYiOiIxIiwiZXhwIjoyMDkzMDA5NjgzLCJpYXQiOjE3NzczOTA0ODMsInBtIjoiREFGLFBBRiIsImp0aSI6IjUzNTZhMDk3LTI3OWUtNDc3OC1iYjJmLTJjYTdlZGUyYzhiNyJ9.aU6iU3ukFK9uUZVjvv_2NP02-gCWjv9F8nIzGC5Yz9w_cfi4AyeNMst6bW9b2ULnrNcC8uR1Y65MSqjodtCbVA",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
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
      })
    });

    const data = await response.json();
    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Serveur lancé");
});
