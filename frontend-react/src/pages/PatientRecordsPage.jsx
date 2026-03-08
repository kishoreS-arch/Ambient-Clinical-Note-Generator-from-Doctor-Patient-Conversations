import React, { useState } from 'react';
import { useConsultation } from '../context/ConsultationContext';
import { Users, Search, ChevronDown, ChevronUp, Calendar, Pill, FileText, Activity } from 'lucide-react';

const mockPatients = [
    {
        id: 'P001', name: 'Raj Kumar', age: 45, gender: 'Male', phone: '+91 9876543210',
        lastVisit: '2026-03-07', totalVisits: 8,
        visits: [
            { date: '2026-03-07', diagnosis: 'Hypertension Stage 1', icd: 'BA00', drugs: ['Amlodipine 5mg', 'Aspirin 75mg'], status: 'Approved' },
            { date: '2026-02-20', diagnosis: 'Upper Respiratory Infection', icd: 'CA07', drugs: ['Paracetamol 500mg', 'Cetirizine 10mg'], status: 'Approved' },
            { date: '2026-01-15', diagnosis: 'Routine Checkup', icd: '-', drugs: [], status: 'Approved' },
        ],
    },
    {
        id: 'P002', name: 'Priya Sharma', age: 32, gender: 'Female', phone: '+91 9123456780',
        lastVisit: '2026-03-05', totalVisits: 3,
        visits: [
            { date: '2026-03-05', diagnosis: 'Type 2 Diabetes', icd: '5A11', drugs: ['Metformin 500mg'], status: 'Approved' },
            { date: '2026-02-10', diagnosis: 'Migraine', icd: '8A80', drugs: ['Sumatriptan 50mg'], status: 'Approved' },
        ],
    },
    {
        id: 'P003', name: 'Arun Patel', age: 58, gender: 'Male', phone: '+91 9988776655',
        lastVisit: '2026-03-01', totalVisits: 12,
        visits: [
            { date: '2026-03-01', diagnosis: 'Chronic Lower Back Pain', icd: 'ME84', drugs: ['Diclofenac 50mg', 'Pantoprazole 40mg'], status: 'Pending' },
            { date: '2026-02-15', diagnosis: 'Hyperlipidemia', icd: '5C80', drugs: ['Atorvastatin 20mg'], status: 'Approved' },
        ],
    },
    {
        id: 'P004', name: 'Meena Devi', age: 67, gender: 'Female', phone: '+91 9011223344',
        lastVisit: '2026-02-28', totalVisits: 5,
        visits: [
            { date: '2026-02-28', diagnosis: 'Osteoarthritis', icd: 'FA20', drugs: ['Glucosamine', 'Paracetamol 650mg'], status: 'Approved' },
        ],
    },
    {
        id: 'P005', name: 'Vikram Singh', age: 29, gender: 'Male', phone: '+91 9900112233',
        lastVisit: '2026-03-06', totalVisits: 2,
        visits: [
            { date: '2026-03-06', diagnosis: 'Acute Gastritis', icd: 'DA42', drugs: ['Omeprazole 20mg', 'Domperidone 10mg'], status: 'Approved' },
        ],
    },
];

export default function PatientRecordsPage({ setActiveTab }) {
    const { historyData } = useConsultation();
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedId, setExpandedId] = useState(null);

    const filtered = mockPatients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: 0, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Users size={28} color="#3b82f6" /> Patient Records
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '4px', fontSize: '14px' }}>
                    Complete patient database with visit history
                </p>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                {[
                    { label: 'Total Patients', value: mockPatients.length, icon: Users, color: '#3b82f6' },
                    { label: 'Total Visits', value: mockPatients.reduce((a, p) => a + p.totalVisits, 0), icon: Calendar, color: '#0d9488' },
                    { label: 'Active Rxs', value: mockPatients.reduce((a, p) => a + (p.visits[0]?.drugs.length || 0), 0), icon: Pill, color: '#a855f7' },
                    { label: 'Pending Review', value: mockPatients.filter(p => p.visits.some(v => v.status === 'Pending')).length, icon: FileText, color: '#eab308' },
                ].map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <div key={i} style={{
                            background: 'var(--bg-secondary)', borderRadius: '14px', padding: '18px 20px',
                            border: '1px solid rgba(255,255,255,0.06)',
                            display: 'flex', alignItems: 'center', gap: '14px',
                        }}>
                            <div style={{
                                width: '42px', height: '42px', borderRadius: '12px',
                                background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Icon size={20} color={s.color} />
                            </div>
                            <div>
                                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: 0, textTransform: 'uppercase', fontWeight: '600' }}>{s.label}</p>
                                <p style={{ fontSize: '22px', fontWeight: '700', color: '#fff', margin: '2px 0 0 0' }}>{s.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Search */}
            <div style={{
                position: 'relative', marginBottom: '20px',
            }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                <input
                    type="text"
                    placeholder="Search patients by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%', padding: '14px 16px 14px 48px', borderRadius: '12px',
                        background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.08)',
                        color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                        transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(13,148,136,0.4)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
            </div>

            {/* Patient Table */}
            <div className="med-card" style={{
                background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)',
                overflow: 'hidden',
            }}>
                {/* Header Row */}
                <div style={{
                    display: 'grid', gridTemplateColumns: '80px 1fr 60px 80px 140px 100px 50px',
                    padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
                    background: 'rgba(255,255,255,0.02)',
                }}>
                    {['ID', 'Name', 'Age', 'Gender', 'Last Visit', 'Visits', ''].map((h, i) => (
                        <span key={i} style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</span>
                    ))}
                </div>

                {/* Rows */}
                {filtered.map((patient) => (
                    <div key={patient.id}>
                        <div
                            onClick={() => setExpandedId(expandedId === patient.id ? null : patient.id)}
                            style={{
                                display: 'grid', gridTemplateColumns: '80px 1fr 60px 80px 140px 100px 50px',
                                padding: '16px 20px', cursor: 'pointer',
                                borderBottom: '1px solid rgba(255,255,255,0.03)',
                                background: expandedId === patient.id ? 'rgba(13,148,136,0.05)' : 'transparent',
                                transition: 'background 0.2s', alignItems: 'center',
                            }}
                            onMouseEnter={(e) => { if (expandedId !== patient.id) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                            onMouseLeave={(e) => { if (expandedId !== patient.id) e.currentTarget.style.background = 'transparent'; }}
                        >
                            <span style={{ fontSize: '12px', color: '#0d9488', fontFamily: 'monospace', fontWeight: '600' }}>{patient.id}</span>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{patient.name}</span>
                            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{patient.age}</span>
                            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{patient.gender}</span>
                            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{patient.lastVisit}</span>
                            <span style={{
                                fontSize: '12px', fontWeight: '600', padding: '4px 10px', borderRadius: '8px',
                                background: 'rgba(13,148,136,0.1)', color: '#5eead4', width: 'fit-content',
                            }}>
                                {patient.totalVisits} visits
                            </span>
                            <span style={{ color: 'rgba(255,255,255,0.3)' }}>
                                {expandedId === patient.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </span>
                        </div>

                        {/* Expanded Visit History */}
                        {expandedId === patient.id && (
                            <div style={{
                                padding: '0 20px 20px 20px',
                                background: 'rgba(13,148,136,0.03)',
                                borderBottom: '1px solid rgba(13,148,136,0.1)',
                            }}>
                                <div style={{ padding: '16px', background: '#0d1117', borderRadius: '12px', marginTop: '4px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                                        <Activity size={14} color="#0d9488" />
                                        <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#5eead4', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Visit History</h4>
                                    </div>
                                    {patient.visits.map((v, vi) => (
                                        <div key={vi} style={{
                                            display: 'grid', gridTemplateColumns: '100px 1fr 70px 1fr 80px',
                                            padding: '12px 0', borderBottom: vi < patient.visits.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                                            alignItems: 'center', gap: '12px',
                                        }}>
                                            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{v.date}</span>
                                            <span style={{ fontSize: '13px', fontWeight: '500', color: '#fff' }}>{v.diagnosis}</span>
                                            <span style={{
                                                fontSize: '11px', fontFamily: 'monospace', padding: '2px 8px', borderRadius: '6px',
                                                background: 'rgba(255,255,255,0.05)', color: '#0d9488', border: '1px solid rgba(255,255,255,0.06)',
                                            }}>
                                                {v.icd}
                                            </span>
                                            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{v.drugs.join(', ') || 'None'}</span>
                                            <span style={{
                                                fontSize: '10px', fontWeight: '600', padding: '3px 8px', borderRadius: '6px',
                                                background: v.status === 'Approved' ? 'rgba(34,197,94,0.1)' : 'rgba(234,179,8,0.1)',
                                                color: v.status === 'Approved' ? '#22c55e' : '#eab308',
                                            }}>{v.status}</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>📞 {patient.phone}</span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>
                        No patients found matching "{searchTerm}"
                    </div>
                )}
            </div>
        </div>
    );
}
