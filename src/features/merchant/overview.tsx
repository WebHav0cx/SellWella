import { SalesChart } from "@/components/charts/sales-chart";
import { salesPerformance } from "./sales-data";
import { Icon, type IconName } from "@/components/ui/icon";
const metrics = [
  {
    label: "Total sales",
    value: "₦2,450,000",
    delta: "12.5%",
    note: "vs last month",
    icon: "trend" as IconName,
  },
  {
    label: "Orders",
    value: "148",
    delta: "8.2%",
    note: "vs last month",
    icon: "bag" as IconName,
  },
  {
    label: "Awaiting payment",
    value: "₦185,000",
    sub: "8 orders pending",
    icon: "clock" as IconName,
  },
  {
    label: "Gross profit",
    value: "₦620,000",
    delta: "6.4%",
    note: "vs last month",
    icon: "profit" as IconName,
  },
];

const priorities = [
  {
    icon: "message" as IconName,
    title: "3 enquiries awaiting reply",
    detail: "Oldest message received 42 minutes ago",
    tone: "blue",
  },
  {
    icon: "package" as IconName,
    title: "2 orders ready for dispatch",
    detail: "Both orders are packed and paid",
    tone: "green",
  },
  {
    icon: "card" as IconName,
    title: "8 pending checkout payments",
    detail: "₦185,000 in potential revenue",
    tone: "amber",
  },
  {
    icon: "warning" as IconName,
    title: "4 products are running low",
    detail: "Blue Linen Dress has only 1 left",
    tone: "red",
  },
];

const orders = [
  {
    id: "#SW-1048",
    customer: "Zainab Yusuf",
    initials: "ZY",
    amount: "₦42,000",
    status: "Paid",
    time: "8 min ago",
    color: "lavender",
  },
  {
    id: "#SW-1047",
    customer: "David Okoro",
    initials: "DO",
    amount: "₦18,500",
    status: "Pending",
    time: "26 min ago",
    color: "peach",
  },
  {
    id: "#SW-1046",
    customer: "Mary John",
    initials: "MJ",
    amount: "₦65,000",
    status: "Paid",
    time: "1 hr ago",
    color: "mint",
  },
  {
    id: "#SW-1045",
    customer: "Feyi Ade",
    initials: "FA",
    amount: "₦22,000",
    status: "Paid",
    time: "2 hrs ago",
    color: "blue",
  },
];
export function Overview() {
  return (
    <>
      <section className="welcome-row">
        <div>
          <p className="eyebrow">Thursday, 8 October</p>
          <h1>Good morning, Amina</h1>
          <p className="subtitle">Here’s how your business is doing today.</p>
        </div>
        <div className="period-control">
          <button className="active">This month</button>
          <button>Last month</button>
        </div>
      </section>

      <section className="metric-grid">
        {metrics.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <div className="metric-top">
              <span>{metric.label}</span>
              <span className="metric-icon">
                <Icon name={metric.icon} size={19} />
              </span>
            </div>
            <strong className="metric-value">{metric.value}</strong>
            {metric.delta ? (
              <p className="metric-note">
                <span>
                  <Icon name="trend" size={13} /> {metric.delta}
                </span>{" "}
                {metric.note}
              </p>
            ) : (
              <p className="metric-note neutral">{metric.sub}</p>
            )}
          </article>
        ))}
      </section>

      <section className="content-grid">
        <article className="panel sales-panel">
          <div className="panel-heading">
            <div>
              <h2>Sales performance</h2>
              <p>Revenue across all sales channels</p>
            </div>
            <button className="text-button">
              View report <Icon name="arrow" size={16} />
            </button>
          </div>
          <div className="chart-summary">
            <div>
              <span>Total revenue</span>
              <strong>₦2.45M</strong>
            </div>
            <div className="chart-legend">
              <span className="legend-current" /> This month{" "}
              <span className="legend-previous" /> Last month
            </div>
          </div>
          <SalesChart data={salesPerformance} />
          <div className="channel-strip">
            <div>
              <span className="channel-icon whatsapp">
                <Icon name="message" size={16} />
              </span>
              <p>
                WhatsApp<strong>₦1.08M</strong>
              </p>
              <small>44%</small>
            </div>
            <div>
              <span className="channel-icon storefront">
                <Icon name="store" size={16} />
              </span>
              <p>
                Storefront<strong>₦780K</strong>
              </p>
              <small>32%</small>
            </div>
            <div>
              <span className="channel-icon pos">
                <Icon name="card" size={16} />
              </span>
              <p>
                Point of sale<strong>₦590K</strong>
              </p>
              <small>24%</small>
            </div>
          </div>
        </article>

        <article className="panel attention-panel">
          <div className="panel-heading">
            <div>
              <h2>Needs attention</h2>
              <p>Tasks that need your action</p>
            </div>
            <span className="attention-count">17</span>
          </div>
          <div className="priority-list">
            {priorities.map((item) => (
              <button className="priority-item" key={item.title}>
                <span className={`priority-icon ${item.tone}`}>
                  <Icon name={item.icon} size={19} />
                </span>
                <span className="priority-copy">
                  <strong>{item.title}</strong>
                  <small>{item.detail}</small>
                </span>
                <Icon name="chevron" size={17} />
              </button>
            ))}
          </div>
          <button className="attention-footer">
            View all activity <Icon name="arrow" size={16} />
          </button>
        </article>
      </section>

      <section className="bottom-grid">
        <article className="panel orders-panel">
          <div className="panel-heading">
            <div>
              <h2>Recent orders</h2>
              <p>Latest sales from all channels</p>
            </div>
            <button className="text-button">
              View all orders <Icon name="arrow" size={16} />
            </button>
          </div>
          <div className="order-table">
            <div className="table-head">
              <span>Customer</span>
              <span>Order</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Time</span>
            </div>
            {orders.map((order) => (
              <button className="order-row" key={order.id}>
                <span className="customer-cell">
                  <i className={`customer-avatar ${order.color}`}>
                    {order.initials}
                  </i>
                  <strong>{order.customer}</strong>
                </span>
                <span>{order.id}</span>
                <strong>{order.amount}</strong>
                <span>
                  <i className={`status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </i>
                </span>
                <span>{order.time}</span>
              </button>
            ))}
          </div>
        </article>

        <article className="panel assistant-panel">
          <div className="assistant-head">
            <span className="assistant-symbol">
              <Icon name="sparkles" size={20} />
            </span>
            <div>
              <h2>SellWella Assistant</h2>
              <p>Your business, explained simply</p>
            </div>
          </div>
          <div className="assistant-insight">
            <p>
              Sales are <strong>12.5% higher</strong> than last month. Black
              Handbags are your top seller, but stock may run out in 4 days.
            </p>
          </div>
          <div className="suggestion-list">
            <button>
              Which products are running low?
              <Icon name="arrow" size={15} />
            </button>
            <button>
              Show enquiries waiting for a reply
              <Icon name="arrow" size={15} />
            </button>
          </div>
          <button className="ask-button">
            <Icon name="sparkles" size={17} /> Ask your business assistant
          </button>
        </article>
      </section>
    </>
  );
}
