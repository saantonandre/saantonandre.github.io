import { CSSProperties } from "preact/compat";

export const theme = {
  fonts: {
    main: "'Lucida Grande', monospace",
  },
  colors: {
    background: "#000000",
    contrast: "#ffffff",
    "contrast-low": "#616270",
    primary: "#1D2126",
    secondary: "#17191c",
    accent: "#2d3c4f",
    success: "",
  },
  radius: "6px",
  spacing: {
    sm: 3,
    md: 6,
    lg: 9,
  },
} as const;

export const containerStyle: CSSProperties = {
  backgroundColor: theme.colors.background,
  borderRadius: theme.radius,
  display: "flex",
  alignItems: "center",
  border: `2px solid ${theme.colors["contrast-low"]}`,
  outline: `1px solid ${theme.colors.background}`,
  gap: theme.spacing.md,
  padding: theme.spacing.sm,
  fontFamily: theme.fonts.main,
  color: theme.colors.contrast,
  fontSize: 16,
} as const;
