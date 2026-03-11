import { useState, useMemo, useRef, useCallback } from 'react';
import { MANUAL_SECTIONS } from './manualData';

function highlightText(html, query) {
    if (!query || query.length < 2) return html;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(${escaped})`, 'gi');
    return html.replace(/(<[^>]+>)/g, '\x00$1\x00').split('\x00').map(part =>
        part.startsWith('<') ? part : part.replace(re, '<mark>$1</mark>')
    ).join('');
}

export default function Manual() {
    const [search, setSearch] = useState('');
    const [openSections, setOpenSections] = useState(new Set([0]));
    const sectionRefs = useRef({});

    const filtered = useMemo(() => {
        if (!search || search.length < 2) return MANUAL_SECTIONS;
        const q = search.toLowerCase();
        return MANUAL_SECTIONS.filter(s =>
            s.title.toLowerCase().includes(q) ||
            s.keywords.toLowerCase().includes(q) ||
            s.content.toLowerCase().includes(q)
        );
    }, [search]);

    const toggle = useCallback((idx) => {
        setOpenSections(prev => {
            const next = new Set(prev);
            next.has(idx) ? next.delete(idx) : next.add(idx);
            return next;
        });
    }, []);

    const scrollTo = useCallback((id) => {
        const el = sectionRefs.current[id];
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            const sec = MANUAL_SECTIONS.find(s => s.id === id);
            if (sec) {
                setOpenSections(prev => new Set(prev).add(MANUAL_SECTIONS.indexOf(sec)));
            }
        }
    }, []);

    const expandAll = () => setOpenSections(new Set(MANUAL_SECTIONS.map((_, i) => i)));
    const collapseAll = () => setOpenSections(new Set());

    return (
        <div className="page-container">
            <div className="manual-page animate-fade-in">
                {/* Header */}
                <div className="page-header">
                    <div>
                        <h1>📘 Manual de Usuario</h1>
                        <p className="page-subtitle">
                            NexIA Heijunka — Sistema de Nivelación de Producción v1.0.0
                        </p>
                    </div>
                    <div className="page-header-actions">
                        <button className="btn btn-ghost btn-sm" onClick={expandAll}>
                            Expandir todo
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={collapseAll}>
                            Colapsar todo
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="manual-search-wrap">
                    <div className="manual-search-container">
                        <span className="manual-search-icon">🔍</span>
                        <input
                            className="manual-search"
                            type="text"
                            placeholder="Buscar en el manual... (ej: Takt Time, Kanban, ABC)"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table of Contents */}
                {!search && (
                    <div className="manual-toc glass-card">
                        <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            📑 Tabla de Contenido
                        </h3>
                        <div className="manual-toc-grid">
                            {MANUAL_SECTIONS.map(s => (
                                <div
                                    key={s.id}
                                    className="manual-toc-item"
                                    onClick={() => scrollTo(s.id)}
                                >
                                    <span className="manual-toc-num">{s.num}</span>
                                    <span>{s.icon}</span>
                                    <span>{s.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Search results summary */}
                {search && search.length >= 2 && (
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
                        {filtered.length === 0
                            ? `Sin resultados para "${search}"`
                            : `${filtered.length} sección${filtered.length !== 1 ? 'es' : ''} encontrada${filtered.length !== 1 ? 's' : ''}`
                        }
                    </p>
                )}

                {/* Sections */}
                {filtered.length === 0 ? (
                    <div className="manual-no-results">
                        <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.4 }}>🔍</div>
                        <p>No se encontraron resultados para "<strong>{search}</strong>"</p>
                        <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>
                            Intenta con otro término de búsqueda
                        </p>
                    </div>
                ) : (
                    filtered.map((section) => {
                        const globalIdx = MANUAL_SECTIONS.indexOf(section);
                        const isOpen = openSections.has(globalIdx) || (search && search.length >= 2);
                        return (
                            <div
                                key={section.id}
                                className="manual-section"
                                ref={el => sectionRefs.current[section.id] = el}
                            >
                                <div
                                    className="manual-section-header"
                                    onClick={() => toggle(globalIdx)}
                                >
                                    <span className="manual-section-icon">{section.icon}</span>
                                    <span className="manual-section-title">
                                        {section.num}. {section.title}
                                    </span>
                                    <span className={`manual-section-chevron ${isOpen ? 'open' : ''}`}>
                                        ▼
                                    </span>
                                </div>
                                {isOpen && (
                                    <div
                                        className="manual-section-body manual-subsection animate-fade-in"
                                        dangerouslySetInnerHTML={{
                                            __html: highlightText(section.content, search)
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
