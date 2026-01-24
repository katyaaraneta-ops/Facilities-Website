import React, { useState } from 'react';
import { Section } from './components/Section';
import { Plus, Minus, Menu, X } from 'lucide-react';
import { WhyItem, OperationStep, FAQItem } from './types';

// --- Data Definitions ---

const whyItems: WhyItem[] = [
  { 
    title: "Established Continuity", 
    description: "Operating since 1960, with over six decades of continuous experience in Metro Manila commercial property operations." 
  },
  { 
    title: "Fiscal Discipline", 
    description: "Conservative financial management focused on asset preservation and operational stability." 
  },
  { 
    title: "Direct On-Site Operations", 
    description: "Day-to-day operations are handled directly for managed units within Summit One Tower and Facilities Centre." 
  },
  { 
    title: "Tenant Interface", 
    description: "Primary operational contact for tenants occupying managed units." 
  },
  { 
    title: "Utilities Coordination", 
    description: "Coordination of power, water, and telecommunications services for managed units." 
  },
  { 
    title: "Local Coordination", 
    description: "Coordination with relevant regulatory offices and LGUs where required." 
  },
];

const operations: OperationStep[] = [
  { step: "01", title: "Asset Acquisition & Review", description: "Each unit undergoes a rigorous structural and compliance assessment before entering our operational portfolio. We verify title integrity, zoning adherence, and utility infrastructure." },
  { step: "02", title: "Tenant Fit-Out Coordination", description: "We oversee the transition from bare shell to operational workspace. Our team coordinates directly with contractors to ensure building codes and safety standards are strictly met." },
  { step: "03", title: "Utilities & Compliance", description: "We coordinate directly with utility providers and relevant local authorities to support the ongoing operation of managed units." },
  { step: "04", title: "Compliance & Administration", description: "We support unit-level administrative processes through coordination with relevant parties, where applicable." },
];

const faqs: FAQItem[] = [
  { 
    question: "What does Facilities, Inc., do?", 
    answer: (
      <>
        Facilities, Inc., operates specific commercial units within properties under its care.
        <br />
        Our role focuses on day-to-day unit-level operations, coordination, and administration.
      </>
    )
  },
  { 
    question: "Does Facilities, Inc., manage entire buildings?", 
    answer: "Facilities, Inc., operates identified units only, not entire buildings or third-party portfolios." 
  },
  { 
    question: "Is Facilities, Inc., a real estate broker?", 
    answer: (
      <>
        Facilities, Inc., does not act as a real estate broker.
        <br />
        However, Facilities, Inc., works with brokers and leasing agents in relation to units under its operation. Parties interested in working with our available units may contact us to coordinate listings, viewings, or leasing discussions.
      </>
    )
  },
  { 
    question: "Does Facilities, Inc., market property to the public?", 
    answer: (
      <>
        Facilities, Inc., may market its own managed units where required.
        <br />
        It does not market property on behalf of third parties.
      </>
    )
  },
  { 
    question: "Does Facilities, Inc., sell property?", 
    answer: (
      <>
        Facilities, Inc., does not sell property. Residential house-and-lot offerings in Lipa are handled by our sister company, ADEL.
        <br />
        <span className="italic">(Coming soon.)</span>
      </>
    )
  },
  { 
    question: "Does Facilities, Inc., provide design or architectural services?", 
    answer: (
      <>
        Facilities, Inc., does not provide architectural or design services.
        <br />
        Bespoke development advisory and consulting services may be directed to:
        <br />
        Katya Araneta, <a href="mailto:katya.araneta@gmail.com" className="hover:text-corporate-900 underline decoration-corporate-300 underline-offset-2 transition-colors">katya.araneta@gmail.com</a>
      </>
    )
  },
  { 
    question: "Does Facilities, Inc., handle interior fit-outs?", 
    answer: (
      <>
        Facilities, Inc., may coordinate interior fit-outs where required.
        <br />
        All construction and design work is carried out by third-party professionals.
      </>
    )
  },
  { 
    question: "What properties does Facilities, Inc., currently operate?", 
    answer: (
      <>
        Facilities, Inc., currently operates units within:
        <ul className="list-disc pl-5 my-2 space-y-1">
          <li>Summit One Tower, Mandaluyong City</li>
          <li>Facilities Centre, Mandaluyong City</li>
        </ul>
        Additional properties may be added as operations expand.
      </>
    )
  },
  { 
    question: "Who should contact Facilities, Inc.?", 
    answer: (
      <>
        Facilities, Inc., is the appropriate contact for:
        <ul className="list-disc pl-5 my-2 space-y-1">
          <li>Tenants occupying managed units</li>
          <li>Brokers and leasing agents coordinating on managed units</li>
          <li>Utilities, service providers, and relevant local authorities</li>
        </ul>
      </>
    )
  },
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

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeMenu();
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#181852] border-b border-[#E6EAF2]/10 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a 
          href="#"
          onClick={scrollToTop}
          className="font-serif text-2xl text-[#E6EAF2] font-medium tracking-tight opacity-95"
        >
          Facilities, Incorporated
        </a>
        
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
    <div className="max-w-5xl mx-auto w-full pt-16 pb-20 md:pt-20 md:pb-28">
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
              Facilities, Inc., is a family-owned operating company established in 1960.
              The company is responsible for the day-to-day operation of selected commercial units within Mandaluyong-based properties.
            </p>
            <p className="text-lg text-corporate-600 leading-relaxed">
              Facilities, Inc., currently operates units within Summit One Tower and Facilities Centre, with operations expanding beyond Metro Manila.
            </p>
            
            <p className="text-lg font-serif italic text-corporate-400 mt-12 mb-8">
              Quality has no substitute.
            </p>

            <div className="pt-8">
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
        Why Facilities, Inc.
      </h2>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
      {whyItems.map((item, idx) => (
        <div key={idx} className="space-y-4">
          <h3 className="text-base font-bold text-corporate-900 tracking-widest uppercase opacity-90">
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
             <span className="block text-6xl md:text-7xl font-serif text-corporate-200 leading-none mb-6 -mt-2">
              {op.step}
            </span>
            <h3 className="text-2xl md:text-3xl font-serif text-corporate-800 leading-tight">
              {op.title}
            </h3>
          </div>
          
          {/* Right Column: Divider & Description */}
          <div className="w-full md:w-7/12 md:border-l border-corporate-200 md:pl-12">
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
            src="https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=1000&auto=format&fit=crop" 
            alt="Summit One Tower Detail"
            className="w-full h-full object-cover"
          />
        </div>
        
        <figcaption className="space-y-6 max-w-2xl">
           <div className="space-y-1">
              <h3 className="text-3xl md:text-4xl font-serif text-corporate-900 mb-1">Summit One Tower</h3>
              <div className="text-lg text-corporate-500 font-medium space-y-0.5">
                <p>High-rise commercial tower</p>
              </div>
            </div>
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
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop" 
            alt="Facilities Centre Frontage"
            className="w-full h-full object-cover"
          />
        </div>

        <figcaption className="space-y-6 max-w-2xl">
           <div className="space-y-1">
              <h3 className="text-3xl md:text-4xl font-serif text-corporate-900 mb-1">Facilities Centre</h3>
              <div className="text-lg text-corporate-500 font-medium space-y-0.5">
                <p>Low-rise commercial arcade</p>
              </div>
            </div>
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
      {/* Consistent header with no margin bottom, matching WhyUs style (pb-4) */}
      <div className="border-b border-corporate-200 pb-4">
        <h2 className="text-3xl md:text-4xl font-serif text-corporate-900">Frequently Asked Questions</h2>
      </div>
      
      {/* FAQ List */}
      <div className="">
        {faqs.map((faq, idx) => (
          /* Item border: border-corporate-200 */
          <div key={idx} className="border-b border-corporate-200">
            <button 
              onClick={() => toggle(idx)}
              // Added spellCheck={false} to button to prevent browser spellcheck artifacts on "fit-outs"
              spellCheck={false}
              // Reduced top padding for the first item (pt-3) to remove the gap between the header line and the first question
              className={`w-full flex items-start justify-between text-left focus:outline-none group ${idx === 0 ? 'pt-3 pb-6' : 'py-6'}`}
              aria-expanded={openIndex === idx}
            >
              {/* Increased size to text-xl, added no-underline to ensure no text decoration */}
              <span className="text-xl text-corporate-700 font-normal pr-8 leading-relaxed group-hover:text-corporate-900 transition-colors no-underline">
                {faq.question}
              </span>
              {/* Institutional Navy Plus Icon - muted to 300/500 */}
              <span className="text-corporate-400 mt-1 flex-shrink-0 group-hover:text-corporate-600 transition-colors">
                {openIndex === idx ? <Minus size={20} /> : <Plus size={20} />}
              </span>
            </button>
            {openIndex === idx && (
              <div className="pb-6 pr-8 text-corporate-500 text-base leading-relaxed">
                {/* Changed from <p> wrapper to direct render to support JSX structure in answers */}
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
};

const Contact: React.FC = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      const data = await response.json();

      if (data.ok) {
        alert('Thank you. Your inquiry has been sent.');
        form.reset();
      } else {
        alert(data.error || 'Please fill out all required fields.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error sending your inquiry. Please try again.');
    }
  };

  return (
    <Section
      id="contact"
      className="bg-white border-t border-corporate-200 md:!py-12 lg:!py-32"
    >
      <div className="border-b border-corporate-200 mb-16 pb-4">
        <h2 className="text-3xl md:text-4xl font-serif text-corporate-900">
          Contact
        </h2>
      </div>

      {/* ONE form, functioning as the grid container */}
      <form
        className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-[auto_auto_auto] gap-16 md:gap-24 items-start"
        onSubmit={handleSubmit}
      >
        {/* --- RIGHT COLUMN GROUPS (Form Fields) --- */}
        {/* DOM Order 1: Name + Company -> Desktop Row 1 Right */}
        <div className="md:col-span-8 md:col-start-5 md:row-start-1 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-2">
            <label htmlFor="name" className="text-xs font-bold text-corporate-400 uppercase tracking-widest">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Full Name"
              className="w-full py-3 bg-transparent border-b border-corporate-200 focus:border-corporate-900 text-corporate-900 focus:outline-none transition-colors text-lg placeholder-corporate-300 font-light"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="company" className="text-xs font-bold text-corporate-400 uppercase tracking-widest">
              Company
            </label>
            <input
              type="text"
              id="company"
              name="company"
              placeholder="Organization Name"
              className="w-full py-3 bg-transparent border-b border-corporate-200 focus:border-corporate-900 text-corporate-900 focus:outline-none transition-colors text-lg placeholder-corporate-300 font-light"
            />
          </div>
        </div>

        {/* DOM Order 2: Email -> Desktop Row 2 Right */}
        <div className="md:col-span-8 md:col-start-5 md:row-start-2 space-y-2">
          <label htmlFor="email" className="text-xs font-bold text-corporate-400 uppercase tracking-widest">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="name@company.com"
            className="w-full py-3 bg-transparent border-b border-corporate-200 focus:border-corporate-900 text-corporate-900 focus:outline-none transition-colors text-lg placeholder-corporate-300 font-light"
          />
        </div>

        {/* DOM Order 3: Inquiry + Button -> Desktop Row 3 Right */}
        {/* Grouping textarea and button together */}
        <div className="md:col-span-8 md:col-start-5 md:row-start-3 grid gap-12">
          <div className="space-y-2">
            <label htmlFor="message" className="text-xs font-bold text-corporate-400 uppercase tracking-widest">
              Inquiry
            </label>
            <textarea
              id="message"
              name="message"
              rows={8}
              placeholder="How can we assist you?"
              className="w-full py-3 bg-transparent border-b border-corporate-200 focus:border-corporate-900 text-corporate-900 focus:outline-none transition-colors resize-none text-lg placeholder-corporate-300 font-light"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-10 py-4 bg-transparent border border-corporate-300 text-corporate-900 text-sm font-medium hover:border-corporate-900 transition-colors duration-300 tracking-wide"
            >
              Submit Inquiry
            </button>
          </div>
        </div>

        {/* --- LEFT COLUMN GROUPS (Info) --- */}
        {/* DOM Order 4: Head Office -> Desktop Row 1 Left */}
        <div className="md:col-span-4 md:col-start-1 md:row-start-1 space-y-4">
          <h3 className="text-xs font-bold text-corporate-400 uppercase tracking-widest">
            Head Office
          </h3>
          <p className="text-lg text-corporate-700 leading-relaxed font-serif">
            23/F Summit One Tower<br />
            530 Shaw Boulevard<br />
            Mandaluyong City 1552<br />
            Philippines
          </p>
        </div>

        {/* DOM Order 5: Email Info -> Desktop Row 2 Left */}
        <div className="md:col-span-4 md:col-start-1 md:row-start-2 space-y-4">
          <h3 className="text-xs font-bold text-corporate-400 uppercase tracking-widest">
            Email
          </h3>
          <div className="text-lg text-corporate-700 leading-relaxed font-serif">
            <a
              href="mailto:mercy.laurenciano@gmail.com"
              className="hover:text-corporate-900 underline decoration-corporate-200 underline-offset-4 transition-colors"
            >
              mercy.laurenciano@gmail.com
            </a>
          </div>
        </div>

        {/* DOM Order 6: Property Inquiries -> Desktop Row 3 Left */}
        <div className="md:col-span-4 md:col-start-1 md:row-start-3 space-y-4">
          <h3 className="text-xs font-bold text-corporate-400 uppercase tracking-widest">
            Property Inquiries
          </h3>
          <div className="text-lg text-corporate-700 leading-relaxed font-serif space-y-6">
            <div>
              <span className="block font-medium text-corporate-900">
                Sylvia
              </span>
              <span className="block text-corporate-600">
                +63 917 523 8157
              </span>
            </div>
            <div>
              <span className="block font-medium text-corporate-900">
                Mercy
              </span>
              <span className="block text-corporate-600">
                +63 933 538 3815
              </span>
            </div>
          </div>
        </div>

      </form>
    </Section>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-[#181852] text-[#C9D2E3] py-12">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center opacity-80 text-xs tracking-widest uppercase">
      <p>
        &copy; {new Date().getFullYear()} Facilities, Incorporated. All rights reserved.
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