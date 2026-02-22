import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/auth-context';
import { insertUserSchema, type InsertUser } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Mail, 
  Lock, 
  CheckCircle,
  Star,
  Shield,
  Zap
} from 'lucide-react';

export default function EnhancedSignupPage() {
  const [location, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [termsAccepted, setTermsAccepted] = useState(false);

  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      fullName: '',
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: InsertUser) => {
      const response = await fetch('https://smartfitdeploy.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseText = await response.text(); // Read response as text first
      if (!response.ok) {
        try {
          const error = responseText ? JSON.parse(responseText) : { message: 'Server error' };
          throw new Error(error.message || 'Signup failed');
        } catch (parseError) {
          throw new Error('Invalid server response');
        }
      }

      // Parse JSON only if response is OK
      return responseText ? JSON.parse(responseText) : {};
    },
    onSuccess: (data) => {
      login(data.user, data.token);
      toast({
        title: "Welcome to SmartFit!",
        description: "Account created successfully. Explore your new dashboard.",
      });
      setLocation('/profile');
    },
    onError: (error: Error) => {
      toast({
        title: "Signup Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertUser) => {
    if (!termsAccepted) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }
    signupMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Marketing Content */}
          <div className="space-y-8" data-testid="signup-marketing">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Create Account
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Join to get personalized fit predictions and recommendations
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-6">
              {[
                {
                  icon: Star,
                  title: "Personalized Recommendations",
                  description: "Get AI-powered clothing suggestions based on your measurements"
                },
                {
                  icon: Shield,
                  title: "Privacy Protected",
                  description: "Your measurements are secure, face detection is automatically blurred"
                },
                {
                  icon: Zap,
                  title: "Instant Fit Analysis",
                  description: "Real-time fit predictions with 95% accuracy rate"
                }
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-blue-100 rounded-full p-3 flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Teaser */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
              <h3 className="font-semibold mb-2">Unlock Premium Features!</h3>
              <p className="text-blue-100 text-sm">
                Save favorites, track fit history, get exclusive product suggestions, and access AR try-on technology.
              </p>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="w-full" data-testid="signup-form-container">
            <Card className="shadow-xl border-0">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Get Started Today
                </CardTitle>
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link 
                    href="/login" 
                    className="text-blue-600 hover:text-blue-700 font-medium"
                    data-testid="link-login"
                  >
                    Sign in here
                  </Link>
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    
                    {/* Full Name */}
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>Full Name</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your full name" 
                              {...field}
                              data-testid="input-fullname"
                              className="h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Username */}
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>Username</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Choose a username" 
                              {...field}
                              data-testid="input-username"
                              className="h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Email */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>Email</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Enter your email address" 
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
                              placeholder="Create a strong password" 
                              {...field}
                              data-testid="input-password"
                              className="h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Terms and Conditions */}
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        checked={termsAccepted}
                        onCheckedChange={setTermsAccepted}
                        data-testid="checkbox-terms"
                      />
                      <div className="text-sm">
                        <Label 
                          htmlFor="terms" 
                          className="text-gray-700 cursor-pointer leading-relaxed"
                        >
                          I agree to the{' '}
                          <a href="#" className="text-blue-600 hover:text-blue-700 underline">
                            Terms of Service
                          </a>{' '}
                          and{' '}
                          <a href="#" className="text-blue-600 hover:text-blue-700 underline">
                            Privacy Policy
                          </a>
                        </Label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-12 text-lg font-medium"
                      disabled={signupMutation.isPending || !termsAccepted}
                      data-testid="button-signup"
                    >
                      {signupMutation.isPending ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Creating Account...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5" />
                          <span>Create My Account</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>

                {/* Social Proof */}
                <div className="text-center pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">
                    Join 10,000+ users who've improved their shopping experience
                  </p>
                  <div className="flex justify-center items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.9/5 rating</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
