import React, { useState } from 'react';
import { useConsultation } from '../context/ConsultationContext';
import {
    Mic, MicOff, Play, Save, ChevronRight, Activity,
    Smile, AlertCircle, Clock, Brain, Thermometer, User
} from 'lucide-react';

export default function NewConsultationPage() {
    const {
        isRecording, liveTranscript, isProcessing, processStep, steps,
        resultsAvailable, startRecording, stopRecording, startDemoConsultation,
        aiInsights, t
    } = useConsultation();

    const getStatusColor = (index) => {
        if (processStep > index) return '#0d9488';
        if (processStep === index) return '#06b6d4';
        return 'rgba(255,255,255,0.1)';
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <header style={{ marginBottom: '10px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>Patient Consultation</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '4px 0 0' }}>Ambient AI Assistant active</p>
                </header>

                {/* Live Transcript Area */}
                <div className="med-glass" style={{ flex: 1, minHeight: '300px', padding: '24px', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {isRecording && <span className="heartbeat-dot" />}
                            <h3 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {isRecording ? 'Listening...' : 'Ready to record'}
                            </h3>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={startDemoConsultation} className="med-btn" style={{
                                padding: '8px 16px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.1)',
                                border: '1px solid rgba(6, 182, 212, 0.2)', color: '#06b6d4', fontSize: '12px', fontWeight: '700',
                                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
                            }}>
                                <Play size={14} fill="#06b6d4" /> Try Demo Voice
                            </button>
                        </div>
                    </div>

                    <div style={{ fontSize: '15px', lineHeight: '1.8', color: liveTranscript ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        {liveTranscript || "Transcript will appear here as you speak..."}
                    </div>

                    {/* Bottom Controls */}
                    <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px', display: 'flex', justifyContent: 'center' }}>
                        <button
                            onClick={isRecording ? stopRecording : startRecording}
                            className="med-btn"
                            style={{
                                width: '64px', height: '64px', borderRadius: '50%', border: 'none',
                                background: isRecording ? '#ef4444' : 'linear-gradient(135deg, #0d9488, #06b6d4)',
                                color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: isRecording ? '0 0 20px rgba(239, 68, 68, 0.4)' : '0 0 20px rgba(13, 148, 136, 0.4)'
                            }}
                        >
                            {isRecording ? <MicOff size={28} /> : <Mic size={28} />}
                        </button>
                    </div>
                </div>

                {/* Pipeline Logic */}
                {isProcessing && (
                    <div className="med-glass" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '20px' }}>AI Pipeline Status</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                            {steps.map((step, i) => (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 1 }}>
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '50%',
                                        background: getStatusColor(i), display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'all 0.3s', color: '#fff', fontSize: '12px', fontWeight: 'bold',
                                        boxShadow: processStep === i ? '0 0 15px rgba(6, 182, 212, 0.4)' : 'none'
                                    }}>
                                        {processStep > i ? '✓' : i + 1}
                                    </div>
                                    <span style={{ fontSize: '10px', color: processStep >= i ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: processStep === i ? '700' : '400' }}>{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Sidebar: AI Real-time Insights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Emotion Detector */}
                <div className="med-glass" style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Brain size={18} color="#8b5cf6" /> Emotion & Vitals
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Stress Level</span>
                                <span style={{ fontWeight: '700', color: aiInsights.emotionAnalysis.stress === 'High' ? '#ef4444' : '#0d9488' }}>
                                    {aiInsights.emotionAnalysis.stress}
                                </span>
                            </div>
                            <div style={{ height: '6px', width: '100%', background: 'rgba(0,0,0,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%',
                                    width: aiInsights.emotionAnalysis.stress === 'High' ? '80%' : aiInsights.emotionAnalysis.stress === 'Medium' ? '50%' : '20%',
                                    background: aiInsights.emotionAnalysis.stress === 'High' ? '#ef4444' : '#0d9488'
                                }} />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(0,0,0,0.02)', textAlign: 'center' }}>
                                <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pain Level</span>
                                <span style={{ fontSize: '16px', fontWeight: '800', color: '#f59e0b' }}>{aiInsights.emotionAnalysis.pain}/100</span>
                            </div>
                            <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(0,0,0,0.02)', textAlign: 'center' }}>
                                <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Anxiety</span>
                                <span style={{ fontSize: '15px', fontWeight: '800', color: '#10b981' }}>{aiInsights.emotionAnalysis.anxiety}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Smart Symptom Timeline */}
                <div className="med-glass" style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Clock size={18} color="#06b6d4" /> Symptom Timeline
                    </h3>
                    <div style={{ position: 'relative', paddingLeft: '20px' }}>
                        <div style={{ position: 'absolute', left: '7px', top: '5px', bottom: '5px', width: '2px', background: 'rgba(13, 148, 136, 0.1)' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {aiInsights.timeline.length > 0 ? aiInsights.timeline.map((item, i) => (
                                <div key={i} style={{ position: 'relative' }}>
                                    <div style={{
                                        position: 'absolute', left: '-18px', top: '4px', width: '10px', height: '10px',
                                        borderRadius: '50%', background: '#0d9488', border: '2px solid #fff'
                                    }} />
                                    <span style={{ fontSize: '10px', fontWeight: '700', color: '#0d9488', display: 'block' }}>{item.date}</span>
                                    <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{item.event}</span>
                                </div>
                            )) : (
                                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Collecting clinical history...</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Patient Summary Card (Clinical Context) */}
                <div className="med-glass" style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.05) 0%, rgba(6, 182, 212, 0.02) 100%)' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <User size={18} color="#0d9488" /> Patient Context
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Name</span>
                            <span style={{ fontWeight: '600' }}>Unknown Patient</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Age / Gender</span>
                            <span style={{ fontWeight: '600' }}>60 / male</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '5px' }}>
                            <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Primary Complaint</span>
                            <span style={{ fontSize: '11px', fontWeight: '600', color: '#0d9488' }}>Persistent Cough</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
