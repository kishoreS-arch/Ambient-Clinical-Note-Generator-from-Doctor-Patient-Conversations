import React from 'react';
import { useConsultation } from '../context/ConsultationContext';
import { Calendar, FileText, ChevronRight } from 'lucide-react';

export default function ConsultationHistoryPage() {
    const { historyData } = useConsultation();

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Consultation History</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Review your past medical visits and doctor summaries.</p>

            <div style={{ display: 'grid', gap: '16px' }}>
                {historyData.length > 0 ? historyData.map((visit) => (
                    <div key={visit.id} style={{
                        background: 'var(--bg-secondary)',
                        padding: '24px',
                        borderRadius: '16px',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'transform 0.2s',
                        cursor: 'pointer'
                    }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{
                                width: '50px', height: '50px', borderRadius: '12px',
                                background: 'rgba(13,148,136,0.1)', color: '#0d9488',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Calendar size={24} />
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 4px 0', fontSize: '17px' }}>{visit.diagnosis || 'General Checkup'}</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '13px' }}>
                                    <span>{new Date(visit.created_at).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <FileText size={14} /> Full Record Available
                                    </span>
                                </div>
                            </div>
                        </div>
                        <ChevronRight color="var(--text-muted)" />
                    </div>
                )) : (
                    <div style={{ textAlignment: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                        No records found yet.
                    </div>
                )}
            </div>
        </div>
    );
}
