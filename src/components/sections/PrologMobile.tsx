import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const motivationalPhrases = [
  "Take these seconds, breathe.",
  "You already have it all.",
  "You are whole and complete.",
  "Breathe, happiness is yours.",
  "Breathe, you are light.",
  "Love is what you are.",
  "Everything is perfect now.",
  "You are deeply supported.",
  "Peace is within you.",
  "The universe holds you.",
  "Nothing real can be lost.",
  "You are eternal joy.",
  "Breathe, truth sets free.",
  "You are Satchitananda.",
  "Love is your essence.",
  "Breathe and surrender.",
  "Let go and trust.",
  "You are pure being.",
  "Everything is love.",
  "Trust the divine now.",
  "Forgiveness frees you.",
  "You are loved infinitely.",
  "God is only love.",
  "Miracles are natural.",
  "Choose peace always.",
  "Let truth guide you.",
  "Be still and know.",
  "You are the answer.",
  "There is only now.",
  "Grace flows through you.",
  "Breathe and be light.",
  "Only love is real.",
  "Accept what is now.",
  "Shine your light.",
  "Give love to all.",
  "Truth needs no defense.",
  "Let go and flow.",
  "All is unfolding perfectly.",
  "Love holds no grievances.",
  "Rest in God.",
  "You are divine mind.",
  "Be love in motion.",
  "You are already free.",
  "Truth is simple.",
  "I am as God created me.",
  "Nothing can harm you.",
  "In stillness I find God.",
  "Peace begins with you.",
  "Gratitude brings miracles."
];

export default function PrologMobile() {
  const [facts, setFacts] = useState(`padre(juan, maria).
padre(juan, pedro).
padre(pedro, luis).
abuelo(X, Y) :- padre(X, Z), padre(Z, Y).`);
  const [query, setQuery] = useState("abuelo(X, luis).\");
  const [output, setOutput] = useState("");

  useEffect(() => {
    if (output === "⏳ Ejecutando...") {
      const interval = setInterval(() => {
        const random = Math.floor(Math.random() * motivationalPhrases.length);
        setOutput(`⏳ Ejecutando...\n${motivationalPhrases[random]}`);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [output]);

  const handleRun = async () => {
    setOutput("⏳ Ejecutando...");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos

    try {
      const response = await fetch("https://responsive-prolog-backend.onrender.com/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ facts, query }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();
      if (data.output) setOutput(data.output);
      else setOutput("⚠️ Error: " + (data.error || "Desconocido"));
    } catch (err) {
      if (err.name === 'AbortError') {
        setOutput("⏱️ Tiempo de espera agotado (5s). La consulta tardó demasiado.");
      } else {
        setOutput("⚠️ Error de red: " + err.message);
      }
    }
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">🧠 Prolog Online</h1>

      <div className="mb-4">
        <label className="form-label fw-bold">🔧 Base de conocimiento:</label>
        <textarea
          className="form-control fw-bold"
          style={{ height: '200px', fontFamily: 'Courier, monospace', overflowY: 'auto' }}
          value={facts}
          onChange={(e) => setFacts(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="form-label fw-bold">❓ Consulta:</label>
        <textarea
          className="form-control fw-bold"
          style={{ height: '100px', fontFamily: 'Courier, monospace', overflowY: 'auto' }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="text-center mb-4">
        <button
          onClick={handleRun}
          className="btn btn-primary btn-lg"
        >
          ▶️ Ejecutar
        </button>
      </div>

      <div>
        <label className="form-label fw-bold">📤 Resultado:</label>
        <pre className="form-control bg-dark text-success fw-bold" style={{ height: '200px', overflowY: 'auto', fontFamily: 'Courier, monospace' }}>
          {output || "(salida vacía)"}
        </pre>
      </div>
    </div>
  );
}
