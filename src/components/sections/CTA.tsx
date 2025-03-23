"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

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
];

export default function CTA() {
  const t = useTranslations("CTA");

  const [facts, setFacts] = useState(`padre(juan, maria).
padre(juan, pedro).
padre(pedro, luis).
abuelo(X, Y) :- padre(X, Z), padre(Z, Y).`);

  const [query, setQuery] = useState("abuelo(X, luis).");
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
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch("https://responsive-prolog-backend.onrender.com/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ facts, query }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json();
      setOutput(data.output || "⚠️ Error: " + (data.error || "Unknown"));
    } catch (err) {
      if (err.name === 'AbortError') {
        setOutput("⏱️ Timeout reached. Try again.");
      } else {
        setOutput("⚠️ Network error: " + err.message);
      }
    }
  };

  const renderLineNumbers = () => {
    return facts.split("\n").map((_, i) => `${i + 1}`).join("\n");
  };

  return (
    <section className="py-16 text-muted-foreground">
      <MaxWidthWrapper>
        <Card className="rounded-xl border border-secondary bg-secondary">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-semibold text-secondary-foreground" />
          </CardHeader>
          <CardContent>

            <label className="block mb-2 font-bold">🔧 Base de conocimiento:</label>
            <div className="relative mb-4 flex">
              <pre className="text-right pr-3 text-sm text-muted-foreground font-mono font-bold select-none pt-2">
                {renderLineNumbers()}
              </pre>
              <textarea
                className="w-full p-2 rounded border font-mono font-bold"
                rows={20}
                value={facts}
                onChange={(e) => setFacts(e.target.value)}
              />
            </div>

            <label className="block mb-2 font-bold">❓ Consulta:</label>
            <textarea
              className="w-full p-2 mb-4 rounded border font-mono font-bold"
              rows={10}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <div className="text-center mb-6">
              <Button
                size="lg"
                variant="default"
                onClick={handleRun}
                className="transition-all hover:rotate-2 hover:scale-110"
              >
                {t("button")} ▶️
              </Button>
            </div>

            <label className="block mb-2 font-bold">📤 Resultado:</label>
            <pre
              className="w-full p-3 bg-black text-green-400 rounded font-mono overflow-y-auto"
              style={{ maxHeight: '300px', height: '260px' }} // 10 líneas aprox
            >
              {output || "(salida vacía)"}
            </pre>
          </CardContent>
        </Card>
      </MaxWidthWrapper>
    </section>
  );
}
