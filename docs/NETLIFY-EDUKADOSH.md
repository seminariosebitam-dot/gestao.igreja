# Deploy no Netlify — seminariosebitam-dot/gestao.igreja

## Repositório único
**https://github.com/seminariosebitam-dot/gestao.igreja**

Todo o código vai para esse repositório. O `git push` envia automaticamente para lá.

---

## Acesso direto ao Netlify
**https://app.netlify.com/teams/seminariosebitam/projects**

Projetos: gestigreja, sebitam, etc.

---

## URL em produção (esperada)
**https://gestchurch.netlify.app** (ou gestigreja.netlify.app)

---

## Deploy automático

Depois de configurar:
1. `git add .` e `git commit -m "sua mensagem"` 
2. `git push origin HEAD:main` — ou use `npm run push`

O Netlify detecta o push e faz o deploy automaticamente.

---

## Configurar site novo no Netlify

### 1. Criar o site
1. Acesse **https://app.netlify.com/teams/seminariosebitam/projects**
2. **Add new site** → **Import an existing project**
3. **Deploy with GitHub** → autorize se pedir
4. Selecione **seminariosebitam-dot/gestao.igreja**
5. **Branch to deploy:** `main`
6. **Build command:** `npm run build` | **Publish directory:** `dist`

### 2. Variáveis de ambiente (obrigatório)
- **Site configuration** → **Environment variables**
- Adicione:
  - `VITE_SUPABASE_URL` = `https://amgpwwdhqtoaxkrvakzg.supabase.co`
  - `VITE_SUPABASE_ANON_KEY` = (sua chave anon do Supabase)

### 3. Deploy
- Clique em **Deploy site**
- Depois: **Domain management** → **Change site name** → **gestchurch** ou **gestigreja**

---

## Reconfigurar site existente (gestigreja, sebitam)

1. **Site configuration** → **Build & deploy** → **Continuous deployment**
2. **Manage repository** → **Link repository** → **seminariosebitam-dot/gestao.igreja**
3. **Production branch:** `main`
4. Adicione as variáveis de ambiente (se não tiver)
5. **Deploys** → **Trigger deploy**

---

## Erro "Error enqueueing build" (GitHub / API)

Problema de permissão Netlify ↔ GitHub:
1. **https://github.com/apps/netlify** → Configure → **Repository access**
2. Garanta que **seminariosebitam-dot/gestao.igreja** está autorizado
3. No Netlify: **Manage repository** → link novamente o repositório

---

## Erro "Build script returned non-zero"

1. **Variáveis de ambiente:** `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` obrigatórias
2. **Build settings:** Base directory vazio, Build `npm run build`, Publish `dist`
3. Ver logs do deploy que falhou para detalhes

---

## Mudar o nome do site

**Site configuration** → **Domain management** → **Change site name** → digite **gestchurch** ou **gestigreja**
