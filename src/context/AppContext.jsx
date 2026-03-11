import { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const STORAGE_KEY = 'nexia-heijunka-data';

const PRODUCT_COLORS = [
    '#64ffda', '#f59e0b', '#60a5fa', '#f87171', '#a78bfa',
    '#34d399', '#fb923c', '#38bdf8', '#e879f9', '#fbbf24'
];

// Demo data for first load
const DEMO_PRODUCTS = [
    { id: '1', name: 'Producto Alpha', sku: 'SKU-001', weeklyDemand: 500, packSize: 10, setupTime: 15, runTimePerUnit: 0.5, color: PRODUCT_COLORS[0], demandHistory: [480, 520, 490, 510, 505, 495, 500, 515, 485, 510, 490, 500] },
    { id: '2', name: 'Producto Beta', sku: 'SKU-002', weeklyDemand: 300, packSize: 12, setupTime: 20, runTimePerUnit: 0.7, color: PRODUCT_COLORS[1], demandHistory: [290, 310, 300, 285, 305, 295, 310, 300, 295, 305, 290, 310] },
    { id: '3', name: 'Producto Gamma', sku: 'SKU-003', weeklyDemand: 150, packSize: 8, setupTime: 25, runTimePerUnit: 1.0, color: PRODUCT_COLORS[2], demandHistory: [140, 160, 145, 155, 150, 148, 152, 160, 142, 155, 150, 148] },
    { id: '4', name: 'Producto Delta', sku: 'SKU-004', weeklyDemand: 80, packSize: 6, setupTime: 30, runTimePerUnit: 1.2, color: PRODUCT_COLORS[3], demandHistory: [75, 85, 70, 90, 80, 78, 82, 88, 72, 85, 80, 76] },
    { id: '5', name: 'Producto Epsilon', sku: 'SKU-005', weeklyDemand: 30, packSize: 4, setupTime: 35, runTimePerUnit: 1.5, color: PRODUCT_COLORS[4], demandHistory: [20, 40, 25, 35, 30, 45, 15, 38, 28, 32, 22, 42] },
];

const DEFAULT_PARAMS = {
    availableTimePerShift: 480,  // minutes (8 hours)
    shiftsPerDay: 1,
    workingDaysPerWeek: 5,
};

const initialState = {
    products: DEMO_PRODUCTS,
    params: DEFAULT_PARAMS,
    boardState: {},      // { [cellKey]: { productId, status, ... } }
    performanceLogs: [], // { date, wip, leadTime, adherence }
};

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            return { ...initialState, ...parsed };
        }
    } catch (e) {
        console.warn('Failed to load state from localStorage:', e);
    }
    return initialState;
}

function saveState(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.warn('Failed to save state:', e);
    }
}

function appReducer(state, action) {
    switch (action.type) {
        // Products
        case 'ADD_PRODUCT': {
            const id = Date.now().toString();
            const colorIdx = state.products.length % PRODUCT_COLORS.length;
            return {
                ...state,
                products: [...state.products, { ...action.payload, id, color: PRODUCT_COLORS[colorIdx] }]
            };
        }
        case 'UPDATE_PRODUCT':
            return {
                ...state,
                products: state.products.map(p => p.id === action.payload.id ? { ...p, ...action.payload } : p)
            };
        case 'DELETE_PRODUCT':
            return {
                ...state,
                products: state.products.filter(p => p.id !== action.payload)
            };
        case 'IMPORT_PRODUCTS':
            return {
                ...state,
                products: action.payload.map((p, i) => ({
                    ...p,
                    id: p.id || Date.now().toString() + i,
                    color: p.color || PRODUCT_COLORS[i % PRODUCT_COLORS.length]
                }))
            };

        // Params
        case 'UPDATE_PARAMS':
            return { ...state, params: { ...state.params, ...action.payload } };

        // Board
        case 'SET_BOARD_CELL':
            return {
                ...state,
                boardState: { ...state.boardState, [action.payload.key]: action.payload.value }
            };
        case 'CLEAR_BOARD_CELL': {
            const newBoard = { ...state.boardState };
            delete newBoard[action.payload];
            return { ...state, boardState: newBoard };
        }
        case 'SET_BOARD':
            return { ...state, boardState: action.payload };
        case 'CLEAR_BOARD':
            return { ...state, boardState: {} };

        // Performance
        case 'ADD_PERFORMANCE_LOG':
            return {
                ...state,
                performanceLogs: [...state.performanceLogs, { ...action.payload, date: new Date().toISOString() }]
            };
        case 'SET_PERFORMANCE_LOGS':
            return { ...state, performanceLogs: action.payload };

        // Reset
        case 'RESET_ALL':
            return initialState;

        default:
            return state;
    }
}

export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, null, loadState);

    useEffect(() => {
        saveState(state);
    }, [state]);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
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
