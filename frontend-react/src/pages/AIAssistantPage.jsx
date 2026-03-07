import React, { useState, useRef, useEffect } from 'react';
import { useConsultation } from '../context/ConsultationContext';
import { Bot, Mic, Send, MicOff, ClipboardList, Pill, Users, FileText, Zap, Volume2 } from 'lucide-react';

const quickCommands = [
    { label: 'Generate SOAP Note', icon: ClipboardList, command: 'Generate SOAP note for the current consultation', color: '#0d9488' },
    { label: 'Create Prescription', icon: Pill, command: 'Create a prescription for the current patient', color: '#a855f7' },
    { label: 'Show Patient History', icon: Users, command: 'Show the patient history for the current consultation', color: '#3b82f6' },
    { label: 'Summarize for Patient', icon: FileText, command: 'Create a patient-friendly summary of the diagnosis', color: '#f59e0b' },
];

const aiResponses = {
    'soap': `**SOAP Note Generated** ✅

**Subjective:** Patient reports persistent headache for 3 days, rated 6/10, worse in the morning. Associated with mild nausea. No history of head trauma.

**Objective:** BP 130/85 mmHg, HR 78 bpm, Temp 98.4°F. Neurological exam within normal limits. No papilledema.

**Assessment:** Tension-type headache (ICD: 8A81). Rule out secondary causes if persistent.

**Plan:** Paracetamol 500mg PRN, stress management counseling, follow-up in 1 week if no improvement. Consider CT head if symptoms worsen.`,

    'prescription': `**Prescription Generated** 💊

1. **Paracetamol 500mg** — Twice daily after food — 5 days
2. **Cetirizine 10mg** — Once daily at bedtime — 3 days
3. **Pantoprazole 40mg** — Once daily before breakfast — 7 days

⚠️ Drug interaction check: No significant interactions found.
📋 Ready to print.`,

    'history': `**Patient History Retrieved** 📋

**Patient:** Current consultation record
**Total Visits:** 3 recorded visits

| Date | Diagnosis | Medications |
|------|-----------|------------|
| Mar 7, 2026 | Tension Headache | Paracetamol 500mg |
| Feb 20, 2026 | URTI | Cetirizine, Paracetamol |
| Jan 15, 2026 | Routine Checkup | None |

🔍 No chronic conditions flagged.`,

    'summary': `**Patient Summary** 👨‍⚕️

*In simple words for the patient:*

"You have a common tension headache, likely caused by stress or poor sleep. It's not serious, but we want to make sure it goes away. I'm giving you a pain reliever to take twice a day with food. If the headache doesn't get better in a week, please come back so we can run some more tests."

✅ Reading Level: Grade 5.2 (PASS)`,

    'default': `I can help you with clinical tasks! Try these commands:
• "Generate SOAP note"
• "Create prescription"
• "Show patient history"
• "Summarize for patient"

Or ask me anything about the current consultation.`,
};

function getAIResponse(input) {
    const lower = input.toLowerCase();
    if (lower.includes('soap') || lower.includes('note')) return aiResponses.soap;
    if (lower.includes('prescription') || lower.includes('medicine') || lower.includes('drug')) return aiResponses.prescription;
    if (lower.includes('history') || lower.includes('patient') || lower.includes('record')) return aiResponses.history;
    if (lower.includes('summary') || lower.includes('explain') || lower.includes('simple')) return aiResponses.summary;
    return aiResponses.default;
}

export default function AIAssistantPage({ setActiveTab }) {
    const { consultData } = useConsultation();
    const [messages, setMessages] = useState([
        { role: 'assistant', content: '👋 Hello Doctor! I\'m your AI clinical assistant. I can help you generate SOAP notes, create prescriptions, retrieve patient history, and more. How can I assist you today?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsListening(false);
            };
            recognition.onerror = () => setIsListening(false);
            recognition.onend = () => setIsListening(false);
            recognitionRef.current = recognition;
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (text) => {
        const msg = text || input;
        if (!msg.trim()) return;

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages(prev => [...prev, { role: 'user', content: msg, time }]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const response = getAIResponse(msg);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: response,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }]);
            setIsTyping(false);
        }, 1200);
    };

    const toggleVoice = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            try {
                recognitionRef.current?.start();
                setIsListening(true);
            } catch (e) {
                console.error('Voice recognition error', e);
            }
        }
    };

    const handleSpeak = (text) => {
        const clean = text.replace(/[*#|_`]/g, '').replace(/\n/g, '. ');
        const utterance = new SpeechSynthesisUtterance(clean);
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ marginBottom: '20px', flexShrink: 0 }}>
                <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: 0, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Bot size={28} color="#06b6d4" /> AI Assistant
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '4px', fontSize: '14px' }}>
                    Voice-powered clinical assistant for doctors
                </p>
            </div>

            {/* Quick Commands */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px', flexShrink: 0 }}>
                {quickCommands.map((cmd, i) => {
                    const Icon = cmd.icon;
                    return (
                        <button key={i} onClick={() => handleSend(cmd.command)} style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '12px 14px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                            background: '#161b22', color: 'rgba(255,255,255,0.7)',
                            fontSize: '12px', fontWeight: '600', textAlign: 'left',
                            transition: 'all 0.2s',
                            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
                        }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = `${cmd.color}15`; e.currentTarget.style.boxShadow = `inset 0 0 0 1px ${cmd.color}40`; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = '#161b22'; e.currentTarget.style.boxShadow = 'inset 0 0 0 1px rgba(255,255,255,0.06)'; }}
                        >
                            <Icon size={16} color={cmd.color} />
                            <span>{cmd.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Chat Messages */}
            <div style={{
                flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px',
                padding: '20px', borderRadius: '16px',
                background: '#161b22', border: '1px solid rgba(255,255,255,0.06)',
                marginBottom: '16px',
            }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '80%',
                    }}>
                        <div style={{
                            padding: '14px 18px', borderRadius: '16px',
                            background: msg.role === 'user'
                                ? 'linear-gradient(135deg, rgba(13,148,136,0.25), rgba(6,182,212,0.15))'
                                : 'rgba(255,255,255,0.03)',
                            border: msg.role === 'user'
                                ? '1px solid rgba(13,148,136,0.3)'
                                : '1px solid rgba(255,255,255,0.06)',
                            borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                            borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '16px',
                        }}>
                            <p style={{
                                fontSize: '13.5px', color: '#e6edf3', margin: 0, lineHeight: '1.7',
                                whiteSpace: 'pre-wrap',
                            }}>
                                {msg.content}
                            </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>{msg.time}</span>
                            {msg.role === 'assistant' && (
                                <button onClick={() => handleSpeak(msg.content)} style={{
                                    background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.2)',
                                    padding: '2px', display: 'flex',
                                }}>
                                    <Volume2 size={12} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div style={{ alignSelf: 'flex-start', padding: '14px 18px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {[0, 1, 2].map(i => (
                                <div key={i} style={{
                                    width: '8px', height: '8px', borderRadius: '50%', background: '#0d9488',
                                    animation: `pulse 1.4s ${i * 0.2}s infinite`,
                                    opacity: 0.4,
                                }} />
                            ))}
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{
                display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0,
                padding: '14px 16px', borderRadius: '14px',
                background: '#161b22', border: '1px solid rgba(255,255,255,0.08)',
            }}>
                <button onClick={toggleVoice} style={{
                    width: '42px', height: '42px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                    background: isListening ? 'rgba(239,68,68,0.2)' : 'rgba(13,148,136,0.15)',
                    color: isListening ? '#ef4444' : '#0d9488',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s', flexShrink: 0,
                    animation: isListening ? 'pulse 1.5s infinite' : 'none',
                }}>
                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={isListening ? 'Listening...' : 'Type a command or ask a question...'}
                    style={{
                        flex: 1, padding: '12px 0', background: 'transparent', border: 'none',
                        color: '#fff', fontSize: '14px', outline: 'none',
                    }}
                />
                <button onClick={() => handleSend()} disabled={!input.trim()} style={{
                    width: '42px', height: '42px', borderRadius: '50%', border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                    background: input.trim() ? 'linear-gradient(135deg, #0d9488, #06b6d4)' : 'rgba(255,255,255,0.05)',
                    color: input.trim() ? '#fff' : 'rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s', flexShrink: 0,
                }}>
                    <Send size={18} />
                </button>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.4; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.1); }
                }
            `}</style>
        </div>
    );
}
