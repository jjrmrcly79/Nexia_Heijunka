-- =======================================================
-- NexIA_Heijunka — Migración Supabase
-- Schema: heijunka  (independiente, multi-app)
-- RLS habilitado: cada usuario ve solo SUS datos
-- =======================================================

-- 1. Crear schema
CREATE SCHEMA IF NOT EXISTS heijunka;

-- 2. Extensiones
CREATE EXTENSION IF NOT EXISTS "pgcrypto" SCHEMA extensions;

-- -------------------------------------------------------
-- TABLA: profiles (perfil extendido — SaaS-ready)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS heijunka.profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name    TEXT,
  company      TEXT,
  role         TEXT NOT NULL DEFAULT 'analyst',
  avatar_url   TEXT,
  plan         TEXT NOT NULL DEFAULT 'free',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE heijunka.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profile_owner_all" ON heijunka.profiles
  FOR ALL USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profile_read_by_authenticated" ON heijunka.profiles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Trigger: crear perfil vacío al registrarse
CREATE OR REPLACE FUNCTION heijunka.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO heijunka.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_heijunka ON auth.users;
CREATE TRIGGER on_auth_user_created_heijunka
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION heijunka.handle_new_user();

-- -------------------------------------------------------
-- TABLA: sessions (raíz de cada sesión de trabajo)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS heijunka.sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL DEFAULT 'Mi Sesión',
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE heijunka.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_sessions" ON heijunka.sessions
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- -------------------------------------------------------
-- TABLA: products (catálogo de productos por sesión)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS heijunka.products (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id       UUID NOT NULL REFERENCES heijunka.sessions(id) ON DELETE CASCADE,
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  sku              TEXT NOT NULL DEFAULT '',
  weekly_demand    NUMERIC NOT NULL DEFAULT 0,
  pack_size        INTEGER NOT NULL DEFAULT 10,
  setup_time       NUMERIC NOT NULL DEFAULT 15,
  run_time_per_unit NUMERIC NOT NULL DEFAULT 0.5,
  demand_history   JSONB NOT NULL DEFAULT '[]',
  color            TEXT NOT NULL DEFAULT '#64ffda',
  "order"          INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE heijunka.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_products" ON heijunka.products
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- -------------------------------------------------------
-- TABLA: params (parámetros operativos por sesión)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS heijunka.params (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id             UUID NOT NULL REFERENCES heijunka.sessions(id) ON DELETE CASCADE,
  user_id                UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  available_time_per_shift INTEGER NOT NULL DEFAULT 480,
  shifts_per_day         INTEGER NOT NULL DEFAULT 1,
  working_days_per_week  INTEGER NOT NULL DEFAULT 5,
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (session_id)
);

ALTER TABLE heijunka.params ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_params" ON heijunka.params
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- -------------------------------------------------------
-- TABLA: board_cells (estado del tablero Heijunka)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS heijunka.board_cells (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  UUID NOT NULL REFERENCES heijunka.sessions(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cell_key    TEXT NOT NULL,
  cell_value  JSONB NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (session_id, cell_key)
);

ALTER TABLE heijunka.board_cells ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_board" ON heijunka.board_cells
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- -------------------------------------------------------
-- TABLA: performance_logs (log de rendimiento)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS heijunka.performance_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   UUID NOT NULL REFERENCES heijunka.sessions(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wip          NUMERIC,
  lead_time    NUMERIC,
  adherence    NUMERIC,
  logged_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE heijunka.performance_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_logs" ON heijunka.performance_logs
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- -------------------------------------------------------
-- Trigger: updated_at automático en todas las tablas
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION heijunka.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'profiles','sessions','products','params','board_cells'
  ] LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trg_updated_at ON heijunka.%I;
       CREATE TRIGGER trg_updated_at
       BEFORE UPDATE ON heijunka.%I
       FOR EACH ROW EXECUTE FUNCTION heijunka.set_updated_at();',
      t, t
    );
  END LOOP;
END;
$$;

-- -------------------------------------------------------
-- Permisos y exposición del schema en la API REST
-- (Agregar "heijunka" en API > Extra Search Path en el dashboard)
-- -------------------------------------------------------
GRANT USAGE ON SCHEMA heijunka TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA heijunka TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA heijunka TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA heijunka TO anon;
GRANT EXECUTE ON FUNCTION heijunka.handle_new_user() TO service_role;
