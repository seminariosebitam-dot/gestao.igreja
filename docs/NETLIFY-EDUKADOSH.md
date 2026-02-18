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

**Checklist essencial:** (1) Linkar repositório (2) Adicionar variáveis de ambiente (3) Trigger deploy

O `netlify.toml` já define Build e Publish — não precisa configurar manualmente.

**Onde fica Trigger deploy:** Menu esquerdo → **Deploys** (ou **Implanta**) → botão **Trigger deploy** (ou **Iniciar deploy**) → **Deploy site**

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

## Onde achar Base directory, Build command, Publish directory

O arquivo `netlify.toml` no repositório **já define** tudo. Você normalmente não precisa mexer na interface.

Se quiser conferir ou mudar:
1. Abra o projeto (ex: gestigreja)
2. Menu esquerdo → **Configuração do projeto** (ícone de engrenagem)
3. **Build & deploy** → **Continuous deployment**
4. Role a página até **Build settings** — pode ter **Options** ou **Edit settings**
5. Ou: **Build & deploy** → **Build** (alguns plans mostram como aba separada)

Se não aparecer: o Netlify usa automaticamente o `netlify.toml` do repo. Basta garantir que o repositório está linkado.

---

## Erro "Build script returned non-zero"

1. **Variáveis de ambiente:** `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` obrigatórias
2. O `netlify.toml` já tem Build e Publish corretos — se o build falhar, confira as variáveis
3. Ver logs do deploy que falhou para detalhes

---

## Mudar o nome do site

**Site configuration** → **Domain management** → **Change site name** → digite **gestchurch** ou **gestigreja**

---

## Selo de status no README

1. Netlify → projeto gestigreja → **Configuração do projeto** → **Geral**
2. **Indicadores de status** (Status badges)
3. Copie o trecho Markdown gerado
4. Cole no `README.md` do repositório

O selo mostra o status do deploy (passed/failed) e ao clicar abre a página de deploys.

---

## (3) Trigger deploy — caminho completo

1. Abra o projeto (gestigreja) no Netlify
2. Menu esquerdo → **Deploys** (ou **Implanta**)
3. Clique em **Trigger deploy** (canto superior direito)
4. Escolha **Deploy site** (ou **Clear cache and deploy site** para limpar cache)
