-- ===================================================
-- FIX: handle_new_user para tabela profiles atualizada
-- ===================================================
-- A tabela profiles usa full_name (não name) e church_id.
-- O trigger antigo inseria (id, email, name, role) e falhava
-- com "Database error saving new user".
--
-- Execute no Supabase: SQL Editor > New query > Cole e Run
--
-- Se sua tabela profiles tem "name" em vez de "full_name", execute antes:
--   ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
--   UPDATE profiles SET full_name = COALESCE(full_name, name) WHERE full_name IS NULL;

-- Atualiza a função para usar as colunas corretas
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_full_name TEXT;
  v_role TEXT;
BEGIN
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'name', NEW.email, 'Usuário');
  v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'membro');
  
  -- Garante role válido para o check constraint
  IF v_role NOT IN ('admin', 'pastor', 'secretario', 'tesoureiro', 'membro', 'lider_celula', 'lider_ministerio', 'aluno', 'congregado', 'superadmin') THEN
    v_role := 'membro';
  END IF;

  INSERT INTO public.profiles (id, full_name, role, church_id)
  VALUES (
    NEW.id,
    v_full_name,
    v_role,
    NULL  -- Igreja será vinculada pelo AuthContext no primeiro login
  );
  RETURN NEW;
END;
$$;

-- Recria o trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
