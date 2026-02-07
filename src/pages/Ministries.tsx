import { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sidebar } from '@/components/Sidebar';
import { MinistryCard } from '@/components/MinistryCard';
import { AddMemberDialog } from '@/components/AddMemberDialog';
import { ministriesService } from '@/services/ministries.service';
import { membersService } from '@/services/members.service';
import { Ministry, Member } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function Ministries() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newMinistry, setNewMinistry] = useState({ name: '', description: '', leaderId: '' });
  const [members, setMembers] = useState<Member[]>([]);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [selectedMinistry, setSelectedMinistry] = useState<Ministry | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const canCreate = user?.role === 'admin' || user?.role === 'secretario' || user?.role === 'pastor' || user?.role === 'lider_ministerio';

  useEffect(() => {
    loadMinistries();
    loadMembers();
  }, []);

  async function loadMembers() {
    try {
      const data = await membersService.getAll();
      setMembers(data as any || []);
    } catch (error) {
      console.error('Erro ao carregar membros:', error);
    }
  }

  async function loadMinistries() {
    try {
      setLoading(true);
      const data = await ministriesService.getActive();

      const mappedMinistries = await Promise.all((data || []).map(async (m: any) => {
        const count = await ministriesService.getMemberCount(m.id);
        return {
          id: m.id,
          name: m.name,
          description: m.description || '',
          leader: m.leader?.name || 'Sem líder',
          icon: m.icon || 'Church',
          memberCount: count,
        };
      }));

      setMinistries(mappedMinistries);
    } catch (error) {
      console.error('Erro ao carregar ministérios:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os ministérios.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  const handleCreateMinistry = async () => {
    if (!newMinistry.name) return;

    try {
      await ministriesService.create({
        name: newMinistry.name,
        description: newMinistry.description,
        leader_id: newMinistry.leaderId,
        icon: 'Church',
        active: true,
      });

      setNewMinistry({ name: '', description: '', leaderId: '' });
      setDialogOpen(false);
      loadMinistries();

      toast({
        title: 'Ministério criado!',
        description: `${newMinistry.name} foi adicionado com sucesso.`,
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao criar',
        description: error.message || 'Ocorreu um problema ao cadastrar o ministério.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteMinistry = async (id: string) => {
    try {
      await ministriesService.delete(id);
      loadMinistries();
      toast({
        title: 'Ministério removido',
        description: 'O registro foi excluído com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao excluir',
        description: 'Não foi possível remover o ministério.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ministérios</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie os ministérios da igreja
          </p>
        </div>
        {canCreate && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Novo Ministério
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Ministério</DialogTitle>
                <DialogDescription>
                  Adicione um novo ministério à igreja
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="ministry-name">Nome</Label>
                  <Input
                    id="ministry-name"
                    value={newMinistry.name}
                    onChange={(e) => setNewMinistry({ ...newMinistry, name: e.target.value })}
                    placeholder="Ex: Casais"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ministry-desc">Descrição</Label>
                  <Input
                    id="ministry-desc"
                    value={newMinistry.description}
                    onChange={(e) => setNewMinistry({ ...newMinistry, description: e.target.value })}
                    placeholder="Breve descrição do ministério"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ministry-leader">Líder</Label>
                  <Select
                    value={newMinistry.leaderId}
                    onValueChange={(value) => setNewMinistry({ ...newMinistry, leaderId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o líder" />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateMinistry}>Criar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {ministries.map((ministry) => (
          <MinistryCard
            key={ministry.id}
            ministry={ministry}
            onDelete={handleDeleteMinistry}
            onAddMember={(m) => {
              setSelectedMinistry(m);
              setAddMemberOpen(true);
            }}
          />
        ))}
      </div>

      {selectedMinistry && (
        <AddMemberDialog
          open={addMemberOpen}
          onOpenChange={setAddMemberOpen}
          targetId={selectedMinistry.id}
          targetName={selectedMinistry.name}
          type="ministry"
          onSuccess={loadMinistries}
        />
      )}
    </div>
  );
}
