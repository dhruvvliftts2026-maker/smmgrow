export const orderStore = globalThis.__a1smmOrders || (globalThis.__a1smmOrders = new Map());

export async function triggerFulfillmentAfterPayment(order) {
  if (!order || order.fulfilled) return { mode: "already_processed" };

  const autoSmmEnabled = process.env.ENABLE_AUTO_SMM_FULFILLMENT === "true";

  if (autoSmmEnabled && process.env.SMM_API_URL && process.env.SMM_API_KEY) {
    const smmRes = await fetch(process.env.SMM_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: process.env.SMM_API_KEY,
        action: "add",
        service: order.smmServiceId,
        link: order.targetLink,
        quantity: Math.round(order.quantity * 1.1),
      }),
    });

    const smmData = await smmRes.json();
    order.fulfilled = true;
    order.status = "Processing";
    order.providerOrderId = smmData.order || null;
    orderStore.set(order.orderId, order);
    return { mode: "auto_smm", providerOrderId: order.providerOrderId };
  }

  order.fulfilled = true;
  order.status = "Processing";
  orderStore.set(order.orderId, order);
  console.log(
    `[MANUAL FULFILLMENT] Order ${order.orderId} | ${order.serviceId} x${order.quantity} (+10%) | Link: ${order.targetLink} | WhatsApp: +919696385458`
  );
  return { mode: "manual_whatsapp" };
}
