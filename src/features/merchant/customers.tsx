"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema, type CustomerForm } from "./schemas";
import { FieldError } from "@/components/ui/field-error";
import { Drawer } from "@/components/ui/drawer";
import { useState } from "react";
import { toast } from "sonner";
import { Icon, type IconName } from "@/components/ui/icon";

import { formatMoney } from "@/lib/format-money";
import { useMerchantStore } from "@/features/merchant/store";
import { leadStages, type Customer, type Lead } from "@/features/merchant/data";
export function CustomersPage() {
  const customers = useMerchantStore((state) => state.customers);
  const setCustomers = useMerchantStore((state) => state.setCustomers);

  const [view, setView] = useState<"directory" | "leads">("directory");
  const [search, setSearch] = useState("");
  const [segment, setSegment] = useState("All segments");
  const [source, setSource] = useState("All sources");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [profileTab, setProfileTab] = useState("Overview");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset: setForm,
    formState: { errors, isSubmitting },
  } = useForm<CustomerForm>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      source: "WhatsApp",
      location: "",
    },
  });
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 1,
      customer: "Emeka Obi",
      initials: "EO",
      product: "Classic Black Handbag",
      value: 15000,
      source: "WhatsApp",
      owner: "Amina",
      followUp: "Today",
      stage: "New Enquiry",
    },
    {
      id: 2,
      customer: "Fatima Musa",
      initials: "FM",
      product: "Blue Linen Dress",
      value: 28500,
      source: "Instagram",
      owner: "Amina",
      followUp: "Tomorrow",
      stage: "Interested",
    },
    {
      id: 3,
      customer: "Damilola Ade",
      initials: "DA",
      product: "Bulk accessories order",
      value: 76000,
      source: "Referral",
      owner: "Tolu",
      followUp: "12 Oct",
      stage: "Quote Sent",
    },
    {
      id: 4,
      customer: "Zainab Yusuf",
      initials: "ZY",
      product: "Everyday Black Heels",
      value: 22000,
      source: "Website",
      owner: "Amina",
      followUp: "Today",
      stage: "Checkout Sent",
    },
    {
      id: 5,
      customer: "Chinedu Okafor",
      initials: "CO",
      product: "Classic Black Handbag",
      value: 30000,
      source: "WhatsApp",
      owner: "Tolu",
      followUp: "Complete",
      stage: "Won",
    },
  ]);

  const sources = [
    "All sources",
    ...new Set(customers.map((item) => item.source)),
  ];
  const filtered = customers.filter((customer) => {
    const matchesText = `${customer.name} ${customer.phone} ${customer.email}`
      .toLowerCase()
      .includes(search.toLowerCase());
    return (
      matchesText &&
      (segment === "All segments" || customer.segment === segment) &&
      (source === "All sources" || customer.source === source)
    );
  });

  const addCustomer = (form: CustomerForm) => {
    const parts = form.name.trim().split(/\s+/);
    const initials =
      `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
    setCustomers((current) => [
      {
        id: Math.max(0, ...current.map((customer) => customer.id)) + 1,
        name: form.name.trim(),
        initials,
        phone: form.phone.trim(),
        email: form.email.trim() || "No email provided",
        source: form.source,
        orders: 0,
        spend: 0,
        lastActivity: "Just now",
        segment: "New",
        location: form.location.trim() || "Not provided",
        notes: "No customer notes yet.",
      },
      ...current,
    ]);
    setForm({
      name: "",
      phone: "",
      email: "",
      source: "WhatsApp",
      location: "",
    });
    setDrawerOpen(false);
    toast.success("Customer saved");
  };

  const moveLead = (leadId: number, stage: string) =>
    setLeads((current) =>
      current.map((lead) => (lead.id === leadId ? { ...lead, stage } : lead)),
    );

  if (selected) {
    const timeline = [
      {
        title: "Order SW-00128 completed",
        detail: `${formatMoney(18000)} · Blue Linen Dress`,
        time: "5 days ago",
        icon: "orders" as IconName,
      },
      {
        title: "Payment confirmed",
        detail: "Provider-verified card payment",
        time: "5 days ago",
        icon: "payments" as IconName,
      },
      {
        title: "Asked about Blue Linen Dress",
        detail: "Instagram conversation",
        time: "7 days ago",
        icon: "message" as IconName,
      },
      {
        title: "Customer profile created",
        detail: `Acquired through ${selected.source}`,
        time: "8 months ago",
        icon: "customers" as IconName,
      },
    ];
    return (
      <div className="module-page customer-profile">
        <button
          className="back-button inline-flex items-center gap-2 whitespace-nowrap"
          onClick={() => setSelected(null)}
        >
          <Icon name="back" size={16} /> Back to customers
        </button>
        <section className="profile-hero">
          <span className="profile-avatar">{selected.initials}</span>
          <div className="profile-identity">
            <span className={`segment-pill ${selected.segment.toLowerCase()}`}>
              {selected.segment} customer
            </span>
            <h1>{selected.name}</h1>
            <p>{selected.source} · Customer since February 2025</p>
          </div>
          <div className="module-actions">
            <button className="secondary-button">Add note</button>
            <button className="create-button">
              <Icon name="plus" size={17} /> Create order
            </button>
          </div>
        </section>
        <section className="profile-metrics">
          <article>
            <span>Total orders</span>
            <strong>{selected.orders}</strong>
            <small>Confirmed purchases</small>
          </article>
          <article>
            <span>Lifetime spend</span>
            <strong>{formatMoney(selected.spend)}</strong>
            <small>Recorded purchase value</small>
          </article>
          <article>
            <span>Average order</span>
            <strong>
              {selected.orders
                ? formatMoney(selected.spend / selected.orders)
                : "—"}
            </strong>
            <small>Across completed orders</small>
          </article>
          <article>
            <span>Last activity</span>
            <strong>{selected.lastActivity}</strong>
            <small>Most recent interaction</small>
          </article>
        </section>
        <div className="profile-layout">
          <section className="profile-main">
            <div className="profile-tabs">
              {[
                "Overview",
                "Orders",
                "Conversations",
                "Payments",
                "Notes",
                "Activity",
              ].map((tab) => (
                <button
                  className={profileTab === tab ? "active" : ""}
                  onClick={() => setProfileTab(tab)}
                  key={tab}
                >
                  {tab}
                </button>
              ))}
            </div>
            {profileTab === "Overview" ? (
              <div className="profile-overview">
                <div className="profile-block">
                  <div className="block-heading">
                    <h2>Customer timeline</h2>
                    <button>View all activity</button>
                  </div>
                  <div className="customer-timeline">
                    {timeline.map((item) => (
                      <div className="timeline-item" key={item.title}>
                        <span>
                          <Icon name={item.icon} size={16} />
                        </span>
                        <div>
                          <strong>{item.title}</strong>
                          <p>{item.detail}</p>
                        </div>
                        <small>{item.time}</small>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="profile-tab-state">
                <span>
                  <Icon
                    name={
                      profileTab === "Orders"
                        ? "orders"
                        : profileTab === "Payments"
                          ? "payments"
                          : "message"
                    }
                    size={24}
                  />
                </span>
                <h2>{profileTab}</h2>
                <p>
                  This customer’s linked {profileTab.toLowerCase()} will appear
                  here from the shared commerce record.
                </p>
              </div>
            )}
          </section>
          <aside className="profile-sidebar">
            <div className="profile-block">
              <div className="block-heading">
                <h2>Contact details</h2>
                <button>Edit</button>
              </div>
              <dl>
                <div>
                  <dt>Phone</dt>
                  <dd>{selected.phone}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{selected.email}</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>{selected.location}</dd>
                </div>
                <div>
                  <dt>Source</dt>
                  <dd>{selected.source}</dd>
                </div>
              </dl>
            </div>
            <div className="profile-block">
              <div className="block-heading">
                <h2>Customer notes</h2>
                <button>Add note</button>
              </div>
              <p className="customer-note">{selected.notes}</p>
              <small className="note-author">
                Updated by Amina · 6 days ago
              </small>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="module-page">
      <section className="module-header">
        <div>
          <p className="module-kicker">Sales & Customers</p>
          <h1>Customers & CRM</h1>
          <p className="subtitle">
            Build lasting customer relationships and turn enquiries into sales.
          </p>
        </div>
        <div className="module-actions">
          <button className="secondary-button">Import</button>
          <button className="secondary-button">Export</button>
          <button className="create-button" onClick={() => setDrawerOpen(true)}>
            <Icon name="plus" size={18} /> Add customer
          </button>
        </div>
      </section>

      <div className="module-tabs">
        <button
          className={view === "directory" ? "active" : ""}
          onClick={() => setView("directory")}
        >
          Customer directory
        </button>
        <button
          className={view === "leads" ? "active" : ""}
          onClick={() => setView("leads")}
        >
          CRM leads{" "}
          <span>{leads.filter((lead) => lead.stage !== "Won").length}</span>
        </button>
      </div>

      {view === "directory" ? (
        <>
          <section className="module-stats customer-stats">
            <article>
              <span>Total customers</span>
              <strong>{customers.length}</strong>
              <small>Across all sales channels</small>
            </article>
            <article>
              <span>New customers</span>
              <strong>
                {customers.filter((item) => item.segment === "New").length}
              </strong>
              <small>Added this month</small>
            </article>
            <article>
              <span>Returning</span>
              <strong>
                {
                  customers.filter(
                    (item) =>
                      item.segment === "Returning" || item.segment === "VIP",
                  ).length
                }
              </strong>
              <small>Purchased more than once</small>
            </article>
            <article>
              <span>Active leads</span>
              <strong>
                {leads.filter((lead) => lead.stage !== "Won").length}
              </strong>
              <small>Require sales follow-up</small>
            </article>
          </section>
          <section className="catalogue-panel">
            <div className="catalogue-toolbar">
              <label className="field-search">
                <Icon name="search" size={18} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name, phone or email"
                  aria-label="Search name, phone or email"
                />
              </label>
              <select
                aria-label="Filter customers by segment"
                value={segment}
                onChange={(event) => setSegment(event.target.value)}
              >
                <option>All segments</option>
                <option>New</option>
                <option>Returning</option>
                <option>VIP</option>
                <option>Inactive</option>
              </select>
              <select
                aria-label="Filter customers by source"
                value={source}
                onChange={(event) => setSource(event.target.value)}
              >
                {sources.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
            <div className="customer-table-wrap">
              <div className="customer-table">
                <div className="customer-head">
                  <span>Customer</span>
                  <span>Contact</span>
                  <span>Source</span>
                  <span>Orders</span>
                  <span>Lifetime spend</span>
                  <span>Last activity</span>
                  <span>Segment</span>
                  <span />
                </div>
                {filtered.map((customer) => (
                  <div className="customer-row" key={customer.id}>
                    <button
                      className="customer-name"
                      onClick={() => setSelected(customer)}
                    >
                      <i>{customer.initials}</i>
                      <strong>
                        {customer.name}
                        <small>{customer.location}</small>
                      </strong>
                    </button>
                    <span className="customer-contact">
                      {customer.phone}
                      <small>{customer.email}</small>
                    </span>
                    <span>{customer.source}</span>
                    <strong>{customer.orders}</strong>
                    <strong>{formatMoney(customer.spend)}</strong>
                    <span>{customer.lastActivity}</span>
                    <span
                      className={`segment-pill ${customer.segment.toLowerCase()}`}
                    >
                      {customer.segment}
                    </span>
                    <button
                      className="row-action"
                      onClick={() => setSelected(customer)}
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
              {filtered.length === 0 && (
                <div className="empty-state compact">
                  <h2>No customers found</h2>
                  <p>Change your filters or add a new customer.</p>
                  <button
                    className="create-button"
                    onClick={() => setDrawerOpen(true)}
                  >
                    Add customer
                  </button>
                </div>
              )}
            </div>
          </section>
        </>
      ) : (
        <section className="lead-board-wrap">
          <div className="lead-board">
            {leadStages.map((stage) => {
              const stageLeads = leads.filter((lead) => lead.stage === stage);
              return (
                <div
                  className="lead-column"
                  key={stage}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) =>
                    moveLead(
                      Number(event.dataTransfer.getData("leadId")),
                      stage,
                    )
                  }
                >
                  <div className="lead-column-head">
                    <span>{stage}</span>
                    <b>{stageLeads.length}</b>
                  </div>
                  <div className="lead-column-total">
                    {formatMoney(
                      stageLeads.reduce((sum, lead) => sum + lead.value, 0),
                    )}{" "}
                    potential value
                  </div>
                  <div className="lead-list">
                    {stageLeads.map((lead) => (
                      <article
                        className="lead-card"
                        draggable
                        onDragStart={(event) =>
                          event.dataTransfer.setData("leadId", String(lead.id))
                        }
                        key={lead.id}
                      >
                        <div className="lead-person">
                          <i>{lead.initials}</i>
                          <span>
                            <strong>{lead.customer}</strong>
                            <small>{lead.source}</small>
                          </span>
                          <Icon name="more" size={16} />
                        </div>
                        <p>{lead.product}</p>
                        <strong className="lead-value">
                          {formatMoney(lead.value)}
                        </strong>
                        <div className="lead-meta">
                          <span>Owner: {lead.owner}</span>
                          <span
                            className={lead.followUp === "Today" ? "due" : ""}
                          >
                            {lead.followUp}
                          </span>
                        </div>
                      </article>
                    ))}
                    {stageLeads.length === 0 && (
                      <div className="lead-empty">Drop an opportunity here</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {drawerOpen && (
        <Drawer
          onClose={() => setDrawerOpen(false)}
          label="customer form"
          className="form-drawer narrow"
        >
          <div className="drawer-header">
            <div>
              <span>New customer</span>
              <h2>Add customer profile</h2>
            </div>
            <button onClick={() => setDrawerOpen(false)} aria-label="Close">
              <Icon name="close" />
            </button>
          </div>
          <form noValidate onSubmit={handleSubmit(addCustomer)}>
            <div className="form-section">
              <h3>Customer information</h3>
              <label>
                Full name
                <input
                  {...register("name")}
                  aria-invalid={!!errors.name}
                  aria-describedby="name-error"
                  placeholder="e.g. Aisha Bello"
                />
                <FieldError error={errors.name} id="name-error" />
              </label>
              <label>
                Phone number
                <input
                  {...register("phone")}
                  aria-invalid={!!errors.phone}
                  aria-describedby="phone-error"
                  placeholder="+234"
                />
                <FieldError error={errors.phone} id="phone-error" />
              </label>
              <label>
                Email <span>Optional</span>
                <input
                  type="email"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                  aria-describedby="email-error"
                  placeholder="customer@example.com"
                />
                <FieldError error={errors.email} id="email-error" />
              </label>
              <label>
                Acquisition source
                <select
                  {...register("source")}
                  aria-invalid={!!errors.source}
                  aria-describedby="source-error"
                >
                  <option>WhatsApp</option>
                  <option>Instagram</option>
                  <option>Website</option>
                  <option>Walk-in</option>
                  <option>Referral</option>
                </select>
                <FieldError error={errors.source} id="source-error" />
              </label>
              <label>
                Location <span>Optional</span>
                <input
                  {...register("location")}
                  aria-invalid={!!errors.location}
                  aria-describedby="location-error"
                  placeholder="City or delivery area"
                />
                <FieldError error={errors.location} id="location-error" />
              </label>
            </div>
            <div className="drawer-footer">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setDrawerOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="create-button"
              >
                Save customer
              </button>
            </div>
          </form>
        </Drawer>
      )}
    </div>
  );
}
