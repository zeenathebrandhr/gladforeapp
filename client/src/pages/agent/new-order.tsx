import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/page-header';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { calculateTotalCost, calculateDownPayment, validateDownPayment, formatCurrency } from '@shared/businessLogic';
import type { Farmer } from '@shared/schema';
import { queryClient } from '@/lib/queryClient';

const orderSchema = z.object({
  farmerId: z.string().min(1, 'Please select a farmer'),
  productName: z.string().min(1, 'Product name is required'),
  quantity: z.coerce.number().positive('Quantity must be positive'),
  unitPrice: z.coerce.number().positive('Unit price must be positive'),
  downPayment: z.coerce.number().positive('Down payment is required'),
});

type OrderForm = z.infer<typeof orderSchema>;

export default function AgentNewOrder() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [totalCost, setTotalCost] = useState(0);
  const [requiredDownPayment, setRequiredDownPayment] = useState(0);
  const [isDownPaymentValid, setIsDownPaymentValid] = useState(false);

  const { data: { user } } = useQuery({
    queryKey: ['/api/auth/user'],
    queryFn: async () => {
      return await supabase.auth.getUser();
    },
  });

  const { data: farmers } = useQuery({
    queryKey: ['/api/agent/farmers'],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('farmers')
        .select('*')
        .eq('agent_id', user.id);

      if (error) throw error;
      return data as Farmer[];
    },
  });

  const form = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      farmerId: '',
      productName: '',
      quantity: 0,
      unitPrice: 0,
      downPayment: 0,
    },
  });

  const quantity = form.watch('quantity');
  const unitPrice = form.watch('unitPrice');
  const downPayment = form.watch('downPayment');

  useEffect(() => {
    if (quantity > 0 && unitPrice > 0) {
      const cost = calculateTotalCost(quantity, unitPrice);
      const required = calculateDownPayment(cost);
      setTotalCost(cost);
      setRequiredDownPayment(required);
      
      // Auto-fill down payment with 50%
      if (downPayment === 0) {
        form.setValue('downPayment', required);
      }
    }
  }, [quantity, unitPrice]);

  useEffect(() => {
    if (totalCost > 0 && downPayment > 0) {
      const isValid = validateDownPayment(totalCost, downPayment);
      setIsDownPaymentValid(isValid);
    } else {
      setIsDownPaymentValid(false);
    }
  }, [totalCost, downPayment]);

  const createOrderMutation = useMutation({
    mutationFn: async (data: OrderForm) => {
      if (!user) throw new Error('Not authenticated');
      if (!validateDownPayment(totalCost, data.downPayment)) {
        throw new Error('Down payment must be exactly 50% of total cost');
      }

      const { error } = await supabase
        .from('orders')
        .insert({
          farmer_id: data.farmerId,
          agent_id: user.id,
          product_name: data.productName,
          quantity: data.quantity.toString(),
          unit_price: data.unitPrice.toString(),
          total_cost: totalCost.toString(),
          down_payment: data.downPayment.toString(),
          remaining_balance: (totalCost - data.downPayment).toString(),
          status: 'pending',
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/agent/stats'] });
      toast({
        title: 'Order created',
        description: 'Order submitted for admin approval',
      });
      setLocation('/agent/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to create order',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: OrderForm) => {
    createOrderMutation.mutate(data);
  };

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6 max-w-2xl mx-auto">
      <PageHeader
        title="Create New Order"
        subtitle="Process fertilizer credit for a farmer"
      />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Farmer Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Farmer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="farmerId">Select Farmer</Label>
              <Select
                value={form.watch('farmerId')}
                onValueChange={(value) => form.setValue('farmerId', value)}
              >
                <SelectTrigger className="h-14" data-testid="select-farmer">
                  <SelectValue placeholder="Choose a linked farmer" />
                </SelectTrigger>
                <SelectContent>
                  {farmers?.map((farmer) => (
                    <SelectItem key={farmer.id} value={farmer.id}>
                      {farmer.name} - {farmer.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.farmerId && (
                <p className="text-sm text-destructive">{form.formState.errors.farmerId.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Product Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                placeholder="e.g., NPK Fertilizer 50kg"
                {...form.register('productName')}
                className="h-14"
                data-testid="input-product-name"
              />
              {form.formState.errors.productName && (
                <p className="text-sm text-destructive">{form.formState.errors.productName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.01"
                  placeholder="0"
                  {...form.register('quantity')}
                  className="h-14"
                  data-testid="input-quantity"
                />
                {form.formState.errors.quantity && (
                  <p className="text-sm text-destructive">{form.formState.errors.quantity.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitPrice">Unit Price (KES)</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...form.register('unitPrice')}
                  className="h-14"
                  data-testid="input-unit-price"
                />
                {form.formState.errors.unitPrice && (
                  <p className="text-sm text-destructive">{form.formState.errors.unitPrice.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cost Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Cost</span>
                <span className="font-semibold text-foreground">{formatCurrency(totalCost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Required Down Payment (50%)</span>
                <span className="font-semibold text-primary">{formatCurrency(requiredDownPayment)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Remaining Balance</span>
                <span className="font-semibold text-foreground">{formatCurrency(totalCost - requiredDownPayment)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="downPayment" className="flex items-center gap-2">
                Down Payment Amount (KES)
                {isDownPaymentValid && (
                  <span className="material-icons text-primary text-xl">check_circle</span>
                )}
              </Label>
              <Input
                id="downPayment"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...form.register('downPayment')}
                className={`h-14 text-lg font-semibold ${
                  isDownPaymentValid ? 'border-primary' : ''
                }`}
                data-testid="input-down-payment"
              />
              {!isDownPaymentValid && downPayment > 0 && (
                <p className="text-sm text-destructive">
                  Down payment must be exactly 50% ({formatCurrency(requiredDownPayment)})
                </p>
              )}
              {isDownPaymentValid && (
                <p className="text-sm text-primary flex items-center gap-1">
                  <span className="material-icons text-base">check_circle</span>
                  Exact 50% down payment verified
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12"
          disabled={!isDownPaymentValid || createOrderMutation.isPending}
          data-testid="button-submit-order"
        >
          {createOrderMutation.isPending ? 'Submitting...' : 'Submit Order for Approval'}
        </Button>
      </form>
    </div>
  );
}
