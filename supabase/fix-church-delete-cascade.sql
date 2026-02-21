-- =====================================================
-- CORRIGIR REMOÇÃO DE IGREJAS (Super Admin)
-- =====================================================
-- Execute no Supabase SQL Editor para permitir que a 
-- exclusão de uma igreja remova ou atualize os dados vinculados.
--
-- Erro original: "violates foreign key constraint 
-- notifications_church_id_fkey on table notifications"
-- =====================================================

-- 1. Notifications: ao excluir igreja, excluir notificações da igreja
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_church_id_fkey;
ALTER TABLE notifications ADD CONSTRAINT notifications_church_id_fkey 
  FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE CASCADE;

-- 2. Profiles: ao excluir igreja, desvincular usuários (SET NULL)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_church_id_fkey;
ALTER TABLE profiles ADD CONSTRAINT profiles_church_id_fkey 
  FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE SET NULL;

-- 3. Membros, células, ministérios, etc. (se tiverem FK para churches)
-- Descomente e ajuste os nomes das constraints conforme seu banco:

-- Members
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.table_columns WHERE table_schema = 'public' AND table_name = 'members' AND column_name = 'church_id') THEN
    ALTER TABLE members DROP CONSTRAINT IF EXISTS members_church_id_fkey;
    ALTER TABLE members ADD CONSTRAINT members_church_id_fkey 
      FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Ministries
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.table_columns WHERE table_schema = 'public' AND table_name = 'ministries' AND column_name = 'church_id') THEN
    ALTER TABLE ministries DROP CONSTRAINT IF EXISTS ministries_church_id_fkey;
    ALTER TABLE ministries ADD CONSTRAINT ministries_church_id_fkey 
      FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Cells
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.table_columns WHERE table_schema = 'public' AND table_name = 'cells' AND column_name = 'church_id') THEN
    ALTER TABLE cells DROP CONSTRAINT IF EXISTS cells_church_id_fkey;
    ALTER TABLE cells ADD CONSTRAINT cells_church_id_fkey 
      FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Events
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.table_columns WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'church_id') THEN
    ALTER TABLE events DROP CONSTRAINT IF EXISTS events_church_id_fkey;
    ALTER TABLE events ADD CONSTRAINT events_church_id_fkey 
      FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Financial transactions
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.table_columns WHERE table_schema = 'public' AND table_name = 'financial_transactions' AND column_name = 'church_id') THEN
    ALTER TABLE financial_transactions DROP CONSTRAINT IF EXISTS financial_transactions_church_id_fkey;
    ALTER TABLE financial_transactions ADD CONSTRAINT financial_transactions_church_id_fkey 
      FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Documents
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.table_columns WHERE table_schema = 'public' AND table_name = 'documents' AND column_name = 'church_id') THEN
    ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_church_id_fkey;
    ALTER TABLE documents ADD CONSTRAINT documents_church_id_fkey 
      FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE CASCADE;
  END IF;
END $$;

SELECT 'Constraints atualizadas. A remoção de igrejas deve funcionar.' as status;
