# Como desativar a confirmação de e-mail

Para que novos usuários possam entrar **imediatamente** após se cadastrar, sem precisar clicar no link de confirmação:

## Método 1: Pelo Dashboard (se existir)

1. Acesse [supabase.com/dashboard](https://supabase.com/dashboard) e abra seu projeto
2. **Authentication** → **Providers** → **Email**
3. Desative a opção **"Confirm email"**
4. Salve

Em projetos recentes essa opção pode ter sido removida ou alterada na interface.

---

## Método 2: Trigger no banco (alternativa)

Se a opção não aparecer no dashboard, use um trigger que confirma o email automaticamente no cadastro:

1. Abra o **SQL Editor** no Supabase
2. Execute o script: `supabase/auto_confirm_email_on_signup.sql`
3. A partir daí, novos cadastros terão o email confirmado na hora

Este trigger define `email_confirmed_at` ao criar o usuário, permitindo login imediato sem o link de confirmação.
