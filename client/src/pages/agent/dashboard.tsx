import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { supabase } from '@/lib/supabase';

export default function AgentDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/agent/stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get agent's orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('agent_id', user.id);

      if (ordersError) throw ordersError;

      // Get agent's farmers
      const { data: farmers, error: farmersError } = await supabase
        .from('farmers')
        .select('*')
        .eq('agent_id', user.id);

      if (farmersError) throw farmersError;

      return {
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        approvedOrders: orders.filter(o => o.status === 'approved').length,
        linkedFarmers: farmers.length,
      };
    },
  });

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6">
      <PageHeader
        title="Agent Dashboard"
        subtitle="Manage orders and farmers"
        action={
          <Link href="/agent/new-order">
            <a>
              <Button className="w-full md:w-auto" data-testid="button-create-order">
                <span className="material-icons mr-2">add_circle</span>
                Create Order
              </Button>
            </a>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
            <span className="material-icons text-primary">receipt_long</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {isLoading ? '...' : stats?.totalOrders || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
            <span className="material-icons text-secondary-foreground">pending</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {isLoading ? '...' : stats?.pendingOrders || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved
            </CardTitle>
            <span className="material-icons text-primary">check_circle</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {isLoading ? '...' : stats?.approvedOrders || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              My Farmers
            </CardTitle>
            <span className="material-icons text-primary">people</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {isLoading ? '...' : stats?.linkedFarmers || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/agent/new-order">
          <a>
            <Card className="hover-elevate cursor-pointer">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-icons text-primary text-2xl">add_circle</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Create New Order</h3>
                  <p className="text-sm text-muted-foreground">Process fertilizer credit for a farmer</p>
                </div>
              </CardContent>
            </Card>
          </a>
        </Link>

        <Link href="/agent/farmers">
          <a>
            <Card className="hover-elevate cursor-pointer">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-icons text-primary text-2xl">people</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Manage Farmers</h3>
                  <p className="text-sm text-muted-foreground">View and link farmers</p>
                </div>
              </CardContent>
            </Card>
          </a>
        </Link>
      </div>
    </div>
  );
}
