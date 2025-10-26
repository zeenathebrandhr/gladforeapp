import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import type { Farmer } from '@shared/schema';
import { queryClient } from '@/lib/queryClient';

export default function AgentFarmers() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const authQuery = useQuery({
    queryKey: ['/api/auth/user'],
    queryFn: async () => {
      return await supabase.auth.getUser();
    },
  });
  const user = (authQuery.data as any)?.data?.user ?? null;

  const { data: farmers, isLoading } = useQuery({
    queryKey: ['/api/farmers/search', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('farmers')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`phone.ilike.%${searchQuery}%,national_id.ilike.%${searchQuery}%,name.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Farmer[];
    },
  });

  const linkMutation = useMutation({
    mutationFn: async (farmerId: string) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('farmers')
        .update({ agent_id: user.id })
        .eq('id', farmerId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/farmers/search'] });
      toast({
        title: 'Farmer linked',
        description: 'You can now create orders for this farmer',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to link farmer',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const myFarmers = farmers?.filter(f => f.agent_id === user?.id) || [];
  const availableFarmers = farmers?.filter(f => !f.agent_id) || [];

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6">
      <PageHeader
        title="My Farmers"
        subtitle="Search and link farmers to your account"
      />

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            search
          </span>
          <Input
            type="search"
            placeholder="Search by phone number, ID, or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-14 pl-12 pr-4 rounded-full"
            data-testid="input-search-farmer"
          />
        </div>
      </div>

      {/* My Linked Farmers */}
      {myFarmers.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            My Linked Farmers ({myFarmers.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myFarmers.map((farmer) => (
              <Card key={farmer.id} className="shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-icons text-primary text-2xl">person</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{farmer.name}</p>
                    <p className="text-sm text-muted-foreground">{farmer.phone}</p>
                    <p className="text-xs text-muted-foreground font-mono">ID: {farmer.national_id}</p>
                  </div>
                  <span className="material-icons text-primary">check_circle</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Available Farmers to Link */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Available Farmers ({availableFarmers.length})
        </h2>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Searching farmers...
          </div>
        ) : availableFarmers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableFarmers.map((farmer) => (
              <Card key={farmer.id} className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <span className="material-icons text-muted-foreground text-2xl">person_outline</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{farmer.name}</p>
                      <p className="text-sm text-muted-foreground">{farmer.phone}</p>
                      <p className="text-xs text-muted-foreground font-mono">ID: {farmer.national_id}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => linkMutation.mutate(farmer.id)}
                    disabled={linkMutation.isPending}
                    data-testid={`button-link-farmer-${farmer.id}`}
                  >
                    <span className="material-icons mr-2">link</span>
                    Link to My Account
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <span className="material-icons text-5xl text-muted-foreground mb-3">
              {searchQuery ? 'search_off' : 'people_outline'}
            </span>
            <p className="text-muted-foreground">
              {searchQuery ? 'No farmers found matching your search' : 'No farmers available to link'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
