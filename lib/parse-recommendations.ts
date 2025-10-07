export interface ParsedRecommendation {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
}

export interface ParsedContent {
  hasRecommendations: boolean;
  sections: Array<{
    type: "text" | "recommendation";
    content: string | ParsedRecommendation;
  }>;
}

export function parseRecommendations(text: string): ParsedContent {
  const recommendationRegex =
    /\*\*\[RECOMMENDATION:(\w+)\]\*\*\s*Name:\s*(.+?)\s*Description:\s*(.+?)\s*Price:\s*(.+?)\s*\*\*\[\/RECOMMENDATION\]\*\*/gs;

  const recommendations: ParsedRecommendation[] = [];
  const matches: Array<{ match: RegExpMatchArray; index: number }> = [];

  let match;
  while ((match = recommendationRegex.exec(text)) !== null) {
    recommendations.push({
      id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      category: match[1].trim(),
      name: match[2].trim(),
      description: match[3].trim(),
      price: match[4].trim(),
    });
    matches.push({ match, index: match.index });
  }

  if (recommendations.length === 0) {
    return {
      hasRecommendations: false,
      sections: [{ type: "text", content: text }],
    };
  }

  // Split text into sections (text and recommendations)
  const sections: ParsedContent["sections"] = [];
  let lastIndex = 0;

  matches.forEach((matchData, idx) => {
    const { match, index } = matchData;

    // Add text before this recommendation
    if (index > lastIndex) {
      const textBefore = text.substring(lastIndex, index).trim();
      if (textBefore) {
        sections.push({ type: "text", content: textBefore });
      }
    }

    // Add recommendation
    sections.push({ type: "recommendation", content: recommendations[idx] });

    lastIndex = index + match[0].length;
  });

  // Add remaining text after last recommendation
  if (lastIndex < text.length) {
    const textAfter = text.substring(lastIndex).trim();
    if (textAfter) {
      sections.push({ type: "text", content: textAfter });
    }
  }

  return {
    hasRecommendations: true,
    sections,
  };
}
