import type { Category, CreatorSearchSort, Gender, Platform } from "@/types/domain";

export const PLATFORM_OPTIONS: { value: Platform; label: string }[] = [
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter" }
];

export const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: "fashion", label: "Fashion" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "tech", label: "Tech" },
  { value: "finance", label: "Finance" },
  { value: "gaming", label: "Gaming" },
  { value: "comedy", label: "Comedy" },
  { value: "education", label: "Education" },
  { value: "fitness", label: "Fitness" },
  { value: "beauty", label: "Beauty" },
  { value: "travel", label: "Travel" },
  { value: "food", label: "Food" }
];

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "non_binary", label: "Non-binary" },
  { value: "unspecified", label: "Unspecified" }
];

export const FOLLOWER_OPTIONS = [
  { value: 1_000, label: "1k+" },
  { value: 10_000, label: "10k+" },
  { value: 50_000, label: "50k+" },
  { value: 100_000, label: "100k+" },
  { value: 500_000, label: "500k+" },
  { value: 1_000_000, label: "1M+" }
] as const;

export const SORT_OPTIONS: { value: CreatorSearchSort; label: string }[] = [
  { value: "followers", label: "Followers" },
  { value: "engagement", label: "Highest engagement" },
  { value: "popularity", label: "Popularity" },
  { value: "newest", label: "Newest" },
  { value: "alphabetical", label: "Alphabetical" }
];

export const LANGUAGE_OPTIONS = ["English", "Hindi", "Spanish", "French", "German"] as const;
