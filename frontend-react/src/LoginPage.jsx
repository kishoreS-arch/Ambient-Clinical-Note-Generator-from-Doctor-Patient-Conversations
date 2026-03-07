import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mail, Lock, Activity, Mic, MicOff, ShieldAlert, Stethoscope, User } from 'lucide-react';
import Waveform from './components/Waveform';
import './LoginPage.css';

const AILoadingScreen = ({ onComplete, role }) => {
    const [loadingText, setLoadingText] = useState("Initializing AI Medical Assistant...");

    useEffect(() => {
        const sequence = role === 'doctor'
            ? [
                { text: "Loading clinical models...", time: 800 },
                { text: "Connecting to OpenFDA...", time: 1600 },
                { text: "Synchronizing Ambient Protocols...", time: 2400 },
                { text: "Ready", time: 3200 }
            ]
            : [
                { text: "Loading patient portal...", time: 800 },
                { text: "Syncing medical records...", time: 1600 },
                { text: "Preparing your dashboard...", time: 2400 },
                { text: "Ready", time: 3200 }
            ];

        const timers = sequence.map(({ text, time }) =>
            setTimeout(() => setLoadingText(text), time)
        );

        const finalTimer = setTimeout(() => {
            onComplete();
        }, 3800);

        return () => {
            timers.forEach(clearTimeout);
            clearTimeout(finalTimer);
        };
    }, [onComplete, role]);

    return (
        <div className="loading-screen">
            <div className="spinner"></div>
            <div className="loading-text">{loadingText}</div>
        </div>
    );
};

const credentials = {
    doctor: { email: 'doctor@clinic.com', password: 'med123' },
    patient: { email: 'patient@clinic.com', password: 'patient123' },
};

export default function LoginPage({ onLoginSuccess }) {
    const [role, setRole] = useState('doctor');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [voiceStatus, setVoiceStatus] = useState('');
    const [showLoading, setShowLoading] = useState(false);
    const recognitionRef = useRef(null);

    const roleColor = role === 'doctor' ? '#00E5FF' : '#22c55e';

    const handleLoginSuccess = useCallback(() => {
        setError('');
        setShowLoading(true);
    }, []);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.lang = 'en-US';
            recognition.maxAlternatives = 3;

            recognition.onresult = (event) => {
                const result = event.results[event.results.length - 1];
                const transcript = result[0].transcript.toLowerCase().trim();

                if (result.isFinal) {
                    if (transcript.includes("start") || transcript.includes("login") || transcript.includes("open")) {
                        setVoiceStatus('✅ Voice recognized!');
                        setTimeout(() => handleLoginSuccess(), 500);
                    } else {
                        setVoiceStatus('');
                        setError(`Heard: "${transcript}". Try saying "Start consultation" or "Login".`);
                        setIsListening(false);
                    }
                } else {
                    setVoiceStatus(`Hearing: "${transcript}"...`);
                }
            };

            recognition.onerror = () => {
                setIsListening(false);
                setVoiceStatus('');
            };

            recognition.onend = () => setIsListening(false);
            recognitionRef.current = recognition;
        }
    }, [handleLoginSuccess]);

    const handleLogin = (e) => {
        e.preventDefault();
        const creds = credentials[role];
        if (email === creds.email && password === creds.password) {
            handleLoginSuccess();
        } else {
            setError(`Invalid credentials. Try ${creds.email} / ${creds.password}`);
        }
    };

    const toggleVoiceLogin = () => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            try {
                recognitionRef.current.start();
                setIsListening(true);
                setVoiceStatus('🎤 Listening...');
            } catch (e) {
                console.error(e);
            }
        }
    };

    if (showLoading) {
        return <AILoadingScreen onComplete={() => onLoginSuccess(role)} role={role} />;
    }

    return (
        <div className="login-container" style={{
            background: role === 'patient'
                ? 'radial-gradient(circle at center, #064e3b 0%, #05101E 80%)'
                : 'radial-gradient(circle at center, #0A2540 0%, #05101E 80%)'
        }}>
            <div className="heartbeat-bg" style={{ boxShadow: `0 0 10px ${roleColor}`, background: `rgba(${role === 'doctor' ? '0,229,255' : '34,197,94'}, 0.2)` }}></div>

            <div className="login-content">
                <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                    <Waveform color={roleColor} height="50px" barCount={30} />
                </div>

                <div className="title-section">
                    <h1 className="glowing-title" style={{ textShadow: `0 0 15px ${roleColor}` }}>
                        MediScribe <span style={{ color: roleColor }}>AI</span>
                    </h1>
                    <p className="subtitle" style={{ color: 'rgba(255,255,255,0.6)' }}>Premium Clinical Intelligence Platform</p>
                </div>

                <div className="glass-card">
                    <div className="role-selector">
                        <button
                            type="button"
                            className={`role-btn ${role === 'doctor' ? 'role-active' : ''}`}
                            onClick={() => { setRole('doctor'); setError(''); setEmail(''); setPassword(''); }}
                        >
                            <Stethoscope className="role-icon" />
                            <div className="role-info">
                                <span className="role-label">Doctor</span>
                                <span className="role-desc">Clinician Access</span>
                            </div>
                        </button>
                        <button
                            type="button"
                            className={`role-btn ${role === 'patient' ? 'role-active' : ''}`}
                            onClick={() => { setRole('patient'); setError(''); setEmail(''); setPassword(''); }}
                            style={{ borderColor: role === 'patient' ? '#22c55e' : '' }}
                        >
                            <User className="role-icon" style={{ color: role === 'patient' ? '#22c55e' : '' }} />
                            <div className="role-info">
                                <span className="role-label" style={{ color: role === 'patient' ? '#22c55e' : '' }}>Patient</span>
                                <span className="role-desc">Health Record</span>
                            </div>
                        </button>
                    </div>

                    <form onSubmit={handleLogin}>
                        {error && <div className="error-msg">{error}</div>}
                        {voiceStatus && <div className="voice-status" style={{ color: roleColor, background: `rgba(${role === 'doctor' ? '0,229,255' : '34,197,94'}, 0.05)` }}>{voiceStatus}</div>}

                        <div className="input-group">
                            <input
                                type="email"
                                className="glass-input"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Mail className="input-icon" />
                        </div>

                        <div className="input-group">
                            <input
                                type="password"
                                className="glass-input"
                                placeholder="Secure Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Lock className="input-icon" />
                        </div>

                        <button
                            type="submit"
                            className={`btn-glow ${role === 'patient' ? 'btn-glow-patient' : ''}`}
                            style={{ background: role === 'patient' ? 'linear-gradient(45deg, #10b981, #22c55e)' : '' }}
                        >
                            Authenticate & Access
                        </button>

                        <button
                            type="button"
                            className={`btn-voice ${isListening ? 'listening' : ''}`}
                            onClick={toggleVoiceLogin}
                            style={{ borderColor: isListening ? roleColor : '' }}
                        >
                            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                            {isListening ? "Listening..." : "Voice Recognition Login"}
                        </button>
                    </form>

                    <div className="credentials-hint">
                        <p>Demo Credentials: <strong>{credentials[role].email}</strong> / <strong>{credentials[role].password}</strong></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
