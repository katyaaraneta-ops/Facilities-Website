import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import { 
  Layout, Building2, CheckCircle2, XCircle, LogOut, Loader2, Plus, X, 
  Type, AlignLeft, Edit3, Trash2, AlertTriangle, Upload, 
  Image as ImageIcon, Trash, HelpCircle, FileText, BookOpen, 
  ShieldCheck, Inbox, Phone, Mail, User, Clock, Archive, Check, Menu
} from 'lucide-react';

// Access global PostHog safely
const posthog = (window as any).posthog;

interface AdminDashboardProps {
  onLogout: () => void;
}

const INITIAL_FORM_STATE = {
  unit_number: '',
  building_name: 'Summit One Tower',
  monthly_rent: '',
  assoc_dues: '',
  net_area: '',
  status: 'Available',
  handover_condition: 'Fitted',
  headline: '',
  narrative: '',
  image_urls: [] as string[]
};

const compressImage = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas to Blob conversion failed'));
        }, 'image/jpeg', 0.8);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

const AdminDocsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-[110] bg-corporate-900/60 backdrop-blur-md flex items-center justify-center p-6">
    <div className="bg-white max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-xl shadow-2xl border border-corporate-200">
      <div className="sticky top-0 bg-white border-b border-corporate-100 p-6 flex justify-between items-center z-10">
        <div>
          <h2 className="text-xl font-serif text-corporate-900">Admin Resource Center</h2>
          <p className="text-xs text-corporate-400 font-bold uppercase tracking-widest mt-1">Management Workflow & Technical Specs</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-corporate-50 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>
      <div className="p-8 space-y-10">
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-corporate-900">
            <ShieldCheck size={20} className="text-corporate-900" />
            <h3 className="font-bold uppercase text-sm tracking-widest">Admin Product Report</h3>
          </div>
          <div className="bg-corporate-50 p-6 rounded-lg space-y-3 text-sm leading-relaxed text-corporate-600">
            <p><span className="font-bold text-corporate-900">Infrastructure:</span> Built on React 19 with a direct Supabase PostgREST interface.</p>
            <p><span className="font-bold text-corporate-900">Asset Management:</span> Images are compressed via Canvas API (1200px max width).</p>
            <p><span className="font-bold text-corporate-900">Leads Table:</span> Auto-populated from public site contact form with real-time state updates.</p>
          </div>
        </section>
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-corporate-900">
            <BookOpen size={20} className="text-corporate-900" />
            <h3 className="font-bold uppercase text-sm tracking-widest">Management Walkthrough</h3>
          </div>
          <div className="space-y-4">
            {[
              { step: "Adding Units", desc: "Use the 'Add New Asset' button in Inventory. High-quality photos recommended." },
              { step: "Inquiry Management", desc: "The 'Leads Inquiries' section captures all potential tenant details." },
              { step: "Status Transitions", desc: "Mark leads as 'Contacted' to filter out processed inquiries." },
              { step: "Permanent Deletion", desc: "Deleting an asset removes all metadata and associated images from storage." }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-4 border border-corporate-100 rounded-lg">
                <div className="font-serif italic text-corporate-300 text-lg">{i+1}</div>
                <div>
                  <h4 className="font-bold text-corporate-900 text-sm mb-1">{item.step}</h4>
                  <p className="text-xs text-corporate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  </div>
);

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'leads'>('inventory');
  const [units, setUnits] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showDocs, setShowDocs] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUnit, setNewUnit] = useState(INITIAL_FORM_STATE);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);

  useEffect(() => {
    fetchUnits();
    fetchLeads();
  }, []);

  const fetchUnits = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('units')
      .select('*')
      .order('unit_number', { ascending: true });
    setUnits(data || []);
    setLoading(false);
  };

  const fetchLeads = async () => {
    setLoadingLeads(true);
    const { data } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    setLeads(data || []);
    setLoadingLeads(false);
  };

  const updateLeadStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', id);
    if (!error) {
      posthog?.capture('admin_lead_status_updated', { lead_id: id, status: newStatus });
      await fetchLeads();
    } else {
      alert('Error updating lead: ' + error.message);
    }
    setUpdatingId(null);
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    setUpdatingId(id);
    const newStatus = currentStatus.toLowerCase().includes('available') ? 'Rented' : 'Available';
    const { error } = await supabase.from('units').update({ status: newStatus }).eq('id', id);
    if (!error) await fetchUnits();
    setUpdatingId(null);
  };

  const handleModify = (unit: any) => {
    setNewUnit({
      unit_number: unit.unit_number || '',
      building_name: unit.building_name || 'Summit One Tower',
      monthly_rent: unit.monthly_rent?.toString() || '',
      assoc_dues: unit.assoc_dues?.toString() || '',
      net_area: unit.net_area?.toString() || '',
      status: unit.status || 'Available',
      handover_condition: unit.handover_condition || 'Fitted',
      headline: unit.headline || '',
      narrative: unit.narrative || '',
      image_urls: unit.image_urls || []
    });
    setEditingUnitId(unit.id);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const executeDelete = async (id: string) => {
    setDeleteConfirmationId(null);
    setUpdatingId(id);
    try {
      const { error } = await supabase.from('units').delete().match({ id: id });
      if (!error) await fetchUnits();
      else alert('Error: ' + error.message);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const processFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (newUnit.image_urls.length + files.length > 3) {
      alert('Maximum of 3 photos per unit allowed.');
      return;
    }
    setUploading(true);
    const newUrls = [...newUnit.image_urls];
    for (let i = 0; i < files.length; i++) {
      try {
        const file = files[i];
        const compressedBlob = await compressImage(file);
        const fileName = `unit-${newUnit.unit_number || 'TBD'}-${Date.now()}.jpg`;
        const { error: uploadError } = await supabase.storage.from('unit-images').upload(`unit-uploads/${fileName}`, compressedBlob, { contentType: 'image/jpeg' });
        if (uploadError) continue;
        const { data: { publicUrl } } = supabase.storage.from('unit-images').getPublicUrl(`unit-uploads/${fileName}`);
        newUrls.push(publicUrl);
      } catch (err) {
        console.error(err);
      }
    }
    setNewUnit(prev => ({ ...prev, image_urls: newUrls }));
    setUploading(false);
  };

  const removeImage = (urlToRemove: string) => {
    setNewUnit(prev => ({
      ...prev,
      image_urls: prev.image_urls.filter(url => url !== urlToRemove)
    }));
  };

  const resetForm = () => {
    setNewUnit(INITIAL_FORM_STATE);
    setEditingUnitId(null);
    setIsAdding(false);
  };

  const handleCreateOrUpdateUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const unitData = {
      unit_number: newUnit.unit_number,
      building_name: newUnit.building_name,
      monthly_rent: parseFloat(newUnit.monthly_rent),
      assoc_dues: parseFloat(newUnit.assoc_dues),
      net_area: parseFloat(newUnit.net_area),
      status: newUnit.status,
      handover_condition: newUnit.handover_condition,
      headline: newUnit.headline,
      narrative: newUnit.narrative,
      image_urls: newUnit.image_urls,
      listing_type: 'Office',
      availability_date: new Date().toISOString().split('T')[0]
    };
    const { error } = editingUnitId 
      ? await supabase.from('units').update(unitData).eq('id', editingUnitId)
      : await supabase.from('units').insert([unitData]);
    if (!error) {
      await fetchUnits();
      resetForm();
    } else alert('Database Error: ' + error.message);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-corporate-50 flex flex-col relative">
      {/* Sticky Header with Institutional Branding */}
      <header className="sticky top-0 left-0 right-0 bg-corporate-900 border-b border-corporate-800 z-50 h-20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="font-serif text-2xl text-corporate-50 font-medium tracking-tight">
              Management Console
            </h1>
            
            {/* Desktop Tabs (> 1024px) */}
            <nav className="hidden lg:flex items-center h-full gap-4 pt-1">
              <button 
                onClick={() => setActiveTab('inventory')}
                className={`h-20 px-4 text-xs font-sans font-bold uppercase tracking-widest transition-all border-b-2 ${
                  activeTab === 'inventory' 
                  ? 'text-corporate-50 border-corporate-200' 
                  : 'text-corporate-400 border-transparent hover:text-corporate-50'
                }`}
              >
                Inventory
              </button>
              <button 
                onClick={() => setActiveTab('leads')}
                className={`h-20 px-4 text-xs font-sans font-bold uppercase tracking-widest transition-all border-b-2 ${
                  activeTab === 'leads' 
                  ? 'text-corporate-50 border-corporate-200' 
                  : 'text-corporate-400 border-transparent hover:text-corporate-50'
                }`}
              >
                Leads Inquiries
              </button>
            </nav>

            {/* Tablet/Mobile Hamburger (< 1024px) */}
            <div className="lg:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-corporate-50 p-2">
                <Menu size={24} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setShowDocs(true)} className="text-corporate-400 hover:text-corporate-50 transition-colors">
              <HelpCircle size={20} />
            </button>
            <button onClick={onLogout} className="text-corporate-400 hover:text-red-400 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Nav Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 right-0 bg-corporate-900 border-b border-corporate-800 shadow-2xl p-6 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-200">
            <button 
              onClick={() => { setActiveTab('inventory'); setIsMobileMenuOpen(false); }} 
              className={`text-left py-3 px-4 rounded text-xs font-bold uppercase tracking-widest ${activeTab === 'inventory' ? 'bg-corporate-800 text-corporate-50' : 'text-corporate-400'}`}
            >
              Inventory
            </button>
            <button 
              onClick={() => { setActiveTab('leads'); setIsMobileMenuOpen(false); }} 
              className={`text-left py-3 px-4 rounded text-xs font-bold uppercase tracking-widest ${activeTab === 'leads' ? 'bg-corporate-800 text-corporate-50' : 'text-corporate-400'}`}
            >
              Leads Inquiries
            </button>
          </div>
        )}
      </header>

      {showDocs && <AdminDocsModal onClose={() => setShowDocs(false)} />}
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 pt-12 animate-in fade-in duration-500">
        {activeTab === 'inventory' ? (
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-corporate-100 pb-8">
              <div>
                <h2 className="text-3xl font-serif text-corporate-900">Portfolio Management</h2>
                <p className="text-xs font-bold text-corporate-400 uppercase tracking-widest mt-1">Institutional Assets & Metadata</p>
              </div>
              <button 
                onClick={() => isAdding ? resetForm() : setIsAdding(true)}
                className="flex items-center gap-2 px-8 py-4 bg-corporate-900 text-white text-xs font-bold uppercase tracking-widest rounded shadow-xl hover:bg-corporate-800 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {isAdding ? <X size={16} /> : <Plus size={16} />}
                {isAdding ? 'Cancel Registration' : 'Add New Asset'}
              </button>
            </div>

            {isAdding && (
              <div className="mb-12 bg-white p-10 rounded-xl border border-corporate-200 shadow-xl">
                <h2 className="text-xl font-serif text-corporate-900 mb-8">{editingUnitId ? 'Modify Asset Record' : 'Register New Commercial Asset'}</h2>
                <form onSubmit={handleCreateOrUpdateUnit} className="space-y-8">
                  {/* Image Upload Area */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest block">Asset Gallery (Max 3)</label>
                    <div 
                      onClick={() => !uploading && newUnit.image_urls.length < 3 && fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer hover:border-corporate-900 hover:bg-corporate-50 ${newUnit.image_urls.length >= 3 ? 'opacity-40 cursor-not-allowed' : 'border-corporate-200'}`}
                    >
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={(e) => processFiles(e.target.files)} />
                      <div className="flex flex-col items-center gap-4">
                        {uploading ? <Loader2 className="animate-spin text-corporate-900" size={40} /> : <Upload className="text-corporate-300" size={40} />}
                        <p className="text-sm font-medium text-corporate-600">Click to upload or drag assets here</p>
                      </div>
                    </div>
                    {newUnit.image_urls.length > 0 && (
                      <div className="flex gap-4">
                        {newUnit.image_urls.map((url, i) => (
                          <div key={i} className="relative w-32 h-32 rounded-lg overflow-hidden border border-corporate-100 shadow-md group">
                            <img src={url} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => removeImage(url)} className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                              <Trash size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Unit Number</label>
                      <input type="text" value={newUnit.unit_number} onChange={e => setNewUnit({...newUnit, unit_number: e.target.value})} className="w-full px-5 py-4 bg-corporate-50 border border-corporate-200 rounded-lg outline-none focus:border-corporate-900" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Building</label>
                      <select value={newUnit.building_name} onChange={e => setNewUnit({...newUnit, building_name: e.target.value})} className="w-full px-5 py-4 bg-corporate-50 border border-corporate-200 rounded-lg outline-none">
                        <option value="Summit One Tower">Summit One Tower</option>
                        <option value="Facilities Centre">Facilities Centre</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Status</label>
                      <select value={newUnit.status} onChange={e => setNewUnit({...newUnit, status: e.target.value})} className="w-full px-5 py-4 bg-corporate-50 border border-corporate-200 rounded-lg outline-none">
                        <option value="Available">Available</option>
                        <option value="Rented">Rented</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Monthly Rent (PHP)</label>
                      <input type="number" value={newUnit.monthly_rent} onChange={e => setNewUnit({...newUnit, monthly_rent: e.target.value})} className="w-full px-5 py-4 bg-corporate-50 border border-corporate-200 rounded-lg outline-none" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Assoc. Dues (PHP)</label>
                      <input type="number" value={newUnit.assoc_dues} onChange={e => setNewUnit({...newUnit, assoc_dues: e.target.value})} className="w-full px-5 py-4 bg-corporate-50 border border-corporate-200 rounded-lg outline-none" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Area (sqm)</label>
                      <input type="number" value={newUnit.net_area} onChange={e => setNewUnit({...newUnit, net_area: e.target.value})} className="w-full px-5 py-4 bg-corporate-50 border border-corporate-200 rounded-lg outline-none" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Marketing Headline</label>
                    <input type="text" value={newUnit.headline} onChange={e => setNewUnit({...newUnit, headline: e.target.value})} className="w-full px-5 py-4 bg-corporate-50 border border-corporate-200 rounded-lg outline-none focus:border-corporate-900" placeholder="Institutional grade corporate suite..." />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Asset Narrative</label>
                    <textarea value={newUnit.narrative} onChange={e => setNewUnit({...newUnit, narrative: e.target.value})} rows={4} className="w-full px-5 py-4 bg-corporate-50 border border-corporate-200 rounded-lg outline-none focus:border-corporate-900 resize-none" />
                  </div>

                  <button type="submit" disabled={isSubmitting || uploading} className="w-full py-5 bg-corporate-900 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-corporate-800 disabled:opacity-50 flex items-center justify-center gap-3">
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                    {editingUnitId ? 'Finalize Modifications' : 'Complete Asset Registration'}
                  </button>
                </form>
              </div>
            )}

            <div className="bg-white rounded-xl border border-corporate-200 shadow-sm overflow-x-auto">
              <table className="w-full text-left min-w-[1000px]">
                <thead>
                  <tr className="bg-corporate-50 border-b border-corporate-200">
                    <th className="px-8 py-5 text-xs font-bold text-corporate-400 uppercase tracking-widest">Asset</th>
                    <th className="px-8 py-5 text-xs font-bold text-corporate-400 uppercase tracking-widest">Location</th>
                    <th className="px-8 py-5 text-xs font-bold text-corporate-400 uppercase tracking-widest text-right">Rent & Area</th>
                    <th className="px-8 py-5 text-xs font-bold text-corporate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-xs font-bold text-corporate-400 uppercase tracking-widest text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-corporate-100">
                  {units.map(unit => (
                    <tr key={unit.id} className="hover:bg-corporate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-corporate-100 rounded overflow-hidden flex-shrink-0">
                            {unit.image_urls?.[0] ? <img src={unit.image_urls[0]} className="w-full h-full object-cover" /> : <ImageIcon className="m-auto mt-3.5 text-corporate-200" size={20} />}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-corporate-900">Unit {unit.unit_number}</span>
                            <span className="text-[10px] text-corporate-400 font-bold uppercase tracking-widest">{unit.image_urls?.length || 0} Assets Attached</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm text-corporate-600">{unit.building_name}</td>
                      <td className="px-8 py-6 text-right">
                        <div className="text-sm font-bold text-corporate-900">₱{unit.monthly_rent?.toLocaleString()}</div>
                        <div className="text-[10px] text-corporate-400 font-bold uppercase">{unit.net_area} sqm</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${unit.status.toLowerCase().includes('available') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {unit.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button onClick={() => setDeleteConfirmationId(unit.id)} className="p-2 text-corporate-200 hover:text-red-600 transition-colors"><Trash2 size={20} /></button>
                          <button onClick={() => handleModify(unit)} className="p-2 text-corporate-200 hover:text-corporate-900 transition-colors"><Edit3 size={20} /></button>
                          <button onClick={() => toggleStatus(unit.id, unit.status)} className="px-4 py-2 bg-corporate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-corporate-800">
                            Toggle
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-10 border-b border-corporate-100 pb-8">
              <h2 className="text-3xl font-serif text-corporate-900">Incoming Leads</h2>
              <p className="text-xs font-bold text-corporate-400 uppercase tracking-widest mt-1">Tenant Inquiries & Growth Pipeline</p>
            </div>

            {loadingLeads ? (
              <div className="flex flex-col items-center justify-center py-32 text-corporate-400">
                <Loader2 className="animate-spin mb-6" size={48} />
                <p className="font-serif italic text-lg">Synchronizing inquiry database...</p>
              </div>
            ) : leads.length === 0 ? (
              <div className="bg-white rounded-xl border border-corporate-200 border-dashed py-40 text-center animate-in zoom-in-95 duration-500">
                <div className="max-w-md mx-auto space-y-6">
                  <Inbox size={64} className="mx-auto text-corporate-100" />
                  <p className="text-corporate-400 font-serif italic text-2xl">Waiting for your first inquiry!</p>
                  <p className="text-xs text-corporate-300 font-bold uppercase tracking-[0.2em]">Inquiries from the public site will appear here.</p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-corporate-200 shadow-sm overflow-x-auto">
                <table className="w-full text-left min-w-[1100px]">
                  <thead>
                    <tr className="bg-corporate-50 border-b border-corporate-200">
                      <th className="px-8 py-5 text-xs font-bold text-corporate-400 uppercase tracking-widest">Inquirer</th>
                      <th className="px-8 py-5 text-xs font-bold text-corporate-400 uppercase tracking-widest">Contact Channel</th>
                      <th className="px-8 py-5 text-xs font-bold text-corporate-400 uppercase tracking-widest">Unit Interest</th>
                      <th className="px-8 py-5 text-xs font-bold text-corporate-400 uppercase tracking-widest">Inquiry Narrative</th>
                      <th className="px-8 py-5 text-xs font-bold text-corporate-400 uppercase tracking-widest">Timestamp</th>
                      <th className="px-8 py-5 text-xs font-bold text-corporate-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-5 text-xs font-bold text-corporate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-corporate-100">
                    {leads.map(lead => (
                      <tr key={lead.id} className="hover:bg-corporate-50/30 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-corporate-100 flex items-center justify-center text-corporate-400">
                              <User size={20} />
                            </div>
                            <span className="font-bold text-corporate-900">{lead.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col gap-1.5 text-sm">
                            <div className="flex items-center gap-2 text-corporate-700 font-medium leading-none"><Mail size={14} className="text-corporate-300"/> {lead.email}</div>
                            {lead.phone && <div className="flex items-center gap-2 text-corporate-500 leading-none"><Phone size={14} className="text-corporate-300"/> {lead.phone}</div>}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="text-sm font-bold text-corporate-800">
                            {lead.unit_interest || lead.message?.match(/Unit [A-Z0-9]+/i)?.[0] || 'General Inquiry'}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="max-w-xs text-sm text-corporate-600 leading-relaxed italic line-clamp-2" title={lead.message}>
                            "{lead.message}"
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-[10px] text-corporate-400 font-bold uppercase tracking-widest">
                            <Clock size={12} />
                            {new Date(lead.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                            lead.status === 'Archived' ? 'bg-corporate-100 text-corporate-400' :
                            lead.status === 'Contacted' ? 'bg-green-50 text-green-700' : 'bg-corporate-900 text-white shadow-sm'
                          }`}>
                            {lead.status || 'Active Inquiry'}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {lead.status !== 'Contacted' && (
                              <button 
                                onClick={() => updateLeadStatus(lead.id, 'Contacted')}
                                disabled={updatingId === lead.id}
                                className="p-2 text-corporate-200 hover:text-green-600 transition-colors"
                                title="Mark Contacted"
                              >
                                {updatingId === lead.id ? <Loader2 size={18} className="animate-spin" /> : <Check size={20} />}
                              </button>
                            )}
                            {lead.status !== 'Archived' && (
                              <button 
                                onClick={() => updateLeadStatus(lead.id, 'Archived')}
                                disabled={updatingId === lead.id}
                                className="p-2 text-corporate-200 hover:text-corporate-900 transition-colors"
                                title="Archive Lead"
                              >
                                {updatingId === lead.id ? <Loader2 size={18} className="animate-spin" /> : <Archive size={20} />}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirmationId && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-corporate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white max-w-md w-full p-10 rounded-xl shadow-2xl border border-corporate-200">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-red-50 text-red-600 rounded-full"><AlertTriangle size={28} /></div>
              <h3 className="text-2xl font-serif text-corporate-900 leading-tight">Permanent Database Wipe</h3>
            </div>
            <p className="text-corporate-600 mb-10 leading-relaxed text-lg">
              Confirm deletion of <span className="font-bold text-corporate-900">Unit {units.find(u => u.id === deleteConfirmationId)?.unit_number}</span>? This action is irreversible.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteConfirmationId(null)} className="flex-1 py-4 border border-corporate-200 text-corporate-500 font-bold uppercase tracking-widest text-xs rounded hover:bg-corporate-50 transition-all">Cancel</button>
              <button onClick={() => executeDelete(deleteConfirmationId)} className="flex-1 py-4 bg-red-600 text-white font-bold uppercase tracking-widest text-xs rounded hover:bg-red-700 transition-all shadow-lg">Permanently Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};