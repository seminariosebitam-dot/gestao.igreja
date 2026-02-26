-- Tabela de categorias de patrimônio (opcional, ou podemos usar enum)
CREATE TYPE asset_status AS ENUM ('ativo', 'inativo', 'em_manutencao');

CREATE TABLE public.assets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    serial_number TEXT,
    acquisition_date DATE,
    value NUMERIC(10, 2),
    location TEXT,
    status asset_status DEFAULT 'ativo',
    photo_url TEXT,
    qr_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.asset_maintenance (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    scheduled_date DATE,
    completion_date DATE,
    cost NUMERIC(10, 2),
    responsible TEXT,
    status TEXT DEFAULT 'agendada',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para assets (Para ambiente com autenticação livre provisória)
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_maintenance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Assets are viewable by everyone" ON assets;
CREATE POLICY "Assets are viewable by everyone" ON assets FOR SELECT USING (true);
DROP POLICY IF EXISTS "Assets are insertable" ON assets;
CREATE POLICY "Assets are insertable" ON assets FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Assets are updatable" ON assets;
CREATE POLICY "Assets are updatable" ON assets FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Assets are deletable" ON assets;
CREATE POLICY "Assets are deletable" ON assets FOR DELETE USING (true);

DROP POLICY IF EXISTS "Maintenance viewable" ON asset_maintenance;
CREATE POLICY "Maintenance viewable" ON asset_maintenance FOR SELECT USING (true);
DROP POLICY IF EXISTS "Maintenance insertable" ON asset_maintenance;
CREATE POLICY "Maintenance insertable" ON asset_maintenance FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Maintenance updatable" ON asset_maintenance;
CREATE POLICY "Maintenance updatable" ON asset_maintenance FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Maintenance deletable" ON asset_maintenance;
CREATE POLICY "Maintenance deletable" ON asset_maintenance FOR DELETE USING (true);
