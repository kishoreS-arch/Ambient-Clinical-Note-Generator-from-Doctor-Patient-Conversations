import React from 'react';
import { User, Mail, Phone, MapPin, Shield } from 'lucide-react';

export default function ProfilePage() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '32px' }}>Personal Profile</h2>

            <div style={{ background: 'var(--bg-secondary)', borderRadius: '24px', padding: '40px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '30px', background: 'linear-gradient(135deg, #0d9488, #06b6d4)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', color: '#fff' }}>
                    P
                </div>
                <h3 style={{ fontSize: '24px', margin: '0 0 8px 0' }}>Patient Ravi</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '0 0 32px 0' }}>Patient ID: MED-2026-9912</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', textAlign: 'left' }}>
                    {[
                        { icon: Mail, label: 'Email', value: 'patient@clinic.com' },
                        { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
                        { icon: MapPin, label: 'Address', value: '123 Health Street, Chennai' },
                        { icon: Shield, label: 'Insurance', value: 'BlueCare Health' },
                    ].map((item, i) => (
                        <div key={i} style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                <item.icon size={14} /> {item.label}
                            </div>
                            <div style={{ fontWeight: '600', fontSize: '15px' }}>{item.value}</div>
                        </div>
                    ))}
                </div>

                <button style={{
                    marginTop: '32px', width: '100%', padding: '16px', borderRadius: '12px',
                    background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)',
                    cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s'
                }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                    Edit Profile Details
                </button>
            </div>
        </div>
    );
}
