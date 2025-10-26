import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { supabase } from '@/lib/supabase';

export default function FarmerProfile() {
  const { data: profile } = useQuery({
    queryKey: ['/api/farmer/profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('farmers')
        .select('*')
        .eq('phone', user.phone || user.email)
        .single();

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6 max-w-2xl mx-auto">
      <PageHeader
        title="My Profile"
        subtitle="Farmer account information"
      />

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-card-border">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-icons text-primary text-3xl">person</span>
            </div>
            <div>
              <p className="font-semibold text-xl text-foreground">{profile?.name || 'Farmer'}</p>
              <p className="text-sm text-muted-foreground">Farmer</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Phone Number</p>
              <p className="font-medium text-foreground">{profile?.phone}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">National ID</p>
              <p className="font-medium font-mono text-foreground">{profile?.national_id}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
