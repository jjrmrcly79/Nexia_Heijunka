import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { calcTaktTime, calcPitch, levelVolume, levelMix, generateIntervals } from '../utils/calculations';
import './HeijunkaBox.css';

const STATUSES = {
    pending: { label: 'Pendiente', color: 'var(--color-text-muted)', icon: '⬜' },
    inProgress: { label: 'En Proceso', color: 'var(--color-blue)', icon: '🔵' },
    completed: { label: 'Completado', color: 'var(--color-green)', icon: '✅' },
};

export default function HeijunkaBox() {
    const { state, dispatch } = useApp();
    const { products, params, boardState } = state;
    const [selectedCell, setSelectedCell] = useState(null);

    const totalAvailable = params.availableTimePerShift * params.shiftsPerDay;
    const totalWeeklyDemand = products.reduce((sum, p) => sum + (p.weeklyDemand || 0), 0);
    const dailyDemand = params.workingDaysPerWeek > 0 ? totalWeeklyDemand / params.workingDaysPerWeek : 0;
    const taktTime = calcTaktTime(totalAvailable, dailyDemand);
    const avgPackSize = products.length > 0
        ? Math.round(products.reduce((s, p) => s + (p.packSize || 1), 0) / products.length)
        : 1;
    const pitch = calcPitch(taktTime, avgPackSize);

    const intervals = useMemo(() => generateIntervals(totalAvailable, pitch), [totalAvailable, pitch]);

    const leveledProducts = useMemo(() => levelVolume(products, params.workingDaysPerWeek), [products, params.workingDaysPerWeek]);
    const mixSequence = useMemo(() => levelMix(leveledProducts), [leveledProducts]);

    function autoFillBoard() {
        const newBoard = {};
        let seqIdx = 0;

        for (let col = 0; col < intervals.length && seqIdx < mixSequence.length; col++) {
            const item = mixSequence[seqIdx];
            if (item) {
                const key = `${item.id}-${col}`;
                newBoard[key] = {
                    productId: item.id,
                    productName: item.name,
                    color: item.color,
                    interval: col,
                    quantity: leveledProducts.find(p => p.id === item.id)?.packSize || avgPackSize,
                    status: 'pending'
                };
                seqIdx++;
            }
        }
        dispatch({ type: 'SET_BOARD', payload: newBoard });
    }

    function clearBoard() {
        dispatch({ type: 'CLEAR_BOARD' });
    }

    function toggleCellStatus(key) {
        const cell = boardState[key];
        if (!cell) return;
        const order = ['pending', 'inProgress', 'completed'];
        const nextIdx = (order.indexOf(cell.status) + 1) % order.length;
        dispatch({
            type: 'SET_BOARD_CELL',
            payload: { key, value: { ...cell, status: order[nextIdx] } }
        });
    }

    function getCellForProductInterval(productId, intervalIdx) {
        const key = `${productId}-${intervalIdx}`;
        return boardState[key] ? { key, ...boardState[key] } : null;
    }

    // Stats
    const allCells = Object.values(boardState);
    const totalCards = allCells.length;
    const completed = allCells.filter(c => c.status === 'completed').length;
    const inProgress = allCells.filter(c => c.status === 'inProgress').length;
    const pending = allCells.filter(c => c.status === 'pending').length;

    return (
        <div className="page-container animate-fade-in">
            <div className="page-header">
                <div>
                    <h1>📦 Caja Heijunka Digital</h1>
                    <p className="page-subtitle">Tablero interactivo de nivelación con tarjetas Kanban</p>
                </div>
                <div className="page-header-actions">
                    <button className="btn btn-danger btn-sm" onClick={clearBoard}>🗑️ Limpiar</button>
                    <button className="btn btn-primary" onClick={autoFillBoard}>⚡ Auto-llenar desde Secuencia</button>
                </div>
            </div>

            {/* Board stats */}
            <div className="grid-4" style={{ marginBottom: 'var(--space-lg)' }}>
                <div className="glass-card stat-card">
                    <span className="stat-label">Total Tarjetas</span>
                    <span className="stat-value mono" style={{ fontSize: '1.4rem' }}>{totalCards}</span>
                </div>
                <div className="glass-card stat-card">
                    <span className="stat-label">⬜ Pendientes</span>
                    <span className="stat-value mono" style={{ fontSize: '1.4rem', color: 'var(--color-text-muted)' }}>{pending}</span>
                </div>
                <div className="glass-card stat-card">
                    <span className="stat-label">🔵 En Proceso</span>
                    <span className="stat-value mono" style={{ fontSize: '1.4rem', color: 'var(--color-blue)' }}>{inProgress}</span>
                </div>
                <div className="glass-card stat-card">
                    <span className="stat-label">✅ Completados</span>
                    <span className="stat-value mono" style={{ fontSize: '1.4rem', color: 'var(--color-green)' }}>{completed}</span>
                </div>
            </div>

            {/* Pitch info */}
            {pitch > 0 && (
                <div className="heijunka-pitch-info">
                    <span>Pitch: <strong className="mono">{pitch.toFixed(1)} min</strong></span>
                    <span>·</span>
                    <span>Intervalos: <strong className="mono">{intervals.length}</strong></span>
                    <span>·</span>
                    <span>Takt: <strong className="mono">{taktTime.toFixed(1)} seg</strong></span>
                </div>
            )}

            {/* The Heijunka Grid */}
            {intervals.length > 0 && products.length > 0 ? (
                <div className="heijunka-grid-wrapper">
                    <div className="heijunka-grid">
                        {/* Header row */}
                        <div className="hg-corner">Producto / Intervalo</div>
                        {intervals.map(interval => (
                            <div key={interval.index} className="hg-col-header">
                                <span className="hg-interval-num mono">#{interval.index + 1}</span>
                                <span className="hg-interval-time mono">{interval.label}</span>
                            </div>
                        ))}

                        {/* Product rows */}
                        {products.map(product => (
                            <>
                                <div key={`row-${product.id}`} className="hg-row-header">
                                    <span className="hg-product-dot" style={{ background: product.color }} />
                                    <span className="hg-product-name">{product.name}</span>
                                </div>
                                {intervals.map(interval => {
                                    const cell = getCellForProductInterval(product.id, interval.index);
                                    return (
                                        <div
                                            key={`${product.id}-${interval.index}`}
                                            className={`hg-cell ${cell ? 'hg-cell-filled' : ''} ${cell ? `hg-status-${cell.status}` : ''}`}
                                            onClick={() => cell ? toggleCellStatus(cell.key) : null}
                                            title={cell ? `${STATUSES[cell.status].label} — Click para cambiar estado` : 'Vacío'}
                                        >
                                            {cell && (
                                                <div className="kanban-card" style={{ '--card-color': cell.color }}>
                                                    <span className="kanban-status">{STATUSES[cell.status].icon}</span>
                                                    <span className="kanban-qty mono">{cell.quantity}</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="glass-card empty-state">
                    <span className="empty-state-icon">📦</span>
                    <p>Configure productos y parámetros para generar la caja Heijunka.</p>
                    <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: 8 }}>
                        El Pitch debe ser {">"} 0 para crear intervalos.
                    </p>
                </div>
            )}

            {/* Legend */}
            <div className="heijunka-legend">
                {Object.entries(STATUSES).map(([key, val]) => (
                    <span key={key} className="legend-item">
                        <span>{val.icon}</span>
                        <span>{val.label}</span>
                    </span>
                ))}
                <span className="legend-item text-muted" style={{ marginLeft: 'auto', fontSize: '0.75rem' }}>
                    Click en una tarjeta para cambiar su estado
                </span>
            </div>
        </div>
    );
}
