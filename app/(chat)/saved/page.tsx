"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, MapPin, Clock, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SavedRecommendation {
  id: string;
  recommendationName: string;
  category: string;
  location: string;
  description?: string;
  price?: string;
  rating?: string;
  hours?: string;
  address?: string;
  bestFor?: string;
  tips?: string;
  savedAt: string;
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

export default function SavedPage() {
  const [savedRecommendations, setSavedRecommendations] = useState<SavedRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedRecommendations();
  }, []);

  const fetchSavedRecommendations = async () => {
    try {
      const response = await fetch("/api/saved-recommendations");
      if (response.ok) {
        const data = await response.json();
        setSavedRecommendations(data.savedRecommendations);
      }
    } catch (error) {
      console.error("Error fetching saved recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsave = async (recommendation: SavedRecommendation) => {
    setDeletingId(recommendation.id);
    try {
      const response = await fetch(
        `/api/unsave-recommendation?name=${encodeURIComponent(recommendation.recommendationName)}&location=${encodeURIComponent(recommendation.location)}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setSavedRecommendations(prev =>
          prev.filter(item => item.id !== recommendation.id)
        );
      }
    } catch (error) {
      console.error("Error unsaving recommendation:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDirections = (address: string) => {
    const query = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading saved recommendations...</div>
      </div>
    );
  }

  if (savedRecommendations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Save className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No saved recommendations</h3>
        <p className="text-muted-foreground">
          Start exploring and save recommendations you like!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Saved Recommendations</h1>
        <p className="text-muted-foreground">
          {savedRecommendations.length} saved recommendation{savedRecommendations.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-4">
        {savedRecommendations.map((recommendation) => {
          const icon = categoryIcons[recommendation.category] || "📍";
          const priceColor = getPriceColor(recommendation.price || "");

          return (
            <motion.div
              key={recommendation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{icon}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-lg">{recommendation.recommendationName}</h3>
                      <div className="flex items-center gap-2">
                        {recommendation.price && (
                          <span className={`text-sm font-medium ${priceColor}`}>
                            {recommendation.price}
                          </span>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUnsave(recommendation)}
                          disabled={deletingId === recommendation.id}
                        >
                          <Trash2 className="h-4 w-4" />
                          {deletingId === recommendation.id ? "Removing..." : "Remove"}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {recommendation.location}
                      </div>
                      {recommendation.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5" />
                          {recommendation.rating}
                        </div>
                      )}
                      {recommendation.hours && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {recommendation.hours}
                        </div>
                      )}
                    </div>

                    {recommendation.description && (
                      <p className="mt-2 text-sm text-foreground">
                        {recommendation.description}
                      </p>
                    )}

                    {recommendation.bestFor && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {recommendation.bestFor.split(',').map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {recommendation.address && (
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDirections(recommendation.address!)}
                        >
                          <MapPin className="h-4 w-4 mr-1" />
                          Get Directions
                        </Button>
                      </div>
                    )}

                    <div className="mt-2 text-xs text-muted-foreground">
                      Saved on {new Date(recommendation.savedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
