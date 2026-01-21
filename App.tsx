import React, { useState } from 'react';
import { Section } from './components/Section';
import { Plus, Minus, Menu, X } from 'lucide-react';
import { WhyItem, OperationStep, FAQItem } from './types';

// --- Data Definitions ---

const whyItems: WhyItem[] = [
  { 
    title: "ESTABLISHED 1960", 
    description: "Over six decades of continuous operation and management experience in the Metro Manila commercial sector." 
  },
  { 
    title: "OWNER-OPERATOR MODEL", 
    description: "We manage units we hold a stake in, ensuring aligned interests and long-term asset preservation." 
  },
  { 
    title: "UNIT-LEVEL FOCUS", 
    description: "Specialized attention to specific commercial units rather than broad, generalized building management." 
  },
  { 
    title: "OPERATIONAL CONTINUITY", 
    description: "A family-run structure providing stable, consistent leadership across generations of tenancy." 
  },
  { 
    title: "FISCAL DISCIPLINE", 
    description: "Conservative financial management ensuring properties are maintained without leveraging operating risks." 
  },
  { 
    title: "TRANSPARENT REPORTING", 
    description: "Clear, reliable communication channels for tenants regarding maintenance, security, and compliance." 
  },
];

const operations: OperationStep[] = [
  { step: "01", title: "Asset Acquisition & Review", description: "Each unit undergoes a rigorous structural and compliance assessment before entering our operational portfolio. We verify title integrity, zoning adherence, and utility infrastructure." },
  { step: "02", title: "Tenant Fit-Out Coordination", description: "We oversee the transition from bare shell to operational workspace. Our team coordinates directly with contractors to ensure building codes and safety standards are strictly met." },
  { step: "03", title: "Preventive Maintenance", description: "Rather than reactive repairs, we implement scheduled maintenance cycles for HVAC, electrical, and plumbing systems within our units to minimize downtime." },
  { step: "04", title: "Compliance & Administration", description: "We handle all regulatory filings, association dues, and property tax obligations directly, ensuring our tenants face no administrative interruptions." },
];

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

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const scrollToId = (targetId: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    closeMenu();
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#181852] border-b border-[#E6EAF2]/10 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="font-serif text-xl text-[#E6EAF2] font-medium tracking-tight opacity-95">
          Facilities, Incorporated
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8 text-sm text-[#E6EAF2] font-medium tracking-wide">
          <a href="#why" onClick={scrollToId("why")} className="hover:text-[#C9D2E3] transition-colors duration-300">Why Facilities</a>
          <a href="#operate" onClick={scrollToId("operate")} className="hover:text-[#C9D2E3] transition-colors duration-300">How We Operate</a>
          <a href="#assets" onClick={scrollToId("assets")} className="hover:text-[#C9D2E3] transition-colors duration-300">Assets</a>
          <a href="#faq" onClick={scrollToId("faq")} className="hover:text-[#C9D2E3] transition-colors duration-300">FAQ</a>
          <a href="#contact" onClick={scrollToId("contact")} className="hover:text-[#C9D2E3] transition-colors duration-300">Contact</a>
        </nav>

        {/* Mobile Hamburger Button */}
        <button 
          className="md:hidden text-[#E6EAF2] hover:text-[#C9D2E3] transition-colors focus:outline-none"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-[#181852] border-b border-[#E6EAF2]/10 shadow-xl">
          <nav className="flex flex-col py-8 px-6 space-y-6">
            <a 
              href="#why" 
              onClick={scrollToId("why")}
              className="text-[#E6EAF2] text-lg font-medium tracking-wide hover:text-[#C9D2E3] transition-colors"
            >
              Why Facilities
            </a>
            <a 
              href="#operate" 
              onClick={scrollToId("operate")}
              className="text-[#E6EAF2] text-lg font-medium tracking-wide hover:text-[#C9D2E3] transition-colors"
            >
              How We Operate
            </a>
            <a 
              href="#assets" 
              onClick={scrollToId("assets")}
              className="text-[#E6EAF2] text-lg font-medium tracking-wide hover:text-[#C9D2E3] transition-colors"
            >
              Assets
            </a>
            <a 
              href="#faq" 
              onClick={scrollToId("faq")}
              className="text-[#E6EAF2] text-lg font-medium tracking-wide hover:text-[#C9D2E3] transition-colors"
            >
              FAQ
            </a>
            <a 
              href="#contact" 
              onClick={scrollToId("contact")}
              className="text-[#E6EAF2] text-lg font-medium tracking-wide hover:text-[#C9D2E3] transition-colors"
            >
              Contact
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

const Hero: React.FC = () => (
  <section className="min-h-[90vh] flex flex-col justify-center px-6 bg-corporate-50 pt-20 border-b border-corporate-200">
    <div className="max-w-5xl mx-auto w-full py-24 md:py-32">
      <div className="space-y-12">
        <div className="space-y-6">
          <h1 className="font-serif text-5xl md:text-7xl text-corporate-900 leading-[1.05] tracking-tight">
            Facilities, Incorporated
          </h1>
          <p className="text-sm md:text-base text-corporate-500 font-medium tracking-[0.15em] uppercase">
            Commercial Property Operations and Asset Management
          </p>
          {/* Structural Divider */}
          <div className="w-24 h-px bg-corporate-300" aria-hidden="true"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          <div className="space-y-8">
            <p className="text-xl md:text-2xl text-corporate-800 leading-relaxed font-serif">
              Facilities, Incorporated is a family-run operating company established in 1960, responsible for the day-to-day operation of specific commercial units within Mandaluyong-based properties.
            </p>
            <p className="text-lg text-corporate-600 leading-relaxed">
              The company currently operates units within Summit One Tower and Facilities Centre, with operations expanding beyond Metro Manila.
            </p>
            
            <div className="pt-8 space-y-8">
               <p className="text-lg italic text-corporate-500 font-serif">
                Quality has no substitute.
              </p>
              
              <a 
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="inline-block px-8 py-4 bg-transparent border border-corporate-300 text-corporate-900 text-sm font-medium hover:border-corporate-900 transition-colors duration-500 tracking-wide"
              >
                Make an Inquiry
              </a>
            </div>
          </div>
          
          {/* Abstract Hero Image */}
          <div className="relative h-full min-h-[400px] w-full bg-corporate-100 hidden md:block">
              <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop" 
              alt="Abstract Building Facade"
              className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 mix-blend-multiply contrast-125"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

const WhyUs: React.FC = () => (
  <Section id="why" className="bg-white">
    <div className="border-b border-corporate-200 mb-16 pb-4">
      <h2 className="text-3xl md:text-4xl font-serif text-corporate-900">
        Why Facilities, Incorporated
      </h2>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
      {whyItems.map((item, idx) => (
        <div key={idx} className="space-y-4">
          <h3 className="text-sm font-bold text-corporate-900 tracking-widest uppercase opacity-90">
            {item.title}
          </h3>
          <p className="text-lg text-corporate-600 leading-relaxed">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  </Section>
);

const Operations: React.FC = () => (
  <Section id="operate" className="bg-corporate-50 border-t border-corporate-200">
    <div className="border-b border-corporate-200 mb-16 pb-4">
       <h2 className="text-3xl md:text-4xl font-serif text-corporate-900">
        How We Operate
      </h2>
    </div>

    <div className="space-y-16 md:space-y-24">
      {operations.map((op, idx) => (
        <div key={idx} className="flex flex-col md:flex-row md:items-stretch">
          {/* Left Column: Number + Title */}
          <div className="w-full md:w-5/12 pb-6 md:pb-0 md:pr-12">
             <span className="block text-6xl md:text-7xl font-serif text-corporate-200 leading-none mb-6">
              {op.step}
            </span>
            <h3 className="text-2xl md:text-3xl font-serif text-corporate-800 leading-tight">
              {op.title}
            </h3>
          </div>
          
          {/* Right Column: Divider & Description */}
          <div className="w-full md:w-7/12 md:border-l border-corporate-200 md:pl-12 pt-1">
            <p className="text-lg text-corporate-600 leading-relaxed">
              {op.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  </Section>
);

const Assets: React.FC = () => (
  <Section id="assets" className="bg-white border-t border-corporate-200">
    <div className="border-b border-corporate-200 mb-16 pb-4">
      <h2 className="text-3xl md:text-4xl font-serif text-corporate-900">
        Assets Under Operation
      </h2>
    </div>

    <div className="space-y-24 md:space-y-32">
      
      {/* Asset 1: Summit One Tower */}
      <figure className="flex flex-col gap-8 group">
        {/* Adjusted Aspect Ratio: Reduced height by ~28% (aspect-[10/9]) compared to previous 4/5 */}
        {/* Constrained width to ~720px on desktop, centered */}
        <div className="w-full md:max-w-[720px] mx-auto bg-corporate-100 overflow-hidden relative aspect-[3/4] md:aspect-[10/9]">
           <img 
            src="summit-one-tower.png" 
            alt="Summit One Tower Detail"
            className="w-full h-full object-cover grayscale-[40%] contrast-[0.95]"
          />
        </div>
        
        <figcaption className="space-y-6 max-w-2xl">
           <div className="space-y-2">
              <h3 className="text-3xl md:text-4xl font-serif text-corporate-900">Summit One Tower</h3>
              <p className="text-sm text-corporate-400 font-medium tracking-widest uppercase">High-rise commercial tower</p>
            </div>
            <p className="text-sm text-corporate-500 tracking-wide uppercase">
              Mandaluyong City, Metro Manila
            </p>
            <p className="text-lg text-corporate-600 leading-relaxed">
              Located on Shaw Boulevard, this PEZA-accredited property comprises dedicated office and commercial spaces under Facilities, Incorporated’s operational management.
            </p>
        </figcaption>
      </figure>

      {/* Asset 2: Facilities Centre */}
      <figure className="flex flex-col gap-8 group">
         {/* Horizontal Aspect Ratio */}
        <div className="w-full bg-corporate-100 overflow-hidden relative aspect-[16/9]">
            <img 
            src="facilities-centre.png" 
            alt="Facilities Centre Frontage"
            className="w-full h-full object-cover grayscale-[40%] contrast-[0.95]"
          />
        </div>

        <figcaption className="space-y-6 max-w-2xl">
           <div className="space-y-2">
              <h3 className="text-3xl md:text-4xl font-serif text-corporate-900">Facilities Centre</h3>
              <p className="text-sm text-corporate-400 font-medium tracking-widest uppercase">Low-rise commercial arcade</p>
            </div>
            <p className="text-sm text-corporate-500 tracking-wide uppercase">
              Mandaluyong City, Metro Manila
            </p>
            <p className="text-lg text-corporate-600 leading-relaxed">
               A dedicated commercial structure adjacent to key transport hubs. Our operations focus on commercial units and retail spaces, prioritizing accessibility and efficient utility management for tenants.
            </p>
        </figcaption>
      </figure>

    </div>
  </Section>
);

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <Section id="faq" className="bg-corporate-50 border-t border-corporate-200" narrow>
      <div className="mb-12 md:mb-16 border-b border-corporate-200 pb-6 inline-block pr-16 leading-tight">
        <h2 className="text-3xl md:text-4xl font-serif text-corporate-900">Frequently Asked Questions</h2>
      </div>
      
      {/* Darker structural border: border-corporate-300 replaced with 200 for subtlety */}
      <div className="border-t border-corporate-200">
        {faqs.map((faq, idx) => (
          /* Item border: border-corporate-200 */
          <div key={idx} className="border-b border-corporate-200">
            <button 
              onClick={() => toggle(idx)}
              className="w-full py-6 flex items-start justify-between text-left focus:outline-none group"
              aria-expanded={openIndex === idx}
            >
              {/* Increased size to text-xl */}
              <span className="text-xl text-corporate-700 font-normal pr-8 leading-relaxed group-hover:text-corporate-900 transition-colors">
                {faq.question}
              </span>
              {/* Institutional Navy Plus Icon - muted to 300/500 */}
              <span className="text-corporate-400 mt-1 flex-shrink-0 group-hover:text-corporate-600 transition-colors">
                {openIndex === idx ? <Minus size={20} /> : <Plus size={20} />}
              </span>
            </button>
            {openIndex === idx && (
              <div className="pb-6 pr-8 text-corporate-500 text-base leading-relaxed">
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
  <Section id="contact" className="bg-white border-t border-corporate-200">
     <div className="border-b border-corporate-200 mb-16 pb-4">
      <h2 className="text-3xl md:text-4xl font-serif text-corporate-900">
        Contact
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24">
      {/* Contact Info */}
      <div className="md:col-span-4 space-y-12">
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Head Office</h3>
          <p className="text-lg text-corporate-700 leading-relaxed font-serif">
            23/F Summit One Tower<br />
            530 Shaw Boulevard<br />
            Mandaluyong City 1552<br />
            Philippines
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Telephone</h3>
           <div className="text-lg text-corporate-700 leading-relaxed font-serif">
            <p>+63 2 8555 0100</p>
            <p>+63 2 8555 0101</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Email</h3>
           <div className="text-lg text-corporate-700 leading-relaxed font-serif">
            <a href="mailto:info@facilities-inc.com" className="hover:text-corporate-900 underline decoration-corporate-200 underline-offset-4 transition-colors">
              info@facilities-inc.com
            </a>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="md:col-span-8 pt-2">
        <form className="space-y-12" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Name</label>
              <input 
                type="text" 
                id="name" 
                placeholder="Full Name"
                className="w-full py-3 bg-transparent border-b border-corporate-200 focus:border-corporate-900 text-corporate-900 focus:outline-none transition-colors text-lg placeholder-corporate-300 font-light"
              />
            </div>
             <div className="space-y-2">
              <label htmlFor="company" className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Company</label>
              <input 
                type="text" 
                id="company" 
                placeholder="Organization Name"
                className="w-full py-3 bg-transparent border-b border-corporate-200 focus:border-corporate-900 text-corporate-900 focus:outline-none transition-colors text-lg placeholder-corporate-300 font-light"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Email Address</label>
            <input 
              type="email" 
              id="email" 
              placeholder="name@company.com"
              className="w-full py-3 bg-transparent border-b border-corporate-200 focus:border-corporate-900 text-corporate-900 focus:outline-none transition-colors text-lg placeholder-corporate-300 font-light"
            />
          </div>


          <div className="space-y-2">
            <label htmlFor="message" className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Inquiry</label>
            <textarea 
              id="message" 
              rows={4} 
              placeholder="How can we assist you?"
              className="w-full py-3 bg-transparent border-b border-corporate-200 focus:border-corporate-900 text-corporate-900 focus:outline-none transition-colors resize-none text-lg placeholder-corporate-300 font-light"
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="px-10 py-4 bg-transparent border border-corporate-300 text-corporate-900 text-sm font-medium hover:border-corporate-900 transition-colors duration-300 tracking-wide"
          >
            Submit Inquiry
          </button>
        </form>
      </div>
    </div>
  </Section>
);

const Footer: React.FC = () => (
  <footer className="bg-[#181852] text-[#C9D2E3] py-12">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center opacity-80 text-xs tracking-widest uppercase">
      <p>
        &copy; {new Date().getFullYear() + 1} Facilities, Incorporated. All rights reserved.
      </p>
      <p className="mt-4 md:mt-0">
        Est. 1960
      </p>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="antialiased min-h-screen bg-corporate-50 font-sans text-corporate-600">
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