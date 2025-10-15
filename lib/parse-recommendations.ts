export interface ParsedRecommendation {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  rating?: string;
  hours?: string;
  address?: string;
  bestFor?: string;
  tips?: string;
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
    /\*\*\[RECOMMENDATION:([^\]]+)\]\*\*\s*([\s\S]*?)\*\*\[\/RECOMMENDATION\]\*\*/g;

  const recommendations: ParsedRecommendation[] = [];
  const matches: Array<{ match: RegExpMatchArray; index: number }> = [];

  let match;
  while ((match = recommendationRegex.exec(text)) !== null) {
    const category = match[1].trim();
    const content = match[2].trim();

    // Extract fields using individual regex patterns
    const nameMatch = content.match(/Name:\s*(.+?)(?:\n|$)/);
    const descMatch = content.match(/Description:\s*(.+?)(?=\n\w+:|$)/s);
    const priceMatch = content.match(/Price:\s*(.+?)(?:\n|$)/);
    const ratingMatch = content.match(/Rating:\s*(.+?)(?:\n|$)/);
    const hoursMatch = content.match(/Hours:\s*(.+?)(?:\n|$)/);
    const addressMatch = content.match(/Address:\s*(.+?)(?:\n|$)/);
    const bestForMatch = content.match(/BestFor:\s*(.+?)(?:\n|$)/);
    const tipsMatch = content.match(/Tips:\s*(.+?)(?=\n\w+:|$)/s);

    recommendations.push({
      id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      category,
      name: nameMatch ? nameMatch[1].trim() : 'Unknown',
      description: descMatch ? descMatch[1].trim() : '',
      price: priceMatch ? priceMatch[1].trim() : '',
      rating: ratingMatch ? ratingMatch[1].trim() : undefined,
      hours: hoursMatch ? hoursMatch[1].trim() : undefined,
      address: addressMatch ? addressMatch[1].trim() : undefined,
      bestFor: bestForMatch ? bestForMatch[1].trim() : undefined,
      tips: tipsMatch ? tipsMatch[1].trim() : undefined,
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
