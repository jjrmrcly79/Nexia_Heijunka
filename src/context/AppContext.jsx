import { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const AppContext = createContext();

const PRODUCT_COLORS = [
    '#64ffda', '#f59e0b', '#60a5fa', '#f87171', '#a78bfa',
    '#34d399', '#fb923c', '#38bdf8', '#e879f9', '#fbbf24'
];

const DEFAULT_PARAMS = {
    availableTimePerShift: 480,
    shiftsPerDay: 1,
    workingDaysPerWeek: 5,
};

const DEMO_PRODUCTS = [
    { id: '1', name: 'Producto Alpha', sku: 'SKU-001', weeklyDemand: 500, packSize: 10, setupTime: 15, runTimePerUnit: 0.5, color: PRODUCT_COLORS[0], demandHistory: [480, 520, 490, 510, 505, 495, 500, 515, 485, 510, 490, 500] },
    { id: '2', name: 'Producto Beta',  sku: 'SKU-002', weeklyDemand: 300, packSize: 12, setupTime: 20, runTimePerUnit: 0.7, color: PRODUCT_COLORS[1], demandHistory: [290, 310, 300, 285, 305, 295, 310, 300, 295, 305, 290, 310] },
    { id: '3', name: 'Producto Gamma', sku: 'SKU-003', weeklyDemand: 150, packSize: 8,  setupTime: 25, runTimePerUnit: 1.0, color: PRODUCT_COLORS[2], demandHistory: [140, 160, 145, 155, 150, 148, 152, 160, 142, 155, 150, 148] },
];

const initialState = {
    products: [],
    params: DEFAULT_PARAMS,
    boardState: {},
    performanceLogs: [],
    dbSessionId: null, // UUID de la sesión activa en Supabase
    dataLoaded: false, // flag para spinner de carga
};

// ---- Reducer (sin cambios respecto al original) ----
function appReducer(state, action) {
    switch (action.type) {
        case 'ADD_PRODUCT': {
            const id = Date.now().toString();
            const colorIdx = state.products.length % PRODUCT_COLORS.length;
            return { ...state, products: [...state.products, { ...action.payload, id, color: PRODUCT_COLORS[colorIdx] }] };
        }
        case 'UPDATE_PRODUCT':
            return { ...state, products: state.products.map(p => p.id === action.payload.id ? { ...p, ...action.payload } : p) };
        case 'DELETE_PRODUCT':
            return { ...state, products: state.products.filter(p => p.id !== action.payload) };
        case 'IMPORT_PRODUCTS':
            return { ...state, products: action.payload.map((p, i) => ({ ...p, id: p.id || Date.now().toString() + i, color: p.color || PRODUCT_COLORS[i % PRODUCT_COLORS.length] })) };
        case 'UPDATE_PARAMS':
            return { ...state, params: { ...state.params, ...action.payload } };
        case 'SET_BOARD_CELL':
            return { ...state, boardState: { ...state.boardState, [action.payload.key]: action.payload.value } };
        case 'CLEAR_BOARD_CELL': {
            const nb = { ...state.boardState };
            delete nb[action.payload];
            return { ...state, boardState: nb };
        }
        case 'SET_BOARD':
            return { ...state, boardState: action.payload };
        case 'CLEAR_BOARD':
            return { ...state, boardState: {} };
        case 'ADD_PERFORMANCE_LOG':
            return { ...state, performanceLogs: [...state.performanceLogs, { ...action.payload, date: new Date().toISOString() }] };
        case 'SET_PERFORMANCE_LOGS':
            return { ...state, performanceLogs: action.payload };
        case 'RESET_ALL':
            return { ...initialState, dbSessionId: state.dbSessionId, dataLoaded: true };

        // Internal — set from Supabase load
        case '_SET_FROM_DB':
            return { ...state, ...action.payload, dataLoaded: true };

        default:
            return state;
    }
}

// ---- Helpers: DB ↔ app field mapping ----
function dbProductToApp(r) {
    return {
        id: r.id,
        name: r.name,
        sku: r.sku,
        weeklyDemand: r.weekly_demand,
        packSize: r.pack_size,
        setupTime: r.setup_time,
        runTimePerUnit: r.run_time_per_unit,
        demandHistory: r.demand_history ?? [],
        color: r.color,
        order: r.order ?? 0,
    };
}

function appProductToDb(p, sessionId, userId) {
    return {
        id: p.id,
        session_id: sessionId,
        user_id: userId,
        name: p.name,
        sku: p.sku,
        weekly_demand: p.weeklyDemand,
        pack_size: p.packSize,
        setup_time: p.setupTime,
        run_time_per_unit: p.runTimePerUnit,
        demand_history: p.demandHistory ?? [],
        color: p.color,
        order: p.order ?? 0,
    };
}

// ---- Provider ----
export function AppProvider({ children }) {
    const { user } = useAuth();
    const [state, dispatch] = useReducer(appReducer, initialState);
    const sessionIdRef = useRef(null);
    // Track previous state to avoid redundant saves
    const prevStateRef = useRef(state);

    // 1. When user logs in — load or create their session
    useEffect(() => {
        if (!user) return;
        loadUserData(user);
    }, [user]);

    // 2. Sync to Supabase whenever relevant state changes
    useEffect(() => {
        if (!state.dataLoaded || !user || !sessionIdRef.current) return;
        const prev = prevStateRef.current;
        // Only sync when something actually changed
        if (
            state.products === prev.products &&
            state.params === prev.params &&
            state.boardState === prev.boardState &&
            state.performanceLogs === prev.performanceLogs
        ) {
            prevStateRef.current = state;
            return;
        }
        prevStateRef.current = state;
        syncToDb(state, user, sessionIdRef.current);
    }, [state, user]);

    async function loadUserData(u) {
        try {
            // Get or create session
            let { data: sessions, error } = await supabase
                .from('sessions')
                .select('id')
                .eq('user_id', u.id)
                .order('created_at', { ascending: false })
                .limit(1);

            if (error) throw error;

            let sessionId;
            if (!sessions || sessions.length === 0) {
                // First time: create session + demo products
                const { data: newSession, error: se } = await supabase
                    .from('sessions')
                    .insert({ user_id: u.id, name: 'Mi Sesión Heijunka' })
                    .select('id')
                    .single();
                if (se) throw se;
                sessionId = newSession.id;
                sessionIdRef.current = sessionId;

                // Seed with demo products
                const demoRows = DEMO_PRODUCTS.map((p, i) => appProductToDb({ ...p }, sessionId, u.id));
                await supabase.from('products').insert(demoRows);

                // Seed params
                await supabase.from('params').upsert({
                    session_id: sessionId,
                    user_id: u.id,
                    available_time_per_shift: DEFAULT_PARAMS.availableTimePerShift,
                    shifts_per_day: DEFAULT_PARAMS.shiftsPerDay,
                    working_days_per_week: DEFAULT_PARAMS.workingDaysPerWeek,
                });

                dispatch({ type: '_SET_FROM_DB', payload: { products: DEMO_PRODUCTS, params: DEFAULT_PARAMS, boardState: {}, performanceLogs: [], dbSessionId: sessionId } });
            } else {
                sessionId = sessions[0].id;
                sessionIdRef.current = sessionId;

                // Load products, params, board, logs in parallel
                const [
                    { data: productsData },
                    { data: paramsData },
                    { data: boardData },
                    { data: logsData },
                ] = await Promise.all([
                    supabase.from('products').select('*').eq('session_id', sessionId).order('order'),
                    supabase.from('params').select('*').eq('session_id', sessionId).single(),
                    supabase.from('board_cells').select('cell_key, cell_value').eq('session_id', sessionId),
                    supabase.from('performance_logs').select('*').eq('session_id', sessionId).order('logged_at'),
                ]);

                const products = (productsData || []).map(dbProductToApp);

                const params = paramsData
                    ? {
                        availableTimePerShift: paramsData.available_time_per_shift,
                        shiftsPerDay: paramsData.shifts_per_day,
                        workingDaysPerWeek: paramsData.working_days_per_week,
                    }
                    : DEFAULT_PARAMS;

                const boardState = Object.fromEntries(
                    (boardData || []).map(r => [r.cell_key, r.cell_value])
                );

                const performanceLogs = (logsData || []).map(r => ({
                    date: r.logged_at,
                    wip: r.wip,
                    leadTime: r.lead_time,
                    adherence: r.adherence,
                }));

                dispatch({ type: '_SET_FROM_DB', payload: { products, params, boardState, performanceLogs, dbSessionId: sessionId } });
            }
        } catch (err) {
            console.warn('[Heijunka] Error loading data from Supabase:', err.message);
            // Fallback: use demo data so the app doesn't break
            dispatch({ type: '_SET_FROM_DB', payload: { products: DEMO_PRODUCTS, params: DEFAULT_PARAMS, boardState: {}, performanceLogs: [], dbSessionId: null } });
        }
    }

    async function syncToDb(st, u, sessionId) {
        if (!sessionId) return;
        try {
            // Products: full replace via upsert
            const productRows = st.products.map((p, i) => appProductToDb({ ...p, order: i }, sessionId, u.id));
            if (productRows.length > 0) {
                await supabase.from('products').upsert(productRows, { onConflict: 'id' });
            }

            // Params
            await supabase.from('params').upsert({
                session_id: sessionId,
                user_id: u.id,
                available_time_per_shift: st.params.availableTimePerShift,
                shifts_per_day: st.params.shiftsPerDay,
                working_days_per_week: st.params.workingDaysPerWeek,
            }, { onConflict: 'session_id' });

            // Board cells: upsert each
            const boardRows = Object.entries(st.boardState).map(([key, val]) => ({
                session_id: sessionId,
                user_id: u.id,
                cell_key: key,
                cell_value: val,
            }));
            if (boardRows.length > 0) {
                await supabase.from('board_cells').upsert(boardRows, { onConflict: 'session_id,cell_key' });
            }
        } catch (err) {
            console.warn('[Heijunka] Error syncing to Supabase:', err.message);
        }
    }

    // Wrap dispatch so performance logs are also persisted
    async function wrappedDispatch(action) {
        dispatch(action);
        if (action.type === 'ADD_PERFORMANCE_LOG' && user && sessionIdRef.current) {
            try {
                await supabase.from('performance_logs').insert({
                    session_id: sessionIdRef.current,
                    user_id: user.id,
                    wip: action.payload.wip ?? null,
                    lead_time: action.payload.leadTime ?? null,
                    adherence: action.payload.adherence ?? null,
                });
            } catch (err) {
                console.warn('[Heijunka] Error saving performance log:', err.message);
            }
        }
        // Handle product deletion: remove from DB
        if (action.type === 'DELETE_PRODUCT' && user && sessionIdRef.current) {
            supabase.from('products').delete().eq('id', action.payload).then();
        }
        // Handle board cell clear
        if (action.type === 'CLEAR_BOARD_CELL' && user && sessionIdRef.current) {
            supabase.from('board_cells').delete()
                .eq('session_id', sessionIdRef.current)
                .eq('cell_key', action.payload).then();
        }
        // Handle board clear
        if (action.type === 'CLEAR_BOARD' && user && sessionIdRef.current) {
            supabase.from('board_cells').delete()
                .eq('session_id', sessionIdRef.current).then();
        }
    }

    return (
        <AppContext.Provider value={{ state, dispatch: wrappedDispatch }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
}

export { PRODUCT_COLORS };
