import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { calcTaktTime, calcPitch, calcEPEI } from '../utils/calculations';
import './Calculations.css';

export default function Calculations() {
    const { state } = useApp();
    const { products, params } = state;

    const totalAvailable = params.availableTimePerShift * params.shiftsPerDay;
    const totalWeeklyDemand = products.reduce((sum, p) => sum + (p.weeklyDemand || 0), 0);
    const dailyDemand = params.workingDaysPerWeek > 0 ? totalWeeklyDemand / params.workingDaysPerWeek : 0;

    const taktTime = useMemo(() => calcTaktTime(totalAvailable, dailyDemand), [totalAvailable, dailyDemand]);

    const avgPackSize = products.length > 0
        ? Math.round(products.reduce((s, p) => s + (p.packSize || 1), 0) / products.length)
        : 1;

    const pitch = useMemo(() => calcPitch(taktTime, avgPackSize), [taktTime, avgPackSize]);

    const productsForEPEI = useMemo(() =>
        products.map(p => ({
            ...p,
            demandPerDay: params.workingDaysPerWeek > 0 ? (p.weeklyDemand || 0) / params.workingDaysPerWeek : 0
        })),
        [products, params.workingDaysPerWeek]
    );

    const epei = useMemo(() => calcEPEI(productsForEPEI, totalAvailable, dailyDemand), [productsForEPEI, totalAvailable, dailyDemand]);

    const intervalsPerShift = pitch > 0 ? Math.floor(totalAvailable / pitch) : 0;

    return (
        <div className="page-container animate-fade-in">
            <div className="page-header">
                <div>
                    <h1>⚙️ Cálculos Lean</h1>
                    <p className="page-subtitle">Métricas fundamentales para la planificación de producción</p>
                </div>
            </div>

            {/* Input Summary */}
            <div className="glass-card calc-inputs-summary">
                <h4>📋 Datos de Entrada</h4>
                <div className="inputs-row">
                    <div className="input-chip">
                        <span className="chip-label">Tiempo Disponible</span>
                        <span className="chip-value mono">{totalAvailable} min</span>
                    </div>
                    <div className="input-chip">
                        <span className="chip-label">Demanda Diaria</span>
                        <span className="chip-value mono">{dailyDemand.toFixed(0)} uds</span>
                    </div>
                    <div className="input-chip">
                        <span className="chip-label">Productos</span>
                        <span className="chip-value mono">{products.length}</span>
                    </div>
                    <div className="input-chip">
                        <span className="chip-label">Tamaño Lote Prom.</span>
                        <span className="chip-value mono">{avgPackSize} uds</span>
                    </div>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid-3 calc-cards">
                {/* Takt Time */}
                <div className="glass-card calc-metric-card">
                    <div className="metric-header">
                        <span className="metric-icon" style={{ background: 'var(--color-accent-dim)' }}>⏱️</span>
                        <h3>Takt Time</h3>
                    </div>
                    <div className="metric-formula">
                        <code>Tiempo Disponible / Demanda Total</code>
                    </div>
                    <div className="metric-computation">
                        <span className="mono">{totalAvailable} min × 60 / {dailyDemand.toFixed(0)} uds</span>
                    </div>
                    <div className="metric-result">
                        <span className="result-value mono">{taktTime > 0 ? taktTime.toFixed(2) : '—'}</span>
                        <span className="result-unit">segundos</span>
                    </div>
                    <div className="metric-interpretation">
                        {taktTime > 0 ? (
                            <p>Se debe producir <strong>1 unidad cada {taktTime.toFixed(1)} segundos</strong> ({(taktTime / 60).toFixed(2)} min) para satisfacer la demanda del cliente.</p>
                        ) : (
                            <p className="text-muted">Ingrese datos de demanda y tiempo disponible para calcular.</p>
                        )}
                    </div>
                    <div className="metric-gauge">
                        <div className="gauge-bar">
                            <div className="gauge-fill" style={{
                                width: `${Math.min((taktTime / 300) * 100, 100)}%`,
                                background: taktTime > 120 ? 'var(--color-green)' : taktTime > 60 ? 'var(--color-amber)' : 'var(--color-red)'
                            }} />
                        </div>
                        <div className="gauge-labels">
                            <span>Rápido</span>
                            <span>Lento</span>
                        </div>
                    </div>
                </div>

                {/* Pitch */}
                <div className="glass-card calc-metric-card">
                    <div className="metric-header">
                        <span className="metric-icon" style={{ background: 'var(--color-amber-dim)' }}>📐</span>
                        <h3>Pitch</h3>
                    </div>
                    <div className="metric-formula">
                        <code>Takt Time × Tamaño de Lote</code>
                    </div>
                    <div className="metric-computation">
                        <span className="mono">{taktTime.toFixed(2)} seg × {avgPackSize} uds / 60</span>
                    </div>
                    <div className="metric-result">
                        <span className="result-value mono">{pitch > 0 ? pitch.toFixed(2) : '—'}</span>
                        <span className="result-unit">minutos</span>
                    </div>
                    <div className="metric-interpretation">
                        {pitch > 0 ? (
                            <>
                                <p>Cada <strong>{pitch.toFixed(1)} minutos</strong> se debe liberar una nueva orden de trabajo.</p>
                                <p className="stat-sub" style={{ marginTop: 8 }}>
                                    ≈ <strong className="text-accent">{intervalsPerShift}</strong> intervalos por turno
                                </p>
                            </>
                        ) : (
                            <p className="text-muted">Resultado depende del Takt Time.</p>
                        )}
                    </div>
                    <div className="metric-detail-grid">
                        <div className="detail-item">
                            <span className="detail-label">Intervalos/turno</span>
                            <span className="detail-value mono">{intervalsPerShift}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Uds/intervalo</span>
                            <span className="detail-value mono">{avgPackSize}</span>
                        </div>
                    </div>
                </div>

                {/* EPEI */}
                <div className="glass-card calc-metric-card">
                    <div className="metric-header">
                        <span className="metric-icon" style={{ background: 'var(--color-blue-dim)' }}>🔁</span>
                        <h3>EPEI</h3>
                    </div>
                    <div className="metric-formula">
                        <code>Σ Setup / (Tiempo Disp. − Σ Run)</code>
                    </div>
                    <div className="metric-computation">
                        <span className="mono">{epei.totalSetupTime.toFixed(0)} min / {epei.availableForSetup.toFixed(0)} min</span>
                    </div>
                    <div className="metric-result">
                        <span className="result-value mono">
                            {epei.epeiDays === Infinity ? '∞' : epei.epeiDays > 0 ? epei.epeiDays.toFixed(2) : '—'}
                        </span>
                        <span className="result-unit">días</span>
                    </div>
                    <div className="metric-interpretation">
                        {epei.epeiDays > 0 && epei.epeiDays !== Infinity ? (
                            <p>Se pueden ciclar <strong>todos los productos cada {epei.epeiDays.toFixed(1)} días</strong>.</p>
                        ) : epei.epeiDays === Infinity ? (
                            <p className="text-red">⚠️ Capacidad insuficiente: el tiempo de operación excede el tiempo disponible.</p>
                        ) : (
                            <p className="text-muted">Ingrese tiempos de setup y operación para calcular.</p>
                        )}
                    </div>
                    <div className="metric-detail-grid">
                        <div className="detail-item">
                            <span className="detail-label">Total Setup</span>
                            <span className="detail-value mono">{epei.totalSetupTime.toFixed(0)} min</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Tiempo Libre</span>
                            <span className="detail-value mono">{epei.availableForSetup.toFixed(0)} min</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Per-Product Breakdown */}
            <div className="glass-card" style={{ marginTop: 'var(--space-lg)' }}>
                <h3 style={{ marginBottom: 'var(--space-md)' }}>📊 Desglose por Producto</h3>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Demanda/Día</th>
                            <th>T.Op Total (min)</th>
                            <th>Setup (min)</th>
                            <th>Takt Ind. (seg)</th>
                            <th>Pitch Ind. (min)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productsForEPEI.map(p => {
                            const indTakt = p.demandPerDay > 0 ? (totalAvailable * 60) / p.demandPerDay : 0;
                            const indPitch = indTakt > 0 ? (indTakt * (p.packSize || 1)) / 60 : 0;
                            return (
                                <tr key={p.id}>
                                    <td>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
                                            {p.name}
                                        </span>
                                    </td>
                                    <td className="mono">{p.demandPerDay.toFixed(0)}</td>
                                    <td className="mono">{(p.demandPerDay * (p.runTimePerUnit || 0)).toFixed(1)}</td>
                                    <td className="mono">{p.setupTime || 0}</td>
                                    <td className="mono">{indTakt > 0 ? indTakt.toFixed(1) : '—'}</td>
                                    <td className="mono">{indPitch > 0 ? indPitch.toFixed(1) : '—'}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
