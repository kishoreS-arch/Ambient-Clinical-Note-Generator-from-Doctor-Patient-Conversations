import React, { useState } from 'react';
import { useConsultation } from '../context/ConsultationContext';
import { FileText, User, Stethoscope, Edit3, Save, X } from 'lucide-react';

export default function TranscriptPage() {
    const { consultData, liveTranscript } = useConsultation();
    const [isEditing, setIsEditing] = useState(false);
    const [editedTranscript, setEditedTranscript] = useState('');

    const rawTranscript = consultData?.transcript || liveTranscript || '';

    // Parse transcript into speaker segments
    const parseTranscript = (text) => {
        if (!text) return [];
        const lines = text.split('\n').filter(l => l.trim());
        const segments = [];

        lines.forEach((line) => {
            const doctorMatch = line.match(/^(Doctor|Dr\.?)\s*:\s*(.*)/i);
            const patientMatch = line.match(/^(Patient|Pt\.?)\s*:\s*(.*)/i);

            if (doctorMatch) {
                segments.push({ speaker: 'Doctor', text: doctorMatch[2], type: 'doctor' });
            } else if (patientMatch) {
                segments.push({ speaker: 'Patient', text: patientMatch[2], type: 'patient' });
            } else {
                // Auto-detect or default
                segments.push({ speaker: 'Speaker', text: line, type: 'unknown' });
            }
        });

        return segments;
    };

    const segments = parseTranscript(rawTranscript);

    const handleEdit = () => {
        setEditedTranscript(rawTranscript);
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        // In a real app, this would update the context/backend
    };

    const speakerColors = {
        doctor: { bg: 'rgba(13,148,136,0.1)', border: 'rgba(13,148,136,0.25)', text: '#5eead4', icon: Stethoscope },
        patient: { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.25)', text: '#a5b4fc', icon: User },
        unknown: { bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.08)', text: 'rgba(255,255,255,0.6)', icon: User },
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: 0 }}>
                        Transcript 📝
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '4px', fontSize: '14px' }}>
                        Raw conversation with speaker detection.
                    </p>
                </div>
                {rawTranscript && (
                    <button
                        onClick={isEditing ? handleSave : handleEdit}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '10px 20px', borderRadius: '10px',
                            background: isEditing ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${isEditing ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}`,
                            color: isEditing ? '#22c55e' : 'rgba(255,255,255,0.6)',
                            cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                            transition: 'all 0.2s',
                        }}
                    >
                        {isEditing ? <><Save size={16} /> Save</> : <><Edit3 size={16} /> Edit Transcript</>}
                    </button>
                )}
            </div>

            {!rawTranscript ? (
                <div style={{
                    background: '#161b22', borderRadius: '20px', padding: '60px',
                    border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center',
                }}>
                    <FileText size={48} color="rgba(255,255,255,0.15)" style={{ marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
                        No Transcript Available
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px' }}>
                        Record a consultation first to see the transcript here.
                    </p>
                </div>
            ) : isEditing ? (
                <div style={{
                    background: '#161b22', borderRadius: '20px', padding: '24px',
                    border: '1px solid rgba(255,255,255,0.06)',
                }}>
                    <textarea
                        value={editedTranscript}
                        onChange={(e) => setEditedTranscript(e.target.value)}
                        style={{
                            width: '100%', minHeight: '400px', background: 'rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
                            color: '#fff', padding: '20px', fontSize: '14px',
                            fontFamily: 'monospace', lineHeight: '1.8', resize: 'vertical',
                            outline: 'none',
                        }}
                    />
                    <div style={{ display: 'flex', gap: '12px', marginTop: '16px', justifyContent: 'flex-end' }}>
                        <button onClick={() => setIsEditing(false)} style={{
                            padding: '10px 20px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)',
                            cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                            display: 'flex', alignItems: 'center', gap: '6px',
                        }}>
                            <X size={14} /> Cancel
                        </button>
                        <button onClick={handleSave} style={{
                            padding: '10px 20px', borderRadius: '10px',
                            background: 'linear-gradient(135deg, #0d9488, #06b6d4)',
                            border: 'none', color: '#fff', cursor: 'pointer',
                            fontSize: '13px', fontWeight: '600',
                            display: 'flex', alignItems: 'center', gap: '6px',
                        }}>
                            <Save size={14} /> Save Changes
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{
                    background: '#161b22', borderRadius: '20px', padding: '24px',
                    border: '1px solid rgba(255,255,255,0.06)',
                }}>
                    {/* Speaker Legend */}
                    <div style={{
                        display: 'flex', gap: '20px', marginBottom: '24px',
                        padding: '12px 16px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0d9488' }} />
                            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: '500' }}>Doctor</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#6366f1' }} />
                            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: '500' }}>Patient</span>
                        </div>
                    </div>

                    {/* Conversation Bubbles */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {segments.length > 0 ? segments.map((seg, i) => {
                            const colors = speakerColors[seg.type];
                            const Icon = colors.icon;
                            const isDoctor = seg.type === 'doctor';
                            return (
                                <div key={i} style={{
                                    display: 'flex', gap: '12px',
                                    flexDirection: isDoctor ? 'row' : 'row-reverse',
                                }}>
                                    <div style={{
                                        width: '36px', height: '36px', borderRadius: '50%',
                                        background: colors.bg, border: `1px solid ${colors.border}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0,
                                    }}>
                                        <Icon size={16} color={colors.text} />
                                    </div>
                                    <div style={{
                                        maxWidth: '70%', padding: '14px 18px', borderRadius: '16px',
                                        background: colors.bg, border: `1px solid ${colors.border}`,
                                        borderTopLeftRadius: isDoctor ? '4px' : '16px',
                                        borderTopRightRadius: isDoctor ? '16px' : '4px',
                                    }}>
                                        <span style={{
                                            fontSize: '10px', fontWeight: '700', color: colors.text,
                                            textTransform: 'uppercase', letterSpacing: '0.5px',
                                            display: 'block', marginBottom: '6px',
                                        }}>
                                            {seg.speaker}
                                        </span>
                                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                                            {seg.text}
                                        </p>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div style={{
                                padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px',
                                fontFamily: 'monospace', fontSize: '14px', color: 'rgba(255,255,255,0.6)',
                                lineHeight: '1.8', whiteSpace: 'pre-wrap',
                            }}>
                                {rawTranscript}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
