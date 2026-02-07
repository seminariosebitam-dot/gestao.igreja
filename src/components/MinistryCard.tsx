import {
  Users, Heart, User, Zap, Star, Baby, HandHelping,
  Music, Palette, Video, Globe, Church, Trash2, UserPlus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ministry } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const iconMap: Record<string, React.ElementType> = {
  Users, Heart, User, Zap, Star, Baby, HandHelping, Music, Palette, Video, Globe, Church, UserPlus
};

interface MinistryCardProps {
  ministry: Ministry;
  onDelete?: (id: string) => void;
  onAddMember?: (ministry: Ministry) => void;
}

export function MinistryCard({ ministry, onDelete, onAddMember }: MinistryCardProps) {
  const Icon = iconMap[ministry.icon] || Church;
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'secretario' || user?.role === 'pastor' || user?.role === 'lider_ministerio';

  return (
    <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-primary/10 p-3">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex gap-1">
            {isAdmin && onAddMember && (
              <Button
                variant="ghost"
                size="icon"
                className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddMember(ministry);
                }}
                title="Adicionar Pessoa"
              >
                <UserPlus className="h-4 w-4" />
              </Button>
            )}
            {isAdmin && onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Deseja realmente excluir o ministério ${ministry.name}?`)) {
                    onDelete(ministry.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-lg mb-1">{ministry.name}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2 h-10">{ministry.description}</p>
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Líder: {ministry.leader}</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-primary">
            <Users className="h-3 w-3" />
            {ministry.memberCount} membros
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
