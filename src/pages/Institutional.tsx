import { useState } from 'react';
import { Building2, Upload, Save, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sidebar } from '@/components/Sidebar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function Institutional() {
  const { toast } = useToast();
  const { user } = useAuth();
  const canEdit = user?.role === 'admin' || user?.role === 'pastor' || user?.role === 'secretario';
  const [churchData, setChurchData] = useState({
    name: 'Igreja Comunidade Cristã',
    address: 'Av. Principal, 1000 - Centro',
    phone: '(11) 3333-4444',
    email: 'contato@igreja.com.br',
    about: 'Somos uma igreja comprometida com o evangelho e o amor ao próximo.',
    youtube: 'https://youtube.com/@igreja',
    facebook: 'https://facebook.com/igreja',
    instagram: 'https://instagram.com/igreja',
    whatsapp: '5511999999999',
    logoUrl: '',
  });

  const handleSave = () => {
    toast({
      title: 'Dados salvos!',
      description: 'As informações institucionais foram atualizadas.',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Institucional</h1>
          <p className="text-muted-foreground">
            Configure as informações da igreja
          </p>
        </div>
        {canEdit && (
          <Button onClick={handleSave} className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        )}
      </div>

      <div className="grid gap-6">
        {/* Church Info */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Informações da Igreja
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Igreja</Label>
                <Input
                  id="name"
                  value={churchData.name}
                  onChange={(e) => setChurchData({ ...churchData, name: e.target.value })}
                  readOnly={!canEdit}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={churchData.phone}
                  onChange={(e) => setChurchData({ ...churchData, phone: e.target.value })}
                  readOnly={!canEdit}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={churchData.address}
                  onChange={(e) => setChurchData({ ...churchData, address: e.target.value })}
                  readOnly={!canEdit}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={churchData.email}
                  onChange={(e) => setChurchData({ ...churchData, email: e.target.value })}
                  readOnly={!canEdit}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="about">Sobre a Igreja</Label>
                <Textarea
                  id="about"
                  value={churchData.about}
                  onChange={(e) => setChurchData({ ...churchData, about: e.target.value })}
                  rows={4}
                  readOnly={!canEdit}
                />
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Logo Upload & Download */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Logo da Igreja
              </div>
              {churchData.logoUrl && (user?.role === 'admin' || user?.role === 'pastor' || user?.role === 'secretario') && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a href={churchData.logoUrl} download="logo-igreja.png" target="_blank" rel="noreferrer">
                    <Save className="h-4 w-4 mr-2" />
                    Baixar Logo Atual
                  </a>
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {churchData.logoUrl && (
                <div className="flex justify-center p-4 bg-muted/30 rounded-lg">
                  <img
                    src={churchData.logoUrl}
                    alt="Logo Atual"
                    className="h-32 w-auto object-contain drop-shadow-md"
                  />
                </div>
              )}

              {canEdit && (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors relative group">
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const { data, error } = await supabase.storage
                            .from('church-documents')
                            .upload(`logo/${Date.now()}-${file.name}`, file);

                          if (error) throw error;

                          const { data: { publicUrl } } = supabase.storage
                            .from('church-documents')
                            .getPublicUrl(data.path);

                          setChurchData({ ...churchData, logoUrl: publicUrl });
                          toast({
                            title: 'Logo atualizada!',
                            description: 'A nova logo da igreja foi carregada com sucesso.',
                          });
                        } catch (err: any) {
                          toast({
                            title: 'Erro no upload',
                            description: err.message,
                            variant: 'destructive',
                          });
                        }
                      }
                    }}
                  />
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4 group-hover:text-primary transition-colors" />
                  <p className="text-muted-foreground mb-2">
                    Arraste uma imagem ou clique para selecionar
                  </p>
                  <Button variant="outline" type="button">Selecionar Arquivo</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
