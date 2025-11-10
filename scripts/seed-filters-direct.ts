import postgres from "postgres";

// Get database URL from environment
const databaseUrl = process.env.POSTGRES_URL;

if (!databaseUrl) {
  console.error("❌ POSTGRES_URL environment variable is not set");
  process.exit(1);
}

const sql = postgres(databaseUrl);

const defaultFilters = [
  {
    label: "Family-friendly",
    icon: "👨‍👩‍👧‍👦",
    value: "family",
    orderIndex: 1,
    isActive: true,
  },
  {
    label: "Romantic",
    icon: "💑",
    value: "romantic",
    orderIndex: 2,
    isActive: true,
  },
  {
    label: "Adventure",
    icon: "🏔️",
    value: "adventure",
    orderIndex: 3,
    isActive: true,
  },
  {
    label: "Budget-friendly",
    icon: "💰",
    value: "budget",
    orderIndex: 4,
    isActive: true,
  },
  {
    label: "Luxury",
    icon: "✨",
    value: "luxury",
    orderIndex: 5,
    isActive: true,
  },
  {
    label: "Cultural",
    icon: "🎭",
    value: "cultural",
    orderIndex: 6,
    isActive: true,
  },
  {
    label: "Nature & Wildlife",
    icon: "🦁",
    value: "nature",
    orderIndex: 7,
    isActive: true,
  },
  {
    label: "Nightlife",
    icon: "🌃",
    value: "nightlife",
    orderIndex: 8,
    isActive: true,
  },
  {
    label: "Shopping",
    icon: "🛍️",
    value: "shopping",
    orderIndex: 9,
    isActive: true,
  },
  {
    label: "Food & Dining",
    icon: "🍽️",
    value: "food",
    orderIndex: 10,
    isActive: true,
  },
];

async function seedFilters() {
  console.log("🌱 Seeding preference filters...");

  try {
    // Check if filters already exist
    const existing = await sql`
      SELECT * FROM "PreferenceFilter" LIMIT 1
    `;

    if (existing.length > 0) {
      console.log("✅ Filters already exist. Skipping seed.");
      await sql.end();
      return;
    }

    // Insert default filters
    for (const filter of defaultFilters) {
      await sql`
        INSERT INTO "PreferenceFilter" (label, icon, value, "orderIndex", "isActive")
        VALUES (${filter.label}, ${filter.icon}, ${filter.value}, ${filter.orderIndex}, ${filter.isActive})
      `;
    }

    console.log(`✅ Successfully seeded ${defaultFilters.length} filters!`);
  } catch (error) {
    console.error("❌ Error seeding filters:", error);
    throw error;
  } finally {
    await sql.end();
  }
}

// Run the seed
seedFilters()
  .then(() => {
    console.log("🎉 Seed complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Seed failed:", error);
    process.exit(1);
  });
