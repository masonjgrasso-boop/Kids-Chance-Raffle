const { onRequest } = require("firebase-functions/v2/https");

exports.sendSms = onRequest(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.status(204).send("");
    return;
  }
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }

  const { phone, message } = req.body;
  const key = process.env.TEXTBELT_KEY;

  const response = await fetch("https://textbelt.com/text", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, message, key }),
  });
  const data = await response.json();
  res.set("Access-Control-Allow-Origin", "*");
  res.status(200).json(data);
});
