export type Product = {
  id: number;
  name: string;
  category: string;
  sku: string;
  price: number;
  cost: number;
  onHand: number;
  reserved: number;
  threshold: number;
  published: boolean;
  image: string;
};

export const initialProducts: Product[] = [
  {
    id: 1,
    name: "Classic Black Handbag",
    category: "Bags",
    sku: "AF-BAG-001",
    price: 15000,
    cost: 8200,
    onHand: 12,
    reserved: 3,
    threshold: 4,
    published: true,
    image:
      "https://images.unsplash.com/photo-1665832102613-5b94286ec041?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    name: "Everyday Black Heels",
    category: "Shoes",
    sku: "AF-SHO-018",
    price: 22000,
    cost: 12000,
    onHand: 7,
    reserved: 1,
    threshold: 3,
    published: true,
    image:
      "https://images.unsplash.com/photo-1632497775897-815042a13216?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    name: "Blue Linen Dress",
    category: "Dresses",
    sku: "AF-DRS-024",
    price: 28500,
    cost: 14500,
    onHand: 3,
    reserved: 2,
    threshold: 3,
    published: true,
    image:
      "https://images.unsplash.com/photo-1731505583021-16c3a17339cd?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    name: "Gold Drop Earrings",
    category: "Accessories",
    sku: "AF-ACC-011",
    price: 9500,
    cost: 3800,
    onHand: 18,
    reserved: 0,
    threshold: 5,
    published: false,
    image:
      "https://images.unsplash.com/photo-1692521248622-98a1da77b673?auto=format&fit=crop&w=600&q=80",
  },
];

export type Customer = {
  id: number;
  name: string;
  initials: string;
  phone: string;
  email: string;
  source: string;
  orders: number;
  spend: number;
  lastActivity: string;
  segment: "New" | "Returning" | "VIP" | "Inactive";
  location: string;
  notes: string;
};

export const initialCustomers: Customer[] = [
  {
    id: 1,
    name: "Aisha Bello",
    initials: "AB",
    phone: "+234 803 441 2098",
    email: "aisha.bello@example.com",
    source: "Instagram",
    orders: 8,
    spend: 185000,
    lastActivity: "12 minutes ago",
    segment: "Returning",
    location: "Lekki, Lagos",
    notes: "Prefers delivery after 5pm. Usually shops for dresses.",
  },
  {
    id: 2,
    name: "Chinedu Okafor",
    initials: "CO",
    phone: "+234 806 772 1044",
    email: "chinedu@example.com",
    source: "WhatsApp",
    orders: 12,
    spend: 342500,
    lastActivity: "Yesterday",
    segment: "VIP",
    location: "Wuse 2, Abuja",
    notes: "Repeat buyer. Confirm colour before dispatch.",
  },
  {
    id: 3,
    name: "Zainab Yusuf",
    initials: "ZY",
    phone: "+234 809 204 7881",
    email: "zainab.y@example.com",
    source: "Website",
    orders: 2,
    spend: 57000,
    lastActivity: "2 days ago",
    segment: "Returning",
    location: "Ikeja, Lagos",
    notes: "Discovered the store through the new collection page.",
  },
  {
    id: 4,
    name: "Emeka Obi",
    initials: "EO",
    phone: "+234 814 350 9912",
    email: "emeka.obi@example.com",
    source: "Referral",
    orders: 0,
    spend: 0,
    lastActivity: "3 days ago",
    segment: "New",
    location: "Enugu",
    notes: "Asked about wholesale pricing.",
  },
  {
    id: 5,
    name: "Mary Johnson",
    initials: "MJ",
    phone: "+234 701 112 4306",
    email: "maryj@example.com",
    source: "Walk-in",
    orders: 5,
    spend: 128000,
    lastActivity: "8 days ago",
    segment: "Inactive",
    location: "Yaba, Lagos",
    notes: "Usually purchases accessories in store.",
  },
];

export type Lead = {
  id: number;
  customer: string;
  initials: string;
  product: string;
  value: number;
  source: string;
  owner: string;
  followUp: string;
  stage: string;
};

export const leadStages = [
  "New Enquiry",
  "Interested",
  "Quote Sent",
  "Checkout Sent",
  "Won",
];

export type OrderItem = {
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  variant?: string;
};

export type BusinessOrder = {
  id: number;
  number: string;
  customerId: number;
  customerName: string;
  source: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  orderStatus:
    "Draft" | "Awaiting Payment" | "Processing" | "Completed" | "Cancelled";
  paymentStatus: "Pending" | "Paid" | "Refunded";
  fulfilmentStatus:
    | "Unfulfilled"
    | "Processing"
    | "Ready"
    | "Ready to Pack"
    | "Packed"
    | "Ready for Dispatch"
    | "Delivered";
  createdAt: string;
  paymentLink?: string;
  paymentMethod?: string;
  deliveryMethod?: "Home delivery" | "Store pickup";
};

export const initialBusinessOrders: BusinessOrder[] = [
  {
    id: 128,
    number: "SW-00128",
    customerId: 1,
    customerName: "Aisha Bello",
    source: "Instagram",
    items: [
      { productId: 3, name: "Blue Linen Dress", quantity: 1, unitPrice: 28500 },
    ],
    subtotal: 28500,
    deliveryFee: 2500,
    total: 31000,
    orderStatus: "Processing",
    paymentStatus: "Paid",
    fulfilmentStatus: "Ready to Pack",
    createdAt: "8 Oct 2026, 10:24",
  },
  {
    id: 127,
    number: "SW-00127",
    customerId: 3,
    customerName: "Zainab Yusuf",
    source: "WhatsApp",
    items: [
      {
        productId: 2,
        name: "Everyday Black Heels",
        quantity: 1,
        unitPrice: 22000,
      },
    ],
    subtotal: 22000,
    deliveryFee: 2000,
    total: 24000,
    orderStatus: "Awaiting Payment",
    paymentStatus: "Pending",
    fulfilmentStatus: "Unfulfilled",
    createdAt: "8 Oct 2026, 09:42",
    paymentLink: "https://sellwella.demo/pay/SW-00127",
  },
  {
    id: 126,
    number: "SW-00126",
    customerId: 2,
    customerName: "Chinedu Okafor",
    source: "Website",
    items: [
      {
        productId: 1,
        name: "Classic Black Handbag",
        quantity: 2,
        unitPrice: 15000,
      },
    ],
    subtotal: 30000,
    deliveryFee: 3000,
    total: 33000,
    orderStatus: "Completed",
    paymentStatus: "Paid",
    fulfilmentStatus: "Delivered",
    createdAt: "7 Oct 2026, 16:10",
  },
];
