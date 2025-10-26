import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { StatusBadge } from '@/components/status-badge';
import { supabase } from '@/lib/supabase';
import { formatCurrency, formatDate } from '@shared/businessLogic';
import type { Order } from '@shared/schema';

export default function FarmerOrders() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['/api/farmer/orders'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get farmer record
      const { data: farmers, error: farmerError } = await supabase
        .from('farmers')
        .select('id')
        .eq('phone', user.phone || user.email)
        .limit(1);

      if (farmerError) throw farmerError;
      if (!farmers || farmers.length === 0) return [];

      const farmerId = farmers[0].id;

      // Get orders
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('farmer_id', farmerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
  });

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6">
      <PageHeader
        title="My Orders"
        subtitle="View your fertilizer credit orders"
      />

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading orders...
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">
                    {order.product_name}
                  </CardTitle>
                  <StatusBadge status={order.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Order ID</p>
                    <p className="font-mono text-xs">#{order.id.slice(0, 8)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-medium">{formatDate(order.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Quantity</p>
                    <p className="font-medium">{order.quantity} units</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Unit Price</p>
                    <p className="font-medium">{formatCurrency(parseFloat(order.unit_price))}</p>
                  </div>
                </div>

                <div className="border-t border-card-border pt-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Cost</p>
                      <p className="text-xl font-bold text-foreground">
                        {formatCurrency(parseFloat(order.total_cost))}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Down Payment</p>
                      <p className="text-xl font-bold text-primary">
                        {formatCurrency(parseFloat(order.down_payment))}
                      </p>
                    </div>
                  </div>
                </div>

                {order.status === 'approved' && (
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Remaining Balance</p>
                        <p className="text-lg font-semibold text-destructive">
                          {formatCurrency(parseFloat(order.remaining_balance))}
                        </p>
                      </div>
                      <span className="material-icons text-destructive">account_balance</span>
                    </div>
                  </div>
                )}
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
          <p className="text-sm text-muted-foreground mt-1">
            Contact your agent to create an order
          </p>
        </div>
      )}
    </div>
  );
}
