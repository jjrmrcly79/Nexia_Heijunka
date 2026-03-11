import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { classifyABC } from '../utils/abcAnalysis';
import { parseCSVFile, exportCSV } from '../utils/csvUtils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, ComposedChart, Area } from 'recharts';
import './DataEntry.css';

export default function DataEntry() {
    const { state, dispatch } = useApp();
    const { products, params } = state;
    const [tab, setTab] = useState('products');
    const [editingId, setEditingId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const fileInputRef = useRef();

    const classified = classifyABC(products);

    // ------- Handlers -------
    function handleAddProduct(formData) {
        dispatch({ type: 'ADD_PRODUCT', payload: formData });
        setShowAddModal(false);
    }

    function handleDeleteProduct(id) {
        dispatch({ type: 'DELETE_PRODUCT', payload: id });
    }

    function handleUpdateProduct(id, field, value) {
        dispatch({ type: 'UPDATE_PRODUCT', payload: { id, [field]: value } });
    }

    async function handleImportCSV(e) {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const data = await parseCSVFile(file);
            const mapped = data.map(row => ({
                name: row.name || row.nombre || row.producto || 'Sin nombre',
                sku: row.sku || row.codigo || '',
                weeklyDemand: Number(row.weekly_demand || row.demanda_semanal || row.demanda || 0),
                packSize: Number(row.pack_size || row.tamaño_lote || row.lote || 10),
                setupTime: Number(row.setup_time || row.tiempo_setup || row.cambio || 15),
                runTimePerUnit: Number(row.run_time || row.tiempo_operacion || 0.5),
                demandHistory: []
            }));
            dispatch({ type: 'IMPORT_PRODUCTS', payload: mapped });
        } catch (err) {
            alert('Error al importar CSV: ' + err.message);
        }
        e.target.value = '';
    }

    function handleExportCSV() {
        const data = products.map(p => ({
            nombre: p.name,
            sku: p.sku,
            demanda_semanal: p.weeklyDemand,
            tamaño_lote: p.packSize,
            tiempo_setup: p.setupTime,
            tiempo_operacion: p.runTimePerUnit
        }));
        exportCSV(data, 'productos_heijunka.csv');
    }

    function handleParamChange(field, value) {
        dispatch({ type: 'UPDATE_PARAMS', payload: { [field]: Number(value) } });
    }

    // ------- Pareto Chart Data -------
    const paretoData = classified.map(p => ({
        name: p.name.length > 12 ? p.name.substring(0, 12) + '…' : p.name,
        demanda: p.totalDemand,
        acumulado: p.cumulativePercent,
        clase: p.abcClass
    }));

    const ABC_COLORS = { A: 'var(--color-green)', B: 'var(--color-amber)', C: 'var(--color-red)' };

    return (
        <div className="page-container animate-fade-in">
            <div className="page-header">
                <div>
                    <h1>📊 Datos y Análisis de Demanda</h1>
                    <p className="page-subtitle">Gestione productos, historial de demanda y parámetros operativos</p>
                </div>
                <div className="page-header-actions">
                    <button className="btn btn-ghost" onClick={handleExportCSV}>📤 Exportar CSV</button>
                    <button className="btn btn-secondary" onClick={() => fileInputRef.current?.click()}>📥 Importar CSV</button>
                    <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>+ Nuevo Producto</button>
                    <input type="file" ref={fileInputRef} accept=".csv" onChange={handleImportCSV} style={{ display: 'none' }} />
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
                <button className={`tab-btn ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>Productos</button>
                <button className={`tab-btn ${tab === 'abc' ? 'active' : ''}`} onClick={() => setTab('abc')}>Análisis ABC</button>
                <button className={`tab-btn ${tab === 'params' ? 'active' : ''}`} onClick={() => setTab('params')}>Parámetros</button>
            </div>

            {/* Products Tab */}
            {tab === 'products' && (
                <div className="glass-card">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>SKU</th>
                                <th>Demanda Semanal</th>
                                <th>Tamaño Lote</th>
                                <th>Setup (min)</th>
                                <th>T.Op/Ud (min)</th>
                                <th>Clase</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => {
                                const cls = classified.find(c => c.id === p.id);
                                return (
                                    <tr key={p.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ width: 10, height: 10, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
                                                {editingId === p.id ? (
                                                    <input className="form-input form-input-mono" style={{ width: 140 }} value={p.name}
                                                        onChange={e => handleUpdateProduct(p.id, 'name', e.target.value)} />
                                                ) : p.name}
                                            </div>
                                        </td>
                                        <td className="mono">{p.sku}</td>
                                        <td>
                                            {editingId === p.id ? (
                                                <input type="number" className="form-input form-input-mono" style={{ width: 80 }} value={p.weeklyDemand}
                                                    onChange={e => handleUpdateProduct(p.id, 'weeklyDemand', Number(e.target.value))} />
                                            ) : <span className="mono">{p.weeklyDemand}</span>}
                                        </td>
                                        <td className="mono">{p.packSize}</td>
                                        <td className="mono">{p.setupTime}</td>
                                        <td className="mono">{p.runTimePerUnit}</td>
                                        <td><span className={`badge badge-${(cls?.abcClass || 'c').toLowerCase()}`}>{cls?.abcClass || '?'}</span></td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 4 }}>
                                                <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(editingId === p.id ? null : p.id)}>
                                                    {editingId === p.id ? '✓' : '✏️'}
                                                </button>
                                                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProduct(p.id)}>🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {products.length === 0 && (
                        <div className="empty-state">
                            <span className="empty-state-icon">📦</span>
                            <p>No hay productos. Agregue uno o importe desde CSV.</p>
                        </div>
                    )}
                </div>
            )}

            {/* ABC Analysis Tab */}
            {tab === 'abc' && (
                <div>
                    <div className="grid-3" style={{ marginBottom: 'var(--space-lg)' }}>
                        {['A', 'B', 'C'].map(cls => {
                            const items = classified.filter(p => p.abcClass === cls);
                            const labels = { A: 'Alto volumen / Estable', B: 'Volumen medio', C: 'Bajo volumen / Errático' };
                            return (
                                <div key={cls} className="glass-card stat-card">
                                    <span className="stat-label">Clase {cls}</span>
                                    <span className="stat-value" style={{ color: ABC_COLORS[cls] }}>{items.length}</span>
                                    <span className="stat-sub">{labels[cls]}</span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                        <h3 style={{ marginBottom: 'var(--space-md)' }}>Diagrama de Pareto</h3>
                        <ResponsiveContainer width="100%" height={350}>
                            <ComposedChart data={paretoData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,255,218,0.07)" />
                                <XAxis dataKey="name" tick={{ fill: '#8892b0', fontSize: 11 }} />
                                <YAxis yAxisId="left" tick={{ fill: '#8892b0', fontSize: 11 }} />
                                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fill: '#8892b0', fontSize: 11 }} unit="%" />
                                <Tooltip contentStyle={{ background: '#112240', border: '1px solid rgba(100,255,218,0.2)', borderRadius: 8, color: '#ccd6f6' }} />
                                <Bar yAxisId="left" dataKey="demanda" fill="#64ffda" radius={[4, 4, 0, 0]} opacity={0.8} />
                                <Line yAxisId="right" type="monotone" dataKey="acumulado" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 4 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="glass-card" style={{ marginTop: 'var(--space-lg)' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Demanda Total</th>
                                    <th>% Demanda</th>
                                    <th>% Acumulado</th>
                                    <th>Clase</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classified.map(p => (
                                    <tr key={p.id}>
                                        <td>{p.name}</td>
                                        <td className="mono">{p.totalDemand}</td>
                                        <td className="mono">{p.demandPercent}%</td>
                                        <td className="mono">{p.cumulativePercent}%</td>
                                        <td><span className={`badge badge-${p.abcClass.toLowerCase()}`}>{p.abcClass}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Parameters Tab */}
            {tab === 'params' && (
                <div className="grid-2">
                    <div className="glass-card">
                        <h3 style={{ marginBottom: 'var(--space-lg)' }}>⏱️ Tiempo Disponible</h3>
                        <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                            <label className="form-label">Tiempo por Turno (minutos)</label>
                            <input type="number" className="form-input form-input-mono" value={params.availableTimePerShift}
                                onChange={e => handleParamChange('availableTimePerShift', e.target.value)} />
                        </div>
                        <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                            <label className="form-label">Turnos por Día</label>
                            <input type="number" className="form-input form-input-mono" value={params.shiftsPerDay}
                                onChange={e => handleParamChange('shiftsPerDay', e.target.value)} min={1} max={3} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Días Laborales por Semana</label>
                            <input type="number" className="form-input form-input-mono" value={params.workingDaysPerWeek}
                                onChange={e => handleParamChange('workingDaysPerWeek', e.target.value)} min={1} max={7} />
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3 style={{ marginBottom: 'var(--space-lg)' }}>🔧 Tiempos de Setup por Producto</h3>
                        <p style={{ fontSize: '0.85rem', marginBottom: 'var(--space-md)' }}>
                            Tiempos de cambio de herramienta (SMED) para cada producto
                        </p>
                        {products.map(p => (
                            <div key={p.id} className="param-product-row">
                                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
                                    {p.name}
                                </span>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <input type="number" className="form-input form-input-mono" style={{ width: 80 }}
                                        value={p.setupTime} onChange={e => handleUpdateProduct(p.id, 'setupTime', Number(e.target.value))} />
                                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>min</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Add Product Modal */}
            {showAddModal && <AddProductModal onClose={() => setShowAddModal(false)} onAdd={handleAddProduct} />}
        </div>
    );
}

function AddProductModal({ onClose, onAdd }) {
    const [form, setForm] = useState({
        name: '', sku: '', weeklyDemand: 100, packSize: 10, setupTime: 15, runTimePerUnit: 0.5, demandHistory: []
    });

    function handleSubmit(e) {
        e.preventDefault();
        if (!form.name.trim()) return;
        onAdd(form);
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Nuevo Producto</h3>
                    <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                        <label className="form-label">Nombre</label>
                        <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ej: Producto Alpha" required />
                    </div>
                    <div className="grid-2" style={{ marginBottom: 'var(--space-md)' }}>
                        <div className="form-group">
                            <label className="form-label">SKU</label>
                            <input className="form-input form-input-mono" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} placeholder="SKU-XXX" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Demanda Semanal</label>
                            <input type="number" className="form-input form-input-mono" value={form.weeklyDemand} onChange={e => setForm({ ...form, weeklyDemand: Number(e.target.value) })} min={0} />
                        </div>
                    </div>
                    <div className="grid-2" style={{ marginBottom: 'var(--space-md)' }}>
                        <div className="form-group">
                            <label className="form-label">Tamaño Lote (pack)</label>
                            <input type="number" className="form-input form-input-mono" value={form.packSize} onChange={e => setForm({ ...form, packSize: Number(e.target.value) })} min={1} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Tiempo Setup (min)</label>
                            <input type="number" className="form-input form-input-mono" value={form.setupTime} onChange={e => setForm({ ...form, setupTime: Number(e.target.value) })} min={0} />
                        </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                        <label className="form-label">Tiempo Operación por Unidad (min)</label>
                        <input type="number" step="0.1" className="form-input form-input-mono" value={form.runTimePerUnit} onChange={e => setForm({ ...form, runTimePerUnit: Number(e.target.value) })} min={0} />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn btn-primary">Agregar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
