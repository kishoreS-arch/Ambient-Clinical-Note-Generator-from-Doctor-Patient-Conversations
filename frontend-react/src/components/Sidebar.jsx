import React, { useState } from 'react';
import {
    LayoutDashboard, Mic, FileText, ClipboardList, Pill,
    FlaskConical, UserRound, Users, BarChart3, Bell,
    Bot, Settings, LogOut, ChevronLeft, ChevronRight, Activity,
    Menu, X, History, FileDown, MessageSquare, User
} from 'lucide-react';

const doctorNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-consultation', label: 'New Consultation', icon: Mic, emoji: '🎙' },
    { id: 'transcript', label: 'Transcript', icon: FileText, emoji: '📝' },
    { id: 'soap-notes', label: 'SOAP Notes', icon: ClipboardList, emoji: '📄' },
    { id: 'prescription', label: 'Prescription', icon: Pill, emoji: '💊' },
    { id: 'drug-interactions', label: 'Drug Interactions', icon: FlaskConical, emoji: '🧪' },
    { id: 'patient-records', label: 'Patient Records', icon: Users, emoji: '👥' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, emoji: '📊' },
    { id: 'reminders', label: 'Reminders', icon: Bell, emoji: '⏰' },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, emoji: '🤖' },
    { id: 'settings', label: 'Settings', icon: Settings, emoji: '⚙️' },
];

const patientNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'consultation-history', label: 'Consultation History', icon: History, emoji: '📜' },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill, emoji: '💊' },
    { id: 'patient-summary', label: 'Patient Summary', icon: UserRound, emoji: '👨‍⚕️' },
    { id: 'reports', label: 'Reports', icon: FileDown, emoji: '📄' },
    { id: 'reminders', label: 'Reminders', icon: Bell, emoji: '⏰' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, emoji: '💬' },
    { id: 'profile', label: 'Profile', icon: User, emoji: '👤' },
];

export default function Sidebar({ activeTab, setActiveTab, onLogout, userRole }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems = userRole === 'patient' ? patientNav : doctorNav;

    const handleNavClick = (id) => {
        setActiveTab(id);
        setMobileOpen(false); // Close on mobile after selection
    };

    return (
        <>
            {/* Mobile Hamburger Button */}
            <button
                className="mobile-menu-btn"
                onClick={() => setMobileOpen(!mobileOpen)}
                style={{
                    position: 'fixed', top: '14px', left: '14px', zIndex: 1001,
                    width: '44px', height: '44px', borderRadius: '12px', border: 'none',
                    background: 'linear-gradient(135deg, #0d9488, #06b6d4)',
                    color: '#fff', cursor: 'pointer',
                    display: 'none', // shown via CSS media query
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
                        zIndex: 999, display: 'none', // shown via CSS
                    }}
                />
            )}

            {/* Sidebar */}
            <div
                className={`sidebar-root ${mobileOpen ? 'sidebar-mobile-open' : ''}`}
                style={{
                    width: collapsed ? '80px' : '260px',
                    minWidth: collapsed ? '80px' : '260px',
                    background: 'linear-gradient(180deg, #0f1923 0%, #0a1628 50%, #0d1117 100%)',
                    borderRight: '1px solid rgba(13, 148, 136, 0.15)',
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
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                }}>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, #0d9488, #06b6d4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(13, 148, 136, 0.4)',
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
                            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', margin: 0, letterSpacing: '1px', textTransform: 'uppercase' }}>
                                Medical Assistant
                            </p>
                        </div>
                    )}
                </div>

                {/* Collapse Toggle (hidden on mobile) */}
                <button
                    className="collapse-toggle-btn"
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        position: 'absolute', top: '28px', right: '-14px',
                        width: '28px', height: '28px', borderRadius: '50%',
                        background: '#161b22', border: '1px solid rgba(13, 148, 136, 0.3)',
                        color: '#0d9488', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 10, transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { e.target.style.background = '#0d9488'; e.target.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.target.style.background = '#161b22'; e.target.style.color = '#0d9488'; }}
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
                    {navItems.map((item) => {
                        const isActive = activeTab === item.id;
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
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
                                    transition: 'all 0.2s ease',
                                    justifyContent: collapsed ? 'center' : 'flex-start',
                                    background: isActive
                                        ? 'linear-gradient(135deg, rgba(13,148,136,0.25), rgba(6,182,212,0.15))'
                                        : 'transparent',
                                    color: isActive ? '#5eead4' : 'rgba(255,255,255,0.5)',
                                    boxShadow: isActive ? 'inset 0 0 0 1px rgba(13,148,136,0.3), 0 2px 8px rgba(13,148,136,0.1)' : 'none',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                        e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                                    }
                                }}
                            >
                                {isActive && (
                                    <div style={{
                                        position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                                        width: '3px', height: '60%', borderRadius: '0 4px 4px 0',
                                        background: 'linear-gradient(180deg, #0d9488, #06b6d4)',
                                    }} />
                                )}
                                <Icon size={20} style={{ flexShrink: 0 }} />
                                {!collapsed && (
                                    <span style={{
                                        fontSize: '13.5px',
                                        fontWeight: isActive ? '600' : '400',
                                        whiteSpace: 'nowrap',
                                        letterSpacing: '-0.1px',
                                        flex: 1,
                                        textAlign: 'left',
                                    }}>
                                        {item.label}
                                    </span>
                                )}
                                {!collapsed && item.emoji && (
                                    <span style={{ fontSize: '14px', opacity: 0.7 }}>{item.emoji}</span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div style={{
                    padding: '16px 10px',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                }}>
                    <button
                        onClick={() => { onLogout(); setMobileOpen(false); }}
                        style={{
                            width: '100%',
                            display: 'flex', alignItems: 'center', gap: '12px',
                            padding: collapsed ? '12px' : '11px 16px',
                            borderRadius: '10px', border: 'none', cursor: 'pointer',
                            background: 'rgba(239, 68, 68, 0.08)',
                            color: 'rgba(239, 68, 68, 0.7)',
                            transition: 'all 0.2s',
                            justifyContent: collapsed ? 'center' : 'flex-start',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                            e.currentTarget.style.color = '#ef4444';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                            e.currentTarget.style.color = 'rgba(239, 68, 68, 0.7)';
                        }}
                    >
                        <LogOut size={20} />
                        {!collapsed && <span style={{ fontSize: '13.5px', fontWeight: '500' }}>Logout</span>}
                    </button>
                </div>
            </div>
        </>
    );
}
