import { Ambient } from "@/components/ui/Ambient";
import { Sparks } from "@/components/ui/Sparks";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { StackStrip } from "@/components/StackStrip";
import { ProjectsSection } from "@/components/ProjectsSection";
import { Approach } from "@/components/Approach";
import { Capabilities } from "@/components/Capabilities";
import { ExperienceSection } from "@/components/ExperienceSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { getProjects } from "@/lib/projectStore";

export default async function Home() {
  const projects = await getProjects();

  return (
    <Sparks>
      <Ambient />
      <Navbar />

      <main id="main" className="relative z-10">
        <HeroSection />
        <StackStrip />
        <ProjectsSection projects={projects} />
        <Approach projects={projects} />
        <Capabilities />
        <ExperienceSection />
        <SkillsSection />
        <ContactSection />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </Sparks>
  );
}
