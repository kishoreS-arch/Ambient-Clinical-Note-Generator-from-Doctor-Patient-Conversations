import React from 'react';
import { useConsultation } from '../context/ConsultationContext';
import { Activity, Users, FileText, Cpu, TrendingUp, Clock, Mic, ArrowRight } from 'lucide-react';

export default function DashboardPage({ setActiveTab, userRole }) {
    const { analyticsData, historyData, settings } = useConsultation();

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
                    {userRole === 'patient' ? 'Patient Portal' : 'Doctor Dashboard'}
                </h2>
                <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '14px' }}>
                    Welcome back, {userRole === 'patient' ? 'Ravi' : settings.doctorName}! Here's your overview.
                </p>
            </div>

            {/* Stat Cards */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px', marginBottom: '32px',
            }}>
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} style={{
                            background: 'var(--bg-secondary)', borderRadius: '16px',
                            border: `1px solid ${stat.border}`,
                            padding: '24px', display: 'flex', alignItems: 'center', gap: '16px',
                            transition: 'all 0.3s', cursor: 'default',
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

            {/* Quick Actions + Recent Activity */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
                {/* Quick Actions */}
                <div style={{
                    background: 'var(--bg-secondary)', borderRadius: '16px',
                    border: '1px solid var(--border-color)', padding: '24px',
                }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 20px 0' }}>
                        ⚡ {userRole === 'patient' ? 'Patient Actions' : 'Clinical Actions'}
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
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                                        e.currentTarget.style.borderColor = `${action.color}40`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                        e.currentTarget.style.borderColor = 'var(--border-color)';
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

                {/* Recent Activity */}
                <div style={{
                    background: 'var(--bg-secondary)', borderRadius: '16px',
                    border: '1px solid var(--border-color)', padding: '24px',
                }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 20px 0' }}>
                        🕐 {userRole === 'patient' ? 'Your Recent Activity' : 'Recent Consultations'}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {historyData.length > 0 ? historyData.slice(0, 5).map((row, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: '12px',
                                padding: '12px', borderRadius: '10px',
                                background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)',
                            }}>
                                <div style={{
                                    width: '8px', height: '8px', borderRadius: '50%',
                                    background: row.status === 'Approved' ? '#22c55e' : '#eab308',
                                    flexShrink: 0,
                                }} />
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)', margin: 0 }}>
                                        {row.diagnosis || 'Consultation'}
                                    </p>
                                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                                        {row.date} · {userRole === 'doctor' ? `ID: ${row.id}` : `Visit ID: ${row.id}`}
                                    </p>
                                </div>
                                <span style={{
                                    fontSize: '10px', fontWeight: '600', padding: '3px 8px', borderRadius: '6px',
                                    background: row.status === 'Approved' ? 'rgba(34,197,94,0.1)' : 'rgba(234,179,8,0.1)',
                                    color: row.status === 'Approved' ? '#22c55e' : '#eab308',
                                }}>
                                    {row.status}
                                </span>
                            </div>
                        )) : (
                            <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                                No recent activity found.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
