import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";
// Resolve application TypeScript imports for Node's built-in type stripping.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (
      specifier.startsWith(".") &&
      context.parentURL?.includes("/src/") &&
      !/\.[a-z]+$/i.test(specifier)
    )
      return nextResolve(`${specifier}.ts`, context);
    return nextResolve(specifier, context);
  },
});
const { createCommerceStore } =
  await import("../src/features/merchant/commerce-store.ts");
const { savedCommerceSchema } =
  await import("../src/features/merchant/commerce-schemas.ts");
const input = {
  customerId: 1,
  source: "Storefront",
  items: [{ productId: 1, quantity: 2 }],
  mode: "link",
  deliveryFee: 2500,
};

test("failed checkout does not create customers or reserve stock, including across variants", () => {
  const store = createCommerceStore();
  const before = structuredClone(savedCommerceSchema.parse(store.getState()));
  const result = store.getState().createOrder({
    ...input,
    customerId: undefined,
    customer: { name: "New Customer", phone: "+2348012345678" },
    items: [
      { productId: 1, quantity: 5, variant: "Black" },
      { productId: 1, quantity: 5, variant: "Brown" },
    ],
  });
  assert.equal(result.ok, false);
  assert.deepEqual(savedCommerceSchema.parse(store.getState()), before);
  for (const update of [
    { deliveryFee: -1 },
    { items: [{ productId: 1, quantity: 1.5 }] },
    { items: [{ productId: 4, quantity: 1 }] },
  ])
    assert.equal(
      store.getState().createOrder({ ...input, ...update }).ok,
      false,
    );
});

test("reserve, confirm payment once, and fulfil an order without double-counting", () => {
  const store = createCommerceStore();
  const before = store.getState();
  const product = before.products.find((item) => item.id === 1);
  const customer = before.customers.find((item) => item.id === 1);
  const result = store.getState().createOrder(input);
  assert.equal(result.ok, true);
  const id = result.order.id;
  assert.equal(
    store.getState().products.find((item) => item.id === 1).reserved,
    product.reserved + 2,
  );
  assert.equal(store.getState().confirmDemoPayment(id).ok, true);
  assert.equal(
    store.getState().products.find((item) => item.id === 1).onHand,
    product.onHand - 2,
  );
  assert.equal(
    store.getState().products.find((item) => item.id === 1).reserved,
    product.reserved,
  );
  assert.equal(
    store.getState().customers.find((item) => item.id === 1).spend,
    customer.spend + result.order.total,
  );
  const state = savedCommerceSchema.parse(store.getState());
  assert.equal(store.getState().confirmDemoPayment(id).ok, false);
  assert.deepEqual(savedCommerceSchema.parse(store.getState()), state);
  assert.equal(store.getState().updateFulfilment(id, "Delivered").ok, true);
  assert.equal(
    store.getState().orders.find((item) => item.id === id).orderStatus,
    "Completed",
  );
});

test("cancellation releases a reservation only once and blocks payment", () => {
  const store = createCommerceStore();
  const before = store
    .getState()
    .products.find((item) => item.id === 1).reserved;
  const result = store.getState().createOrder(input);
  assert.equal(result.ok, true);
  store.getState().cancelOrder(result.order.id);
  store.getState().cancelOrder(result.order.id);
  assert.equal(
    store.getState().products.find((item) => item.id === 1).reserved,
    before,
  );
  assert.equal(store.getState().confirmDemoPayment(result.order.id).ok, false);
  assert.equal(
    store.getState().updateFulfilment(result.order.id, "Packed").ok,
    false,
  );
});

test("POS sales consume available stock directly and saved data validates before hydration", () => {
  const store = createCommerceStore();
  const product = store.getState().products.find((item) => item.id === 1);
  const result = store
    .getState()
    .createOrder({
      ...input,
      source: "POS",
      mode: "paid",
      paymentMethod: "POS cash",
    });
  assert.equal(result.ok, true);
  assert.equal(
    store.getState().products.find((item) => item.id === 1).reserved,
    product.reserved,
  );
  assert.equal(
    store.getState().products.find((item) => item.id === 1).onHand,
    product.onHand - 2,
  );
  assert.equal(result.order.fulfilmentStatus, "Ready to Pack");
  const data = savedCommerceSchema.parse(store.getState());
  data.products[0].reserved = data.products[0].onHand + 1;
  assert.equal(savedCommerceSchema.safeParse(data).success, false);
});
