import React, { useState } from 'react';
import { useConsultation } from '../context/ConsultationContext';
import { ClipboardList, Edit3, Save, Download, AlertTriangle, CheckCircle, X } from 'lucide-react';

export default function SoapNotesPage() {
    const { consultData, isApproved, handleApprove } = useConsultation();
    const [editingSection, setEditingSection] = useState(null);
    const [editValues, setEditValues] = useState({});

    const soap = consultData?.soap;
    const icd = consultData?.icd;

    const soapSections = [
        { key: 'subjective', label: 'Subjective', color: '#3b82f6', description: 'Patient-reported symptoms and history' },
        { key: 'objective', label: 'Objective', color: '#0d9488', description: 'Measurable clinical findings' },
        { key: 'assessment', label: 'Assessment', color: '#a855f7', description: 'Clinical diagnosis and analysis' },
        { key: 'plan', label: 'Plan', color: '#f59e0b', description: 'Treatment plan and follow-up' },
    ];

    const handleEditSection = (key, value) => {
        setEditValues(prev => ({ ...prev, [key]: value }));
        setEditingSection(key);
    };

    const handleSaveSection = (key) => {
        setEditingSection(null);
    };

    const handleExportPDF = () => {
        const content = soapSections.map(s => {
            const val = soap?.[s.key] || soap?.[s.label] || '';
            return `${s.label.toUpperCase()}\n${'='.repeat(40)}\n${Array.isArray(val) ? val.join(', ') : val}\n`;
        }).join('\n');

        const blob = new Blob([`SOAP Clinical Note\n${'='.repeat(50)}\n\n${content}`], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'soap_note.txt'; a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: 0 }}>
                        SOAP Notes 📄
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '4px', fontSize: '14px' }}>
                        AI-generated structured clinical documentation.
                    </p>
                </div>
                {soap && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={handleExportPDF} style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '10px 18px', borderRadius: '10px',
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                        }}>
                            <Download size={16} /> Export PDF
                        </button>
                        <button
                            onClick={handleApprove} disabled={isApproved}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '10px 18px', borderRadius: '10px',
                                background: isApproved ? 'rgba(34,197,94,0.15)' : 'linear-gradient(135deg, #16a34a, #22c55e)',
                                border: 'none', color: isApproved ? '#22c55e' : '#fff',
                                cursor: isApproved ? 'not-allowed' : 'pointer',
                                fontSize: '13px', fontWeight: '700',
                            }}
                        >
                            <CheckCircle size={16} />
                            {isApproved ? 'Signed & Saved' : 'Approve & Sign'}
                        </button>
                    </div>
                )}
            </div>

            {!soap ? (
                <div style={{
                    background: 'var(--bg-secondary)', borderRadius: '20px', padding: '60px',
                    border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center',
                }}>
                    <ClipboardList size={48} color="rgba(255,255,255,0.15)" style={{ marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'rgba(255,255,255,0.4)' }}>
                        No SOAP Notes Generated
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px' }}>
                        Complete a consultation recording to generate notes.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* SOAP Sections */}
                    {soapSections.map((section) => {
                        const val = soap[section.key] || soap[section.label] || '';
                        const displayVal = Array.isArray(val) ? val.join(', ') : val;
                        const isEditing = editingSection === section.key;

                        return (
                            <div key={section.key} style={{
                                background: 'var(--bg-secondary)', borderRadius: '16px',
                                border: `1px solid ${section.color}20`,
                                overflow: 'hidden',
                            }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '16px 20px', background: `${section.color}08`,
                                    borderBottom: `1px solid ${section.color}15`,
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '4px', height: '24px', borderRadius: '2px',
                                            background: section.color,
                                        }} />
                                        <div>
                                            <h4 style={{ fontSize: '14px', fontWeight: '700', color: section.color, margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                {section.label}
                                            </h4>
                                            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', margin: '2px 0 0 0' }}>
                                                {section.description}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => isEditing ? handleSaveSection(section.key) : handleEditSection(section.key, displayVal)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '6px',
                                            padding: '6px 12px', borderRadius: '8px',
                                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                                            color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '11px', fontWeight: '600',
                                        }}
                                    >
                                        {isEditing ? <><Save size={12} /> Save</> : <><Edit3 size={12} /> Edit</>}
                                    </button>
                                </div>
                                <div style={{ padding: '20px' }}>
                                    {isEditing ? (
                                        <textarea
                                            value={editValues[section.key] || ''}
                                            onChange={(e) => setEditValues(prev => ({ ...prev, [section.key]: e.target.value }))}
                                            style={{
                                                width: '100%', minHeight: '120px', background: 'rgba(0,0,0,0.3)',
                                                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
                                                color: '#fff', padding: '14px', fontSize: '14px', lineHeight: '1.6',
                                                resize: 'vertical', outline: 'none', fontFamily: 'inherit',
                                            }}
                                        />
                                    ) : (
                                        <p style={{
                                            color: 'rgba(255,255,255,0.75)', fontSize: '14px', lineHeight: '1.7',
                                            margin: 0, whiteSpace: 'pre-wrap',
                                        }}>
                                            {displayVal || 'No data available'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* ICD-11 Codes */}
                    {icd && (
                        <div style={{
                            background: 'var(--bg-secondary)', borderRadius: '16px',
                            border: '1px solid rgba(13,148,136,0.15)', padding: '20px',
                        }}>
                            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#0d9488', margin: '0 0 16px 0', letterSpacing: '0.5px' }}>
                                🏥 ICD-11 DIAGNOSTIC CODES
                            </h4>
                            {icd.primary && (
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '14px 16px', background: 'rgba(13,148,136,0.08)',
                                    borderRadius: '10px', border: '1px solid rgba(13,148,136,0.15)',
                                    marginBottom: '10px',
                                }}>
                                    <div>
                                        <span style={{ fontSize: '10px', color: '#5eead4', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Primary Diagnosis
                                        </span>
                                        <div style={{ marginTop: '4px' }}>
                                            <span style={{ fontSize: '22px', fontWeight: '800', color: '#0d9488', marginRight: '12px' }}>
                                                {icd.primary.code}
                                            </span>
                                            <span style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)' }}>
                                                {icd.primary.desc}
                                            </span>
                                        </div>
                                    </div>
                                    <span style={{
                                        padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700',
                                        background: 'rgba(34,197,94,0.1)', color: '#22c55e',
                                    }}>
                                        {icd.primary.confidence} Match
                                    </span>
                                </div>
                            )}
                            {icd.alternatives?.map((alt, i) => (
                                <div key={i} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '12px 16px', background: 'rgba(255,255,255,0.02)',
                                    borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)',
                                    marginTop: '8px', opacity: 0.7,
                                }}>
                                    <div>
                                        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: '600', textTransform: 'uppercase' }}>
                                            Alternative
                                        </span>
                                        <div style={{ marginTop: '2px' }}>
                                            <span style={{ fontSize: '16px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', marginRight: '10px' }}>
                                                {alt.code}
                                            </span>
                                            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{alt.desc}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Security Warning */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '14px 18px', borderRadius: '12px',
                        background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.15)',
                    }}>
                        <AlertTriangle size={20} color="#eab308" />
                        <p style={{ color: '#eab308', fontSize: '13px', fontWeight: '600', margin: 0 }}>
                            This output is AI generated and must be reviewed by a doctor before use.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
