import { orderStore, triggerFulfillmentAfterPayment } from "../lib/fulfillment.js";

export default async function handler(req, res) {
  const { orderId } = req.query || {};
  if (!orderId) return res.status(400).json({ error: "Missing orderId" });

  const localOrder = orderStore.get(orderId);
  const apiKey = process.env.ZAPUPI_API_KEY;
  const secretKey = process.env.ZAPUPI_SECRET_KEY;
  const statusUrl = process.env.ZAPUPI_STATUS_URL || "https://pay.zapupi.com/api/order-status";

  if (!apiKey || !secretKey) {
    return res.status(200).json({ orderId, status: localOrder?.status || "Pending" });
  }

  try {
    const zapRes = await fetch(statusUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token_key: apiKey, secret_key: secretKey, order_id: orderId }),
    });
    const data = await zapRes.json();

    const isPaid =
      data.status === "SUCCESS" ||
      data.txn_status === "SUCCESS" ||
      data.result?.status === "SUCCESS";

    if (isPaid && localOrder) {
      await triggerFulfillmentAfterPayment(localOrder);
      return res.status(200).json({ orderId, status: "Processing", fulfilled: true });
    }

    return res.status(200).json({ orderId, status: localOrder?.status || "Pending" });
  } catch {
    return res.status(500).json({ error: "Status check failed" });
  }
}
