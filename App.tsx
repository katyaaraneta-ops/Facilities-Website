import React, { useState } from 'react';
import { Section, SectionTitle } from './components/Section';
import { Plus, Minus } from 'lucide-react';
import { WhyItem, OperationStep, FAQItem } from './types';

// --- Data Definitions ---

const whyItems: WhyItem[] = [
  { title: "Historical Continuity", description: "—" },
  { title: "Operational Discipline", description: "—" },
  { title: "Financial Transparency", description: "—" },
  { title: "Clear Responsibility", description: "—" },
  { title: "Regulatory Compliance", description: "—" },
  { title: "Vendor Coordination", description: "—" },
];

const operations: OperationStep[] = [
  { step: "01", title: "Scope Definition", description: "" },
  { step: "02", title: "Vendor Qualification", description: "" },
  { step: "03", title: "Maintenance Execution", description: "" },
  { step: "04", title: "Compliance Review", description: "" },
  { step: "05", title: "Reporting Cycle", description: "" },
];

// Note: Assets are now handled directly in the component to strictly enforce layout rules

const faqs: FAQItem[] = [
  { question: "What is the scope of unit-level management?", answer: "—" },
  { question: "How are vendor payments processed?", answer: "—" },
  { question: "What represents a standard reporting period?", answer: "—" },
  { question: "Do you manage common areas or building structures?", answer: "—" },
  { question: "What are the requirements for vendor accreditation?", answer: "—" },
  { question: "How are emergency repairs handled?", answer: "—" },
  { question: "Is there an escalation matrix for tenants?", answer: "—" },
  { question: "What is the protocol for lease renewals?", answer: "—" },
  { question: "How are utility sub-meter readings verified?", answer: "—" },
];

// --- Components ---

const Header: React.FC = () => (
  <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-corporate-200 z-50">
    <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
      <div className="font-serif text-xl md:text-2xl text-corporate-900 font-semibold tracking-tight">
        Facilities, Incorporated
      </div>
      
      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center space-x-10 text-base text-corporate-700 font-medium">
        <a href="#why-us" className="hover:text-corporate-900 transition-colors">Why Facilities</a>
        <a href="#operations" className="hover:text-corporate-900 transition-colors">How We Operate</a>
        <a href="#assets" className="hover:text-corporate-900 transition-colors">Assets</a>
        <a href="#faq" className="hover:text-corporate-900 transition-colors">FAQ</a>
        <a href="#contact" className="hover:text-corporate-900 transition-colors">Contact</a>
      </nav>

      {/* Mobile Nav Link */}
      <a href="#contact" className="md:hidden text-base text-corporate-900 font-medium">
        Contact
      </a>
    </div>
  </header>
);

const Hero: React.FC = () => (
  <section className="min-h-[75vh] flex flex-col justify-center px-6 bg-corporate-50 border-b border-corporate-200">
    <div className="max-w-[840px] mx-auto w-full py-24 md:py-32">
      <div className="space-y-12 md:space-y-16">
        <div className="space-y-6">
          <h1 className="font-serif text-5xl md:text-6xl text-corporate-900 leading-[1.1] tracking-tight">
            Facilities, Incorporated
          </h1>
          <p className="text-xl md:text-2xl text-corporate-600 font-normal">
            Commercial property operations and asset management
          </p>
          {/* Structural Anchor Line - Blue element to anchor the hero visually */}
          <div className="w-14 h-px bg-corporate-600" aria-hidden="true"></div>
        </div>

        <div className="space-y-8 text-corporate-800 leading-relaxed text-lg md:text-xl font-normal max-w-3xl">
          <p>
            Facilities, Incorporated is a family-run operating company established in 1960, responsible for the day-to-day operation of specific commercial units within Mandaluyong-based properties.
          </p>
          <p>
            The company currently operates units within Summit One Tower and Facilities Centre, with operations expanding beyond Metro Manila.
          </p>
        </div>

        <div className="pt-8 space-y-10">
          <p className="text-lg md:text-xl italic text-corporate-600 font-serif opacity-90">
            Quality has no substitute.
          </p>
          
          <a 
            href="#contact" 
            className="inline-block px-10 py-4 border border-corporate-300 text-corporate-700 text-base font-medium hover:border-corporate-500 hover:text-corporate-900 transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </div>
  </section>
);

const WhyUs: React.FC = () => (
  <Section id="why-us" className="bg-white" narrow>
    <SectionTitle>Why Facilities, Incorporated</SectionTitle>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {whyItems.map((item, idx) => (
        <div 
          key={idx} 
          className="p-8 border border-corporate-200 bg-white h-full flex flex-col"
        >
          <h3 className="text-lg md:text-xl font-medium text-corporate-900 mb-6">{item.title}</h3>
          <span className="text-corporate-300 font-light block select-none mt-auto text-lg">{item.description}</span>
        </div>
      ))}
    </div>
  </Section>
);

const Operations: React.FC = () => (
  <Section id="operations" className="bg-corporate-50" narrow>
    <SectionTitle>How We Operate</SectionTitle>
    <div className="border-l border-corporate-200 pl-6 md:pl-10">
      {operations.map((op, idx) => (
        <div key={idx} className="flex flex-col sm:flex-row py-10 border-b border-corporate-200 last:border-b-0 items-baseline">
          <div className="w-24 sm:w-32 mb-2 sm:mb-0 flex-shrink-0 select-none">
            {/* Structural Watermark Numeral */}
            <span className="text-5xl md:text-6xl font-serif text-corporate-200 font-normal leading-none block -mt-1">
              {op.step}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl text-corporate-900 font-medium">
              {op.title}
            </h3>
            {/* Empty description area */}
            <div className="h-0" aria-hidden="true"></div> 
          </div>
        </div>
      ))}
    </div>
  </Section>
);

const Assets: React.FC = () => (
  <Section id="assets" className="bg-white" narrow>
    <SectionTitle>Assets Under Operation</SectionTitle>
    <div className="space-y-24 md:space-y-32">
      
      {/* Asset 1: Summit One Tower (Portrait/Vertical) */}
      <div className="w-full flex flex-col gap-8">
        <div className="w-full border border-corporate-200 bg-corporate-100">
          {/* Vertical crop: aspect-[3/4] ensures height is emphasized without fixed pixel constraints */}
          <div className="aspect-[3/4] w-full overflow-hidden">
             <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop" 
              alt="Summit One Tower Exterior"
              className="w-full h-full object-cover grayscale-[15%] contrast-[0.95]"
            />
          </div>
        </div>
        <div className="space-y-4 max-w-3xl">
          <div className="space-y-1">
            <h3 className="text-2xl md:text-3xl font-serif text-corporate-900">Summit One Tower</h3>
            <p className="text-base text-corporate-500 font-medium">High-rise commercial tower</p>
          </div>
          
          <div className="pt-2 flex flex-col sm:flex-row sm:items-baseline text-base md:text-lg gap-y-1 gap-x-4">
             <span className="text-corporate-700">Mandaluyong City</span>
             <span className="hidden sm:inline text-corporate-300">/</span>
             <span className="text-corporate-700">Operational scope: unit-level</span>
          </div>
        </div>
      </div>

      {/* Asset 2: Facilities Centre (Landscape/Horizontal) */}
      <div className="w-full flex flex-col gap-8">
        <div className="w-full border border-corporate-200 bg-corporate-100">
           {/* Horizontal crop: aspect-[16/9] emphasizes frontage */}
           <div className="aspect-[16/9] w-full overflow-hidden">
             <img 
              src="https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=1200&auto=format&fit=crop" 
              alt="Facilities Centre Exterior"
              className="w-full h-full object-cover grayscale-[15%] contrast-[0.95]"
            />
           </div>
        </div>
        <div className="space-y-4 max-w-3xl">
          <div className="space-y-1">
            <h3 className="text-2xl md:text-3xl font-serif text-corporate-900">Facilities Centre</h3>
            <p className="text-base text-corporate-500 font-medium">Low-rise commercial arcade</p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-baseline text-base md:text-lg gap-y-1 gap-x-4">
             <span className="text-corporate-700">Mandaluyong City</span>
             <span className="hidden sm:inline text-corporate-300">/</span>
             <span className="text-corporate-700">Operational scope: unit-level</span>
          </div>
        </div>
      </div>

    </div>
  </Section>
);

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <Section id="faq" className="bg-corporate-50" narrow>
      <SectionTitle>Frequently Asked Questions</SectionTitle>
      {/* Darker structural border: border-corporate-300 */}
      <div className="border-t border-corporate-300">
        {faqs.map((faq, idx) => (
          /* Darker item border: border-corporate-300 */
          <div key={idx} className="border-b border-corporate-300">
            <button 
              onClick={() => toggle(idx)}
              className="w-full py-6 flex items-start justify-between text-left focus:outline-none group"
              aria-expanded={openIndex === idx}
            >
              {/* Increased size to text-xl */}
              <span className="text-xl text-corporate-800 font-normal pr-8 leading-relaxed group-hover:text-corporate-900 transition-colors">
                {faq.question}
              </span>
              {/* Institutional Navy Plus Icon */}
              <span className="text-corporate-900 mt-1 flex-shrink-0">
                {openIndex === idx ? <Minus size={20} /> : <Plus size={20} />}
              </span>
            </button>
            {openIndex === idx && (
              <div className="pb-6 pr-8 text-corporate-600 text-base leading-relaxed">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
};

const Contact: React.FC = () => (
  <Section id="contact" className="bg-white" narrow>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
      {/* Contact Info */}
      <div className="space-y-10">
        <h2 className="text-2xl md:text-3xl font-serif text-corporate-900">Contact</h2>
        
        <div className="space-y-10 text-base">
          <div className="space-y-3">
            <h3 className="font-medium text-corporate-700 text-lg">Main Office</h3>
            <p className="text-corporate-600 leading-relaxed text-lg">
              23/F Summit One Office Tower<br />
              530 Shaw Boulevard<br />
              Mandaluyong City 1552
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2 text-corporate-600 text-lg">
              <p>+63 (632) 7118-9463</p>
              <p>+63 (632) 7118-0659</p>
            </div>
            
            <div className="text-corporate-600 text-lg">
              <p>inquiries@facilities-inc.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="pt-2">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-corporate-600 uppercase tracking-wide">Name</label>
              <input 
                type="text" 
                id="name" 
                className="w-full px-4 py-3 bg-white border border-corporate-300 focus:border-corporate-500 text-corporate-900 focus:outline-none transition-colors rounded-none text-base"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-corporate-600 uppercase tracking-wide">Email</label>
              <input 
                type="email" 
                id="email" 
                className="w-full px-4 py-3 bg-white border border-corporate-300 focus:border-corporate-500 text-corporate-900 focus:outline-none transition-colors rounded-none text-base"
              />
            </div>
          
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-corporate-600 uppercase tracking-wide">Phone (Optional)</label>
              <input 
                type="tel" 
                id="phone" 
                className="w-full px-4 py-3 bg-white border border-corporate-300 focus:border-corporate-500 text-corporate-900 focus:outline-none transition-colors rounded-none text-base"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-corporate-600 uppercase tracking-wide">Message</label>
              <textarea 
                id="message" 
                rows={5} 
                className="w-full px-4 py-3 bg-white border border-corporate-300 focus:border-corporate-500 text-corporate-900 focus:outline-none transition-colors rounded-none resize-none text-base"
              ></textarea>
            </div>
          </div>

          <button 
            type="submit" 
            className="px-8 py-3 bg-corporate-900 text-white text-base font-medium hover:bg-corporate-800 transition-colors rounded-none mt-4"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  </Section>
);

const Footer: React.FC = () => (
  <footer className="bg-corporate-50 border-t border-corporate-200 py-16">
    <div className="max-w-[840px] mx-auto px-6">
      <p className="text-sm text-corporate-600">
        &copy; {new Date().getFullYear()} Facilities, Incorporated.
      </p>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="antialiased min-h-screen bg-corporate-50">
      <Header />
      <main>
        <Hero />
        <WhyUs />
        <Operations />
        <Assets />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}