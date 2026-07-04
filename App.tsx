import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useParams, Navigate, useLocation } from 'react-router-dom';
import { Section } from './components/Section';
import { BuildingListingSeoSections } from './components/BuildingListingSeoSections';
import { OfficeSpaceMandaluyongPage } from './components/OfficeSpaceMandaluyongPage';
import { OfficeSpaceShawBoulevardPage } from './components/OfficeSpaceShawBoulevardPage';
import { OfficeSpaceNearOrtigasPage } from './components/OfficeSpaceNearOrtigasPage';
import { OfficeRentalMandaluyongPage } from './components/OfficeRentalMandaluyongPage';
import { Plus, Minus, Menu, X, Maximize2, Building2, ArrowLeft, ChevronDown, Check, Phone, Mail, MapPin, ChevronLeft, ChevronRight, FileText, BookOpen, HelpCircle, Send, ShieldCheck, Fingerprint, Gavel, Scale, AlertCircle } from 'lucide-react';
import { WhyItem, OperationStep, FAQItem } from './types';
import { supabase } from './supabaseClient';
import { LoginPage } from './LoginPage';
import { AdminDashboard } from './AdminDashboard';
import { ResetPasswordPage } from './ResetPasswordPage';
import { SEOHead } from './SEOHead';
import { buildUnitPageSEO, buildBlogPostSEO, getSEOMetadata } from './seo-metadata';
import { slugifyUnitSegment, isUuidParam } from './unit-slug';
import { capturePostHog } from './posthogCapture';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- Data Definitions ---

// --- HYBRID DATA: Default Marketing Assets ---

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
  "3602": { images: ["https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop"], specs: [] },
  "3604": { images: ["https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=1200&auto=format&fit=crop"], specs: [] }
};

const DEFAULT_HEADLINE = "Commercial Office Suite";
const DEFAULT_NARRATIVE = "An institutional-grade commercial unit optimized for modern operational requirements.";
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop";

interface PropertyUnit {
  id: string;
  unit_number: string;
  /** Public URL segment under /units/:building/ */
  url_slug: string;
  building_name: string;
  building_key?: string;
  floor_label?: string;
  floor_sort?: number;
  unit_sort?: number;
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

/** Descriptive alt for unit listing and gallery photos (SEO + accessibility). */
function buildUnitPhotoAlt(
  unit: Pick<PropertyUnit, 'unit_number' | 'building_name' | 'area'>,
  photoIndex: number,
  total: number
): string {
  const part = total > 1 ? ` — photo ${photoIndex + 1} of ${total}` : '';
  return `Office unit photo — Unit ${unit.unit_number}, ${unit.building_name}, ${unit.area} sqm, Shaw Boulevard, Mandaluyong${part}`;
}

// --- Lead Capture Modal Component ---

const LeadInquiryModal: React.FC<{
  unit: PropertyUnit;
  onClose: () => void;
  onOpenLegal: () => void;
}> = ({ unit, onClose, onOpenLegal }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [showError, setShowError] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: 'I am interested in viewing this unit. Please provide more details.'
  });

  const encode = (data: any) => Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAgreed) {
      setShowError(true);
      return;
    }
    setIsSubmitting(true);

    const unitInfo = `Unit ${unit.unit_number} - ${unit.building_name}`;

    try {
      const { error } = await supabase.from('leads').insert([{
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        unit_number: unitInfo,
        status: 'New'
      }]);

      if (error) {
        console.log('Lead Error:', error.message);
        alert('There was an issue submitting your inquiry. Please try again.');
      } else {
        // Trigger Netlify Submission for Email Alerts
        fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: encode({
            "form-name": "leads",
            "full_name": formData.name,
            "email": formData.email,
            "phone": formData.phone,
            "unit_number": unitInfo,
            "message": formData.message
          })
        }).catch(err => console.error("Netlify Submission Error:", err));

        // Track in first-party analytics
        const { error: trackError } = await supabase.from('unit_engagement_events').insert([{
          event_type: 'unit_inquiry',
          unit_id: unit.id,
          unit_number: unit.unit_number,
          building_name: unit.building_name,
          source: 'unit_detail_modal',
          page_path: window.location.pathname + window.location.search
        }]);
        
        if (trackError) {
          console.error('❌ Failed to track unit inquiry:', trackError);
        } else {
          console.log('✅ Unit inquiry tracked:', unit.unit_number);
        }

        capturePostHog('unit_specific_inquiry_submitted', {
          unit_number: unit.unit_number,
          building: unit.building_name,
          inquiry_type: 'unit_specific',
          source: 'unit_detail_modal',
        });
        setIsSuccess(true);
      }
    } catch (err) {
      console.log('Catch Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents the label from toggling the checkbox
    e.stopPropagation(); // Prevents event bubbling
    onOpenLegal();
  };

  return (
    <div className="fixed inset-0 z-[110] bg-corporate-900/60 backdrop-blur-md flex items-center justify-center p-6">
      <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl border border-corporate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-corporate-50 p-6 border-b border-corporate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-serif text-corporate-900">Inquiry for Unit {unit.unit_number}</h2>
            <p className="text-xs text-corporate-400 font-bold uppercase tracking-widest mt-1">{unit.building_name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-corporate-100 rounded-full transition-colors text-corporate-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          {isSuccess ? (
            <div className="text-center py-12 space-y-6 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <Check size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-serif text-corporate-900">Email Sent to Leasing</h3>
                <p className="text-corporate-600">Thank you! Our leasing coordinator, Mercy Laurenciano, will review your inquiry and contact you shortly.</p>
              </div>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-corporate-900 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-corporate-800 transition-all"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-corporate-400 uppercase tracking-widest">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-corporate-50 border border-corporate-100 rounded-lg outline-none focus:border-corporate-900 transition-colors"
                  placeholder="Juan Dela Cruz"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-corporate-400 uppercase tracking-widest">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-corporate-50 border border-corporate-100 rounded-lg outline-none focus:border-corporate-900 transition-colors"
                    placeholder="juan@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-corporate-400 uppercase tracking-widest">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-corporate-50 border border-corporate-100 rounded-lg outline-none focus:border-corporate-900 transition-colors"
                    placeholder="+63 9XX XXX XXXX"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-corporate-400 uppercase tracking-widest">Message</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-corporate-50 border border-corporate-100 rounded-lg outline-none focus:border-corporate-900 transition-colors resize-none text-sm"
                />
              </div>

              {/* Legal Consent Checkbox */}
              <div className="pt-2 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex items-center h-5">
                    <input
                      id="legal-consent-modal"
                      name="legal-consent-modal"
                      type="checkbox"
                      checked={isAgreed}
                      onChange={(e) => {
                        setIsAgreed(e.target.checked);
                        if (e.target.checked) setShowError(false);
                      }}
                      tabIndex={0}
                      className="h-4 w-4 rounded border-corporate-300 text-corporate-900 focus:ring-corporate-900 cursor-pointer"
                    />
                  </div>
                  <label htmlFor="legal-consent-modal" className="text-xs text-corporate-600 leading-normal cursor-pointer select-none">
                    I agree to the <span onClick={handleLinkClick} className="text-corporate-700 font-medium underline decoration-corporate-200 cursor-pointer hover:text-corporate-900 transition-colors">Privacy Policy</span> and <span onClick={handleLinkClick} className="text-corporate-700 font-medium underline decoration-corporate-200 cursor-pointer hover:text-corporate-900 transition-colors">Terms of Service</span>.
                  </label>
                </div>
                {showError && !isAgreed && (
                  <p className="text-red-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 animate-in fade-in slide-in-from-left-2">
                    <AlertCircle size={14} /> Please agree to the terms to continue.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isAgreed}
                className={`w-full py-4 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 ${!isAgreed ? 'bg-corporate-300 cursor-not-allowed opacity-70' : 'bg-corporate-900 hover:bg-corporate-800'}`}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                Submit Formal Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const Loader2 = ({ className, size }: { className?: string, size?: number }) => (
  <svg className={`animate-spin ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
);

// --- Components ---

const UserGuideModal: React.FC<{ onClose: () => void; initialTab?: 'product' | 'legal' }> = ({ onClose, initialTab = 'product' }) => {
  const [activeTab, setActiveTab] = useState<'product' | 'legal'>(initialTab);

  // Sync active tab if initialTab changes while component is already mounted
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <div className="fixed inset-0 z-[130] bg-corporate-900/40 backdrop-blur-md flex items-center justify-center p-6">
      <div className="bg-white max-w-4xl w-full max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl border border-corporate-200 animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Modal Header */}
        <div className="bg-white border-b border-corporate-100 z-10 flex flex-col">
          <div className="p-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-serif text-corporate-900">Tenant Resource Center</h2>
              <p className="text-[10px] text-corporate-400 font-bold uppercase tracking-widest mt-1">Institutional Transparency & Compliance</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-corporate-50 rounded-full transition-colors text-corporate-400">
              <X size={24} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex px-6 border-b border-corporate-50">
            <button
              onClick={() => setActiveTab('product')}
              className={`pb-4 px-2 text-xs font-bold uppercase tracking-widest transition-all border-b-2 relative ${activeTab === 'product' ? 'text-corporate-900 border-corporate-900' : 'text-slate-400 border-transparent hover:text-corporate-600'}`}
            >
              Product Report
            </button>
            <button
              onClick={() => setActiveTab('legal')}
              className={`pb-4 px-6 text-xs font-bold uppercase tracking-widest transition-all border-b-2 relative ${activeTab === 'legal' ? 'text-corporate-900 border-corporate-900' : 'text-slate-400 border-transparent hover:text-corporate-600'}`}
            >
              Legal & Privacy
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-12">
          {activeTab === 'product' ? (
            <div className="space-y-12 animate-in fade-in duration-300">
              {/* Product Report */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 text-corporate-900">
                  <div className="p-2 bg-corporate-900 text-white rounded-lg">
                    <FileText size={20} />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-tight">Portfolio Product Report</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-corporate-50 rounded-xl border border-corporate-100">
                    <h4 className="font-bold text-corporate-900 mb-2">Institutional Standards</h4>
                    <p className="text-sm text-corporate-600 leading-relaxed">
                      All managed assets feature PEZA accreditation (where applicable), 100% backup power systems, and multi-carrier fiber optic availability.
                    </p>
                  </div>
                  <div className="p-5 bg-corporate-50 rounded-xl border border-corporate-100">
                    <h4 className="font-bold text-corporate-900 mb-2">Location Strategy</h4>
                    <p className="text-sm text-corporate-600 leading-relaxed">
                      Primary assets are situated on the Shaw Boulevard corridor, providing high-visibility frontage and direct access to the Ortigas Central Business District.
                    </p>
                  </div>
                </div>
              </section>

              {/* Walkthrough */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 text-corporate-900">
                  <div className="p-2 bg-corporate-100 text-corporate-900 rounded-lg">
                    <BookOpen size={20} />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-tight">Leasing Walkthrough</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { title: "Browse Inventory", desc: "Select a project from the 'Projects' menu to view live availability. Use sorting filters to find units matching your floor area or budget requirements." },
                    { title: "Review Details", desc: "Click any unit to view high-resolution photos, marketing narratives, and 'Live Facts' including association dues and availability dates." },
                    { title: "Direct Inquiry", desc: "Use the built-in email or phone triggers to reach Mercy Laurenciano, our primary leasing coordinator, directly." }
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="text-corporate-300 font-serif text-xl italic pt-1">{i + 1}.</span>
                      <div>
                        <p className="font-bold text-corporate-900">{step.title}</p>
                        <p className="text-sm text-corporate-600 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <div className="space-y-12 animate-in fade-in duration-300">
              {/* Privacy Policy */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 text-corporate-900 border-b border-corporate-100 pb-2">
                  <Fingerprint size={20} className="text-corporate-500" />
                  <h3 className="text-xl font-serif text-corporate-900">1. Privacy Policy</h3>
                </div>
                <p className="text-xs text-corporate-400 font-bold uppercase tracking-widest">Last Updated: February 18, 2026</p>
                <div className="prose prose-sm max-w-none text-corporate-600 space-y-4">
                  <p>Facilities, Incorporated (“the Company,” “we,” “us,” or “our”) is committed to protecting your personal data in compliance with the Philippine Data Privacy Act of 2012 (RA 10173).</p>

                  <div>
                    <h4 className="font-bold text-corporate-900 text-sm uppercase tracking-wide">I. Information We Collect</h4>
                    <p>When you use our website or inquiry forms, we collect:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li><strong>Personal Identification:</strong> Name, email address, and phone number.</li>
                      <li><strong>Property Preferences:</strong> The specific units or buildings you inquire about.</li>
                      <li><strong>Technical Data:</strong> IP address, browser type, and usage data via PostHog analytics.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-corporate-900 text-sm uppercase tracking-wide">II. Purpose of Collection</h4>
                    <p>We use your data strictly to:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li>Respond to your leasing inquiries.</li>
                      <li>Schedule property viewings.</li>
                      <li>Process lease applications and contracts.</li>
                      <li>Improve our website performance and user experience.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-corporate-900 text-sm uppercase tracking-wide">III. Data Storage and Retention</h4>
                    <p>Your data is stored in secure databases (Supabase) and is only accessible by authorized leasing personnel (e.g., the Leasing Coordinator). We retain your data for a period of five (5) years after our last interaction, or as required by Philippine tax and real estate laws.</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-corporate-900 text-sm uppercase tracking-wide">IV. Disclosure of Information</h4>
                    <p>We do not sell your data. We only share information with third-party service providers (such as hosting and analytics) who are contractually bound to protect your privacy.</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-corporate-900 text-sm uppercase tracking-wide">V. Your Rights</h4>
                    <p>Under the Data Privacy Act, you have the right to access your personal data, object to processing, request correction or erasure, or file a complaint with the National Privacy Commission (NPC).</p>
                  </div>

                  <div className="bg-corporate-50 p-4 rounded-lg border border-corporate-100">
                    <p className="font-bold text-corporate-900 text-xs uppercase tracking-widest mb-2">Contact Our Data Protection Officer:</p>
                    <p className="text-xs">Email: <a href="mailto:mercy.laurenciano@gmail.com" className="underline decoration-corporate-200">mercy.laurenciano@gmail.com</a></p>
                    <p className="text-xs">Address: 23/F Summit One Tower, Shaw Blvd, Mandaluyong City</p>
                  </div>
                </div>
              </section>

              {/* Terms of Service */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 text-corporate-900 border-b border-corporate-100 pb-2">
                  <Gavel size={20} className="text-corporate-500" />
                  <h3 className="text-xl font-serif text-corporate-900">2. Terms of Service</h3>
                </div>
                <p className="text-xs text-corporate-400 font-bold uppercase tracking-widest">Last Updated: February 18, 2026</p>
                <div className="prose prose-sm max-w-none text-corporate-600 space-y-4">
                  <p>By accessing this website, you agree to be bound by these Terms of Service and all applicable laws in the Philippines, including the Internet Transactions Act of 2023.</p>

                  <div>
                    <h4 className="font-bold text-corporate-900 text-sm uppercase tracking-wide">I. Use of the Website</h4>
                    <p>The content on this website (photos, unit specs, and availability) is for informational purposes only. While we strive for accuracy, unit availability and pricing are subject to change without prior notice.</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-corporate-900 text-sm uppercase tracking-wide">II. No Binding Offer</h4>
                    <p>The listing of a unit on this website does not constitute a legally binding offer to lease. A lease is only perfected upon the execution of a formal Lease Agreement signed by both Facilities, Incorporated and the Tenant.</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-corporate-900 text-sm uppercase tracking-wide">III. Intellectual Property</h4>
                    <p>All content, including the "Facilities, Incorporated" logo, building photography, and the app interface, is the exclusive property of the Company. Unauthorized reproduction is prohibited.</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-corporate-900 text-sm uppercase tracking-wide">IV. Limitation of Liability</h4>
                    <p>Facilities, Incorporated shall not be liable for any damages arising from the use or inability to use this website, including but not limited to technical errors or inaccuracies in unit listings.</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-corporate-900 text-sm uppercase tracking-wide">V. Dispute Resolution & Redress</h4>
                    <p>In compliance with DTI regulations, any complaints regarding our digital services may be sent to mercy.laurenciano@gmail.com. We commit to acknowledging receipt of complaints within 48 hours. All disputes shall be governed by the laws of the Republic of the Philippines.</p>
                  </div>
                </div>
              </section>

              {/* Cookie Policy */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 text-corporate-900 border-b border-corporate-100 pb-2">
                  <ShieldCheck size={20} className="text-corporate-500" />
                  <h3 className="text-xl font-serif text-corporate-900">3. Cookie Policy</h3>
                </div>
                <p className="text-xs text-corporate-400 font-bold uppercase tracking-widest">Last Updated: February 18, 2026</p>
                <div className="prose prose-sm max-w-none text-corporate-600 space-y-4">
                  <p>This website uses cookies and similar tracking technologies to enhance your browsing experience.</p>

                  <div>
                    <h4 className="font-bold text-corporate-900 text-sm uppercase tracking-wide">I. What are Cookies?</h4>
                    <p>Cookies are small text files stored on your device. We use them to remember your preferences and understand how you interact with our property listings.</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-corporate-900 text-sm uppercase tracking-wide">II. How We Use Cookies</h4>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li><strong>Essential Cookies:</strong> Required for the Admin Dashboard and login functions.</li>
                      <li><strong>Analytics Cookies (PostHog):</strong> These help us track unit views, button clicks, and inquiry conversion rates. This data is anonymized and used to improve our leasing services.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-corporate-900 text-sm uppercase tracking-wide">III. Managing Your Preferences</h4>
                    <p>You can choose to disable cookies through your browser settings. However, doing so may prevent you from using certain features of the website, such as the unit sorting functions or admin login.</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-corporate-900 text-sm uppercase tracking-wide">IV. Consent</h4>
                    <p>By continuing to browse our site or submitting an inquiry, you consent to our use of cookies as described in this policy, in accordance with the NPC Advisory on Cookies and Related Technologies.</p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Persistent Footer */}
          <div className="pt-8 mt-12 border-t border-corporate-100 text-center">
            <p className="text-xs text-corporate-400 font-medium uppercase tracking-[0.2em]">Quality Has No Substitute — Est. 1960</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface HeaderProps {
  onNavigateHome: () => void;
  onViewSummit: () => void;
  onViewFacilities: () => void;
  onViewBlog: () => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({
  onNavigateHome,
  onViewSummit,
  onViewFacilities,
  onViewBlog,
  currentPage,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleNavClick = (targetId: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (currentPage !== 'landing' && currentPage !== '/') {
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

  const handleBlogNavClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onViewBlog();
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

        <nav className="hidden md:flex items-center space-x-8 text-base text-[#E6EAF2] font-medium tracking-wide">

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

          <a href="#vision" onClick={handleNavClick("vision")} className="hover:text-[#C9D2E3] transition-colors duration-300">Vision</a>
          <a
            href="/blog"
            onClick={handleBlogNavClick}
            className={`transition-colors duration-300 ${
              currentPage.startsWith('/blog') ? 'text-[#C9D2E3]' : 'hover:text-[#C9D2E3]'
            }`}
          >
            Blog
          </a>
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
            <div className="space-y-4">
              <a href="#projects" onClick={handleNavClick("projects")} className="text-[#E6EAF2] text-xl font-medium tracking-wide block">Projects</a>
              <div className="pl-6 flex flex-col space-y-3 border-l border-[#E6EAF2]/20">
                <button onClick={handleListingClick(onViewSummit)} className="text-[#C9D2E3] text-base text-left">Summit One Units for Rent</button>
                <button onClick={handleListingClick(onViewFacilities)} className="text-[#C9D2E3] text-base text-left">Facilities Centre Units for Rent</button>
              </div>
            </div>
            <a href="#vision" onClick={handleNavClick("vision")} className="text-[#E6EAF2] text-xl font-medium tracking-wide">Vision</a>
            <a
              href="/blog"
              onClick={handleBlogNavClick}
              className={`text-xl font-medium tracking-wide ${
                currentPage.startsWith('/blog') ? 'text-[#C9D2E3]' : 'text-[#E6EAF2]'
              }`}
            >
              Blog
            </a>
            <a href="#contact" onClick={handleNavClick("contact")} className="text-[#E6EAF2] text-xl font-medium tracking-wide">Contact</a>
          </nav>
        </div>
      )}
    </header>
  );
};

const ListingPage: React.FC<{
  propertyName: string;
  pageH1: string;
  buildingKey: 'summit-one' | 'facilities-centre';
  units: PropertyUnit[];
  onBack: () => void;
  onUnitClick: (unit: PropertyUnit) => void;
}> = ({ propertyName, pageH1, buildingKey, units, onBack, onUnitClick }) => {
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
  const isSummitOne = propertyName === 'Summit One Tower';

  const summitUnits = isSummitOne ? sortedUnits : [];

  const summitGroups = isSummitOne
    ? Array.from(
      summitUnits.reduce((acc, u) => {
        const key = u.floor_label || 'Uncategorized';
        if (!acc.has(key)) acc.set(key, []);
        acc.get(key)!.push(u);
        return acc;
      }, new Map<string, PropertyUnit[]>())
    ).map(([floorLabel, unitsInGroup]) => ({
      key: floorLabel,
      title: floorLabel,
      units: unitsInGroup
    }))
    : [];

  return (
    <div className="min-h-screen bg-white pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <button onClick={onBack} className="flex items-center text-corporate-500 hover:text-corporate-900 transition-colors mb-8 text-sm font-medium tracking-wide uppercase group">
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Overview
        </button>

        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-8 border-b border-corporate-100 pb-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-serif text-corporate-900 tracking-tight">{pageH1}</h1>
            <p className="text-corporate-500">
              We found <span className="font-semibold text-corporate-900">{units.length}</span> units in our database. Click on the image below for details.
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

        {isSummitOne ? (
          <div className="space-y-14">
            {summitGroups.map((group) => (
              <section key={group.key} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-corporate-900">{group.title}</h2>
                  <div className="h-px bg-corporate-100 flex-1 ml-6"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                  {group.units.map((unit) => (
                    <div key={unit.id} className="group cursor-pointer flex flex-col" onClick={() => onUnitClick(unit)}>
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-corporate-100 mb-4">
                        <img
                          src={unit.images[0]}
                          alt={buildUnitPhotoAlt(unit, 0, unit.images.length)}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
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
              </section>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {sortedUnits.map((unit) => (
              <div key={unit.id} className="group cursor-pointer flex flex-col" onClick={() => onUnitClick(unit)}>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-corporate-100 mb-4">
                  <img
                    src={unit.images[0]}
                    alt={buildUnitPhotoAlt(unit, 0, unit.images.length)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
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
        )}

        <BuildingListingSeoSections buildingKey={buildingKey} />
      </div>
    </div>
  );
};

const UnitGallery: React.FC<{
  images: string[];
  status: string;
  unit: Pick<PropertyUnit, 'unit_number' | 'building_name' | 'area'>;
}> = ({ images, status, unit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Reset index if images change
  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  const nextImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const galleryAlt = buildUnitPhotoAlt(unit, currentIndex, images.length);

  return (
    <>
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-corporate-200 shadow-sm border border-corporate-200 group">
        <div className="w-full h-full cursor-zoom-in" onClick={() => setIsLightboxOpen(true)}>
          <img src={images[currentIndex]} alt={galleryAlt} className="w-full h-full object-cover" />
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
          <img src={images[currentIndex]} alt={galleryAlt} className="max-h-[85vh] max-w-full object-contain" />
        </div>
      )}
    </>
  );
};

const UnitDetailPage: React.FC<{
  unit: PropertyUnit;
  onBack: () => void;
  propertyName: string;
  seoH1: string;
  onNavigate: (direction: 'prev' | 'next') => void;
  hasPrev: boolean;
  hasNext: boolean;
}> = ({ unit, onBack, propertyName, seoH1, onNavigate, hasPrev, hasNext }) => {
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

  useEffect(() => window.scrollTo({ top: 0, behavior: 'smooth' }), [unit.id]);

  const handleEmailInquiryTrigger = () => {
    capturePostHog('unit_inquiry_started', {
      unit_id: unit.id,
      unit_number: unit.unit_number,
      building: unit.building_name,
      source: 'unit_detail_email_cta',
    });
    setIsLeadFormOpen(true);
  };

  const handleCallInquiry = () => {
    capturePostHog('unit_inquiry_attempt', {
      type: 'call',
      unit_number: unit.unit_number,
      building: unit.building_name
    });
    window.location.href = "tel:+639335383815";
  };

  const formattedDues = unit.dues
    ? `₱${Number(unit.dues).toLocaleString(undefined, { minimumFractionDigits: 2 })} / mo`
    : "Included";

  return (
    <div className="min-h-screen bg-corporate-50 pt-20 pb-24 relative">
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="flex items-center text-corporate-500 hover:text-corporate-900 transition-colors text-sm font-medium tracking-wide uppercase group">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to {propertyName}
          </button>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('prev')}
                disabled={!hasPrev}
                className={`p-2 rounded-full border border-corporate-200 transition-all ${!hasPrev ? 'opacity-30 cursor-not-allowed' : 'hover:bg-corporate-100 hover:border-corporate-300 text-corporate-700'}`}
                title="Previous Unit"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => onNavigate('next')}
                disabled={!hasNext}
                className={`p-2 rounded-full border border-corporate-200 transition-all ${!hasNext ? 'opacity-30 cursor-not-allowed' : 'hover:bg-corporate-100 hover:border-corporate-300 text-corporate-700'}`}
                title="Next Unit"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-8">
            <UnitGallery images={unit.images} status={unit.status} unit={unit} />
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-corporate-200 pb-8 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-corporate-500 text-sm font-medium uppercase tracking-widest">
                  <MapPin size={16} />
                  <span>{unit.building_name}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-serif text-corporate-900 leading-tight">{seoH1}</h1>
                <h2 className="text-xl md:text-2xl font-serif text-corporate-900 leading-tight mt-2">{unit.headline}</h2>
                <p className="text-xl text-corporate-600 font-light">Unit {unit.unit_number}</p>
              </div>
              <div className="text-left md:text-right flex-shrink-0">
                <p className="text-3xl font-bold text-corporate-900 whitespace-nowrap">₱{Number(unit.price).toLocaleString()} / mo</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-corporate-900 uppercase tracking-widest">About this Unit</h3>
                <div className="space-y-4">
                  {unit.narrative.split('\n').filter(p => p.trim()).map((p, i) => (
                    <p key={i} className="text-lg text-corporate-600 leading-relaxed">{p.trim()}</p>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-corporate-900 uppercase tracking-widest">Live Facts</h3>
                <div className="border-t border-corporate-200">
                  {[
                    { label: "Floor Area", value: `${unit.area} sqm` },
                    { label: "Assoc. Dues", value: formattedDues },
                    { label: "Availability", value: unit.available_date || "Immediate" },
                    { label: "Condition", value: unit.condition || "Bare" }
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
                <button onClick={handleEmailInquiryTrigger} className="w-full py-4 bg-corporate-900 text-white font-medium hover:bg-corporate-800 transition-colors rounded-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-md">
                  <Mail size={18} /> Inquire via Email
                </button>
                <button onClick={handleCallInquiry} className="w-full py-3 border border-corporate-300 text-corporate-700 font-medium hover:border-corporate-900 hover:text-corporate-900 transition-colors rounded-lg flex items-center justify-center gap-2">
                  <Phone size={18} /> Call Mercy
                </button>
              </div>
              <div className="mt-8 pt-6 border-t border-corporate-100 text-sm text-corporate-500 text-center">
                Ref ID: <span className="font-mono text-corporate-700">{unit.id.split('-')[0]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLeadFormOpen && (
        <LeadInquiryModal unit={unit} onClose={() => setIsLeadFormOpen(false)} onOpenLegal={() => (window as any).openGuideAt?.('legal')} />
      )}
    </div>
  );
};

// --- Blog Components ---

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content_markdown: string;
  cover_image_url: string | null;
  cover_focus_x?: number;
  cover_focus_y?: number;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

const BlogIndexPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching blog posts:', error);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 pb-24">
        <div className="max-w-5xl mx-auto px-6 pt-12">
          <p className="text-corporate-500 text-center">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20 pb-24">
      <div className="max-w-5xl mx-auto px-6 pt-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-corporate-900 mb-4">Blog</h1>
          <p className="text-lg text-corporate-600">Insights and updates on commercial real estate in Mandaluyong City.</p>
        </div>

        {posts.length === 0 ? (
          <p className="text-corporate-500">No posts published yet.</p>
        ) : (
          <div className="space-y-12">
            {posts.map((post) => (
              <article
                key={post.id}
                onClick={() => navigate(`/blog/${post.slug}`)}
                className="group cursor-pointer border-b border-corporate-100 pb-12 last:border-0"
              >
                {post.cover_image_url && (
                  <div className="aspect-[2/1] w-full overflow-hidden rounded-xl bg-corporate-100 mb-6">
                    <img
                      src={post.cover_image_url}
                      alt={`Cover image: ${post.title}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{
                        objectPosition: `${post.cover_focus_x ?? 50}% ${post.cover_focus_y ?? 50}%`,
                      }}
                    />
                  </div>
                )}
                <div className="space-y-3">
                  {post.published_at && (
                    <time className="text-xs font-bold uppercase tracking-widest text-corporate-400">
                      {new Date(post.published_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  )}
                  <h2 className="text-2xl md:text-3xl font-serif text-corporate-900 group-hover:text-corporate-700 transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-lg text-corporate-600 leading-relaxed">{post.excerpt}</p>
                  )}
                  <p className="text-sm font-medium text-corporate-500 uppercase tracking-wide">
                    Read More →
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error || !data) {
        console.error('Error fetching post:', error);
        setPost(null);
      } else {
        setPost(data);
      }
      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 pb-24">
        <div className="max-w-3xl mx-auto px-6 pt-12">
          <p className="text-corporate-500 text-center">Loading...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return <Navigate to="/blog" />;
  }

  const seoData = buildBlogPostSEO({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || undefined,
    coverImageUrl: post.cover_image_url || undefined,
  });

  return (
    <>
      <SEOHead {...seoData} />
      <div className="min-h-screen bg-white pt-20 pb-24">
        <div className="max-w-3xl mx-auto px-6 pt-12">
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center text-corporate-500 hover:text-corporate-900 transition-colors mb-8 text-sm font-medium tracking-wide uppercase group"
          >
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </button>

          <article className="space-y-8">
            {post.published_at && (
              <time className="block text-xs font-bold uppercase tracking-widest text-corporate-400">
                {new Date(post.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}

            <h1 className="text-4xl md:text-5xl font-serif text-corporate-900 leading-tight">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-corporate-600 leading-relaxed italic border-l-4 border-corporate-200 pl-6">
                {post.excerpt}
              </p>
            )}

            {post.cover_image_url && (
              <div className="aspect-[2/1] w-full overflow-hidden rounded-xl bg-corporate-100">
                <img
                  src={post.cover_image_url}
                  alt={`Cover image: ${post.title}`}
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: `${post.cover_focus_x ?? 50}% ${post.cover_focus_y ?? 50}%`,
                  }}
                />
              </div>
            )}

            <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-corporate-900 prose-p:text-corporate-700 prose-p:leading-relaxed prose-a:text-corporate-800 prose-a:underline prose-a:decoration-corporate-300 hover:prose-a:text-corporate-900 prose-strong:text-corporate-900 prose-code:text-corporate-800 prose-code:bg-corporate-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content_markdown}
              </ReactMarkdown>
            </div>
          </article>
        </div>
      </div>
    </>
  );
};

// --- Landing View Components ---

const Hero: React.FC = () => {
  const { h1 } = getSEOMetadata('home');
  return (
  <section
    id="hero"
    className="min-h-[90vh] flex flex-col justify-center px-6 bg-corporate-50 pt-20 border-b border-corporate-200 scroll-mt-20"
  >
    <div className="max-w-5xl mx-auto w-full pt-16 pb-20 md:pt-20 md:pb-28">
      <div className="space-y-12">
        <div className="space-y-6">
          <h1 className="font-serif text-5xl md:text-7xl text-corporate-900 leading-[1.05] tracking-tight">{h1}</h1>
          <p className="text-sm md:text-base text-corporate-500 font-medium tracking-[0.15em] uppercase">Real Estate Development</p>
          <div className="w-24 h-px bg-corporate-300"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          <div className="space-y-8">
            <p className="text-xl md:text-2xl text-corporate-800 leading-relaxed font-serif">
              Founded in 1960, Facilities Inc. has evolved from insurance and trading into a family-owned real estate developer, creating landmark properties across Metro Manila for over six decades.
            </p>
            <p className="text-lg text-corporate-600 leading-relaxed">
              Our deep understanding of Philippine business landscapes has guided our evolution into one of the Philippines' respected property developers.
            </p>
            <p className="text-lg text-corporate-600 leading-relaxed">
              Currently overseeing key assets within Summit One Tower and Facilities Centre, our operational footprint continues to grow as we expand our management standards to strategic locations beyond Metro Manila.
            </p>
            <p className="text-lg font-serif italic text-corporate-400 mt-12">Quality has no substitute.</p>
            <div className="pt-8">
              <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }} className="inline-block px-10 py-5 bg-corporate-900 border-2 border-corporate-900 text-white text-[11px] font-bold uppercase tracking-widest transition-all hover:bg-transparent hover:text-corporate-900">Make an Inquiry</a>
            </div>
          </div>
          <div className="relative h-full min-h-[400px] w-full bg-corporate-100 hidden md:block">
            <img
              src="/images/facilities-b&w.jpeg"
              alt="Black-and-white view of Shaw Boulevard and the Summit One Tower area, Mandaluyong City"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};

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
      <figure className="flex flex-col gap-8 group">
        <div className="w-full bg-corporate-100 overflow-hidden relative aspect-[16/9]">
          <img
            src="/images/palladium.jpg"
            alt="Palladium Subdivision residential development — landscaped lots and homes in Mandaluyong"
            className="w-full h-full object-cover object-right-bottom grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
          />
        </div>
        <figcaption className="space-y-2">
          <h3 className="text-3xl font-serif text-corporate-900">Palladium Subdivision</h3>
          <p className="text-lg text-corporate-600 leading-relaxed">A prestigious 76-lot residential landmark known for its exclusivity and innovation. Historically significant as the first development in the Philippines to feature an underground utility wiring system, this community achieved a record-breaking total sell-out within just six months of its launch.</p>
        </figcaption>
      </figure>

      <figure className="flex flex-col gap-8">
        <button
          type="button"
          onClick={onViewFacilities}
          aria-label="View Facilities Centre units for rent"
          className="group w-full text-left bg-corporate-100 overflow-hidden relative aspect-[16/9] rounded-none focus:outline-none focus-visible:ring-4 focus-visible:ring-corporate-900/20"
        >
          <img
            src="/images/facilities-centre.png"
            alt="Facilities Centre — PEZA-accredited commercial and office building on Shaw Boulevard, Mandaluyong"
            className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 flex items-end md:items-center justify-start md:justify-center p-5 md:p-0">
            <span className="bg-white/95 text-corporate-900 px-5 py-3 text-xs md:text-sm font-bold tracking-widest uppercase shadow-lg border border-white/50 transition-all md:opacity-0 md:group-hover:opacity-100 md:translate-y-3 md:group-hover:translate-y-0">
              View available offices
            </span>
          </div>
        </button>
        <figcaption className="space-y-4">
          <h3 className="text-3xl font-serif text-corporate-900">Facilities Centre</h3>
          <p className="sr-only">
            Office space for rent in San Juan, Metro Manila at Facilities Centre, along Shaw Boulevard, suitable for retail and office tenants.
          </p>
          <p className="text-lg text-corporate-600 leading-relaxed"> Facilities Centre is a premier commercial hub featuring the longest street frontage along the Shaw Boulevard corridor. This PEZA-accredited complex is home to anchor banking tenants and corporate offices, offering exceptional accessibility, ample parking, and high-visibility ground-floor retail units.</p>
          <div>
            <button
              type="button"
              onClick={onViewFacilities}
              className="inline-flex w-full sm:w-auto items-center justify-center px-7 py-3.5 bg-corporate-900 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-corporate-800 transition-colors"
            >
              View details
            </button>
          </div>
        </figcaption>
      </figure>

      <figure className="flex flex-col gap-8">
        <button
          type="button"
          onClick={onViewSummit}
          aria-label="View Summit One Tower units for rent"
          className="group w-full text-left bg-corporate-100 overflow-hidden relative aspect-[16/9] rounded-none focus:outline-none focus-visible:ring-4 focus-visible:ring-corporate-900/20"
        >
          <img
            src="/images/summit-one-tower.png"
            alt="Summit One Tower exterior — 46-storey office building on Shaw Boulevard, Mandaluyong"
            className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 flex items-end md:items-center justify-start md:justify-center p-5 md:p-0">
            <span className="bg-white/95 text-corporate-900 px-5 py-3 text-xs md:text-sm font-bold tracking-widest uppercase shadow-lg border border-white/50 transition-all md:opacity-0 md:group-hover:opacity-100 md:translate-y-3 md:group-hover:translate-y-0">
              View available offices
            </span>
          </div>
        </button>
        <figcaption className="space-y-4">
          <h3 className="text-3xl font-serif text-corporate-900">Summit One Tower</h3>
          <p className="sr-only">
            Office space for rent in Mandaluyong near Ortigas and Makati at Summit One Tower, suitable for companies needing a central Metro Manila location.
          </p>
          <p className="text-lg text-corporate-600 leading-relaxed">The tallest landmark on Shaw Boulevard, this 46-storey commercial icon offers premier office spaces with breathtaking views of the Wack Wack Golf and Country Club and the Manila Bay sunset. PEZA-accredited for eligible tenants, the building features full fiber-optic connectivity and 100% backup power to support uninterrupted operations. Strategically located with excellent accessibility, it delivers both prestige and performance for modern businesses.</p>
          <div>
            <button
              type="button"
              onClick={onViewSummit}
              className="inline-flex w-full sm:w-auto items-center justify-center px-7 py-3.5 bg-corporate-900 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-corporate-800 transition-colors"
            >
              View details
            </button>
          </div>
        </figcaption>
      </figure>
    </div>
    <div className="mt-16">
      <p className="mt-3 text-sm text-corporate-600">
        Looking for office space?{' '}
        <a
          href="/office-space-mandaluyong"
          className="text-corporate-900 font-medium underline decoration-corporate-300 underline-offset-4 hover:decoration-corporate-900"
        >
          Office space for rent in Mandaluyong
        </a>
        .
      </p>
    </div>
  </Section>
);

const Vision: React.FC = () => (
  <Section id="vision" className="relative z-10 !bg-transparent border-t border-corporate-200">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
      <div className="lg:col-span-12">
        <div className="border-b border-corporate-200 mb-10 pb-1">
          <h2 className="text-3xl md:text-4xl font-serif text-corporate-900">Future Vision: The Next Decade</h2>
        </div>
        <p className="text-xl text-corporate-800 font-serif italic leading-[1.4]">Facilities Inc. is strategically positioned for growth through:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 pt-16">
          {[
            "Joint venture opportunities in real estate development",
            "Development of small and medium-rise commercial centers",
            "Residential community development nationwide"
          ].map((item, idx) => (
            <div key={idx} className="relative p-12 bg-white border border-corporate-50 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.06)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.12)] transition-all duration-500 flex flex-col justify-center items-center min-h-[220px] group">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-[#181852] text-white rounded-full flex items-center justify-center shadow-lg border-[6px] border-white transition-all duration-300">
                <span className="text-3xl font-serif font-bold tracking-tighter">0{idx + 1}</span>
              </div>
              <p className="text-xl text-corporate-900 leading-[1.5] font-serif text-center">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </Section>
);

const Contact: React.FC<{ onOpenLegal: () => void }> = ({ onOpenLegal }) => {
  const [isSending, setIsSending] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [showError, setShowError] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const encode = (data: any) => Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAgreed) {
      setShowError(true);
      return;
    }
    setIsSending(true);

    try {
      const { error } = await supabase.from('leads').insert([{
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        unit_number: "General Inquiry"
      }]);

      if (error) {
        console.log('Detailed Error:', error.message, error.details);
        alert('Could not send message. Please try again or call us directly.');
      } else {
        // Trigger Netlify Submission for Email Alerts
        fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: encode({
            "form-name": "leads",
            "full_name": formData.name,
            "email": formData.email,
            "phone": formData.phone,
            "unit_number": "General Inquiry",
            "message": formData.message
          })
        }).catch(err => console.error("Netlify Submission Error:", err));

        capturePostHog('lead_form_submitted', {
          inquiry_type: 'general',
          source: 'contact_section',
          unit_number: 'General Inquiry',
        });
        capturePostHog('general_inquiry_submitted', {
          inquiry_type: 'general',
          source: 'contact_section',
        });
        alert('Message Sent!');
        setFormData({ name: '', email: '', phone: '', message: '' });
        setIsAgreed(false);
      }
    } catch (err: any) {
      console.log('Lead Submission Catch:', err.message);
      alert('System Error. Please try again later.');
    } finally {
      setIsSending(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDirectClick = (channel: 'email' | 'phone') => {
    capturePostHog('direct_contact_click', { channel });
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents the label from toggling the checkbox
    e.stopPropagation(); // Prevents event bubbling
    onOpenLegal();
  };

  return (
    <Section id="contact" className="!bg-transparent border-t border-corporate-200 relative z-10">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        <div className="lg:col-span-12">
          {/* Grouped Heading for perfect proximity */}
          <div className="border-b border-corporate-900 mb-8 pb-1">
            <h2 className="text-3xl md:text-4xl font-serif text-corporate-900">Contact</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 pt-8">
            {/* Info Sidebar */}
            <div className="lg:col-span-4 lg:col-start-1 space-y-12">
              <div className="space-y-4">
                <h3 className="text-[11px] font-bold text-corporate-500 uppercase tracking-widest">Office</h3>
                <p className="text-2xl text-corporate-900 font-serif leading-tight">23/F Summit One Tower<br />Mandaluyong City, Philippines</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-[11px] font-bold text-corporate-500 uppercase tracking-widest">Email</h3>
                <a
                  href="mailto:mercy.laurenciano@gmail.com"
                  onClick={() => handleDirectClick('email')}
                  className="text-2xl text-corporate-900 font-serif underline decoration-corporate-400 block hover:text-black transition-colors"
                >
                  mercy.laurenciano@gmail.com
                </a>
              </div>
              <div className="space-y-4">
                <h3 className="text-[11px] font-bold text-corporate-500 uppercase tracking-widest">Leasing Hotline</h3>
                <a
                  href="tel:+639335383815"
                  onClick={() => handleDirectClick('phone')}
                  className="text-2xl text-corporate-900 font-serif underline decoration-corporate-400 block hover:text-black transition-colors"
                >
                  +63 933 538 3815
                </a>
              </div>
            </div>

            {/* Form Inputs with Bento Box Styling */}
            <div className="lg:col-span-8 lg:col-start-5 space-y-12 p-8 md:p-12 bg-white/90 backdrop-blur-sm border border-corporate-100 rounded-xl shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  required
                  className="w-full py-3 bg-transparent border-b border-corporate-400 focus:border-corporate-900 outline-none placeholder-corporate-500 text-corporate-900 font-medium"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  required
                  className="w-full py-3 bg-transparent border-b border-corporate-400 focus:border-corporate-900 outline-none placeholder-corporate-500 text-corporate-900 font-medium"
                />
              </div>
              <div className="grid grid-cols-1 gap-12">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number (Optional)"
                  className="w-full py-3 bg-transparent border-b border-corporate-400 focus:border-corporate-900 outline-none placeholder-corporate-500 text-corporate-900 font-medium"
                />
              </div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Your Inquiry"
                required
                rows={6}
                className="w-full py-3 bg-transparent border-b border-corporate-400 focus:border-corporate-900 outline-none placeholder-corporate-500 text-corporate-900 font-medium resize-none"
              />

              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="flex items-center h-5">
                    <input
                      id="legal-consent-contact"
                      name="legal-consent-contact"
                      type="checkbox"
                      checked={isAgreed}
                      onChange={(e) => {
                        setIsAgreed(e.target.checked);
                        if (e.target.checked) setShowError(false);
                      }}
                      tabIndex={0}
                      className="h-4 w-4 rounded border-corporate-400 text-corporate-900 focus:ring-corporate-900 cursor-pointer"
                    />
                  </div>
                  <label htmlFor="legal-consent-contact" className="text-sm text-corporate-800 leading-normal cursor-pointer select-none font-medium">
                    I agree to the <span onClick={handleLinkClick} className="text-corporate-900 font-bold underline decoration-corporate-300 cursor-pointer hover:text-black transition-colors">Privacy Policy</span> and <span onClick={handleLinkClick} className="text-corporate-900 font-bold underline decoration-corporate-300 cursor-pointer hover:text-black transition-colors">Terms of Service</span>.
                  </label>
                </div>
                {showError && !isAgreed && (
                  <p className="text-red-700 text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5 animate-in fade-in slide-in-from-left-2">
                    <AlertCircle size={14} /> Please agree to the terms to continue.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSending || !isAgreed}
                className={`px-10 py-5 text-[11px] font-bold uppercase tracking-widest transition-all border-2 disabled:opacity-50 ${!isAgreed ? 'bg-corporate-50 border-corporate-200 text-corporate-300 cursor-not-allowed' : 'bg-corporate-900 border-corporate-900 text-white hover:bg-transparent hover:text-corporate-900'}`}
              >
                {isSending ? 'Sending...' : 'Submit Inquiry'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </Section>
  );
};

const Footer: React.FC<{ onAdminClick: () => void; onShowGuide: () => void }> = ({ onAdminClick, onShowGuide }) => (
  <footer className="bg-[#181852] text-[#C9D2E3] py-12">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 opacity-80 text-sm tracking-widest uppercase">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <a
          href="/login"
          className="hover:text-white transition-colors text-left"
        >
          &copy; {new Date().getFullYear()} Facilities, Incorporated.
        </a>
        <button onClick={onShowGuide} className="flex items-center gap-2 hover:text-white transition-colors group">
          <HelpCircle size={14} className="group-hover:animate-pulse" />
          Renter's Guide & Product Report
        </button>
      </div>
      <p>Est. 1960</p>
    </div>
  </footer>
);


export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [liveUnits, setLiveUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [guideInitialTab, setGuideInitialTab] = useState<'product' | 'legal'>('product');

  const fetchUnits = useCallback(async () => {
    const { data, error } = await supabase
      .from('units')
      .select('*, buildings:building_id(building_key, building_name)')
      .order('building_id', { ascending: true })
      .order('floor_sort', { ascending: true })
      .order('floor_label', { ascending: true })
      .order('unit_sort', { ascending: true, nullsFirst: false })
      .order('unit_number', { ascending: true })
      .order('id', { ascending: true });
    if (error) console.error("Database Error:", error);
    else setLiveUnits(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    (window as any).openGuideAt = (tab: 'product' | 'legal') => {
      setGuideInitialTab(tab);
      setShowGuide(true);
    };
  }, []);

  useEffect(() => {
    fetchUnits();

    if (window.location.hash.includes('type=recovery')) {
      navigate('/reset-password');
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        navigate('/reset-password');
      } else if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUnits, navigate]);

  // Deep links like /#contact: (1) browser scrolls before React paints sections; (2) initial load shows a
  // full-screen loader so #contact is not in the DOM until `loading` is false. Scroll after content mounts.
  useEffect(() => {
    if (location.pathname !== '/') return;

    const scrollToHash = () => {
      const id = window.location.hash.replace(/^#/, '');
      if (!id) return;
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    window.addEventListener('hashchange', scrollToHash);

    if (loading) {
      return () => window.removeEventListener('hashchange', scrollToHash);
    }

    const timers = [0, 50, 150, 400, 800].map((ms) => window.setTimeout(scrollToHash, ms));

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('hashchange', scrollToHash);
    };
  }, [location.pathname, location.hash, loading]);

  const toggleGuide = (show: boolean, tab: 'product' | 'legal' = 'product') => {
    if (show) {
      capturePostHog('user_guide_opened', { tab });
      setGuideInitialTab(tab);
    }
    setShowGuide(show);
  };

  const buildingKeyToName: Record<string, string> = {
    'summit-one': 'Summit One Tower',
    'facilities-centre': 'Facilities Centre'
  };

  const getProcessedUnits = (buildingKey: string): PropertyUnit[] => {
    return liveUnits
      .filter(u => (u.buildings?.building_key === buildingKey || u.building_name === buildingKeyToName[buildingKey]) && u.contract_length !== 0) // HIDE units with 0 contract length
      .map(u => {
        const localMeta = marketingData[u.unit_number] || {};
        const headline = u.headline || localMeta.headline || DEFAULT_HEADLINE;
        const narrative = u.narrative || localMeta.narrative || DEFAULT_NARRATIVE;
        const images = (u.image_urls && u.image_urls.length > 0)
          ? u.image_urls
          : (localMeta.images || [DEFAULT_IMAGE]);
        const specs = localMeta.specs || [];

        return {
          id: u.id,
          unit_number: u.unit_number,
          url_slug: (u.url_slug as string) || slugifyUnitSegment(String(u.unit_number)),
          building_name: u.buildings?.building_name || u.building_name,
          building_key: u.buildings?.building_key,
          floor_label: u.floor_label || undefined,
          floor_sort: typeof u.floor_sort === 'number' ? u.floor_sort : (u.floor_sort ? Number(u.floor_sort) : undefined),
          unit_sort: typeof u.unit_sort === 'number' ? u.unit_sort : (u.unit_sort ? Number(u.unit_sort) : undefined),
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

  const ListingPageWrapper = () => {
    const { building } = useParams<{ building: string }>();
    const buildingKey = building || 'summit-one';
    const propertyName = buildingKeyToName[buildingKey] || 'Units';
    const listingSeo =
      buildingKey === 'facilities-centre'
        ? getSEOMetadata('facilitiesCentre')
        : getSEOMetadata('summitOne');
    return (
      <>
        <SEOHead {...listingSeo} />
        <ListingPage
          propertyName={propertyName}
          pageH1={listingSeo.h1}
          buildingKey={buildingKey === 'facilities-centre' ? 'facilities-centre' : 'summit-one'}
          units={getProcessedUnits(buildingKey)}
          onBack={() => navigate('/')}
          onUnitClick={async (u) => {
            // Track in first-party analytics
            const { data, error } = await supabase.from('unit_engagement_events').insert([{
              event_type: 'unit_view',
              unit_id: u.id,
              unit_number: u.unit_number,
              building_name: u.building_name,
              source: 'listing_grid',
              page_path: window.location.pathname + window.location.search
            }]);
            
            if (error) {
              console.error('❌ Failed to track unit view:', error);
            } else {
              console.log('✅ Unit view tracked:', u.unit_number);
            }
            
            capturePostHog('unit_viewed', { unit_id: u.id, unit_number: u.unit_number, property: propertyName });
            navigate(`/units/${buildingKey}/${u.url_slug}`);
          }}
        />
      </>
    );
  };

  const UnitDetailPageWrapper = () => {
    const { building, unitRef } = useParams<{ building: string; unitRef: string }>();
    const buildingKey = building || '';
    const propertyName = buildingKeyToName[buildingKey] || 'Units';
    const units = buildingKey ? getProcessedUnits(buildingKey) : [];
    const unit =
      buildingKey && unitRef
        ? isUuidParam(unitRef)
          ? units.find((u) => u.id === unitRef)
          : units.find((u) => u.url_slug === unitRef.toLowerCase())
        : undefined;

    useEffect(() => {
      if (!building || !unitRef || !unit) return;
      if (isUuidParam(unitRef) && unit.url_slug) {
        navigate(`/units/${building}/${unit.url_slug}`, { replace: true });
      }
    }, [building, unitRef, unit?.id, unit?.url_slug, navigate]);

    if (!building || !unitRef) return <Navigate to="/" />;
    if (!unit) return <Navigate to="/" />;

    const unitSeo = buildUnitPageSEO({
      unit_number: unit.unit_number,
      area: String(unit.area),
      building_name: unit.building_name,
      condition: unit.condition || '',
      status: unit.status || '',
      buildingParam: building,
      unitSlug: unit.url_slug,
    });

    const handleUnitNavigation = async (direction: 'prev' | 'next') => {
      const currentIndex = units.findIndex((u) => u.id === unit.id);
      const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
      if (newIndex >= 0 && newIndex < units.length) {
        const nextUnit = units[newIndex];
        
        // Track in first-party analytics
        const { error } = await supabase.from('unit_engagement_events').insert([{
          event_type: 'unit_view',
          unit_id: nextUnit.id,
          unit_number: nextUnit.unit_number,
          building_name: nextUnit.building_name,
          source: 'listing_nav',
          page_path: window.location.pathname
        }]);
        
        if (error) {
          console.error('❌ Failed to track unit navigation:', error);
        } else {
          console.log('✅ Unit nav tracked:', nextUnit.unit_number);
        }
        
        capturePostHog('unit_browsed_via_nav', {
          unit_id: nextUnit.id,
          unit_number: nextUnit.unit_number,
          building: nextUnit.building_name,
          property: propertyName,
          direction,
        });
        capturePostHog('unit_viewed', {
          unit_id: nextUnit.id,
          unit_number: nextUnit.unit_number,
          property: propertyName,
          via: 'listing_nav',
        });
        navigate(`/units/${building}/${nextUnit.url_slug}`);
      }
    };

    const unitIndex = units.findIndex((u) => u.id === unit.id);

    return (
      <>
        <SEOHead {...unitSeo} />
        <UnitDetailPage
          unit={unit}
          onBack={() => navigate(`/units/${buildingKey}`)}
          propertyName={propertyName}
          seoH1={unitSeo.h1}
          onNavigate={handleUnitNavigation}
          hasPrev={unitIndex > 0}
          hasNext={unitIndex < units.length - 1}
        />
      </>
    );
  };

  return (
    <div className="antialiased min-h-screen bg-corporate-50 font-sans">
      {location.pathname !== '/admin' && location.pathname !== '/login' && (
        <Header
          onNavigateHome={() => navigate('/')}
          onViewSummit={() => navigate('/units/summit-one')}
          onViewFacilities={() => navigate('/units/facilities-centre')}
          onViewBlog={() => {
            navigate('/blog');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          currentPage={location.pathname}
        />
      )}

      {showGuide && <UserGuideModal initialTab={guideInitialTab} onClose={() => setShowGuide(false)} />}

      <main>
        <Routes>
          <Route path="/" element={
            <>
              <SEOHead {...getSEOMetadata('home')} />
              <Hero />
              <Assets
                onViewSummit={() => navigate('/units/summit-one')}
                onViewFacilities={() => navigate('/units/facilities-centre')}
              />
              <div className="relative">
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <img
                    src="/images/aerial-view.png"
                    alt="Aerial view of Shaw Boulevard business corridor and Mandaluyong City skyline"
                    className="w-full h-full object-cover object-top opacity-40"
                  />
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px]"></div>
                </div>
                <Vision />
                <Contact onOpenLegal={() => toggleGuide(true, 'legal')} />
              </div>
            </>
          } />
          <Route path="/login" element={
            <>
              <SEOHead {...getSEOMetadata('login')} robots="noindex,nofollow" />
              <LoginPage
                onLoginSuccess={(loggedInUser) => {
                  capturePostHog('admin_login_success');
                  setUser(loggedInUser);
                  navigate('/admin');
                }}
                onBack={() => navigate('/')}
              />
            </>
          } />
          <Route path="/reset-password" element={
            <>
              <SEOHead {...getSEOMetadata('resetPassword')} robots="noindex,nofollow" />
              <ResetPasswordPage
                onSuccess={() => navigate('/login')}
                onBack={() => navigate('/login')}
              />
            </>
          } />
          <Route path="/admin" element={
            <>
              <SEOHead {...getSEOMetadata('admin')} robots="noindex,nofollow" />
              <AdminDashboard
                onLogout={() => {
                  capturePostHog('admin_logout');
                  setUser(null);
                  fetchUnits();
                  navigate('/');
                }}
              />
            </>
          } />
          <Route path="/units/:building" element={<ListingPageWrapper />} />
          <Route path="/units/:building/:unitRef" element={<UnitDetailPageWrapper />} />
          <Route path="/blog" element={
            <>
              <SEOHead {...getSEOMetadata('blogIndex')} />
              <BlogIndexPage />
            </>
          } />
          <Route
            path="/office-space-mandaluyong"
            element={
              <>
                <SEOHead {...getSEOMetadata('officeSpaceMandaluyong')} />
                <OfficeSpaceMandaluyongPage onBackHome={() => navigate('/')} />
              </>
            }
          />
          <Route
            path="/office-space-shaw-boulevard"
            element={
              <>
                <SEOHead {...getSEOMetadata('officeSpaceShawBoulevard')} />
                <OfficeSpaceShawBoulevardPage onBackHome={() => navigate('/')} />
              </>
            }
          />
          <Route
            path="/office-space-near-ortigas"
            element={
              <>
                <SEOHead {...getSEOMetadata('officeSpaceNearOrtigas')} />
                <OfficeSpaceNearOrtigasPage onBackHome={() => navigate('/')} />
              </>
            }
          />
          <Route
            path="/office-rental-mandaluyong"
            element={
              <>
                <SEOHead {...getSEOMetadata('officeRentalMandaluyong')} />
                <OfficeRentalMandaluyongPage onBackHome={() => navigate('/')} />
              </>
            }
          />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer
        onAdminClick={() => navigate('/login')}
        onShowGuide={() => toggleGuide(true, 'product')}
      />
    </div>
  );
}
