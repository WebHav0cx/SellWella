export function LandingProblem() {
  return (
    <section className="merchant-problem">
      <div className="landing-section-heading">
        <span>THE EVERYDAY REALITY</span>
        <h2>Running a business shouldn&apos;t be this stressful.</h2>
        <p>
          Your customers are messaging, orders are moving and stock is changing.
          Your tools should make that easier, not harder.
        </p>
      </div>
      <div className="problem-grid">
        {[
          [
            "01",
            "Scattered enquiries",
            "Customer messages live across different apps and are easy to miss.",
          ],
          [
            "02",
            "Manual order tracking",
            "Sales recorded in notebooks and chats become difficult to follow.",
          ],
          [
            "03",
            "Payment confusion",
            "Screenshots and separate records make payment status unclear.",
          ],
          [
            "04",
            "Stock surprises",
            "Products get promised before anyone realises they are sold out.",
          ],
          [
            "05",
            "Too many tools",
            "Customers, selling, inventory and reporting live in separate places.",
          ],
          [
            "06",
            "Limited visibility",
            "It is hard to see what is working and what requires attention.",
          ],
        ].map(([number, title, text]) => (
          <article key={title}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
