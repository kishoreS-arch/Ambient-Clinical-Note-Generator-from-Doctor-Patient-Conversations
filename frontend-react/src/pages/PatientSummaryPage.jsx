import React, { useState } from 'react';
import { useConsultation } from '../context/ConsultationContext';
import { UserRound, Heart, BookOpen, AlertTriangle, CheckCircle, RefreshCw, Copy, Volume2 } from 'lucide-react';

const sampleSummaries = [
    {
        condition: 'Hypertension Stage 1',
        clinical: 'Patient presents with systolic BP 130-139 mmHg or diastolic BP 80-89 mmHg. Recommend lifestyle modifications and potential pharmacotherapy.',
        simple: 'Your blood pressure is slightly higher than normal. This means your heart is working a bit harder to pump blood. With some changes to your diet, exercise, and possibly medication, we can bring it back to a healthy range.',
        grade: 5.2,
        validated: true,
    },
    {
        condition: 'Type 2 Diabetes Mellitus',
        clinical: 'Elevated HbA1c at 7.8%. Fasting glucose 145 mg/dL. Recommend metformin initiation with dietary counseling.',
        simple: 'Your blood sugar levels are higher than they should be. This is called diabetes. We will start you on a medicine called Metformin, and I will also recommend some changes to your diet to help control your sugar levels.',
        grade: 4.8,
        validated: true,
    },
    {
        condition: 'Upper Respiratory Tract Infection',
        clinical: 'Acute pharyngitis with associated rhinorrhea and low-grade pyrexia. Likely viral etiology. Symptomatic treatment advised.',
        simple: 'You have a common cold with a sore throat, runny nose, and a mild fever. This is caused by a virus and will get better on its own in a few days. I will give you some medicine to help you feel more comfortable.',
        grade: 3.9,
        validated: true,
    },
];

export default function PatientSummaryPage() {
    const { consultData } = useConsultation();
    const [selectedIdx, setSelectedIdx] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [copiedIdx, setCopiedIdx] = useState(null);

    const summaries = consultData?.summary
        ? [{ condition: 'Current Consultation', clinical: consultData.soap?.assessment || '', simple: consultData.summary.summary, grade: consultData.summary.flesch_kincaid_grade, validated: consultData.summary.validated }, ...sampleSummaries]
        : sampleSummaries;

    const active = summaries[selectedIdx];

    const handleSpeak = (text) => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.onend = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
    };

    const handleCopy = (text, idx) => {
        navigator.clipboard.writeText(text);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: 0, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <UserRound size={28} color="#0d9488" /> Patient Summary
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '4px', fontSize: '14px' }}>
                    AI-powered clinical-to-simple language translation
                </p>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
                {summaries.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => setSelectedIdx(i)}
                        style={{
                            padding: '10px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                            background: selectedIdx === i ? 'linear-gradient(135deg, rgba(13,148,136,0.3), rgba(6,182,212,0.2))' : '#161b22',
                            color: selectedIdx === i ? '#5eead4' : 'rgba(255,255,255,0.5)',
                            boxShadow: selectedIdx === i ? 'inset 0 0 0 1px rgba(13,148,136,0.4)' : 'inset 0 0 0 1px rgba(255,255,255,0.06)',
                            fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', transition: 'all 0.2s',
                        }}
                    >
                        {s.condition}
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div style={{ display: 'grid', gap: '20px' }}>
                {/* Clinical Note */}
                <div style={{
                    background: 'var(--bg-secondary)', borderRadius: '16px', padding: '28px',
                    border: '1px solid rgba(255,255,255,0.06)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', margin: 0, textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <BookOpen size={16} /> Clinical Note
                        </h3>
                        <span style={{ fontSize: '10px', padding: '4px 10px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontWeight: '600', textTransform: 'uppercase' }}>
                            Medical Terminology
                        </span>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', lineHeight: '1.8', margin: 0, fontStyle: 'italic' }}>
                        {active.clinical || 'No clinical note available.'}
                    </p>
                </div>

                {/* Arrow Divider */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(13,148,136,0.3), transparent)' }} />
                    <div style={{
                        width: '48px', height: '48px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(13,148,136,0.2), rgba(6,182,212,0.1))',
                        border: '1px solid rgba(13,148,136,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <RefreshCw size={20} color="#0d9488" />
                    </div>
                    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(13,148,136,0.3), transparent)' }} />
                </div>

                {/* Patient-Friendly Summary */}
                <div style={{
                    background: 'linear-gradient(135deg, #161b22, #0f1923)', borderRadius: '16px', padding: '28px',
                    border: '1px solid rgba(13,148,136,0.2)',
                    boxShadow: '0 4px 24px rgba(13,148,136,0.08)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#5eead4', margin: 0, textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Heart size={16} /> Patient-Friendly Version
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                                fontSize: '11px', padding: '4px 12px', borderRadius: '8px', fontWeight: '600',
                                background: active.validated ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                                color: active.validated ? '#22c55e' : '#ef4444',
                                border: `1px solid ${active.validated ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                            }}>
                                {active.validated ? <CheckCircle size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> : <AlertTriangle size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />}
                                Grade {active.grade} {active.validated ? '✓ PASS' : '✗ FAIL'}
                            </span>
                        </div>
                    </div>
                    <p style={{
                        color: '#e6edf3', fontSize: '18px', lineHeight: '1.9', margin: '0 0 20px 0',
                        fontFamily: "'Georgia', serif",
                    }}>
                        {active.simple}
                    </p>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={() => handleSpeak(active.simple)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px',
                                borderRadius: '10px', border: 'none', cursor: 'pointer',
                                background: isSpeaking ? 'rgba(239,68,68,0.15)' : 'rgba(13,148,136,0.15)',
                                color: isSpeaking ? '#ef4444' : '#5eead4',
                                fontSize: '13px', fontWeight: '600', transition: 'all 0.2s',
                            }}
                        >
                            <Volume2 size={16} /> {isSpeaking ? 'Stop' : 'Read Aloud'}
                        </button>
                        <button
                            onClick={() => handleCopy(active.simple, selectedIdx)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px',
                                borderRadius: '10px', border: 'none', cursor: 'pointer',
                                background: copiedIdx === selectedIdx ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)',
                                color: copiedIdx === selectedIdx ? '#22c55e' : 'rgba(255,255,255,0.6)',
                                fontSize: '13px', fontWeight: '600', transition: 'all 0.2s',
                            }}
                        >
                            <Copy size={16} /> {copiedIdx === selectedIdx ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Warning */}
            <div style={{
                marginTop: '20px', padding: '14px 18px', borderRadius: '12px',
                background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.15)',
                display: 'flex', alignItems: 'center', gap: '12px',
            }}>
                <AlertTriangle size={18} color="#eab308" />
                <p style={{ color: 'rgba(234,179,8,0.8)', fontSize: '12px', fontWeight: '500', margin: 0 }}>
                    AI-generated summaries must be reviewed by a doctor before sharing with patients.
                </p>
            </div>
        </div>
    );
}
