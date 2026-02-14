import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import { Layout, Building2, CheckCircle2, XCircle, LogOut, Loader2, Plus, X, Type, AlignLeft, Edit3, Trash2, AlertTriangle, Upload, Image as ImageIcon, Trash } from 'lucide-react';

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

/**
 * Helper to compress images before upload.
 * Resizes to max 1200px width and sets quality to 0.8.
 */
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
        
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Canvas to Blob conversion failed'));
          },
          'image/jpeg',
          0.8
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // State for Form Management
  const [isAdding, setIsAdding] = useState(false);
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUnit, setNewUnit] = useState(INITIAL_FORM_STATE);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for Custom Confirmation Modal
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    const { data } = await supabase
      .from('units')
      .select('*')
      .order('unit_number', { ascending: true });
    
    setUnits(data || []);
    setLoading(false);
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    setUpdatingId(id);
    const newStatus = currentStatus.toLowerCase().includes('available') ? 'Rented' : 'Available';
    
    const { error } = await supabase
      .from('units')
      .update({ status: newStatus })
      .eq('id', id);

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
      const { error } = await supabase
        .from('units')
        .delete()
        .match({ id: id });

      if (error) {
        alert('Error: ' + error.message);
      } else {
        alert('Deleted!');
        await fetchUnits();
      }
    } catch (error: any) {
      console.error('Catch block error:', error);
      alert('System Error: ' + error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Multi-photo support: limit 3
    if (newUnit.image_urls.length + files.length > 3) {
      alert('Mercy, you can only store up to 3 photos per unit. Please remove existing ones first.');
      return;
    }

    setUploading(true);
    const newUrls = [...newUnit.image_urls];

    for (let i = 0; i < files.length; i++) {
      try {
        const file = files[i];
        
        // On-the-fly compression
        const compressedBlob = await compressImage(file);
        
        // Institutional Naming Convention
        const unitNum = newUnit.unit_number || 'TBD';
        const timestamp = Date.now();
        const fileName = `unit-${unitNum}-${timestamp}.jpg`;
        const filePath = `unit-uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('unit-images')
          .upload(filePath, compressedBlob, {
            contentType: 'image/jpeg',
            upsert: true
          });

        if (uploadError) {
          alert('Upload failed: ' + uploadError.message);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('unit-images')
          .getPublicUrl(filePath);

        newUrls.push(publicUrl);
      } catch (err) {
        console.error('Asset processing error:', err);
        alert('Could not process one of the images.');
      }
    }

    setNewUnit({ ...newUnit, image_urls: newUrls });
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (urlToRemove: string) => {
    setNewUnit({
      ...newUnit,
      image_urls: newUnit.image_urls.filter(url => url !== urlToRemove)
    });
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
      availability_date: new Date().toISOString().split('T')[0],
      listing_type: 'Office',
      headline: newUnit.headline,
      narrative: newUnit.narrative,
      image_urls: newUnit.image_urls
    };

    if (editingUnitId) {
      const { error } = await supabase
        .from('units')
        .update(unitData)
        .eq('id', editingUnitId);

      if (!error) {
        alert('Unit Updated Successfully!');
        await fetchUnits();
        resetForm();
      } else {
        alert('Database Error (Update): ' + error.message);
      }
    } else {
      const { error } = await supabase
        .from('units')
        .insert([unitData]);

      if (!error) {
        alert('Unit Added Successfully!');
        await fetchUnits();
        resetForm();
      } else {
        alert('Database Error (Insert): ' + error.message);
      }
    }
    setIsSubmitting(false);
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-serif italic text-corporate-500">Loading Management Console...</div>;

  return (
    <div className="min-h-screen bg-corporate-50 pt-32 pb-24 px-6 relative">
      {/* Custom Confirmation Modal */}
      {deleteConfirmationId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-corporate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white max-w-md w-full p-8 rounded-xl shadow-2xl border border-corporate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-50 text-red-600 rounded-full">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-serif text-corporate-900">Permanent Deletion</h3>
            </div>
            <p className="text-corporate-600 mb-8 leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-corporate-900">Unit {units.find(u => u.id === deleteConfirmationId)?.unit_number}</span>? This action will remove the record from the database and cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => setDeleteConfirmationId(null)}
                className="flex-1 px-6 py-3 border border-corporate-200 text-corporate-600 font-bold uppercase tracking-widest text-xs rounded hover:bg-corporate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => executeDelete(deleteConfirmationId)}
                className="flex-1 px-6 py-3 bg-red-600 text-white font-bold uppercase tracking-widest text-xs rounded hover:bg-red-700 transition-colors shadow-lg shadow-red-100"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-12 border-b border-corporate-200 pb-8">
          <div>
            <h1 className="text-4xl font-serif text-corporate-900 mb-2">Management Console</h1>
            <p className="text-corporate-500 font-medium uppercase tracking-widest text-xs">Facilities, Incorporated Inventory Control</p>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => isAdding ? resetForm() : setIsAdding(true)}
              className="flex items-center gap-2 px-6 py-3 bg-corporate-900 text-white text-xs font-bold uppercase tracking-widest rounded shadow-sm hover:bg-corporate-800 transition-all"
            >
              {isAdding ? <X size={16} /> : <Plus size={16} />}
              {isAdding ? 'Cancel' : 'Add New Unit'}
            </button>
            <button onClick={onLogout} className="flex items-center gap-2 text-corporate-400 hover:text-red-600 transition-colors text-sm font-bold uppercase tracking-widest">
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>

        {/* Form Section (Add or Edit) */}
        {isAdding && (
          <div className="mb-12 bg-white p-8 rounded-xl border border-corporate-200 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <h2 className="text-xl font-serif text-corporate-900 mb-6">
              {editingUnitId ? 'Edit Inventory' : 'Register New Inventory'}
            </h2>

            {/* Upload Area */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-3">
                <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest block">Asset Gallery (Max 3 Images)</label>
                <span className="text-xs font-bold text-corporate-300">{newUnit.image_urls.length} / 3</span>
              </div>
              <div 
                onClick={() => !uploading && newUnit.image_urls.length < 3 && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all group ${
                  newUnit.image_urls.length >= 3 
                    ? 'border-corporate-100 bg-corporate-50 cursor-not-allowed opacity-60' 
                    : 'border-corporate-200 cursor-pointer hover:border-corporate-900 hover:bg-corporate-50'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  multiple 
                  onChange={handleFileUpload}
                  disabled={uploading || newUnit.image_urls.length >= 3}
                />
                <div className="flex flex-col items-center gap-2">
                  {uploading ? (
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="animate-spin text-corporate-900" size={32} />
                      <p className="text-sm text-corporate-900 font-bold animate-pulse">Compressing & Uploading...</p>
                    </div>
                  ) : (
                    <>
                      <Upload className={`${newUnit.image_urls.length >= 3 ? 'text-corporate-100' : 'text-corporate-300 group-hover:text-corporate-900'} transition-colors`} size={32} />
                      <p className="text-sm text-corporate-600 font-medium">
                        {newUnit.image_urls.length >= 3 ? 'Capacity Reached' : 'Click or drag images to upload'}
                      </p>
                      <p className="text-xs text-corporate-400">Auto-compressed to 1200px width</p>
                    </>
                  )}
                </div>
              </div>

              {/* Horizontal Preview Thumbnails */}
              {newUnit.image_urls.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-6">
                  {newUnit.image_urls.map((url, idx) => (
                    <div key={idx} className="relative w-24 h-24 md:w-32 md:h-32 group rounded-lg overflow-hidden border border-corporate-100 bg-corporate-50 shadow-sm">
                      <img src={url} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeImage(url)}
                        className="absolute top-1.5 right-1.5 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      >
                        <Trash size={12} />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-corporate-900/60 text-[10px] text-white py-0.5 text-center font-bold uppercase">
                        Slot {idx + 1}
                      </div>
                    </div>
                  ))}
                  {Array.from({ length: 3 - newUnit.image_urls.length }).map((_, i) => (
                    <div key={`empty-${i}`} className="w-24 h-24 md:w-32 md:h-32 rounded-lg border border-dashed border-corporate-100 flex items-center justify-center text-corporate-200">
                      <ImageIcon size={20} className="opacity-40" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleCreateOrUpdateUnit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Unit Number</label>
                <input 
                  type="text" 
                  value={newUnit.unit_number}
                  onChange={(e) => setNewUnit({...newUnit, unit_number: e.target.value})}
                  className="w-full px-4 py-3 bg-corporate-50 border border-corporate-200 rounded outline-none focus:ring-1 focus:ring-corporate-900"
                  placeholder="e.g. 705"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Building</label>
                <select 
                  value={newUnit.building_name}
                  onChange={(e) => setNewUnit({...newUnit, building_name: e.target.value})}
                  className="w-full px-4 py-3 bg-corporate-50 border border-corporate-200 rounded outline-none focus:ring-1 focus:ring-corporate-900"
                >
                  <option value="Summit One Tower">Summit One Tower</option>
                  <option value="Facilities Centre">Facilities Centre</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Status</label>
                <select 
                  value={newUnit.status}
                  onChange={(e) => setNewUnit({...newUnit, status: e.target.value})}
                  className="w-full px-4 py-3 bg-corporate-50 border border-corporate-200 rounded outline-none focus:ring-1 focus:ring-corporate-900"
                >
                  <option value="Available">Available</option>
                  <option value="Rented">Rented</option>
                  <option value="Reserved">Reserved</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Monthly Rent (PHP)</label>
                <input 
                  type="number" 
                  value={newUnit.monthly_rent}
                  onChange={(e) => setNewUnit({...newUnit, monthly_rent: e.target.value})}
                  className="w-full px-4 py-3 bg-corporate-50 border border-corporate-200 rounded outline-none focus:ring-1 focus:ring-corporate-900"
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Assoc. Dues (PHP)</label>
                <input 
                  type="number" 
                  value={newUnit.assoc_dues}
                  onChange={(e) => setNewUnit({...newUnit, assoc_dues: e.target.value})}
                  className="w-full px-4 py-3 bg-corporate-50 border border-corporate-200 rounded outline-none focus:ring-1 focus:ring-corporate-900"
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Net Area (sqm)</label>
                <input 
                  type="number" 
                  value={newUnit.net_area}
                  onChange={(e) => setNewUnit({...newUnit, net_area: e.target.value})}
                  className="w-full px-4 py-3 bg-corporate-50 border border-corporate-200 rounded outline-none focus:ring-1 focus:ring-corporate-900"
                  placeholder="0"
                  required
                />
              </div>

              <div className="md:col-span-3 space-y-2">
                <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Marketing Headline</label>
                <input 
                  type="text" 
                  value={newUnit.headline}
                  onChange={(e) => setNewUnit({...newUnit, headline: e.target.value})}
                  className="w-full px-4 py-3 bg-corporate-50 border border-corporate-200 rounded outline-none focus:ring-1 focus:ring-corporate-900"
                  placeholder="e.g. Flagship Corporate Suite with Panorama Views"
                />
              </div>

              <div className="md:col-span-3 space-y-2">
                <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Narrative (About this Unit)</label>
                <textarea 
                  value={newUnit.narrative}
                  onChange={(e) => setNewUnit({...newUnit, narrative: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 bg-corporate-50 border border-corporate-200 rounded outline-none focus:ring-1 focus:ring-corporate-900 resize-none"
                  placeholder="Describe the unit's unique features, orientation, and potential uses..."
                />
              </div>

              <div className="md:col-span-3 pt-4">
                <button 
                  type="submit"
                  disabled={isSubmitting || uploading}
                  className="w-full md:w-auto px-12 py-4 bg-corporate-900 text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-corporate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                  {editingUnitId ? 'Save Changes' : 'Complete Registration'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl border border-corporate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-corporate-50 border-b border-corporate-200">
                <th className="px-8 py-5 text-xs font-bold text-corporate-400 uppercase tracking-widest">Unit</th>
                <th className="px-8 py-5 text-xs font-bold text-corporate-400 uppercase tracking-widest">Building</th>
                <th className="px-8 py-5 text-xs font-bold text-corporate-400 uppercase tracking-widest">Marketing Headline</th>
                <th className="px-8 py-5 text-xs font-bold text-corporate-400 uppercase tracking-widest text-right">Area & Rent</th>
                <th className="px-8 py-5 text-xs font-bold text-corporate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-corporate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-corporate-100">
              {units.map((unit) => (
                <tr key={unit.id} className="hover:bg-corporate-50/50 transition-colors">
                  <td className="px-8 py-6 font-bold text-corporate-900">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-corporate-100 overflow-hidden flex-shrink-0">
                        {unit.image_urls?.[0] ? (
                          <img src={unit.image_urls[0]} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-corporate-300">
                            <ImageIcon size={16} />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span>{unit.unit_number}</span>
                        <span className="text-[10px] font-bold text-corporate-400 uppercase tracking-tighter">
                          {unit.image_urls?.length || 0} / 3 Photos
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-corporate-600 text-sm whitespace-nowrap">{unit.building_name}</td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-medium text-corporate-900 max-w-xs truncate" title={unit.headline}>
                      {unit.headline || <span className="text-corporate-300 italic">No headline set</span>}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="text-sm font-bold text-corporate-900">{unit.net_area} sqm</div>
                    <div className="text-xs text-corporate-400">₱{unit.monthly_rent?.toLocaleString()} / mo</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tighter ${
                      unit.status.toLowerCase().includes('available') 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-red-50 text-red-700'
                    }`}>
                      {unit.status.toLowerCase().includes('available') ? <CheckCircle2 size={14}/> : <XCircle size={14}/>}
                      {unit.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-1 md:gap-3">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirmationId(unit.id); }}
                        disabled={updatingId === unit.id}
                        className="p-2 text-corporate-300 hover:text-red-600 transition-colors disabled:opacity-30"
                        title="Delete unit permanently"
                      >
                        {updatingId === unit.id ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                      </button>
                      <button 
                        onClick={() => handleModify(unit)}
                        className="p-2 text-corporate-400 hover:text-corporate-900 transition-colors"
                        title="Edit marketing details"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => toggleStatus(unit.id, unit.status)}
                        disabled={updatingId === unit.id}
                        className="ml-2 px-4 py-2 bg-corporate-900 text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-corporate-800 disabled:opacity-50 transition-all whitespace-nowrap"
                      >
                        {updatingId === unit.id ? <Loader2 className="animate-spin" size={16}/> : 'Toggle'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {units.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-corporate-400 italic">
                    No units found in the inventory database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};