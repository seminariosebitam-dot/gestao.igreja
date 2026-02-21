import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MemberForm, MemberFormData } from '@/components/MemberForm';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { membersService } from '@/services/members.service';
import { churchesService } from '@/services/churches.service';
import { pastorsService } from '@/services/pastors.service';
import { setProfileCompleted } from '@/lib/profileCompletion';

export default function Registration() {
    useDocumentTitle('Cadastro');
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user, churchId, setRegistrationCompleted } = useAuth();
    const effectiveChurchId = churchId || user?.churchId;
    const [churchName, setChurchName] = useState('');
    const [pastorName, setPastorName] = useState('');

    useEffect(() => {
        if (!effectiveChurchId) return;
        Promise.all([
            churchesService.getById(effectiveChurchId).catch(() => null),
            pastorsService.listByChurch(effectiveChurchId).catch(() => []),
        ]).then(([church, pastors]) => {
            setChurchName(church?.name || '');
            setPastorName(pastors?.[0]?.name || '');
        });
    }, [effectiveChurchId]);

    const handleRegistrationSubmit = async (data: MemberFormData) => {
        try {
            const cid = effectiveChurchId;
            if (!cid) throw new Error('Nenhuma igreja vinculada. Entre em contato com o administrador.');

            const newMember = await membersService.create({
                name: data.name,
                email: data.email || null,
                phone: data.phone || null,
                birth_date: data.birthDate || null,
                marital_status: data.maritalStatus || null,
                address: data.address || null,
                photo_url: data.photoUrl || null,
                status: data.category === 'congregado' ? 'visitante' : 'ativo',
            }, cid);

            if (user?.id) {
                setProfileCompleted(user.id);
                try { await setRegistrationCompleted(); } catch { /* coluna pode não existir ainda */ }
            }

            toast({
                title: 'Cadastro Realizado!',
                description: `Seja bem-vindo, ${data.name}! Seu perfil foi criado e salvo com sucesso.`,
            });

            navigate('/dashboard');
        } catch (error) {
            console.error('Erro ao realizar cadastro:', error);
            toast({
                title: 'Erro ao salvar',
                description: 'Não conseguimos salvar seus dados. Verifique sua conexão e tente novamente.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-black tracking-tight mb-2">Complete seu Cadastro</h1>
                <p className="text-muted-foreground">Precisamos de mais algumas informações para seu acesso ao painel.</p>
            </div>

            <MemberForm
                onSubmit={handleRegistrationSubmit}
                onCancel={() => navigate('/dashboard')}
                churchName={churchName}
                pastorName={pastorName}
            />
        </div>
    );
}
