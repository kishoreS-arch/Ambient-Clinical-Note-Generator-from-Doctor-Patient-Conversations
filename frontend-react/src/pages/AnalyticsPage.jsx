import React, { useState } from 'react';
import { useConsultation } from '../context/ConsultationContext';
import { BarChart3, TrendingUp, Users, Clock, Heart, Pill, Activity, Calendar } from 'lucide-react';

const weeklyData = [
    { day: 'Mon', count: 12 },
    { day: 'Tue', count: 8 },
    { day: 'Wed', count: 15 },
    { day: 'Thu', count: 10 },
    { day: 'Fri', count: 18 },
    { day: 'Sat', count: 6 },
    { day: 'Sun', count: 3 },
];

const topDiseases = [
    { name: 'Hypertension', count: 45, color: '#3b82f6' },
    { name: 'Type 2 Diabetes', count: 38, color: '#0d9488' },
    { name: 'Upper Respiratory Infection', count: 32, color: '#a855f7' },
    { name: 'Lower Back Pain', count: 28, color: '#f59e0b' },
    { name: 'Migraine', count: 22, color: '#ef4444' },
    { name: 'Gastritis', count: 18, color: '#06b6d4' },
];

const medicineUsage = [
    { name: 'Paracetamol 500mg', count: 62, color: '#22c55e' },
    { name: 'Amlodipine 5mg', count: 45, color: '#3b82f6' },
    { name: 'Metformin 500mg', count: 38, color: '#0d9488' },
    { name: 'Omeprazole 20mg', count: 30, color: '#a855f7' },
    { name: 'Cetirizine 10mg', count: 25, color: '#f59e0b' },
];

export default function AnalyticsPage() {
    const { analyticsData, historyData } = useConsultation();
    const [timeRange, setTimeRange] = useState('week');
    const maxWeekly = Math.max(...weeklyData.map(d => d.count));
    const maxDisease = topDiseases[0].count;
    const maxMedicine = medicineUsage[0].count;

    const stats = [
        { title: 'Total Consultations', value: analyticsData?.total_consultations || 156, icon: Users, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
        { title: 'This Week', value: analyticsData?.this_week || weeklyData.reduce((a, d) => a + d.count, 0), icon: TrendingUp, color: '#0d9488', bg: 'rgba(13,148,136,0.1)' },
        { title: 'Minutes Saved', value: analyticsData?.minutes_saved || 1240, icon: Clock, color: '#a855f7', bg: 'rgba(168,85,247,0.1)' },
        { title: 'Patient Hours Gained', value: analyticsData?.hours_returned || '20.6', icon: Heart, color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
    ];

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: 0, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <BarChart3 size={28} color="#a855f7" /> Analytics
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '4px', fontSize: '14px' }}>
                        Doctor performance stats & clinical insights
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '6px', background: '#161b22', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    {['week', 'month', 'year'].map(r => (
                        <button key={r} onClick={() => setTimeRange(r)} style={{
                            padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                            background: timeRange === r ? 'rgba(13,148,136,0.2)' : 'transparent',
                            color: timeRange === r ? '#5eead4' : 'rgba(255,255,255,0.4)',
                            fontSize: '12px', fontWeight: '600', textTransform: 'capitalize', transition: 'all 0.2s',
                        }}>{r}</button>
                    ))}
                </div>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
                {stats.map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <div key={i} style={{
                            background: 'var(--bg-secondary)', borderRadius: '16px', padding: '22px',
                            border: '1px solid rgba(255,255,255,0.06)',
                            display: 'flex', alignItems: 'center', gap: '16px',
                        }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon size={22} color={s.color} />
                            </div>
                            <div>
                                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: 0, textTransform: 'uppercase', fontWeight: '600' }}>{s.title}</p>
                                <p style={{ fontSize: '26px', fontWeight: '700', color: '#fff', margin: '2px 0 0 0' }}>{s.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                {/* Weekly Consultations Bar Chart */}
                <div className="med-card" style={{ background: 'var(--bg-secondary)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#fff', margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={16} color="#0d9488" /> Weekly Consultations
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '180px', paddingBottom: '32px', position: 'relative' }}>
                        {weeklyData.map((d, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                                <span style={{ fontSize: '12px', fontWeight: '600', color: '#5eead4' }}>{d.count}</span>
                                <div style={{
                                    width: '100%', maxWidth: '48px',
                                    height: `${(d.count / maxWeekly) * 100}%`,
                                    background: `linear-gradient(180deg, #0d9488 0%, rgba(13,148,136,0.3) 100%)`,
                                    borderRadius: '8px 8px 4px 4px',
                                    transition: 'height 0.5s ease',
                                    minHeight: '8px',
                                }} />
                                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: '500' }}>{d.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Diseases */}
                <div className="med-card" style={{ background: 'var(--bg-secondary)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#fff', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Activity size={16} color="#3b82f6" /> Top Diseases
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {topDiseases.map((d, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>{d.name}</span>
                                    <span style={{ fontSize: '13px', color: d.color, fontWeight: '600' }}>{d.count}</span>
                                </div>
                                <div style={{ height: '6px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%', width: `${(d.count / maxDisease) * 100}%`,
                                        background: `linear-gradient(90deg, ${d.color}, ${d.color}80)`,
                                        borderRadius: '4px', transition: 'width 0.8s ease',
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Medicine Usage + Approval Rate */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Medicine Usage */}
                <div className="med-card" style={{ background: 'var(--bg-secondary)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#fff', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Pill size={16} color="#a855f7" /> Medicine Usage
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {medicineUsage.map((m, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: '14px',
                                padding: '12px 14px', borderRadius: '10px',
                                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)',
                            }}>
                                <span style={{
                                    width: '28px', height: '28px', borderRadius: '8px',
                                    background: `${m.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '12px', fontWeight: '700', color: m.color, flexShrink: 0,
                                }}>
                                    #{i + 1}
                                </span>
                                <span style={{ flex: 1, fontSize: '13px', fontWeight: '500', color: '#fff' }}>{m.name}</span>
                                <div style={{ width: '80px', height: '4px', background: 'rgba(255,255,255,0.04)', borderRadius: '2px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${(m.count / maxMedicine) * 100}%`, background: m.color, borderRadius: '2px' }} />
                                </div>
                                <span style={{ fontSize: '12px', fontWeight: '600', color: m.color, minWidth: '32px', textAlign: 'right' }}>{m.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Performance Summary */}
                <div className="med-card" style={{ background: 'var(--bg-secondary)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#fff', margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <TrendingUp size={16} color="#22c55e" /> Performance Summary
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            { label: 'Note Approval Rate', value: analyticsData?.approval_rate || '94%', color: '#22c55e' },
                            { label: 'Avg. Note Time', value: '2.3 min', color: '#0d9488' },
                            { label: 'Patient Satisfaction', value: '4.8/5', color: '#f59e0b' },
                            { label: 'AI Accuracy', value: '96.2%', color: '#3b82f6' },
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '16px', borderRadius: '12px',
                                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)',
                            }}>
                                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontWeight: '500' }}>{item.label}</span>
                                <span style={{ fontSize: '20px', fontWeight: '700', color: item.color }}>{item.value}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{
                        marginTop: '20px', padding: '16px', borderRadius: '12px',
                        background: 'rgba(13,148,136,0.08)', border: '1px solid rgba(13,148,136,0.15)',
                    }}>
                        <p style={{ fontSize: '13px', color: '#5eead4', fontWeight: '600', margin: '0 0 4px 0' }}>💡 Impact Statement</p>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: '1.6' }}>
                            {analyticsData?.impact_statement || 'You saved approximately 20.6 hours this month, allowing more face-to-face time with patients.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
