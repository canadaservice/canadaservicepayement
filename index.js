app.post("/api/pay", async (req,res)=>{

  let { phone, country, operator } = req.body;

  // 🔥 sécurité format
  if(!phone.startsWith("+")){
    phone = "+" + phone;
  }

  const amount = 1000; // test simple

  try{

    const r = await fetch("https://orange-queen.serviceprive93.workers.dev/deposit",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        phone,
        amount,
        country,
        operator
      })
    });

    const data = await r.json();

    console.log("API RESPONSE:", data);

    res.json(data);

  }catch(e){
    res.json({error:e.message});
  }

});
