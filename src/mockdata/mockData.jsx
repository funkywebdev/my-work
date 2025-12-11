// mockData.js
import Clip from "../assets/images/Clip.png";
import medal from "../assets/images/medal.png";
import medal2 from "../assets/images/medal2.png";
import Vector from "../assets/images/Vector.png";
import stream from "../assets/images/stream.png";

// Top 3 leaderboard cards
export const leaderboardCards = [
  { img: Clip, name: "Queen & King School", points: 1900 },
  { img: medal, name: "Top Scholars Academy", points: 3000 },
  { img: medal2, name: "Bright Future School", points: 1850 },
];

// Tabs for leaderboard categories
export const leaderboardTabs = [
  "All Time",
  "Weekly",
  "Monthly",
  "Current Session",
  "School Ranks",
  "Rank by ID",
];

// Detailed leaderboard list with categories
export const detailedLeaderboard = [
  { rank: 1, school: "Aro Odo Grammar School", points: 2845, color: "#F29700", category: "All Time" },
  { rank: 2, school: "Anglican Comprehensive High School", points: 2780, color: "#A8B6CA", category: "Weekly" },
  { rank: 3, school: "Sundest Progressive College", points: 2705, color: "#A73A00", category: "Monthly" },
  { rank: 4, school: "Kings College, Lagos", points: 2650, color: "#0077B6", category: "Current Session" },
  { rank: 5, school: "Bright Future Academy", points: 2600, color: "#FF6B6B", category: "School Ranks" },
  { rank: 6, school: "St. Mary's Academy, Ibadan", points: 2555, color: "#6A0572", category: "Rank by ID" },
  { rank: 7, school: "Hilltop International School, Lagos", points: 2500, color: "#008080", category: "All Time" },
  { rank: 8, school: "Greenfield College, Ibadan", points: 2450, color: "#FFA500", category: "Weekly" },
  { rank: 9, school: "Royal College, Lagos", points: 2400, color: "#800080", category: "Monthly" },
  { rank: 10, school: "Future Leaders Academy, Abuja", points: 2350, color: "#00BFFF", category: "School Ranks" },
];

// Icons
export const leaderboardIcons = { Vector, stream };
