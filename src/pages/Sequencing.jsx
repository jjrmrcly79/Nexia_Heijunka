import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { levelVolume, levelMix } from '../utils/calculations';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import './Sequencing.css';

export default function Sequencing() {
    const { state } = useApp();
    const { products, params } = state;
    const [tab, setTab] = useState('volume');
    const [workDays, setWorkDays] = useState(params.workingDaysPerWeek || 5);

    // Volume leveling
    const leveledProducts = useMemo(() => levelVolume(products, workDays), [products, workDays]);

    // Bar chart data: original vs leveled
    const volumeChartData = useMemo(() => {
        const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].slice(0, workDays);
        return days.map((day, i) => {
            const row = { day };
            leveledProducts.forEach(p => {
                row[p.name] = p.dailyQuota;
            });
            return row;
        });
    }, [leveledProducts, workDays]);

    const totalDailyQuota = leveledProducts.reduce((sum, p) => sum + (p.dailyQuota || 0), 0);

    // Mix leveling
    const mixProducts = useMemo(() => levelVolume(products, workDays), [products, workDays]);
    const mixSequence = useMemo(() => levelMix(mixProducts), [mixProducts]);

    return (
        <div className="page-container animate-fade-in">
            <div className="page-header">
                <div>
                    <h1>🔄 Secuenciación y Nivelación</h1>
                    <p className="page-subtitle">Nivelación por volumen y variedad (mix) de producción</p>
                </div>
            </div>

            <div className="tabs">
                <button className={`tab-btn ${tab === 'volume' ? 'active' : ''}`} onClick={() => setTab('volume')}>📊 Nivelación por Volumen</button>
                <button className={`tab-btn ${tab === 'mix' ? 'active' : ''}`} onClick={() => setTab('mix')}>🔀 Nivelación por Variedad</button>
            </div>

            {/* Volume Leveling */}
            {tab === 'volume' && (
                <div>
                    <div className="glass-card" style={{ marginBottom: 'var(--space-lg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
                            <h3>Cuota de Producción Diaria</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                                <label className="form-label" style={{ margin: 0 }}>Días laborales:</label>
                                <input type="number" className="form-input form-input-mono" style={{ width: 60 }}
                                    value={workDays} onChange={e => setWorkDays(Math.max(1, Math.min(7, Number(e.target.value))))} min={1} max={7} />
                            </div>
                        </div>

                        <div className="grid-3" style={{ marginBottom: 'var(--space-lg)' }}>
                            <div className="stat-card" style={{ padding: 'var(--space-md)', background: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)' }}>
                                <span className="stat-label">Total Semanal</span>
                                <span className="stat-value mono" style={{ fontSize: '1.4rem' }}>
                                    {products.reduce((s, p) => s + (p.weeklyDemand || 0), 0)}
                                    <span className="stat-unit"> uds</span>
                                </span>
                            </div>
                            <div className="stat-card" style={{ padding: 'var(--space-md)', background: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)' }}>
                                <span className="stat-label">Cuota Diaria</span>
                                <span className="stat-value mono" style={{ fontSize: '1.4rem', color: 'var(--color-accent)' }}>
                                    {totalDailyQuota}
                                    <span className="stat-unit"> uds</span>
                                </span>
                            </div>
                            <div className="stat-card" style={{ padding: 'var(--space-md)', background: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)' }}>
                                <span className="stat-label">Días Laborales</span>
                                <span className="stat-value mono" style={{ fontSize: '1.4rem' }}>
                                    {workDays}
                                    <span className="stat-unit"> /sem</span>
                                </span>
                            </div>
                        </div>

                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={volumeChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,255,218,0.07)" />
                                <XAxis dataKey="day" tick={{ fill: '#8892b0', fontSize: 12 }} />
                                <YAxis tick={{ fill: '#8892b0', fontSize: 12 }} />
                                <Tooltip contentStyle={{ background: '#112240', border: '1px solid rgba(100,255,218,0.2)', borderRadius: 8, color: '#ccd6f6' }} />
                                <Legend />
                                {leveledProducts.map(p => (
                                    <Bar key={p.id} dataKey={p.name} stackId="a" fill={p.color} radius={[2, 2, 0, 0]} />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="glass-card">
                        <h3 style={{ marginBottom: 'var(--space-md)' }}>Desglose por Producto</h3>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Demanda Semanal</th>
                                    <th>Cuota Diaria</th>
                                    <th>Variación</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leveledProducts.map(p => {
                                    const exact = (p.weeklyDemand || 0) / workDays;
                                    const diff = p.dailyQuota - exact;
                                    return (
                                        <tr key={p.id}>
                                            <td>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
                                                    {p.name}
                                                </span>
                                            </td>
                                            <td className="mono">{p.weeklyDemand}</td>
                                            <td className="mono text-accent">{p.dailyQuota}</td>
                                            <td className="mono" style={{ color: diff > 0 ? 'var(--color-amber)' : 'var(--color-green)' }}>
                                                {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Mix Leveling */}
            {tab === 'mix' && (
                <div>
                    <div className="glass-card" style={{ marginBottom: 'var(--space-lg)' }}>
                        <h3 style={{ marginBottom: 'var(--space-md)' }}>Patrón de Producción Nivelado</h3>
                        <p style={{ fontSize: '0.85rem', marginBottom: 'var(--space-lg)' }}>
                            Secuencia interleaved que distribuye la producción de cada producto proporcionalmente,
                            evitando grandes lotes consecutivos.
                        </p>

                        <div className="mix-sequence-strip">
                            {mixSequence.map((item, i) => (
                                <div key={i} className="mix-item" style={{ '--item-color': item.color }}>
                                    <span className="mix-item-dot" style={{ background: item.color }} />
                                    <span className="mix-item-label">{item.name.substring(0, 3)}</span>
                                    <span className="mix-item-idx mono">{i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid-2">
                        <div className="glass-card">
                            <h4 style={{ marginBottom: 'var(--space-md)' }}>📊 Distribución en la Secuencia</h4>
                            {mixProducts.filter(p => p.dailyQuota > 0).map(p => {
                                const count = mixSequence.filter(s => s.id === p.id).length;
                                const pct = totalDailyQuota > 0 ? (count / totalDailyQuota * 100) : 0;
                                return (
                                    <div key={p.id} className="mix-dist-row">
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                                            <span style={{ width: 10, height: 10, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
                                            {p.name}
                                        </span>
                                        <span className="mono" style={{ width: 50, textAlign: 'right' }}>{count} uds</span>
                                        <div className="mix-bar-track">
                                            <div className="mix-bar-fill" style={{ width: `${pct}%`, background: p.color }} />
                                        </div>
                                        <span className="mono" style={{ width: 45, textAlign: 'right', fontSize: '0.8rem' }}>{pct.toFixed(0)}%</span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="glass-card">
                            <h4 style={{ marginBottom: 'var(--space-md)' }}>🔍 Análisis del Patrón</h4>
                            <div className="analysis-items">
                                <div className="analysis-item">
                                    <span className="analysis-label">Total Unidades/Día</span>
                                    <span className="analysis-value mono">{totalDailyQuota}</span>
                                </div>
                                <div className="analysis-item">
                                    <span className="analysis-label">Productos en Secuencia</span>
                                    <span className="analysis-value mono">{new Set(mixSequence.map(s => s.id)).size}</span>
                                </div>
                                <div className="analysis-item">
                                    <span className="analysis-label">Longitud del Ciclo</span>
                                    <span className="analysis-value mono">{mixSequence.length} pasos</span>
                                </div>
                                <div className="analysis-item">
                                    <span className="analysis-label">Patrón</span>
                                    <span className="analysis-value mono" style={{ fontSize: '0.75rem', wordBreak: 'break-all' }}>
                                        {mixSequence.slice(0, 20).map(s => s.name.charAt(0)).join('-')}{mixSequence.length > 20 ? '…' : ''}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
