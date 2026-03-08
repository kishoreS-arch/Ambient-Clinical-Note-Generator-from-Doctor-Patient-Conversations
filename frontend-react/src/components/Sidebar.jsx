import React, { useState } from 'react';
import {
    LayoutDashboard, Mic, FileText, ClipboardList, Pill,
    FlaskConical, UserRound, Users, BarChart3, Bell,
    Bot, LogOut, ChevronLeft, ChevronRight, Activity,
    Menu, X, History, FileDown, MessageSquare, User, Settings as SettingsIcon
} from 'lucide-react';
import { useConsultation } from '../context/ConsultationContext';

export default function Sidebar({ activeTab, setActiveTab, onLogout, userRole }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { t } = useConsultation();

    const doctorNav = [
        { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
        { id: 'new-consultation', label: t('new_consultation'), icon: Mic },
        { id: 'transcript', label: t('transcript'), icon: FileText },
        { id: 'soap-notes', label: t('soap_notes'), icon: ClipboardList },
        { id: 'prescription', label: t('prescription'), icon: Pill },
        { id: 'drug-interactions', label: t('drug_interactions'), icon: FlaskConical },
        { id: 'patient-records', label: t('patient_records'), icon: Users },
        { id: 'analytics', label: t('analytics'), icon: BarChart3 },
        { id: 'reminders', label: t('reminders'), icon: Bell },
        { id: 'ai-assistant', label: t('ai_assistant'), icon: Bot },
        { id: 'settings', label: t('settings'), icon: SettingsIcon },
    ];

    const patientNav = [
        { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
        { id: 'consultation-history', label: t('consultation_history'), icon: History },
        { id: 'prescriptions', label: t('prescription'), icon: Pill },
        { id: 'patient-summary', label: t('reports'), icon: UserRound },
        { id: 'reports', label: t('reports'), icon: FileDown },
        { id: 'reminders', label: t('reminders'), icon: Bell },
        { id: 'messages', label: t('messages'), icon: MessageSquare },
        { id: 'profile', label: t('profile'), icon: User },
    ];

    const navItems = userRole === 'patient' ? patientNav : doctorNav;

    const handleNavClick = (id) => {
        setActiveTab(id);
        setMobileOpen(false);
    };

    return (
        <>
            {/* Mobile Hamburger */}
            <button
                className="mobile-menu-btn"
                onClick={() => setMobileOpen(!mobileOpen)}
                style={{
                    position: 'fixed', top: '14px', left: '14px', zIndex: 1001,
                    width: '44px', height: '44px', borderRadius: '12px', border: 'none',
                    background: 'linear-gradient(135deg, #0d9488, #06b6d4)',
                    color: '#fff', cursor: 'pointer',
                    display: 'none',
                    alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(13,148,136,0.4)',
                    transition: 'all 0.2s',
                }}
            >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="mobile-overlay"
                    onClick={() => setMobileOpen(false)}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                        zIndex: 999, display: 'none',
                    }}
                />
            )}

            {/* Sidebar */}
            <div
                className={`sidebar-root ${mobileOpen ? 'sidebar-mobile-open' : ''}`}
                style={{
                    width: collapsed ? '80px' : '260px',
                    minWidth: collapsed ? '80px' : '260px',
                    background: 'linear-gradient(180deg, #0a1628 0%, #060d19 50%, #040a14 100%)',
                    borderRight: '1px solid rgba(13, 148, 136, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    height: '100%',
                }}
            >
                {/* Brand Header */}
                <div style={{
                    padding: collapsed ? '20px 12px' : '24px 20px',
                    borderBottom: '1px solid rgba(13, 148, 136, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                }}>
                    <div className="sidebar-brand-icon" style={{
                        width: '40px', height: '40px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, #0d9488, #06b6d4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(13,148,136,0.4)',
                        flexShrink: 0,
                    }}>
                        <Activity size={22} color="#fff" />
                    </div>
                    {!collapsed && (
                        <div>
                            <h1 style={{
                                fontSize: '18px', fontWeight: '800', color: '#fff',
                                letterSpacing: '-0.5px', lineHeight: '1.2', margin: 0,
                            }}>
                                ClinNote <span style={{ color: '#0d9488' }}>AI</span>
                            </h1>
                            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', margin: 0, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                                Medical Assistant
                            </p>
                        </div>
                    )}
                </div>

                {/* Collapse Toggle */}
                <button
                    className="collapse-toggle-btn"
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        position: 'absolute', top: '28px', right: '-14px',
                        width: '28px', height: '28px', borderRadius: '50%',
                        background: '#0a1628', border: '1px solid rgba(13, 148, 136, 0.2)',
                        color: '#0d9488', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 10, transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { e.target.style.background = '#0d9488'; e.target.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.target.style.background = '#0a1628'; e.target.style.color = '#0d9488'; }}
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                {/* Navigation */}
                <nav style={{
                    flex: 1, overflowY: 'auto', overflowX: 'hidden',
                    padding: '12px 10px',
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(13,148,136,0.2) transparent',
                }}>
                    {navItems.map((item, index) => {
                        const isActive = activeTab === item.id;
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                                onClick={() => handleNavClick(item.id)}
                                title={collapsed ? item.label : ''}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: collapsed ? '12px' : '11px 16px',
                                    marginBottom: '3px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    justifyContent: collapsed ? 'center' : 'flex-start',
                                    background: isActive
                                        ? 'linear-gradient(135deg, rgba(13,148,136,0.2), rgba(6,182,212,0.1))'
                                        : 'transparent',
                                    color: isActive ? '#5eead4' : 'rgba(255,255,255,0.45)',
                                    boxShadow: isActive ? 'inset 0 0 0 1px rgba(13,148,136,0.2), 0 2px 8px rgba(13,148,136,0.08)' : 'none',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                    animation: `staggerItem 0.4s ease ${0.03 * index}s both`,
                                    opacity: 0,
                                }}
                            >
                                {isActive && (
                                    <div style={{
                                        position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                                        width: '3px', height: '60%', borderRadius: '0 4px 4px 0',
                                        background: 'linear-gradient(180deg, #0d9488, #06b6d4)',
                                        boxShadow: '0 0 8px rgba(13,148,136,0.4)',
                                    }} />
                                )}
                                <Icon size={19} style={{ flexShrink: 0 }} />
                                {!collapsed && (
                                    <span style={{
                                        fontSize: '13px',
                                        fontWeight: isActive ? '600' : '400',
                                        whiteSpace: 'nowrap',
                                        letterSpacing: '-0.1px',
                                        flex: 1,
                                        textAlign: 'left',
                                    }}>
                                        {item.label}
                                    </span>
                                )}
                                {!collapsed && isActive && (
                                    <span className="heartbeat-dot" style={{
                                        flexShrink: 0,
                                        width: '6px', height: '6px',
                                    }} />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div style={{
                    padding: '16px 10px',
                    borderTop: '1px solid rgba(13, 148, 136, 0.08)',
                }}>
                    <button
                        onClick={() => { onLogout(); setMobileOpen(false); }}
                        style={{
                            width: '100%',
                            display: 'flex', alignItems: 'center', gap: '12px',
                            padding: collapsed ? '12px' : '11px 16px',
                            borderRadius: '10px', border: 'none', cursor: 'pointer',
                            background: 'rgba(239, 68, 68, 0.06)',
                            color: 'rgba(239, 68, 68, 0.6)',
                            transition: 'all 0.25s',
                            justifyContent: collapsed ? 'center' : 'flex-start',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
                            e.currentTarget.style.color = '#ef4444';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.06)';
                            e.currentTarget.style.color = 'rgba(239, 68, 68, 0.6)';
                        }}
                    >
                        <LogOut size={19} />
                        {!collapsed && <span style={{ fontSize: '13px', fontWeight: '500' }}>{t('logout')}</span>}
                    </button>
                </div>
            </div>
        </>
    );
}
