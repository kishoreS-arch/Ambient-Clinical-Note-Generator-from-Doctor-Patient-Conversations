import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Mail, Lock, Activity, Mic, MicOff, Stethoscope, User, Heart, Shield } from 'lucide-react';
import Waveform from './components/Waveform';
import './LoginPage.css';
import './medical-theme.css';

/* ── DNA Helix Background ──────────────────────────────────── */
const DNAHelix = ({ color }) => {
    const dots = useMemo(() => {
        const items = [];
        const count = 14;
        for (let i = 0; i < count; i++) {
            const delay = i * 0.4;
            const topPct = (i / count) * 100;
            items.push(
                <div key={`l-${i}`} className="dna-strand" style={{
                    left: '42%', top: `${topPct}%`,
                    '--amp': '35px', '--travel': '120vh',
                    animation: `dnaHelixLeft ${6 + (i % 3)}s ease-in-out ${delay}s infinite`,
                    background: color, boxShadow: `0 0 10px ${color}`,
                    width: `${3 + (i % 3)}px`, height: `${3 + (i % 3)}px`,
                }} />,
                <div key={`r-${i}`} className="dna-strand" style={{
                    left: '58%', top: `${topPct}%`,
                    '--amp': '35px', '--travel': '120vh',
                    animation: `dnaHelixRight ${6 + (i % 3)}s ease-in-out ${delay + 0.2}s infinite`,
                    background: color, boxShadow: `0 0 10px ${color}`,
                    opacity: 0.4,
                    width: `${3 + (i % 2)}px`, height: `${3 + (i % 2)}px`,
                }} />
            );
            // Connection lines between strands
            if (i % 2 === 0) {
                items.push(
                    <div key={`c-${i}`} style={{
                        position: 'absolute', left: '44%', top: `${topPct + 1}%`,
                        width: '12%', height: '1px',
                        background: `linear-gradient(90deg, ${color}, transparent)`,
                        opacity: 0.15,
                        animation: `pulseOpacity 3s ease-in-out ${delay}s infinite`,
                    }} />
                );
            }
        }
        return items;
    }, [color]);

    return <div className="dna-helix-container">{dots}</div>;
};

/* ── Floating Medical Particles ────────────────────────────── */
const MedicalParticles = ({ color }) => {
    const particles = useMemo(() => {
        const symbols = ['✚', '♡', '⬡', '◈', '●', '✦'];
        return symbols.map((sym, i) => (
            <div
                key={i}
                className="med-particle"
                style={{
                    left: `${10 + i * 15}%`,
                    fontSize: `${14 + (i % 3) * 6}px`,
                    animationDuration: `${8 + i * 2}s`,
                    animationDelay: `${i * 1.5}s`,
                    color: i % 2 === 0 ? color : 'rgba(6, 182, 212, 0.6)',
                }}
            >
                {sym}
            </div>
        ));
    }, [color]);

    return <div className="med-particles">{particles}</div>;
};

/* ── ECG Heartbeat Line ────────────────────────────────────── */
const ECGLine = () => (
    <div className="ecg-line">
        <svg viewBox="0 0 600 60" preserveAspectRatio="none">
            <path d="M0,30 L60,30 L75,30 L85,10 L95,50 L105,5 L115,55 L125,25 L135,30
                      L200,30 L260,30 L275,30 L285,10 L295,50 L305,5 L315,55 L325,25 L335,30
                      L400,30 L460,30 L475,30 L485,10 L495,50 L505,5 L515,55 L525,25 L535,30 L600,30" />
        </svg>
    </div>
);

/* ── Vitals Monitor Loading Screen ─────────────────────────── */
const VitalsLoadingScreen = ({ onComplete, role }) => {
    const [bpm, setBpm] = useState(72);
    const [statusText, setStatusText] = useState('Initializing medical systems...');

    useEffect(() => {
        const bpmInterval = setInterval(() => {
            setBpm(prev => {
                const delta = Math.floor(Math.random() * 5) - 2;
                return Math.max(68, Math.min(85, prev + delta));
            });
        }, 800);

        const sequence = role === 'doctor'
            ? [
                { text: 'Loading clinical AI models...', time: 600 },
                { text: 'Connecting to OpenFDA database...', time: 1200 },
                { text: 'Calibrating ambient protocols...', time: 2000 },
                { text: 'Syncing patient records...', time: 2800 },
                { text: 'System ready ✓', time: 3400 },
            ]
            : [
                { text: 'Loading patient portal...', time: 600 },
                { text: 'Syncing medical records...', time: 1200 },
                { text: 'Preparing health dashboard...', time: 2000 },
                { text: 'Verifying credentials...', time: 2800 },
                { text: 'Portal ready ✓', time: 3400 },
            ];

        const timers = sequence.map(({ text, time }) =>
            setTimeout(() => setStatusText(text), time)
        );

        const finalTimer = setTimeout(() => onComplete(), 4000);

        return () => {
            clearInterval(bpmInterval);
            timers.forEach(clearTimeout);
            clearTimeout(finalTimer);
        };
    }, [onComplete, role]);

    return (
        <div className="vitals-monitor">
            {/* Background grid */}
            <div className="med-grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />

            {/* Floating particles */}
            <MedicalParticles color="rgba(13, 148, 136, 0.5)" />

            {/* ECG Waveform */}
            <div className="vitals-ecg-container" style={{ position: 'relative', zIndex: 5 }}>
                <svg viewBox="0 0 280 100" preserveAspectRatio="none">
                    <path d="M0,50 L40,50 L55,50 L65,20 L80,80 L90,10 L100,90 L110,40 L120,50
                             L160,50 L175,50 L185,20 L200,80 L210,10 L220,90 L230,40 L240,50 L280,50" />
                </svg>
            </div>

            {/* BPM Counter */}
            <div className="vitals-bpm" style={{ position: 'relative', zIndex: 5 }}>
                {bpm}
            </div>
            <div className="vitals-label" style={{ position: 'relative', zIndex: 5 }}>BPM</div>

            {/* Status Text */}
            <div className="vitals-status" style={{ position: 'relative', zIndex: 5 }}>
                {statusText}
            </div>

            {/* Progress Bar */}
            <div style={{
                position: 'relative', zIndex: 5,
                width: '200px', height: '3px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '4px', marginTop: '20px',
                overflow: 'hidden',
            }}>
                <div style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--med-teal), var(--med-cyan))',
                    borderRadius: '4px',
                    animation: 'progressFill 4s ease-in-out forwards',
                    boxShadow: '0 0 10px var(--med-glow-teal)',
                }} />
            </div>

            <style>{`
                @keyframes progressFill {
                    0% { width: 0%; }
                    20% { width: 25%; }
                    50% { width: 55%; }
                    80% { width: 85%; }
                    100% { width: 100%; }
                }
            `}</style>
        </div>
    );
};

/* ── Credentials ───────────────────────────────────────────── */
const credentials = {
    doctor: { email: 'doctor@clinic.com', password: 'med123' },
    patient: { email: 'patient@clinic.com', password: 'patient123' },
};

/* ── Main Login Page ───────────────────────────────────────── */
export default function LoginPage({ onLoginSuccess }) {
    const [role, setRole] = useState('doctor');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [voiceStatus, setVoiceStatus] = useState('');
    const [showLoading, setShowLoading] = useState(false);
    const [cardHover, setCardHover] = useState(false);
    const recognitionRef = useRef(null);

    const roleColor = role === 'doctor' ? '#0d9488' : '#10b981';
    const roleGlow = role === 'doctor' ? 'rgba(13,148,136,0.3)' : 'rgba(16,185,129,0.3)';

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

            recognition.onerror = () => { setIsListening(false); setVoiceStatus(''); };
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
            } catch (e) { console.error(e); }
        }
    };

    if (showLoading) {
        return <VitalsLoadingScreen onComplete={() => onLoginSuccess(role)} role={role} />;
    }

    return (
        <div className="login-container" style={{
            background: role === 'patient'
                ? 'radial-gradient(ellipse at 30% 50%, #042f2e 0%, #060d19 60%, #030712 100%)'
                : 'radial-gradient(ellipse at 30% 50%, #0a1628 0%, #060d19 60%, #030712 100%)',
        }}>
            {/* Medical grid background */}
            <div className="med-grid-bg" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

            {/* DNA Helix */}
            <DNAHelix color={roleColor} />

            {/* Floating Medical Particles */}
            <MedicalParticles color={roleColor} />

            <div className="login-content" style={{ zIndex: 10 }}>
                {/* Waveform */}
                <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                    <Waveform color={roleColor} height="45px" barCount={28} />
                </div>

                {/* Title */}
                <div className="title-section" style={{ animation: 'fadeInDown 0.8s ease-out' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
                        <Heart size={24} color={roleColor} style={{ animation: 'heartbeatPulse 1.5s ease-in-out infinite' }} />
                        <h1 className="glowing-title" style={{
                            textShadow: `0 0 15px ${roleGlow}, 0 0 40px ${roleGlow}`,
                            fontSize: '2.8rem',
                        }}>
                            MediScribe <span style={{ color: roleColor, filter: `drop-shadow(0 0 8px ${roleGlow})` }}>AI</span>
                        </h1>
                        <Shield size={24} color={roleColor} style={{ animation: 'heartbeatPulse 1.5s ease-in-out 0.3s infinite' }} />
                    </div>
                    <p className="subtitle" style={{
                        color: 'rgba(255,255,255,0.5)',
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                        fontSize: '0.85rem',
                    }}>
                        Premium Clinical Intelligence Platform
                    </p>
                </div>

                {/* Glass Card */}
                <div
                    className="med-glass"
                    style={{
                        padding: '40px',
                        width: '100%',
                        transform: cardHover ? 'perspective(800px) rotateX(1deg)' : 'perspective(800px) rotateX(0deg)',
                        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    onMouseEnter={() => setCardHover(true)}
                    onMouseLeave={() => setCardHover(false)}
                >
                    {/* Role Selector */}
                    <div className="role-selector">
                        <button
                            type="button"
                            className={`role-btn med-role-btn ${role === 'doctor' ? 'active' : ''}`}
                            onClick={() => { setRole('doctor'); setError(''); setEmail(''); setPassword(''); }}
                            style={{
                                background: role === 'doctor' ? 'rgba(13,148,136,0.12)' : 'rgba(255,255,255,0.03)',
                                borderColor: role === 'doctor' ? '#0d9488' : 'rgba(255,255,255,0.08)',
                                color: role === 'doctor' ? '#5eead4' : 'rgba(255,255,255,0.5)',
                            }}
                        >
                            <Stethoscope className="role-icon" style={{ color: role === 'doctor' ? '#0d9488' : '' }} />
                            <div className="role-info">
                                <span className="role-label" style={{ color: role === 'doctor' ? '#5eead4' : '' }}>Doctor</span>
                                <span className="role-desc">Clinician Access</span>
                            </div>
                            {role === 'doctor' && <span className="heartbeat-dot" style={{ marginLeft: 'auto' }} />}
                        </button>
                        <button
                            type="button"
                            className={`role-btn med-role-btn ${role === 'patient' ? 'active' : ''}`}
                            onClick={() => { setRole('patient'); setError(''); setEmail(''); setPassword(''); }}
                            style={{
                                background: role === 'patient' ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.03)',
                                borderColor: role === 'patient' ? '#10b981' : 'rgba(255,255,255,0.08)',
                                color: role === 'patient' ? '#6ee7b7' : 'rgba(255,255,255,0.5)',
                            }}
                        >
                            <User className="role-icon" style={{ color: role === 'patient' ? '#10b981' : '' }} />
                            <div className="role-info">
                                <span className="role-label" style={{ color: role === 'patient' ? '#6ee7b7' : '' }}>Patient</span>
                                <span className="role-desc">Health Portal</span>
                            </div>
                            {role === 'patient' && <span className="heartbeat-dot" style={{ marginLeft: 'auto', background: '#10b981', boxShadow: '0 0 8px rgba(16,185,129,0.5)' }} />}
                        </button>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin}>
                        {error && <div className="error-msg">{error}</div>}
                        {voiceStatus && (
                            <div className="voice-status" style={{
                                color: roleColor,
                                background: `linear-gradient(135deg, ${roleGlow.replace('0.3', '0.05')}, transparent)`,
                                borderColor: `${roleColor}30`,
                            }}>
                                {voiceStatus}
                            </div>
                        )}

                        <div className="input-group">
                            <input
                                type="email"
                                className="glass-input med-input"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Mail className="input-icon" style={{ color: roleColor }} />
                        </div>

                        <div className="input-group">
                            <input
                                type="password"
                                className="glass-input med-input"
                                placeholder="Secure Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Lock className="input-icon" style={{ color: roleColor }} />
                        </div>

                        <button
                            type="submit"
                            className="btn-glow med-btn"
                            style={{
                                background: role === 'patient'
                                    ? 'linear-gradient(135deg, #059669, #10b981)'
                                    : 'linear-gradient(135deg, #0d9488, #06b6d4)',
                                boxShadow: `0 4px 20px ${roleGlow}`,
                            }}
                        >
                            <Activity size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                            Authenticate & Access
                        </button>

                        <button
                            type="button"
                            className={`btn-voice med-btn ${isListening ? 'listening' : ''}`}
                            onClick={toggleVoiceLogin}
                            style={{
                                borderColor: isListening ? roleColor : `${roleColor}60`,
                                color: isListening ? roleColor : `${roleColor}cc`,
                            }}
                        >
                            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                            {isListening ? 'Listening...' : 'Voice Recognition Login'}
                        </button>
                    </form>

                    <div className="credentials-hint">
                        <p>Demo: <strong>{credentials[role].email}</strong> / <strong>{credentials[role].password}</strong></p>
                    </div>

                    {/* ECG Line at bottom of card */}
                    <ECGLine />
                </div>
            </div>
        </div>
    );
}
