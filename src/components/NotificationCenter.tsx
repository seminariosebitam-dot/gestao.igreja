import { useState, useEffect } from 'react';
import { Bell, BellRing, X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    read: boolean;
    created_at: string;
    link?: string;
}

export function NotificationCenter() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [open, setOpen] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            loadNotifications();

            // Subscribe to new notifications
            const channel = supabase
                .channel('public:notifications')
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`
                }, (payload) => {
                    setNotifications(prev => [payload.new as Notification, ...prev]);
                })
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [user]);

    async function loadNotifications() {
        if (!user) return;
        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(20);

        if (data) setNotifications(data);
    }

    async function markAsRead(id: string) {
        await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', id);

        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }

    async function clearAll() {
        if (!user) return;
        await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', user.id);

        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    const getTypeIcon = (type: Notification['type']) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'warning': return <AlertCircle className="h-4 w-4 text-amber-500" />;
            case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
            default: return <Info className="h-4 w-4 text-blue-500" />;
        }
    };

    if (!user) return null;

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-primary/10"
                onClick={() => setOpen(!open)}
            >
                {unreadCount > 0 ? (
                    <>
                        <BellRing className="h-5 w-5 text-primary animate-pulse" />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                            {unreadCount}
                        </span>
                    </>
                ) : (
                    <Bell className="h-5 w-5 text-muted-foreground" />
                )}
            </Button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-primary/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="p-4 border-b border-border bg-primary/5 flex items-center justify-between">
                        <h3 className="font-bold text-sm">Notificações</h3>
                        <div className="flex gap-2">
                            {unreadCount > 0 && (
                                <Button variant="ghost" size="sm" className="text-[10px] h-6 px-2" onClick={clearAll}>
                                    Limpar tudo
                                </Button>
                            )}
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <ScrollArea className="h-80">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Bell className="h-8 w-8 text-muted-foreground/30 mb-2" />
                                <p className="text-xs text-muted-foreground">Nenhuma notificação</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {notifications.map(n => (
                                    <div
                                        key={n.id}
                                        className={`p-4 hover:bg-primary/5 transition-colors cursor-pointer ${!n.read ? 'bg-primary/5' : ''}`}
                                        onClick={() => markAsRead(n.id)}
                                    >
                                        <div className="flex gap-3">
                                            <div className="mt-1">{getTypeIcon(n.type)}</div>
                                            <div className="flex-1">
                                                <p className={`text-sm ${!n.read ? 'font-bold' : 'font-medium'}`}>{n.title}</p>
                                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.message}</p>
                                                <p className="text-[10px] text-muted-foreground mt-2">
                                                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: ptBR })}
                                                </p>
                                            </div>
                                            {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-2" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>

                    <div className="p-3 border-t border-border bg-muted/5 text-center">
                        <Button variant="link" size="sm" className="text-xs h-auto p-0" onClick={() => setOpen(false)}>
                            Ver todas
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
