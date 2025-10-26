import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { formatCurrency } from '@shared/businessLogic';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/admin/stats'],
    queryFn: async () => {
      // Get all orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*');

      if (ordersError) throw ordersError;

      // Calculate stats
      const totalDownPayments = orders
        .filter(o => o.status === 'approved')
        .reduce((sum, o) => sum + parseFloat(o.down_payment || '0'), 0);

      const totalPendingDebt = orders
        .filter(o => o.status === 'approved')
        .reduce((sum, o) => sum + parseFloat(o.remaining_balance || '0'), 0);

      const pendingOrders = orders.filter(o => o.status === 'pending').length;
      const approvedOrders = orders.filter(o => o.status === 'approved').length;

      return {
        totalDownPayments,
        totalPendingDebt,
        pendingOrders,
        approvedOrders,
      };
    },
  });

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Overview of system performance and financials"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Down Payments
            </CardTitle>
            <span className="material-icons text-primary">payments</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {isLoading ? '...' : formatCurrency(stats?.totalDownPayments || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From approved orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pending Debt
            </CardTitle>
            <span className="material-icons text-destructive">account_balance</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {isLoading ? '...' : formatCurrency(stats?.totalPendingDebt || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Remaining 50% balance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Orders
            </CardTitle>
            <span className="material-icons text-secondary-foreground">pending</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {isLoading ? '...' : stats?.pendingOrders || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved Orders
            </CardTitle>
            <span className="material-icons text-primary">check_circle</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {isLoading ? '...' : stats?.approvedOrders || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Active credit lines
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
