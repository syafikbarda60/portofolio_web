/**
 * Server-side project data store.
 *
 * Projects live in two layers:
 *   1. portfolioData.ts  — the original static snapshot (never written at runtime)
 *   2. projects-override.json — admin edits; takes precedence when present
 *
 * getProjects()  → merged list (override wins per-id)
 * saveProjects() → writes the full list to the JSON file
 */

import fs from "fs/promises";
import path from "path";
import { PROJECTS as STATIC_PROJECTS, type ProjectItem } from "@/data/portfolioData";

const OVERRIDE_PATH = path.join(process.cwd(), "src", "data", "projects-override.json");

export async function getProjects(): Promise<ProjectItem[]> {
  try {
    const raw = await fs.readFile(OVERRIDE_PATH, "utf-8");
    const overrides: ProjectItem[] = JSON.parse(raw);
    return overrides;
  } catch {
    // File doesn't exist yet — fall back to static data
    return STATIC_PROJECTS;
  }
}

export async function saveProjects(projects: ProjectItem[]): Promise<void> {
  await fs.writeFile(OVERRIDE_PATH, JSON.stringify(projects, null, 2), "utf-8");
}
