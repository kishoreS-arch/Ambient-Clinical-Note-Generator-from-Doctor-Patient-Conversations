import React, { useState, useEffect, useRef } from 'react';
import { Mail, Lock, Activity, Mic, ShieldAlert } from 'lucide-react';
import './LoginPage.css';

const AILoadingScreen = ({ onComplete }) => {
    const [loadingText, setLoadingText] = useState("Initializing AI Medical Assistant...");

    useEffect(() => {
        const sequence = [
            { text: "Loading clinical models...", time: 1000 },
            { text: "Connecting to OpenFDA...", time: 2000 },
            { text: "Synchronizing Ambient Protocols...", time: 3000 },
            { text: "Ready", time: 4000 }
        ];

        sequence.forEach(({ text, time }) => {
            setTimeout(() => setLoadingText(text), time);
        });

        const timer = setTimeout(() => {
            onComplete();
        }, 4500);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="loading-screen">
            <div className="spinner"></div>
            <div className="loading-text">{loadingText}</div>
        </div>
    );
};

export default function LoginPage({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Setup Speech Recognition for Voice Login
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript.toLowerCase();
                if (transcript.includes("start consultation") || transcript.includes("login")) {
                    // Trigger successful login
                    handleLoginSuccess();
                } else {
                    setError('Voice command not recognized. Try "Start consultation".');
                    setIsListening(false);
                }
            };

            recognition.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }
    }, []);

    const handleLoginSuccess = () => {
        setError('');
        setShowLoading(true);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (email === 'doctor@clinic.com' && password === 'med123') {
            handleLoginSuccess();
        } else {
            setError('Invalid credentials');
        }
    };

    const toggleVoiceLogin = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            setError('');
            try {
                recognitionRef.current?.start();
                setIsListening(true);
            } catch (e) {
                console.error("Microphone access issue", e);
                setError("Microphone access required for voice login.");
            }
        }
    };

    if (showLoading) {
        return <AILoadingScreen onComplete={onLoginSuccess} />;
    }

    return (
        <div className="login-container">
            {/* Background Animated Elements */}
            <div className="heartbeat-bg"></div>
            <div className="particles">
                <Activity className="particle" />
                <span className="particle">🧬</span>
                <Activity className="particle" />
                <span className="particle">🧬</span>
                <ShieldAlert className="particle" />
            </div>

            <div className="login-content">
                <div className="title-section">
                    <h1 className="glowing-title">AI Clinical Note Generator</h1>
                    <p className="subtitle">Ambient AI Assistant for Doctors</p>
                </div>

                <div className="glass-card">
                    <div className="ai-avatar">
                        <div className="eyeball"></div>
                    </div>

                    <div className="card-header">
                        <ShieldAlert className="h-6 w-6 text-teal-400" />
                        <h2 className="card-title">Doctor Login</h2>
                    </div>

                    <form onSubmit={handleLogin}>
                        {error && <div className="error-msg">{error}</div>}

                        <div className="input-group">
                            <input
                                type="email"
                                className="glass-input"
                                placeholder="Email Address (doctor@clinic.com)"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Mail className="input-icon h-5 w-5" />
                        </div>

                        <div className="input-group">
                            <input
                                type="password"
                                className="glass-input"
                                placeholder="Password (med123)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Lock className="input-icon h-5 w-5" />
                        </div>

                        <button type="submit" className="btn-glow">
                            Authenticate & Access
                        </button>

                        <div className="text-center mt-4">
                            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>or</span>
                        </div>

                        <button
                            type="button"
                            className={`btn-voice ${isListening ? 'listening' : ''}`}
                            onClick={toggleVoiceLogin}
                        >
                            <Mic className="h-5 w-5" />
                            {isListening ? "Listening... (Say 'Start consultation')" : "Voice Login"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
