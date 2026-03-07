import React from 'react';
import { useConsultation } from '../context/ConsultationContext';
import { Pill, Printer, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function PrescriptionPage() {
  const { consultData } = useConsultation();
  const prescriptions = consultData?.prescription || [];
  const drugCheck = consultData?.drug_check;

  const handlePrint = () => {
    const content = prescriptions.map((rx, i) =>
      `${i + 1}. ${rx.drug_name}\n   Dose: ${rx.dosage}\n   Frequency: ${rx.frequency}\n   Duration: ${rx.duration}\n`
    ).join('\n');

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html><head><title>Prescription</title>
      <style>body{font-family:Georgia,serif;padding:40px;max-width:600px;margin:0 auto}
      h1{color:#0d9488;border-bottom:2px solid #0d9488;padding-bottom:10px}
      .rx{margin:20px 0;padding:15px;border-left:4px solid #0d9488;background:#f8f8f8}
      .drug{font-size:20px;font-weight:bold}.detail{color:#666;margin-top:5px}</style></head>
      <body><h1>℞ Electronic Prescription</h1>
      <p>Date: ${new Date().toLocaleDateString()}</p>
      ${prescriptions.map((rx, i) => `
        <div class="rx">
          <div class="drug">${rx.drug_name}</div>
          <div class="detail">Dosage: ${rx.dosage}</div>
          <div class="detail">Frequency: ${rx.frequency}</div>
          <div class="detail">Duration: ${rx.duration}</div>
        </div>
      `).join('')}
      <p style="margin-top:40px;border-top:1px solid #ccc;padding-top:20px;color:#999;font-size:12px">
      AI-generated prescription. Must be reviewed and signed by a licensed physician.</p>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Dosage templates
  const templates = [
    { drug: 'Paracetamol 500mg', dose: '500mg', freq: 'Twice daily after food', dur: '5 days' },
    { drug: 'Amoxicillin 250mg', dose: '250mg', freq: 'Three times daily', dur: '7 days' },
    { drug: 'Omeprazole 20mg', dose: '20mg', freq: 'Once daily before food', dur: '14 days' },
    { drug: 'Cetirizine 10mg', dose: '10mg', freq: 'Once daily at night', dur: '5 days' },
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: 0 }}>
            Prescription Generator 💊
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '4px', fontSize: '14px' }}>
            AI-powered medication suggestions with dosage templates.
          </p>
        </div>
        {prescriptions.length > 0 && (
          <button onClick={handlePrint} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #0d9488, #06b6d4)',
            border: 'none', color: '#fff', cursor: 'pointer',
            fontSize: '13px', fontWeight: '700',
          }}>
            <Printer size={16} /> Print Prescription
          </button>
        )}
      </div>

      {/* Active Prescriptions */}
      {prescriptions.length > 0 ? (
        <div style={{
          background: '#161b22', borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.06)', padding: '24px', marginBottom: '20px',
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ℞ Current Prescription
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {prescriptions.map((rx, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '18px 20px', borderRadius: '14px',
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff', fontFamily: 'Georgia, serif' }}>
                    {rx.drug_name}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', marginTop: '4px', fontSize: '13px' }}>
                    Dose: {rx.dosage}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#5eead4', fontWeight: '600', fontSize: '14px' }}>
                    {rx.frequency}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginTop: '4px' }}>
                    Duration: {rx.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{
          background: '#161b22', borderRadius: '20px', padding: '60px',
          border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', marginBottom: '20px',
        }}>
          <Pill size={48} color="rgba(255,255,255,0.15)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'rgba(255,255,255,0.4)' }}>
            No Prescriptions Generated
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px' }}>
            Complete a consultation to auto-generate prescriptions.
          </p>
        </div>
      )}

      {/* Drug Interaction Inline Check */}
      {drugCheck && (
        <div style={{
          padding: '18px 20px', borderRadius: '14px', marginBottom: '20px',
          background: drugCheck.overall_risk === 'HIGH' ? 'rgba(239,68,68,0.08)' : 'rgba(234,179,8,0.06)',
          border: `1px solid ${drugCheck.overall_risk === 'HIGH' ? 'rgba(239,68,68,0.2)' : 'rgba(234,179,8,0.15)'}`,
          display: 'flex', alignItems: 'center', gap: '14px',
        }}>
          {drugCheck.overall_risk === 'HIGH' ?
            <AlertTriangle size={22} color="#ef4444" /> :
            <ShieldCheck size={22} color="#eab308" />
          }
          <div style={{ flex: 1 }}>
            <span style={{
              fontSize: '12px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px',
              background: drugCheck.overall_risk === 'HIGH' ? 'rgba(239,68,68,0.2)' : 'rgba(234,179,8,0.15)',
              color: drugCheck.overall_risk === 'HIGH' ? '#ef4444' : '#eab308',
            }}>
              RISK: {drugCheck.overall_risk}
            </span>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', margin: '8px 0 0 0' }}>
              {drugCheck.details}
            </p>
          </div>
        </div>
      )}

      {/* Dosage Templates */}
      <div style={{
        background: '#161b22', borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.06)', padding: '24px',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: '0 0 20px 0' }}>
          📋 Common Dosage Templates
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {templates.map((t, i) => (
            <div key={i} style={{
              padding: '16px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
              cursor: 'pointer', transition: 'all 0.2s',
            }}>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#0d9488', marginBottom: '6px' }}>
                {t.drug}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.6' }}>
                {t.freq}<br />Duration: {t.dur}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
