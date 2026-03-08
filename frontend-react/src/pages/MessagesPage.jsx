import React, { useState } from 'react';
import { Send, User, Search } from 'lucide-react';

export default function MessagesPage() {
    const [msg, setMsg] = useState('');
    const messages = [
        { id: 1, sender: 'Doctor', text: 'How are you feeling after the new medication?', time: '10:30 AM' },
        { id: 2, sender: 'You', text: 'I feel much better, the headache is gone.', time: '11:15 AM' },
        { id: 3, sender: 'Doctor', text: 'Great. Please continue the tablets for 2 more days.', time: '11:20 AM' },
    ];

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', height: 'calc(100vh - 150px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Messages</h2>
                <p style={{ color: 'var(--text-muted)' }}>Direct channel to your clinical team.</p>
            </div>

            <div className="med-card" style={{
                flex: 1, background: 'var(--bg-secondary)', borderRadius: '20px',
                border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column',
                overflow: 'hidden'
            }}>
                {/* Chat Area */}
                <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {messages.map(m => (
                        <div key={m.id} style={{
                            alignSelf: m.sender === 'You' ? 'flex-end' : 'flex-start',
                            maxWidth: '70%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: m.sender === 'You' ? 'flex-end' : 'flex-start'
                        }}>
                            <div style={{
                                padding: '12px 16px', borderRadius: m.sender === 'You' ? '16px 16px 0 16px' : '16px 16px 16px 0',
                                background: m.sender === 'You' ? 'linear-gradient(135deg, #0d9488, #06b6d4)' : 'rgba(255,255,255,0.05)',
                                color: '#fff', fontSize: '14px', lineHeight: '1.5'
                            }}>
                                {m.text}
                            </div>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>{m.sender} • {m.time}</span>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div style={{ padding: '20px', borderTop: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)' }}>
                    <div style={{ position: 'relative', display: 'flex', gap: '12px' }}>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={msg}
                            onChange={e => setMsg(e.target.value)}
                            style={{
                                flex: 1, padding: '14px 20px', borderRadius: '12px',
                                background: 'var(--bg-primary)', border: '1px solid var(--border-color)',
                                color: '#fff', fontSize: '14px', outline: 'none'
                            }}
                        />
                        <button style={{
                            width: '48px', height: '48px', borderRadius: '12px',
                            background: 'linear-gradient(135deg, #0d9488, #06b6d4)',
                            border: 'none', color: '#fff', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
