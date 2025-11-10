"use client";

import { motion } from "framer-motion";
import { MapPin, Save, Info, Clock, Star, MapPinned, Users, Lightbulb, ChevronDown, ChevronUp, Navigation } from "lucide-react";
import { useState, useEffect } from "react";
import type { ParsedRecommendation } from "@/lib/parse-recommendations";
import { useGeolocation } from "@/hooks/use-geolocation";

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

  // Get user's current location using geolocation hook
  const { latitude, longitude, error: locationError, loading: locationLoading } = useGeolocation();

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

    // Build Google Maps URL with directions
    // If user's location is available, use it as origin (Point A)
    // Destination (Point B) is the tourist attraction
    const destination = encodeURIComponent(`${recommendation.name} ${location}`);

    let mapsUrl;
    if (latitude && longitude) {
      // User's location is available - show directions from current location to destination
      // Format: https://www.google.com/maps/dir/?api=1&origin=LAT,LNG&destination=DESTINATION
      mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${destination}&travelmode=driving`;
    } else {
      // User's location not available - fallback to search
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${destination}`;
    }

    window.open(mapsUrl, "_blank");
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
      className="my-3 rounded-xl border-2 border-primary/20 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-slate-800 dark:via-blue-900/10 dark:to-purple-900/10 p-5 shadow-lg shadow-primary/10 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:scale-[1.02]"
    >
      <div className="flex items-start gap-3">
        <div className="text-5xl bg-gradient-to-br from-primary/20 to-secondary/20 p-2 rounded-xl">{icon}</div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{recommendation.name}</h3>
            <span className={`text-base font-bold whitespace-nowrap ${getPriceColor(recommendation.price)}`}>
              {recommendation.price}
            </span>
          </div>

          {/* Rating, Hours, Address - Compact info row */}
          <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
            {recommendation.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{recommendation.rating}</span>
              </div>
            )}
            {recommendation.hours && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{recommendation.hours}</span>
              </div>
            )}
            {recommendation.address && (
              <div className="flex items-center gap-1">
                <MapPinned className="h-4 w-4" />
                <span>{recommendation.address}</span>
              </div>
            )}
          </div>

          {/* Best For tags */}
          {recommendation.bestFor && (
            <div className="mt-2 flex items-center gap-1.5">
              <Users className="h-4 w-4 text-primary" />
              <div className="flex flex-wrap gap-1">
                {recommendation.bestFor.split(',').map((tag, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 px-2.5 py-1 text-sm font-semibold text-primary border border-primary/30"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          <p className="mt-3 text-base text-foreground leading-relaxed">
            {recommendation.description}
          </p>

          {/* Tips section - expandable */}
          {recommendation.tips && (
            <div className="mt-3">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex w-full items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2.5 text-left text-base transition-colors hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-950/50"
              >
                <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                <span className="flex-1 font-semibold text-amber-900 dark:text-amber-200">
                  Insider Tips
                </span>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-amber-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-amber-600" />
                )}
              </button>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="mt-2 rounded-lg border border-amber-200 bg-amber-50/50 px-4 py-3 text-base text-amber-900 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-200 leading-relaxed"
                >
                  {recommendation.tips}
                </motion.div>
              )}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving || isTracking}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                isSaved
                  ? "border-2 border-primary bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-105"
                  : "border-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50"
              }`}
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : isSaved ? "Saved" : "Save"}
            </button>

            <button
              onClick={handleDirections}
              disabled={isTracking}
              className="flex items-center gap-2 rounded-lg border-2 border-accent/30 px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:bg-accent/10 hover:border-accent/50 hover:scale-105 relative group"
              title={
                latitude && longitude
                  ? "Get directions from your current location"
                  : locationLoading
                  ? "Getting your location..."
                  : locationError
                  ? "Location unavailable - will search on map"
                  : "Get directions"
              }
            >
              {latitude && longitude ? (
                <Navigation className="h-4 w-4" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
              Directions
              {latitude && longitude && (
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-slate-800 animate-pulse" />
              )}
            </button>

            <button
              onClick={handleMoreInfo}
              disabled={isTracking}
              className="flex items-center gap-2 rounded-lg border-2 border-secondary/30 px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:bg-secondary/10 hover:border-secondary/50 hover:scale-105"
            >
              <Info className="h-4 w-4" />
              More Info
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
