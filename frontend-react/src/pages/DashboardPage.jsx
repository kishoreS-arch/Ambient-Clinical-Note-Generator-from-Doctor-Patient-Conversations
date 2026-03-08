import React from 'react';
import { useConsultation } from '../context/ConsultationContext';
import { Activity, Users, FileText, Cpu, TrendingUp, Clock, Mic, ArrowRight, Zap, AlertCircle, Brain } from 'lucide-react';

export default function DashboardPage({ setActiveTab, userRole }) {
    const { analyticsData, historyData, settings, t, aiInsights } = useConsultation();

    const doctorStats = [
        {
            title: 'Total Consultations',
            value: analyticsData?.total_consultations || historyData.length || 0,
            icon: Users, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',
            border: 'rgba(59,130,246,0.2)',
        },
        {
            title: "Today's Patients",
            value: analyticsData?.this_week || 0,
            icon: Activity, color: '#0d9488', bg: 'rgba(13,148,136,0.1)',
            border: 'rgba(13,148,136,0.2)',
        },
        {
            title: 'AI Notes Generated',
            value: analyticsData?.total_consultations || 0,
            icon: FileText, color: '#a855f7', bg: 'rgba(168,85,247,0.1)',
            border: 'rgba(168,85,247,0.2)',
        },
        {
            title: 'AI Engine Status',
            value: 'Online',
            icon: Cpu, color: '#22c55e', bg: 'rgba(34,197,94,0.1)',
            border: 'rgba(34,197,94,0.2)',
        },
    ];

    const patientStats = [
        {
            title: 'Upcoming Visits',
            value: '2',
            icon: Clock, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',
            border: 'rgba(59,130,246,0.2)',
        },
        {
            title: 'New Reports',
            value: '1',
            icon: FileText, color: '#0d9488', bg: 'rgba(13,148,136,0.1)',
            border: 'rgba(13,148,136,0.2)',
        },
        {
            title: 'Active Prescriptions',
            value: '3',
            icon: TrendingUp, color: '#a855f7', bg: 'rgba(168,85,247,0.1)',
            border: 'rgba(168,85,247,0.2)',
        },
        {
            title: 'Health Score',
            value: '92%',
            icon: Activity, color: '#22c55e', bg: 'rgba(34,197,94,0.1)',
            border: 'rgba(34,197,94,0.2)',
        },
    ];

    const stats = userRole === 'patient' ? patientStats : doctorStats;

    const doctorActions = [
        { label: 'Start New Consultation', icon: Mic, tab: 'new-consultation', color: '#0d9488' },
        { label: 'View Analytics', icon: TrendingUp, tab: 'analytics', color: '#a855f7' },
        { label: 'Patient Records', icon: Users, tab: 'patient-records', color: '#3b82f6' },
    ];

    const patientActions = [
        { label: 'View My History', icon: Clock, tab: 'consultation-history', color: '#0d9488' },
        { label: 'Check Reports', icon: FileText, tab: 'reports', color: '#a855f7' },
        { label: 'Message Doctor', icon: Users, tab: 'messages', color: '#3b82f6' },
    ];

    const actions = userRole === 'patient' ? patientActions : doctorActions;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.5px' }}>
                    {userRole === 'patient' ? (t('patient_portal') || 'Patient Portal') : t('dashboard')}
                </h2>
                <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '14px' }}>
                    {t('welcome')} {userRole === 'patient' ? 'Ravi' : settings.doctorName}! Here's your overview.
                </p>
            </div>

            {/* Stat Cards */}
            <div className="stagger-fade" style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px', marginBottom: '32px',
            }}>
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="med-card" style={{
                            background: 'var(--bg-secondary)', borderRadius: '16px',
                            border: `1px solid ${stat.border}`,
                            padding: '24px', display: 'flex', alignItems: 'center', gap: '16px',
                            cursor: 'default',
                        }}>
                            <div style={{
                                width: '52px', height: '52px', borderRadius: '14px',
                                background: stat.bg, display: 'flex', alignItems: 'center',
                                justifyContent: 'center', flexShrink: 0,
                            }}>
                                <Icon size={24} color={stat.color} />
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '500', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {stat.title}
                                </p>
                                <p style={{
                                    fontSize: '28px',
                                    fontWeight: '700', color: (stat.value === 'Online' || stat.title === 'Health Score') ? stat.color : 'var(--text-primary)',
                                    margin: '4px 0 0 0',
                                }}>
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions + Wellness + Insights */}
            <div className="stagger-fade" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Left Column: Quick Actions & Recent Activity */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="med-card" style={{
                        background: 'var(--bg-secondary)', borderRadius: '16px',
                        border: '1px solid var(--border-color)', padding: '24px',
                    }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 20px 0' }}>
                            ⚡ {userRole === 'patient' ? (t('patient_actions') || 'Patient Actions') : t('quick_actions')}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {actions.map((action, i) => {
                                const Icon = action.icon;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => setActiveTab(action.tab)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '12px',
                                            padding: '14px 16px', borderRadius: '12px',
                                            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)',
                                            color: 'var(--text-primary)', cursor: 'pointer',
                                            transition: 'all 0.2s', textAlign: 'left', width: '100%',
                                        }}
                                    >
                                        <Icon size={18} color={action.color} />
                                        <span style={{ flex: 1, fontSize: '13.5px', fontWeight: '500' }}>{action.label}</span>
                                        <ArrowRight size={16} style={{ opacity: 0.3 }} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="med-card" style={{
                        background: 'var(--bg-secondary)', borderRadius: '16px',
                        border: '1px solid var(--border-color)', padding: '24px',
                    }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 20px 0' }}>
                            🕐 {t('recent_activity')}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {historyData.length > 0 ? historyData.slice(0, 3).map((row, i) => (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    padding: '12px', borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)',
                                }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: row.status === 'Approved' ? '#22c55e' : '#eab308', flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)', margin: 0 }}>{row.diagnosis || 'Consultation'}</p>
                                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>{row.date}</p>
                                    </div>
                                    <span style={{ fontSize: '10px', fontWeight: '600', padding: '3px 8px', borderRadius: '6px', background: row.status === 'Approved' ? 'rgba(34,197,94,0.1)' : 'rgba(234,179,8,0.1)', color: row.status === 'Approved' ? '#22c55e' : '#eab308' }}>{row.status}</span>
                                </div>
                            )) : (
                                <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '10px' }}>No recent activity.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: AI Wellness & Intelligence */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="med-glass" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '12px',
                                background: aiInsights?.burnoutStats?.cumulativeStress === 'High' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Zap size={22} color={aiInsights?.burnoutStats?.cumulativeStress === 'High' ? '#ef4444' : '#10b981'} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '15px', fontWeight: '800', margin: 0 }}>Physician Wellness</h3>
                                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Real-time burnout detection</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Status</span>
                                    <span style={{ fontWeight: '700', color: aiInsights?.burnoutStats?.cumulativeStress === 'High' ? '#ef4444' : '#10b981' }}>
                                        {aiInsights?.burnoutStats?.cumulativeStress === 'High' ? 'High Burnout Risk' : 'Healthy Workload'}
                                    </span>
                                </div>
                                <div style={{ height: '8px', width: '100%', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%',
                                        width: aiInsights?.burnoutStats?.cumulativeStress === 'High' ? '85%' : '35%',
                                        background: aiInsights?.burnoutStats?.cumulativeStress === 'High' ? 'linear-gradient(90deg, #ef4444, #f59e0b)' : 'linear-gradient(90deg, #10b981, #3b82f6)',
                                        transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)'
                                    }} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div style={{ padding: '15px', borderRadius: '16px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                                    <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '5px' }}>Consultations</span>
                                    <span style={{ fontSize: '24px', fontWeight: '800' }}>{aiInsights?.burnoutStats?.consultationsToday || 0}</span>
                                </div>
                                <div style={{ padding: '15px', borderRadius: '16px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                                    <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '5px' }}>Break Reminder</span>
                                    <span style={{ fontSize: '11px', fontWeight: '700', color: aiInsights?.burnoutStats?.cumulativeStress === 'High' ? '#ef4444' : '#0d9488' }}>
                                        {aiInsights?.burnoutStats?.cumulativeStress === 'High' ? 'Take Break Now' : 'Optimal'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="med-glass" style={{ padding: '24px', flex: 1 }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Brain size={20} color="#8b5cf6" /> AI Clinical Intelligence
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {aiInsights?.timeline?.slice(0, 3).map((item, i) => (
                                <div key={i} style={{ padding: '12px', borderRadius: '12px', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border-color)' }}>
                                    <span style={{ display: 'block', fontSize: '9px', color: '#8b5cf6', fontWeight: '700', textTransform: 'uppercase' }}>{item.date} — Intelligence Hub</span>
                                    <p style={{ fontSize: '12px', margin: '4px 0 0', fontWeight: '500' }}>{item.event} detected in conversation</p>
                                </div>
                            )) || <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Analyzing clinical flows...</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
