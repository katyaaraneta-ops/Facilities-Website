import React, { useState, useEffect } from 'react';
import { Section } from './components/Section';
import { Plus, Minus, Menu, X, Heart, Maximize2, Layout, Building2, ArrowLeft } from 'lucide-react';
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
    question: "What does Facilities do?", 
    answer: (
      <>
        Facilities operates specific commercial units within properties under its care.
        <br />
        Our role focuses on day-to-day unit-level operations, coordination, and administration.
      </>
    )
  },
  { 
    question: "Does Facilities manage entire buildings?", 
    answer: "Facilities operates identified units only, not entire buildings or third-party portfolios." 
  },
  { 
    question: "Is Facilities a real estate broker?", 
    answer: (
      <>
        Facilities does not act as a real estate broker.
        <br />
        However, Facilities works with brokers and leasing agents in relation to units under its operation. Parties interested in working with our available units may contact us to coordinate listings, viewings, or leasing discussions.
      </>
    )
  },
  { 
    question: "Does Facilities market property to the public?", 
    answer: (
      <>
        Facilities may market its own managed units where required.
        <br />
        It does not market property on behalf of third parties.
      </>
    )
  },
  { 
    question: "Does Facilities sell property?", 
    answer: (
      <>
        Facilities does not sell property. Residential house-and-lot offerings in Lipa are handled by our sister company, ADEL.
        <br />
        <span className="italic">(Coming soon.)</span>
      </>
    )
  },
  { 
    question: "Does Facilities provide design or architectural services?", 
    answer: (
      <>
        Facilities does not provide architectural or design services.
        <br />
        Bespoke development advisory and consulting services may be directed to:
        <br />
        Katya Araneta, <a href="mailto:katya.araneta@gmail.com" className="hover:text-corporate-900 underline decoration-corporate-300 underline-offset-2 transition-colors">katya.araneta@gmail.com</a>
      </>
    )
  },
  { 
    question: "Does Facilities handle interior fit-outs?", 
    answer: (
      <>
        Facilities may coordinate interior fit-outs where required.
        <br />
        All construction and design work is carried out by third-party professionals.
      </>
    )
  },
  { 
    question: "What properties does Facilities currently operate?", 
    answer: (
      <>
        Facilities currently operates units within:
        <ul className="list-disc pl-5 my-2 space-y-1">
          <li>Summit One Tower, Mandaluyong City</li>
          <li>Facilities Centre, Mandaluyong City</li>
        </ul>
        Additional properties may be added as operations expand.
      </>
    )
  },
  { 
    question: "Who should contact Facilities?", 
    answer: (
      <>
        Facilities is the appropriate contact for:
        <ul className="list-disc pl-5 my-2 space-y-1">
          <li>Tenants occupying managed units</li>
          <li>Brokers and leasing agents coordinating on managed units</li>
          <li>Utilities, service providers, and relevant local authorities</li>
        </ul>
      </>
    )
  },
];

// --- Listing Data ---

interface PropertyUnit {
  id: string;
  title: string;
  price: string;
  location: string;
  area: string;
  type: string;
  condition: string;
  imageUrl: string;
}

const summitUnits: PropertyUnit[] = [
  {
    id: "S-1201",
    title: "Unit 1201 - Executive Suite",
    price: "₱85,000 / mo",
    location: "Summit One Tower, Level 12",
    area: "125 sqm",
    type: "Office",
    condition: "Fully Fitted",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "S-2305",
    title: "Unit 2305 - Open Plan",
    price: "₱45,000 / mo",
    location: "Summit One Tower, Level 23",
    area: "85 sqm",
    type: "Office",
    condition: "Warm Shell",
    imageUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "S-3402",
    title: "Unit 3402 - Corner Unit",
    price: "₱110,000 / mo",
    location: "Summit One Tower, Level 34",
    area: "150 sqm",
    type: "Office",
    condition: "Bare Shell",
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c54be3855485?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "S-1504",
    title: "Unit 1504 - Standard Office",
    price: "₱60,000 / mo",
    location: "Summit One Tower, Level 15",
    area: "100 sqm",
    type: "Office",
    condition: "Semi-Fitted",
    imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop"
  },
];

const facilitiesUnits: PropertyUnit[] = [
  {
    id: "F-G02",
    title: "Unit G-02 - Retail Space",
    price: "₱150,000 / mo",
    location: "Facilities Centre, Ground Floor",
    area: "75 sqm",
    type: "Retail",
    condition: "Bare Shell",
    imageUrl: "https://images.unsplash.com/photo-1582037928769-181f242afcf8?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "F-301",
    title: "Unit 301 - Admin Office",
    price: "₱25,000 / mo",
    location: "Facilities Centre, Level 3",
    area: "40 sqm",
    type: "Office",
    condition: "Fitted",
    imageUrl: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "F-505",
    title: "Unit 505 - Storage / Ops",
    price: "₱35,000 / mo",
    location: "Facilities Centre, Level 5",
    area: "60 sqm",
    type: "Flex",
    condition: "Warm Shell",
    imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop"
  },
];

// --- Components ---

interface HeaderProps {
  onNavigateHome: () => void;
  currentPage: 'landing' | 'listings';
}

const Header: React.FC<HeaderProps> = ({ onNavigateHome, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleNavClick = (targetId: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (currentPage === 'listings') {
      onNavigateHome();
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    closeMenu();
  };

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onNavigateHome();
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
          <a href="#why" onClick={handleNavClick("why")} className="hover:text-[#C9D2E3] transition-colors duration-300">Why Facilities</a>
          <a href="#operate" onClick={handleNavClick("operate")} className="hover:text-[#C9D2E3] transition-colors duration-300">How We Operate</a>
          <a href="#assets" onClick={handleNavClick("assets")} className="hover:text-[#C9D2E3] transition-colors duration-300">Assets</a>
          <a href="#faq" onClick={handleNavClick("faq")} className="hover:text-[#C9D2E3] transition-colors duration-300">FAQ</a>
          <a href="#contact" onClick={handleNavClick("contact")} className="hover:text-[#C9D2E3] transition-colors duration-300">Contact</a>
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
              onClick={handleNavClick("why")}
              className="text-[#E6EAF2] text-lg font-medium tracking-wide hover:text-[#C9D2E3] transition-colors"
            >
              Why Facilities
            </a>
            <a 
              href="#operate" 
              onClick={handleNavClick("operate")}
              className="text-[#E6EAF2] text-lg font-medium tracking-wide hover:text-[#C9D2E3] transition-colors"
            >
              How We Operate
            </a>
            <a 
              href="#assets" 
              onClick={handleNavClick("assets")}
              className="text-[#E6EAF2] text-lg font-medium tracking-wide hover:text-[#C9D2E3] transition-colors"
            >
              Assets
            </a>
            <a 
              href="#faq" 
              onClick={handleNavClick("faq")}
              className="text-[#E6EAF2] text-lg font-medium tracking-wide hover:text-[#C9D2E3] transition-colors"
            >
              FAQ
            </a>
            <a 
              href="#contact" 
              onClick={handleNavClick("contact")}
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

const ListingPage: React.FC<{ propertyName: string; units: PropertyUnit[]; onBack: () => void }> = ({ propertyName, units, onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-6 pt-12">
        
        {/* Breadcrumb / Back */}
        <button 
          onClick={onBack}
          className="flex items-center text-corporate-500 hover:text-corporate-900 transition-colors mb-8 text-sm font-medium tracking-wide uppercase group"
        >
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Overview
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-8 border-b border-corporate-100 pb-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-serif text-corporate-900 tracking-tight">
              {propertyName}
            </h1>
            <p className="text-corporate-500">
              We found <span className="font-semibold text-corporate-900">{units.length}</span> units available
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 relative">
            <label className="text-sm text-corporate-500 mr-2">Sort By:</label>
            <select className="text-sm font-medium text-corporate-900 bg-transparent border-none focus:ring-0 cursor-pointer pr-8">
              <option>Default</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Area: Low to High</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {units.map((unit) => (
            <div key={unit.id} className="group cursor-pointer flex flex-col">
              {/* Image Card */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-corporate-100 mb-4">
                <img 
                  src={unit.imageUrl} 
                  alt={unit.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Heart Icon Overlay */}
                <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-corporate-400 hover:text-red-500 transition-colors shadow-sm">
                  <Heart size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-corporate-900 leading-tight">
                    {unit.title}
                  </h3>
                  <span className="text-lg font-bold text-corporate-900 whitespace-nowrap ml-4">
                    {unit.price}
                  </span>
                </div>
                
                <p className="text-sm text-corporate-500 font-medium">
                  {unit.location}
                </p>

                {/* Specs Divider */}
                <div className="h-px bg-corporate-100 w-full my-2"></div>

                {/* Specs Icons */}
                <div className="flex items-center gap-6 text-sm text-corporate-600">
                   <div className="flex items-center gap-2">
                      <Maximize2 size={16} className="text-corporate-400" />
                      <span>{unit.area}</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <Layout size={16} className="text-corporate-400" />
                      <span>{unit.type}</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-corporate-400" />
                      <span>{unit.condition}</span>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State Fallback if needed */}
        {units.length === 0 && (
           <div className="py-24 text-center">
             <p className="text-xl text-corporate-400 font-serif italic">No units currently listed.</p>
           </div>
        )}
      </div>
    </div>
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

interface AssetsProps {
  onViewSummit: () => void;
  onViewFacilities: () => void;
}

const Assets: React.FC<AssetsProps> = ({ onViewSummit, onViewFacilities }) => {
  return (
    <Section id="assets" className="bg-white border-t border-corporate-200">
      <div className="border-b border-corporate-200 mb-16 pb-4">
        <h2 className="text-3xl md:text-4xl font-serif text-corporate-900">
          Assets Under Operation
        </h2>
      </div>

      <div className="space-y-24 md:space-y-32">
        {/* Asset 1: Summit One Tower */}
        <figure 
          className="flex flex-col gap-8 group cursor-pointer"
          onClick={onViewSummit}
        >
          {/* Adjusted aspect ratio for landscape image */}
          <div className="w-full bg-corporate-100 overflow-hidden relative aspect-[16/9]">
            <img
              src="https://lh3.googleusercontent.com/pw/AP1GczPOXR3hdFc1ofHAfXjC-SPo8tZOmQwLmLzLJOPg3k0nNbUQmwZoJT_6iyXGy-ci77jZt_DmECvXkXwKTULOzzYWWZCFeeSeDMolcDe4A1aj2LJlZaxfaMi45v6JfZS3voOGnDOpk41JnBmpBAjNZjHE1qegsX0xLL6S87jmgVTxnBPEUloF1EOC5aSKmhhQtH7ZEBatWmp1fGhHkCJoqPm_IF-noX-Aj5oS2CoDvL17OPqGv7JUemOfMYhnxK9KKVKunE72Zz-Txl4UrRFnaHvWGBNva-1IOK__2lYyNHXJeOihXd9BA21_iQ47vA5v8kQk4aF4ICAQwPCXCQ9DbOk4PlD5KYEdAncnD1uw_gA3QddlJCaveTa22vx_mdPAAQiJQHCQv4ubDNjJIRIKatrJowlHVto4RybuloW1hVWphARyDtyPSlOemv9zuTKQH_449mebBDCPa4qPGBb_qtv6pHD4adtQmzyGVmG9nLAFTX7bFXwWF8o7nZFXQQQHx8rHwgVRqC7xWtUZr51YkQXfD4HcK2ayDynTehrPKMTxkQT9W3HBCNb6uZjtxLrjBqdqVhOkt8fjUhVilDFSmSy48VdT0i-4Dae-Mi8KDPciyMGe49Vri2jjNRZvnuhgO0_tZ8Lb42pNvBaKIZmHxyp6Dug58dPYZiE2vtZNkw4-YOTNZoR_EdYOXDW2f7F6h2I5-Ftl0J4qaGghFc_EXy84nYGC3wBXdUph3Ug3lzBUkM_zaIRsDxwg00wHzaSao8GNTWxLv5-sn-ctbDHyZdz-GMnQkmwXXJVrM8JVGkTOrk_OrvjRGfysYprb7geeS5qecAFHyEvxB9vBGxMTbkFUqbh89U5Bv3VcUTyYaNY8jxy-gHZbvXJ1z_tI_n-5WxAckWF6eL6BmNZFSifEJH90pJaORMveJcL-NorpRZWVV6n-masLCm4=w1397-h937-s-no?authuser=0"
              alt="Summit One Tower Exterior"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Hover indication overlay */}
            <div className="absolute inset-0 bg-corporate-900/0 group-hover:bg-corporate-900/10 transition-colors duration-300 flex items-center justify-center">
               <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-corporate-900 px-6 py-3 text-sm font-medium tracking-widest uppercase transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                 View Available Units
               </span>
            </div>
          </div>

          <figcaption className="space-y-6 max-w-2xl">
            <div className="space-y-1">
              <h3 className="text-3xl md:text-4xl font-serif text-corporate-900 mb-1 group-hover:text-corporate-700 transition-colors">
                Summit One Tower
              </h3>
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
        <figure 
           className="flex flex-col gap-8 group cursor-pointer"
           onClick={onViewFacilities}
        >
          {/* Landscape aspect ratio suits the wide structure */}
          <div className="w-full bg-corporate-100 overflow-hidden relative aspect-[16/9]">
            <img
              src="https://lh3.googleusercontent.com/pw/AP1GczNolR0s_EuXFL5dt40X1xZsc7KoNNO8ibUGh92fW8rOHMXB-Jkm-UBdfVMNZQv8OhpDMpEa7EpP6sP498cZnx5Z5C7mHjaUsb6UU6_BEGbetCgaOIWSbnWMHbQzAMWGuKRiCLGmwHxEPrzCbNbFdX4LqKmiTxaRTePlSusOuUGs-te_DvESFEZWNtrLQ_BIAJcdpGAhD67B586h3seCEoA5Frc4LTp1L61e92rxPruFJYL82cpDo-4MI0PVAZRC9VNHn30WFo5wTNfzjzsdIFXzFVqbmIQhCofkqQI5G3xyEQ0xYsky7vq0Ciud3U8QpKoh8Dg2jHZbd9IRUJw9nrYkZOFqoBPi9mDPOkE3l8F1bAm-Ju-7S9z6VTqn_tpXUMp2sE1HlHNtcvxoBqOHr6pz7DRwBw6W8tt5IGUCYb2BiQe6Irchr_xuIU8A1O2ebHg1FV0SdYYn3MKNCwSRub62vHFuPY304UBnRW3m98W_DPo0uahbGolgrtHY60lmuU7MLIzLluoxzn7DozISU7b8r04kaemznqmTkwJ9brEnrtQ8cfkCpupoeNsFPMah8rtW51ttADtJLk1NOuoeKJqUUxqwajkx2VUuTV3iJ7cQVL-6RChUFVBnOZfsU61Em3E3bb9dtHoRQ2TFpaHlP_2plrDsL6ulLHUfZ54hfDyen0OqDxVtWIllmg1w9BBCcpwRYxcYyxz6-_A6qgwuhtDZUw33l0K7IWIy9DzTcKqXNb8RAXvoIt4xyexf0TGrNIeochBsbQTr895fogX76c0j1OkukFpHNWTRLtnhoIJyWvq_FkH_YVfYd4QhkAc4KlX460z87E6xktfObjwvqV810Kzn0x8sz2UKdcFoB-SQXKZxJuaTJSt2szdigvU32uuB2QZ1z1t4LRx2TqrE5eTu8aeou4HXod4znZllnvSjwJyw08S5s80=w403-h220-no?authuser=0"
              alt="Facilities Centre Frontage"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Hover indication overlay */}
            <div className="absolute inset-0 bg-corporate-900/0 group-hover:bg-corporate-900/10 transition-colors duration-300 flex items-center justify-center">
               <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-corporate-900 px-6 py-3 text-sm font-medium tracking-widest uppercase transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                 View Available Units
               </span>
            </div>
          </div>

          <figcaption className="space-y-6 max-w-2xl">
            <div className="space-y-1">
              <h3 className="text-3xl md:text-4xl font-serif text-corporate-900 mb-1 group-hover:text-corporate-700 transition-colors">
                Facilities Centre
              </h3>
              <div className="text-lg text-corporate-500 font-medium space-y-0.5">
                <p>Low-rise commercial arcade</p>
              </div>
            </div>
            <p className="text-lg text-corporate-600 leading-relaxed">
              A dedicated commercial structure adjacent to key transport hubs. Our operations focus on commercial units and retail spaces, prioritizing accessibility and efficient utility management for tenants.
            </p>
          </figcaption>
        </figure>

        {/* Asset 3: Palladium Village - No interaction requested for this one */}
        <figure className="flex flex-col gap-8 group">
          <div className="w-full bg-corporate-100 overflow-hidden relative aspect-[16/9]">
            <img
              src="https://images.unsplash.com/photo-1592595896551-12b371d546d5?q=80&w=1600&auto=format&fit=crop"
              alt="Palladium Village"
              className="w-full h-full object-cover"
            />
          </div>

          <figcaption className="space-y-6 max-w-2xl">
            <div className="space-y-1">
              <h3 className="text-3xl md:text-4xl font-serif text-corporate-900 mb-1">
                Palladium Village
              </h3>
              <div className="text-lg text-corporate-500 font-medium space-y-0.5">
                <p>Private subdivision</p>
              </div>
            </div>
            <p className="text-lg text-corporate-600 leading-relaxed">
              This exclusive, low-density residential community is located along Shaw Boulevard in Brgy. Highway Hills, Mandaluyong City, directly across from Wack Wack Golf and Country Club. It is known for its intimate, secure setting with only about 65 houses, making it a highly desirable, quiet neighborhood in a prime, central location.
            </p>
          </figcaption>
        </figure>
      </div>
    </Section>
  );
};

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
  const [isSending, setIsSending] = useState(false);

  // Netlify expects URL-encoded form bodies for JS submits
  const encode = (data: Record<string, string>) =>
    Object.keys(data)
      .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key] ?? ''))
      .join('&');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Pull values from the form
    const formData = new FormData(form);
    const payload: Record<string, string> = {
      'form-name': 'contact', // MUST match form name below
      name: String(formData.get('name') ?? ''),
      company: String(formData.get('company') ?? ''),
      email: String(formData.get('email') ?? ''),
      message: String(formData.get('message') ?? ''),
    };

    // Basic client-side validation
    if (!payload.name || !payload.email || !payload.message) {
      alert('Please fill out Name, Email Address, and Inquiry.');
      return;
    }

    try {
      setIsSending(true);

      // IMPORTANT: POST to "/" for Netlify Forms
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode(payload),
      });

      if (!res.ok) throw new Error('Submission failed');

      alert('Thank you. Your inquiry has been sent.');
      form.reset();
    } catch (err) {
      console.error('Netlify form submit error:', err);
      alert('There was an error sending your inquiry. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Section
      id="contact"
      className="bg-white border-t border-corporate-200 md:!py-12 lg:!py-32"
    >
      <div className="border-b border-corporate-200 mb-16 lg:mb-8 pb-4">
        <h2 className="text-3xl md:text-4xl font-serif text-corporate-900">
          Contact
        </h2>
      </div>

      {/* NOTE: netlify attributes + hidden form-name input are required */}
      <form
        name="contact"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-[auto_auto_auto] gap-12 lg:gap-24 items-start"
      >
        {/* Netlify required hidden fields */}
        <input type="hidden" name="form-name" value="contact" />
        <p className="hidden">
          <label>
            Don’t fill this out: <input name="bot-field" />
          </label>
        </p>

        {/* --- RIGHT COLUMN GROUPS (Form Fields) --- */}
        <div className="lg:col-span-8 lg:col-start-5 lg:row-start-1 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-2 lg:space-y-4">
            <label htmlFor="name" className="text-xs font-bold text-corporate-400 uppercase tracking-widest">
              Name
            </label>
            <div className="w-full border-b border-corporate-200 focus-within:border-corporate-900 transition-colors">
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Full Name"
                required
                className="w-full py-3 bg-transparent border-none focus:ring-0 text-corporate-900 focus:outline-none placeholder-corporate-300 font-light text-lg block appearance-none"
              />
            </div>
          </div>

          <div className="space-y-2 lg:space-y-4">
            <label htmlFor="company" className="text-xs font-bold text-corporate-400 uppercase tracking-widest">
              Company
            </label>
            <div className="w-full border-b border-corporate-200 focus-within:border-corporate-900 transition-colors">
              <input
                type="text"
                id="company"
                name="company"
                placeholder="Organization Name"
                className="w-full py-3 bg-transparent border-none focus:ring-0 text-corporate-900 focus:outline-none placeholder-corporate-300 font-light text-lg block appearance-none"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 lg:col-start-5 lg:row-start-2 space-y-2 lg:space-y-4">
          <label htmlFor="email" className="text-xs font-bold text-corporate-400 uppercase tracking-widest">
            Email Address
          </label>
          <div className="w-full border-b border-corporate-200 focus-within:border-corporate-900 transition-colors">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="name@company.com"
              required
              className="w-full py-3 bg-transparent border-none focus:ring-0 text-corporate-900 focus:outline-none placeholder-corporate-300 font-light text-lg block appearance-none"
            />
          </div>
        </div>

        <div className="lg:col-span-8 lg:col-start-5 lg:row-start-3 grid gap-8 lg:gap-12">
          <div className="space-y-2 lg:space-y-4">
            <label htmlFor="message" className="text-xs font-bold text-corporate-400 uppercase tracking-widest">
              Inquiry
            </label>
            <div className="w-full border-b border-corporate-200 focus-within:border-corporate-900 transition-colors">
              <textarea
                id="message"
                name="message"
                rows={8}
                placeholder="How can we assist you?"
                required
                className="w-full py-3 bg-transparent border-none focus:ring-0 text-corporate-900 focus:outline-none placeholder-corporate-300 font-light text-lg resize-none block appearance-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSending}
              className="px-10 py-4 bg-transparent border border-corporate-300 text-corporate-900 text-sm font-medium hover:border-corporate-900 transition-colors duration-300 tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? 'Sending…' : 'Submit Inquiry'}
            </button>
          </div>
        </div>

        {/* --- LEFT COLUMN GROUPS (Info) --- */}
        <div className="lg:col-span-4 lg:col-start-1 lg:row-start-1 space-y-4">
          <h3 className="text-xs font-bold text-corporate-400 uppercase tracking-widest">
            Head Office
          </h3>
          <p className="text-lg text-corporate-700 leading-relaxed font-serif lg:pt-3">
            23/F Summit One Tower<br />
            530 Shaw Boulevard<br />
            Mandaluyong City 1552<br />
            Philippines
          </p>
        </div>

        <div className="lg:col-span-4 lg:col-start-1 lg:row-start-2 space-y-4">
          <h3 className="text-xs font-bold text-corporate-400 uppercase tracking-widest">
            Email
          </h3>
          <div className="text-lg text-corporate-700 leading-relaxed font-serif lg:pt-3">
            <a
              href="mailto:mercy.laurenciano@gmail.com"
              className="hover:text-corporate-900 underline decoration-corporate-200 underline-offset-4 transition-colors"
            >
              mercy.laurenciano@gmail.com
            </a>
          </div>
        </div>

        <div className="lg:col-span-4 lg:col-start-1 lg:row-start-3 space-y-4">
          <h3 className="text-xs font-bold text-corporate-400 uppercase tracking-widest">
            Property Inquiries
          </h3>
          <div className="text-lg text-corporate-700 leading-relaxed font-serif space-y-6 lg:pt-3">
            <div>
              <span className="block font-medium text-corporate-900">Sylvia</span>
              <span className="block text-corporate-600">+63 917 523 8157</span>
            </div>
            <div>
              <span className="block font-medium text-corporate-900">Mercy</span>
              <span className="block text-corporate-600">+63 933 538 3815</span>
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
  const [view, setView] = useState<'landing' | 'summit' | 'facilities'>('landing');

  // Helper to render current view content
  const renderView = () => {
    if (view === 'summit') {
      return (
        <ListingPage 
          propertyName="Summit One Tower" 
          units={summitUnits} 
          onBack={() => setView('landing')} 
        />
      );
    }
    if (view === 'facilities') {
      return (
        <ListingPage 
          propertyName="Facilities Centre" 
          units={facilitiesUnits} 
          onBack={() => setView('landing')} 
        />
      );
    }
    // Landing View
    return (
      <>
        <Hero />
        <WhyUs />
        <Operations />
        <Assets 
          onViewSummit={() => setView('summit')}
          onViewFacilities={() => setView('facilities')}
        />
        <FAQ />
        <Contact />
      </>
    );
  };

  return (
    <div className="antialiased min-h-screen bg-corporate-50 font-sans text-corporate-600">
      <Header 
        onNavigateHome={() => setView('landing')} 
        currentPage={view === 'landing' ? 'landing' : 'listings'}
      />
      <main>
        {renderView()}
      </main>
      <Footer />
    </div>
  );
}