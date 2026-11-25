import crypto from "crypto";
import { orderStore, triggerFulfillmentAfterPayment } from "../lib/fulfillment.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const webhookSecret = process.env.ZAPUPI_WEBHOOK_SECRET;
  const signature = req.headers["x-zapupi-signature"];

  if (webhookSecret && signature) {
    const expected = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(req.body))
      .digest("hex");
    if (signature !== expected) {
      return res.status(401).json({ error: "Invalid webhook signature" });
    }
  }

  const { order_id, status } = req.body || {};
  if (!order_id) return res.status(400).json({ error: "Missing order_id" });

  if (status === "SUCCESS" || status === "PAID") {
    const order = orderStore.get(order_id);
    if (order) await triggerFulfillmentAfterPayment(order);
  }

  return res.status(200).json({ received: true });
}
