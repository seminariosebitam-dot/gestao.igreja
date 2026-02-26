import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, Plus, Pencil, Trash2, ShieldAlert, Image as ImageIcon, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { assetsService } from '@/services/assets.service';
import { Asset, AssetStatus } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AssetMaintenanceModal } from '@/components/AssetMaintenanceModal';

export default function Assets() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

    const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);
    const [maintenanceAsset, setMaintenanceAsset] = useState<Asset | null>(null);

    // Form states
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState<AssetStatus>('ativo');
    const [value, setValue] = useState('');
    const [location, setLocation] = useState('');

    const { data: assets = [], isLoading } = useQuery({
        queryKey: ['assets'],
        queryFn: () => assetsService.getAssets(),
    });

    const createMutation = useMutation({
        mutationFn: assetsService.createAsset,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assets'] });
            toast.success('Patrimônio cadastrado com sucesso!');
            setIsModalOpen(false);
            resetForm();
        },
        onError: (error) => toast.error('Erro ao cadastrar patrimônio: ' + error.message),
    });

    const updateMutation = useMutation({
        mutationFn: (data: { id: string; asset: Partial<Asset> }) => assetsService.updateAsset(data.id, data.asset),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assets'] });
            toast.success('Patrimônio atualizado com sucesso!');
            setIsModalOpen(false);
            resetForm();
        },
        onError: (error) => toast.error('Erro ao atualizar patrimônio: ' + error.message),
    });

    const deleteMutation = useMutation({
        mutationFn: assetsService.deleteAsset,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assets'] });
            toast.success('Patrimônio removido com sucesso!');
        },
        onError: (error) => toast.error('Erro ao remover patrimônio: ' + error.message),
    });

    const filteredAssets = assets.filter(
        (a) =>
            a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const resetForm = () => {
        setEditingAsset(null);
        setName('');
        setCategory('');
        setStatus('ativo');
        setValue('');
        setLocation('');
    };

    const openEdit = (asset: Asset) => {
        setEditingAsset(asset);
        setName(asset.name);
        setCategory(asset.category || '');
        setStatus(asset.status);
        setValue(asset.value ? asset.value.toString() : '');
        setLocation(asset.location || '');
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!name.trim()) {
            toast.error('O nome do bem é obrigatório.');
            return;
        }

        const payload: Partial<Asset> = {
            name,
            category,
            status,
            location,
            value: value ? parseFloat(value) : undefined,
        };

        if (editingAsset) {
            updateMutation.mutate({ id: editingAsset.id, asset: payload });
        } else {
            createMutation.mutate(payload);
        }
    };

    const getStatusColor = (st: AssetStatus) => {
        switch (st) {
            case 'ativo': return 'bg-green-100 text-green-800 border-green-200';
            case 'inativo': return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'em_manutencao': return 'bg-orange-100 text-orange-800 border-orange-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    const formatCurrency = (val?: number) => {
        if (val === undefined || val === null) return '-';
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    };

    return (
        <div className="p-4 md:p-8 md:pt-4 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Package className="w-8 h-8 text-primary" />
                        Patrimônio
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Gestão de ativos, equipamentos e imóveis da igreja.
                    </p>
                </div>
                <Button onClick={() => { resetForm(); setIsModalOpen(true); }} className="w-full sm:w-auto gap-2">
                    <Plus className="w-4 h-4" />
                    Novo Bem
                </Button>
            </div>

            <div className="flex items-center space-x-2">
                <Input
                    placeholder="Buscar patrimônio ou categoria..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                />
            </div>

            {isLoading ? (
                <div className="text-center py-10 text-muted-foreground">Carregando patrimônios...</div>
            ) : filteredAssets.length === 0 ? (
                <div className="text-center py-10 bg-card rounded-lg border border-border">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-20" />
                    <h3 className="text-lg font-medium text-foreground">Nenhum bem patrimonial encontrado</h3>
                    <p className="text-muted-foreground mt-1">Clique em "Novo Bem" para cadastrar o primeiro.</p>
                </div>
            ) : (
                <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Identificação</TableHead>
                                    <TableHead>Categoria</TableHead>
                                    <TableHead>Local</TableHead>
                                    <TableHead>Valor</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAssets.map((asset) => (
                                    <TableRow key={asset.id} className="hover:bg-muted/30">
                                        <TableCell>
                                            <div className="font-medium text-foreground">{asset.name}</div>
                                            {asset.createdAt && (
                                                <div className="text-xs text-muted-foreground">Reg: {format(new Date(asset.createdAt), 'dd/MM/yyyy')}</div>
                                            )}
                                        </TableCell>
                                        <TableCell>{asset.category || '-'}</TableCell>
                                        <TableCell>{asset.location || '-'}</TableCell>
                                        <TableCell className="font-medium">{formatCurrency(asset.value)}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={getStatusColor(asset.status)}>
                                                {asset.status === 'em_manutencao' ? 'Em Manutenção' : asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" title="Editar" onClick={() => openEdit(asset)}>
                                                    <Pencil className="w-4 h-4 text-blue-600" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Excluir"
                                                    onClick={() => {
                                                        if (window.confirm(`Deseja realmente excluir "${asset.name}"?`)) {
                                                            deleteMutation.mutate(asset.id);
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Manutenções"
                                                    onClick={() => {
                                                        setMaintenanceAsset(asset);
                                                        setIsMaintenanceOpen(true);
                                                    }}
                                                >
                                                    <Wrench className="w-4 h-4 text-orange-600" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )
            }

            {/* Modal - Cadastro de Patrimônio */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingAsset ? 'Editar bem patrimonial' : 'Cadastrar novo bem'}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nome do Bem *</label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ex: Mesa de Som Digital, Veículo Van, etc."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Categoria</label>
                                    <Input
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        placeholder="Ex: Eletrônicos, Imóveis"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Valor Estimado</label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                        placeholder="R$ 0,00"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Localização / Setor</label>
                                    <Input
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="Ex: Templo Principal"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Situação</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value as AssetStatus)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="ativo">Ativo</option>
                                        <option value="inativo">Inativo</option>
                                        <option value="em_manutencao">Em Manutenção</option>
                                    </select>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
                            {editingAsset ? 'Atualizar' : 'Salvar Cadastro'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <AssetMaintenanceModal
                isOpen={isMaintenanceOpen}
                onClose={() => setIsMaintenanceOpen(false)}
                asset={maintenanceAsset}
            />
        </div >
    );
}
