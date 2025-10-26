import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import type { UserRole } from '@shared/schema';

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Get user role from profiles table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (userError) throw userError;

      const role = userData.role as UserRole;
      
      // Redirect based on role
      if (role === 'admin') {
        setLocation('/admin/dashboard');
      } else if (role === 'agent') {
        setLocation('/agent/dashboard');
      } else {
        setLocation('/farmer/orders');
      }

      toast({
        title: 'Login successful',
        description: `Welcome back!`,
      });
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });

      if (error) throw error;

      toast({
        title: 'OTP sent',
        description: 'Please check your phone for the verification code',
      });
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <span className="material-icons text-primary text-5xl">agriculture</span>
          </div>
          <CardTitle className="text-3xl font-bold">Gladfore</CardTitle>
          <CardDescription className="text-base">
            Fertilizer Credit Management System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Button
              variant={loginType === 'email' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setLoginType('email')}
              data-testid="button-login-type-email"
            >
              <span className="material-icons text-xl mr-2">email</span>
              Email
            </Button>
            <Button
              variant={loginType === 'phone' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setLoginType('phone')}
              data-testid="button-login-type-phone"
            >
              <span className="material-icons text-xl mr-2">phone</span>
              Phone
            </Button>
          </div>

          {loginType === 'email' ? (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-14"
                  data-testid="input-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-14"
                  data-testid="input-password"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12"
                disabled={isLoading}
                data-testid="button-login"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handlePhoneLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+254 700 000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="h-14"
                  data-testid="input-phone"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12"
                disabled={isLoading}
                data-testid="button-send-otp"
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>For Admin/Agent: Use email & password</p>
            <p>For Farmers: Use phone number (OTP)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
