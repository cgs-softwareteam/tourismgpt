import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { preferenceFilter } from "./schema";

config({
  path: ".env.local",
});

const initialFilters = [
  {
    label: "Family-Friendly",
    icon: "👨‍👩‍👧‍👦",
    value: "family",
    orderIndex: 1,
    isActive: true,
  },
  {
    label: "Luxury",
    icon: "💎",
    value: "luxury",
    orderIndex: 2,
    isActive: true,
  },
  {
    label: "Budget",
    icon: "💰",
    value: "budget",
    orderIndex: 3,
    isActive: true,
  },
  {
    label: "Adventure",
    icon: "🏔️",
    value: "adventure",
    orderIndex: 4,
    isActive: true,
  },
  {
    label: "Culture & History",
    icon: "🏛️",
    value: "culture",
    orderIndex: 5,
    isActive: true,
  },
  {
    label: "Food & Dining",
    icon: "🍽️",
    value: "food",
    orderIndex: 6,
    isActive: true,
  },
  {
    label: "Nature & Parks",
    icon: "🌳",
    value: "nature",
    orderIndex: 7,
    isActive: true,
  },
  {
    label: "Nightlife",
    icon: "🎭",
    value: "nightlife",
    orderIndex: 8,
    isActive: true,
  },
  {
    label: "Eco-Tourism",
    icon: "🌱",
    value: "eco",
    orderIndex: 9,
    isActive: true,
  },
];

async function seed() {
  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL environment variable is not set");
  }

  const client = postgres(process.env.POSTGRES_URL);
  const db = drizzle(client);

  try {
    console.log("🌱 Seeding preference filters...");

    for (const filter of initialFilters) {
      await db
        .insert(preferenceFilter)
        .values(filter)
        .onConflictDoNothing({ target: preferenceFilter.value });
    }

    console.log("✅ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding filters:", error);
    throw error;
  } finally {
    await client.end();
  }
}

seed();
