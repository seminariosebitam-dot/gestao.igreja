import { useState, useEffect } from 'react';
import { Save, Loader2, DollarSign, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { churchesService } from '@/services/churches.service';

const PIX_KEY_TYPES = [
  { value: 'cpf', label: 'CPF' },
  { value: 'cnpj', label: 'CNPJ' },
  { value: 'email', label: 'E-mail' },
  { value: 'phone', label: 'Telefone' },
  { value: 'random', label: 'Chave aleatória' },
] as const;

export default function PixDonations() {
  useDocumentTitle('Contas e PIX Igreja');
  const { churchId, viewingChurch, user } = useAuth();
  const { toast } = useToast();
  const effectiveChurchId = viewingChurch?.id ?? churchId ?? user?.churchId;

  const canEdit = ['admin', 'pastor', 'secretario', 'superadmin'].includes(
    user?.role || ''
  );

  const [church, setChurch] = useState<{
    pix_key?: string | null;
    pix_key_type?: string | null;
    pix_beneficiary_name?: string | null;
    pix_city?: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (effectiveChurchId) loadData();
  }, [effectiveChurchId]);

  async function loadData() {
    if (!effectiveChurchId) return;
    setLoading(true);
    try {
      const churchData = await churchesService.getById(effectiveChurchId);
      setChurch(churchData as any);
    } catch (e: any) {
      toast({ title: 'Erro ao carregar', description: e?.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  async function handleSavePixConfig() {
    if (!effectiveChurchId || !church || !canEdit) return;
    setSaving(true);
    try {
      await churchesService.update(effectiveChurchId, {
        pix_key: church.pix_key || null,
        pix_key_type: church.pix_key_type || null,
        pix_beneficiary_name: church.pix_beneficiary_name || null,
        pix_city: church.pix_city || null,
      });
      toast({ title: 'Salvo!', description: 'Dados PIX atualizados.' });
    } catch (e: any) {
      toast({ title: 'Erro ao salvar', description: e?.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }

  if (!effectiveChurchId) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <CreditCard className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Selecione uma igreja</h2>
        <p className="text-muted-foreground">É necessário ter uma igreja vinculada.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <CreditCard className="h-8 w-8 text-primary" />
          Contas e PIX Igreja
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure as chaves PIX e dados bancários da igreja para recebimento de dízimos e ofertas.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Chave PIX da igreja
          </CardTitle>
          <CardDescription>
            Cadastre a chave PIX para que os membros possam fazer transferências e doações.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Tipo da chave</Label>
                <Select
                  value={church?.pix_key_type || ''}
                  onValueChange={(v) =>
                    setChurch((p) => (p ? { ...p, pix_key_type: v || null } : null))
                  }
                  disabled={!canEdit}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {PIX_KEY_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pix_key">Chave PIX</Label>
                <Input
                  id="pix_key"
                  placeholder="email@igreja.com.br ou CPF/CNPJ/telefone"
                  value={church?.pix_key || ''}
                  onChange={(e) =>
                    setChurch((p) => (p ? { ...p, pix_key: e.target.value || null } : null))
                  }
                  disabled={!canEdit}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pix_name">Nome do beneficiário</Label>
                <Input
                  id="pix_name"
                  placeholder="Nome da igreja ou associação"
                  maxLength={25}
                  value={church?.pix_beneficiary_name || ''}
                  onChange={(e) =>
                    setChurch((p) =>
                      p ? { ...p, pix_beneficiary_name: e.target.value || null } : null
                    )
                  }
                  disabled={!canEdit}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pix_city">Cidade (UF)</Label>
                <Input
                  id="pix_city"
                  placeholder="Ex: SAO PAULO SP"
                  maxLength={15}
                  value={church?.pix_city || ''}
                  onChange={(e) =>
                    setChurch((p) => (p ? { ...p, pix_city: e.target.value || null } : null))
                  }
                  disabled={!canEdit}
                />
              </div>
              {canEdit && (
                <Button onClick={handleSavePixConfig} disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Salvar dados PIX
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
