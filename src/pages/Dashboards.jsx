import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
    RadialBarChart, RadialBar, PieChart, Pie, Cell, Legend
} from 'recharts';
import './Dashboards.css';

export default function Dashboards() {
    const { state } = useApp();
    const { products, params, boardState, performanceLogs } = state;

    // Board analytics
    const allCells = Object.values(boardState);
    const totalCards = allCells.length;
    const completed = allCells.filter(c => c.status === 'completed').length;
    const inProgress = allCells.filter(c => c.status === 'inProgress').length;
    const pending = allCells.filter(c => c.status === 'pending').length;
    const adherence = totalCards > 0 ? (completed / totalCards) * 100 : 0;

    // Simulate WIP/Lead time from board state per product
    const productStats = useMemo(() => {
        return products.map(p => {
            const cells = allCells.filter(c => c.productId === p.id);
            const done = cells.filter(c => c.status === 'completed').length;
            const wip = cells.filter(c => c.status === 'inProgress').length;
            return {
                name: p.name.length > 10 ? p.name.substring(0, 10) + '…' : p.name,
                color: p.color,
                total: cells.length,
                completed: done,
                wip,
                pending: cells.length - done - wip,
                adherence: cells.length > 0 ? Math.round((done / cells.length) * 100) : 0
            };
        }).filter(p => p.total > 0);
    }, [products, allCells]);

    // Simulated WIP over time (demo)
    const wipData = useMemo(() => {
        if (performanceLogs.length > 0) {
            return performanceLogs.slice(-20).map((log, i) => ({
                time: `T${i + 1}`,
                wip: log.wip || 0,
                target: log.wipTarget || 10,
            }));
        }
        // Demo data
        return Array.from({ length: 12 }, (_, i) => ({
            time: `T${i + 1}`,
            wip: Math.max(2, Math.round(15 - i * 0.8 + Math.random() * 4)),
            target: 8,
        }));
    }, [performanceLogs]);

    // Simulated Lead Time
    const leadTimeData = useMemo(() => {
        if (performanceLogs.length > 0) {
            return performanceLogs.slice(-20).map((log, i) => ({
                time: `T${i + 1}`,
                actual: log.leadTime || 0,
                target: log.leadTimeTarget || 24,
            }));
        }
        return Array.from({ length: 12 }, (_, i) => ({
            time: `T${i + 1}`,
            actual: Math.max(12, Math.round(36 - i * 1.5 + Math.random() * 5)),
            target: 24,
        }));
    }, [performanceLogs]);

    // Status pie
    const statusPie = [
        { name: 'Completado', value: completed, color: 'var(--color-green)' },
        { name: 'En Proceso', value: inProgress, color: 'var(--color-blue)' },
        { name: 'Pendiente', value: pending, color: '#5a6588' },
    ].filter(s => s.value > 0);

    // Adherence gauge data
    const gaugeData = [{ name: 'Adherencia', value: Math.round(adherence), fill: adherence >= 80 ? '#34d399' : adherence >= 50 ? '#f59e0b' : '#f87171' }];

    return (
        <div className="page-container animate-fade-in">
            <div className="page-header">
                <div>
                    <h1>📈 Dashboards de Control</h1>
                    <p className="page-subtitle">Monitoreo de desempeño en tiempo real</p>
                </div>
            </div>

            {/* Top KPIs */}
            <div className="grid-4 dash-kpis">
                <div className="glass-card stat-card">
                    <span className="stat-label">Tarjetas Plan</span>
                    <span className="stat-value mono" style={{ fontSize: '1.8rem' }}>{totalCards}</span>
                    <span className="stat-sub">en la caja Heijunka</span>
                </div>
                <div className="glass-card stat-card">
                    <span className="stat-label">Completadas</span>
                    <span className="stat-value mono" style={{ fontSize: '1.8rem', color: 'var(--color-green)' }}>{completed}</span>
                    <span className="stat-sub">{adherence.toFixed(0)}% adherencia</span>
                </div>
                <div className="glass-card stat-card">
                    <span className="stat-label">WIP Actual</span>
                    <span className="stat-value mono" style={{ fontSize: '1.8rem', color: 'var(--color-blue)' }}>{inProgress}</span>
                    <span className="stat-sub">tarjetas en proceso</span>
                </div>
                <div className="glass-card stat-card">
                    <span className="stat-label">Productos</span>
                    <span className="stat-value mono" style={{ fontSize: '1.8rem' }}>{products.length}</span>
                    <span className="stat-sub">programados</span>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid-2 dash-charts">
                {/* WIP Chart */}
                <div className="glass-card">
                    <h3 style={{ marginBottom: 'var(--space-md)' }}>📉 Inventario en Proceso (WIP)</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={wipData}>
                            <defs>
                                <linearGradient id="wipGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,255,218,0.07)" />
                            <XAxis dataKey="time" tick={{ fill: '#8892b0', fontSize: 11 }} />
                            <YAxis tick={{ fill: '#8892b0', fontSize: 11 }} />
                            <Tooltip contentStyle={{ background: '#112240', border: '1px solid rgba(100,255,218,0.2)', borderRadius: 8, color: '#ccd6f6' }} />
                            <Area type="monotone" dataKey="wip" stroke="#60a5fa" strokeWidth={2} fill="url(#wipGradient)" name="WIP" />
                            <Line type="monotone" dataKey="target" stroke="#f87171" strokeDasharray="5 5" strokeWidth={1.5} dot={false} name="Objetivo" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Lead Time Chart */}
                <div className="glass-card">
                    <h3 style={{ marginBottom: 'var(--space-md)' }}>⏱️ Lead Time</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={leadTimeData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,255,218,0.07)" />
                            <XAxis dataKey="time" tick={{ fill: '#8892b0', fontSize: 11 }} />
                            <YAxis tick={{ fill: '#8892b0', fontSize: 11 }} unit="h" />
                            <Tooltip contentStyle={{ background: '#112240', border: '1px solid rgba(100,255,218,0.2)', borderRadius: 8, color: '#ccd6f6' }} />
                            <Line type="monotone" dataKey="actual" stroke="#64ffda" strokeWidth={2} dot={{ fill: '#64ffda', r: 3 }} name="Actual" />
                            <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeDasharray="5 5" strokeWidth={1.5} dot={false} name="Objetivo" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid-2 dash-charts" style={{ marginTop: 'var(--space-lg)' }}>
                {/* Adherence Gauge */}
                <div className="glass-card dash-adherence">
                    <h3 style={{ marginBottom: 'var(--space-md)' }}>🎯 Adherencia al Plan</h3>
                    <div className="adherence-display">
                        <div className="adherence-ring">
                            <svg viewBox="0 0 120 120" className="adherence-svg">
                                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(100,255,218,0.1)" strokeWidth="8" />
                                <circle cx="60" cy="60" r="52" fill="none"
                                    stroke={adherence >= 80 ? '#34d399' : adherence >= 50 ? '#f59e0b' : '#f87171'}
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    strokeDasharray={`${(adherence / 100) * 327} 327`}
                                    transform="rotate(-90 60 60)"
                                    style={{ transition: 'stroke-dasharray 1s ease' }}
                                />
                                <text x="60" y="55" textAnchor="middle" fill="white" fontSize="24" fontWeight="700" fontFamily="var(--font-mono)">
                                    {Math.round(adherence)}%
                                </text>
                                <text x="60" y="72" textAnchor="middle" fill="#8892b0" fontSize="10">
                                    adherencia
                                </text>
                            </svg>
                        </div>
                        <div className="adherence-breakdown">
                            <div className="ab-row">
                                <span className="ab-dot" style={{ background: 'var(--color-green)' }} />
                                <span>Completadas</span>
                                <span className="mono">{completed}</span>
                            </div>
                            <div className="ab-row">
                                <span className="ab-dot" style={{ background: 'var(--color-blue)' }} />
                                <span>En Proceso</span>
                                <span className="mono">{inProgress}</span>
                            </div>
                            <div className="ab-row">
                                <span className="ab-dot" style={{ background: '#5a6588' }} />
                                <span>Pendientes</span>
                                <span className="mono">{pending}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Per Product Status */}
                <div className="glass-card">
                    <h3 style={{ marginBottom: 'var(--space-md)' }}>📊 Estado por Producto</h3>
                    {productStats.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={productStats} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,255,218,0.07)" />
                                <XAxis type="number" tick={{ fill: '#8892b0', fontSize: 11 }} />
                                <YAxis type="category" dataKey="name" tick={{ fill: '#8892b0', fontSize: 11 }} width={90} />
                                <Tooltip contentStyle={{ background: '#112240', border: '1px solid rgba(100,255,218,0.2)', borderRadius: 8, color: '#ccd6f6' }} />
                                <Bar dataKey="completed" stackId="a" fill="#34d399" name="Completadas" radius={[0, 0, 0, 0]} />
                                <Bar dataKey="wip" stackId="a" fill="#60a5fa" name="En Proceso" />
                                <Bar dataKey="pending" stackId="a" fill="#5a6588" name="Pendientes" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="empty-state">
                            <p className="text-muted">Llene la Caja Heijunka para ver estadísticas por producto.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
