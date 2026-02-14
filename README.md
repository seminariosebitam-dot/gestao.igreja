# Gestão Igreja / gestao-church

App de gestão para igreja — deploy no GitHub, Vercel e Supabase.

## Passos principais

1. **Repositório no GitHub**
   - Este projeto pode estar em mais de um remote, por exemplo:
     - `origin` → seminariosebitam-dot/gest-o.igreja
     - `gestao2026` → gestaoigreja2026-cyber/gestao-church

2. **Variáveis de ambiente (local e Vercel/Netlify)**
   - Copie `.env.example` para `.env.local` e preencha:
     - `VITE_SUPABASE_URL` — URL do projeto Supabase
     - `VITE_SUPABASE_ANON_KEY` — chave anon (Settings > API no Supabase)
   - No Vercel/Netlify, configure as mesmas variáveis.

3. **Deploy**
   - **Vercel:** conectar o repositório no painel; o `vercel.json` já define build e redirects para SPA.
   - **Netlify:** ver `docs/DEPLOY-NETLIFY.md` e usar o `netlify.toml` na raiz.

4. **Supabase**
   - Criar projeto no Supabase, aplicar o schema: `supabase/schema.sql`.
   - Usar a mesma URL e anon key no app (local e deploys).

## Desenvolvimento

```bash
npm install
npm run setup:env   # cria .env.local a partir do .env.example
# Edite .env.local com a chave anon do Supabase
npm run dev
```

Build: `npm run build`
