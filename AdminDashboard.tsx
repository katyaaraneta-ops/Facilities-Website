import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BlogRichTextEditor } from './BlogRichTextEditor';
import { htmlToMarkdown, markdownToHtml } from './blogContentTransform';
import { DraggableFocalPoint } from './DraggableFocalPoint';
import { capturePostHog } from './posthogCapture';
import { slugifyUnitSegment } from './unit-slug';
import { 
  Layout, Building2, CheckCircle2, XCircle, LogOut, Loader2, Plus, X, 
  Type, AlignLeft, Edit3, Trash2, AlertTriangle, Upload, 
  Image as ImageIcon, Trash, HelpCircle, FileText, BookOpen, 
  ShieldCheck, Inbox, Phone, Mail, User, Clock, Archive, Check, Menu, Download, TrendingUp, RotateCcw, History, ClipboardCheck, Copy, Filter, DollarSign, Ban, Briefcase, Calendar
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

const INITIAL_FORM_STATE = {
  unit_number: '',
  url_slug: '',
  building_name: 'Summit One Tower',
  monthly_rent: '',
  assoc_dues: '',
  net_area: '',
  status: 'Available',
  /** YYYY-MM-DD for Supabase; empty → public site shows "Immediate" in Live Facts */
  availability_date: '',
  handover_condition: 'Bare',
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
            <p><span className="font-bold text-corporate-900">Security:</span> Account recovery via secure tokenized password reset protocol.</p>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-2 text-corporate-900">
            <Briefcase size={20} className="text-corporate-900" />
            <h3 className="font-bold uppercase text-sm tracking-widest">Inventory & Lease Operations</h3>
          </div>
          <div className="space-y-4">
            {[
              { step: "Asset Registration", desc: "Use 'Add New Asset' to register commercial units. Metadata includes base rent and net area. Maximum 3 high-quality photos per unit." },
              { step: "Lease Lifecycle", desc: "Click 'Toggle' on an available unit to trigger Rent Confirmation. Define negotiated monthly rates and contract duration (0-60 months). Set to 0 months to hide a unit from public view." },
              { step: "Prorated Cancellation", desc: "When ending a lease, input the actual months completed. The system automatically calculates 'Earned Revenue' vs 'Lost Pipeline' for financial auditing." },
              { step: "Active Metadata", desc: "Lease details (negotiated rent/length) are managed directly within the registration form when a unit is in 'Rented' status." }
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

        <section className="space-y-6">
          <div className="flex items-center gap-2 text-corporate-900">
            <TrendingUp size={20} className="text-corporate-900" />
            <h3 className="font-bold uppercase text-sm tracking-widest">Lead Intelligence</h3>
          </div>
          <div className="space-y-4">
            {[
              { step: "Advanced Filtering", desc: "Use the building filters to isolate inquiries for specific assets (Summit One vs Facilities Centre) or general site inquiries." },
              { step: "Inquiry Processing", desc: "Mark leads as 'Resolved' upon lease signing. Use 'Archive' to clear non-responsive leads from the active growth pipeline." },
              { step: "Institutional Reporting", desc: "Use 'Download CSV' to export all inquiry narratives and contact details for CRM integration or board reporting." }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-4 border border-corporate-100 rounded-lg">
                <div className="font-serif italic text-corporate-300 text-lg">{i+5}</div>
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
  const [activeTab, setActiveTab] = useState<'inventory' | 'leads' | 'blog' | 'analytics'>('inventory');
  const [leadsSubTab, setLeadsSubTab] = useState<'active' | 'resolved' | 'archived'>('active');
  const [selectedBuilding, setSelectedBuilding] = useState('All Buildings');
  const [units, setUnits] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showDocs, setShowDocs] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  
  // Analytics states
  const [cancellationLedger, setCancellationLedger] = useState<any[]>([]);
  const [engagementEvents, setEngagementEvents] = useState<any[]>([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [analyticsTimePeriod, setAnalyticsTimePeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUnit, setNewUnit] = useState(INITIAL_FORM_STATE);
  /** Loaded slug when editing; used to warn on URL change */
  const [originalUrlSlug, setOriginalUrlSlug] = useState('');
  const [buildingsList, setBuildingsList] = useState<{ id: string; building_name: string }[]>([]);
  const [uploading, setUploading] = useState(false);

  // Mark Rented / Lease States
  const [rentConfirmationUnit, setRentConfirmationUnit] = useState<any>(null);
  const [rentPrice, setRentPrice] = useState<number>(0);
  const [contractLength, setContractLength] = useState<number>(12);
  const [isEditingLease, setIsEditingLease] = useState(false);

  /** Snapshot when opening the asset form via Edit (for lease analytics on save). */
  const [unitLeaseSnapshotBeforeFormEdit, setUnitLeaseSnapshotBeforeFormEdit] = useState<{
    status: string;
    monthly_rent: number;
    contract_length: number | null;
  } | null>(null);

  // Cancellation / Proration States
  const [cancelConfirmationUnit, setCancelConfirmationUnit] = useState<any>(null);
  const [monthsCompleted, setMonthsCompleted] = useState<number>(0);

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);

  // Blog states
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loadingBlog, setLoadingBlog] = useState(false);
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [blogFormData, setBlogFormData] = useState({
    slug: '',
    title: '',
    excerpt: '',
    content_markdown: '',
    cover_image_url: '',
    cover_focus_x: 50,
    cover_focus_y: 50,
    is_published: false,
  });
  const [blogContentHtml, setBlogContentHtml] = useState('');
  const [blogEditorMountKey, setBlogEditorMountKey] = useState(0);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [isDraggingBlogCover, setIsDraggingBlogCover] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('buildings').select('id, building_name');
      setBuildingsList(data || []);
    })();
  }, []);

  useEffect(() => {
    fetchUnits();
    fetchLeads(false);
    if (activeTab === 'blog') {
      fetchBlogPosts();
    }
    if (activeTab === 'analytics') {
      fetchAnalyticsData(analyticsTimePeriod);
    }
  }, [activeTab]);
  
  // Refetch analytics when time period changes
  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalyticsData(analyticsTimePeriod);
    }
  }, [analyticsTimePeriod]);

  const fetchUnits = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('units')
      .select('*')
      .order('unit_number', { ascending: true });
    setUnits(data || []);
    setLoading(false);
  };

  const fetchLeads = async (silent = false) => {
    if (!silent) setLoadingLeads(true);
    try {
      const { data, error} = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error('Fetch Leads Error:', err);
    } finally {
      if (!silent) setLoadingLeads(false);
    }
  };

  const fetchBlogPosts = async () => {
    setLoadingBlog(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      setBlogPosts(data || []);
    } catch (err) {
      console.error('Fetch Blog Posts Error:', err);
    } finally {
      setLoadingBlog(false);
    }
  };

  const fetchAnalyticsData = async (timePeriod: '7d' | '30d' | '90d' | 'all' = '30d') => {
    setLoadingAnalytics(true);
    try {
      // Calculate date filter based on time period
      let dateFilter: string | null = null;
      if (timePeriod !== 'all') {
        const daysAgo = timePeriod === '7d' ? 7 : timePeriod === '30d' ? 30 : 90;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
        dateFilter = cutoffDate.toISOString();
      }
      
      // Build engagement events query with optional date filter
      let eventsQuery = supabase
        .from('unit_engagement_events')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (dateFilter) {
        eventsQuery = eventsQuery.gte('created_at', dateFilter);
      }
      
      const [ledgerResult, eventsResult] = await Promise.all([
        supabase
          .from('lease_cancellation_ledger')
          .select('*')
          .order('cancelled_at', { ascending: false }),
        eventsQuery
      ]);
      
      setCancellationLedger(ledgerResult.data || []);
      setEngagementEvents(eventsResult.data || []);
    } catch (err) {
      console.error('Fetch Analytics Error:', err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const handleBlogCoverUpload = async (file: File) => {
    setUploadingCover(true);
    try {
      const compressed = await compressImage(file);
      const filename = `blog-${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(`blog-uploads/${filename}`, compressed, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(`blog-uploads/${filename}`);

      setBlogFormData({ ...blogFormData, cover_image_url: publicUrl });
    } catch (err: any) {
      alert('Cover image upload failed: ' + err.message);
    } finally {
      setUploadingCover(false);
    }
  };

  const resetBlogForm = () => {
    setBlogFormData({
      slug: '',
      title: '',
      excerpt: '',
      content_markdown: '',
      cover_image_url: '',
      cover_focus_x: 50,
      cover_focus_y: 50,
      is_published: false,
    });
    setBlogContentHtml('');
    setBlogEditorMountKey((k) => k + 1);
    setIsAddingPost(false);
    setEditingPostId(null);
  };

  const handleSaveBlogPost = async () => {
    if (!blogFormData.title || !blogFormData.slug || !blogContentHtml.trim()) {
      alert('Title, slug, and content are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert HTML from editor to Markdown for storage
      const contentMarkdown = htmlToMarkdown(blogContentHtml);
      
      const postData: any = {
        title: blogFormData.title,
        slug: blogFormData.slug,
        excerpt: blogFormData.excerpt || null,
        content_markdown: contentMarkdown,
        cover_image_url: blogFormData.cover_image_url || null,
        cover_focus_x: blogFormData.cover_focus_x,
        cover_focus_y: blogFormData.cover_focus_y,
        is_published: blogFormData.is_published,
      };

      if (blogFormData.is_published && !editingPostId) {
        postData.published_at = new Date().toISOString();
      }

      if (editingPostId) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingPostId);

        if (error) throw error;
        alert('Blog post updated!');
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);

        if (error) throw error;
        alert('Blog post created!');
      }

      resetBlogForm();
      fetchBlogPosts();
    } catch (err: any) {
      alert('Save failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditBlogPost = (post: any) => {
    setBlogFormData({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt || '',
      content_markdown: post.content_markdown,
      cover_image_url: post.cover_image_url || '',
      cover_focus_x: post.cover_focus_x ?? 50,
      cover_focus_y: post.cover_focus_y ?? 50,
      is_published: post.is_published,
    });
    // Convert stored Markdown to HTML for the editor
    setBlogContentHtml(markdownToHtml(post.content_markdown));
    setEditingPostId(post.id);
    setIsAddingPost(true);
  };

  const handleTogglePublish = async (postId: string, currentStatus: boolean) => {
    try {
      const updates: any = { is_published: !currentStatus };
      if (!currentStatus) {
        updates.published_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('blog_posts')
        .update(updates)
        .eq('id', postId);

      if (error) throw error;
      fetchBlogPosts();
    } catch (err: any) {
      alert('Toggle publish failed: ' + err.message);
    }
  };

  const handleDeleteBlogPost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      setDeletingPostId(null);
      fetchBlogPosts();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleResolveLead = async (id: string) => {
    const lead = leads.find(l => l.id === id);
    setUpdatingId(id);
    try {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: 'RESOLVED' } : l));
      const { error } = await supabase.from('leads').update({ status: 'RESOLVED' }).eq('id', id);
      if (error) throw error;
      
      capturePostHog('admin_lead_resolved', { 
        lead_id: id, 
        building: lead?.unit_number || lead?.unit_interest || 'Unknown'
      });
      
      await fetchLeads(false); 
    } catch (error: any) {
      console.error('Lead Resolve Error Details:', error);
      alert('Error resolving lead: ' + error.message);
      await fetchLeads(true);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReopenLead = async (id: string) => {
    setUpdatingId(id);
    try {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: 'NEW' } : l));
      const { error } = await supabase.from('leads').update({ status: 'NEW' }).eq('id', id);
      if (error) throw error;
      capturePostHog('admin_lead_reopened', { lead_id: id });
      await fetchLeads(false); 
    } catch (error: any) {
      console.error('Lead Reopen Error Details:', error);
      alert('Error re-opening lead: ' + error.message);
      await fetchLeads(true);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleArchiveLead = async (id: string, archiveState: boolean = true) => {
    setUpdatingId(id);
    try {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, archived: archiveState } : l));
      const { error } = await supabase.from('leads').update({ archived: archiveState }).eq('id', id);
      if (error) throw error;
      
      capturePostHog(archiveState ? 'admin_lead_archived' : 'admin_lead_unarchived', { 
        lead_id: id 
      });
      
      await fetchLeads(false); 
    } catch (error: any) {
      console.error('Lead Archive Action Error Details:', error);
      alert('Error updating archive status: ' + error.message);
      await fetchLeads(true);
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const unit = units.find(u => u.id === id);
    if (!unit) return;

    if (currentStatus.toLowerCase().includes('available')) {
      // Opening Rent Confirmation Modal
      setRentConfirmationUnit(unit);
      setRentPrice(unit.monthly_rent || 0);
      setContractLength(12);
      setIsEditingLease(false);
    } else {
      // Prompt for cancellation with proration
      setCancelConfirmationUnit(unit);
      setMonthsCompleted(0);
    }
  };

  const handleConfirmCancellation = async () => {
    if (!cancelConfirmationUnit) return;
    
    const originalLength = cancelConfirmationUnit.contract_length || 0;
    if (monthsCompleted > originalLength) {
      alert(`Cannot exceed original contract of ${originalLength} months.`);
      return;
    }

    setUpdatingId(cancelConfirmationUnit.id);
    const monthlyRent = cancelConfirmationUnit.monthly_rent || 0;
    const totalValue = monthlyRent * originalLength;
    const earnedValue = monthlyRent * monthsCompleted;
    const lostRevenue = totalValue - earnedValue;

    try {
      const { error } = await supabase.from('units').update({ 
        status: 'Available',
        contract_length: null 
      }).eq('id', cancelConfirmationUnit.id);
      
      if (error) throw error;

      // Insert into cancellation ledger for analytics
      await supabase.from('lease_cancellation_ledger').insert([{
        unit_id: cancelConfirmationUnit.id,
        unit_number: cancelConfirmationUnit.unit_number,
        building_name: cancelConfirmationUnit.building_name || 'Summit One Tower',
        lost_revenue_value: lostRevenue,
        months_stayed: monthsCompleted,
        original_contract_length: originalLength,
        cancelled_at: new Date().toISOString()
      }]);

      capturePostHog('lease_cancelled', {
        unit_id: cancelConfirmationUnit.id,
        unit_number: cancelConfirmationUnit.unit_number,
        lost_revenue_value: lostRevenue,
        months_stayed: monthsCompleted
      });

      await fetchUnits();
      setCancelConfirmationUnit(null);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleFinalizeRent = async () => {
    if (!rentConfirmationUnit) return;
    setIsSubmitting(true);
    const id = rentConfirmationUnit.id;
    const totalContractValue = rentPrice * contractLength;

    try {
      const { error } = await supabase.from('units').update({ 
        status: 'Rented',
        monthly_rent: rentPrice, // Update the rent in the DB to the negotiated price
        contract_length: contractLength 
      }).eq('id', id);

      if (error) throw error;

      capturePostHog(isEditingLease ? 'lease_modified' : 'unit_rented_out', {
        unit_id: id,
        unit_number: rentConfirmationUnit.unit_number,
        building: rentConfirmationUnit.building_name,
        monthly_rent: rentPrice,
        contract_length: contractLength,
        total_contract_value: totalContractValue
      });

      await fetchUnits();
      setRentConfirmationUnit(null);
    } catch (err: any) {
      alert("Error finalizing lease: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModify = (unit: any) => {
    // Always populate the main form so Mercy can edit photos, headlines, etc.
    const slug = (unit.url_slug as string) || slugifyUnitSegment(String(unit.unit_number || ''));
    setOriginalUrlSlug(slug);
    setNewUnit({
      unit_number: unit.unit_number || '',
      url_slug: slug,
      building_name: unit.building_name || 'Summit One Tower',
      monthly_rent: unit.monthly_rent?.toString() || '',
      assoc_dues: unit.assoc_dues?.toString() || '',
      net_area: unit.net_area?.toString() || '',
      status: unit.status || 'Available',
      availability_date: unit.availability_date
        ? String(unit.availability_date).slice(0, 10)
        : '',
      handover_condition: unit.handover_condition || 'Bare',
      headline: unit.headline || '',
      narrative: unit.narrative || '',
      image_urls: unit.image_urls || []
    });

    setContractLength(unit.contract_length || 12);
    setEditingUnitId(unit.id);
    setUnitLeaseSnapshotBeforeFormEdit({
      status: (unit.status || 'Available').trim(),
      monthly_rent: Number(unit.monthly_rent) || 0,
      contract_length: unit.contract_length ?? null,
    });
    setIsAdding(true); // Open the edit panel at the top
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
    setUnitLeaseSnapshotBeforeFormEdit(null);
    setOriginalUrlSlug('');
  };

  const handleCreateOrUpdateUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const monthlyRentNum = parseFloat(newUnit.monthly_rent) || 0;
    const buildingId = buildingsList.find((b) => b.building_name === newUnit.building_name)?.id;
    if (!buildingId) {
      alert('Could not resolve building. Refresh the page and try again.');
      setIsSubmitting(false);
      return;
    }
    let urlSlug = newUnit.url_slug.trim().toLowerCase();
    if (!urlSlug) urlSlug = slugifyUnitSegment(newUnit.unit_number);
    const unitData = {
      unit_number: newUnit.unit_number,
      building_name: newUnit.building_name,
      building_id: buildingId,
      url_slug: urlSlug,
      monthly_rent: monthlyRentNum,
      assoc_dues: parseFloat(newUnit.assoc_dues),
      net_area: parseFloat(newUnit.net_area),
      status: newUnit.status,
      handover_condition: newUnit.handover_condition,
      headline: newUnit.headline,
      narrative: newUnit.narrative,
      image_urls: newUnit.image_urls,
      contract_length: newUnit.status === 'Rented' ? contractLength : null,
      listing_type: 'Office',
      availability_date: newUnit.availability_date.trim() || null
    };
    try {
      if (editingUnitId) {
        const { error } = await supabase.from('units').update(unitData).eq('id', editingUnitId);
        if (error) {
          const slugDup =
            error.code === '23505' && String(error.message || '').toLowerCase().includes('url_slug');
          alert(slugDup ? 'That URL slug is already used for another unit in this building.' : 'Database Error: ' + error.message);
          return;
        }
        if (newUnit.status === 'Rented') {
          const prev = unitLeaseSnapshotBeforeFormEdit;
          const prevWasRented = prev != null && String(prev.status).toLowerCase() === 'rented';
          const totalContractValue = monthlyRentNum * contractLength;
          const leasePayload = {
            unit_id: editingUnitId,
            unit_number: newUnit.unit_number,
            building: newUnit.building_name,
            monthly_rent: monthlyRentNum,
            contract_length: contractLength,
            total_contract_value: totalContractValue,
          };
          if (!prevWasRented) {
            capturePostHog('unit_rented_out', leasePayload);
          } else {
            const rentChanged = prev.monthly_rent !== monthlyRentNum;
            const lenChanged = (prev.contract_length ?? null) !== contractLength;
            if (rentChanged || lenChanged) {
              capturePostHog('lease_modified', leasePayload);
            }
          }
        }
      } else {
        const { data: inserted, error } = await supabase.from('units').insert([unitData]).select('id').single();
        if (error) {
          const slugDup =
            error.code === '23505' && String(error.message || '').toLowerCase().includes('url_slug');
          alert(slugDup ? 'That URL slug is already used for another unit in this building.' : 'Database Error: ' + error.message);
          return;
        }
        if (newUnit.status === 'Rented' && inserted?.id) {
          capturePostHog('unit_rented_out', {
            unit_id: inserted.id,
            unit_number: newUnit.unit_number,
            building: newUnit.building_name,
            monthly_rent: monthlyRentNum,
            contract_length: contractLength,
            total_contract_value: monthlyRentNum * contractLength,
          });
        }
      }
      await fetchUnits();
      resetForm();
    } catch (err: any) {
      alert('Database Error: ' + (err?.message || String(err)));
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadLeadsCSV = () => {
    if (leads.length === 0) {
      window.alert("No data available to export");
      return;
    }
    
    const headers = ["Inquirer", "Email", "Phone", "Unit Interest", "Narrative", "Timestamp", "Status", "Is Archived"];
    
    const sanitize = (val: string | number | null | undefined) => {
      const strValue = val === null || val === undefined ? "" : String(val);
      return `"${strValue.replace(/"/g, '""')}"`;
    };

    const rows = leads.map(lead => [
      sanitize(lead.full_name || lead.name || "Anonymous"),
      sanitize(lead.email),
      sanitize(lead.phone || "N/A"),
      sanitize(lead.unit_number || lead.unit_interest || "General Inquiry"),
      sanitize(lead.message || ""),
      sanitize(new Date(lead.created_at).toLocaleString()),
      sanitize((lead.status || 'NEW').toUpperCase()),
      sanitize(lead.archived ? 'YES' : 'NO')
    ]);
    
    const csvContent = [headers.map(sanitize), ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    const dateStamp = new Date().toISOString().split('T')[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `FacilitiesInquiries_${dateStamp}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    capturePostHog('admin_leads_exported', { count: leads.length });
  };

  const handleCopyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(id);
    setTimeout(() => setCopyStatus(null), 2000);
    capturePostHog('admin_copy_to_clipboard', { type: id.includes('email') ? 'email' : 'phone' });
  };

  const handleBuildingFilterChange = (val: string) => {
    setSelectedBuilding(val);
    capturePostHog('admin_filter_used', { building: val });
  };

  const applyBuildingFilter = (l: any) => {
    if (selectedBuilding === 'All Buildings') return true;
    const unitInfo = (l.unit_number || l.unit_interest || '').toUpperCase();
    if (selectedBuilding === 'General Inquiry') return unitInfo === 'GENERAL INQUIRY';
    return unitInfo.includes(selectedBuilding.toUpperCase());
  };

  const filteredSet = leads.filter(applyBuildingFilter);
  
  const activeCount = filteredSet.filter(l => (l.status || 'NEW').toUpperCase() === 'NEW' && !l.archived).length;
  const resolvedCount = filteredSet.filter(l => (l.status || 'NEW').toUpperCase() === 'RESOLVED' && !l.archived).length;
  const archivedCount = filteredSet.filter(l => l.archived).length;
  
  const filteredLeads = filteredSet.filter(l => {
    const status = (l.status || 'NEW').toUpperCase();
    if (leadsSubTab === 'archived') return l.archived;
    if (leadsSubTab === 'resolved') return status === 'RESOLVED' && !l.archived;
    return status === 'NEW' && !l.archived;
  });

  return (
    <div className="min-h-screen bg-corporate-50 flex flex-col relative text-corporate-900">
      <header className="sticky top-0 left-0 right-0 bg-corporate-900 border-b border-corporate-800 z-50 h-20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="font-serif text-2xl text-corporate-50 font-medium tracking-tight">Management Console</h1>
            <nav className="hidden lg:flex items-center h-full gap-4 pt-1">
              <button onClick={() => setActiveTab('inventory')} className={`h-20 px-4 text-xs font-sans font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === 'inventory' ? 'text-corporate-50 border-corporate-200' : 'text-corporate-400 border-transparent hover:text-corporate-50'}`}>Inventory</button>
              <button onClick={() => setActiveTab('leads')} className={`h-20 px-4 text-xs font-sans font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === 'leads' ? 'text-corporate-50 border-corporate-200' : 'text-corporate-400 border-transparent hover:text-corporate-50'}`}>Leads Inquiries</button>
              <button onClick={() => setActiveTab('blog')} className={`h-20 px-4 text-xs font-sans font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === 'blog' ? 'text-corporate-50 border-corporate-200' : 'text-corporate-400 border-transparent hover:text-corporate-50'}`}>Blog</button>
              <button onClick={() => setActiveTab('analytics')} className={`h-20 px-4 text-xs font-sans font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === 'analytics' ? 'text-corporate-50 border-corporate-200' : 'text-corporate-400 border-transparent hover:text-corporate-50'}`}>Analytics</button>
            </nav>
            <div className="lg:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-corporate-50 p-2"><Menu size={24} /></button>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <a 
              href="/" 
              className="text-corporate-400 hover:text-corporate-50 transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2"
            >
              <TrendingUp size={18} />
              <span className="hidden sm:inline">View Site</span>
            </a>
            <button onClick={() => setShowDocs(true)} className="text-corporate-400 hover:text-corporate-50 transition-colors"><HelpCircle size={20} /></button>
            <button onClick={onLogout} className="text-corporate-400 hover:text-red-400 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest"><LogOut size={18} /><span className="hidden sm:inline">Logout</span></button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 right-0 bg-corporate-900 border-b border-corporate-800 shadow-2xl p-6 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-200">
            <button onClick={() => { setActiveTab('inventory'); setIsMobileMenuOpen(false); }} className={`text-left py-3 px-4 rounded text-xs font-bold uppercase tracking-widest ${activeTab === 'inventory' ? 'bg-corporate-800 text-corporate-50' : 'text-corporate-400'}`}>Inventory</button>
            <button onClick={() => { setActiveTab('leads'); setIsMobileMenuOpen(false); }} className={`text-left py-3 px-4 rounded text-xs font-bold uppercase tracking-widest ${activeTab === 'leads' ? 'bg-corporate-800 text-corporate-50' : 'text-corporate-400'}`}>Leads Inquiries</button>
            <button onClick={() => { setActiveTab('blog'); setIsMobileMenuOpen(false); }} className={`text-left py-3 px-4 rounded text-xs font-bold uppercase tracking-widest ${activeTab === 'blog' ? 'bg-corporate-800 text-corporate-50' : 'text-corporate-400'}`}>Blog</button>
            <button onClick={() => { setActiveTab('analytics'); setIsMobileMenuOpen(false); }} className={`text-left py-3 px-4 rounded text-xs font-bold uppercase tracking-widest ${activeTab === 'analytics' ? 'bg-corporate-800 text-corporate-50' : 'text-corporate-400'}`}>Analytics</button>
          </div>
        )}
      </header>

      {showDocs && <AdminDocsModal onClose={() => setShowDocs(false)} />}
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-500">
        {activeTab === 'inventory' ? (
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-corporate-100 pb-8">
              <div>
                <h2 className="text-3xl font-serif text-corporate-900">Portfolio Management</h2>
                <p className="text-xs font-bold text-corporate-400 uppercase tracking-widest mt-1">Institutional Assets & Metadata</p>
              </div>
              <button onClick={() => { if (isAdding) resetForm(); else { setUnitLeaseSnapshotBeforeFormEdit(null); setOriginalUrlSlug(''); setIsAdding(true); } }} className="flex items-center gap-2 px-8 py-4 bg-corporate-900 text-white text-xs font-bold uppercase tracking-widest rounded shadow-xl hover:bg-corporate-800 transition-all transform hover:-translate-y-0.5 active:translate-y-0">
                {isAdding ? <X size={16} /> : <Plus size={16} />}
                {isAdding ? 'Cancel Registration' : 'Add New Asset'}
              </button>
            </div>
            {isAdding && (
              <div className="mb-12 bg-white p-10 rounded-xl border border-corporate-200 shadow-xl animate-in slide-in-from-top-4">
                <h2 className="text-xl font-serif text-corporate-900 mb-8">{editingUnitId ? 'Modify Asset Record' : 'Register New Commercial Asset'}</h2>
                <form onSubmit={handleCreateOrUpdateUnit} className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest block">Asset Gallery (Max 3)</label>
                    <div 
                      onClick={() => !uploading && newUnit.image_urls.length < 3 && fileInputRef.current?.click()} 
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); if (newUnit.image_urls.length < 3) setIsDragging(true); }}
                      onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); if (newUnit.image_urls.length < 3) setIsDragging(true); }}
                      onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
                      onDrop={(e) => { 
                        e.preventDefault(); 
                        e.stopPropagation(); 
                        setIsDragging(false); 
                        if (newUnit.image_urls.length < 3) processFiles(e.dataTransfer.files); 
                      }}
                      className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${isDragging ? 'border-corporate-900 bg-corporate-50 shadow-inner' : 'border-corporate-200 hover:border-corporate-900 hover:bg-corporate-50'} ${newUnit.image_urls.length >= 3 ? 'opacity-40 cursor-not-allowed border-corporate-100' : ''}`}
                    >
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={(e) => processFiles(e.target.files)} />
                      <div className="flex flex-col items-center gap-4">
                        {uploading ? <Loader2 className="animate-spin text-corporate-900" size={40} /> : <Upload className={isDragging ? "text-corporate-900" : "text-corporate-300"} size={40} />}
                        <p className={`text-sm font-medium ${isDragging ? "text-corporate-900" : "text-corporate-600"}`}>{isDragging ? "Drop your assets now" : "Click to upload or drag assets here"}</p>
                      </div>
                    </div>
                    {newUnit.image_urls.length > 0 && (
                      <div className="flex gap-4">
                        {newUnit.image_urls.map((url, i) => (
                          <div key={i} className="relative w-32 h-32 rounded-lg overflow-hidden border border-corporate-100 shadow-md group">
                            <img
                              src={url}
                              alt={
                                newUnit.unit_number
                                  ? `Uploaded listing image ${i + 1} for Unit ${newUnit.unit_number}`
                                  : `Uploaded listing image ${i + 1}`
                              }
                              className="w-full h-full object-cover"
                            />
                            <button type="button" onClick={() => removeImage(url)} className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash size={14} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2"><label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Unit Number</label><input type="text" value={newUnit.unit_number} onChange={e => setNewUnit({...newUnit, unit_number: e.target.value})} className="w-full px-5 py-4 bg-corporate-50 border border-corporate-200 rounded-lg outline-none focus:border-corporate-900" required /></div>
                    <div className="space-y-2"><label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Building</label><select value={newUnit.building_name} onChange={e => setNewUnit({...newUnit, building_name: e.target.value})} className="w-full px-5 py-4 bg-corporate-50 border border-corporate-200 rounded-lg outline-none"><option value="Summit One Tower">Summit One Tower</option><option value="Facilities Centre">Facilities Centre</option></select></div>
                    <div className="space-y-2"><label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Status</label><select value={newUnit.status} onChange={e => setNewUnit({...newUnit, status: e.target.value})} className="w-full px-5 py-4 bg-corporate-50 border border-corporate-200 rounded-lg outline-none"><option value="Available">Available</option><option value="Rented">Rented</option></select></div>
                    <div className="space-y-2 md:col-span-3">
                      <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Public URL slug</label>
                      <input
                        type="text"
                        value={newUnit.url_slug}
                        onChange={(e) => setNewUnit({ ...newUnit, url_slug: e.target.value })}
                        className="w-full px-5 py-4 bg-corporate-50 border border-corporate-200 rounded-lg outline-none focus:border-corporate-900"
                        placeholder="e.g. 3602 — auto-filled from unit number if left blank on save"
                      />
                      <p className="text-[10px] text-corporate-400 mt-1">Shown as /units/&lt;building&gt;/&lt;slug&gt;</p>
                      {editingUnitId && originalUrlSlug !== '' && newUnit.url_slug.trim() !== originalUrlSlug.trim() ? (
                        <p className="text-xs text-amber-800 mt-2">Changing this changes the public URL.</p>
                      ) : null}
                    </div>
                    <div className="space-y-2"><label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Monthly Rent (PHP)</label><input type="number" value={newUnit.monthly_rent} onChange={e => setNewUnit({...newUnit, monthly_rent: e.target.value})} className="w-full px-5 py-4 bg-corporate-50 border border-corporate-200 rounded-lg outline-none" required /></div>
                     <div className="space-y-2"><label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Assoc. Dues (PHP)</label><input type="number" value={newUnit.assoc_dues} onChange={e => setNewUnit({...newUnit, assoc_dues: e.target.value})} className="w-full px-5 py-4 bg-corporate-50 border border-corporate-200 rounded-lg outline-none" required /></div>
                     <div className="space-y-2"><label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Area (sqm)</label><input type="number" value={newUnit.net_area} onChange={e => setNewUnit({...newUnit, net_area: e.target.value})} className="w-full px-5 py-4 bg-corporate-50 border border-corporate-200 rounded-lg outline-none" required /></div>
                     <div className="space-y-2">
                       <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Availability date</label>
                       <div className="relative">
                         <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-corporate-400 pointer-events-none" size={18} aria-hidden />
                         <input
                           type="date"
                           value={newUnit.availability_date}
                           onChange={e => setNewUnit({ ...newUnit, availability_date: e.target.value })}
                           className="w-full pl-12 pr-5 py-4 bg-corporate-50 border border-corporate-200 rounded-lg outline-none focus:border-corporate-900 text-corporate-900 [color-scheme:light]"
                         />
                       </div>
                       <p className="text-[10px] text-corporate-400 font-medium leading-relaxed">Shown under Live Facts on the public unit page. Leave empty for &quot;Immediate&quot;.</p>
                     </div>
                     <div className="space-y-2">
                       <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Handover Condition</label>
                       <select 
                         value={newUnit.handover_condition} 
                         onChange={e => setNewUnit({...newUnit, handover_condition: e.target.value})} 
                         className="w-full px-5 py-4 bg-corporate-50 border border-corporate-200 rounded-lg outline-none focus:border-corporate-900"
                       >
                         <option value="Fitted">Fitted</option>
                         <option value="Bare">Bare</option>
                       </select>
                     </div>
                    
                    {newUnit.status === 'Rented' && (
                      <div className="col-span-full mt-4 p-8 bg-indigo-50/50 rounded-xl border border-indigo-100 animate-in slide-in-from-top-2">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 bg-indigo-600 text-white rounded-lg"><DollarSign size={18} /></div>
                          <div>
                            <h3 className="text-sm font-bold text-corporate-900 uppercase tracking-widest">Active Lease Metadata</h3>
                            <p className="text-[10px] text-corporate-400 font-bold uppercase">Financial terms for the current tenant</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Contracted Monthly Rent (PHP)</label>
                            <input type="number" value={newUnit.monthly_rent} onChange={e => setNewUnit({...newUnit, monthly_rent: e.target.value})} className="w-full px-5 py-4 bg-corporate-50 border border-corporate-200 rounded-lg outline-none focus:border-corporate-900" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Contract Duration (Months)</label>
                            <select value={contractLength} onChange={e => setContractLength(parseInt(e.target.value))} className="w-full px-5 py-4 bg-corporate-50 border border-corporate-200 rounded-lg outline-none focus:border-corporate-900 font-bold text-corporate-900">
                              {[0, 6, 12, 18, 24, 36, 48, 60].map(m => <option key={m} value={m}>{m === 0 ? '0 Months (Hide Unit)' : `${m} Months`}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2"><label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Marketing Headline</label><input type="text" value={newUnit.headline} onChange={e => setNewUnit({...newUnit, headline: e.target.value})} className="w-full px-5 py-4 bg-corporate-50 border border-corporate-200 rounded-lg outline-none focus:border-corporate-900" placeholder="Institutional grade corporate suite..." /></div>
                  <div className="space-y-2"><label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Asset Narrative</label><textarea value={newUnit.narrative} onChange={e => setNewUnit({...newUnit, narrative: e.target.value})} rows={4} className="w-full px-5 py-4 bg-corporate-50 border border-corporate-200 rounded-lg outline-none focus:border-corporate-900 resize-none" /></div>
                  <button type="submit" disabled={isSubmitting || uploading} className="w-full py-5 bg-corporate-900 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-corporate-800 disabled:opacity-50 flex items-center justify-center gap-3 transition-all">{isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}{editingUnitId ? 'Finalize Modifications' : 'Complete Asset Registration'}</button>
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
                            {unit.image_urls?.[0] ? (
                              <img
                                src={unit.image_urls[0]}
                                alt={`Thumbnail for Unit ${unit.unit_number}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="m-auto mt-3.5 text-corporate-200" size={20} />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-corporate-900">Unit {unit.unit_number}</span>
                            <span className="text-[10px] text-corporate-400 font-bold uppercase tracking-widest">
                              {unit.image_urls?.length || 0} Assets Attached
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm text-corporate-600">{unit.building_name}</td>
                      <td className="px-8 py-6 text-right"><div className="text-sm font-bold text-corporate-900">₱{unit.monthly_rent?.toLocaleString()}</div><div className="text-[10px] text-corporate-400 font-bold uppercase">{unit.net_area} sqm</div></td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className={`w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm ${unit.status.toLowerCase().includes('available') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {unit.status}
                          </span>
                          {unit.status.toLowerCase() === 'rented' && unit.contract_length && (
                            <div className="mt-1.5 px-1">
                              <p className="text-[10px] text-corporate-500 font-medium">₱{unit.monthly_rent?.toLocaleString()}/mo</p>
                              <p className="text-[9px] text-corporate-400 font-bold uppercase tracking-tighter">{unit.contract_length} Month Duration</p>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right"><div className="flex items-center justify-end gap-3"><button onClick={() => setDeleteConfirmationId(unit.id)} className="p-2 text-corporate-200 hover:text-red-600 transition-colors" title="Delete Asset"><Trash2 size={20} /></button><button onClick={() => handleModify(unit)} className="p-2 text-corporate-200 hover:text-corporate-900 transition-colors" title={unit.status.toLowerCase() === 'rented' ? "Edit Lease Metadata" : "Edit Asset Details"}><Edit3 size={20} /></button><button onClick={() => toggleStatus(unit.id, unit.status)} className={`px-4 py-2 text-white text-[10px] font-bold uppercase tracking-widest rounded-md transition-colors ${unit.status.toLowerCase() === 'rented' ? 'bg-red-600 hover:bg-red-700' : 'bg-corporate-900 hover:bg-corporate-800'}`}>{unit.status.toLowerCase() === 'rented' ? 'End Lease' : 'Toggle'}</button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'leads' ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-500">
              <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm"><Inbox className="text-white" size={20} /></div>
                <div className="flex flex-col">
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-none mb-1.5">Total New Leads</p>
                  <div className="flex flex-col"><span className="text-3xl font-sans font-bold text-slate-900 leading-tight">{activeCount}</span><span className="text-[11px] text-slate-400 font-medium">Requires Action</span></div>
                </div>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 shadow-sm"><ClipboardCheck className="text-white" size={20} /></div>
                <div className="flex flex-col">
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-none mb-1.5">Total Resolved</p>
                  <div className="flex flex-col"><span className="text-3xl font-sans font-bold text-slate-900 leading-tight">{resolvedCount}</span><span className="text-[11px] text-slate-400 font-medium">Successfully Processed</span></div>
                </div>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0 shadow-sm"><Archive className="text-white" size={20} /></div>
                <div className="flex flex-col">
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-none mb-1.5">Total Archived</p>
                  <div className="flex flex-col"><span className="text-3xl font-sans font-bold text-slate-900 leading-tight">{archivedCount}</span><span className="text-[11px] text-slate-400 font-medium">Repository Storage</span></div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-corporate-100 pb-8 gap-6">
                <div>
                  <h2 className="text-3xl font-serif text-corporate-900">Incoming Leads</h2>
                  <p className="text-xs font-bold text-corporate-400 uppercase tracking-widest mt-1">Tenant Inquiries & Growth Pipeline</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <div className="flex items-center gap-2 px-4 py-3 border border-corporate-200 rounded bg-white hover:bg-corporate-50 transition-colors cursor-pointer">
                      <Filter size={16} className="text-corporate-400" />
                      <select 
                        value={selectedBuilding} 
                        onChange={(e) => handleBuildingFilterChange(e.target.value)}
                        className="bg-transparent border-none outline-none text-[10px] font-bold uppercase tracking-widest text-corporate-700 cursor-pointer pr-4"
                      >
                        <option value="All Buildings">All Buildings</option>
                        <option value="Summit One Tower">Summit One Tower</option>
                        <option value="Facilities Centre">Facilities Centre</option>
                        <option value="General Inquiry">General Inquiries</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={downloadLeadsCSV} className="flex items-center gap-2 px-6 py-3 border border-corporate-200 text-corporate-700 text-[10px] font-bold uppercase tracking-widest rounded hover:bg-corporate-50 transition-all shadow-sm"><Download size={16} />Download CSV</button>
                </div>
              </div>
              
              <div className="flex gap-1 bg-white p-1 rounded-lg border border-corporate-100 w-fit">
                {[
                  { id: 'active', label: 'Active Inquiries', count: activeCount },
                  { id: 'resolved', label: 'Resolved', count: resolvedCount },
                  { id: 'archived', label: 'Archived', count: archivedCount }
                ].map((tab) => (
                  <button 
                    key={tab.id} 
                    onClick={() => setLeadsSubTab(tab.id as any)} 
                    className={`px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all flex items-center gap-2 ${leadsSubTab === tab.id ? 'bg-corporate-900 text-white shadow-md' : 'text-corporate-400 hover:text-corporate-700 hover:bg-corporate-50'}`}
                  >
                    <span>{tab.label} ({tab.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {loadingLeads ? (
              <div className="flex flex-col items-center justify-center py-32 text-corporate-400"><Loader2 className="animate-spin mb-6" size={48} /><p className="font-serif italic text-lg text-center">Synchronizing lead repository...</p></div>
            ) : filteredLeads.length === 0 ? (
              <div className="bg-white rounded-xl border border-corporate-200 border-dashed py-40 text-center animate-in zoom-in-95 duration-500"><div className="max-w-md mx-auto space-y-6"><Inbox size={64} className="mx-auto text-corporate-100" /><p className="text-corporate-400 font-serif italic text-2xl">No inquiries found in this category.</p><p className="text-xs text-corporate-300 font-bold uppercase tracking-[0.2em]">Incoming data will populate here automatically.</p></div></div>
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
                    {filteredLeads.map(lead => (
                      <tr key={lead.id} className="hover:bg-corporate-50/30 transition-colors animate-in fade-in duration-300">
                        <td className="px-8 py-6"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-corporate-100 flex items-center justify-center text-corporate-400"><User size={20} /></div><span className="font-bold text-corporate-900">{lead.full_name || lead.name || 'Inquirer'}</span></div></td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col gap-1.5 text-sm">
                            <div className="flex items-center gap-2 text-corporate-700 font-medium leading-none truncate max-w-[200px]" title={lead.email}>
                              <Mail size={14} className="text-corporate-300 flex-shrink-0"/> 
                              {lead.email}
                              <button 
                                onClick={() => handleCopyToClipboard(lead.email, `email-${lead.id}`)} 
                                className="ml-1 text-corporate-300 hover:text-corporate-900 transition-colors relative"
                                title="Copy Email"
                              >
                                {copyStatus === `email-${lead.id}` ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                                {copyStatus === `email-${lead.id}` && <span className="absolute -top-6 left-0 bg-corporate-900 text-white text-[8px] px-1.5 py-0.5 rounded shadow-lg animate-in fade-in slide-in-from-bottom-1">Copied!</span>}
                              </button>
                            </div>
                            {lead.phone && (
                              <div className="flex items-center gap-2 text-corporate-500 leading-none">
                                <Phone size={14} className="text-corporate-300 flex-shrink-0"/> 
                                {lead.phone}
                                <button 
                                  onClick={() => handleCopyToClipboard(lead.phone, `phone-${lead.id}`)} 
                                  className="ml-1 text-corporate-300 hover:text-corporate-900 transition-colors relative"
                                  title="Copy Phone"
                                >
                                  {copyStatus === `phone-${lead.id}` ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                                  {copyStatus === `phone-${lead.id}` && <span className="absolute -top-6 left-0 bg-corporate-900 text-white text-[8px] px-1.5 py-0.5 rounded shadow-lg animate-in fade-in slide-in-from-bottom-1">Copied!</span>}
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-6"><div className="text-sm font-bold text-corporate-800">{lead.unit_number || lead.unit_interest || 'General Inquiry'}</div></td>
                        <td className="px-8 py-6"><div className="max-w-xs text-sm text-corporate-600 leading-relaxed italic line-clamp-2" title={lead.message}>"{lead.message || 'No narrative provided.'}"</div></td>
                        <td className="px-8 py-6"><div className="flex items-center gap-2 text-[10px] text-corporate-400 font-bold uppercase tracking-widest"><Clock size={12} />{new Date(lead.created_at).toLocaleDateString()}</div></td>
                        <td className="px-8 py-6"><span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-sm ${(lead.status || 'NEW').toUpperCase() === 'RESOLVED' ? 'bg-green-100 text-green-700' : lead.archived ? 'bg-corporate-100 text-corporate-400' : 'bg-corporate-900 text-white'}`}>{lead.archived ? 'Archived' : (lead.status || 'NEW').toUpperCase()}</span></td>
                        <td className="px-8 py-6 text-right"><div className="flex items-center justify-end gap-2">{leadsSubTab === 'active' && <button onClick={() => handleResolveLead(lead.id)} disabled={updatingId === lead.id} className="p-2 text-corporate-200 hover:text-green-600 transition-colors" title="Mark Resolved">{updatingId === lead.id ? <Loader2 size={18} className="animate-spin" /> : <Check size={20} />}</button>}{leadsSubTab === 'resolved' && <button onClick={() => handleReopenLead(lead.id)} disabled={updatingId === lead.id} className="p-2 text-corporate-200 hover:text-corporate-900 transition-colors" title="Re-open Inquiry">{updatingId === lead.id ? <Loader2 size={18} className="animate-spin" /> : <RotateCcw size={20} />}</button>}<button onClick={() => handleArchiveLead(lead.id, !lead.archived)} disabled={updatingId === lead.id} className={`p-2 transition-colors ${lead.archived ? 'text-indigo-600 hover:text-indigo-800' : 'text-corporate-200 hover:text-corporate-900'}`} title={lead.archived ? "Restore to Inbox" : "Move to Archive"}>{updatingId === lead.id ? <Loader2 size={18} className="animate-spin" /> : lead.archived ? <History size={20} /> : <Archive size={20} />}</button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : activeTab === 'blog' ? (
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-corporate-100 pb-8">
              <div>
                <h2 className="text-3xl font-serif text-corporate-900">Blog Management</h2>
                <p className="text-xs font-bold text-corporate-400 uppercase tracking-widest mt-1">Content Marketing & Publishing</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  isAddingPost
                    ? resetBlogForm()
                    : (() => {
                        setBlogEditorMountKey((k) => k + 1);
                        setBlogContentHtml('');
                        setIsAddingPost(true);
                      })()
                }
                className="flex items-center gap-2 px-8 py-4 bg-corporate-900 text-white text-xs font-bold uppercase tracking-widest rounded shadow-xl hover:bg-corporate-800 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {isAddingPost ? <X size={16} /> : <Plus size={16} />}
                {isAddingPost ? 'Cancel' : 'New Blog Post'}
              </button>
            </div>

            {isAddingPost && (
              <div className="mb-12 bg-white p-10 rounded-xl border border-corporate-200 shadow-xl animate-in slide-in-from-top-4">
                <h2 className="text-xl font-serif text-corporate-900 mb-8">
                  {editingPostId ? 'Edit Blog Post' : 'Create New Blog Post'}
                </h2>
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Title</label>
                      <input
                        type="text"
                        value={blogFormData.title}
                        onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })}
                        className="w-full px-5 py-4 bg-corporate-50 border border-corporate-200 rounded-lg outline-none focus:border-corporate-900"
                        placeholder="How to Choose Office Space in Mandaluyong"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Slug (URL)</label>
                      <input
                        type="text"
                        value={blogFormData.slug}
                        onChange={(e) => setBlogFormData({ ...blogFormData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                        className="w-full px-5 py-4 bg-corporate-50 border border-corporate-200 rounded-lg outline-none focus:border-corporate-900 font-mono text-sm"
                        placeholder="how-to-choose-office-space"
                        required
                      />
                      <p className="text-[10px] text-corporate-400">Will appear as: /blog/{blogFormData.slug || 'your-slug'}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Excerpt (Optional)</label>
                    <textarea
                      value={blogFormData.excerpt}
                      onChange={(e) => setBlogFormData({ ...blogFormData, excerpt: e.target.value })}
                      rows={2}
                      className="w-full px-5 py-4 bg-corporate-50 border border-corporate-200 rounded-lg outline-none focus:border-corporate-900 resize-none"
                      placeholder="A brief summary that appears in search results and post previews..."
                    />
                  </div>

                  {blogFormData.cover_image_url ? (
                    <div className="space-y-3">
                      <DraggableFocalPoint
                        imageUrl={blogFormData.cover_image_url}
                        focusX={blogFormData.cover_focus_x}
                        focusY={blogFormData.cover_focus_y}
                        onFocusChange={(x, y) => setBlogFormData({ ...blogFormData, cover_focus_x: x, cover_focus_y: y })}
                      />
                      <button
                        type="button"
                        onClick={() => setBlogFormData({ ...blogFormData, cover_image_url: '', cover_focus_x: 50, cover_focus_y: 50 })}
                        className="w-full px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash size={16} />
                        Remove Cover Image
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Cover Image</label>
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!uploadingCover) setIsDraggingBlogCover(true);
                        }}
                        onDragEnter={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!uploadingCover) setIsDraggingBlogCover(true);
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsDraggingBlogCover(false);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsDraggingBlogCover(false);
                          if (uploadingCover) return;
                          const file = e.dataTransfer.files?.[0];
                          if (file && file.type.startsWith('image/')) {
                            handleBlogCoverUpload(file);
                          }
                        }}
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                          isDraggingBlogCover
                            ? 'border-corporate-900 bg-corporate-50 shadow-inner'
                            : 'border-corporate-200 hover:border-corporate-900 hover:bg-corporate-50'
                        } ${uploadingCover ? 'opacity-60 pointer-events-none' : ''}`}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleBlogCoverUpload(e.target.files[0])}
                          className="hidden"
                          id="blog-cover-input"
                        />
                        <label htmlFor="blog-cover-input" className="cursor-pointer flex flex-col items-center gap-4">
                          {uploadingCover ? (
                            <Loader2 className="animate-spin text-corporate-900" size={40} />
                          ) : (
                            <Upload className={isDraggingBlogCover ? 'text-corporate-900' : 'text-corporate-300'} size={40} />
                          )}
                          <p className={`text-sm font-medium ${isDraggingBlogCover ? 'text-corporate-900' : 'text-corporate-600'}`}>
                            {uploadingCover
                              ? 'Uploading...'
                              : isDraggingBlogCover
                                ? 'Drop image here'
                                : 'Click to upload or drag and drop a cover image'}
                          </p>
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Content</label>
                    <BlogRichTextEditor
                      key={editingPostId ?? `new-${blogEditorMountKey}`}
                      initialHtml={blogContentHtml}
                      onChange={setBlogContentHtml}
                      placeholder="Write your blog post content here..."
                    />
                    <p className="text-[10px] text-corporate-400">Use the toolbar above to format your content (headings, bold, italic, lists, links, etc.)</p>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-corporate-50 rounded-lg border border-corporate-100">
                    <input
                      type="checkbox"
                      id="publish-toggle"
                      checked={blogFormData.is_published}
                      onChange={(e) => setBlogFormData({ ...blogFormData, is_published: e.target.checked })}
                      className="h-4 w-4 rounded border-corporate-300 text-corporate-900 focus:ring-corporate-900 cursor-pointer"
                    />
                    <label htmlFor="publish-toggle" className="text-sm font-medium text-corporate-900 cursor-pointer">
                      Publish immediately (visible on /blog)
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveBlogPost}
                    disabled={isSubmitting || uploadingCover}
                    className="w-full py-5 bg-corporate-900 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-corporate-800 disabled:opacity-50 flex items-center justify-center gap-3 transition-all"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                    {editingPostId ? 'Update Post' : 'Create Post'}
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-corporate-200 shadow-sm overflow-x-auto">
              {loadingBlog ? (
                <div className="flex flex-col items-center justify-center py-32 text-corporate-400">
                  <Loader2 className="animate-spin mb-6" size={48} />
                  <p className="font-serif italic text-lg">Loading blog posts...</p>
                </div>
              ) : blogPosts.length === 0 ? (
                <div className="py-40 text-center">
                  <BookOpen size={64} className="mx-auto text-corporate-100 mb-6" />
                  <p className="text-corporate-400 font-serif italic text-2xl mb-3">No blog posts yet</p>
                  <p className="text-xs text-corporate-300 font-bold uppercase tracking-widest">
                    Click "New Blog Post" above to create your first article.
                  </p>
                </div>
              ) : (
                <table className="w-full text-left min-w-[900px]">
                  <thead>
                    <tr className="bg-corporate-50 border-b border-corporate-200">
                      <th className="px-8 py-5 text-xs font-bold text-corporate-400 uppercase tracking-widest">Post</th>
                      <th className="px-8 py-5 text-xs font-bold text-corporate-400 uppercase tracking-widest">Slug</th>
                      <th className="px-8 py-5 text-xs font-bold text-corporate-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-5 text-xs font-bold text-corporate-400 uppercase tracking-widest">Updated</th>
                      <th className="px-8 py-5 text-xs font-bold text-corporate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-corporate-100">
                    {blogPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-corporate-50/50 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-corporate-100 rounded overflow-hidden flex-shrink-0">
                              {post.cover_image_url ? (
                                <img
                                  src={post.cover_image_url}
                                  className="w-full h-full object-cover"
                                  alt={post.title ? `Cover preview: ${post.title}` : 'Blog cover preview'}
                                />
                              ) : (
                                <ImageIcon className="m-auto mt-5 text-corporate-200" size={20} />
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-corporate-900">{post.title}</span>
                              <span className="text-xs text-corporate-400">{post.excerpt || 'No excerpt'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <code className="text-xs text-corporate-600 bg-corporate-50 px-2 py-1 rounded font-mono">
                            {post.slug}
                          </code>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm ${post.is_published ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                            {post.is_published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-[10px] text-corporate-400 font-bold uppercase tracking-widest">
                            <Clock size={12} />
                            {new Date(post.updated_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => setDeletingPostId(post.id)}
                              className="p-2 text-corporate-200 hover:text-red-600 transition-colors"
                              title="Delete Post"
                            >
                              <Trash2 size={20} />
                            </button>
                            <button
                              onClick={() => handleEditBlogPost(post)}
                              className="p-2 text-corporate-200 hover:text-corporate-900 transition-colors"
                              title="Edit Post"
                            >
                              <Edit3 size={20} />
                            </button>
                            <button
                              onClick={() => handleTogglePublish(post.id, post.is_published)}
                              className={`px-4 py-2 text-white text-[10px] font-bold uppercase tracking-widest rounded-md transition-colors ${post.is_published ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}`}
                            >
                              {post.is_published ? 'Unpublish' : 'Publish'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        ) : activeTab === 'analytics' ? (
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-corporate-100 pb-8">
              <div>
                <h2 className="text-3xl font-serif text-corporate-900">Portfolio Analytics</h2>
                <p className="text-xs font-bold text-corporate-400 uppercase tracking-widest mt-1">First-Party Business Intelligence</p>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-corporate-500 uppercase tracking-widest">Time Period:</label>
                <select 
                  value={analyticsTimePeriod} 
                  onChange={(e) => setAnalyticsTimePeriod(e.target.value as '7d' | '30d' | '90d' | 'all')}
                  className="px-4 py-2 border border-corporate-200 rounded-lg text-sm font-medium text-corporate-900 bg-white hover:border-corporate-400 focus:outline-none focus:ring-2 focus:ring-corporate-500 transition-all"
                >
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                  <option value="all">All Time</option>
                </select>
              </div>
            </div>

            {loadingAnalytics ? (
              <div className="flex flex-col items-center justify-center py-32 text-corporate-400">
                <Loader2 className="animate-spin mb-6" size={48} />
                <p className="font-serif italic text-lg text-center">Computing analytics...</p>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Financial KPIs */}
                <div>
                  <h3 className="text-xl font-serif text-corporate-900 mb-6">Financial Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {(() => {
                      const rentedUnits = units.filter(u => u.status?.toLowerCase() === 'rented');
                      const projectedRevenue = rentedUnits.reduce((sum, u) => {
                        const rent = Number(u.monthly_rent) || 0;
                        const length = Number(u.contract_length) || 0;
                        return sum + (rent * length);
                      }, 0);
                      
                      const totalLostRevenue = cancellationLedger.reduce((sum, entry) => sum + (Number(entry.lost_revenue_value) || 0), 0);
                      
                      const avgRentPerSqm = rentedUnits.length > 0
                        ? rentedUnits.reduce((sum, u) => {
                            const rent = Number(u.monthly_rent) || 0;
                            const area = Number(u.net_area) || 0;
                            return area > 0 ? sum + (rent / area) : sum;
                          }, 0) / rentedUnits.filter(u => (Number(u.net_area) || 0) > 0).length
                        : 0;
                      
                      const avgContractLength = rentedUnits.length > 0
                        ? rentedUnits.reduce((sum, u) => sum + (Number(u.contract_length) || 0), 0) / rentedUnits.length
                        : 0;

                      return (
                        <>
                          <div className="bg-white p-6 rounded-xl border border-corporate-200 shadow-sm">
                            <p className="text-[10px] font-bold text-corporate-400 uppercase tracking-widest mb-2">Projected Rent Revenue</p>
                            <p className="text-3xl font-bold text-corporate-900">₱{projectedRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            <p className="text-xs text-corporate-500 mt-1">{rentedUnits.length} active leases</p>
                          </div>
                          
                          <div className="bg-white p-6 rounded-xl border border-corporate-200 shadow-sm">
                            <p className="text-[10px] font-bold text-corporate-400 uppercase tracking-widest mb-2">Lost Revenue (Early Ended)</p>
                            <p className="text-3xl font-bold text-red-600">₱{totalLostRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            <p className="text-xs text-corporate-500 mt-1">{cancellationLedger.length} terminations</p>
                          </div>
                          
                          <div className="bg-white p-6 rounded-xl border border-corporate-200 shadow-sm">
                            <p className="text-[10px] font-bold text-corporate-400 uppercase tracking-widest mb-2">Avg Rental Rate / sqm</p>
                            <p className="text-3xl font-bold text-corporate-900">₱{avgRentPerSqm.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            <p className="text-xs text-corporate-500 mt-1">per square meter</p>
                          </div>
                          
                          <div className="bg-white p-6 rounded-xl border border-corporate-200 shadow-sm">
                            <p className="text-[10px] font-bold text-corporate-400 uppercase tracking-widest mb-2">Avg Contract Length</p>
                            <p className="text-3xl font-bold text-corporate-900">{avgContractLength.toFixed(1)}</p>
                            <p className="text-xs text-corporate-500 mt-1">months</p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Popularity Rankings */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Top by Inquiries */}
                  <div>
                    <h3 className="text-xl font-serif text-corporate-900 mb-6">Top Units by Inquiries</h3>
                    <div className="bg-white rounded-xl border border-corporate-200 shadow-sm overflow-hidden">
                      {(() => {
                        const inquiryCounts = engagementEvents
                          .filter(e => e.event_type === 'unit_inquiry')
                          .reduce((acc, e) => {
                            const key = `${e.unit_id}|${e.unit_number}|${e.building_name}`;
                            acc[key] = (acc[key] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>);
                        
                        const topByInquiry = Object.entries(inquiryCounts)
                          .map(([key, count]) => {
                            const [unit_id, unit_number, building_name] = key.split('|');
                            return { unit_id, unit_number, building_name, count };
                          })
                          .sort((a, b) => b.count - a.count)
                          .slice(0, 10);

                        return topByInquiry.length > 0 ? (
                          <table className="w-full">
                            <thead className="bg-corporate-50 border-b border-corporate-100">
                              <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-corporate-400 uppercase tracking-widest">Unit</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-corporate-400 uppercase tracking-widest">Building</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-corporate-400 uppercase tracking-widest">Inquiries</th>
                              </tr>
                            </thead>
                            <tbody>
                              {topByInquiry.map((item, idx) => (
                                <tr key={idx} className="border-b border-corporate-50">
                                  <td className="px-6 py-4 text-sm font-bold text-corporate-900">{item.unit_number}</td>
                                  <td className="px-6 py-4 text-sm text-corporate-600">{item.building_name}</td>
                                  <td className="px-6 py-4 text-right text-sm font-bold text-corporate-900">{item.count}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className="p-12 text-center text-corporate-400">
                            <p className="font-serif italic">No inquiry data yet</p>
                            <p className="text-xs mt-2">
                              {analyticsTimePeriod === 'all' 
                                ? 'Tracking starts from deployment date' 
                                : `No inquiries in the selected time period`}
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Top by Views */}
                  <div>
                    <h3 className="text-xl font-serif text-corporate-900 mb-6">Top Units by Views</h3>
                    <div className="bg-white rounded-xl border border-corporate-200 shadow-sm overflow-hidden">
                      {(() => {
                        const viewCounts = engagementEvents
                          .filter(e => e.event_type === 'unit_view')
                          .reduce((acc, e) => {
                            const key = `${e.unit_id}|${e.unit_number}|${e.building_name}`;
                            acc[key] = (acc[key] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>);
                        
                        const topByView = Object.entries(viewCounts)
                          .map(([key, count]) => {
                            const [unit_id, unit_number, building_name] = key.split('|');
                            return { unit_id, unit_number, building_name, count };
                          })
                          .sort((a, b) => b.count - a.count)
                          .slice(0, 10);

                        return topByView.length > 0 ? (
                          <table className="w-full">
                            <thead className="bg-corporate-50 border-b border-corporate-100">
                              <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-corporate-400 uppercase tracking-widest">Unit</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-corporate-400 uppercase tracking-widest">Building</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-corporate-400 uppercase tracking-widest">Views</th>
                              </tr>
                            </thead>
                            <tbody>
                              {topByView.map((item, idx) => (
                                <tr key={idx} className="border-b border-corporate-50">
                                  <td className="px-6 py-4 text-sm font-bold text-corporate-900">{item.unit_number}</td>
                                  <td className="px-6 py-4 text-sm text-corporate-600">{item.building_name}</td>
                                  <td className="px-6 py-4 text-right text-sm font-bold text-corporate-900">{item.count}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className="p-12 text-center text-corporate-400">
                            <p className="font-serif italic">No view data yet</p>
                            <p className="text-xs mt-2">
                              {analyticsTimePeriod === 'all' 
                                ? 'Tracking starts from deployment date' 
                                : `No views in the selected time period`}
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </main>

      {/* Mark Rented / Edit Lease Modal */}
      {rentConfirmationUnit && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-corporate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white max-w-lg w-full p-10 rounded-xl shadow-2xl border border-corporate-200">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full">
                {isEditingLease ? <Edit3 size={28} /> : <DollarSign size={28} />}
              </div>
              <div>
                <h3 className="text-2xl font-serif text-corporate-900 leading-tight">{isEditingLease ? 'Edit Lease Terms' : 'Lease Registration'}</h3>
                <p className="text-xs font-bold text-corporate-400 uppercase tracking-widest mt-1">Registering Unit {rentConfirmationUnit.unit_number}</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Negotiated Monthly Rent (PHP)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-corporate-400 font-bold">₱</span>
                  <input 
                    type="number" 
                    value={rentPrice} 
                    onChange={e => setRentPrice(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-5 py-4 bg-corporate-50 border border-corporate-200 rounded-lg outline-none focus:border-corporate-900 font-bold text-lg" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Contract Duration (Months)</label>
                <select 
                  value={contractLength} 
                  onChange={e => setContractLength(parseInt(e.target.value))}
                  className="w-full px-5 py-4 bg-corporate-50 border border-corporate-200 rounded-lg outline-none focus:border-corporate-900 font-bold text-corporate-900"
                >
                  {[0, 6, 12, 18, 24, 36, 48, 60].map(m => (
                    <option key={m} value={m}>{m === 0 ? '0 Months (Hide Unit)' : `${m} Months ${m === 12 ? '(Standard)' : ''}`}</option>
                  ))}
                </select>
              </div>

              <div className="p-6 bg-corporate-900 rounded-xl text-white">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Estimated Contract Value</p>
                <p className="text-3xl font-sans font-bold">₱{(rentPrice * contractLength).toLocaleString()}</p>
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-60">
                  <span>Duration: {contractLength}m</span>
                  <span>Rate: ₱{rentPrice.toLocaleString()}/mo</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button onClick={() => setRentConfirmationUnit(null)} className="flex-1 py-4 border border-corporate-200 text-corporate-500 font-bold uppercase tracking-widest text-xs rounded hover:bg-corporate-50 transition-all">Cancel</button>
              <button 
                onClick={handleFinalizeRent} 
                disabled={isSubmitting}
                className="flex-1 py-4 bg-corporate-900 text-white font-bold uppercase tracking-widest text-xs rounded hover:bg-corporate-800 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {isEditingLease ? 'Update Lease' : 'Finalize Lease'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prorated Lease Cancellation Modal */}
      {cancelConfirmationUnit && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-corporate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white max-w-md w-full p-10 rounded-xl shadow-2xl border border-corporate-200">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-red-50 text-red-600 rounded-full">
                <Ban size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-serif text-corporate-900 leading-tight">Prorated Cancellation</h3>
                <p className="text-xs font-bold text-corporate-400 uppercase tracking-widest mt-1">Unit {cancelConfirmationUnit.unit_number}</p>
              </div>
            </div>
            
            <div className="space-y-6 mb-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">How many months were actually completed?</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="number" 
                    min="0"
                    max={cancelConfirmationUnit.contract_length || 0}
                    value={monthsCompleted} 
                    onChange={e => setMonthsCompleted(e.target.value === '' ? 0 : Number(e.target.value))}
                    className="w-full px-5 py-4 bg-corporate-50 border border-corporate-200 rounded-lg outline-none focus:border-corporate-900 font-bold text-lg" 
                  />
                  <span className="text-sm text-corporate-400 whitespace-nowrap font-medium">/ {cancelConfirmationUnit.contract_length || 0} mo</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-[9px] font-bold text-green-600 uppercase tracking-widest mb-1">Earned Revenue</p>
                  <p className="text-base font-bold text-green-700">₱{((cancelConfirmationUnit.monthly_rent || 0) * monthsCompleted).toLocaleString()}</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                  <p className="text-[9px] font-bold text-red-600 uppercase tracking-widest mb-1">Lost Pipeline</p>
                  <p className="text-base font-bold text-red-700">₱{((cancelConfirmationUnit.monthly_rent || 0) * ((cancelConfirmationUnit.contract_length || 0) - monthsCompleted)).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setCancelConfirmationUnit(null)} className="flex-1 py-4 border border-corporate-200 text-corporate-500 font-bold uppercase tracking-widest text-xs rounded hover:bg-corporate-50 transition-all">Go Back</button>
              <button 
                onClick={handleConfirmCancellation} 
                className="flex-1 py-4 bg-red-600 text-white font-bold uppercase tracking-widest text-xs rounded hover:bg-red-700 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {updatingId === cancelConfirmationUnit.id && <Loader2 size={16} className="animate-spin" />}
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmationId && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-corporate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white max-w-md w-full p-10 rounded-xl shadow-2xl border border-corporate-200"><div className="flex items-center gap-4 mb-8"><div className="p-4 bg-red-50 text-red-600 rounded-full"><AlertTriangle size={28} /></div><h3 className="text-2xl font-serif text-corporate-900 leading-tight">Permanent Database Wipe</h3></div><p className="text-corporate-600 mb-10 leading-relaxed text-lg">Confirm deletion of <span className="font-bold text-corporate-900">Unit {units.find(u => u.id === deleteConfirmationId)?.unit_number}</span>? This action is irreversible.</p><div className="flex gap-4"><button onClick={() => setDeleteConfirmationId(null)} className="flex-1 py-4 border border-corporate-200 text-corporate-900 font-bold uppercase tracking-widest text-xs rounded hover:bg-corporate-50 transition-all">Cancel</button><button onClick={() => executeDelete(deleteConfirmationId)} className="flex-1 py-4 bg-red-600 text-white font-bold uppercase tracking-widest text-xs rounded hover:bg-red-700 transition-all shadow-lg">Permanently Delete</button></div></div>
        </div>
      )}

      {deletingPostId && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-corporate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white max-w-md w-full p-10 rounded-xl shadow-2xl border border-corporate-200">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-red-50 text-red-600 rounded-full">
                <AlertTriangle size={28} />
              </div>
              <h3 className="text-2xl font-serif text-corporate-900 leading-tight">Delete Blog Post</h3>
            </div>
            <p className="text-corporate-600 mb-10 leading-relaxed text-lg">
              Confirm deletion of <span className="font-bold text-corporate-900">{blogPosts.find(p => p.id === deletingPostId)?.title}</span>? This action is irreversible.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeletingPostId(null)}
                className="flex-1 py-4 border border-corporate-200 text-corporate-900 font-bold uppercase tracking-widest text-xs rounded hover:bg-corporate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteBlogPost(deletingPostId)}
                className="flex-1 py-4 bg-red-600 text-white font-bold uppercase tracking-widest text-xs rounded hover:bg-red-700 transition-all shadow-lg"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};