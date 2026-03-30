"use client";
export default function Navbar() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <nav role="navigation" aria-label="Main navigation">
      <div className="nav-logo">Med<span>Book</span> PK</div>
      <div className="nav-links">
        <a href="#hospitals">Hospitals</a>
        <a href="#how">How It Works</a>
        <a href="#ai">Automation</a>
        <button className="nav-cta" onClick={() => scrollTo("hospitals")}>Book Now</button>
      </div>
    </nav>
  );
}
