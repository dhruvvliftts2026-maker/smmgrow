import { SERVER_CATALOG } from "../lib/catalog.js";
import { orderStore } from "../lib/fulfillment.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ZAPUPI_API_KEY;
  const secretKey = process.env.ZAPUPI_SECRET_KEY;
  const createUrl = process.env.ZAPUPI_CREATE_ORDER_URL || "https://pay.zapupi.com/api/create-order";

  if (!apiKey || !secretKey) {
    return res.status(503).json({
      error: "ZAPUPI_API_KEY / ZAPUPI_SECRET_KEY not set on server.",
    });
  }

  try {
    const { orderId, buyerId, serviceId, quantity, targetLink } = req.body || {};
    const service = SERVER_CATALOG[serviceId];
    const verifiedPrice = service?.prices?.[Number(quantity)];

    if (!orderId || !verifiedPrice || !targetLink) {
      return res.status(400).json({ error: "Invalid package or target link." });
    }

    orderStore.set(orderId, {
      orderId,
      buyerId: buyerId || "guest",
      serviceId,
      smmServiceId: service.smmServiceId,
      quantity: Number(quantity),
      amount: verifiedPrice,
      targetLink,
      status: "Pending",
      fulfilled: false,
    });

    const zapRes = await fetch(createUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token_key: apiKey,
        secret_key: secretKey,
        order_id: orderId,
        amount: String(verifiedPrice),
        redirect_url: `${process.env.SITE_URL || ""}/?order=${encodeURIComponent(orderId)}`,
        remark: `${serviceId} x${quantity}`,
      }),
    });

    const data = await zapRes.json();

    if (data.status === true || data.status === "success" || data.payment_url) {
      return res.status(200).json({
        order_id: orderId,
        payment_url: data.payment_url || data.result?.payment_url || null,
        upi_intent: data.upi_intent || data.payment_url || null,
      });
    }

    return res.status(400).json({ error: data.message || "ZapUPI order creation failed." });
  } catch (err) {
    return res.status(500).json({ error: "Server payment error." });
  }
}
