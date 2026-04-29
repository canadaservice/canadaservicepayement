async function payer() {
  const phone = document.getElementById("phone").value;
  const amount = document.getElementById("amount").value;
  const country = document.getElementById("country").value;
  const operator = document.getElementById("operator").value;

  const result = document.getElementById("result");

  // 🔄 message en cours
  result.innerText = "⏳ Paiement en cours...";

  try {
    const res = await fetch("https://pawapay-api.onrender.com/deposit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        phone,
        amount,
        country,
        operator
      })
    });

    const data = await res.json();

    // ✅ succès
    if (data.status === "ACCEPTED") {
      result.innerText = "✅ Paiement envoyé sur votre téléphone";
    } else {
      result.innerText = "❌ Erreur : " + JSON.stringify(data);
    }

  } catch (err) {
    result.innerText = "❌ Erreur réseau";
  }
}
