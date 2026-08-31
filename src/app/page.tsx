import { Ambient } from "@/components/ui/Ambient";
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
import { Sparks } from "@/components/ui/Sparks";

export default function Home() {
  return (
    <Sparks>
      <Ambient />
      <Navbar />

      <main id="main" className="relative z-10">
        <HeroSection />
        <StackStrip />
        <ProjectsSection />
        <Approach />
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
