import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
    const { signIn, signUp } = useAuth();
    const [mode, setMode] = useState('login'); // 'login' | 'signup'
    const [form, setForm] = useState({ email: '', password: '', fullName: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    function set(field) {
        return e => setForm(f => ({ ...f, [field]: e.target.value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (mode === 'login') {
                await signIn(form.email, form.password);
            } else {
                if (!form.fullName.trim()) {
                    setError('El nombre completo es obligatorio.');
                    setLoading(false);
                    return;
                }
                await signUp(form.email, form.password, form.fullName);
            }
        } catch (err) {
            setError(err.message || 'Ocurrió un error. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page">
            <div className="login-bg" />

            <div className="login-card">
                {/* Header */}
                <div className="login-brand">
                    <span className="login-logo">⬡</span>
                    <div>
                        <div className="login-brand-name">Nexia</div>
                        <div className="login-brand-sub">Heijunka</div>
                    </div>
                </div>

                <h2 className="login-title">
                    {mode === 'login' ? 'Bienvenido de nuevo' : 'Crear cuenta'}
                </h2>
                <p className="login-subtitle">
                    {mode === 'login'
                        ? 'Inicia sesión para acceder a tu espacio de trabajo'
                        : 'Únete a la plataforma de Lean Manufacturing'}
                </p>

                <form onSubmit={handleSubmit} className="login-form">
                    {mode === 'signup' && (
                        <div className="login-field">
                            <label className="login-label">Nombre completo</label>
                            <input
                                className="login-input"
                                type="text"
                                placeholder="Juan García"
                                value={form.fullName}
                                onChange={set('fullName')}
                                required
                            />
                        </div>
                    )}

                    <div className="login-field">
                        <label className="login-label">Correo electrónico</label>
                        <input
                            className="login-input"
                            type="email"
                            placeholder="usuario@empresa.com"
                            value={form.email}
                            onChange={set('email')}
                            required
                        />
                    </div>

                    <div className="login-field">
                        <label className="login-label">Contraseña</label>
                        <input
                            className="login-input"
                            type="password"
                            placeholder={mode === 'signup' ? 'Mínimo 6 caracteres' : '••••••••'}
                            value={form.password}
                            onChange={set('password')}
                            required
                            minLength={6}
                        />
                    </div>

                    {error && <p className="login-error">⚠️ {error}</p>}

                    {mode === 'signup' && (
                        <p className="login-note">
                            Al registrarte podrás confirmar tu cuenta desde tu correo.
                        </p>
                    )}

                    <button
                        type="submit"
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading
                            ? 'Procesando…'
                            : mode === 'login'
                            ? 'Iniciar sesión'
                            : 'Crear cuenta'}
                    </button>
                </form>

                <div className="login-switch">
                    {mode === 'login' ? (
                        <>¿No tienes cuenta?{' '}
                            <button className="login-switch-btn" onClick={() => { setMode('signup'); setError(''); }}>
                                Regístrate
                            </button>
                        </>
                    ) : (
                        <>¿Ya tienes cuenta?{' '}
                            <button className="login-switch-btn" onClick={() => { setMode('login'); setError(''); }}>
                                Inicia sesión
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
