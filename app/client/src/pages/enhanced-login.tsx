import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/auth-context';
import { loginSchema, type LoginData } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { 
  Mail, 
  Lock, 
  LogIn,
  Star,
  Shield,
  Users,
  TrendingUp
} from 'lucide-react';

export default function EnhancedLoginPage() {
  const [location, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      login(data.user, data.token);
      toast({
        title: "Welcome back!",
        description: "Successfully logged in. Check your profile for saved analyses and recommendations.",
      });
      setLocation('/profile');
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Welcome Content */}
          <div className="space-y-8" data-testid="login-welcome">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Welcome Back
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Access your profile, favorites, and recommendations
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              {[
                {
                  icon: Users,
                  number: "10,000+",
                  label: "Happy Users"
                },
                {
                  icon: TrendingUp,
                  number: "30%",
                  label: "Return Reduction"
                },
                {
                  icon: Star,
                  number: "4.9/5",
                  label: "User Rating"
                },
                {
                  icon: Shield,
                  number: "100%",
                  label: "Privacy Protected"
                }
              ].map((stat, index) => (
                <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Features Preview */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">What's waiting for you:</h3>
              <ul className="space-y-3">
                {[
                  "View your saved measurements and fit analyses",
                  "Access personalized product recommendations",
                  "Manage your favorite clothing items",
                  "Track your shopping and fit prediction history"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full" data-testid="login-form-container">
            <Card className="shadow-xl border-0">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Sign In to Your Account
                </CardTitle>
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link 
                    href="/signup" 
                    className="text-blue-600 hover:text-blue-700 font-medium"
                    data-testid="link-signup"
                  >
                    Create one here
                  </Link>
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    
                    {/* Email */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>Email Address</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Enter your email" 
                              {...field}
                              data-testid="input-email"
                              className="h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Password */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center space-x-2">
                            <Lock className="w-4 h-4" />
                            <span>Password</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Enter your password" 
                              {...field}
                              data-testid="input-password"
                              className="h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Forgot Password */}
                    <div className="text-right">
                      <a 
                        href="#" 
                        className="text-sm text-blue-600 hover:text-blue-700"
                        data-testid="link-forgot-password"
                      >
                        Forgot your password?
                      </a>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-12 text-lg font-medium"
                      disabled={loginMutation.isPending}
                      data-testid="button-login"
                    >
                      {loginMutation.isPending ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Signing In...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <LogIn className="w-5 h-5" />
                          <span>Sign In</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>

                {/* Demo Account */}
                <div className="text-center pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-3">
                    Want to try without signing up?
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      form.setValue('email', 'demo@fitpredict.com');
                      form.setValue('password', 'demo123456');
                    }}
                    data-testid="button-demo-account"
                  >
                    Use Demo Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}