"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { replySchema, type ReplyForm } from "./connected-schemas";
import { FieldError } from "@/components/ui/field-error";
import { useEffect, useRef, useState } from "react";
import { useDemoChat, type ChatMessage } from "./use-demo-chat";
import { TypingIndicator } from "./typing-indicator";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMerchantStore } from "./store";
import { formatMoney } from "@/lib/format-money";
import { Icon } from "@/components/ui/icon";
import { QuantityControl } from "@/components/ui/quantity-control";
import { ProductImage } from "@/components/ui/product-image";

import { ConversationList } from "./conversation-list";
import { demoConversations } from "./conversation-data";
export function InboxPage() {
  const products = useMerchantStore((state) => state.products);
  const customers = useMerchantStore((state) => state.customers);
  const createOrder = useMerchantStore((state) => state.createOrder);

  const router = useRouter();
  const navigate = (href: string) => router.push(href);
  const [selectedId, setSelectedId] = useState(1);
  const [filter, setFilter] = useState("All");
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReplyForm>({
    resolver: zodResolver(replySchema),
    defaultValues: { composer: "" },
  });
  const setComposer = (value: string) =>
    setValue("composer", value, { shouldValidate: true });
  const [search, setSearch] = useState("");
  const { messages, pending, sendMessage: sendDemoMessage } = useDemoChat();
  const threadElement = useRef<HTMLDivElement>(null);
  const [quantity, setQuantity] = useState(1);
  const setNotice = (message: string) => {
    if (message) toast.info(message);
  };
  const conversation =
    demoConversations.find((item) => item.id === selectedId) ??
    demoConversations[0];
  const customer = customers.find(
    (item) => item.id === conversation.customerId,
  );
  const product = products.find((item) => item.id === conversation.productId);
  const visible = demoConversations.filter(
    (item) =>
      (filter === "All" ||
        (filter === "Unread" && item.unread > 0) ||
        item.channel === filter) &&
      item.name.toLowerCase().includes(search.toLowerCase()),
  );
  const thread: ChatMessage[] = [
    ...conversation.messages,
    ...(messages[conversation.id] ?? []),
  ];

  const sendMessage = ({ composer }: ReplyForm) => {
    sendDemoMessage(conversation.id, composer);
    reset();
    setNotice("Demo reply added locally. No external message was delivered.");
  };

  const typing = (pending[conversation.id] ?? 0) > 0;
  const messageCount = thread.length;
  useEffect(() => {
    const element = threadElement.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [selectedId, messageCount, typing]);

  const createConversationOrder = () => {
    if (!product) return;
    const result = createOrder({
      customerId: conversation.customerId,
      source: conversation.channel,
      items: [{ productId: product.id, quantity }],
      mode: "link",
      deliveryFee: 2500,
    });
    if (!result.ok || !result.order) {
      toast.error(result.error ?? "Order could not be created.");
      return;
    }
    navigate(`/orders?order=${result.order.id}`);
  };

  return (
    <div className="inbox-page">
      <div className="demo-banner horizontal">
        <strong>Demo conversation mode</strong>
        <p>
          Messaging integrations are not connected. Replies remain in this
          browser and are not delivered externally.
        </p>
      </div>
      <div className="inbox-shell">
        <aside className="conversation-panel">
          <div className="inbox-panel-head">
            <div>
              <span>Sales & Customers</span>
              <h1>Unified Inbox</h1>
            </div>
            <button disabled>New</button>
          </div>
          <label className="inbox-search">
            <Icon name="search" size={18} />
            <input
              aria-label="Search conversations"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search conversations"
            />
          </label>
          <div className="inbox-filters">
            {["All", "Unread", "WhatsApp", "Instagram"].map((item) => (
              <button
                className={filter === item ? "active" : ""}
                onClick={() => setFilter(item)}
                key={item}
              >
                {item}
              </button>
            ))}
          </div>
          <ConversationList
            conversations={visible}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </aside>
        <section className="message-panel">
          <div className="message-head">
            <span className="message-avatar">{conversation.initials}</span>
            <div>
              <strong>{conversation.name}</strong>
              <small>{conversation.channel} · Demo conversation</small>
            </div>
            <button disabled>Assign</button>
            <button disabled>Close</button>
          </div>
          <div className="message-thread" ref={threadElement}>
            <div className="thread-date">Today</div>
            {thread.map((message, index) => (
              <div
                className={`message-bubble ${message.from}`}
                key={`${message.text}-${index}`}
              >
                <p>{message.text}</p>
                <small>
                  {message.from === "customer"
                    ? conversation.name
                    : "Amina · Human reply"}{" "}
                  ·{" "}
                  {message.sentAt ??
                    `10:${String(24 + index).padStart(2, "0")}`}
                </small>
              </div>
            ))}
            {typing && <TypingIndicator name={conversation.name} />}
            <div className="ai-suggestion">
              <span>AI suggestion · Review before sending</span>
              <p>
                {product
                  ? `${product.name} is currently available at ${formatMoney(product.price)}. Would you like a checkout link?`
                  : "Ask the customer for more product information."}
              </p>
              <button
                onClick={() =>
                  setComposer(
                    product
                      ? `${product.name} is currently available at ${formatMoney(product.price)}. Would you like a checkout link?`
                      : "",
                  )
                }
              >
                Use suggestion
              </button>
            </div>
          </div>
          <div className="message-composer">
            <div>
              <button disabled>Attach</button>
              <button disabled>Share product</button>
              <button disabled>Internal note</button>
            </div>
            <textarea
              {...register("composer")}
              aria-invalid={!!errors.composer}
              aria-describedby="composer-error"
              placeholder="Write a demo reply..."
            />
            <FieldError error={errors.composer} id="composer-error" />
            <button disabled={isSubmitting} onClick={handleSubmit(sendMessage)}>
              Send reply
            </button>
          </div>
        </section>
        <aside className="customer-context">
          <div className="context-customer">
            <i>{conversation.initials}</i>
            <h2>{conversation.name}</h2>
            <span>
              {customer?.segment ?? "New"} customer · {conversation.channel}
            </span>
          </div>
          <div className="context-block">
            <div>
              <h3>Customer details</h3>
              <button disabled>View profile</button>
            </div>
            <p>
              Phone<strong>{customer?.phone}</strong>
            </p>
            <p>
              Location<strong>{customer?.location}</strong>
            </p>
            <p>
              Lifetime spend<strong>{formatMoney(customer?.spend ?? 0)}</strong>
            </p>
          </div>
          {product && (
            <div className="context-block">
              <div>
                <h3>Product discussed</h3>
              </div>
              <article className="context-product">
                <ProductImage product={product} />
                <span>
                  <strong>{product.name}</strong>
                  <small>
                    {formatMoney(product.price)} ·{" "}
                    {product.onHand - product.reserved} available
                  </small>
                </span>
              </article>
              <label>
                Quantity
                <QuantityControl
                  value={quantity}
                  label={product.name}
                  min={1}
                  max={Math.max(1, product.onHand - product.reserved)}
                  onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
                  onIncrease={() => setQuantity(quantity + 1)}
                />
              </label>
              <button
                className="context-primary"
                disabled={product.onHand - product.reserved < quantity}
                onClick={createConversationOrder}
              >
                Create order & link
              </button>
            </div>
          )}
          <div className="context-block">
            <div>
              <h3>Internal notes</h3>
              <button disabled>Add</button>
            </div>
            <p className="plain-note">{customer?.notes}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
