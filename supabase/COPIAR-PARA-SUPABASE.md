# Scripts para copiar e colar no Supabase SQL Editor

**Instrução:** Abra o Supabase → SQL Editor. Para cada script abaixo:
1. Selecione TODO o bloco de codigo SQL (nao inclua titulos nem linhas com ---)
2. Copie (Ctrl+C)
3. Cole no SQL Editor (Ctrl+V)
4. Execute (Run)

**Importante:** Os scripts nao tem comentarios - copie todo o bloco de cada secao.

---

## 1. add-avatar-url-profiles.sql

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

---

## 2. add-registration-completed.sql

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS registration_completed BOOLEAN DEFAULT false;
COMMENT ON COLUMN profiles.registration_completed IS 'Se membro/congregado ja completou o formulario de cadastro';

---

## 3. add_discipleship_tenant.sql (pular se nao tiver tabela discipleships)

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'discipleships') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = 'discipleships' AND column_name = 'church_id'
        ) THEN
            ALTER TABLE discipleships ADD COLUMN church_id UUID REFERENCES churches(id);
        END IF;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'discipleships') THEN
        ALTER TABLE discipleships ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Tenant isolation for discipleships" ON discipleships;
        CREATE POLICY "Tenant isolation for discipleships" ON discipleships
        FOR ALL USING (
            church_id = (SELECT church_id FROM profiles WHERE id = auth.uid()) 
            OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'superadmin'
        );
    END IF;
END $$;

---

## 4. apply-rls-isolation.sql ⭐ OBRIGATÓRIO

DROP FUNCTION IF EXISTS get_my_church_id() CASCADE;
DROP FUNCTION IF EXISTS get_my_role() CASCADE;

CREATE OR REPLACE FUNCTION get_my_church_id()
RETURNS UUID AS $fn1$
BEGIN
  RETURN (SELECT church_id FROM public.profiles WHERE id = auth.uid());
END;
$fn1$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $fn2$
BEGIN
  RETURN (SELECT role FROM public.profiles WHERE id = auth.uid());
END;
$fn2$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Tenant isolation for profiles" ON profiles;
DROP POLICY IF EXISTS "profiles_isolation" ON profiles;

CREATE POLICY "profiles_isolation" ON profiles
FOR ALL USING (
  id = auth.uid() OR
  church_id = get_my_church_id() OR
  get_my_role() = 'superadmin'
);

DROP POLICY IF EXISTS "Members are viewable by authenticated users" ON members;
DROP POLICY IF EXISTS "Members are insertable by admins and secretaries" ON members;
DROP POLICY IF EXISTS "Members are updatable by admins and secretaries" ON members;
DROP POLICY IF EXISTS "Members are deletable by admins" ON members;
DROP POLICY IF EXISTS "Tenant isolation for members" ON members;

CREATE POLICY "tenant_isolation_members" ON members
FOR ALL USING (church_id = get_my_church_id() OR get_my_role() = 'superadmin');

DROP POLICY IF EXISTS "Ministries are viewable" ON ministries;
DROP POLICY IF EXISTS "Ministries are insertable" ON ministries;
DROP POLICY IF EXISTS "Ministries are updatable" ON ministries;
DROP POLICY IF EXISTS "Ministries are deletable" ON ministries;
DROP POLICY IF EXISTS "Tenant isolation for ministries" ON ministries;

CREATE POLICY "tenant_isolation_ministries" ON ministries
FOR ALL USING (church_id = get_my_church_id() OR get_my_role() = 'superadmin');

DROP POLICY IF EXISTS "Cells are viewable by authenticated users" ON cells;
DROP POLICY IF EXISTS "Cells are insertable by admins and leaders" ON cells;
DROP POLICY IF EXISTS "Cells are updatable by admins and leaders" ON cells;
DROP POLICY IF EXISTS "Cells are deletable by admins" ON cells;
DROP POLICY IF EXISTS "Tenant isolation for cells" ON cells;

CREATE POLICY "tenant_isolation_cells" ON cells
FOR ALL USING (church_id = get_my_church_id() OR get_my_role() = 'superadmin');

DROP POLICY IF EXISTS "Tenant isolation for events" ON events;

CREATE POLICY "tenant_isolation_events" ON events
FOR ALL USING (church_id = get_my_church_id() OR get_my_role() = 'superadmin');

DROP POLICY IF EXISTS "Financial transactions viewable by admins and treasurers" ON financial_transactions;
DROP POLICY IF EXISTS "Financial transactions insertable by admins and treasurers" ON financial_transactions;
DROP POLICY IF EXISTS "Financial transactions updatable by admins and treasurers" ON financial_transactions;
DROP POLICY IF EXISTS "Financial transactions deletable by admins" ON financial_transactions;
DROP POLICY IF EXISTS "Tenant isolation for financial" ON financial_transactions;

CREATE POLICY "tenant_isolation_financial" ON financial_transactions
FOR ALL USING (church_id = get_my_church_id() OR get_my_role() = 'superadmin');

ALTER TABLE members ADD COLUMN IF NOT EXISTS church_id UUID REFERENCES churches(id);
ALTER TABLE ministries ADD COLUMN IF NOT EXISTS church_id UUID REFERENCES churches(id);
ALTER TABLE cells ADD COLUMN IF NOT EXISTS church_id UUID REFERENCES churches(id);
ALTER TABLE events ADD COLUMN IF NOT EXISTS church_id UUID REFERENCES churches(id);
ALTER TABLE financial_transactions ADD COLUMN IF NOT EXISTS church_id UUID REFERENCES churches(id);

SELECT 'RLS de isolamento multi-tenant aplicado com sucesso.' as status;

---

## 5. fix-church-delete-cascade.sql

ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_church_id_fkey;
ALTER TABLE notifications ADD CONSTRAINT notifications_church_id_fkey 
  FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE CASCADE;

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_church_id_fkey;
ALTER TABLE profiles ADD CONSTRAINT profiles_church_id_fkey 
  FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE SET NULL;

ALTER TABLE members DROP CONSTRAINT IF EXISTS members_church_id_fkey;
ALTER TABLE members ADD CONSTRAINT members_church_id_fkey 
  FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE CASCADE;

ALTER TABLE ministries DROP CONSTRAINT IF EXISTS ministries_church_id_fkey;
ALTER TABLE ministries ADD CONSTRAINT ministries_church_id_fkey 
  FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE CASCADE;

ALTER TABLE cells DROP CONSTRAINT IF EXISTS cells_church_id_fkey;
ALTER TABLE cells ADD CONSTRAINT cells_church_id_fkey 
  FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE CASCADE;

ALTER TABLE events DROP CONSTRAINT IF EXISTS events_church_id_fkey;
ALTER TABLE events ADD CONSTRAINT events_church_id_fkey 
  FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE CASCADE;

ALTER TABLE financial_transactions DROP CONSTRAINT IF EXISTS financial_transactions_church_id_fkey;
ALTER TABLE financial_transactions ADD CONSTRAINT financial_transactions_church_id_fkey 
  FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE CASCADE;

ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_church_id_fkey;
ALTER TABLE documents ADD CONSTRAINT documents_church_id_fkey 
  FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE CASCADE;

SELECT 'Constraints atualizadas. A remoção de igrejas deve funcionar.' as status;

---

**Ordem mínima recomendada:** 1 → 2 → 3 → 4 → 5

O script **4 (apply-rls-isolation)** é o mais importante para segurança multi-tenant.

Se o seu banco já tiver schema e outras migrações, você pode precisar executar outros scripts. Veja o `README-SQL.md` para a lista completa.
