"use client";
export default function Footer() {
  return (
    <footer role="contentinfo">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="nav-logo" style={{ display: "block", marginBottom: 12, fontSize: "1.8rem", color: "white" }}>Med<span>Book</span> PK</span>
            <div className="footer-tagline">Pakistan&apos;s intelligent hospital appointment platform, powered by free AI tools.</div>
          </div>
          <div className="footer-col">
            <h5>Hospitals</h5>
            <a href="#hospitals">Aga Khan University</a>
            <a href="#hospitals">Shaukat Khanum</a>
            <a href="#hospitals">Liaquat National</a>
            <a href="#hospitals">South City Hospital</a>
          </div>
          <div className="footer-col">
            <h5>Specialties</h5>
            <a href="#hospitals">Cardiology</a>
            <a href="#hospitals">Oncology</a>
            <a href="#hospitals">Neurology</a>
            <a href="#hospitals">Pediatrics</a>
          </div>
          <div className="footer-col">
            <h5>Contact</h5>
            <a href="tel:+922112345678">+92 21 1234 5678</a>
            <a href="mailto:info@medbookpk.com">info@medbookpk.com</a>
            <span>Karachi, Pakistan</span>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2025 MedBook PK. All rights reserved.</div>
          <div>Powered by n8n Cloud · Google Sheets · Groq AI (Free)</div>
        </div>
      </div>
    </footer>
  );
}
