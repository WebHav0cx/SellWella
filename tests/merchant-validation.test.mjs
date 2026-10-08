import assert from "node:assert/strict";
import test from "node:test";
import {
  adjustmentSchema,
  customerSchema,
  orderSchema,
  productSchema,
} from "../src/features/merchant/schemas.ts";

const product = {
  name: "Tote",
  category: "Bags",
  sku: "",
  price: "15000",
  cost: "",
  stock: "0",
  threshold: "3",
  published: true,
};

test("products accept zero opening stock and reject invalid money or fractional units", () => {
  assert.equal(productSchema.safeParse(product).success, true);
  for (const update of [
    { name: " " },
    { price: "-1" },
    { price: "Infinity" },
    { stock: "1.5" },
    { threshold: "-2" },
  ]) {
    assert.equal(
      productSchema.safeParse({ ...product, ...update }).success,
      false,
    );
  }
});

test("customer validation permits an optional email and validates contact details", () => {
  const customer = {
    name: "Amina",
    phone: "+234 801 234 5678",
    email: "",
    source: "WhatsApp",
    location: "",
  };
  assert.equal(customerSchema.safeParse(customer).success, true);
  assert.equal(
    customerSchema.safeParse({ ...customer, phone: "abc" }).success,
    false,
  );
  assert.equal(
    customerSchema.safeParse({ ...customer, email: "invalid" }).success,
    false,
  );
});

test("stock adjustments require non-zero whole quantities in either direction", () => {
  for (const quantity of ["4", "-2"])
    assert.equal(
      adjustmentSchema.safeParse({ quantity, reason: "Stock count correction" })
        .success,
      true,
    );
  for (const quantity of ["", "0", "1.5", "NaN"])
    assert.equal(
      adjustmentSchema.safeParse({ quantity, reason: "Stock count correction" })
        .success,
      false,
    );
});

test("orders require a customer and reject negative or invalid delivery fees", () => {
  const order = {
    customerId: 1,
    source: "WhatsApp",
    deliveryFee: "0",
    notes: "",
  };
  assert.equal(orderSchema.safeParse(order).success, true);
  for (const update of [
    { customerId: 0 },
    { deliveryFee: "-10" },
    { deliveryFee: "NaN" },
  ])
    assert.equal(orderSchema.safeParse({ ...order, ...update }).success, false);
});
