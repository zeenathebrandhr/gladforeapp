import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { StatusBadge } from '@/components/status-badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { formatCurrency, formatDate } from '@shared/businessLogic';
import type { Order, Farmer, User } from '@shared/schema';
import { queryClient } from '@/lib/queryClient';

type OrderWithDetails = Order & {
  farmers: Farmer;
  agents: User;
};

export default function AdminOrders() {
  const { toast } = useToast();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['/api/admin/orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          farmers(*),
          agents:users!orders_agent_id_fkey(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as OrderWithDetails[];
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error: orderError } = await supabase
        .from('orders')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: user.id,
        })
        .eq('id', orderId);

      if (orderError) throw orderError;

      // Create payment schedule (50% remaining balance due in 30 days)
      const order = orders?.find(o => o.id === orderId);
      if (order) {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);

        const { error: paymentError } = await supabase
          .from('payments')
          .insert({
            order_id: orderId,
            amount: order.remaining_balance,
            due_date: dueDate.toISOString(),
            status: 'pending',
          });

        if (paymentError) throw paymentError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      toast({
        title: 'Order approved',
        description: 'Payment schedule has been created',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Approval failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'rejected' })
        .eq('id', orderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      toast({
        title: 'Order rejected',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Rejection failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const pendingOrders = orders?.filter(o => o.status === 'pending') || [];
  const otherOrders = orders?.filter(o => o.status !== 'pending') || [];

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6">
      <PageHeader
        title="Orders Management"
        subtitle="Review and approve farmer orders"
      />

      {/* Pending Orders */}
      {pendingOrders.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="material-icons text-secondary-foreground">pending</span>
            Pending Approval ({pendingOrders.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingOrders.map((order) => (
              <Card key={order.id} className="shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                    <StatusBadge status={order.status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Farmer</p>
                      <p className="font-medium">{order.farmers.name}</p>
                      <p className="text-xs text-muted-foreground">{order.farmers.phone}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Agent</p>
                      <p className="font-medium">{order.agents.name}</p>
                    </div>
                  </div>

                  <div className="border-t border-card-border pt-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Product</p>
                        <p className="font-medium">{order.product_name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Quantity</p>
                        <p className="font-medium">{order.quantity} units</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Cost</p>
                        <p className="font-semibold text-base">{formatCurrency(parseFloat(order.total_cost))}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Down Payment (50%)</p>
                        <p className="font-semibold text-base text-primary">
                          {formatCurrency(parseFloat(order.down_payment))}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button
                      className="flex-1"
                      onClick={() => approveMutation.mutate(order.id)}
                      disabled={approveMutation.isPending}
                      data-testid={`button-approve-${order.id}`}
                    >
                      <span className="material-icons mr-2 text-xl">check_circle</span>
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => rejectMutation.mutate(order.id)}
                      disabled={rejectMutation.isPending}
                      data-testid={`button-reject-${order.id}`}
                    >
                      <span className="material-icons mr-2 text-xl">cancel</span>
                      Reject
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Created: {formatDate(order.created_at)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Other Orders */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Order History ({otherOrders.length})
        </h2>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading orders...
          </div>
        ) : otherOrders.length > 0 ? (
          <div className="space-y-3">
            {otherOrders.map((order) => (
              <Card key={order.id} className="hover-elevate">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">{order.farmers.name}</span>
                        </p>
                        <p className="text-muted-foreground">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xl font-bold text-foreground">
                        {formatCurrency(parseFloat(order.total_cost))}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Paid: {formatCurrency(parseFloat(order.down_payment))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <span className="material-icons text-5xl text-muted-foreground mb-3">
              receipt_long
            </span>
            <p className="text-muted-foreground">No orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
