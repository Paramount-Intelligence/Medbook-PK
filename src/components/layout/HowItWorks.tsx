"use client";
export default function HowItWorks() {
  return (
    <section id="how" className="how-section" aria-label="How it works">
      <div className="how-inner">
        <div className="section-header">
          <div className="section-eyebrow" style={{ color: "var(--gold)" }}>Process</div>
          <h2 className="section-title" style={{ color: "white" }}>
            Book in <em style={{ color: "var(--gold)" }}>4 Simple Steps</em>
          </h2>
        </div>
        <div className="how-grid">
          {[
            { n: "01", title: "Choose Hospital", desc: "Browse our curated network of Pakistan's top-tier hospitals, each with verified specialist rosters.", connector: true },
            { n: "02", title: "Select Doctor", desc: "Filter by specialty, view qualifications, availability and ratings to find your perfect match.", connector: true },
            { n: "03", title: "Fill the Form", desc: "Enter your details, pick a time slot. All fields are validated in real-time for accuracy.", connector: true },
            { n: "04", title: "n8n Saves & Emails", desc: "n8n saves your booking to Google Sheets (A–L) and sends a confirmation email — instantly, for free.", connector: false },
          ].map(({ n, title, desc, connector }) => (
            <div key={n} className="how-step">
              <div className="step-num" data-n={n}>Step</div>
              <div className="step-title">{title}</div>
              <p className="step-desc">{desc}</p>
              {connector && <div className="step-connector" aria-hidden="true" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
