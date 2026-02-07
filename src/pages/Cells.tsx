import { useState, useEffect } from 'react';
import { MapPin, Users, Calendar, FileText, Plus, Trash2, Loader2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { cellsService } from '@/services/cells.service';
import { membersService } from '@/services/members.service';
import { AddMemberDialog } from '@/components/AddMemberDialog';
import { Member } from '@/types';

interface Cell {
  id: string;
  name: string;
  leader: string;
  host: string;
  address: string;
  meetingDay: string;
  memberCount: number;
}

export default function Cells() {
  const [cells, setCells] = useState<Cell[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportOpen, setReportOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [newCell, setNewCell] = useState({
    name: '',
    address: '',
    meetingDay: '',
    leaderId: '',
    hostId: ''
  });

  const { toast } = useToast();
  const { user } = useAuth();

  const canReport = user?.role !== 'aluno' && user?.role !== 'membro' && user?.role !== 'congregado' && user?.role !== 'tesoureiro';
  const isAdmin = user?.role === 'admin' || user?.role === 'secretario' || user?.role === 'pastor' || user?.role === 'lider_celula';

  useEffect(() => {
    loadCells();
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

  async function loadCells() {
    try {
      setLoading(true);
      const data = await cellsService.getActive();
      const mappedCells = await Promise.all((data || []).map(async (c: any) => {
        const count = await cellsService.getMemberCount(c.id);
        return {
          id: c.id,
          name: c.name,
          leader: c.leader?.name || 'Sem líder',
          host: c.host?.name || 'Sem anfitrião',
          address: c.address || 'Sem endereço',
          meetingDay: c.meeting_day || 'A definir',
          memberCount: count,
        };
      }));
      setCells(mappedCells);
    } catch (error) {
      console.error('Erro ao carregar células:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as células.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  const handleCreateCell = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await cellsService.create({
        name: newCell.name,
        address: newCell.address,
        meeting_day: newCell.meetingDay,
        leader_id: newCell.leaderId,
        host_id: newCell.hostId,
        active: true,
      });
      setCreateOpen(false);
      setNewCell({
        name: '',
        address: '',
        meetingDay: '',
        leaderId: '',
        hostId: ''
      });
      loadCells();
      toast({
        title: 'Célula criada!',
        description: 'A nova célula foi cadastrada com sucesso.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao criar',
        description: error.message || 'Não foi possível salvar a célula.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCell = async (id: string, name: string) => {
    if (!confirm(`Deseja realmente excluir a célula ${name}?`)) return;
    try {
      await cellsService.delete(id);
      loadCells();
      toast({
        title: 'Célula excluída',
        description: 'O registro foi removido com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao excluir',
        description: 'Não foi possível remover a célula.',
        variant: 'destructive',
      });
    }
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    setReportOpen(false);
    setSelectedCell(null);
    toast({
      title: 'Relatório enviado!',
      description: 'O relatório da célula foi registrado com sucesso.',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Células</h1>
          <p className="text-muted-foreground">
            Gerencie as células e seus relatórios
          </p>
        </div>
        {isAdmin && (
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Célula
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleCreateCell}>
                <DialogHeader>
                  <DialogTitle>Cadastrar Célula</DialogTitle>
                  <DialogDescription>Adicione uma nova célula à rede</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="cell-name">Nome da Célula</Label>
                    <Input
                      id="cell-name"
                      value={newCell.name}
                      onChange={(e) => setNewCell({ ...newCell, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cell-address">Endereço</Label>
                    <Input
                      id="cell-address"
                      value={newCell.address}
                      onChange={(e) => setNewCell({ ...newCell, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cell-day">Dia da Reunião</Label>
                    <Input
                      id="cell-day"
                      value={newCell.meetingDay}
                      onChange={(e) => setNewCell({ ...newCell, meetingDay: e.target.value })}
                      placeholder="Ex: Quarta-feira"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cell-leader">Líder</Label>
                      <Select
                        value={newCell.leaderId}
                        onValueChange={(value) => setNewCell({ ...newCell, leaderId: value })}
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
                    <div className="space-y-2">
                      <Label htmlFor="cell-host">Anfitrião</Label>
                      <Select
                        value={newCell.hostId}
                        onValueChange={(value) => setNewCell({ ...newCell, hostId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o anfitrião" />
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
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
                  <Button type="submit">Cadastrar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cells.map((cell) => (
          <Card key={cell.id} className="hover:shadow-lg transition-transform group relative border-none shadow-sm">
            {isAdmin && (
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCell(cell);
                    setAddMemberOpen(true);
                  }}
                  title="Gerenciar Pessoas"
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCell(cell.id, cell.name);
                  }}
                  title="Excluir Célula"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{cell.name}</span>
                <span className="text-sm font-normal text-muted-foreground flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {cell.memberCount}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Líder: {cell.leader}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Anfitrião: {cell.host}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{cell.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{cell.meetingDay}</span>
              </div>
              {canReport && (
                <Dialog open={reportOpen && selectedCell?.id === cell.id} onOpenChange={(open) => {
                  setReportOpen(open);
                  if (!open) setSelectedCell(null);
                }}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full mt-2"
                      variant="outline"
                      onClick={() => setSelectedCell(cell)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Novo Relatório
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <form onSubmit={handleSubmitReport}>
                      <DialogHeader>
                        <DialogTitle>Relatório de Reunião</DialogTitle>
                        <DialogDescription>
                          Registre os detalhes da reunião da célula
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="date">Data da Reunião</Label>
                          <Input id="date" type="date" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="members">Membros Presentes</Label>
                            <Input id="members" type="number" min="0" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="visitors">Visitantes</Label>
                            <Input id="visitors" type="number" min="0" required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="study">Tema do Estudo</Label>
                          <Input id="study" placeholder="Ex: O Sermão do Monte" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="notes">Observações</Label>
                          <Textarea id="notes" placeholder="Notas adicionais sobre a reunia..." />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setReportOpen(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit">Enviar Relatório</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedCell && (
        <AddMemberDialog
          open={addMemberOpen}
          onOpenChange={setAddMemberOpen}
          targetId={selectedCell.id}
          targetName={selectedCell.name}
          type="cell"
          onSuccess={loadCells}
        />
      )}
    </div>
  );
}
