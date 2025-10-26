import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { StatusBadge } from '@/components/status-badge';
import { supabase } from '@/lib/supabase';
import { formatCurrency, formatDate, isPaymentOverdue } from '@shared/businessLogic';
import type { Payment, Order } from '@shared/schema';

type PaymentWithOrder = Payment & {
  orders: Order;
};

export default function FarmerPayments() {
  const { data: payments, isLoading } = useQuery({
    queryKey: ['/api/farmer/payments'],
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

      // Get payments with order details
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          orders(*)
        `)
        .eq('orders.farmer_id', farmerId)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data as PaymentWithOrder[];
    },
  });

  const nextPayment = payments?.find(p => p.status === 'pending');
  const overduePayments = payments?.filter(p => 
    p.status === 'pending' && isPaymentOverdue(new Date(p.due_date))
  ) || [];

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6">
      <PageHeader
        title="Payment Schedule"
        subtitle="Track your remaining balance payments"
      />

      {/* Next Payment Due */}
      {nextPayment && (
        <Card className="mb-6 border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="material-icons text-primary">notifications_active</span>
              Next Payment Due
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Amount Due</p>
                <p className="text-3xl font-bold text-primary">
                  {formatCurrency(parseFloat(nextPayment.amount))}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="text-lg font-semibold">
                  {formatDate(nextPayment.due_date)}
                </p>
                {isPaymentOverdue(new Date(nextPayment.due_date)) && (
                  <StatusBadge status="overdue" className="mt-1" />
                )}
              </div>
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">Order</p>
              <p className="font-medium">{nextPayment.orders.product_name}</p>
              <p className="text-xs text-muted-foreground font-mono">
                #{nextPayment.orders.id.slice(0, 8)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overdue Warning */}
      {overduePayments.length > 0 && (
        <Card className="mb-6 border-2 border-destructive">
          <CardContent className="p-4 flex items-center gap-3">
            <span className="material-icons text-destructive text-3xl">warning</span>
            <div>
              <p className="font-semibold text-destructive">
                {overduePayments.length} Payment{overduePayments.length > 1 ? 's' : ''} Overdue
              </p>
              <p className="text-sm text-muted-foreground">
                Please contact your agent to arrange payment
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Payments */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Payment History ({payments?.length || 0})
        </h2>
        
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading payments...
          </div>
        ) : payments && payments.length > 0 ? (
          <div className="space-y-3">
            {payments.map((payment) => {
              const overdue = payment.status === 'pending' && isPaymentOverdue(new Date(payment.due_date));
              
              return (
                <Card 
                  key={payment.id} 
                  className={`shadow-sm ${overdue ? 'border-destructive' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold text-foreground">
                            {payment.orders.product_name}
                          </p>
                          <StatusBadge 
                            status={overdue ? 'overdue' : payment.status} 
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Due: {formatDate(payment.due_date)}
                        </p>
                        {payment.paid_date && (
                          <p className="text-sm text-primary">
                            Paid: {formatDate(payment.paid_date)}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-foreground">
                          {formatCurrency(parseFloat(payment.amount))}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <span className="material-icons text-5xl text-muted-foreground mb-3">
              payments
            </span>
            <p className="text-muted-foreground">No payments scheduled</p>
            <p className="text-sm text-muted-foreground mt-1">
              Payments will appear once orders are approved
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
