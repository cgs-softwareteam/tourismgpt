"use client";

import { memo, useEffect, useState } from "react";
import type { UseChatHelpers } from "@ai-sdk/react";
import { motion } from "framer-motion";
import type { ChatMessage } from "@/lib/types";
import type { PreferenceFilter } from "@/lib/db/schema";

type PreferenceFiltersProps = {
  chatId: string;
  location: string;
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
};

function PurePreferenceFilters({
  chatId,
  location,
  sendMessage,
}: PreferenceFiltersProps) {
  const [filters, setFilters] = useState<PreferenceFilter[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/filters")
      .then((res) => res.json())
      .then((data) => {
        setFilters(data.filters || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching filters:", error);
        setIsLoading(false);
      });
  }, []);

  const toggleFilter = (filterValue: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterValue)
        ? prev.filter((f) => f !== filterValue)
        : [...prev, filterValue]
    );
  };

  const handleSubmit = () => {
    if (selectedFilters.length === 0) {
      // No filters selected, just ask for general recommendations
      window.history.replaceState({}, "", `/chat/${chatId}`);
      sendMessage({
        role: "user",
        parts: [
          {
            type: "text",
            text: `Show me top recommendations in ${location}`,
          },
        ],
      });
      return;
    }

    // Build message with selected filters
    const filterLabels = selectedFilters
      .map((value) => {
        const filter = filters.find((f) => f.value === value);
        return filter?.label.toLowerCase();
      })
      .filter(Boolean)
      .join(", ");

    window.history.replaceState({}, "", `/chat/${chatId}`);
    sendMessage({
      role: "user",
      parts: [
        {
          type: "text",
          text: `Show me ${filterLabels} recommendations in ${location}`,
        },
      ],
    });
  };

  const suggestions = [
    `Top attractions in ${location}`,
    `Best restaurants in ${location}`,
    `Hidden gems in ${location}`,
    `Things to do in ${location}`,
  ];

  const handleSuggestionClick = (suggestion: string) => {
    window.history.replaceState({}, "", `/chat/${chatId}`);
    sendMessage({
      role: "user",
      parts: [{ type: "text", text: suggestion }],
    });
  };

  if (isLoading) {
    return (
      <div className="my-4">
        <p className="text-sm text-muted-foreground">Loading filters...</p>
      </div>
    );
  }

  return (
    <div className="my-4">
      <p className="mb-3 text-sm font-medium text-muted-foreground">
        What interests you in {location}?
      </p>
      <div className="grid gap-2 sm:grid-cols-3">
        {filters.map((filter, index) => {
          const isSelected = selectedFilters.includes(filter.value);
          return (
            <motion.button
              key={filter.value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              onClick={() => toggleFilter(filter.value)}
              className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                isSelected
                  ? "border-primary bg-primary/10 font-medium"
                  : "bg-background hover:bg-muted hover:border-primary"
              }`}
            >
              <span className="text-xl">{filter.icon}</span>
              <span>{filter.label}</span>
              {isSelected && <span className="ml-auto text-primary">✓</span>}
            </motion.button>
          );
        })}
      </div>

      {selectedFilters.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <p className="text-xs text-muted-foreground mb-2">
            Selected: {selectedFilters.length} filter(s)
          </p>
        </motion.div>
      )}

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={handleSubmit}
        className="mt-4 w-full rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {selectedFilters.length > 0
          ? "Show Recommendations"
          : "Skip & Show All"}
      </motion.button>

      <div className="mt-6">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          Or try asking:
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={suggestion}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + 0.05 * index }}
              onClick={() => handleSuggestionClick(suggestion)}
              className="rounded-lg border border-dashed bg-background/50 px-3 py-2 text-left text-xs transition-colors hover:bg-muted hover:border-primary"
            >
              {suggestion}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

export const PreferenceFilters = memo(PurePreferenceFilters);
