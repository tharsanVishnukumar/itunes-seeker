export const colors = {
  background: "#FFFFFF",
  surface: "#F5F5F7",
  surfaceAlt: "#FAFAFC",
  text: "#1C1C1E",
  textMuted: "#6E6E73",
  textInverse: "#FFFFFF",
  accent: "#FA243C",
  accentMuted: "#FFD8DE",
  star: "#FFB400",
  starInactive: "#D1D1D6",
  border: "#E5E5EA",
  error: "#D70015",
  overlay: "rgba(0, 0, 0, 0.4)",
} as const;

export type AppColor = keyof typeof colors;
