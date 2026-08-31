import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Ambient } from "@/components/ui/Ambient";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Sparks } from "@/components/ui/Sparks";
import { ProjectDetail } from "@/components/ProjectDetail";
import { PROJECTS } from "@/data/portfolioData";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ id: project.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = PROJECTS.find((p) => p.id === id);
  if (!project) return {};

  const title = `${project.title} — ${project.subtitle}`;
  return {
    title: `${project.title} | Syafik Barda`,
    description: project.description,
    openGraph: { title, description: project.description, type: "article" },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const index = PROJECTS.findIndex((p) => p.id === id);
  if (index === -1) notFound();

  // Wrap around, so neither end of the list is a dead stop.
  const prev = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(index + 1) % PROJECTS.length];

  return (
    <Sparks>
      <Ambient />
      <Navbar />

      <main id="main" className="relative z-10">
        <ProjectDetail project={PROJECTS[index]} prev={prev} next={next} />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </Sparks>
  );
}
