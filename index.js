export default {
  async fetch(request) {

    const url = new URL(request.url);

    // ✅ Test API
    if (url.pathname === "/") {
      return new Response("API Pawapay OK 🚀");
    }

    // 🔥 ROUTE DEPOSIT
    if (url.pathname === "/deposit") {

      // 🔐 CORS
      const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      };

      // OPTIONS (important)
      if (request.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
      }

      try {
        const body = await request.json();

        const { phone, amount, country, operator } = body;

        // 🔥 Mapping opérateurs Pawapay
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
          return new Response(JSON.stringify({
            error: "Opérateur non supporté"
          }), { headers: corsHeaders });
        }

        // 🔐 TA CLE API
        const API_KEY = "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjI4NzMiLCJtYXYiOiIxIiwiZXhwIjoyMDkzMDc1OTk4LCJpYXQiOjE3Nzc0NTY3OTgsInBtIjoiREFGLFBBRiIsImp0aSI6ImExZjQ1ZGM4LWUwMzctNDE4Mi1hN2UwLTU0YWIwY2M2YjhlMyJ9.dbW4tATK1rVgRgRjvhYbB3TBtP6UcVMdg4wzpj7-fpPYK96DEUkV-EDx_rJmxrlb7ErvgpaeNltjoWgaCaUFKA"; // ⚠️ remplace ici

        const response = await fetch("https://api.pawapay.io/v1/deposits", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            depositId: crypto.randomUUID(),
            amount: amount.toString(),
            currency: "XOF",
            country,
            correspondent,
            payer: {
              type: "MSISDN",
              address: { value: phone }
            },
            customerTimestamp: new Date().toISOString(),
            statementDescription: "Paiement ACDH"
          })
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
          headers: corsHeaders
        });

      } catch (err) {
        return new Response(JSON.stringify({
          error: "Erreur serveur",
          detail: err.toString()
        }), {
          headers: {
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
    }

    return new Response("Not found", { status: 404 });
  }
};
