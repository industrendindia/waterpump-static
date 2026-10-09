"use client";

import { FormEvent, PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronRight, CircuitBoard, Droplets, Gauge, Mail, Menu, Phone, Send, Settings2, ShieldCheck, Sparkles, Waves, X, Zap } from "lucide-react";

const heroScenes = [
  "/gjvn-water-pump-hero.png",
  "/products/mobile-flood-pump.jpg",
  "/products/booster-system.jpg",
];

function WhatsAppIcon({ size = 24 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3Zm0 23.6a10.6 10.6 0 0 1-5.4-1.5l-.4-.2-3.9 1 1-3.8-.2-.4A10.6 10.6 0 1 1 16 26.6Zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.7 8.7 0 0 1-2.6-1.6 9.7 9.7 0 0 1-1.8-2.2c-.2-.3 0-.5.1-.7l.5-.5.3-.6c.1-.2 0-.4 0-.6l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.2-1.2 2.9 1.2 3.4 1.4 3.6c.2.2 2.5 3.8 6 5.3.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5-.1-.1-.3-.2-.6-.4Z" /></svg>;
}

const solutions = [
  { icon: Settings2, image: "/products/booster-system.jpg", number: "01", title: "Pump & Skid Systems", copy: "Integrated pump and skid-based engineering solutions configured around project, process and performance requirements.", tags: ["Booster packages", "Process skids", "Custom integration"] },
  { icon: Gauge, image: "/products/water-meter.jpg", number: "02", title: "Water Meter & IoT", copy: "Water metering combined with connected technologies for measurement, visibility and smarter infrastructure.", tags: ["Smart metering", "Remote visibility", "Data integration"] },
  { icon: Droplets, image: "/products/self-priming-pumps.jpg", number: "03", title: "Water & Wastewater", copy: "Treatment solutions supported by digitalization for dependable operation and improved process visibility.", tags: ["Treatment systems", "Automation", "Process support"] },
  { icon: Waves, image: "/products/multistage-pump.jpg", number: "04", title: "Desalination & ZLD", copy: "Solution support for desalination and Zero Liquid Discharge applications across demanding industrial requirements.", tags: ["RO systems", "Water recovery", "ZLD applications"] },
];

const products = [
  { image: "/products/booster-system.jpg", title: "Pressure boosting systems", category: "Packaged systems", copy: "Integrated multi-pump packages with intelligent controls for stable pressure and efficient demand management." },
  { image: "/products/vertical-multistage-pump.jpg", title: "Vertical multistage pumps", category: "High-pressure pumping", copy: "Compact, efficient pumping for boosting, process water and building-services applications." },
  { image: "/products/centrifugal-pump.jpg", title: "Centrifugal pumps", category: "Water transfer", copy: "Versatile end-suction equipment for circulation, transfer and continuous industrial duties." },
  { image: "/products/smart-pump.jpg", title: "Intelligent pump control", category: "Connected operation", copy: "Sensor-enabled pumping with variable-speed control for visible, responsive performance." },
  { image: "/products/mobile-flood-pump.jpg", title: "Mobile flood-control units", category: "Emergency pumping", copy: "Towable high-flow packages for dewatering, drainage and rapid flood response." },
  { image: "/products/self-priming-pumps.jpg", title: "Self-priming pumps", category: "Drainage & wastewater", copy: "Rugged pump sets designed for fast priming and dependable handling of demanding water duties." },
];

const process = [
  ["01", "Understand", "Application, site and performance requirements."],
  ["02", "Engineer & customize", "The right equipment and solution architecture."],
  ["03", "Source & integrate", "Suitable components brought into one project solution."],
  ["04", "Support & upgrade", "Parts, retrofits and modernization for longer asset value."],
];

const services = [
  ["01", "Sourcing & supply", "Coordinated access to fit-for-purpose water equipment.", "/products/centrifugal-pump.jpg"],
  ["02", "Customized solutions", "Packages designed around application and site needs.", "/products/booster-system.jpg"],
  ["03", "Spare parts", "Practical parts support for installed equipment.", "/products/mechanical-water-meter.jpg"],
  ["04", "Retrofits", "Upgrades that improve performance and extend asset life.", "/products/smart-pump.jpg"],
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productIndex, setProductIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [heroScene, setHeroScene] = useState(0);
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const showProduct = (index: number) => setProductIndex((index + products.length) % products.length);

  const startProductSwipe = (event: ReactPointerEvent<HTMLDivElement>) => {
    swipeStart.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const finishProductSwipe = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) > 42 && Math.abs(deltaX) > Math.abs(deltaY) * 1.15) {
      showProduct(productIndex + (deltaX < 0 ? 1 : -1));
    }
  };

  useEffect(() => {
    const timer = window.setInterval(() => setProductIndex((index) => (index + 1) % products.length), 6000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setHeroScene((index) => (index + 1) % heroScenes.length), 6500);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setWhatsappOpen(false);
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    let previousScrollY = window.scrollY;
    let scrollDirection: "up" | "down" = "down";
    const updateScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (Math.abs(window.scrollY - previousScrollY) > 4) scrollDirection = window.scrollY > previousScrollY ? "down" : "up";
      previousScrollY = window.scrollY;
      setScrolled(window.scrollY > 32);
      setScrollProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      const element = entry.target;
      if (entry.isIntersecting) {
        element.classList.remove("in-view", "enter-from-top", "enter-from-bottom");
        element.classList.add(scrollDirection === "down" ? "enter-from-top" : "enter-from-bottom");
        window.requestAnimationFrame(() => element.classList.add("in-view"));
      } else if (entry.boundingClientRect.bottom < 0 || entry.boundingClientRect.top > window.innerHeight) {
        element.classList.remove("in-view");
      }
    }), { threshold: 0.12, rootMargin: "-7% 0px -7%" });
    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => { window.removeEventListener("scroll", updateScroll); observer.disconnect(); };
  }, []);

  const sendEnquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Project enquiry — ${form.get("company") || form.get("name")}`);
    const body = encodeURIComponent(`Name: ${form.get("name")}\nCompany: ${form.get("company")}\nEmail: ${form.get("email")}\nPhone: ${form.get("phone")}\n\nRequirement:\n${form.get("requirement")}`);
    window.location.href = `mailto:sales@gjvnengineering.com?subject=${subject}&body=${body}`;
  };

  const startWhatsApp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = [
      "Hello GJVN, I would like to discuss a water engineering requirement.",
      `Name: ${form.get("wa-name")}`,
      `Company: ${form.get("wa-company")}`,
      `Email: ${form.get("wa-email")}`,
      `Phone: ${form.get("wa-phone")}`,
      `Requirement: ${form.get("wa-message")}`,
    ].join("\n");
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return <main>
    <header className={`site-header${scrolled ? " scrolled" : ""}`}>
      <a href="#top" className="brand" aria-label="GJVN home"><span className="brand-logo"><img src="/gjvn-logo.png" alt="" /></span><span className="brand-copy"><strong>GJVN</strong><small>Water • Engineering • Digitalization</small></span></a>
      <nav className={menuOpen ? "nav open" : "nav"} aria-label="Main navigation"><a href="#about" onClick={() => setMenuOpen(false)}>About</a><a href="#solutions" onClick={() => setMenuOpen(false)}>Solutions</a><a href="#approach" onClick={() => setMenuOpen(false)}>Approach</a><a href="#services" onClick={() => setMenuOpen(false)}>Services</a><a className="nav-cta" href="#contact" onClick={() => setMenuOpen(false)}>Discuss a project</a></nav>
      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} aria-hidden="true" />
    </header>

    <section className="hero" id="top"><div className="hero-wallpaper" aria-hidden="true">{heroScenes.map((scene, index) => <div key={scene} className={`hero-scene${index === heroScene ? " active" : ""}`} style={{ backgroundImage: `url(${scene})` }} />)}<div className="hero-shade" /><div className="water-current current-one" /><div className="water-current current-two" /></div><div className="hero-orbit orbit-one" aria-hidden="true" /><div className="hero-orbit orbit-two" aria-hidden="true" /><div className="hero-grid" aria-hidden="true" /><div className="speed-lines" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="hero-content"><div className="hero-kicker"><span><Sparkles size={14} /> Integrated water intelligence</span><i>01 / GJVN</i></div><h1>Engineering the<br /><em>flow of progress.</em></h1><p>Integrated pump systems, metering, treatment and digital solutions that turn complex water requirements into dependable infrastructure.</p><div className="hero-actions"><a className="button button-lime" href="#solutions">Explore solutions</a><a className="button button-glass" href="#contact">Discuss a project</a></div><div className="hero-trust"><span><ShieldCheck size={17} /> Application-led engineering</span><span><CircuitBoard size={17} /> Digital-ready systems</span><span><Zap size={17} /> Lifecycle support</span></div></div>
      <div className="hero-console" aria-hidden="true"><span>System status</span><strong>FLOW / OPTIMAL</strong><div><i /><i /><i /><i /><i /></div></div><a className="scroll-pill" href="#about">Discover GJVN <ChevronRight size={16} /></a>
    </section>

    <section className="marquee" aria-label="GJVN capabilities"><div>SMART PUMPING <span>✦</span> WATER TREATMENT <span>✦</span> DIGITAL METERING <span>✦</span> DESALINATION <span>✦</span> ZERO LIQUID DISCHARGE <span>✦</span> ENGINEERING SUPPORT <span>✦</span></div></section>

    <section className="about section-pad" id="about" data-reveal><div className="about-label"><span>About GJVN</span><strong>ENGINEERING<br />+ WATER<br />+ DIGITAL</strong><div className="about-pictures"><img src="/products/vertical-multistage-pump.jpg" alt="Vertical multistage water pump" /><img src="/products/mobile-flood-pump.jpg" alt="Mobile flood-control pumping unit" /></div></div><div className="about-main"><p className="eyebrow">One connected partner</p><h2>One partner across the <em>water engineering lifecycle.</em></h2><p className="lead">GJVN brings engineering, equipment, integration and modernization together—so project teams move from requirement to reliable operation with fewer hand-offs.</p><div className="about-stats"><div><strong>360°</strong><span>System perspective</span></div><div><strong>04</strong><span>Core solution areas</span></div><div><strong>01</strong><span>Coordinated partner</span></div></div></div></section>

    <section className="solutions section-pad" id="solutions" data-reveal><div className="section-head"><div><p className="eyebrow light">Core solutions</p><h2>Built around your application.<br /><em>Not a catalogue.</em></h2></div><p>From equipment packages to intelligent water management, each solution starts with the duty, environment and outcome.</p></div><div className="solution-grid">{solutions.map((item) => { const Icon = item.icon; return <article className="solution-card" key={item.number}><div className="solution-image"><img src={item.image} alt="" /><span><Icon /> {item.number}</span></div><div className="solution-body"><h3>{item.title}</h3><p>{item.copy}</p><ul>{item.tags.map((tag) => <li key={tag}><Check size={14} />{tag}</li>)}</ul><a href="#contact">Shape this solution <ChevronRight size={16} /></a></div></article>; })}</div></section>

    <section className="equipment section-pad" aria-labelledby="equipment-title" data-reveal><div className="equipment-copy"><p className="eyebrow">Equipment intelligence</p><h2 id="equipment-title">Real equipment.<br /><em>Precisely applied.</em></h2><p>{products[productIndex].copy}</p><div className="equipment-meta"><span>{products[productIndex].category}</span><strong>{products[productIndex].title}</strong></div><div className="equipment-controls"><button onClick={() => showProduct(productIndex - 1)} aria-label="Previous product"><ArrowLeft /></button><span>{String(productIndex + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}</span><button onClick={() => showProduct(productIndex + 1)} aria-label="Next product"><ArrowRight /></button></div></div><div className="equipment-visual" role="region" aria-label={`${products[productIndex].title}. Swipe or drag left and right to browse products.`} tabIndex={0} onPointerDown={startProductSwipe} onPointerUp={finishProductSwipe} onPointerCancel={() => { swipeStart.current = null; }} onKeyDown={(event) => { if (event.key === "ArrowLeft") showProduct(productIndex - 1); if (event.key === "ArrowRight") showProduct(productIndex + 1); }}><div className="visual-ring" aria-hidden="true" /><div className="energy-sweep" aria-hidden="true" /><div className="equipment-product-frame"><img key={products[productIndex].image} src={products[productIndex].image} alt={products[productIndex].title} draggable={false} /></div><span className="spec-chip chip-one">Engineered duty</span><span className="spec-chip chip-two">Integrated control</span><span className="swipe-hint"><ArrowLeft size={14} /> Swipe or drag <ArrowRight size={14} /></span></div><div className="equipment-rail">{products.map((product, index) => <button key={product.title} onClick={() => showProduct(index)} className={index === productIndex ? "active" : ""}><img src={product.image} alt="" /><span>{product.title}</span></button>)}</div></section>

    <section className="approach section-pad" id="approach" data-reveal><div className="approach-photo" aria-hidden="true" /><div className="approach-intro"><p className="eyebrow light">Integrated approach</p><h2>From requirement<br />to working solution.</h2><p>A clear, accountable path connecting technical decisions, equipment and long-term performance.</p></div><div className="process">{process.map(([number, title, copy], index) => <article key={number}><div className="process-number"><span>{number}</span><i>{index < process.length - 1 ? "→" : "✓"}</i></div><h3>{title}</h3><p>{copy}</p></article>)}</div></section>

    <section className="services section-pad" id="services" data-reveal><div className="services-title"><p className="eyebrow">Beyond equipment</p><h2>Support that keeps<br /><em>projects moving.</em></h2><p>Practical capability from specification through modernization.</p></div><div className="service-list">{services.map(([number, title, copy, image]) => <a href="#contact" className="service-row" key={number}><span>{number}</span><img src={image} alt="" /><h3>{title}</h3><p>{copy}</p><ChevronRight /></a>)}</div></section>

    <section className="contact section-pad" id="contact" data-reveal><div className="contact-copy"><p className="eyebrow light">Contact GJVN</p><h2>Let’s engineer<br /><em>what flows next.</em></h2><p>Share your application, flow, head, water quality or project stage. Our team will help shape the next technical step.</p><div className="contact-details"><a href="tel:+919876543210"><Phone /><span><small>Mobile</small>+91 98765 43210</span></a><a href="mailto:info@gjvnengineering.com"><Mail /><span><small>Email</small>info@gjvnengineering.com</span></a></div><address>Office No. 402, Business Avenue,<br />Baner Road, Pune, Maharashtra 411045, India<br /><small>Monday – Saturday | 9:30 AM – 6:30 PM</small></address></div>
      <form className="enquiry" onSubmit={sendEnquiry}><div className="form-head"><span>Project enquiry</span><strong>Tell us what you need.</strong></div><label>Name<input required name="name" placeholder="Your name" /></label><label>Company<input name="company" placeholder="Company name" /></label><label>Email<input required type="email" name="email" placeholder="name@company.com" /></label><label>Phone<input name="phone" placeholder="Contact number" /></label><label className="full">Requirement<textarea required name="requirement" placeholder="Application, flow, head, water quality, timeline..." /></label><button className="button button-lime" type="submit">Prepare email enquiry</button><small>This opens your email app with the project details prepared.</small></form>
    </section>

    <footer><div className="footer-brand"><span className="brand-logo"><img src="/gjvn-logo.png" alt="GJVN" /></span><p>Integrated water, engineering and digitalization solutions.</p></div><div><strong>Solutions</strong><a href="#solutions">Pump & Skid Systems</a><a href="#solutions">Water Meter & IoT</a><a href="#solutions">Water & Wastewater</a><a href="#solutions">Desalination & ZLD</a></div><div><strong>Connect</strong><a href="mailto:info@gjvnengineering.com">info@gjvnengineering.com</a><a href="tel:+919876543210">+91 98765 43210</a><span>Baner Road, Pune</span></div><p className="copyright">© {new Date().getFullYear()} GJVN Engineering Solutions Pvt. Ltd. All rights reserved. Demo contact details shown for website visualization.</p></footer>

    <aside className={`whatsapp-widget${whatsappOpen ? " open" : ""}`} aria-live="polite">
      {whatsappOpen && <div className="whatsapp-card" role="dialog" aria-modal="false" aria-labelledby="whatsapp-title">
        <div className="whatsapp-head"><span className="whatsapp-mark"><WhatsAppIcon /></span><div><strong id="whatsapp-title">Hi there <span aria-hidden="true">👋</span></strong><small>How can we help with your water project?</small></div><button type="button" onClick={() => setWhatsappOpen(false)} aria-label="Close WhatsApp enquiry"><X /></button></div>
        <div className="whatsapp-agent"><span className="agent-avatar">G</span><div><strong>GJVN Project Desk</strong><small><i /> Online</small></div><span>WhatsApp</span></div>
        <form className="whatsapp-form" onSubmit={startWhatsApp}><p>Start a WhatsApp conversation</p><input required name="wa-name" aria-label="Name" placeholder="Name *" /><input required type="email" name="wa-email" aria-label="Email" placeholder="Email *" /><input required name="wa-company" aria-label="Company" placeholder="Company *" /><div className="whatsapp-phone"><span>+91</span><input required inputMode="tel" name="wa-phone" aria-label="WhatsApp number" placeholder="WhatsApp number *" /></div><textarea required name="wa-message" aria-label="Message" placeholder="Tell us about the pump, flow, head or project *" /><button type="submit"><span>Start WhatsApp</span><WhatsAppIcon size={20} /></button><small>Your details are only placed in the message you choose to send.</small></form>
      </div>}
      <button className="whatsapp-launcher" type="button" onClick={() => setWhatsappOpen((open) => !open)} aria-expanded={whatsappOpen} aria-label={whatsappOpen ? "Close WhatsApp enquiry" : "Chat with GJVN on WhatsApp"}>{whatsappOpen ? <X /> : <WhatsAppIcon size={30} />}<span>Talk to an engineer</span></button>
    </aside>
  </main>;
}
