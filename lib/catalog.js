export const SERVER_CATALOG = {
  instagram_followers: {
    smmServiceId: process.env.SMM_SERVICE_IG_FOLLOWERS || "101",
    prices: { 100: 25, 200: 43, 500: 89, 1000: 160, 2000: 295, 3000: 485, 5000: 795, 10000: 1389 },
  },
  instagram_indian: {
    smmServiceId: process.env.SMM_SERVICE_IG_INDIAN || "102",
    prices: { 100: 40, 200: 65, 500: 145, 1000: 250, 2000: 400, 3000: 589, 5000: 984, 10000: 1899 },
  },
  instagram_hq: {
    smmServiceId: process.env.SMM_SERVICE_IG_HQ || "103",
    prices: { 200: 98, 300: 145, 500: 245, 1000: 489, 2000: 989 },
  },
  instagram_reels: {
    smmServiceId: process.env.SMM_SERVICE_IG_REELS || "104",
    prices: { 1000: 10, 2000: 15, 5000: 28, 10000: 40 },
  },
  instagram_shares: {
    smmServiceId: process.env.SMM_SERVICE_IG_SHARES || "105",
    prices: { 1000: 20, 2000: 35, 5000: 60, 10000: 100, 20000: 150, 50000: 250 },
  },
  instagram_saves: {
    smmServiceId: process.env.SMM_SERVICE_IG_SAVES || "106",
    prices: { 1000: 25, 2000: 45, 5000: 99, 10000: 179, 20000: 329, 50000: 740 },
  },
  instagram_reposts: {
    smmServiceId: process.env.SMM_SERVICE_IG_REPOSTS || "107",
    prices: { 100: 25, 200: 45, 300: 65, 500: 98, 1000: 189, 2000: 385 },
  },
  instagram_comment_likes: {
    smmServiceId: process.env.SMM_SERVICE_IG_COMMENT_LIKES || "108",
    prices: { 200: 26, 500: 48, 1000: 96 },
  },
  facebook: {
    smmServiceId: process.env.SMM_SERVICE_FB || "201",
    prices: { 500: 99, 1000: 179, 2000: 329 },
  },
  youtube: {
    smmServiceId: process.env.SMM_SERVICE_YT || "301",
    prices: { 500: 120, 1000: 210, 5000: 890 },
  },
};
