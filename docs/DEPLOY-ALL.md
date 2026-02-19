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
- Build command: `npm run build`
- Build output: `dist`

---

## Se o build falhar

1. **package-lock.json:** sempre rode `npm install` e commite o lock após alterar `package.json` — evita falha em Netlify, Vercel e Cloudflare.
2. **Node version:** o projeto usa Node 18+. `.nvmrc` e `engines` já definem
3. **Erro de checkout (Netlify):** autorize o repo em github.com/apps/netlify
