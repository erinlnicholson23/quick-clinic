import React, { useState, useEffect } from 'react';

const INITIAL_CLINIC_DATA = [
  {
    id: "item_01",
    type: "procedure_fee",
    keyword_tags: ["gastroscopy", "endoscopy", "scope", "stomach", "jason", "winnett"],
    title: "Gastroscopy (Diagnostic)",
    mbs_item_number: "30473",
    clinic_fee: 650.00,
    medicare_rebate: 194.25,
    approx_private_health_gap: 250.00,
    notes: "Ensure patient has been fasting for 6 hours. Inform them of separate private hospital bed/theater fees."
  },
  {
    id: "item_02",
    type: "procedure_fee",
    keyword_tags: ["colonoscopy", "bowel", "scope", "jason", "winnett"],
    title: "Colonoscopy (Fibreoptic)",
    mbs_item_number: "32222",
    clinic_fee: 850.00,
    medicare_rebate: 345.10,
    approx_private_health_gap: 300.00,
    notes: "Requires Plenvu bowel prep kit instructions to be printed and handed to patient at the desk."
  },
  {
    id: "item_03",
    type: "place_and_form",
    keyword_tags: ["epworth", "richmond", "hospital", "admission", "surgery"],
    title: "Epworth Hospital Richmond (Admissions)",
    address: "89 Bridge Rd, Richmond VIC 3121",
    required_forms: ["Epworth Digital Admission Form v4", "Surgical Consent Sheet"],
    fax_number: "(03) 9426 6666",
    notes: "Operating theater list is usually Tuesday mornings here. Patient paperwork must be submitted 48h prior."
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState("internal"); // "internal" or "mbs_api"
  const [clinicData, setClinicData] = useState(INITIAL_CLINIC_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Live API Simulation States
  const [apiResults, setApiResults] = useState([]);
  const [apiLoading, setApiLoading] = useState(false);

  // Form State Fields
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

  // Asynchronous API call logic for the MBS Registry tab
  useEffect(() => {
    if (activeTab !== "mbs_api" || searchQuery.trim() === "") {
      setApiResults([]);
      return;
    }

    setApiLoading(true);
    const delayDebounceFn = setTimeout(() => {
      // Mock dataset mirroring real Australian Healthcare API return object shapes
      const mockApiResponse = [
        {
          mbs_item: "30473",
          category: "Therapeutic Procedures",
          description: "Gastroscopy, insertion of a flexible fiberoptic endoscope into the stomach for diagnostic inspection.",
          schedule_fee: 194.25,
          benefit_75: 145.70,
          benefit_85: 165.15
        },
        {
          mbs_item: "32222",
          category: "Therapeutic Procedures",
          description: "Colonoscopy, fiberoptic, to examine the large bowel to the caecum, for diagnostic investigation.",
          schedule_fee: 345.10,
          benefit_75: 258.85,
          benefit_85: 293.35
        },
        {
          mbs_item: "31575",
          category: "General Surgical Procedures",
          description: "Laparoscopic sleeve gastrectomy, for treatment of clinically severe obesity.",
          schedule_fee: 865.30,
          benefit_75: 649.00,
          benefit_85: 781.10
        }
      ].filter(item => 
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.mbs_item.includes(searchQuery)
      );

      setApiResults(mockApiResponse);
      setApiLoading(false);
    }, 400); // 400ms debounce loop to protect data streams

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, activeTab]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: `custom_${Date.now()}`,
      type: formType,
      title: title,
      notes: notes,
      keyword_tags: tags.split(',').map(tag => tag.trim().toLowerCase())
    };

    if (formType === "procedure_fee") {
      newItem.mbs_item_number = mbsNumber;
      newItem.clinic_fee = parseFloat(fee) || 0;
      newItem.medicare_rebate = parseFloat(rebate) || 0;
      newItem.approx_private_health_gap = parseFloat(gap) || 0;
    } else {
      newItem.address = address;
      newItem.fax_number = fax;
      newItem.required_forms = forms.split(',').map(f => f.trim()).filter(f => f !== "");
    }

    setClinicData([newItem, ...clinicData]);
    
    // Reset Form Input Box States
    setTitle(""); setMbsNumber(""); setFee(""); setRebate(""); setGap("");
    setAddress(""); setFax(""); setForms(""); setNotes(""); setTags("");
    setShowForm(false);
  };

  const filteredInternalData = clinicData.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.keyword_tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '24px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Top Branding Section */}
        <header style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: 0 }}>⚡ QuickClinic</h1>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px', margin: 0 }}>Internal Reference Desk Utility • Specialist Practice Support</p>
          </div>
          {activeTab === "internal" && (
            <button 
              onClick={() => setShowForm(!showForm)}
              style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s' }}
            >
              {showForm ? '✖ Close Form' : '➕ Add Record'}
            </button>
          )}
        </header>

        {/* Global Navigation Tabs Panel */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
          <button 
            onClick={() => { setActiveTab("internal"); setSearchQuery(""); }}
            style={{ padding: '10px 18px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', transition: 'all 0.2s', backgroundColor: activeTab === "internal" ? '#1e3a8a' : '#e5e7eb', color: activeTab === "internal" ? '#ffffff' : '#374151' }}
          >
            📋 Practice Custom Notes
          </button>
          <button 
            onClick={() => { setActiveTab("mbs_api"); setSearchQuery(""); }}
            style={{ padding: '10px 18px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', transition: 'all 0.2s', backgroundColor: activeTab === "mbs_api" ? '#059669' : '#e5e7eb', color: activeTab === "mbs_api" ? '#ffffff' : '#374151' }}
          >
            🌐 Live MBS National Registry
          </button>
        </div>

        {/* Administrative Data Input Form */}
        {showForm && activeTab === "internal" && (
          <form onSubmit={handleSubmit} style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#111827', fontWeight: 'bold' }}>Add New Reference Card</h3>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#4b5563', marginBottom: '4px' }}>Data Category</label>
              <select value={formType} onChange={(e) => setFormType(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#ffffff' }}>
                <option value="procedure_fee">💰 Procedure Fee Details</option>
                <option value="place_and_form">📍 Hospital Location & Forms</option>
              </select>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#4b5563', marginBottom: '4px' }}>Title Name</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Gastric Bypass or St Vincent's Hospital" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
            </div>

            {formType === "procedure_fee" ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#4b5563', marginBottom: '4px' }}>MBS Item #</label>
                  <input type="text" value={mbsNumber} onChange={(e) => setMbsNumber(e.target.value)} placeholder="e.g., 31575" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#4b5563', marginBottom: '4px' }}>Clinic Fee ($)</label>
                  <input type="number" step="0.01" value={fee} onChange={(e) => setFee(e.target.value)} placeholder="800" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />

