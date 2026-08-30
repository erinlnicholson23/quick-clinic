import React, { useState } from 'react';

// Mock dataset based on Melbourne surgical workflows
const CLINIC_DATA = [
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
  const [searchQuery, setSearchQuery] = useState("");

  // Filtering logic checking titles and tags
  const filteredData = CLINIC_DATA.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.keyword_tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '24px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header Block */}
        <header style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: 0 }}>⚡ QuickClinic</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px', margin: 0 }}>Internal Reference Desk Utility • Specialist & Surgical Practice</p>
        </header>

        {/* Global Search Input */}
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <input
            type="text"
            style={{
              width: '100%',
              padding: '16px',
              paddingLeft: '44px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              fontSize: '18px',
              backgroundColor: '#ffffff',
              color: '#111827',
              boxSizing: 'border-box',
              outline: 'none'
            }}
            placeholder="Type a procedure, hospital, tag (e.g., 'scope', 'Epworth', '30473')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span style={{ position: 'absolute', left: '16px', top: '18px', color: '#9ca3af' }}>🔍</span>
        </div>

        {/* Results Counter */}
        <div style={{ marginBottom: '16px', fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Results Found: {filteredData.length}
        </div>

        {/* Dynamic Cards Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredData.map((item) => (
            <div 
              key={item.id} 
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #f3f4f6',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <span style={{
                    display: 'inline-block',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    marginRight: '8px',
                    backgroundColor: item.type === 'procedure_fee' ? '#eff6ff' : '#ecfdf5',
                    color: item.type === 'procedure_fee' ? '#1d4ed8' : '#047857'
                  }}>
                    {item.type === 'procedure_fee' ? '💰 Fee Lookup' : '📍 Location & Forms'}
                  </span>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', display: 'inline', margin: 0 }}>{item.title}</h3>
                </div>
                {item.mbs_item_number && (
                  <span style={{ fontSize: '14px', fontFamily: 'monospace', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '4px 8px', borderRadius: '4px' }}>
                    MBS: #{item.mbs_item_number}
                  </span>
                )}
              </div>

              {item.type === 'procedure_fee' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', margin: '16px 0', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase' }}>Clinic Fee</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#374151' }}>${item.clinic_fee.toFixed(2)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase' }}>Medicare Rebate</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#059669' }}>${item.medicare_rebate.toFixed(2)}</div>
                  </div>
                  <div style={{ borderLeft: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '12px', color: '#2563eb', fontWeight: 'bold', textTransform: 'uppercase' }}>Est. Patient Gap</div>
                    <div style={{ fontSize: '20px', fontWeight: '900', color: '#1d4ed8' }}>${item.approx_private_health_gap.toFixed(2)}</div>
                  </div>
                </div>
              ) : (
                <div style={{ margin: '16px 0', fontSize: '14px', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <p style={{ margin: 0 }}><strong>🏥 Address:</strong> {item.address}</p>
                  <p style={{ margin: 0 }}><strong>📠 Fax:</strong> {item.fax_number}</p>
                  <div>
                    <strong style={{ display: 'block', marginBottom: '4px' }}>📋 Handout Forms Needed:</strong>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {item.required_forms.map((form, idx) => (
                        <span key={idx} style={{ backgroundColor: '#fffbeb', color: '#92400e', fontSize: '12px', padding: '4px 10px', borderRadius: '9999px', border: '1px solid #fde68a', fontWeight: '500' }}>
                          📄 {form}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f3f4f6', fontSize: '14px', color: '#4b5563', backgroundColor: '#fefce8', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
                <span style={{ fontWeight: 'bold', color: '#92400e', fontSize: '12px', display: 'block', marginBottom: '2px', textTransform: 'uppercase' }}>Desk Protocol:</span>
                {item.notes}
              </div>

            </div>
          ))}

          {filteredData.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px dashed #e5e7eb' }}>
              <p style={{ color: '#9ca3af', fontSize: '18px', margin: 0 }}>No records match "{searchQuery}"</p>
              <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '4px', margin: 0 }}>Try typing "scope", "gastroscopy", or "epworth"</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
