import React, { useState, useRef, useEffect } from 'react';
import { useConsultation } from '../context/ConsultationContext';
import { Bot, Mic, Send, MicOff, ClipboardList, Pill, Users, FileText, Zap, Volume2, AlertTriangle, Activity, Brain, Clock } from 'lucide-react';

export default function AIAssistantPage({ setActiveTab }) {
    const { consultData, aiInsights, t } = useConsultation();
    const [messages, setMessages] = useState([
        { role: 'assistant', content: '👋 Hello Doctor! I\'m analyzing the current consultation. I\'ve found some clinical insights and risk factors you might want to review.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
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
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Based on your query "${msg}", I recommend focusing on the identified respiratory risk factors. I've listed some clinical suggestions in the Intelligence panel.`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }]);
            setIsTyping(false);
        }, 1000);
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

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', height: 'calc(100vh - 100px)' }}>
            {/* Left: Chat & Action Hub */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bot size={24} color="#06b6d4" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>Clinical AI Intel</h2>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Real-time diagnostic support & automation</p>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="med-glass" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', gap: '15px' }}>
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                                <div style={{
                                    padding: '12px 16px',
                                    borderRadius: '16px',
                                    background: msg.role === 'user' ? 'rgba(13, 148, 136, 0.1)' : 'var(--bg-primary)',
                                    border: '1px solid var(--border-color)',
                                    borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '16px',
                                    borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                                }}>
                                    <p style={{ margin: 0, fontSize: '13.5px', lineHeight: '1.6' }}>{msg.content}</p>
                                </div>
                                <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>{msg.time}</span>
                            </div>
                        ))}
                        {isTyping && <div className="typing-dot" style={{ opacity: 0.5, fontSize: '12px' }}>AI is analyzing...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    <div style={{ position: 'relative', display: 'flex', gap: '10px' }}>
                        <button onClick={toggleVoice} style={{
                            width: '44px', height: '44px', borderRadius: '12px', border: 'none',
                            background: isListening ? 'rgba(239, 68, 68, 0.1)' : 'rgba(13, 148, 136, 0.1)',
                            color: isListening ? '#ef4444' : '#0d9488', cursor: 'pointer'
                        }}>
                            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                        </button>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask or command..."
                            style={{ flex: 1, padding: '0 20px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                        />
                        <button onClick={() => handleSend()} style={{
                            padding: '0 20px', borderRadius: '12px', border: 'none', background: '#0d9488', color: '#fff', cursor: 'pointer'
                        }}>Send</button>
                    </div>
                </div>

                {/* Question Suggestion Grid */}
                <div>
                    <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Zap size={16} color="#f59e0b" /> Suggested Diagnostic Questions
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        {aiInsights.suggestedQuestions.map((q, i) => (
                            <button key={i} onClick={() => handleSend(q)} className="med-card" style={{
                                padding: '12px 15px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                                textAlign: 'left', cursor: 'pointer', fontSize: '12px', fontWeight: '500', color: 'var(--text-primary)'
                            }}>
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: AI Clinical Insights Side-Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Risk Predictor */}
                <div className="med-glass" style={{ padding: '18px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0d9488' }}>
                        <Activity size={16} /> Disease Risk Predictor
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {aiInsights.riskPrediction.map((risk, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px' }}>
                                    <span>{risk.disease}</span>
                                    <span style={{ color: risk.risk === 'High' ? '#ef4444' : risk.risk === 'Medium' ? '#f59e0b' : '#10b981', fontWeight: '700' }}>{risk.risk} Risk</span>
                                </div>
                                <div style={{ height: '6px', width: '100%', background: 'rgba(0,0,0,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%',
                                        width: risk.risk === 'High' ? '85%' : risk.risk === 'Medium' ? '50%' : '20%',
                                        background: risk.risk === 'High' ? '#ef4444' : risk.risk === 'Medium' ? '#f59e0b' : '#10b981'
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Missed Symptom Detector */}
                <div className="med-glass" style={{ padding: '18px', borderLeft: '4px solid #ef4444' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444' }}>
                        <AlertTriangle size={16} /> Possible Missed Symptoms
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {aiInsights.missedSymptoms.map((s, i) => (
                            <div key={i} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', fontSize: '11px', fontWeight: '600', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                • {s}
                            </div>
                        ))}
                        {aiInsights.missedSymptoms.length === 0 && <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No missing symptoms detected.</p>}
                    </div>
                </div>

                {/* Conversation Summary Insights */}
                <div className="med-glass" style={{ padding: '18px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Brain size={16} color="#8b5cf6" /> Clinical Intelligence
                    </h3>
                    <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <li style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Patient mentioned dizziness</li>
                        <li style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Patient reported fatigue</li>
                        <li style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Possible symptom cluster detected</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
