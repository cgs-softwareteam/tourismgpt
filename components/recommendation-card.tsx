"use client";

import { motion } from "framer-motion";
import { MapPin, Save, Info, Clock, Star, MapPinned, Users, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
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
  event: "🎫",
};

// Function to get color for price labels
const getPriceColor = (price: string): string => {
  if (!price) return "text-muted-foreground";

  switch (price.toLowerCase()) {
    case "budget-friendly":
      return "text-green-600";
    case "moderate":
      return "text-yellow-600";
    case "expensive":
      return "text-orange-600";
    case "very expensive":
      return "text-red-600";
    default:
      return "text-muted-foreground";
  }
};

export function RecommendationCard({
  recommendation,
  location,
  chatId,
  userId,
}: RecommendationCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Check if recommendation is already saved
  useEffect(() => {
    if (!userId) return;

    const checkSavedStatus = async () => {
      try {
        const response = await fetch(
          `/api/check-saved?name=${encodeURIComponent(recommendation.name)}&location=${encodeURIComponent(location)}`
        );
        if (response.ok) {
          const data = await response.json();
          setIsSaved(data.isSaved);
        }
      } catch (error) {
        console.error("Error checking saved status:", error);
      }
    };

    checkSavedStatus();
  }, [userId, recommendation.name, location]);

  const handleSave = async () => {
    if (!userId || isSaving) {
      return;
    }

    await trackClick("save");
    setIsSaving(true);
    try {
      if (isSaved) {
        // Unsave
        const response = await fetch(
          `/api/unsave-recommendation?name=${encodeURIComponent(recommendation.name)}&location=${encodeURIComponent(location)}`,
          { method: "DELETE" }
        );

        if (response.ok) {
          setIsSaved(false);
        }
      } else {
        // Save
        const response = await fetch("/api/save-recommendation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chatId,
            recommendationName: recommendation.name,
            category: recommendation.category,
            location,
            description: recommendation.description,
            price: recommendation.price,
            rating: recommendation.rating,
            hours: recommendation.hours,
            address: recommendation.address,
            bestFor: recommendation.bestFor,
            tips: recommendation.tips,
          }),
        });

        if (response.ok) {
          setIsSaved(true);
        }
      }
    } catch (error) {
      console.error("Error saving/unsaving recommendation:", error);
    } finally {
      setIsSaving(false);
    }
  };

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
            <span className={`text-sm font-medium whitespace-nowrap ${getPriceColor(recommendation.price)}`}>
              {recommendation.price}
            </span>
          </div>

          {/* Rating, Hours, Address - Compact info row */}
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
            {recommendation.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span>{recommendation.rating}</span>
              </div>
            )}
            {recommendation.hours && (
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{recommendation.hours}</span>
              </div>
            )}
            {recommendation.address && (
              <div className="flex items-center gap-1">
                <MapPinned className="h-3.5 w-3.5" />
                <span>{recommendation.address}</span>
              </div>
            )}
          </div>

          {/* Best For tags */}
          {recommendation.bestFor && (
            <div className="mt-2 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <div className="flex flex-wrap gap-1">
                {recommendation.bestFor.split(',').map((tag, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          <p className="mt-2 text-sm text-foreground">
            {recommendation.description}
          </p>

          {/* Tips section - expandable */}
          {recommendation.tips && (
            <div className="mt-3">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex w-full items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-left text-sm transition-colors hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-950/50"
              >
                <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                <span className="flex-1 font-medium text-amber-900 dark:text-amber-200">
                  Insider Tips
                </span>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-amber-600" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-amber-600" />
                )}
              </button>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="mt-2 rounded-lg border border-amber-200 bg-amber-50/50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-200"
                >
                  {recommendation.tips}
                </motion.div>
              )}
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving || isTracking}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                isSaved
                  ? "border-primary bg-primary/10 text-primary"
                  : "hover:bg-muted"
              }`}
            >
              <Save className="h-3.5 w-3.5" />
              {isSaving ? "Saving..." : isSaved ? "Saved" : "Save"}
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
