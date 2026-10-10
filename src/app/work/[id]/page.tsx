import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Ambient } from "@/components/ui/Ambient";
import { Sparks } from "@/components/ui/Sparks";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProjectDetail } from "@/components/ProjectDetail";
import { PROJECTS } from "@/data/portfolioData";
import { getProjects } from "@/lib/projectStore";

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

  const title = `${project.title}: ${project.subtitle}`;
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
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) notFound();

  // Wrap around, so neither end of the list is a dead stop.
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <Sparks>
      <Ambient />
      <Navbar />

      <main id="main" className="relative z-10">
        <ProjectDetail project={projects[index]} prev={prev} next={next} />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </Sparks>
  );
}
