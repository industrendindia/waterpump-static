"use client";

import { useState } from "react";
import { ArrowUpRight, Check, ChevronRight, Droplets, Gauge, Menu, Network, Phone, Settings2, ShieldCheck, Waves, X } from "lucide-react";

const solutions = [
  { icon: Settings2, number: "01", title: "Pump & skid systems", copy: "Integrated pump packages configured around duty point, site conditions and process requirements.", tags: ["Booster systems", "Process skids", "Custom packages"] },
  { icon: Gauge, number: "02", title: "Metering & IoT", copy: "Connected water measurement for clearer consumption data, remote visibility and smarter infrastructure.", tags: ["Smart meters", "Remote monitoring", "Data integration"] },
  { icon: Droplets, number: "03", title: "Water & wastewater", copy: "Treatment solutions supported by automation and digitalization for dependable day-to-day operation.", tags: ["Treatment systems", "Automation", "Process support"] },
  { icon: Waves, number: "04", title: "Desalination & ZLD", copy: "Application support for desalination and zero liquid discharge across demanding industrial environments.", tags: ["RO systems", "Water recovery", "ZLD applications"] },
];

const markets = [
  { id: "industry", label: "Industry", title: "Built for continuous-duty operations", copy: "Engineered pumping, treatment and monitoring packages aligned to production uptime, water quality and lifecycle cost." },
  { id: "infrastructure", label: "Infrastructure", title: "Designed around the wider system", copy: "Coordinated equipment and control packages for utilities, buildings, irrigation and community-scale water networks." },
  { id: "water", label: "Water reuse", title: "More value from every litre", copy: "Treatment, desalination and ZLD support that helps projects recover, monitor and reuse water more intelligently." },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [market, setMarket] = useState(markets[0]);
  return (
    <main>
      <header className="site-header">
        <a href="#top" className="brand" aria-label="GJVN home"><span className="brand-mark">G</span><span className="brand-name">GJVN<small>Water & Engineering</small></span></a>
        <nav className={menuOpen ? "nav open" : "nav"} aria-label="Main navigation">
          <a href="#solutions" onClick={() => setMenuOpen(false)}>Solutions</a><a href="#approach" onClick={() => setMenuOpen(false)}>Approach</a><a href="#services" onClick={() => setMenuOpen(false)}>Services</a><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a><a className="nav-cta" href="mailto:sales@gjvnengineering.com">Discuss a project</a>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <section className="hero" id="top"><div className="hero-backdrop" aria-hidden="true" /><div className="water-light" aria-hidden="true" />
        <div className="hero-content"><p className="eyebrow light"><span /> Integrated water engineering</p><h1>Move water.<br /><em>Build certainty.</em></h1><p className="hero-copy">Engineered pump systems, treatment, metering and digital solutions for demanding infrastructure and industry.</p>
          <div className="hero-actions"><a className="button primary" href="#contact">Start a project <ArrowUpRight size={18} /></a><a className="button ghost" href="#solutions">Explore solutions</a></div>
          <div className="hero-proof"><div><strong>End-to-end</strong><span>Engineering & supply</span></div><div><strong>Application-led</strong><span>Built around site needs</span></div><div><strong>Lifecycle</strong><span>Parts, retrofit & support</span></div></div>
        </div><a href="#solutions" className="scroll-cue">Scroll to explore <span>↓</span></a>
      </section>

      <section className="intro section-pad"><div className="section-label">What we solve</div><div className="intro-copy"><h2>One partner across the <span>water engineering lifecycle.</span></h2><p>GJVN connects equipment, controls and engineering support into practical systems—so project teams can move from requirement to reliable operation with fewer hand-offs.</p></div></section>

      <section className="solutions section-pad" id="solutions"><div className="section-heading"><div><p className="eyebrow"><span /> Core solutions</p><h2>Engineering around<br />your application</h2></div><p>From a single duty point to a connected water network, each solution starts with how the system must perform.</p></div>
        <div className="solution-grid">{solutions.map((item) => { const Icon = item.icon; return <article className="solution-card" key={item.number}><div className="card-top"><Icon /><span>{item.number}</span></div><h3>{item.title}</h3><p>{item.copy}</p><ul>{item.tags.map(tag => <li key={tag}><Check size={14} />{tag}</li>)}</ul><a href="#contact" aria-label={`Enquire about ${item.title}`}>Discuss this solution <ChevronRight size={17} /></a></article>; })}</div>
      </section>

      <section className="market-section section-pad"><div className="market-copy"><p className="eyebrow light"><span /> Application focus</p><h2>Different environments.<br />One rigorous approach.</h2><div className="market-tabs" role="tablist" aria-label="Applications">{markets.map(item => <button key={item.id} className={market.id === item.id ? "active" : ""} onClick={() => setMarket(item)}>{item.label}</button>)}</div></div><div className="market-detail"><Network size={28} /><p className="detail-index">0{markets.findIndex(item => item.id === market.id) + 1} / 03</p><h3>{market.title}</h3><p>{market.copy}</p></div></section>

      <section className="approach section-pad" id="approach"><div className="section-heading"><div><p className="eyebrow"><span /> Integrated approach</p><h2>From requirement<br />to working solution</h2></div><p>Clear stages make technical decisions easier, responsibilities visible and delivery more predictable.</p></div><div className="steps">{[["01","Define","Duty point, water quality, site conditions and performance goals."],["02","Engineer","Select, size and integrate equipment, controls and connections."],["03","Deliver","Source, assemble and coordinate the solution for project needs."],["04","Support","Maintain performance with parts, upgrades and retrofit support."]].map(([n,t,c]) => <article key={n}><span>{n}</span><div className="step-dot" /><h3>{t}</h3><p>{c}</p></article>)}</div></section>

      <section className="services section-pad" id="services"><div className="services-title"><p className="eyebrow light"><span /> Beyond equipment</p><h2>Support that keeps<br />projects moving.</h2></div><div className="service-list">{[["01","Sourcing & supply","Coordinated access to fit-for-purpose water equipment."],["02","Customized solutions","Packages configured around application and site needs."],["03","Spare parts","Practical parts support for installed equipment."],["04","Retrofits","Upgrades that improve performance and extend asset life."]].map(([n,t,c]) => <div className="service-row" key={n}><span>{n}</span><h3>{t}</h3><p>{c}</p><ArrowUpRight /></div>)}</div></section>

      <section className="trust section-pad"><div className="trust-icon"><ShieldCheck /></div><h2>Technical clarity at every stage.</h2><p>We bring the system view—equipment selection, integration, performance and ongoing support—so decisions are grounded in the full application.</p><div className="trust-points"><span>Application-first</span><span>Vendor-neutral sourcing</span><span>Single-point coordination</span></div></section>

      <section className="contact section-pad" id="contact"><div className="contact-main"><p className="eyebrow light"><span /> Contact GJVN</p><h2>Bring us your<br /><em>water challenge.</em></h2><p>Tell us the application, flow, head, water quality or project stage. We’ll help shape the next technical step.</p><a className="button lime" href="mailto:sales@gjvnengineering.com">Email project details <ArrowUpRight size={18} /></a></div><div className="contact-card"><p>Talk directly with our team</p><a href="tel:+919876543210"><Phone size={18} /> +91 98765 43210</a><a href="mailto:info@gjvnengineering.com">info@gjvnengineering.com</a><a href="mailto:sales@gjvnengineering.com">sales@gjvnengineering.com</a><address>Baner Road, Pune<br />Maharashtra 411045, India</address></div></section>
      <footer><div className="brand inverse"><span className="brand-mark">G</span><span className="brand-name">GJVN<small>Water & Engineering</small></span></div><p>Integrated water, engineering and digitalization solutions.</p><span>© {new Date().getFullYear()} GJVN. All rights reserved.</span></footer>
    </main>
  );
}
