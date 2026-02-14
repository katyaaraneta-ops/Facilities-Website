import React, { useState, useEffect, useCallback } from 'react';
import { Section } from './components/Section';
import { Plus, Minus, Menu, X, Maximize2, Layout, Building2, ArrowLeft, ChevronDown, Check, Phone, Mail, MapPin, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { WhyItem, OperationStep, FAQItem } from './types';
import { supabase } from './supabaseClient';
import { LoginPage } from './LoginPage';
import { AdminDashboard } from './AdminDashboard';

// --- Data Definitions ---

const whyItems: WhyItem[] = [
  {
    title: "Established Continuity",
    description: "Operating since 1960, with over six decades of continuous experience in the Philippine commercial real estate market."
  },
  {
    title: "Fiscal Discipline",
    description: "Conservative financial management focused on asset preservation and operational stability."
  },
  {
    title: "Direct On-Site Operations",
    description: "Our flagship operations at Summit One Tower and Facilities Centre demonstrate a hands-on management model engineered for deployment across any Philippine location."
  },
  {
    title: "Tenant Interface",
    description: "A legacy defined by high-quality tenant relationships, exceptional long-tenancy records, and consistently high customer satisfaction ratings."
  },
  {
    title: "Utilities Coordination",
    description: "Coordination of power, water, and telecommunications services for managed units."
  },
  {
    title: "Regulatory & LGU Liaison",
    description: "Expert handling of compliance and administrative requirements, bridging the gap between property owners and Local Government Units (LGUs) nationwide."
  },
];

const operations: OperationStep[] = [
  { 
    step: "01", 
    title: "Asset Acquisition & Review", 
    description: "We evaluate assets through the lens of a developer. Whether through joint ventures or direct acquisition, we verify title integrity and zoning adherence to ensure long-term growth for small to medium-rise commercial centers." 
  },
  { step: "02", title: "Tenant Fit-Out Coordination", description: "We oversee the transition from bare shell to operational workspace. Our team coordinates directly with contractors to ensure building codes and safety standards are strictly met." },
  { step: "03", title: "Utilities & Compliance", description: "We coordinate directly with utility providers and relevant local authorities to support the ongoing operation of managed units." },
  { step: "04", title: "Compliance & Administration", description: "We support unit-level administrative processes through coordination with relevant parties, where applicable." },
];

const faqs: FAQItem[] = [
  {
    question: "What does Facilities do?",
    answer: (
      <>
        Facilities, Inc. is a premier real estate developer and asset management firm. We execute comprehensive strategies focused on operational efficiency, asset preservation, and long-term value for properties across the Philippines.
      </>
    )
  },
  {
    question: "Does Facilities manage entire buildings?",
    answer: "Yes. Our management model is scalable and ready for building-level operations nationwide. We focus on maintaining high-performance standards for both specific portfolios and entire commercial assets."
  },
  {
    question: "Is Facilities a real estate broker?",
    answer: (
      <>
        Facilities, Inc. is a premier real estate developer and operating company. While we are not a brokerage, we maintain a successful lease business, owning and managing significant portions of our commercial portfolio to ensure the highest standards of tenant care.
      </>
    )
  },
  {
    question: "Does Facilities market property to the public?",
    answer: (
      <>
        Our marketing activities are strictly limited to the assets within our managed portfolio.
        <br />
        We focus on strategic tenant acquisition and retention to maintain optimal occupancy levels for the properties we operate.
      </>
    )
  },
  {
    question: "Does Facilities sell property?",
    answer: (
      <>
        We primarily focus on long-term development and asset preservation. Inquiries regarding residential land banks are handled by our dedicated development arms.
      </>
    )
  },
  {
    question: "Does Facilities provide design or architectural services?",
    answer: (
      <>
        We provide technical oversight and operational compliance. For architectural design and development advisory, we coordinate with specialized partners to align physical infrastructure with high operational standards. Contact Katya (<a href="mailto:katya.araneta@gmail.com" className="hover:text-corporate-900 underline decoration-corporate-300 underline-offset-2 transition-colors">katya.araneta@gmail.com</a>) for further details.
      </>
    )
  },
  {
    question: "Does Facilities handle interior fit-outs?",
    answer: (
      <>
        We act as the owner’s representative during the fit-out phase.
        <br />
        We enforce strict compliance with building codes and operational standards, supervising third-party contractors to protect the asset’s structural integrity.
      </>
    )
  },
  {
    question: "What properties does Facilities currently operate?",
    answer: (
      <>
        Our portfolio is anchored by our flagship developments: Summit One Tower (the tallest landmark on Shaw Blvd) and Facilities Centre (featuring the longest frontage on Shaw Blvd). These assets serve as the blueprint for our expansion nationwide.
      </>
    )
  },
  {
    question: "Who should contact Facilities?",
    answer: (
      <>
        Facilities is the primary interface for:
        <ul className="list-disc pl-5 my-2 space-y-1">
          <li>Tenants occupying managed units</li>
          <li>Institutional partners and leasing agents</li>
          <li>Regulatory bodies and utility providers</li>
          <li>Asset owners exploring professional management solutions</li>
        </ul>
      </>
    )
  },
];

// --- HYBRID DATA: Default Marketing Assets ---

const marketingData: Record<string, any> = {
  "Unit R": {
    images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop"],
    specs: [{ label: "Access", value: "Main Lobby" }, { label: "Condition", value: "Fitted" }]
  },
  "FCB-D Mezz": {
    images: ["https://images.unsplash.com/photo-1604328698692-f76ea9498e76?q=80&w=1200&auto=format&fit=crop"],
    specs: [{ label: "Level", value: "Mezzanine" }]
  },
  "701": {
    images: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop"],
    specs: [{ label: "Orientation", value: "Corner Unit" }]
  },
  "703": {
    images: ["https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop"],
    specs: [{ label: "Capacity", value: "High-Density Ready" }]
  },
  "24C": { images: ["https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop"], specs: [] },
  "24I": { images: ["https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop"], specs: [] },
  "24K": { images: ["https://images.unsplash.com/photo-1600508774444-466ba7ad9436?q=80&w=1200&auto=format&fit=crop"], specs: [] },
  "3602": { images: ["https://images.unsplash.com/photo-1504384308090-c54be3855485?q=80&w=1200&auto=format&fit=crop"], specs: [] },
  "3604": { images: ["https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=1200&auto=format&fit=crop"], specs: [] }
};

const DEFAULT_HEADLINE = "Commercial Office Suite";
const DEFAULT_NARRATIVE = "An institutional-grade commercial unit optimized for modern operational requirements.";
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop";

interface PropertyUnit {
  id: string;
  unit_number: string;
  building_name: string;
  price: string;
  area: string;
  status: string;
  dues: string;
  condition: string;
  available_date: string;
  headline: string;
  images: string[];
  narrative: string;
  specs: { label: string; value: string }[];
}

type ViewState =
  | { type: 'landing' }
  | { type: 'listing'; property: string }
  | { type: 'detail'; unit: PropertyUnit; source: string }
  | { type: 'login' }
  | { type: 'admin' };

// --- Components ---

interface HeaderProps {
  onNavigateHome: () => void;
  onViewSummit: () => void;
  onViewFacilities: () => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigateHome, onViewSummit, onViewFacilities, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleNavClick = (targetId: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (currentPage !== 'landing') {
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

  const handleListingClick = (action: () => void) => () => {
    action();
    closeMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

        <nav className="hidden md:flex items-center space-x-8 text-sm text-[#E6EAF2] font-medium tracking-wide">
          <a href="#why" onClick={handleNavClick("why")} className="hover:text-[#C9D2E3] transition-colors duration-300">Why Us</a>
          <a href="#operate" onClick={handleNavClick("operate")} className="hover:text-[#C9D2E3] transition-colors duration-300">How We Operate</a>

          <div className="relative group">
            <a
              href="#projects"
              onClick={handleNavClick("projects")}
              className="flex items-center gap-1 hover:text-[#C9D2E3] transition-colors duration-300 py-6"
            >
              Projects
              <ChevronDown size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
            </a>

            <div className="absolute top-full -left-4 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 w-64">
              <div className="bg-white rounded-lg shadow-xl border border-corporate-200 overflow-hidden py-2">
                <button
                  onClick={handleListingClick(onViewSummit)}
                  className="w-full text-left px-5 py-3 text-corporate-800 hover:bg-corporate-50 hover:text-corporate-900 transition-colors text-sm font-medium"
                >
                  Summit One Units for Rent
                </button>
                <div className="h-px bg-corporate-100 mx-5 my-1"></div>
                <button
                  onClick={handleListingClick(onViewFacilities)}
                  className="w-full text-left px-5 py-3 text-corporate-800 hover:bg-corporate-50 hover:text-corporate-900 transition-colors text-sm font-medium"
                >
                  Facilities Centre Units for Rent
                </button>
              </div>
            </div>
          </div>

          <a href="#faq" onClick={handleNavClick("faq")} className="hover:text-[#C9D2E3] transition-colors duration-300">FAQ</a>
          <a href="#contact" onClick={handleNavClick("contact")} className="hover:text-[#C9D2E3] transition-colors duration-300">Contact</a>
        </nav>

        <button
          className="md:hidden text-[#E6EAF2] hover:text-[#C9D2E3] transition-colors focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-[#181852] border-b border-[#E6EAF2]/10 shadow-xl max-h-[calc(100vh-80px)] overflow-y-auto">
          <nav className="flex flex-col py-8 px-6 space-y-6">
            <a href="#why" onClick={handleNavClick("why")} className="text-[#E6EAF2] text-lg font-medium tracking-wide">Why Us</a>
            <a href="#operate" onClick={handleNavClick("operate")} className="text-[#E6EAF2] text-lg font-medium tracking-wide">How We Operate</a>
            <div className="space-y-4">
              <a href="#projects" onClick={handleNavClick("projects")} className="text-[#E6EAF2] text-lg font-medium tracking-wide block">Projects</a>
              <div className="pl-6 flex flex-col space-y-3 border-l border-[#E6EAF2]/20">
                <button onClick={handleListingClick(onViewSummit)} className="text-[#C9D2E3] text-base text-left">Summit One Units for Rent</button>
                <button onClick={handleListingClick(onViewFacilities)} className="text-[#C9D2E3] text-base text-left">Facilities Centre Units for Rent</button>
              </div>
            </div>
            <a href="#faq" onClick={handleNavClick("faq")} className="text-[#E6EAF2] text-lg font-medium tracking-wide">FAQ</a>
            <a href="#contact" onClick={handleNavClick("contact")} className="text-[#E6EAF2] text-lg font-medium tracking-wide">Contact</a>
          </nav>
        </div>
      )}
    </header>
  );
};

const ListingPage: React.FC<{
  propertyName: string;
  units: PropertyUnit[];
  onBack: () => void;
  onUnitClick: (unit: PropertyUnit) => void;
}> = ({ propertyName, units, onBack, onUnitClick }) => {
  const [sortOption, setSortOption] = useState('default');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getSortedUnits = () => {
    const unitsCopy = [...units];
    if (sortOption === 'price-asc') return unitsCopy.sort((a, b) => Number(a.price) - Number(b.price));
    if (sortOption === 'price-desc') return unitsCopy.sort((a, b) => Number(b.price) - Number(a.price));
    if (sortOption === 'area-asc') return unitsCopy.sort((a, b) => Number(a.area) - Number(b.area));
    return unitsCopy;
  };

  const sortedUnits = getSortedUnits();

  return (
    <div className="min-h-screen bg-white pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <button onClick={onBack} className="flex items-center text-corporate-500 hover:text-corporate-900 transition-colors mb-8 text-sm font-medium tracking-wide uppercase group">
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Overview
        </button>

        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-8 border-b border-corporate-100 pb-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-serif text-corporate-900 tracking-tight">{propertyName}</h1>
            <p className="text-corporate-500">
              We found <span className="font-semibold text-corporate-900">{units.length}</span> units in our database
            </p>
          </div>
          <div className="mt-4 md:mt-0 relative">
            <label className="text-sm text-corporate-500 mr-2">Sort By:</label>
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="text-sm font-medium text-corporate-900 bg-transparent border-none focus:ring-0 cursor-pointer pr-8">
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="area-asc">Area: Low to High</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {sortedUnits.map((unit) => (
            <div key={unit.id} className="group cursor-pointer flex flex-col" onClick={() => onUnitClick(unit)}>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-corporate-100 mb-4">
                <img src={unit.images[0]} alt={unit.unit_number} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                {/* Dynamic Status Badge */}
                <div className={`absolute top-4 right-4 ${unit.status.toLowerCase().includes('available') ? 'bg-corporate-800' : 'bg-corporate-900'} text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-widest shadow-lg`}>
                  {unit.status}
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-corporate-900 leading-tight">Unit {unit.unit_number}</h3>
                  <span className="text-lg font-bold text-corporate-900 whitespace-nowrap ml-4">₱{Number(unit.price).toLocaleString()}</span>
                </div>
                <p className="text-sm text-corporate-500 font-medium">{unit.headline}</p>
                <div className="h-px bg-corporate-100 w-full my-2"></div>
                <div className="flex items-center gap-6 text-sm text-corporate-600">
                  <div className="flex items-center gap-2">
                    <Maximize2 size={16} className="text-corporate-400" />
                    <span>{unit.area} sqm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-corporate-400" />
                    <span>{unit.condition || 'Fitted'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const UnitGallery: React.FC<{ images: string[], status: string }> = ({ images, status }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const nextImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  return (
    <>
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-corporate-200 shadow-sm border border-corporate-200 group">
        <div className="w-full h-full cursor-zoom-in" onClick={() => setIsLightboxOpen(true)}>
          <img src={images[currentIndex]} alt="View" className="w-full h-full object-cover" />
        </div>
        <div className="absolute bottom-6 left-6 bg-corporate-900/90 backdrop-blur-md px-4 py-2 rounded-lg z-10">
          <span className="text-white text-sm font-medium tracking-wide uppercase">{status}</span>
        </div>
        {images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute top-1/2 left-4 -translate-y-1/2 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-all">
              <ChevronLeft size={24} />
            </button>
            <button onClick={nextImage} className="absolute top-1/2 right-4 -translate-y-1/2 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-all">
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
          <button onClick={() => setIsLightboxOpen(false)} className="absolute top-6 right-6 p-2 text-white/70 hover:text-white"><X size={32} /></button>
          <img src={images[currentIndex]} className="max-h-[85vh] max-w-full object-contain" />
        </div>
      )}
    </>
  );
};

const UnitDetailPage: React.FC<{ unit: PropertyUnit; onBack: () => void; propertyName: string }> = ({ unit, onBack, propertyName }) => {
  useEffect(() => window.scrollTo(0, 0), []);
  const mailtoLink = `mailto:mercy.laurenciano@gmail.com?subject=${encodeURIComponent(`Rent Inquiry for Unit ${unit.unit_number} - ${propertyName}`)}`;

  // Formatting for association dues as currency with two decimal places
  const formattedDues = unit.dues
    ? `₱${Number(unit.dues).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
    : "Included";

  return (
    <div className="min-h-screen bg-corporate-50 pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <button onClick={onBack} className="flex items-center text-corporate-500 hover:text-corporate-900 transition-colors text-sm font-medium tracking-wide uppercase group mb-8">
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to {propertyName}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-8">
            <UnitGallery images={unit.images} status={unit.status} />
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-corporate-200 pb-8 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-corporate-500 text-sm font-medium uppercase tracking-widest">
                  <MapPin size={16} />
                  <span>{unit.building_name}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-serif text-corporate-900 leading-tight">{unit.headline}</h1>
                <p className="text-xl text-corporate-600 font-light">Unit {unit.unit_number}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-3xl font-bold text-corporate-900">₱{Number(unit.price).toLocaleString()} / mo</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-corporate-900 uppercase tracking-widest">About this Unit</h3>
                <p className="text-lg text-corporate-600 leading-relaxed">{unit.narrative}</p>
              </div>
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-corporate-900 uppercase tracking-widest">Live Facts</h3>
                <div className="border-t border-corporate-200">
                  {[
                    { label: "Floor Area", value: `${unit.area} sqm` },
                    { label: "Assoc. Dues", value: formattedDues },
                    { label: "Availability", value: unit.available_date || "Immediate" },
                    { label: "Condition", value: unit.condition || "Fitted" },
                    ...unit.specs
                  ].map((spec, idx) => (
                    <div key={idx} className="flex justify-between py-3 border-b border-corporate-200 text-base">
                      <span className="text-corporate-500 font-medium">{spec.label}</span>
                      <span className="text-corporate-900 font-semibold text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-xl border border-corporate-200 shadow-sm sticky top-28">
              <h3 className="text-2xl font-serif text-corporate-900 mb-6">Interested in this property?</h3>
              <p className="text-corporate-600 mb-8 leading-relaxed">Our leasing team is ready to schedule a viewing or provide a detailed floor plan for Unit {unit.unit_number}.</p>
              <div className="space-y-4">
                <a href={mailtoLink} className="w-full py-4 bg-corporate-900 text-white font-medium hover:bg-corporate-800 transition-colors rounded-lg flex items-center justify-center gap-2">
                  <Mail size={18} /> Inquire via Email
                </a>
                <a href="tel:+639335383815" className="w-full py-3 border border-corporate-300 text-corporate-700 font-medium hover:border-corporate-900 hover:text-corporate-900 transition-colors rounded-lg flex items-center justify-center gap-2">
                  <Phone size={18} /> Call Mercy
                </a>
              </div>
              <div className="mt-8 pt-6 border-t border-corporate-100 text-sm text-corporate-500 text-center">
                Ref ID: <span className="font-mono text-corporate-700">{unit.id.split('-')[0]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Landing View Components ---

const Hero: React.FC = () => (
  <section className="min-h-[90vh] flex flex-col justify-center px-6 bg-corporate-50 pt-20 border-b border-corporate-200">
    <div className="max-w-5xl mx-auto w-full pt-16 pb-20 md:pt-20 md:pb-28">
      <div className="space-y-12">
        <div className="space-y-6">
          <h1 className="font-serif text-5xl md:text-7xl text-corporate-900 leading-[1.05] tracking-tight">Facilities, Incorporated</h1>
          <p className="text-sm md:text-base text-corporate-500 font-medium tracking-[0.15em] uppercase">Commercial Property Operations and Asset Management</p>
          <div className="w-24 h-px bg-corporate-300"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          <div className="space-y-8">
            <p className="text-xl md:text-2xl text-corporate-800 leading-relaxed font-serif">
              Facilities, Inc. is a premier, family-owned asset management and operating company with a legacy of excellence dating back to 1960. With foundations rooted in our flagship Mandaluyong developments, we are a Philippine-centric firm with the proven expertise to manage and scale commercial operations nationwide.
            </p>
            <p className="text-lg text-corporate-600 leading-relaxed">
              Currently overseeing key assets within Summit One Tower and Facilities Centre, our operational footprint continues to grow as we expand our management standards to strategic locations beyond Metro Manila.
            </p>
            <p className="text-lg font-serif italic text-corporate-400 mt-12">Quality has no substitute.</p>
            <div className="pt-8">
              <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }} className="inline-block px-8 py-4 bg-transparent border border-corporate-300 text-corporate-900 text-sm font-medium hover:border-corporate-900 transition-colors tracking-wide">Make an Inquiry</a>
            </div>
          </div>
          <div className="relative h-full min-h-[400px] w-full bg-corporate-100 hidden md:block">
            <img src="/images/facilities-b&w.jpeg" alt="Summit One Tower Shaw Blvd" className="absolute inset-0 w-full h-full object-cover object-top" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

const WhyUs: React.FC = () => (
  <Section id="why" className="bg-white">
    <div className="border-b border-corporate-200 mb-16 pb-4">
      <h2 className="text-3xl md:text-4xl font-serif text-corporate-900">Why Facilities, Inc.</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
      {whyItems.map((item, idx) => (
        <div key={idx} className="space-y-4">
          <h3 className="text-base font-bold text-corporate-900 tracking-widest uppercase opacity-90">{item.title}</h3>
          <p className="text-lg text-corporate-600 leading-relaxed">{item.description}</p>
        </div>
      ))}
    </div>
  </Section>
);

const Operations: React.FC = () => (
  <Section id="operate" className="bg-corporate-50 border-t border-corporate-200">
    <div className="border-b border-corporate-200 mb-16 pb-4">
      <h2 className="text-3xl md:text-4xl font-serif text-corporate-900">How We Operate</h2>
    </div>
    <div className="space-y-16 md:space-y-24">
      {operations.map((op, idx) => (
        <div key={idx} className="flex flex-col md:flex-row md:items-stretch">
          <div className="w-full md:w-5/12 pb-6 md:pb-0 md:pr-12">
            <span className="block text-6xl md:text-7xl font-serif text-corporate-200 leading-none mb-6 -mt-2">{op.step}</span>
            <h3 className="text-2xl md:text-3xl font-serif text-corporate-800 leading-tight">{op.title}</h3>
          </div>
          <div className="w-full md:w-7/12 md:border-l border-corporate-200 md:pl-12">
            <p className="text-lg text-corporate-600 leading-relaxed">{op.description}</p>
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

const Assets: React.FC<AssetsProps> = ({ onViewSummit, onViewFacilities }) => (
  <Section id="projects" className="bg-white border-t border-corporate-200">
    <div className="border-b border-corporate-200 mb-16 pb-4">
      <h2 className="text-3xl md:text-4xl font-serif text-corporate-900">Projects</h2>
    </div>
    <div className="space-y-24 md:space-y-32">
      <figure className="flex flex-col gap-8 group cursor-pointer" onClick={onViewSummit}>
        <div className="w-full bg-corporate-100 overflow-hidden relative aspect-[16/9]">
          <img src="/images/summit-one-tower.png" alt="Summit One" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
          <div className="absolute inset-0 group-hover:bg-corporate-900/10 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-corporate-900 px-6 py-3 text-sm font-medium tracking-widest uppercase transform translate-y-4 group-hover:translate-y-0 transition-all">View Available Units</span>
          </div>
        </div>
        <figcaption className="space-y-2">
          <h3 className="text-3xl font-serif text-corporate-900">Summit One Tower</h3>
          <p className="text-lg text-corporate-600 leading-relaxed">The tallest landmark on Shaw Boulevard, offering premier office spaces with breathtaking views of the Wack Wack Golf course. This 46-storey commercial icon is engineered for high-performance operations, featuring 100% backup power and full fiber-optic connectivity.</p>
        </figcaption>
      </figure>

      <figure className="flex flex-col gap-8 group cursor-pointer" onClick={onViewFacilities}>
        <div className="w-full bg-corporate-100 overflow-hidden relative aspect-[16/9]">
          <img src="/images/facilities-centre.png" alt="Facilities Centre" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
          <div className="absolute inset-0 group-hover:bg-corporate-900/10 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-corporate-900 px-6 py-3 text-sm font-medium tracking-widest uppercase transform translate-y-4 group-hover:translate-y-0 transition-all">View Available Units</span>
          </div>
        </div>
        <figcaption className="space-y-2">
          <h3 className="text-3xl font-serif text-corporate-900">Facilities Centre</h3>
          <p className="text-lg text-corporate-600 leading-relaxed">A premier commercial hub featuring the longest street frontage along the Shaw Boulevard corridor. This PEZA-accredited complex is home to anchor banking tenants and major corporate offices, providing exceptional accessibility and high-visibility ground-floor retail units.</p>
        </figcaption>
      </figure>

      <figure className="flex flex-col gap-8 group">
        <div className="w-full bg-corporate-100 overflow-hidden relative aspect-[16/9]">
          <img src="https://images.unsplash.com/photo-1592595896551-12b371d546d5?q=80&w=1600&auto=format&fit=crop" alt="Palladium" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
        </div>
        <figcaption className="space-y-2">
          <h3 className="text-3xl font-serif text-corporate-900">Palladium Village</h3>
          <p className="text-lg text-corporate-600 leading-relaxed">A prestigious 76-lot residential landmark known for its exclusivity and innovation. Historically significant as the first development in the Philippines to feature an underground utility wiring system, this community achieved a record-breaking total sell-out within just six months of its launch.</p>
        </figcaption>
      </figure>
    </div>
  </Section>
);

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <Section id="faq" className="bg-corporate-50 border-t border-corporate-200" narrow>
      <div className="border-b border-corporate-200 pb-4"><h2 className="text-3xl md:text-4xl font-serif text-corporate-900">FAQ</h2></div>
      <div className="">{faqs.map((faq, idx) => (
        <div key={idx} className="border-b border-corporate-200">
          <button onClick={() => setOpenIndex(openIndex === idx ? null : idx)} className="w-full flex items-start justify-between py-6 group">
            <span className="text-xl text-corporate-700 pr-8 leading-relaxed group-hover:text-corporate-900 transition-colors">{faq.question}</span>
            <span className="text-corporate-400 mt-1">{openIndex === idx ? <Minus size={20} /> : <Plus size={20} />}</span>
          </button>
          {openIndex === idx && <div className="pb-6 pr-8 text-corporate-500 text-base leading-relaxed">{faq.answer}</div>}
        </div>
      ))}</div>
    </Section>
  );
};

const Contact: React.FC = () => {
  const [isSending, setIsSending] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);
    // Simulate Netlify Form Submit
    setTimeout(() => { alert('Inquiry sent.'); setIsSending(false); e.currentTarget.reset(); }, 1000);
  };
  return (
    <Section id="contact" className="bg-white border-t border-corporate-200">
      <div className="border-b border-corporate-200 mb-16 pb-4"><h2 className="text-3xl md:text-4xl font-serif text-corporate-900">Contact</h2></div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 lg:col-start-5 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <input type="text" placeholder="Full Name" required className="w-full py-3 bg-transparent border-b border-corporate-200 focus:border-corporate-900 outline-none placeholder-corporate-300" />
            <input type="email" placeholder="Email" required className="w-full py-3 bg-transparent border-b border-corporate-200 focus:border-corporate-900 outline-none placeholder-corporate-300" />
          </div>
          <textarea placeholder="Your Inquiry" required rows={6} className="w-full py-3 bg-transparent border-b border-corporate-200 focus:border-corporate-900 outline-none placeholder-corporate-300 resize-none" />
          <button disabled={isSending} className="px-8 py-4 bg-transparent border border-corporate-300 text-corporate-900 font-medium hover:border-corporate-900 transition-colors disabled:opacity-50">{isSending ? 'Sending...' : 'Submit Inquiry'}</button>
        </div>
        <div className="lg:col-span-4 lg:col-start-1 lg:row-start-1 space-y-8">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Office</h3>
            <p className="text-lg text-corporate-700 font-serif">23/F Summit One Tower<br />Mandaluyong City, Philippines</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Email</h3>
            <a href="mailto:mercy.laurenciano@gmail.com" className="text-lg text-corporate-700 font-serif underline decoration-corporate-200">mercy.laurenciano@gmail.com</a>
          </div>
        </div>
      </form>
    </Section>
  );
};

const Footer: React.FC<{ onAdminClick: () => void }> = ({ onAdminClick }) => (
  <footer className="bg-[#181852] text-[#C9D2E3] py-12">
    <div className="max-w-7xl mx-auto px-6 flex justify-between items-center opacity-80 text-xs tracking-widest uppercase">
      <button
        onClick={onAdminClick}
        className="hover:text-white transition-colors text-left"
      >
        &copy; {new Date().getFullYear()} Facilities, Incorporated.
      </button>
      <p>Est. 1960</p>
    </div>
  </footer>
);

export default function App() {
  const [viewState, setViewState] = useState<ViewState>({ type: 'landing' });
  const [liveUnits, setLiveUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const fetchUnits = useCallback(async () => {
    const { data, error } = await supabase
      .from('units')
      .select('*')
      .order('unit_number', { ascending: true });
    if (error) console.error("Database Error:", error);
    else setLiveUnits(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  const getProcessedUnits = (building: string): PropertyUnit[] => {
    return liveUnits
      .filter(u => u.building_name === building)
      .map(u => {
        // Fallback Chain: 
        // 1. Live Supabase image_urls (text array)
        // 2. Local hardcoded marketing mapping (if unit matches)
        // 3. Global professional defaults
        const localMeta = marketingData[u.unit_number] || {};
        
        const headline = u.headline || localMeta.headline || DEFAULT_HEADLINE;
        const narrative = u.narrative || localMeta.narrative || DEFAULT_NARRATIVE;
        
        // Use DB image_urls if they exist, otherwise fallback
        const images = (u.image_urls && u.image_urls.length > 0) 
          ? u.image_urls 
          : (localMeta.images || [DEFAULT_IMAGE]);

        const specs = localMeta.specs || [];

        return {
          id: u.id,
          unit_number: u.unit_number,
          building_name: u.building_name,
          price: u.monthly_rent,
          area: u.net_area,
          status: u.status,
          dues: u.assoc_dues,
          condition: u.handover_condition || u.condition || 'Fitted',
          available_date: u.availability_date,
          headline,
          narrative,
          images,
          specs
        };
      });
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-serif text-corporate-400 italic">Connecting to Facilities Database...</div>;

  return (
    <div className="antialiased min-h-screen bg-corporate-50 font-sans">
      <Header
        onNavigateHome={() => setViewState({ type: 'landing' })}
        onViewSummit={() => setViewState({ type: 'listing', property: 'Summit One Tower' })}
        onViewFacilities={() => setViewState({ type: 'listing', property: 'Facilities Centre' })}
        currentPage={viewState.type}
      />
      <main>
        {viewState.type === 'login' ? (
          <LoginPage
            onLoginSuccess={(loggedInUser) => {
              setUser(loggedInUser);
              setViewState({ type: 'admin' });
            }}
            onBack={() => setViewState({ type: 'landing' })}
          />
        ) : viewState.type === 'admin' ? (
          <AdminDashboard
            onLogout={() => {
              setUser(null);
              fetchUnits(); // Ensure data is fresh when returning to public view
              setViewState({ type: 'landing' });
            }}
          />
        ) : viewState.type === 'listing' ? (
          <ListingPage
            propertyName={viewState.property}
            units={getProcessedUnits(viewState.property)}
            onBack={() => setViewState({ type: 'landing' })}
            onUnitClick={(u) => setViewState({ type: 'detail', unit: u, source: viewState.property })}
          />
        ) : viewState.type === 'detail' ? (
          <UnitDetailPage
            unit={viewState.unit}
            onBack={() => setViewState({ type: 'listing', property: viewState.source })}
            propertyName={viewState.source}
          />
        ) : (
          <>
            <Hero />
            <WhyUs />
            <Operations />
            <Assets
              onViewSummit={() => setViewState({ type: 'listing', property: 'Summit One Tower' })}
              onViewFacilities={() => setViewState({ type: 'listing', property: 'Facilities Centre' })}
            />
            <FAQ />
            <Contact />
          </>
        )}
      </main>
      <Footer onAdminClick={() => setViewState({ type: 'login' })} />
    </div>
  );
}