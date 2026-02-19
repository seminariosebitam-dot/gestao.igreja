# Deploy — Vercel, Netlify e Cloudflare Pages

## Checklist único (qualquer plataforma)

1. **Build command:** `npm run build`
2. **Output directory:** `dist`
3. **Variáveis de ambiente obrigatórias:**
   - `VITE_SUPABASE_URL` = `https://amgpwwdhqtoaxkrvakzg.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = (sua chave anon)

---

## Vercel

- Conecte **seminariosebitam-dot/gestao.igreja**
- Framework Preset: **Vite** (não VitePress)
- Root Directory: *(vazio)*
- O `vercel.json` já está configurado

---

## Netlify

- Conecte **seminariosebitam-dot/gestao.igreja**
- GitHub: instale o app Netlify e autorize o repositório (https://github.com/apps/netlify)
- O `netlify.toml` já está configurado

---

## Cloudflare Pages

- Conecte **seminariosebitam-dot/gestao.igreja**
- Build command: `npm install && npm run build`
- Build output: `dist`
- Node version: 20 (Environment variables → add NODE_VERSION = 20)

---

## Planos de leitura — mapa por membro

Para admins verem o progresso de todos os membros, execute `supabase/reading_plan_admin_view.sql` no SQL Editor do Supabase.

## Se o build falhar

1. **Instalação:** o projeto não versiona `package-lock.json`; Netlify/Vercel/Cloudflare usam `npm install`.
2. **Node version:** o projeto usa Node 18+. `.nvmrc` e `engines` já definem
3. **Erro de checkout (Netlify):** autorize o repo em github.com/apps/netlify
