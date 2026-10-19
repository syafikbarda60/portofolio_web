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
import { IndexRail } from "@/components/IndexRail";
import { StoryField } from "@/components/three/StoryField";
import { Splash } from "@/components/Splash";
import { getProjects } from "@/lib/projectStore";

export default async function Home() {
  const projects = await getProjects();

  return (
    <Sparks>
      <Ambient />
      <Navbar />
      <IndexRail />

      {/* One cloud that travels the whole page, changing shape per chapter.
          Outside <main> so it can rise above the splash while that plays. */}
      <StoryField />
      <Splash />

      <main id="main" className="relative z-10">
        <HeroSection />
        {/* Everything after the cover reads in the column right of the
            index rail (lg and up; w-52 on the rail, pl-52 here). */}
        <div className="lg:pl-52">
          <StackStrip />
          <ProjectsSection projects={projects} />
          <Approach projects={projects} />
          <Capabilities />
          <ExperienceSection />
          <SkillsSection />
          <ContactSection />
        </div>
      </main>

      <div className="relative z-10 lg:pl-52">
        <Footer />
      </div>
    </Sparks>
  );
}
