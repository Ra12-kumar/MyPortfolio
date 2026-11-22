/**
 * Route pages. Each page composes the EXISTING, unchanged section
 * components with the new page header, 3D elements and page navigation.
 */
import { pageFor } from '../routes';
import { usePageMeta } from '../usePageMeta';
import { PageHeader } from '../components/PageHeader';
import { PageNav } from '../components/PageNav';
import { CtaBand } from '../components/CtaBand';
import { SystemsShowcase } from '../components/SystemsShowcase';
import { ExploreGrid } from '../components/ExploreGrid';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { Hero } from '@/components/sections/Hero';
import { Trust } from '@/components/sections/Trust';
import { About } from '@/components/sections/About';
import { Services } from '@/components/sections/Services';
import { Projects } from '@/components/sections/Projects';
import { WhyMe } from '@/components/sections/WhyMe';
import { Process } from '@/components/sections/Process';
import { AiAutomation } from '@/components/sections/AiAutomation';
import { AiExpertise } from '@/components/sections/AiExpertise';
import { TechSkills } from '@/components/sections/TechSkills';
import { Testimonials } from '@/components/sections/Testimonials';
import { Faq } from '@/components/sections/Faq';
import { Contact } from '@/components/sections/Contact';

function Page({ path, sections, header = true, cta = true }) {
  const page = pageFor(path);
  usePageMeta(page);
  return (
    <>
      {header && <PageHeader page={page} />}
      {sections.map((Section, i) => (
        <ErrorBoundary key={i} fallback={null}>
          <Section />
        </ErrorBoundary>
      ))}
      {cta && <CtaBand />}
      <PageNav />
    </>
  );
}

export const HomePage = () => <Page path="/" header={false} sections={[Hero, SystemsShowcase, Trust, ExploreGrid]} />;
export const AboutPage = () => <Page path="/about" sections={[About, TechSkills, AiExpertise, WhyMe]} />;
export const ServicesPage = () => <Page path="/services" sections={[Services, AiAutomation]} />;
export const ProjectsPage = () => <Page path="/projects" sections={[Projects]} />;
export const ProcessPage = () => <Page path="/process" sections={[Process, WhyMe]} />;
export const TestimonialsPage = () => <Page path="/testimonials" sections={[Testimonials]} />;
export const ContactPage = () => <Page path="/contact" sections={[Contact, Faq]} cta={false} />;
