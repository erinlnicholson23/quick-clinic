import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// 🔑 REPLACE THIS LINE WITH YOUR REAL COPIED ANON KEY FROM SUPABASE
const SUPABASE_URL = "https://whoxcaqhgctgwutlbfeh.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_yCkB2G6aszoFwhml8iFXlg_MyBM7c_U";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const INITIAL_CLINIC_DATA = [
  {
    id: "item_01", type: "procedure_fee", keyword_tags: ["gastroscopy", "scope", "jason", "winnett"],
    title: "Gastroscopy (Diagnostic)", mbs_item_number: "30473", clinic_fee: 650, medicare_rebate: 194.25, approx_private_health_gap: 250,
    notes: "Ensure patient has been fasting for 6 hours. Inform them of separate theater fees."
  },
  {
    id: "item_02", type: "procedure_fee", keyword_tags: ["colonoscopy", "scope", "jason", "winnett"],
    title: "Colonoscopy (Fibreoptic)", mbs_item_number: "32222", clinic_fee: 850, medicare_rebate: 345.10, approx_private_health_gap: 300,
    notes: "Requires Plenvu bowel prep kit instructions to be handed to patient at the desk."
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState("internal");
  const [clinicData, setClinicData] = useState(INITIAL_CLINIC_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [apiResults, setApiResults] = useState([]);
  const [apiLoading, setApiLoading] = useState(false);

  const [formType, setFormType] = useState("procedure_fee");
  const [title, setTitle] = useState("");
  const [mbsNumber, setMbsNumber] = useState("");
  const [fee, setFee] = useState("");
  const [rebate, setRebate] = useState("");
  const [gap, setGap] = useState("");
  const [address, setAddress] = useState("");
  const [fax, setFax] = useState("");
  const [forms, setForms] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (activeTab !== "mbs_api" || searchQuery.trim() === "") { setApiResults([]); return; }
    setApiLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        let { data, error } = await supabase.from('mbs_procedures').select('*')
          .or(`description.ilike.%${searchQuery}%,mbs_item.like.%${searchQuery}%`).limit(20);
        if (error) throw error;
        setApiResults(data || []);
      } catch (err) { console.error("Database block:", err.message);
      } finally { setApiLoading(false); }
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, activeTab]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = { id: `custom_${Date.now()}`, type: formType, title, notes, keyword_tags: tags.split(',').map(t => t.trim().toLowerCase()) };
    if (formType === "procedure_fee") {
      newItem.mbs_item_number = mbsNumber; newItem.clinic_fee = parseFloat(fee) || 0;
      newItem.medicare_rebate = parseFloat(rebate) || 0; newItem.approx_private_health_gap = parseFloat(gap) || 0;
    } else { newItem.address = address; newItem.fax_number = fax; newItem.required_forms = forms.split(',').map(f => f.trim()).filter(f => f !== ""); }
    setClinicData([newItem, ...clinicData]);
    setTitle(""); setMbsNumber(""); setFee(""); setRebate(""); setGap(""); setAddress(""); setFax(""); setForms(""); setNotes(""); setTags(""); setShowForm(false);
  };

  const filteredInternalData = clinicData.filter(item => {
    const q = searchQuery.toLowerCase();
    return item.title.toLowerCase().includes(q) || item.keyword_tags.some(t => t.toLowerCase().includes(q));
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '24px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: 0 }}>⚡ QuickClinic</h1>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Full-Stack Cloud Reference Utility</p>
          </div>
          {activeTab === "internal" && (
            <button onClick={() => setShowForm(!showForm)} style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              {showForm ? '✖ Close Form' : '➕ Add Record'}
            </button>
          )}
        </header>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
          <button onClick={() => { setActiveTab("internal"); setSearchQuery(""); }} style={{ padding: '10px 18px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === "internal" ? '#1e3a8a' : '#ffffff', color: activeTab === "internal" ? '#ffffff' : '#374151' }}>📋 Practice Custom Notes</button>
          <button onClick={() => { setActiveTab("mbs_api"); setSearchQuery(""); }} style={{ padding: '10px 18px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === "mbs_api" ? '#059669' : '#ffffff', color: activeTab === "mbs_api" ? '#ffffff' : '#374151' }}>🌐 Live Cloud MBS Registry</button>
        </div>

        {showForm && activeTab === "internal" && (
          <form onSubmit={handleSubmit} style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
            <div style={{ marginBottom: '12px' }}><label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Category</label>
              <select value={formType} onChange={(e) => setFormType(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px' }}><option value="procedure_fee">💰 Procedure Fee</option><option value="place_and_form">📍 Hospital Location</option></select>
            </div>
            <div style={{ marginBottom: '12px' }}><label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Title</label><input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} /></div>
            {formType === "procedure_fee" ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div><label style={{ fontSize: '12px' }}>MBS #</label><input type="text" value={mbsNumber} onChange={(e) => setMbsNumber(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} /></div>
                <div><label style={{ fontSize: '12px' }}>Fee ($)</label><input type="number" step="0.01" value={fee} onChange={(e) => setFee(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} /></div>
                <div><label style={{ fontSize: '12px' }}>Rebate ($)</label><input type="number" step="0.01" value={rebate} onChange={(e) => setRebate(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} /></div>
                <div><label style={{ fontSize: '12px' }}>Gap ($)</label><input type="number" step="0.01" value={gap} onChange={(e) => setGap(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} /></div>
              </div>
            ) : (
              <div style={{ marginBottom: '12px' }}>
                <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '8px', boxSizing: 'border-box' }} />
                <input type="text" placeholder="Fax" value={fax} onChange={(e) => setFax(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '8px', boxSizing: 'border-box' }} />
                <input type="text" placeholder="Forms" value={forms} onChange={(e) => setForms(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
              </div>
            )}
            <input type="text" placeholder="Tags" value={tags} onChange={(e) => setTags(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '12px', boxSizing: 'border-box' }} />
            <textarea placeholder="Desk Notes" value={notes} onChange={(e) => setNotes(e.target.value)} style={{ width: '100%', padding: '8px', height: '60px', boxSizing: 'border-box' }}></textarea>
            <button type="submit" style={{ width: '100%', backgroundColor: '#059669', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', marginTop: '12px' }}>💾 Save to Dashboard</button>
          </form>
        )}
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <input type="text" style={{ width: '100%', padding: '16px', paddingLeft: '44px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '18px', boxSizing: 'border-box' }} placeholder={activeTab === "internal" ? "Search practice notes..." : "Query 6,000+ live procedures (e.g. skin, knee, cardiac)..."} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <span style={{ position: 'absolute', left: '16px', top: '18px' }}>🔍</span>
        </div>

        {activeTab === "internal" ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredInternalData.map((item) => (
              <div key={item.id} style={{ backgroundColor: '#ffffff', border: '1px solid #f3f4f6', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', backgroundColor: item.type === 'procedure_fee' ? '#eff6ff' : '#ecfdf5', color: item.type === 'procedure_fee' ? '#1d4ed8' : '#047857' }}>{item.type === 'procedure_fee' ? '💰 Fee' : '📍 Location'}</span>
                <h3 style={{ margin: '8px 0', fontSize: '20px' }}>{item.title}</h3>
                {item.type === 'procedure_fee' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', textAlign: 'center' }}>
                    <div><span style={{ fontSize: '12px', color: '#9ca3af' }}>Fee</span><div>${item.clinic_fee.toFixed(2)}</div></div>
                    <div><span style={{ fontSize: '12px', color: '#9ca3af' }}>Rebate</span><div style={{ color: '#059669' }}>${item.medicare_rebate.toFixed(2)}</div></div>
                    <div><span style={{ fontSize: '12px', color: '#2563eb' }}>Gap</span><div style={{ color: '#1d4ed8', fontWeight: 'bold' }}>${item.approx_private_health_gap.toFixed(2)}</div></div>
                  </div>
                ) : (
                  <div style={{ fontSize: '14px', color: '#4b5563' }}><p>🏥 Address: {item.address}</p><p>📠 Fax: {item.fax_number}</p></div>
                )}
                <div style={{ backgroundColor: '#fefce8', padding: '12px', borderRadius: '8px', marginTop: '12px', fontSize: '14px' }}><strong>Protocol:</strong> {item.notes}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {apiLoading && <p style={{ textAlign: 'center', color: '#6b7280' }}>⚡ Streaming from your live Supabase cloud database...</p>}
            {apiResults.map((item) => (
              <div key={item.id} style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong style={{ color: '#059669' }}>🟢 Cloud Registry Match</strong>
                  <strong style={{ fontFamily: 'monospace' }}>MBS Item #{item.mbs_item}</strong>
                </div>
                <p style={{ fontSize: '14px', margin: '8px 0', color: '#374151', lineHeight: '1.5' }}>{item.description}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px', fontSize: '13px', marginTop: '12px' }}>
                  <div><strong>Gov Schedule Fee:</strong> ${parseFloat(item.schedule_fee || 0).toFixed(2)}</div>
                  <div><strong>85% Base Rebate:</strong> ${parseFloat(item.benefit_85 || 0).toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

