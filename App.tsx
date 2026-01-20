import React, { useState } from 'react';
import { Section, SectionTitle } from './components/Section';
import { ChevronDown, ChevronUp, MapPin, Phone, Mail } from 'lucide-react';
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
    // Architectural, established feel
    imageUrl: "https://picsum.photos/id/437/800/450" 
  },
  {
    name: "Facilities Centre",
    location: "Mandaluyong City",
    scope: "Operational scope: unit-level",
    // Abstract building detail
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
  <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-corporate-100 z-50">
    <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
      <div className="font-serif text-xl md:text-2xl text-corporate-900 tracking-tight italic font-semibold">
        FI
      </div>
      <a 
        href="#contact" 
        className="text-sm font-medium text-corporate-600 hover:text-corporate-900 transition-colors uppercase tracking-widest"
      >
        Contact
      </a>
    </div>
  </header>
);

const Hero: React.FC = () => (
  <section className="min-h-screen flex flex-col justify-center items-center pt-20 pb-20 px-6 bg-corporate-50/30">
    <div className="max-w-[720px] w-full mx-auto space-y-12 md:space-y-16 text-center md:text-left">
      <div className="space-y-6">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-corporate-900 leading-tight">
          Facilities, Incorporated
        </h1>
        <p className="text-xl md:text-2xl text-corporate-500 font-light tracking-wide">
          Commercial property operations and asset management
        </p>
      </div>

      <div className="space-y-8 text-corporate-700 leading-relaxed text-lg font-light">
        <p>
          Facilities, Incorporated is a family-run operating company established in 1960, responsible for the day-to-day operation of specific commercial units within Mandaluyong-based properties.
        </p>
        <p>
          The company currently operates units within Summit One Tower and Facilities Centre, with operations expanding beyond Metro Manila.
        </p>
      </div>

      <div className="pt-8 border-t border-corporate-200 w-full md:w-32 md:border-t-0 md:pt-0">
        <p className="text-xs font-semibold text-corporate-400 uppercase tracking-[0.2em] mb-12">
          Quality has no substitute.
        </p>
        
        <a 
          href="#contact" 
          className="inline-block px-10 py-3 border border-corporate-300 text-corporate-800 text-sm font-medium hover:bg-white hover:border-corporate-400 transition-all duration-300"
        >
          Contact
        </a>
      </div>
    </div>
  </section>
);

const WhyUs: React.FC = () => (
  <Section id="why-us" className="bg-white">
    <SectionTitle>Why Facilities, Incorporated</SectionTitle>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {whyItems.map((item, idx) => (
        <div 
          key={idx} 
          className="p-8 border border-corporate-100 rounded-sm bg-white hover:border-corporate-200 transition-colors duration-500 min-h-[160px] flex flex-col justify-between"
        >
          <h3 className="text-lg font-medium text-corporate-800">{item.title}</h3>
          <span className="text-corporate-300 font-light block mt-4 select-none">{item.description}</span>
        </div>
      ))}
    </div>
  </Section>
);

const Operations: React.FC = () => (
  <Section id="operations" className="bg-corporate-50/50" narrow>
    <SectionTitle>How We Operate</SectionTitle>
    <div className="space-y-0 divide-y divide-corporate-200 border-t border-b border-corporate-200">
      {operations.map((op, idx) => (
        <div key={idx} className="flex flex-col md:flex-row py-8 group">
          <div className="md:w-32 mb-2 md:mb-0">
            <span className="text-sm font-mono text-corporate-400">{op.step}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg text-corporate-900 font-normal group-hover:text-corporate-700 transition-colors">
              {op.title}
            </h3>
            {/* Empty description area as requested */}
            <div className="h-0" aria-hidden="true"></div> 
          </div>
        </div>
      ))}
    </div>
  </Section>
);

const Assets: React.FC = () => (
  <Section id="assets" className="bg-white">
    <SectionTitle>Assets Under Operation</SectionTitle>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
      {assets.map((asset, idx) => (
        <div key={idx} className="group">
          <div className="aspect-[16/9] w-full overflow-hidden bg-corporate-100 mb-6 border border-corporate-100">
            <img 
              src={asset.imageUrl} 
              alt={asset.name}
              className="w-full h-full object-cover opacity-90 grayscale-[20%] group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-out"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-corporate-900">{asset.name}</h3>
            <div className="flex flex-col sm:flex-row sm:items-center text-sm text-corporate-500 gap-y-1 gap-x-4">
              <span>{asset.location}</span>
              <span className="hidden sm:inline text-corporate-300">•</span>
              <span className="font-mono text-xs uppercase tracking-wider text-corporate-400">{asset.scope}</span>
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
              className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
              aria-expanded={openIndex === idx}
            >
              <span className={`text-lg font-light transition-colors ${openIndex === idx ? 'text-corporate-900' : 'text-corporate-600 group-hover:text-corporate-800'}`}>
                {faq.question}
              </span>
              <span className="ml-6 text-corporate-400">
                {openIndex === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </span>
            </button>
            {openIndex === idx && (
              <div className="pb-6 pr-12 text-corporate-500 font-light">
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
  <Section id="contact" className="bg-corporate-50">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
      {/* Contact Info */}
      <div className="lg:col-span-4 space-y-12">
        <h2 className="text-2xl font-medium text-corporate-900">Contact</h2>
        
        <div className="space-y-8">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-corporate-400">Main Office</h3>
            <p className="text-corporate-700 leading-relaxed">
              23/F Summit One Office Tower<br />
              530 Shaw Boulevard<br />
              Mandaluyong City 1552
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-4 text-corporate-700">
              <Phone size={18} className="mt-1 text-corporate-400" />
              <div className="space-y-1">
                <p>+63 (632) 7118-9463</p>
                <p>+63 (632) 7118-0659</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-corporate-700">
              <Mail size={18} className="text-corporate-400" />
              <p>inquiries@facilities-inc.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="lg:col-span-8">
        <form className="space-y-6 max-w-lg" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-corporate-600">Full Name</label>
              <input 
                type="text" 
                id="name" 
                className="w-full px-4 py-3 bg-white border border-corporate-200 focus:border-corporate-400 focus:ring-0 outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-corporate-600">Email Address</label>
              <input 
                type="email" 
                id="email" 
                className="w-full px-4 py-3 bg-white border border-corporate-200 focus:border-corporate-400 focus:ring-0 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-corporate-600">Phone (Optional)</label>
            <input 
              type="tel" 
              id="phone" 
              className="w-full px-4 py-3 bg-white border border-corporate-200 focus:border-corporate-400 focus:ring-0 outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-corporate-600">Message</label>
            <textarea 
              id="message" 
              rows={4} 
              className="w-full px-4 py-3 bg-white border border-corporate-200 focus:border-corporate-400 focus:ring-0 outline-none transition-colors resize-none"
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="px-8 py-3 bg-corporate-900 text-white text-sm font-medium hover:bg-corporate-800 transition-colors"
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
    <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-corporate-400">
      <div className="mb-4 md:mb-0">
        &copy; {new Date().getFullYear()} Facilities, Incorporated. All rights reserved.
      </div>
      <div className="flex space-x-6">
        <span className="cursor-not-allowed">Privacy</span>
        <span className="cursor-not-allowed">Terms</span>
        <span className="cursor-not-allowed">Sitemap</span>
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="antialiased min-h-screen">
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