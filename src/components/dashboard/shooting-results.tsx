"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation"; // ✅ Hook dentro del componente
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Camera, Info } from "lucide-react";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { Badge } from "@/components/ui/badge";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Drawer } from "vaul";
import { BorderBeam } from "@/components/ui/border-beam";
import { useTranslations } from "next-intl";

interface Prediction {
    id: string;
    createdAt: string;
    imageUrl: string | null;
    status: string;
    style: string | null;
    pId: string | null;
}

interface ShootingResultsProps {
    predictions: Prediction[];
    studioId: string;
    onShootComplete: () => void;
}

const getTimeAgo = (date: string): string => {
    const diffInSeconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

export function ShootingResults({ predictions: initialPredictions, studioId, onShootComplete }: ShootingResultsProps) {
    const t = useTranslations('StudioPage');
    const router = useRouter(); // ✅ Ahora se inicializa correctamente dentro del componente
    const [predictions, setPredictions] = useState(initialPredictions);
    const [processingPredictions, setProcessingPredictions] = useState<string[]>([]);
    const { isMobile } = useMediaQuery();

    useEffect(() => {
        setPredictions(initialPredictions);
        setProcessingPredictions(initialPredictions.filter(p => p.status === "processing").map(p => p.id));
    }, [initialPredictions]);

    return (
        <>
            {predictions.length > 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>{t("shooting_results")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {predictions.map((prediction) => (
                                <div key={prediction.id} className="space-y-2">
                                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg border bg-muted">
                                        {prediction.status === "processing" ? (
                                            <div className="relative inset-0 flex size-full items-center justify-center rounded-lg">
                                                <BorderBeam borderWidth={2} />
                                                <Loader2 className="size-8 animate-spin" />
                                            </div>
                                        ) : prediction.imageUrl ? (
                                            <img
                                                src={prediction.imageUrl}
                                                alt="Shooting Result"
                                                className="absolute inset-0 size-full cursor-pointer object-cover transition-all duration-300 hover:scale-105"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <Camera className="size-8 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-1 text-xs">
                                        <div className="flex items-center justify-between">
                                            <Badge className="font-urban text-xs" variant="secondary">
                                                {prediction.style}
                                            </Badge>
                                            <span className="hidden items-center gap-1 text-muted-foreground sm:flex">
                                                {getTimeAgo(prediction.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <EmptyPlaceholder className="min-h-[80vh]">
                    <EmptyPlaceholder.Icon name="photo" />
                    <EmptyPlaceholder.Title>{t("ready_to_shoot")}</EmptyPlaceholder.Title>
                    <EmptyPlaceholder.Description>
                        {t("your_studio_created_successfully")}
                        <br />
                        {t("click_shoot_below_to_begin_creating_your_first_headshot")}
                    </EmptyPlaceholder.Description>
                    {/* ✅ Ahora el botón redirige correctamente al entorno de ejercicios */}
                    <Button 
                        onClick={() => router.push(`/dashboard/studio/${studioId}/run`)} 
                        variant="default"
                    >
                        <Camera className="mr-2 size-4" />
                        {t("shoot")}
                    </Button>
                </EmptyPlaceholder>
            )}
            <div className="my-2 flex w-full items-center space-x-2">
                <Info className="hidden size-3 text-muted-foreground md:block" />
                <span className="text-xs text-muted-foreground">
                    {t("each_shoot_generates_a_unique_headshot_even_with_the_same_style_or_prompt_try_multiple_times")}
                </span>
            </div>
        </>
    );
}
