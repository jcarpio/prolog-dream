"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { getUserCredits, spendCredits } from "@/lib/credits";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Coins } from "lucide-react";

export default function CTA() {
  const t = useTranslations("CTA");
  const router = useRouter();
  const { data: session } = useSession();

  const exercises = [
    {
      id: "1",
      label: t("exercises.1.label"),
      facts: t("exercises.1.facts"),
      query: t("exercises.1.query"),
      solution: t("exercises.1.solution"),
      instructions: t("exercises.1.instructions"),
      video: t("exercises.1.video"),
    },
    {
      id: "2",
      label: t("exercises.2.label"),
      facts: t("exercises.2.facts"),
      query: t("exercises.2.query"),
      solution: t("exercises.2.solution"),
      instructions: t("exercises.2.instructions"),
      video: t("exercises.2.video"),
    },
  ];

  const [facts, setFacts] = useState(exercises[0].facts);
  const [query, setQuery] = useState(exercises[0].query);
  const [output, setOutput] = useState("");
  const [solution, setSolution] = useState("");
  const [instructions, setInstructions] = useState(exercises[0].instructions);
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const [selectedVideo, setSelectedVideo] = useState(exercises[0].video);

  useEffect(() => {
    if (session) {
      getUserCredits().then(setUserCredits);
    }
  }, [session]);

  useEffect(() => {
    if (output.startsWith(t("running"))) {
      const interval = setInterval(() => {
        const phrases = t.raw("motivational_phrases") as string[];
        const random = Math.floor(Math.random() * phrases.length);
        setOutput(`${t("running")}\n${phrases[random]}`);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [output, t]);

  const handleRun = async () => {
    if (!session) return router.push("/login");
    if (userCredits !== null && userCredits <= 0) return router.push("/pricing");

    setOutput(t("running"));
    setSolution("");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch("https://responsive-prolog-backend.onrender.com/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ facts, query }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      const newCredits = await spendCredits(1);
      setUserCredits(newCredits);
      toast.success(t("shoot_started_successfully_1_credit_used"));

      setOutput(data.output || `${t("error_prefix")} ${data.error || "Unknown"}`);
    } catch (err: any) {
      if (err.name === "AbortError") {
        setOutput(t("timeout"));
      } else {
        setOutput(`${t("error_prefix")} ${err.message}`);
      }
    }
  };

  const handleExerciseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = exercises.find((ex) => ex.id === e.target.value);
    if (selected) {
      setFacts(selected.facts);
      setQuery(selected.query);
      setInstructions(selected.instructions);
      setSolution("");
      setOutput("");
      setSelectedVideo(selected.video);
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
            {selectedVideo && (
              <div className="mb-6 aspect-video w-full overflow-hidden rounded-md">
                <iframe
                  width="100%"
                  height="100%"
                  src={selectedVideo}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="rounded-md"
                ></iframe>
              </div>
            )}

            <div className="mb-4">
              <label className="block mb-2 font-bold">📚 {t("select_exercise")}</label>
              <select
                className="w-full p-2 rounded border font-bold"
                onChange={handleExerciseChange}
              >
                {exercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>{ex.label}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-bold">📘 {t("instructions")}</label>
              <p className="text-md p-2 rounded bg-muted text-muted-foreground font-medium">
                {instructions}
              </p>
            </div>

            <label className="block mb-2 font-bold">🔧 {t("knowledge_base")}</label>
            <textarea
              className="w-full p-2 mb-4 rounded border font-mono font-bold"
              rows={15}
              value={facts}
              onChange={(e) => setFacts(e.target.value)}
            />

            <label className="block mb-2 font-bold">❓ {t("query")}</label>
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
                {t("show_solution")}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => router.push("/pricing")}>                
                <Coins className="mr-2 size-4" /> {t("credits")}: {userCredits ?? "-"}
              </Button>
            </div>

            <label className="block mb-2 font-bold">📤 {t("result")}</label>
            <pre className="w-full p-3 bg-black text-green-400 rounded font-mono overflow-y-auto" style={{ height: '200px' }}>
              {output || t("empty_output")}
            </pre>

            {solution && (
              <>
                <label className="block mt-6 mb-2 font-bold text-blue-900">✅ {t("solution")}</label>
                <pre className="w-full p-3 bg-blue-100 text-blue-800 rounded font-mono overflow-y-auto">
                  {solution}
                </pre>
              </>
            )}
          </CardContent>
        </Card>
      </MaxWidthWrapper>
    </section>
  );
}

