import { useState, useEffect, useRef } from 'react';
import { FileText, Award, Send, Baby, Users, Loader2, Download, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { membersService } from '@/services/members.service';
import { Member } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';

export default function Secretariat() {
    const [activeTab, setActiveTab] = useState('minutes');
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const { user } = useAuth();

    // Permissão estrita: Apenas 'secretario' pode editar/excluir
    // Admin, Pastor, etc, terão apenas visualização (readOnly) nestes documentos
    const canEdit = user?.role === 'secretario';

    const handlePrint = () => {
        window.print();
    };

    useEffect(() => {
        if (activeTab === 'roll') {
            loadMembers();
        }
    }, [activeTab]);

    async function loadMembers() {
        try {
            setLoading(true);
            const data = await membersService.getAll();
            const mappedMembers: Member[] = (data || []).map((m: any) => ({
                id: m.id,
                name: m.name,
                email: m.email || '',
                phone: m.phone || '',
                birthDate: m.birth_date || '',
                address: m.address || '',
                photoUrl: m.photo_url || '',
                category: m.status === 'visitante' ? 'congregado' : 'membro',
                createdAt: m.created_at,
            }));
            setMembers(mappedMembers);
        } catch (error) {
            console.error('Erro ao carregar membros:', error);
            toast({
                title: 'Erro',
                description: 'Não foi possível carregar a lista de membros.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Secretaria</h1>
                    <p className="text-muted-foreground">
                        Gestão de documentos e certificados oficiais
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handlePrint} className="gap-2">
                        <Download className="h-4 w-4" />
                        Baixar PDF / Imprimir
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto print:hidden">
                    <TabsTrigger value="minutes" className="gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="hidden md:inline">Atas</span>
                    </TabsTrigger>
                    <TabsTrigger value="baptism" className="gap-2">
                        <Award className="h-4 w-4" />
                        <span className="hidden md:inline">Batismo</span>
                    </TabsTrigger>
                    <TabsTrigger value="transfer" className="gap-2">
                        <Send className="h-4 w-4" />
                        <span className="hidden md:inline">Transferência</span>
                    </TabsTrigger>
                    <TabsTrigger value="dedication" className="gap-2">
                        <Baby className="h-4 w-4" />
                        <span className="hidden md:inline">Apresentação</span>
                    </TabsTrigger>
                    <TabsTrigger value="roll" className="gap-2">
                        <Users className="h-4 w-4" />
                        <span className="hidden md:inline">Rol de Membros</span>
                    </TabsTrigger>
                </TabsList>

                <div className="bg-white p-8 rounded-lg shadow-sm print:shadow-none min-h-[600px] print:p-0">
                    <TabsContent value="minutes" className="mt-0 space-y-6">
                        <MinutesTemplate canEdit={canEdit} />
                    </TabsContent>

                    <TabsContent value="baptism" className="mt-0 space-y-6">
                        <BaptismCertificate members={members} canEdit={canEdit} />
                    </TabsContent>

                    <TabsContent value="transfer" className="mt-0 space-y-6">
                        <TransferLetter members={members} canEdit={canEdit} />
                    </TabsContent>

                    <TabsContent value="dedication" className="mt-0 space-y-6">
                        <BabyDedicationCertificate canEdit={canEdit} />
                    </TabsContent>

                    <TabsContent value="roll" className="mt-0 space-y-6">
                        {loading ? (
                            <div className="flex justify-center p-8 print:hidden">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            <MembersRoll members={members} />
                        )}
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}

function MinutesTemplate({ canEdit }: { canEdit: boolean }) {
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { toast } = useToast();

    const handleClear = () => {
        if (confirm('Tem certeza que deseja limpar todo o formulário?')) {
            setDate(format(new Date(), 'yyyy-MM-dd'));
            setTitle('');
            setContent('');
            toast({ title: 'Formulário limpo' });
        }
    };

    return (
        <div className="space-y-6 text-black">
            <div className="flex items-center justify-between border-b pb-6 mb-6">
                <div className="flex-1 text-center">
                    <h2 className="text-2xl font-bold uppercase">Ata de Reunião</h2>
                    <p className="text-muted-foreground print:hidden">Preencha os dados abaixo para gerar o documento</p>
                </div>
                {canEdit && (
                    <Button variant="destructive" size="icon" onClick={handleClear} className="print:hidden flex-shrink-0" title="Excluir/Limpar Documento">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="grid gap-4 print:hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Data da Reunião</Label>
                        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} disabled={!canEdit} />
                    </div>
                    <div className="space-y-2">
                        <Label>Título/Assunto</Label>
                        <Input placeholder="Ex: Reunião de Obreiros" value={title} onChange={(e) => setTitle(e.target.value)} disabled={!canEdit} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Conteúdo da Ata</Label>
                    <Textarea
                        placeholder="Descreva o que foi discutido e decidido..."
                        className="min-h-[300px]"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={!canEdit}
                    />
                </div>
            </div>

            <div className="hidden print:block space-y-6 font-serif">
                <div className="text-center mb-8">
                    <h3 className="text-xl font-bold">{title || 'Título da Ata'}</h3>
                    <p className="text-sm text-gray-600">
                        Realizada em {date ? format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : '___/___/___'}
                    </p>
                </div>
                <div className="whitespace-pre-wrap text-justify leading-relaxed">
                    {content || 'Conteúdo da ata aparecerá aqui...'}
                </div>
                <div className="mt-20 pt-8 border-t border-black w-64 mx-auto text-center">
                    <p>Secretário(a)</p>
                </div>
            </div>
        </div>
    );
}

function BaptismCertificate({ members, canEdit }: { members: Member[], canEdit: boolean }) {
    const [name, setName] = useState('');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const { toast } = useToast();

    const handleClear = () => {
        if (confirm('Tem certeza que deseja limpar o formulário?')) {
            setName('');
            setDate(format(new Date(), 'yyyy-MM-dd'));
            toast({ title: 'Formulário limpo' });
        }
    };

    return (
        <div className="space-y-6 text-black">
            <div className="flex items-center justify-between border-b pb-6 mb-6">
                <div className="flex-1 text-center">
                    <h2 className="text-2xl font-bold">Certificado de Batismo</h2>
                </div>
                {canEdit && (
                    <Button variant="destructive" size="icon" onClick={handleClear} className="print:hidden flex-shrink-0" title="Excluir/Limpar Documento">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="grid gap-4 print:hidden max-w-md mx-auto">
                <div className="space-y-2">
                    <Label>Nome do Batizando</Label>
                    <Input placeholder="Nome completo" value={name} onChange={(e) => setName(e.target.value)} disabled={!canEdit} />
                </div>
                <div className="space-y-2">
                    <Label>Data do Batismo</Label>
                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} disabled={!canEdit} />
                </div>
            </div>

            <div className="hidden print:flex flex-col items-center justify-center min-h-[600px] border-8 border-double border-gray-300 p-12 text-center font-serif">
                <div className="space-y-8">
                    <h1 className="text-4xl font-bold uppercase tracking-widest text-gray-800">Certificado de Batismo</h1>
                    <p className="text-xl italic">Certificamos que</p>
                    <h2 className="text-3xl font-bold text-primary border-b-2 border-primary inline-block px-8 pb-2">
                        {name || 'Nome do Membro'}
                    </h2>
                    <p className="text-xl leading-relaxed max-w-2xl mx-auto">
                        Foi batizado(a) em nome do Pai, do Filho e do Espírito Santo,
                        conforme a ordem de nosso Senhor Jesus Cristo,
                        em testemunho de sua fé e arrependimento.
                    </p>
                    <p className="text-lg mt-8">
                        {date ? format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : '___/___/___'}
                    </p>
                    <div className="flex justify-between w-full mt-24 max-w-3xl gap-12">
                        <div className="flex-1 border-t border-black pt-2">
                            <p>Pastor Presidente</p>
                        </div>
                        <div className="flex-1 border-t border-black pt-2">
                            <p>Secretário(a)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TransferLetter({ members, canEdit }: { members: Member[], canEdit: boolean }) {
    const [name, setName] = useState('');
    const [destination, setDestination] = useState('');
    const { toast } = useToast();

    const handleClear = () => {
        if (confirm('Tem certeza que deseja limpar o formulário?')) {
            setName('');
            setDestination('');
            toast({ title: 'Formulário limpo' });
        }
    };

    return (
        <div className="space-y-6 text-black">
            <div className="flex items-center justify-between border-b pb-6 mb-6">
                <div className="flex-1 text-center">
                    <h2 className="text-2xl font-bold">Carta de Transferência</h2>
                </div>
                {canEdit && (
                    <Button variant="destructive" size="icon" onClick={handleClear} className="print:hidden flex-shrink-0" title="Excluir/Limpar Documento">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="grid gap-4 print:hidden max-w-md mx-auto">
                <div className="space-y-2">
                    <Label>Nome do Membro</Label>
                    <Input placeholder="Nome completo" value={name} onChange={(e) => setName(e.target.value)} disabled={!canEdit} />
                </div>
                <div className="space-y-2">
                    <Label>Igreja de Destino</Label>
                    <Input placeholder="Nome da igreja" value={destination} onChange={(e) => setDestination(e.target.value)} disabled={!canEdit} />
                </div>
            </div>

            <div className="hidden print:block max-w-2xl mx-auto font-serif leading-relaxed text-justify space-y-6 mt-12">
                <h1 className="text-2xl font-bold text-center uppercase mb-12">Carta de Transferência</h1>

                <p>A quem possa interessar,</p>

                <p>
                    Certificamos que o(a) irmão(ã) <strong>{name || '____________________'}</strong> é membro desta igreja,
                    estando em plena comunhão e sem nada que desabone sua conduta cristã até a presente data.
                </p>

                <p>
                    Atendendo ao seu pedido, recomendamos o(a) referido(a) irmão(ã) à <strong>{destination || '____________________'}</strong>,
                    solicitando que o(a) recebam no Senhor e lhe concedam os privilégios da comunhão cristã.
                </p>

                <p>
                    Após sua recepção, pedimos a gentileza de nos comunicar para que possamos dar baixa em nosso rol de membros.
                </p>

                <p className="text-right mt-12">
                    {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}.
                </p>

                <div className="mt-24 pt-4 border-t border-black w-64 mx-auto text-center">
                    <p>Pastor Responsável</p>
                </div>
            </div>
        </div>
    );
}

function BabyDedicationCertificate({ canEdit }: { canEdit: boolean }) {
    const [childName, setChildName] = useState('');
    const [parentsName, setParentsName] = useState('');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const { toast } = useToast();

    const handleClear = () => {
        if (confirm('Tem certeza que deseja limpar o formulário?')) {
            setChildName('');
            setParentsName('');
            setDate(format(new Date(), 'yyyy-MM-dd'));
            toast({ title: 'Formulário limpo' });
        }
    };

    return (
        <div className="space-y-6 text-black">
            <div className="flex items-center justify-between border-b pb-6 mb-6">
                <div className="flex-1 text-center">
                    <h2 className="text-2xl font-bold">Certificado de Apresentação de Crianças</h2>
                </div>
                {canEdit && (
                    <Button variant="destructive" size="icon" onClick={handleClear} className="print:hidden flex-shrink-0" title="Excluir/Limpar Documento">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="grid gap-4 print:hidden max-w-md mx-auto">
                <div className="space-y-2">
                    <Label>Nome da Criança</Label>
                    <Input placeholder="Nome completo" value={childName} onChange={(e) => setChildName(e.target.value)} disabled={!canEdit} />
                </div>
                <div className="space-y-2">
                    <Label>Nome dos Pais</Label>
                    <Input placeholder="Pai e Mãe" value={parentsName} onChange={(e) => setParentsName(e.target.value)} disabled={!canEdit} />
                </div>
                <div className="space-y-2">
                    <Label>Data da Apresentação</Label>
                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} disabled={!canEdit} />
                </div>
            </div>

            <div className="hidden print:flex flex-col items-center justify-center min-h-[600px] border-4 border-dotted border-blue-200 p-12 text-center font-serif bg-blue-50/20">
                <div className="space-y-8">
                    <Baby className="h-16 w-16 mx-auto text-blue-300" />
                    <h1 className="text-3xl font-bold uppercase tracking-widest text-gray-800">Certificado de Apresentação</h1>
                    <p className="text-xl italic">Certificamos que a criança</p>

                    <h2 className="text-4xl font-bold text-blue-600 font-script px-8">
                        {childName || 'Nome da Criança'}
                    </h2>

                    <p className="text-lg">Filho(a) de</p>
                    <h3 className="text-2xl font-semibold border-b border-gray-300 pb-1 px-4 inline-block">
                        {parentsName || 'Nome dos Pais'}
                    </h3>

                    <p className="text-xl leading-relaxed max-w-2xl mx-auto mt-6">
                        Foi apresentada ao Senhor nesta igreja, conforme o exemplo bíblico,
                        sendo consagrada a Deus para uma vida abençoada.
                    </p>

                    <p className="text-lg mt-8 text-gray-600">
                        "Educa a criança no caminho em que deve andar; e até quando envelhecer não se desviará dele." (Provérbios 22:6)
                    </p>

                    <p className="text-md mt-4">
                        Em {date ? format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : '___/___/___'}
                    </p>

                    <div className="flex justify-center w-full mt-20">
                        <div className="border-t border-black pt-2 px-12">
                            <p>Pastor Celebrante</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MembersRoll({ members }: { members: Member[] }) {
    const [filter, setFilter] = useState('');

    const filtered = members.filter(m =>
        m.name.toLowerCase().includes(filter.toLowerCase()) ||
        m.category.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2 border-b pb-6 mb-6 print:hidden">
                <h2 className="text-2xl font-bold">Rol de Membros e Congregados</h2>
                <div className="flex items-center justify-center gap-4 text-sm mt-4">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-600" />
                        <span>Membros (Verde)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span>Congregados (Azul)</span>
                    </div>
                </div>
                <div className="max-w-md mx-auto mt-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nome..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>
            </div>

            <div className="print:block">
                <div className="hidden print:block text-center mb-8">
                    <h1 className="text-2xl font-bold uppercase">Rol Geral de Membros e Congregados</h1>
                    <p className="text-sm text-gray-500">Gerado em {format(new Date(), "dd/MM/yyyy", { locale: ptBR })}</p>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">Tipo</TableHead>
                            <TableHead>Nome Completo</TableHead>
                            <TableHead>Telefone</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell>
                                    <Users
                                        className={`h-5 w-5 ${member.category === 'membro' ? 'text-green-600' : 'text-blue-600'
                                            }`}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{member.name}</TableCell>
                                <TableCell>{member.phone}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`capitalize ${member.category === 'membro'
                                        ? 'border-green-200 bg-green-50 text-green-700'
                                        : 'border-blue-200 bg-blue-50 text-blue-700'
                                        }`}>
                                        {member.category}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="mt-8 text-sm text-gray-500 text-center print:block hidden border-t pt-4">
                    <p>Total de Registros: {filtered.length}</p>
                </div>
            </div>
        </div>
    );
}
