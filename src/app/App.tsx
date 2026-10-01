import { useState, useEffect } from "react";
import { MapPin, Calendar, Clock, Ticket, X, CheckCircle, ChevronDown, Music, Trees, Zap, Phone, AlertCircle } from "lucide-react";

// ─── COUNTDOWN ───────────────────────────────────────────────────────────────

function useCountdown(target) {
  const [delta, setDelta] = useState(target - Date.now());
  useEffect(() => {
    const t = setInterval(() => setDelta(target - Date.now()), 1000);
    return () => clearInterval(t);
  }, [target]);
  const s = Math.max(0, Math.floor(delta / 1000));
  return {
    days:    Math.floor(s / 86400),
    hours:   Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

// ─── TICKET MODAL ─────────────────────────────────────────────────────────────

function TicketModal({ type, onClose }) {
  const [step, setStep] = useState("form"); // form | success
  const [form, setForm] = useState({ name: "", phone: "", qty: 1 });
  const [err, setErr] = useState("");

  const price = type === "advance" ? 300 : 500;
  const label = type === "advance" ? "Advance" : "Gate";
  const total = price * form.qty;
  const ref = `BNB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const handleSubmit = () => {
    if (!form.name.trim()) { setErr("Please enter your full name."); return; }
    if (!/^(\+254|07|01)\d{8,9}$/.test(form.phone.replace(/\s/g, ""))) {
      setErr("Enter a valid Kenyan phone number."); return;
    }
    setErr("");
    setStep("success");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}>

        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--border)", background: type === "advance" ? "rgba(200,255,0,0.06)" : "rgba(255,85,0,0.06)" }}>
          <div>
            <p style={{ fontFamily: "'Anton', sans-serif", fontSize: 22, color: type === "advance" ? "var(--primary)" : "var(--accent)", letterSpacing: "0.05em" }}>
              {label.toUpperCase()} TICKET
            </p>
            <p style={{ fontSize: 13, color: "var(--muted-foreground)", fontFamily: "'Space Mono', monospace" }}>
              KSh {price.toLocaleString()} per person
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70"
            style={{ background: "var(--secondary)" }}>
            <X size={15} style={{ color: "var(--foreground)" }} />
          </button>
        </div>

        {step === "form" ? (
          <div className="px-6 py-5 flex flex-col gap-4">
            <div>
              <label style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>Full Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Grace Wanjiru"
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{ background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)", fontFamily: "'Nunito', sans-serif", fontSize: 14 }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>M-Pesa / Phone Number</label>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="07XX XXX XXX"
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{ background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)", fontFamily: "'Space Mono', monospace", fontSize: 14 }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>Number of Tickets</label>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} onClick={() => setForm(f => ({ ...f, qty: n }))}
                    className="w-11 h-11 rounded-xl font-bold transition-all"
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      background: form.qty === n ? "var(--primary)" : "var(--secondary)",
                      color: form.qty === n ? "var(--primary-foreground)" : "var(--foreground)",
                      border: `1px solid ${form.qty === n ? "var(--primary)" : "var(--border)"}`,
                    }}>{n}</button>
                ))}
              </div>
            </div>

            {/* M-Pesa instructions */}
            <div className="rounded-xl px-4 py-3 flex gap-3"
              style={{ background: "rgba(200,255,0,0.05)", border: "1px solid rgba(200,255,0,0.2)" }}>
              <Phone size={16} style={{ color: "var(--primary)", marginTop: 2, shrink: 0 }} />
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)", fontFamily: "'Nunito', sans-serif", marginBottom: 2 }}>Payment via M-Pesa</p>
                <p style={{ fontSize: 12, color: "var(--muted-foreground)", fontFamily: "'Nunito', sans-serif", lineHeight: 1.5 }}>
                  You'll receive an M-Pesa STK push on your phone.<br />
                  Total: <strong style={{ color: "var(--foreground)" }}>KSh {total.toLocaleString()}</strong>
                </p>
              </div>
            </div>

            {err && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)" }}>
                <AlertCircle size={14} style={{ color: "#f87171" }} />
                <p style={{ fontSize: 12, color: "#f87171", fontFamily: "'Nunito', sans-serif" }}>{err}</p>
              </div>
            )}

            <button onClick={handleSubmit}
              className="w-full py-4 rounded-xl font-bold tracking-wider transition-all hover:brightness-110 active:scale-98"
              style={{ background: type === "advance" ? "var(--primary)" : "var(--accent)", color: type === "advance" ? "var(--primary-foreground)" : "white", fontFamily: "'Anton', sans-serif", fontSize: 18, letterSpacing: "0.1em" }}>
              PAY KSh {total.toLocaleString()}
            </button>
          </div>
        ) : (
          <div className="px-6 py-8 flex flex-col items-center text-center gap-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: "rgba(200,255,0,0.1)", border: "2px solid var(--primary)" }}>
              <CheckCircle size={36} style={{ color: "var(--primary)" }} />
            </div>
            <div>
              <p style={{ fontFamily: "'Anton', sans-serif", fontSize: 26, color: "var(--primary)", letterSpacing: "0.05em" }}>TICKET CONFIRMED!</p>
              <p style={{ fontSize: 14, color: "var(--muted-foreground)", fontFamily: "'Nunito', sans-serif", marginTop: 4 }}>
                {form.qty} × {label} Ticket{form.qty > 1 ? "s" : ""} · KSh {total.toLocaleString()}
              </p>
            </div>
            <div className="w-full rounded-xl px-5 py-4" style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}>
              <p style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", color: "var(--muted-foreground)", marginBottom: 4 }}>BOOKING REFERENCE</p>
              <p style={{ fontSize: 22, fontFamily: "'Space Mono', monospace", color: "var(--primary)", fontWeight: 700 }}>{ref}</p>
            </div>
            <p style={{ fontSize: 13, color: "var(--muted-foreground)", fontFamily: "'Nunito', sans-serif", lineHeight: 1.6 }}>
              Confirmation sent to <strong style={{ color: "var(--foreground)" }}>{form.phone}</strong>.<br />
              Save your reference number and present it at the gate.
            </p>
            <button onClick={onClose}
              className="w-full py-3 rounded-xl font-bold transition-all hover:opacity-80"
              style={{ background: "var(--secondary)", color: "var(--foreground)", fontFamily: "'Nunito', sans-serif" }}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── COUNTDOWN BLOCK ─────────────────────────────────────────────────────────

function CountdownBlock() {
  const EVENT_DATE = new Date("2026-12-19T18:00:00+03:00").getTime();
  const { days, hours, minutes, seconds } = useCountdown(EVENT_DATE);

  return (
    <div className="flex items-center justify-center gap-3 flex-wrap">
      {[["DAYS", days], ["HRS", hours], ["MIN", minutes], ["SEC", seconds]].map(([label, val]) => (
        <div key={label} className="flex flex-col items-center px-5 py-4 rounded-xl min-w-[72px]"
          style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}>
          <p style={{ fontFamily: "'Anton', sans-serif", fontSize: 42, color: "var(--primary)", lineHeight: 1, letterSpacing: "0.03em" }}>
            {String(val).padStart(2, "0")}
          </p>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "var(--muted-foreground)", letterSpacing: "0.12em", marginTop: 4 }}>
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function App() {
  const [modal, setModal] = useState(null);
  const [faqOpen, setFaqOpen] = useState(null);

  const faqs = [
    ["What should I wear?", "Forest-friendly attire! Think layers — it gets cool at Njukiini after dark. Closed shoes strongly recommended. Face paint and festival gear welcome."],
    ["Is there camping?", "Yes! On-site camping is available at Njukiini Forest Lodge. Bring your tent. Limited cabins can be booked directly with the lodge."],
    ["What time does it start?", "Gates open at 4:00 PM. DJ QUAN takes the stage at 8:00 PM. Event runs until late — plan to stay the night if possible."],
    ["Is it family-friendly?", "The event is 18+ after 8:00 PM. Families with children are welcome during the afternoon session (4–7 PM)."],
    ["What payment methods?", "M-Pesa, cash at the gate. Advance tickets via M-Pesa only. Save with advance booking — gate price is KSh 500."],
    ["How do I get there?", "Njukiini Forest Lodge is in Kirinyaga County, off the Sagana–Karatina road. Shuttles from Nairobi available — WhatsApp +254 700 000 000 for details."],
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--background)", fontFamily: "'Nunito', sans-serif" }}>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4"
        style={{ background: "rgba(10,26,7,0.88)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)" }}>
        <p style={{ fontFamily: "'Anton', sans-serif", fontSize: 18, color: "var(--primary)", letterSpacing: "0.12em" }}>
          BUSH N BEAT FEST
        </p>
        <button onClick={() => setModal("advance")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all hover:brightness-110 active:scale-95"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)", fontFamily: "'Space Mono', monospace", fontSize: 12 }}>
          <Ticket size={13} /> BUY TICKETS
        </button>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
        {/* Forest background */}
        <div className="absolute inset-0 bg-green-950">
          <img
            src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1600&h=900&fit=crop&auto=format"
            alt="Dense forest at Njukiini"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,26,7,0.5) 0%, rgba(10,26,7,0.2) 50%, rgba(10,26,7,0.95) 100%)" }} />
        </div>

        {/* Electric glow behind text */}
        <div className="absolute" style={{ width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,255,0,0.06) 0%, transparent 70%)", top: "20%", left: "50%", transform: "translateX(-50%)" }} />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {/* Pre-label */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background: "rgba(200,255,0,0.1)", border: "1px solid rgba(200,255,0,0.3)" }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--primary)" }} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "var(--primary)", letterSpacing: "0.15em" }}>
              19 DECEMBER 2026 · KIRINYAGA
            </span>
          </div>

          {/* Main title */}
          <h1 style={{ fontFamily: "'Anton', sans-serif", letterSpacing: "0.04em", lineHeight: 0.92, color: "var(--foreground)" }}
            className="text-7xl md:text-9xl mb-2">
            BUSH
          </h1>
          <h1 className="text-7xl md:text-9xl mb-2 flex items-center justify-center gap-4"
            style={{ fontFamily: "'Anton', sans-serif", letterSpacing: "0.04em", lineHeight: 0.92, color: "var(--primary)" }}>
            N
            <span style={{ fontSize: "0.6em", color: "var(--accent)" }}>✦</span>
            BEAT
          </h1>
          <h1 className="text-6xl md:text-8xl mb-8"
            style={{ fontFamily: "'Anton', sans-serif", letterSpacing: "0.06em", lineHeight: 0.92, color: "var(--foreground)" }}>
            FEST
          </h1>

          {/* DJ name */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="flex-1 max-w-[100px] h-px" style={{ background: "var(--primary)", opacity: 0.4 }} />
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "var(--muted-foreground)", letterSpacing: "0.2em" }}>FEATURING</p>
            <div className="flex-1 max-w-[100px] h-px" style={{ background: "var(--primary)", opacity: 0.4 }} />
          </div>
          <p style={{ fontFamily: "'Anton', sans-serif", fontSize: 52, color: "var(--primary)", letterSpacing: "0.08em", lineHeight: 1 }}
            className="md:text-7xl">
            DJ QUAN
          </p>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: "var(--muted-foreground)", marginTop: 8 }}>
            LIVE · NJUKIINI FOREST LODGE · KIRINYAGA
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <button onClick={() => setModal("advance")}
              className="flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:brightness-110 active:scale-95 w-full sm:w-auto"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)", fontFamily: "'Anton', sans-serif", fontSize: 20, letterSpacing: "0.08em" }}>
              <Ticket size={20} /> ADVANCE — KSh 300
            </button>
            <button onClick={() => setModal("gate")}
              className="flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:opacity-80 active:scale-95 w-full sm:w-auto"
              style={{ background: "transparent", color: "var(--foreground)", fontFamily: "'Anton', sans-serif", fontSize: 20, letterSpacing: "0.08em", border: "2px solid rgba(237,232,212,0.3)" }}>
              GATE — KSh 500
            </button>
          </div>

          <p style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 12, fontFamily: "'Space Mono', monospace" }}>
            ↓ Save KSh 200 by booking in advance ↓
          </p>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={24} style={{ color: "var(--muted-foreground)" }} />
        </div>
      </section>

      {/* COUNTDOWN */}
      <section className="py-16 px-4" style={{ background: "var(--card)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "var(--muted-foreground)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>
            Countdown to the fest
          </p>
          <CountdownBlock />
          <div className="flex items-center justify-center gap-4 mt-8 flex-wrap text-sm" style={{ color: "var(--muted-foreground)", fontFamily: "'Space Mono', monospace" }}>
            <div className="flex items-center gap-2"><Calendar size={14} style={{ color: "var(--primary)" }} /> 19 December 2026</div>
            <div className="flex items-center gap-2"><Clock size={14} style={{ color: "var(--primary)" }} /> Gates open 4:00 PM</div>
            <div className="flex items-center gap-2"><MapPin size={14} style={{ color: "var(--primary)" }} /> Njukiini Forest Lodge</div>
          </div>
        </div>
      </section>

      {/* LINEUP */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "var(--primary)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>Headline Act</p>
          <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: 52, color: "var(--foreground)", letterSpacing: "0.04em", marginBottom: 40 }}>THE LINEUP</h2>

          {/* DJ QUAN main card */}
          <div className="rounded-2xl overflow-hidden mb-8" style={{ border: "1px solid var(--border)" }}>
            <div className="relative h-72 bg-green-950 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=500&fit=crop&auto=format"
                alt="DJ performing live"
                className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(10,26,7,0.92) 40%, rgba(10,26,7,0.2) 100%)" }} />
              <div className="absolute inset-0 flex flex-col justify-center px-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 w-fit"
                  style={{ background: "var(--accent)", }}>
                  <Zap size={12} style={{ color: "white" }} />
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "white", letterSpacing: "0.15em" }}>HEADLINER</span>
                </div>
                <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: 64, color: "var(--primary)", letterSpacing: "0.06em", lineHeight: 1 }}>DJ QUAN</h3>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "var(--muted-foreground)", marginTop: 8, letterSpacing: "0.1em" }}>
                  AFROBEATS · HOUSE · AFRO-FUSION
                </p>
                <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: "var(--foreground)", marginTop: 8, maxWidth: 380, opacity: 0.85 }}>
                  Kenya's hottest DJ brings the forest to life. DJ QUAN fuses Afrobeats, deep house, and Afro-fusion for a set you won't forget under the Kirinyaga stars.
                </p>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "var(--primary)", marginTop: 10, letterSpacing: "0.1em" }}>
                  STAGE TIME — 8:00 PM ONWARDS
                </p>
              </div>
            </div>
          </div>

          {/* Supporting acts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "DJ Baraka", genre: "Afro Drill · Gengetone", time: "4:00 PM" },
              { name: "MC Wangeci", genre: "Host · Hype", time: "All Night" },
              { name: "Vinyl Kings", genre: "Warm-up · Deep House", time: "6:00 PM" },
            ].map(({ name, genre, time }) => (
              <div key={name} className="rounded-xl p-5 flex flex-col gap-2"
                style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                  style={{ background: "rgba(200,255,0,0.1)", color: "var(--primary)", fontFamily: "'Anton', sans-serif", fontSize: 18 }}>
                  {name[0]}
                </div>
                <p style={{ fontFamily: "'Anton', sans-serif", fontSize: 20, color: "var(--foreground)", letterSpacing: "0.04em" }}>{name}</p>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "var(--muted-foreground)" }}>{genre}</p>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "var(--primary)" }}>{time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TICKETS */}
      <section id="tickets" className="py-20 px-4" style={{ background: "var(--card)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "var(--primary)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>Secure your spot</p>
          <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: 52, color: "var(--foreground)", letterSpacing: "0.04em", marginBottom: 12 }}>TICKETS</h2>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, color: "var(--muted-foreground)", marginBottom: 40 }}>
            Advance tickets sell fast. Book now and save KSh 200.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Advance */}
            <div className="rounded-2xl overflow-hidden" style={{ border: "2px solid var(--primary)" }}>
              <div className="px-6 py-4 flex items-center justify-between" style={{ background: "rgba(200,255,0,0.08)" }}>
                <div>
                  <p style={{ fontFamily: "'Anton', sans-serif", fontSize: 26, color: "var(--primary)", letterSpacing: "0.06em" }}>ADVANCE</p>
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "var(--muted-foreground)" }}>Book before the day</p>
                </div>
                <div className="text-right">
                  <p style={{ fontFamily: "'Anton', sans-serif", fontSize: 40, color: "var(--primary)", lineHeight: 1 }}>300</p>
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "var(--muted-foreground)" }}>KSh / person</p>
                </div>
              </div>
              <div className="px-6 py-5">
                <ul className="flex flex-col gap-2 mb-6">
                  {["Full event access","Priority entry at gate","Save KSh 200 vs gate price","M-Pesa payment"].map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(200,255,0,0.2)" }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--primary)" }} />
                      </div>
                      <span style={{ fontSize: 14, color: "var(--foreground)", fontFamily: "'Nunito', sans-serif" }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => setModal("advance")}
                  className="w-full py-4 rounded-xl font-bold tracking-wider transition-all hover:brightness-110 active:scale-95"
                  style={{ background: "var(--primary)", color: "var(--primary-foreground)", fontFamily: "'Anton', sans-serif", fontSize: 20, letterSpacing: "0.1em" }}>
                  BUY ADVANCE — KSh 300
                </button>
              </div>
            </div>

            {/* Gate */}
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              <div className="px-6 py-4 flex items-center justify-between" style={{ background: "rgba(255,85,0,0.06)" }}>
                <div>
                  <p style={{ fontFamily: "'Anton', sans-serif", fontSize: 26, color: "var(--accent)", letterSpacing: "0.06em" }}>AT THE GATE</p>
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "var(--muted-foreground)" }}>Pay on arrival</p>
                </div>
                <div className="text-right">
                  <p style={{ fontFamily: "'Anton', sans-serif", fontSize: 40, color: "var(--accent)", lineHeight: 1 }}>500</p>
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "var(--muted-foreground)" }}>KSh / person</p>
                </div>
              </div>
              <div className="px-6 py-5">
                <ul className="flex flex-col gap-2 mb-6">
                  {["Full event access","Subject to availability","Cash or M-Pesa at gate","No pre-booking needed"].map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(255,85,0,0.15)" }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
                      </div>
                      <span style={{ fontSize: 14, color: "var(--foreground)", fontFamily: "'Nunito', sans-serif" }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="w-full py-4 rounded-xl text-center"
                  style={{ background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--muted-foreground)", fontFamily: "'Anton', sans-serif", fontSize: 18, letterSpacing: "0.1em" }}>
                  AVAILABLE AT GATE · 19 DEC
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VENUE */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "var(--primary)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>The location</p>
          <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: 52, color: "var(--foreground)", letterSpacing: "0.04em", marginBottom: 40 }}>VENUE</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="rounded-2xl overflow-hidden h-64 bg-green-950">
                <img src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&h=500&fit=crop&auto=format"
                  alt="Njukiini Forest Lodge, Kirinyaga"
                  className="w-full h-full object-cover opacity-75" />
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div>
                <p style={{ fontFamily: "'Anton', sans-serif", fontSize: 32, color: "var(--foreground)", letterSpacing: "0.04em", lineHeight: 1.1 }}>
                  NJUKIINI FOREST LODGE
                </p>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "var(--primary)", marginTop: 4 }}>
                  KIRINYAGA COUNTY, KENYA
                </p>
              </div>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, color: "var(--muted-foreground)", lineHeight: 1.7 }}>
                Nestled in the indigenous forests at the foot of Mt. Kenya, Njukiini Forest Lodge offers a magical backdrop for an unforgettable night. Expect cool forest air, open skies, and the sounds of nature mixed with DJ QUAN's electric set.
              </p>
              {[
                [Trees, "Indigenous forest setting · Mt. Kenya foothills"],
                [MapPin, "Off Sagana–Karatina Road, Kirinyaga County"],
                [Clock, "Gates open 4:00 PM · Event runs until late"],
                [Music, "Camping & lodge accommodation available"],
              ].map(([Icon, text]) => (
                <div key={text} className="flex items-start gap-3">
                  <Icon size={16} style={{ color: "var(--primary)", marginTop: 2, shrink: 0 }} />
                  <p style={{ fontSize: 14, color: "var(--foreground)", fontFamily: "'Nunito', sans-serif" }}>{text}</p>
                </div>
              ))}
              <div className="px-4 py-3 rounded-xl flex items-start gap-3"
                style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}>
                <Phone size={14} style={{ color: "var(--primary)", marginTop: 2 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)", fontFamily: "'Nunito', sans-serif" }}>Shuttle from Nairobi</p>
                  <p style={{ fontSize: 13, color: "var(--muted-foreground)", fontFamily: "'Nunito', sans-serif" }}>WhatsApp +254 700 000 000 to book your seat on the shuttle.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4" style={{ background: "var(--card)", borderTop: "1px solid var(--border)" }}>
        <div className="max-w-3xl mx-auto">
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "var(--primary)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>Got questions?</p>
          <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: 52, color: "var(--foreground)", letterSpacing: "0.04em", marginBottom: 40 }}>FAQ</h2>
          <div className="flex flex-col gap-2">
            {faqs.map(([q, a], i) => (
              <div key={i} className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:opacity-80"
                  style={{ background: faqOpen === i ? "rgba(200,255,0,0.05)" : "var(--secondary)" }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)", fontFamily: "'Nunito', sans-serif" }}>{q}</p>
                  <ChevronDown size={16} style={{ color: "var(--muted-foreground)", transform: faqOpen === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </button>
                {faqOpen === i && (
                  <div className="px-5 py-4" style={{ background: "rgba(200,255,0,0.03)", borderTop: "1px solid var(--border)" }}>
                    <p style={{ fontSize: 14, color: "var(--muted-foreground)", fontFamily: "'Nunito', sans-serif", lineHeight: 1.7 }}>{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-green-950">
          <img src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1600&h=600&fit=crop&auto=format"
            alt="Festival crowd at night"
            className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0" style={{ background: "rgba(10,26,7,0.8)" }} />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <p style={{ fontFamily: "'Anton', sans-serif", fontSize: 56, color: "var(--primary)", letterSpacing: "0.04em", lineHeight: 1 }} className="md:text-7xl">
            SEE YOU IN<br />THE FOREST
          </p>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "var(--muted-foreground)", marginTop: 12, marginBottom: 32 }}>
            19 DECEMBER 2026 · NJUKIINI FOREST LODGE · KIRINYAGA
          </p>
          <button onClick={() => setModal("advance")}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-xl font-bold transition-all hover:brightness-110 active:scale-95"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)", fontFamily: "'Anton', sans-serif", fontSize: 22, letterSpacing: "0.1em" }}>
            <Ticket size={22} /> GET ADVANCE TICKETS — KSh 300
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ borderTop: "1px solid var(--border)", background: "var(--card)" }}>
        <p style={{ fontFamily: "'Anton', sans-serif", fontSize: 16, color: "var(--primary)", letterSpacing: "0.12em" }}>
          BUSH N BEAT FEST 2026
        </p>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "var(--muted-foreground)" }}>
          Njukiini Forest Lodge · Kirinyaga County · Kenya
        </p>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "var(--muted-foreground)" }}>
          Enquiries: +254 700 000 000
        </p>
      </footer>

      {/* TICKET MODAL */}
      {modal && <TicketModal type={modal} onClose={() => setModal(null)} />}
    </div>
  );
}
