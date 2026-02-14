import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Loader2, Calendar, Clock, MapPin, Church, Heart, ShieldCheck, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { eventsService } from '@/services/events.service';

export default function ConfirmScale() {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [details, setDetails] = useState<any>(null);

    useEffect(() => {
        if (id) {
            confirmParticipation();
        }
    }, [id]);

    async function confirmParticipation() {
        try {
            setLoading(true);
            const result = await eventsService.confirmParticipationPublic(id!) as any;

            if (!result || !result.success) throw new Error('Não foi possível confirmar');

            setDetails({
                member: { name: result.member_name },
                event: {
                    title: result.event_title,
                    date: result.event_date,
                    time: result.event_time
                },
                role: result.role
            });

            setStatus('success');
        } catch (error) {
            console.error('Erro ao confirmar:', error);
            setStatus('error');
        } finally {
            setTimeout(() => setLoading(false), 800); // Suave delay para sensação de processamento real
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
                    <div className="relative bg-white p-6 rounded-full shadow-xl">
                        <Church className="h-12 w-12 text-primary animate-bounce" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Processando...</h2>
                <p className="text-slate-500 animate-pulse">Validando sua escala no sistema</p>
                <div className="mt-8 flex gap-1">
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4 font-sans select-none">
            {/* Background Decorativo */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-md w-full relative">
                {status === 'success' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Avatar / Icon Header */}
                        <div className="flex justify-center -mb-12 relative z-10 transition-transform hover:scale-105 duration-300">
                            <div className="bg-white p-1 rounded-3xl shadow-2xl border-4 border-white">
                                <div className="bg-gradient-to-br from-green-400 to-green-600 p-5 rounded-[22px] shadow-inner">
                                    <CheckCircle2 className="h-10 w-10 text-white" />
                                </div>
                            </div>
                        </div>

                        <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[32px] overflow-hidden bg-white/80 backdrop-blur-xl pt-14">
                            <CardContent className="px-8 pb-8 space-y-8">
                                <div className="text-center space-y-2">
                                    <h1 className="text-3xl font-black tracking-tight text-slate-900">
                                        Tudo Certo!
                                    </h1>
                                    <p className="text-slate-500 font-medium leading-relaxed">
                                        Ficamos muito felizes com sua disposição em servir, <span className="text-primary font-bold">{details?.member?.name.split(' ')[0]}</span>.
                                    </p>
                                </div>

                                {/* Event Info Card */}
                                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 space-y-5">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-primary/10 p-3 rounded-2xl">
                                            <Calendar className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Evento</p>
                                            <p className="font-bold text-slate-800 text-lg leading-tight">{details?.event?.title}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                                            <Clock className="h-4 w-4 text-primary" />
                                            <span className="text-sm font-bold text-slate-700">{details?.event?.time}</span>
                                        </div>
                                        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                                            <MapPin className="h-4 w-4 text-primary" />
                                            <span className="text-sm font-bold text-slate-700">{new Date(details?.event?.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pt-2 border-t border-slate-50">
                                        <div className="h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center">
                                            <ShieldCheck className="h-4 w-4 text-amber-600" />
                                        </div>
                                        <p className="text-sm text-slate-600 font-medium">
                                            Sua função: <span className="text-slate-900 font-bold">{details?.role}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Verse / Motivational */}
                                <div className="relative group overflow-hidden bg-gradient-to-br from-primary to-primary-foreground p-6 rounded-[24px] text-white shadow-lg transition-all hover:shadow-primary/20">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                        <Heart className="h-20 w-20 fill-white" />
                                    </div>
                                    <p className="relative text-sm font-medium italic leading-relaxed opacity-90">
                                        "Servi de boa vontade, como se estivéssemos servindo ao Senhor..."
                                    </p>
                                    <p className="relative text-[10px] font-bold mt-2 uppercase tracking-widest border-t border-white/20 pt-2 inline-block">
                                        Efésios 6:7
                                    </p>
                                </div>

                                <Button asChild className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-1">
                                    <Link to="/login" className="flex items-center justify-center gap-2">
                                        Entrar no App <ArrowRight className="h-5 w-5" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <div className="text-center px-6">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                                © {new Date().getFullYear()} • Gestão Igreja Multi-Tenant • Premium
                            </p>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500 text-center space-y-6">
                        <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-red-50 space-y-6">
                            <div className="h-24 w-24 bg-red-50 rounded-full flex items-center justify-center mx-auto ring-8 ring-red-50/50">
                                <span className="text-4xl animate-bounce">⚠️</span>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-slate-900"> Convite Expirado</h3>
                                <p className="text-slate-500 font-medium px-4">
                                    Não conseguimos encontrar esse convite. Ele pode ter sido removido ou já foi confirmado anteriormente.
                                </p>
                            </div>
                            <Button asChild variant="outline" className="w-full h-14 rounded-2xl border-2 hover:bg-slate-50 font-bold text-slate-700">
                                <Link to="/login">Voltar para o Início</Link>
                            </Button>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">Contate o líder do seu ministério se o problema persistir.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

