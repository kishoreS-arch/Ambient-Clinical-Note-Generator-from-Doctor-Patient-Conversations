import React, { useState } from 'react';
import { useConsultation } from '../context/ConsultationContext';
import { Settings as SettingsIcon, User, Building2, Globe, Moon, Sun, Volume2, VolumeX, Save, CheckCircle } from 'lucide-react';

const languages = ['English', 'Tamil', 'Hindi', 'Telugu', 'Malayalam', 'Kannada', 'Bengali', 'Marathi'];

export default function SettingsPage() {
    const { settings, setSettings } = useConsultation();
    const [localSettings, setLocalSettings] = useState({ ...settings });
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSettings(localSettings);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const handleChange = (key, value) => {
        setLocalSettings(prev => ({ ...prev, [key]: value }));
        setSaved(false);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: 0, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <SettingsIcon size={28} color="#6b7280" /> Settings
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '4px', fontSize: '14px' }}>
                        Manage your profile and preferences
                    </p>
                </div>
                <button onClick={handleSave} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                    background: saved ? 'rgba(34,197,94,0.2)' : 'linear-gradient(135deg, #0d9488, #06b6d4)',
                    color: saved ? '#22c55e' : '#fff',
                    fontSize: '13px', fontWeight: '600', transition: 'all 0.3s',
                    boxShadow: saved ? 'none' : '0 4px 15px rgba(13,148,136,0.3)',
                }}>
                    {saved ? <><CheckCircle size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Doctor Profile Section */}
                <div style={{
                    background: '#161b22', borderRadius: '16px', padding: '28px',
                    border: '1px solid rgba(255,255,255,0.06)',
                }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#fff', margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <User size={18} color="#0d9488" /> Doctor Profile
                    </h3>

                    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '24px' }}>
                        {/* Avatar */}
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '20px',
                            background: 'linear-gradient(135deg, #0d9488, #06b6d4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '28px', fontWeight: '800', color: '#fff', flexShrink: 0,
                            boxShadow: '0 4px 20px rgba(13,148,136,0.3)',
                        }}>
                            {localSettings.doctorName?.charAt(4) || 'D'}
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
                                Doctor Name
                            </label>
                            <input
                                type="text"
                                value={localSettings.doctorName}
                                onChange={(e) => handleChange('doctorName', e.target.value)}
                                style={{
                                    width: '100%', padding: '14px 16px', borderRadius: '12px',
                                    background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)',
                                    color: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box',
                                    fontWeight: '500', transition: 'border-color 0.2s',
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'rgba(13,148,136,0.4)'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                            <Building2 size={14} /> Hospital Name
                        </label>
                        <input
                            type="text"
                            value={localSettings.hospitalName}
                            onChange={(e) => handleChange('hospitalName', e.target.value)}
                            style={{
                                width: '100%', padding: '14px 16px', borderRadius: '12px',
                                background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)',
                                color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                                transition: 'border-color 0.2s',
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'rgba(13,148,136,0.4)'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                        />
                    </div>
                </div>

                {/* Language */}
                <div style={{
                    background: '#161b22', borderRadius: '16px', padding: '28px',
                    border: '1px solid rgba(255,255,255,0.06)',
                }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#fff', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Globe size={18} color="#3b82f6" /> Language
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {languages.map(lang => (
                            <button
                                key={lang}
                                onClick={() => handleChange('language', lang)}
                                style={{
                                    padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                                    background: localSettings.language === lang ? 'rgba(13,148,136,0.2)' : 'rgba(255,255,255,0.03)',
                                    color: localSettings.language === lang ? '#5eead4' : 'rgba(255,255,255,0.5)',
                                    fontSize: '13px', fontWeight: localSettings.language === lang ? '600' : '400',
                                    boxShadow: localSettings.language === lang ? 'inset 0 0 0 1px rgba(13,148,136,0.4)' : 'inset 0 0 0 1px rgba(255,255,255,0.06)',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Toggles */}
                <div style={{
                    background: '#161b22', borderRadius: '16px', padding: '28px',
                    border: '1px solid rgba(255,255,255,0.06)',
                }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#fff', margin: '0 0 20px 0' }}>
                        Preferences
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Dark Mode Toggle */}
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '16px 18px', borderRadius: '12px',
                            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {localSettings.darkMode ? <Moon size={20} color="#a855f7" /> : <Sun size={20} color="#f59e0b" />}
                                <div>
                                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#fff', margin: 0 }}>Dark Mode</p>
                                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', margin: '2px 0 0 0' }}>Toggle between dark and light theme</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleChange('darkMode', !localSettings.darkMode)}
                                style={{
                                    width: '52px', height: '28px', borderRadius: '14px', border: 'none', cursor: 'pointer',
                                    background: localSettings.darkMode ? 'linear-gradient(135deg, #0d9488, #06b6d4)' : 'rgba(255,255,255,0.1)',
                                    position: 'relative', transition: 'background 0.3s',
                                }}
                            >
                                <div style={{
                                    width: '22px', height: '22px', borderRadius: '50%',
                                    background: '#fff', position: 'absolute', top: '3px',
                                    left: localSettings.darkMode ? '27px' : '3px',
                                    transition: 'left 0.3s',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                }} />
                            </button>
                        </div>

                        {/* AI Voice Toggle */}
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '16px 18px', borderRadius: '12px',
                            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {localSettings.aiVoice ? <Volume2 size={20} color="#0d9488" /> : <VolumeX size={20} color="#6b7280" />}
                                <div>
                                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#fff', margin: 0 }}>AI Voice</p>
                                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', margin: '2px 0 0 0' }}>Enable voice responses from AI assistant</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleChange('aiVoice', !localSettings.aiVoice)}
                                style={{
                                    width: '52px', height: '28px', borderRadius: '14px', border: 'none', cursor: 'pointer',
                                    background: localSettings.aiVoice ? 'linear-gradient(135deg, #0d9488, #06b6d4)' : 'rgba(255,255,255,0.1)',
                                    position: 'relative', transition: 'background 0.3s',
                                }}
                            >
                                <div style={{
                                    width: '22px', height: '22px', borderRadius: '50%',
                                    background: '#fff', position: 'absolute', top: '3px',
                                    left: localSettings.aiVoice ? '27px' : '3px',
                                    transition: 'left 0.3s',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                }} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* App Info */}
                <div style={{
                    background: '#161b22', borderRadius: '16px', padding: '24px',
                    border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center',
                }}>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: '#fff', margin: '0 0 4px 0' }}>
                        ClinNote <span style={{ color: '#0d9488' }}>AI</span>
                    </p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', margin: 0 }}>
                        Version 2.0.0 · Ambient Clinical Note Generator
                    </p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.15)', margin: '4px 0 0 0' }}>
                        Built with React + Vite + FastAPI
                    </p>
                </div>
            </div>
        </div>
    );
}
