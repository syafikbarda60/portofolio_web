import { PROJECTS, type ProjectItem } from "@/data/portfolioData";

/**
 * Media for a project.
 *
 * `shots` in portfolioData lists screenshots captured from the project actually
 * running on this machine. A project with no entry falls back to a neutral
 * placeholder — never to a mocked-up image, which would present invented
 * screens and metrics as if they were real work.
 */
const PLACEHOLDER_COUNT = 4;

const placeholder = (id: string, i: number) =>
  `https://picsum.photos/seed/work-${id}-${i}/900/1200`;

export function getProjectCover(id: string, width = 900, height = 640): string {
  const shots = PROJECTS.find((p) => p.id === id)?.shots;
  return shots?.[0] ?? `https://picsum.photos/seed/work-${id}/${width}/${height}`;
}

export function getProjectGallery(project: ProjectItem) {
  const srcs =
    project.shots?.length
      ? project.shots
      : Array.from({ length: PLACEHOLDER_COUNT }, (_, i) =>
          placeholder(project.id, i + 1)
        );

  return srcs.map((image, i) => ({
    image,
    label: String(i + 1).padStart(2, "0"),
    alt: `${project.title}, screen ${i + 1} of ${srcs.length}`,
  }));
}
