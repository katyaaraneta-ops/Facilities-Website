import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Layout, Building2, CheckCircle2, XCircle, LogOut, Loader2 } from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    const { data } = await supabase.from('units').select('*').order('unit_number');
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

  if (loading) return <div className="h-screen flex items-center justify-center font-serif italic text-corporate-500">Loading Management Console...</div>;

  return (
    <div className="min-h-screen bg-corporate-50 pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-12 border-b border-corporate-200 pb-8">
          <div>
            <h1 className="text-4xl font-serif text-corporate-900 mb-2">Management Console</h1>
            <p className="text-corporate-500 font-medium uppercase tracking-widest text-xs">Facilities, Incorporated Inventory Control</p>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 text-corporate-400 hover:text-red-600 transition-colors text-sm font-bold uppercase tracking-widest">
            <LogOut size={18} /> Sign Out
          </button>
        </div>

        <div className="bg-white rounded-xl border border-corporate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-corporate-50 border-b border-corporate-200">
                <th className="px-8 py-5 text-xs font-bold text-corporate-400 uppercase tracking-widest">Unit</th>
                <th className="px-8 py-5 text-xs font-bold text-corporate-400 uppercase tracking-widest">Building</th>
                <th className="px-8 py-5 text-xs font-bold text-corporate-400 uppercase tracking-widest">Current Status</th>
                <th className="px-8 py-5 text-xs font-bold text-corporate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-corporate-100">
              {units.map((unit) => (
                <tr key={unit.id} className="hover:bg-corporate-50/50 transition-colors">
                  <td className="px-8 py-6 font-bold text-corporate-900">{unit.unit_number}</td>
                  <td className="px-8 py-6 text-corporate-600 text-sm">{unit.building_name}</td>
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
                    <button 
                      onClick={() => toggleStatus(unit.id, unit.status)}
                      disabled={updatingId === unit.id}
                      className="px-6 py-2 bg-corporate-900 text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-corporate-800 disabled:opacity-50 transition-all"
                    >
                      {updatingId === unit.id ? <Loader2 className="animate-spin" size={16}/> : 'Toggle Status'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};