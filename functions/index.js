const { onRequest } = require("firebase-functions/v2/https");

exports.sendSms = onRequest({ invoker: "public", cors: true }, async (req, res) => {
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
  res.status(200).json(data);
});
