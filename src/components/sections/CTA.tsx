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

const exercises = [
  {
    id: "1",
    label: "🧩 1: Abuelo",
    facts: `padre(juan, maria).\npadre(juan, pedro).\npadre(pedro, luis).\nabuelo(X, Y) :- padre(X, Z), padre(Z, Y).`,
    query: "abuelo(X, luis).",
    solution: "X = juan.",
    videoUrl: "https://youtu.be/RSv9aSsg2wc?si=LM8VfayaLacf0607"
  },
  {
    id: "2",
    label: "🧩 2: Natural",
    facts: `natural(1).\nnatural(N):-   natural(   ).`,
    query: "natural(5).",
    solution: `natural(1).\nnatural(N):- N > 1, N2 is N-1, natural(N2).`,
    videoUrl: "https://youtu.be/RSv9aSsg2wc?si=LM8VfayaLacf0607"
  }
];

export default function CTA() {
  const t = useTranslations("CTA");

  const [facts, setFacts] = useState(exercises[0].facts);
  const [query, setQuery] = useState(exercises[0].query);
  const [output, setOutput] = useState("");
  const [solution, setSolution] = useState("");
  const [videoUrl, setVideoUrl] = useState(exercises[0].videoUrl);

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
    setSolution("");

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

  const handleExerciseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = exercises.find((ex) => ex.id === e.target.value);
    if (selected) {
      setFacts(selected.facts);
      setQuery(selected.query);
      setSolution("");
      setOutput("");
      setVideoUrl(selected.videoUrl);
    }
  };

  const handleShowSolution = () => {
    const selected = exercises.find((ex) => ex.query === query && ex.facts === facts);
    setSolution(selected?.solution || "No solution available.");
  };

  return (
    <section className="py-16 text-muted-foreground">
      <MaxWidthWrapper>
        <Card className="rounded-xl border border-secondary bg-secondary">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-semibold text-secondary-foreground">
              {t("title")}
            </CardTitle>
          </CardHeader>

          <CardContent>

            <div className="mb-4">
              <label className="block mb-2 font-bold">📚 Elige un ejercicio:</label>
              <select
                className="w-full p-2 rounded border font-bold"
                onChange={handleExerciseChange}
              >
                {exercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>{ex.label}</option>
                ))}
              </select>
            </div>

            <label className="block mb-2 font-bold">🔧 Base de conocimiento:</label>
            <textarea
              className="w-full p-2 mb-4 rounded border font-mono font-bold"
              rows={15}
              value={facts}
              onChange={(e) => setFacts(e.target.value)}
            />

            <label className="block mb-2 font-bold">❓ Consulta:</label>
            <textarea
              className="w-full p-2 mb-4 rounded border font-mono font-bold"
              rows={5}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <div className="flex justify-center gap-4 mb-6">
              <Button size="lg" variant="default" onClick={handleRun}>
                {t("button")} ▶️
              </Button>
              <Button size="lg" variant="secondary" onClick={handleShowSolution}>
                Mostrar solución ✅
              </Button>
            </div>

            <label className="block mb-2 font-bold">📤 Resultado:</label>
            <pre className="w-full p-3 bg-black text-green-400 rounded font-mono overflow-y-auto" style={{ height: '200px' }}>
              {output || "(salida vacía)"}
            </pre>

            {solution && (
              <>
                <label className="block mt-6 mb-2 font-bold text-blue-900">✅ Solución:</label>
                <pre className="w-full p-3 bg-blue-100 text-blue-800 rounded font-mono overflow-y-auto">
                  {solution}
                </pre>
              </>
            )}

            {videoUrl && (
              <div className="mt-8">
                <label className="block mb-2 font-bold">🎥 Video explicativo:</label>
                <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    src={videoUrl}
                    title="Video explicativo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </MaxWidthWrapper>
    </section>
  );
}
