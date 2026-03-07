import React from 'react';
import { FileDown, Download, FileText, CheckCircle } from 'lucide-react';

const dummyReports = [
    { id: 1, name: 'Blood Test Results', date: '2026-03-01', size: '1.2 MB', type: 'PDF' },
    { id: 2, name: 'Chest X-Ray Report', date: '2026-02-15', size: '4.5 MB', type: 'IMAGE' },
    { id: 3, name: 'Annual Health Check', date: '2026-01-20', size: '2.1 MB', type: 'PDF' },
];

export default function ReportsPage() {
    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Medical Reports</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Access and download your official medical documents and test results.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {dummyReports.map(report => (
                    <div key={report.id} style={{
                        background: 'var(--bg-secondary)',
                        padding: '20px',
                        borderRadius: '16px',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                padding: '10px', borderRadius: '10px',
                                background: 'rgba(59,130,246,0.1)', color: '#3b82f6'
                            }}>
                                <FileText size={20} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: 0, fontSize: '15px' }}>{report.name}</h4>
                                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                                    {report.date} • {report.size}
                                </p>
                            </div>
                        </div>
                        <button style={{
                            width: '100%', padding: '10px', borderRadius: '10px',
                            border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)',
                            color: 'var(--text-primary)', cursor: 'pointer', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', gap: '8px',
                            fontSize: '13px', fontWeight: '600', transition: 'all 0.2s'
                        }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                            <Download size={16} /> Download {report.type}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
