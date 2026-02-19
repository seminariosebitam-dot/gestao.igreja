# Deploy automático via GitHub Actions

O projeto está configurado para deploy automático em todo `git push` na branch `main`.

## Opção 1: Deploy nativo (mais simples)

**Vercel** e **Netlify** fazem deploy automático quando o repositório está conectado:

- **Vercel:** [vercel.com](https://vercel.com) → Add Project → Import from GitHub → selecione o repositório
- **Netlify:** [app.netlify.com](https://app.netlify.com) → Add new site → Import from Git → selecione o repositório

Configure as variáveis de ambiente em cada plataforma e pronto. Todo push na `main` dispara o deploy.

---

## Opção 2: GitHub Actions (deploy via workflows)

Os workflows em `.github/workflows/` fazem deploy via GitHub Actions. Adicione os **secrets** no repositório:

### GitHub → Settings → Secrets and variables → Actions → New repository secret

### Para Vercel (`deploy_vercel.yml`)

| Secret | Onde obter |
|--------|------------|
| `VERCEL_TOKEN` | [vercel.com/account/tokens](https://vercel.com/account/tokens) — crie um token |
| `VERCEL_ORG_ID` | Projeto Vercel → Settings → General → Project ID (ou em `.vercel/project.json` após `vercel link`) |
| `VERCEL_PROJECT_ID` | Mesmo local do ORG_ID |
| `VITE_SUPABASE_URL` | URL do seu projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave anon do Supabase (Settings → API) |

### Para Netlify (`deploy_netlify.yml`)

| Secret | Onde obter |
|--------|------------|
| `NETLIFY_AUTH_TOKEN` | [Netlify → User settings → Applications → Personal access tokens](https://app.netlify.com/user/applications#personal-access-tokens) |
| `NETLIFY_SITE_ID` | Site → Site configuration → General → Site information → API ID |
| `VITE_SUPABASE_URL` | URL do seu projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave anon do Supabase |

---

## Como usar

1. Faça push na `main`:
   ```bash
   git add .
   git commit -m "sua mensagem"
   git push origin main
   ```

2. O GitHub Actions irá rodar o build e, se os secrets estiverem configurados, fará o deploy automaticamente.

3. Acompanhe em **Actions** no GitHub.

---

## Escolher apenas uma plataforma

- Para usar só **Vercel:** remova ou desative o workflow `deploy_netlify.yml` (ou não adicione os secrets do Netlify).
- Para usar só **Netlify:** remova ou desative o workflow `deploy_vercel.yml` (ou não adicione os secrets da Vercel).

Se os secrets não estiverem configurados, o job correspondente falhará com mensagem clara.
