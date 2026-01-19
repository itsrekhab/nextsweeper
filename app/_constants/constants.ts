export const locales = ["en", "ru"] as const;

export type Locale = (typeof locales)[number];

export const difficultyModes = [
  {
    id: 1,
    locale_code: "beginner",
    params: {
      width: 9,
      height: 9,
      mines: 10,
    },
  },
  {
    id: 2,
    locale_code: "intermediate",
    params: {
      width: 16,
      height: 16,
      mines: 40,
    },
  },
  {
    id: 3,
    locale_code: "expert",
    params: {
      width: 30,
      height: 16,
      mines: 99,
    },
  },
] as const;

export type DifficultyId = (typeof difficultyModes)[number]["id"];

export type DifficultyLocaleCode =
  (typeof difficultyModes)[number]["locale_code"];
