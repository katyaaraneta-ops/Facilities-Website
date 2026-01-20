import React, { useState } from 'react';
import { Section, SectionTitle } from './components/Section';
import { ChevronDown, ChevronUp, Phone, Mail } from 'lucide-react';
import { WhyItem, OperationStep, Asset, FAQItem } from './types';

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

const assets: Asset[] = [
  {
    name: "Summit One Tower",
    location: "Mandaluyong City",
    scope: "Operational scope: unit-level",
    imageUrl: "https://picsum.photos/id/437/800/450" 
  },
  {
    name: "Facilities Centre",
    location: "Mandaluyong City",
    scope: "Operational scope: unit-level",
    imageUrl: "https://picsum.photos/id/534/800/450"
  }
];

const faqs: FAQItem[] = [
  { question: "What is the scope of unit-level management?", answer: "—" },
  { question: "How are vendor payments processed?", answer: "—" },
  { question: "What represents a standard reporting period?", answer: "—" },
  { question: "Do you manage common areas or building structures?", answer: "—" },
  { question: "What are the requirements for vendor accreditation?", answer: "—" },
  { question: "How are emergency repairs handled?", answer: "—" },
  { question: "Is there an escalation matrix for tenants?", answer: "—" },
];

// --- Components ---

const Header: React.FC = () => (
  <header className="sticky top-0 bg-white border-b border-corporate-200 z-50">
    <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
      <div className="font-serif text-lg text-corporate-900 font-semibold tracking-tight">
        Facilities, Incorporated
      </div>
      
      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center space-x-8 text-sm text-corporate-600">
        <a href="#why-us" className="hover:text-corporate-900 transition-colors">Why Facilities</a>
        <a href="#operations" className="hover:text-corporate-900 transition-colors">How We Operate</a>
        <a href="#assets" className="hover:text-corporate-900 transition-colors">Assets</a>
        <a href="#faq" className="hover:text-corporate-900 transition-colors">FAQ</a>
        <a href="#contact" className="hover:text-corporate-900 transition-colors">Contact</a>
      </nav>

      {/* Mobile Nav Placeholder - keeping it simple/hidden for "calm" aesthetic, 
          in production would likely be a simple hamburger menu */}
      <a href="#contact" className="md:hidden text-sm text-corporate-900 font-medium">
        Contact
      </a>
    </div>
  </header>
);

const Hero: React.FC = () => (
  <section className="min-h-[70vh] flex flex-col justify-center px-6 bg-white border-b border-corporate-100">
    <div className="max-w-3xl mx-auto w-full py-20">
      <div className="space-y-8 md:space-y-10">
        <div className="space-y-2">
          <h1 className="font-serif text-3xl md:text-4xl text-corporate-900 leading-tight">
            Facilities, Incorporated
          </h1>
          <p className="text-lg md:text-xl text-corporate-500 font-light">
            Commercial property operations and asset management
          </p>
        </div>

        <div className="space-y-6 text-corporate-800 leading-relaxed text-base md:text-lg font-normal max-w-2xl">
          <p>
            Facilities, Incorporated is a family-run operating company established in 1960, responsible for the day-to-day operation of specific commercial units within Mandaluyong-based properties.
          </p>
          <p>
            The company currently operates units within Summit One Tower and Facilities Centre, with operations expanding beyond Metro Manila.
          </p>
        </div>

        <div className="pt-4 space-y-8">
          <p className="text-sm italic text-corporate-500 font-serif">
            Quality has no substitute.
          </p>
          
          <a 
            href="#contact" 
            className="inline-block px-8 py-3 border border-corporate-300 text-corporate-900 text-sm font-medium hover:bg-corporate-50 transition-colors"
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {whyItems.map((item, idx) => (
        <div 
          key={idx} 
          className="p-6 border border-corporate-200 bg-white"
        >
          <h3 className="text-base font-medium text-corporate-900 mb-4">{item.title}</h3>
          <span className="text-corporate-300 font-light block select-none">{item.description}</span>
        </div>
      ))}
    </div>
  </Section>
);

const Operations: React.FC = () => (
  <Section id="operations" className="bg-corporate-50/50" narrow>
    <SectionTitle>How We Operate</SectionTitle>
    <div className="border-t border-corporate-200">
      {operations.map((op, idx) => (
        <div key={idx} className="flex flex-col sm:flex-row py-6 border-b border-corporate-200 items-baseline">
          <div className="w-24 mb-2 sm:mb-0 flex-shrink-0">
            <span className="text-xs font-mono text-corporate-400 tracking-wider">{op.step}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-base text-corporate-900 font-normal">
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
    <div className="space-y-12">
      {assets.map((asset, idx) => (
        <div key={idx} className="block">
          {/* Static image - no hover effects */}
          <div className="w-full bg-corporate-100 mb-4 border border-corporate-100">
            <img 
              src={asset.imageUrl} 
              alt={asset.name}
              className="w-full h-auto object-cover grayscale-[10%] opacity-95"
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-t border-corporate-100 pt-3">
            <h3 className="text-lg font-serif text-corporate-900">{asset.name}</h3>
            <div className="flex flex-col sm:flex-row sm:items-center text-sm text-corporate-500 gap-y-1 gap-x-4 mt-1 sm:mt-0">
              <span>{asset.location}</span>
              <span className="hidden sm:inline text-corporate-300">/</span>
              <span className="text-corporate-400">{asset.scope}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </Section>
);

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <Section id="faq" className="bg-white" narrow>
      <SectionTitle>Frequently Asked Questions</SectionTitle>
      <div className="border-t border-corporate-200">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border-b border-corporate-200">
            <button 
              onClick={() => toggle(idx)}
              className="w-full py-5 flex items-start justify-between text-left focus:outline-none"
              aria-expanded={openIndex === idx}
            >
              <span className="text-base text-corporate-800 font-normal pr-8">
                {faq.question}
              </span>
              <span className="text-corporate-400 mt-1 flex-shrink-0">
                {openIndex === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </button>
            {openIndex === idx && (
              <div className="pb-5 pr-8 text-corporate-500 text-sm leading-relaxed">
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
  <Section id="contact" className="bg-corporate-50" narrow>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* Contact Info */}
      <div className="lg:col-span-4 space-y-8">
        <h2 className="text-xl font-serif text-corporate-900">Contact</h2>
        
        <div className="space-y-6 text-sm">
          <div className="space-y-1">
            <h3 className="font-medium text-corporate-900">Main Office</h3>
            <p className="text-corporate-600 leading-relaxed">
              23/F Summit One Office Tower<br />
              530 Shaw Boulevard<br />
              Mandaluyong City 1552
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="space-y-1 text-corporate-600">
              <p>+63 (632) 7118-9463</p>
              <p>+63 (632) 7118-0659</p>
            </div>
            
            <div className="text-corporate-600">
              <p>inquiries@facilities-inc.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="lg:col-span-8">
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label htmlFor="name" className="text-xs font-medium text-corporate-500 uppercase tracking-wide">Name</label>
              <input 
                type="text" 
                id="name" 
                className="w-full px-3 py-2 bg-white border border-corporate-300 focus:border-corporate-500 focus:outline-none transition-colors rounded-none"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-medium text-corporate-500 uppercase tracking-wide">Email</label>
              <input 
                type="email" 
                id="email" 
                className="w-full px-3 py-2 bg-white border border-corporate-300 focus:border-corporate-500 focus:outline-none transition-colors rounded-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="phone" className="text-xs font-medium text-corporate-500 uppercase tracking-wide">Phone (Optional)</label>
            <input 
              type="tel" 
              id="phone" 
              className="w-full px-3 py-2 bg-white border border-corporate-300 focus:border-corporate-500 focus:outline-none transition-colors rounded-none"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="message" className="text-xs font-medium text-corporate-500 uppercase tracking-wide">Message</label>
            <textarea 
              id="message" 
              rows={4} 
              className="w-full px-3 py-2 bg-white border border-corporate-300 focus:border-corporate-500 focus:outline-none transition-colors rounded-none resize-none"
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="px-6 py-2 bg-corporate-900 text-white text-sm font-medium hover:bg-corporate-800 transition-colors rounded-none"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  </Section>
);

const Footer: React.FC = () => (
  <footer className="bg-white border-t border-corporate-100 py-12">
    <div className="max-w-4xl mx-auto px-6 text-center md:text-left">
      <p className="text-xs text-corporate-400">
        &copy; {new Date().getFullYear()} Facilities, Incorporated.
      </p>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="antialiased min-h-screen bg-white">
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