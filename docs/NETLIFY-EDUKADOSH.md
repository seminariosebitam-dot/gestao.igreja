# Deploy no Netlify — edukadoshmda-ops/gestaoigreja

## Acesso direto ao Netlify
**https://app.netlify.com/teams/seminariosebitam/projects**

Projetos: gestigreja, sebitam, etc.

---

## URL em produção (esperada)
**https://gestchurch.netlify.app** (ou gestigreja.netlify.app)

---

## Se o gestchurch sumiu: recriar o site

Se o projeto **gestchurch** foi substituído por **sebitam** (ou sumiu), recrie assim:

### Opção A: Novo site (recomendado)
1. Acesse **https://app.netlify.com**
2. **Add new site** → **Import an existing project**
3. **Deploy with GitHub** → autorize se pedir
4. Selecione **edukadoshmda-ops/gestaoigreja**
5. **Branch to deploy:** `main`
6. **Build command:** `npm run build` | **Publish directory:** `dist`
7. Adicione as variáveis:
   - `VITE_SUPABASE_URL` = `https://amgpwwdhqtoaxkrvakzg.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = (sua chave anon)
8. **Deploy site**
9. Depois do deploy: **Site settings** → **Domain management** → **Change site name** → digite **gestchurch**  
   → a URL será **gestchurch.netlify.app**

### Opção B: Usar o sebitam como gestchurch
Se quiser reaproveitar o projeto **sebitam**:
1. Abra o projeto **sebitam** no Netlify
2. **Site configuration** → **Build & deploy** → **Continuous deployment**
3. **Manage repository** → **Link repository** → escolha **edukadoshmda-ops/gestaoigreja**
4. **Site settings** → **Domain management** → **Change site name** → **gestchurch**  
   (o sebitam.netlify.app passará a ser gestchurch.netlify.app)
5. Adicione as variáveis de ambiente (seção abaixo)
6. **Deploys** → **Trigger deploy** → **Deploy site**

---

## Passo a passo (configuração geral)

### 1. Acesse o projeto correto (gestchurch)
- Abra: **https://app.netlify.com**
- Na lista de sites, clique em **gestchurch** (URL: gestchurch.netlify.app)
- Se estiver em "sebitam" ou outro projeto, volte e escolha **gestchurch**

### 2. Verificar/alterar repositório
- Em **gestchurch** → **Site configuration** → **Build & deploy** → **Continuous deployment**
- Confira: **Repository** = `github.com/edukadoshmda-ops/gestaoigreja`
- Se estiver errado: **Manage repository** → **Link repository** → escolha **edukadoshmda-ops/gestaoigreja**
- **Production branch:** `main`

### 3. Conectar ao GitHub (só se for site novo)
- Clique em **"Deploy with GitHub"** (ou **"Import from Git"** → **GitHub**)
- Procure e selecione: **edukadoshmda-ops/gestaoigreja**

### 4. Configurações do build
O arquivo `netlify.toml` na raiz do projeto já define:
- **Build command:** `npm run build`
- **Publish directory:** `dist`

Se o Netlify não detectar, preencha manualmente:
- **Branch to deploy:** `main`
- **Build command:** `npm run build`
- **Publish directory:** `dist`

### 5. Variáveis de ambiente (obrigatório)
Antes de fazer o deploy, clique em **"Add environment variables"** e adicione:

| Nome                    | Valor                                      |
|-------------------------|--------------------------------------------|
| `VITE_SUPABASE_URL`     | `https://amgpwwdhqtoaxkrvakzg.supabase.co` |
| `VITE_SUPABASE_ANON_KEY`| (sua chave anon do Supabase)               |

Para pegar a chave: **Supabase** → seu projeto → **Settings** → **API** → **anon public**

### 6. Deploy
- Clique em **"Deploy site"** ou **"Deploy edukadoshmda-ops/gestaoigreja"**
- Aguarde o build terminar

### 7. URL do site
Depois do deploy, a URL será algo como:
- `https://nome-aleatorio.netlify.app`

Para mudar o nome: **Site settings** → **Domain management** → **Change site name**

---

## Resumo
| | Este app (Gestão Igreja) |
|---|---|
| **Repositório** | edukadoshmda-ops/gestaoigreja |
| **Branch** | main |
| **URL desejada** | gestchurch.netlify.app |

**Se gestchurch sumiu:** crie um novo site (Opção A) ou reconfigure o sebitam (Opção B) e troque o nome para gestchurch.

---

## Erro "Error enqueueing build" (GitHub / API)

Problema de permissão Netlify ↔ GitHub:
1. **https://github.com/apps/netlify** → Configure → **Repository access**
2. Garanta que o repositório (edukadoshmda-ops/gestaoigreja ou seminariosebitam-dot/gestao.igreja) está autorizado
3. No Netlify: **Manage repository** → link novamente o repositório

---

## Erro "Build script returned non-zero" ou "Failed during building site"

1. **Variáveis de ambiente obrigatórias** (sem elas o build falha):
   - **Site configuration** → **Environment variables**
   - Adicione: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

2. **Ver logs completos:** Clique no deploy que falhou → veja a mensagem completa

3. **Build settings:** Em **Build & deploy** confira:
   - Base directory: *(vazio)*
   - Build command: `npm run build`
   - Publish directory: `dist`

---

## Mudar o nome do site (darling-conkies → gestchurch)

1. **Site configuration** (ou **Configuração do projeto**)
2. **Domain management** (Gestão de domínio)
3. Na seção **Custom domains**, encontre **Options** ou **Domain settings**
4. **Change site name** (ou **Renomear site**) → digite **gestchurch**
5. Salve — a URL passa a ser **gestchurch.netlify.app**
