import localFont from "next/font/local";

// Self-hosted so the build never has to reach Google Fonts.
// One family for display and text: Archivo's width axis carries the
// hierarchy (wider for headlines), so there is no second face to pair.
export const archivo = localFont({
  src: "./Archivo-Variable.woff2",
  weight: "100 900",
  variable: "--font-archivo",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
});

export const plexMono = localFont({
  src: [
    { path: "./IBMPlexMono-400.woff2", weight: "400" },
    { path: "./IBMPlexMono-500.woff2", weight: "500" },
  ],
  variable: "--font-plex-mono",
  display: "swap",
});
