import React, { useState } from 'react';
import { useConsultation } from '../context/ConsultationContext';
import { Bell, Plus, CheckCircle, Clock, Trash2, AlertCircle, X } from 'lucide-react';

export default function RemindersPage() {
    const { reminders, addReminder, toggleReminderStatus, deleteReminder } = useConsultation();
    const [showAddForm, setShowAddForm] = useState(false);
    const [newReminder, setNewReminder] = useState({ patient: '', task: '', dueDate: '' });
    const [filter, setFilter] = useState('all');

    const handleAdd = () => {
        if (!newReminder.patient || !newReminder.task || !newReminder.dueDate) return;
        addReminder(newReminder);
        setNewReminder({ patient: '', task: '', dueDate: '' });
        setShowAddForm(false);
    };

    const filtered = filter === 'all' ? reminders
        : filter === 'pending' ? reminders.filter(r => r.status === 'pending')
            : reminders.filter(r => r.status === 'completed');

    const pendingCount = reminders.filter(r => r.status === 'pending').length;
    const completedCount = reminders.filter(r => r.status === 'completed').length;

    const getDaysUntil = (dateStr) => {
        const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
        if (diff < 0) return { text: `${Math.abs(diff)}d overdue`, color: '#ef4444', urgent: true };
        if (diff === 0) return { text: 'Today', color: '#f59e0b', urgent: true };
        if (diff <= 3) return { text: `${diff}d left`, color: '#f59e0b', urgent: false };
        return { text: `${diff}d left`, color: '#22c55e', urgent: false };
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: 0, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Bell size={28} color="#f59e0b" /> Reminders
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '4px', fontSize: '14px' }}>
                        Patient follow-up & task management
                    </p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '10px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                        background: 'linear-gradient(135deg, #0d9488, #06b6d4)',
                        color: '#fff', fontSize: '13px', fontWeight: '600',
                        boxShadow: '0 4px 15px rgba(13,148,136,0.3)',
                        transition: 'all 0.2s',
                    }}
                >
                    <Plus size={16} /> Add Reminder
                </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                {[
                    { label: 'Total', value: reminders.length, icon: Bell, color: '#3b82f6' },
                    { label: 'Pending', value: pendingCount, icon: Clock, color: '#f59e0b' },
                    { label: 'Completed', value: completedCount, icon: CheckCircle, color: '#22c55e' },
                ].map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <div key={i} style={{
                            background: '#161b22', borderRadius: '14px', padding: '18px 20px',
                            border: '1px solid rgba(255,255,255,0.06)',
                            display: 'flex', alignItems: 'center', gap: '14px',
                        }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon size={20} color={s.color} />
                            </div>
                            <div>
                                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: 0, textTransform: 'uppercase', fontWeight: '600' }}>{s.label}</p>
                                <p style={{ fontSize: '24px', fontWeight: '700', color: '#fff', margin: '2px 0 0 0' }}>{s.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', background: '#161b22', padding: '4px', borderRadius: '10px', width: 'fit-content', border: '1px solid rgba(255,255,255,0.06)' }}>
                {['all', 'pending', 'completed'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{
                        padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                        background: filter === f ? 'rgba(13,148,136,0.2)' : 'transparent',
                        color: filter === f ? '#5eead4' : 'rgba(255,255,255,0.4)',
                        fontSize: '12px', fontWeight: '600', textTransform: 'capitalize', transition: 'all 0.2s',
                    }}>{f}</button>
                ))}
            </div>

            {/* Add Form Modal */}
            {showAddForm && (
                <div style={{
                    background: '#161b22', borderRadius: '16px', padding: '24px', marginBottom: '20px',
                    border: '1px solid rgba(13,148,136,0.3)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: 0 }}>New Reminder</h3>
                        <button onClick={() => setShowAddForm(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}><X size={18} /></button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                        {[
                            { placeholder: 'Patient Name', key: 'patient', type: 'text' },
                            { placeholder: 'Task (e.g., ECG test)', key: 'task', type: 'text' },
                            { placeholder: 'Due Date', key: 'dueDate', type: 'date' },
                        ].map(field => (
                            <input
                                key={field.key}
                                type={field.type}
                                placeholder={field.placeholder}
                                value={newReminder[field.key]}
                                onChange={(e) => setNewReminder({ ...newReminder, [field.key]: e.target.value })}
                                style={{
                                    padding: '12px 14px', borderRadius: '10px',
                                    background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)',
                                    color: '#fff', fontSize: '13px', outline: 'none',
                                }}
                            />
                        ))}
                    </div>
                    <button onClick={handleAdd} style={{
                        padding: '10px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                        background: 'linear-gradient(135deg, #0d9488, #06b6d4)', color: '#fff',
                        fontSize: '13px', fontWeight: '600', transition: 'all 0.2s',
                    }}>Save Reminder</button>
                </div>
            )}

            {/* Reminder Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filtered.map((reminder) => {
                    const due = getDaysUntil(reminder.dueDate);
                    const isDone = reminder.status === 'completed';
                    return (
                        <div key={reminder.id} style={{
                            background: '#161b22', borderRadius: '14px', padding: '18px 20px',
                            border: `1px solid ${isDone ? 'rgba(34,197,94,0.15)' : due.urgent ? `${due.color}25` : 'rgba(255,255,255,0.06)'}`,
                            display: 'flex', alignItems: 'center', gap: '16px',
                            opacity: isDone ? 0.6 : 1,
                            transition: 'all 0.2s',
                        }}>
                            <button
                                onClick={() => toggleReminderStatus(reminder.id)}
                                style={{
                                    width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                                    border: `2px solid ${isDone ? '#22c55e' : 'rgba(255,255,255,0.2)'}`,
                                    background: isDone ? 'rgba(34,197,94,0.15)' : 'transparent',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {isDone && <CheckCircle size={16} color="#22c55e" />}
                            </button>
                            <div style={{ flex: 1 }}>
                                <p style={{
                                    fontSize: '14px', fontWeight: '600', color: '#fff', margin: 0,
                                    textDecoration: isDone ? 'line-through' : 'none',
                                }}>
                                    {reminder.patient}
                                </p>
                                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '4px 0 0 0' }}>
                                    {reminder.task}
                                </p>
                            </div>
                            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div>
                                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', margin: 0 }}>{reminder.dueDate}</p>
                                    {!isDone && (
                                        <p style={{ fontSize: '11px', fontWeight: '600', color: due.color, margin: '2px 0 0 0', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                                            {due.urgent && <AlertCircle size={12} />} {due.text}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => deleteReminder(reminder.id)}
                                    style={{
                                        width: '32px', height: '32px', borderRadius: '8px', border: 'none',
                                        background: 'rgba(239,68,68,0.08)', color: 'rgba(239,68,68,0.5)',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#ef4444'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = 'rgba(239,68,68,0.5)'; }}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    );
                })}

                {filtered.length === 0 && (
                    <div style={{
                        padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.3)',
                        background: '#161b22', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)',
                    }}>
                        <Bell size={32} style={{ marginBottom: '12px', opacity: 0.3 }} />
                        <p style={{ fontSize: '14px', margin: 0 }}>No {filter !== 'all' ? filter : ''} reminders yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
