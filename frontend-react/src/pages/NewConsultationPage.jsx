import React, { useRef } from 'react';
import { useConsultation } from '../context/ConsultationContext';
import { Mic, Square, UploadCloud, Activity, CheckCircle } from 'lucide-react';

export default function NewConsultationPage() {
    const {
        isRecording, liveTranscript, isProcessing, processStep, steps,
        resultsAvailable, startRecording, stopRecording, processAudio
    } = useConsultation();

    const fileInputRef = useRef(null);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        await processAudio(file);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: 0 }}>
                    New Consultation 🎙
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '4px', fontSize: '14px' }}>
                    Record a doctor-patient conversation for AI analysis.
                </p>
            </div>

            {!resultsAvailable && !isProcessing && (
                <div style={{
                    background: '#161b22', padding: '48px', borderRadius: '20px',
                    border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center',
                }}>
                    {isRecording ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {/* Pulsing Mic */}
                            <div style={{
                                width: '120px', height: '120px', borderRadius: '50%',
                                background: 'rgba(239,68,68,0.1)', border: '4px solid #ef4444',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                animation: 'pulse 1.5s ease-in-out infinite', marginBottom: '20px',
                            }}>
                                <Mic size={48} color="#ef4444" />
                            </div>

                            {/* Live Waveform */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '3px',
                                height: '40px', marginBottom: '16px',
                            }}>
                                {Array.from({ length: 30 }).map((_, i) => (
                                    <div key={i} style={{
                                        width: '3px', borderRadius: '2px', background: '#ef4444',
                                        animation: `waveform 0.8s ease-in-out infinite`,
                                        animationDelay: `${i * 0.05}s`,
                                        height: `${10 + Math.random() * 30}px`,
                                    }} />
                                ))}
                            </div>

                            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#fca5a5', marginBottom: '8px' }}>
                                Recording Consultation...
                            </h3>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '24px' }}>
                                Speak naturally. AI will transcribe in real-time.
                            </p>

                            <button
                                onClick={stopRecording}
                                style={{
                                    background: '#ef4444', color: '#fff', border: 'none',
                                    padding: '14px 32px', borderRadius: '12px', fontSize: '15px',
                                    fontWeight: '700', cursor: 'pointer', display: 'flex',
                                    alignItems: 'center', gap: '8px', transition: 'all 0.2s',
                                }}
                            >
                                <Square size={18} /> Stop Consultation
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{
                                width: '120px', height: '120px', borderRadius: '50%',
                                background: 'rgba(13,148,136,0.1)', border: '4px solid #0d9488',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '20px',
                            }}>
                                <Mic size={48} color="#0d9488" />
                            </div>
                            <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#5eead4', marginBottom: '8px' }}>
                                Ready to Record
                            </h3>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '28px' }}>
                                Click below to start recording the consultation.
                            </p>

                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                <button
                                    onClick={startRecording}
                                    style={{
                                        background: 'linear-gradient(135deg, #0d9488, #06b6d4)',
                                        color: '#fff', border: 'none', padding: '14px 32px',
                                        borderRadius: '12px', fontSize: '15px', fontWeight: '700',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                                        gap: '8px', boxShadow: '0 4px 20px rgba(13,148,136,0.3)',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <Mic size={18} /> Start Consultation
                                </button>

                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)',
                                        padding: '14px 24px', borderRadius: '12px', fontSize: '14px',
                                        fontWeight: '600', cursor: 'pointer', display: 'flex',
                                        alignItems: 'center', gap: '8px', transition: 'all 0.2s',
                                    }}
                                >
                                    <UploadCloud size={18} /> Upload Audio
                                </button>
                                <input
                                    ref={fileInputRef} type="file" accept="audio/*"
                                    style={{ display: 'none' }} onChange={handleUpload}
                                />
                            </div>
                        </div>
                    )}

                    {/* Live Transcript Preview */}
                    {isRecording && (
                        <div style={{
                            marginTop: '32px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.06)', padding: '20px', textAlign: 'left',
                        }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                marginBottom: '12px',
                            }}>
                                <Activity size={14} color="#0d9488" />
                                <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Live Transcription
                                </span>
                                <div style={{
                                    width: '6px', height: '6px', borderRadius: '50%',
                                    background: '#22c55e', animation: 'pulse 1s infinite',
                                }} />
                            </div>
                            <p style={{
                                color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontFamily: 'monospace',
                                lineHeight: '1.6', minHeight: '60px', margin: 0,
                            }}>
                                {liveTranscript || 'Listening...'}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Processing Pipeline */}
            {isProcessing && (
                <div style={{
                    background: '#161b22', padding: '40px', borderRadius: '20px',
                    border: '1px solid rgba(255,255,255,0.06)',
                }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: '32px' }}>
                        Processing AI Pipeline
                    </h3>
                    <div style={{ maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {steps.map((step, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                {idx < processStep ? (
                                    <CheckCircle size={24} color="#0d9488" />
                                ) : idx === processStep ? (
                                    <div style={{
                                        width: '24px', height: '24px', borderRadius: '50%',
                                        border: '2px solid #0d9488', borderTopColor: 'transparent',
                                        animation: 'spin 1s linear infinite',
                                    }} />
                                ) : (
                                    <div style={{
                                        width: '24px', height: '24px', borderRadius: '50%',
                                        border: '2px solid rgba(255,255,255,0.1)',
                                    }} />
                                )}
                                <span style={{
                                    color: idx <= processStep ? '#fff' : 'rgba(255,255,255,0.3)',
                                    fontWeight: idx <= processStep ? '500' : '400',
                                    fontSize: '14px',
                                }}>
                                    {step}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {resultsAvailable && (
                <div style={{
                    background: '#161b22', padding: '32px', borderRadius: '20px',
                    border: '1px solid rgba(34,197,94,0.2)', textAlign: 'center',
                }}>
                    <CheckCircle size={48} color="#22c55e" style={{ marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#22c55e', marginBottom: '8px' }}>
                        Consultation Processed Successfully!
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
                        Navigate to Transcript, SOAP Notes, or Prescription to view results.
                    </p>
                </div>
            )}
        </div>
    );
}
