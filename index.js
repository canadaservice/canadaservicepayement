async function payer() {
  const phone = document.getElementById("phone").value.trim();
  const amount = document.getElementById("amount").value;
  const country = document.getElementById("country").value;
  const operator = document.getElementById("operator").value;
  const result = document.getElementById("result");
  const btn = document.getElementById("btn");

  if (!phone || !amount) {
    result.innerText = "❌ Remplis tous les champs";
    return;
  }

  const cleanPhone = phone.replace("+", "");

  btn.disabled = true;
  result.innerText = "⏳ Initialisation...";

  try {
    // 🔥 réveil serveur
    await fetch("https://pawapay-api.onrender.com/");
    await new Promise(r => setTimeout(r, 4000));

    result.innerText = "⏳ Envoi paiement...";

    const res = await fetch("https://pawapay-api.onrender.com/deposit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        phone: cleanPhone,
        amount,
        country,
        operator
      })
    });

    // 🔥 vérifier si réponse OK
    if (!res.ok) {
      throw new Error("Réponse serveur invalide");
    }

    const data = await res.json();
    console.log("SUCCESS:", data);

    if (data.status === "ACCEPTED") {
      result.innerText = "✅ Paiement envoyé 📲 Vérifie ton téléphone";
    } else {
      result.innerText = "❌ Réponse : " + JSON.stringify(data);
    }

  } catch (err) {
    console.log("ERREUR:", err);

    // ⚠️ message plus intelligent
    result.innerText = "⚠️ Connexion lente... réessaie dans 5 secondes";
  }

  btn.disabled = false;
}
