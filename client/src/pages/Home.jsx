import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
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
import { ChatWidget } from '@/components/chat/ChatWidget';
import { InquiryProvider } from '@/context/InquiryContext';

// Each section has its own boundary so one failure can't blank the page.
const sections = [Hero, Trust, About, TechSkills, Services, Projects, WhyMe, Process, AiExpertise, AiAutomation, Testimonials, Faq, Contact];

export default function Home() {
  return (
    <InquiryProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-ink-900"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        {sections.map((Section, i) => (
          <ErrorBoundary key={i} fallback={null}>
            <Section />
          </ErrorBoundary>
        ))}
      </main>
      <Footer />
      <ErrorBoundary fallback={null}>
        <ChatWidget />
      </ErrorBoundary>
    </InquiryProvider>
  );
}
