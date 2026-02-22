import { Link, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

/** Mapeamento rota → label exibido */
const ROUTE_LABELS: Record<string, string> = {
  '/dashboard': 'Início',
  '/membros': 'Membros',
  '/ministerios': 'Ministérios',
  '/celulas': 'Células',
  '/eventos': 'Eventos',
  '/relatorios': 'Relatórios',
  '/caixa-diario': 'Caixa Diário',
  '/secretaria': 'Secretaria',
  '/uploads': 'Uploads',
  '/institucional': 'Institucional',
  '/pastores': 'Pastores',
  '/privacidade': 'Privacidade',
  '/boletins': 'Boletins',
  '/planos-leitura': 'Planos de Leitura',
  '/solicitacoes-oracao': 'Solicitações de Oração',
  '/redes-sociais': 'Redes Sociais',
  '/pix-donacoes': 'PIX e Doações',
  '/discipulado': 'Discipulado',
  '/cadastro': 'Cadastro',
  '/como-acessar': 'Como Acessar',
  '/superadmin': 'Super Admin',
};

interface BreadcrumbConfig {
  path: string;
  label: string;
}

export function PageBreadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  if (pathnames.length === 0 || pathnames[0] === 'dashboard') return null;

  const items: BreadcrumbConfig[] = [];
  let current = '';
  for (let i = 0; i < pathnames.length; i++) {
    current += `/${pathnames[i]}`;
    const label = ROUTE_LABELS[current] ?? pathnames[i].replace(/-/g, ' ');
    items.push({ path: current, label });
  }

  if (items.length === 0) return null;

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/dashboard">Início</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {items.map((item, i) => (
          <span key={item.path} className="contents">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {i === items.length - 1 ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={item.path}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </span>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
