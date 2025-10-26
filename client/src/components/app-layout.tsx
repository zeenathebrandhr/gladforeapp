import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { MobileNav } from './mobile-nav';
import { DesktopNav } from './desktop-nav';
import { supabase } from '@/lib/supabase';
import type { UserRole } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: userData } = useQuery({
    queryKey: ['/api/auth/session'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLocation('/login');
        return null;
      }

      const { data: userProfile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return {
        ...userProfile,
        role: userProfile.role as UserRole,
      };
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    });
    setLocation('/login');
  };

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <DesktopNav 
        userRole={userData.role} 
        userName={userData.name}
        onLogout={handleLogout}
      />
      <main className="min-h-screen md:min-h-0">
        {children}
      </main>
      <MobileNav userRole={userData.role} />
    </div>
  );
}
