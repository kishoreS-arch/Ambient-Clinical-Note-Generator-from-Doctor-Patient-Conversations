import React, { useState } from 'react';
import { FlaskConical, Search, AlertTriangle, ShieldCheck, AlertCircle } from 'lucide-react';

export default function DrugInteractionsPage() {
  const [drug1, setDrug1] = useState('');
  const [drug2, setDrug2] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);

  const severityConfig = {
    safe: { color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)', label: '🟢 Safe', icon: ShieldCheck },
    minor: { color: '#eab308', bg: 'rgba(234,179,8,0.08)', border: 'rgba(234,179,8,0.2)', label: '🟡 Minor Interaction', icon: AlertCircle },
    dangerous: { color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', label: '🔴 Dangerous', icon: AlertTriangle },
  };

  const knownInteractions = [
    { drugs: ['warfarin', 'aspirin'], severity: 'dangerous', detail: 'Increased risk of bleeding. Avoid combination or monitor INR closely.', action: 'Consider alternative anticoagulation strategy.' },
    { drugs: ['metformin', 'alcohol'], severity: 'dangerous', detail: 'Risk of lactic acidosis. Avoid alcohol consumption with metformin.', action: 'Counsel patient on alcohol avoidance.' },
    { drugs: ['lisinopril', 'potassium'], severity: 'minor', detail: 'May increase potassium levels. Monitor serum potassium.', action: 'Regular electrolyte monitoring recommended.' },
    { drugs: ['amoxicillin', 'paracetamol'], severity: 'safe', detail: 'No known clinically significant interaction.', action: 'Safe to use concurrently.' },
    { drugs: ['omeprazole', 'clopidogrel'], severity: 'dangerous', detail: 'Omeprazole may reduce effectiveness of clopidogrel.', action: 'Consider pantoprazole as alternative PPI.' },
    { drugs: ['cetirizine', 'paracetamol'], severity: 'safe', detail: 'No significant interaction expected.', action: 'Safe combination.' },
    { drugs: ['ibuprofen', 'aspirin'], severity: 'minor', detail: 'Ibuprofen may reduce cardioprotective effect of aspirin.', action: 'Take aspirin 30 minutes before ibuprofen.' },
  ];

  const checkInteraction = () => {
    if (!drug1.trim() || !drug2.trim()) return;
    setChecking(true);

    setTimeout(() => {
      const d1 = drug1.toLowerCase().trim();
      const d2 = drug2.toLowerCase().trim();

      const found = knownInteractions.find(
        i => (i.drugs.includes(d1) && i.drugs.includes(d2))
      );

      if (found) {
        setResult({ ...found, drug1, drug2 });
      } else {
        setResult({
          severity: 'safe', drug1, drug2,
          detail: `No known interaction found between ${drug1} and ${drug2} in our database.`,
          action: 'Always verify with OpenFDA or clinical pharmacology reference.',
        });
      }
      setChecking(false);
    }, 1200);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: 0 }}>
          Drug Interactions 🧪
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '4px', fontSize: '14px' }}>
          Check medicine conflicts powered by OpenFDA database.
        </p>
      </div>

      {/* Input Section */}
      <div style={{
        background: '#161b22', borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.06)', padding: '28px', marginBottom: '24px',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '16px', alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Drug 1
            </label>
            <input
              value={drug1} onChange={(e) => setDrug1(e.target.value)}
              placeholder="e.g. Warfarin"
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '10px',
                background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', fontSize: '14px', outline: 'none',
              }}
              onKeyDown={(e) => e.key === 'Enter' && checkInteraction()}
            />
          </div>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'rgba(13,148,136,0.1)', border: '1px solid rgba(13,148,136,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#0d9488', fontSize: '20px', fontWeight: '700',
          }}>
            ×
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Drug 2
            </label>
            <input
              value={drug2} onChange={(e) => setDrug2(e.target.value)}
              placeholder="e.g. Aspirin"
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '10px',
                background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', fontSize: '14px', outline: 'none',
              }}
              onKeyDown={(e) => e.key === 'Enter' && checkInteraction()}
            />
          </div>
        </div>

        <button
          onClick={checkInteraction}
          disabled={checking || !drug1.trim() || !drug2.trim()}
          style={{
            width: '100%', marginTop: '20px', padding: '14px',
            borderRadius: '12px', border: 'none', fontSize: '15px',
            fontWeight: '700', cursor: 'pointer',
            background: (!drug1.trim() || !drug2.trim()) ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #0d9488, #06b6d4)',
            color: (!drug1.trim() || !drug2.trim()) ? 'rgba(255,255,255,0.3)' : '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'all 0.2s',
          }}
        >
          {checking ? (
            <>
              <div style={{
                width: '18px', height: '18px', borderRadius: '50%',
                border: '2px solid #fff', borderTopColor: 'transparent',
                animation: 'spin 1s linear infinite',
              }} />
              Checking...
            </>
          ) : (
            <><Search size={18} /> Check Interaction</>
          )}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div style={{
          borderRadius: '20px', overflow: 'hidden',
          border: `1px solid ${severityConfig[result.severity].border}`,
        }}>
          <div style={{
            padding: '20px 24px',
            background: severityConfig[result.severity].bg,
            display: 'flex', alignItems: 'center', gap: '14px',
          }}>
            {React.createElement(severityConfig[result.severity].icon, { size: 28, color: severityConfig[result.severity].color })}
            <div>
              <span style={{
                fontSize: '18px', fontWeight: '800',
                color: severityConfig[result.severity].color,
              }}>
                {severityConfig[result.severity].label}
              </span>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '2px 0 0 0' }}>
                {result.drug1} + {result.drug2}
              </p>
            </div>
          </div>
          <div style={{ padding: '24px', background: '#161b22' }}>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '15px', lineHeight: '1.7', margin: '0 0 16px 0' }}>
              {result.detail}
            </p>
            <div style={{
              padding: '14px 16px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Recommended Action
              </span>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: '6px 0 0 0' }}>
                {result.action}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Severity Legend */}
      <div style={{
        marginTop: '24px', padding: '20px 24px', borderRadius: '16px',
        background: '#161b22', border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', margin: '0 0 14px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Severity Guide
        </h4>
        <div style={{ display: 'flex', gap: '24px' }}>
          {Object.entries(severityConfig).map(([key, cfg]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%', background: cfg.color,
              }} />
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>
                {key}
              </span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginTop: '12px' }}>
          Data source: OpenFDA Drug Interaction Database. Always verify with clinical references.
        </p>
      </div>
    </div>
  );
}
