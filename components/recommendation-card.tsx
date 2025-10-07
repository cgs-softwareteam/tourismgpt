"use client";

import { motion } from "framer-motion";
import { MapPin, Save, Info } from "lucide-react";
import { useState } from "react";
import type { ParsedRecommendation } from "@/lib/parse-recommendations";

interface RecommendationCardProps {
  recommendation: ParsedRecommendation;
  location: string;
  chatId: string;
  userId?: string;
}

const categoryIcons: Record<string, string> = {
  attraction: "🗼",
  dining: "🍽️",
  shopping: "🛍️",
  nightlife: "🎭",
  hotel: "🏨",
  activity: "🎯",
};

export function RecommendationCard({
  recommendation,
  location,
  chatId,
  userId,
}: RecommendationCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isTracking, setIsTracking] = useState(false);

  const trackClick = async (action: string) => {
    if (isTracking) return;

    setIsTracking(true);
    try {
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recommendationName: recommendation.name,
          category: recommendation.category,
          location,
          action,
          chatId,
        }),
      });
    } catch (error) {
      console.error("Error tracking click:", error);
    } finally {
      setIsTracking(false);
    }
  };

  const handleSave = async () => {
    await trackClick("save");
    setIsSaved(true);
    // TODO: Implement actual save to database
  };

  const handleDirections = async () => {
    await trackClick("directions");
    // Open Google Maps with location
    const query = encodeURIComponent(`${recommendation.name} ${location}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  const handleMoreInfo = async () => {
    await trackClick("more_info");
    // Open Google search
    const query = encodeURIComponent(`${recommendation.name} ${location}`);
    window.open(`https://www.google.com/search?q=${query}`, "_blank");
  };

  const icon = categoryIcons[recommendation.category] || "📍";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-3 rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl">{icon}</div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg">{recommendation.name}</h3>
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              {recommendation.price}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {recommendation.description}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={handleSave}
              disabled={isTracking}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                isSaved
                  ? "border-primary bg-primary/10 text-primary"
                  : "hover:bg-muted"
              }`}
            >
              <Save className="h-3.5 w-3.5" />
              {isSaved ? "Saved" : "Save"}
            </button>

            <button
              onClick={handleDirections}
              disabled={isTracking}
              className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
            >
              <MapPin className="h-3.5 w-3.5" />
              Directions
            </button>

            <button
              onClick={handleMoreInfo}
              disabled={isTracking}
              className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
            >
              <Info className="h-3.5 w-3.5" />
              More Info
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
