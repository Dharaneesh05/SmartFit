import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Ruler, 
  Shirt, 
  Camera, 
  Star,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/auth-context';
import { useQuery } from '@tanstack/react-query';

interface Recommendation {
  id: string;
  productName: string;
  brand: string | null;
  imageUrl: string | null;
  fitScore: number;
  reason: string;
  price: string | null;
}

export default function EnhancedHeroSection() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();

  // Fetch featured recommendations for logged-in users
  const { data: recommendations = [] } = useQuery<Recommendation[]>({
    queryKey: ['/api/recommendations'],
    enabled: !!user,
  });

  // Sample featured products for non-authenticated users
  const featuredProducts = [
    {
      id: '1',
      productName: "Premium Cotton Shirt",
      brand: "Calvin Klein",
      imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400",
      fitScore: 95,
      reason: "Perfect for athletic builds",
      price: "₹599"
    },
    {
      id: '2',
      productName: "Slim Fit Chinos",
      brand: "J.Crew",
      imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400",
      fitScore: 88,
      reason: "Ideal waist-to-height ratio",
      price: "₹799"
    },
    {
      id: '3',
      productName: "Athletic Polo",
      brand: "Nike",
      imageUrl: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400",
      fitScore: 92,
      reason: "Excellent shoulder fit",
      price: "₹349"
    }
  ];

  const displayProducts = user && recommendations.length > 0 
    ? recommendations.slice(0, 3) 
    : featuredProducts;

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center mb-16" data-testid="hero-content">
          <Badge className="mb-6 px-4 py-2 text-sm" data-testid="hero-badge">
            {/* <Zap className="w-4 h-4 mr-2" /> */}
            AI-Powered Fit Technology
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              SmartFit
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            AI-powered body measurements, fit predictions, AR try-on, product suggestions, and 
            recommendations to <span className="font-semibold text-blue-600">reduce returns by 30%</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="px-8 py-4 text-lg"
              onClick={() => setLocation(user ? '/measurements' : '/signup')}
              data-testid="button-get-started"
            >
              {user ? 'Take Measurements' : 'Get Started'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-4 text-lg"
              onClick={() => setLocation('/ar-tryon')}
              data-testid="button-try-ar"
            >
              {/* <Camera className="mr-2 w-5 h-5" /> */}
              Try AR Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center">
              {/* <Shield className="w-5 h-5 mr-2 text-green-500" /> */}
              <span>Privacy Protected</span>
            </div>
            <div className="flex items-center">
              {/* <TrendingUp className="w-5 h-5 mr-2 text-blue-500" /> */}
              <span>90% Accuracy</span>
            </div>
            <div className="flex items-center">
              {/* <Star className="w-5 h-5 mr-2 text-yellow-500" /> */}
              <span>AI powered</span>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-20" data-testid="how-it-works">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
            {[
              {
                // icon: Ruler,
                title: "1. Measure Body",
                description: "Use our AI-powered camera technology to capture precise body measurements with privacy protection",
                // color: "bg-blue-500"
              },
              {
                // icon: Shirt,
                title: "2. Predict Fit & Get Recommendations", 
                description: "Our AI analyzes product compatibility and suggests personalized clothing recommendations",
                // color: "bg-green-500"
              },
              {
                // icon: Camera,
                title: "3. AR Try-On",
                description: "Visualize how clothes look on you with real-time augmented reality before purchasing",
                // color: "bg-purple-500"
              }
            ].map((step, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  {/* <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div> */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Recommendations Section */}
        <div className="mb-16" data-testid="featured-recommendations">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {user ? "Your Personalized Recommendations" : "Featured Recommendations"}
            </h2>
            <p className="text-xl text-gray-600">
              {user 
                ? "Based on your profile measurements and saved analyses" 
                : "Discover products that could be perfect for you"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayProducts.map((product, index) => (
              <Card key={product.id} className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={product.imageUrl || '/api/placeholder/400/300'}
                      alt={product.productName}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-3 right-3 bg-green-500">
                      <Star className="w-3 h-3 mr-1" />
                      {product.fitScore}% Match
                    </Badge>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {product.productName}
                      </h3>
                      {product.price && (
                        <span className="text-lg font-bold text-blue-600">
                          {product.price}
                        </span>
                      )}
                    </div>
                    
                    {product.brand && (
                      <p className="text-sm text-gray-600 mb-3">{product.brand}</p>
                    )}
                    
                    <p className="text-sm text-blue-600 mb-4">
                      Why it fits you: {product.reason}
                    </p>
                    
                    <Button 
                      className="w-full"
                      onClick={() => setLocation(user ? '/fit-predict' : '/signup')}
                      data-testid={`button-try-${index}`}
                    >
                      {user ? 'Try Now' : 'Sign Up to Try'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {user && (
            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                onClick={() => setLocation('/recommendations')}
                data-testid="button-view-all-recommendations"
              >
                View All Recommendations
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* CTA Section */}
        {!user && (
          <div className="bg-gradient-to-r from-blue-500 to-blue-900 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Transform Your Shopping Experience?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of users who've reduced returns and found their perfect fit
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="px-8 py-4 text-lg"
              onClick={() => setLocation('/signup')}
              data-testid="button-join-now"
            >
              Join SmartFit Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <h3 className="text-2xl font-bold mb-4">SmartFit</h3>
              <p className="text-gray-400">
                AI-powered clothing fit prediction for smarter shopping decisions.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/measurements" className="hover:text-white transition-colors">Measurements</a></li>
                <li><a href="/fit-predict" className="hover:text-white transition-colors">Fit Prediction</a></li>
                <li><a href="/ar-tryon" className="hover:text-white transition-colors">AR Try-On</a></li>
                <li><a href="/recommendations" className="hover:text-white transition-colors">Recommendations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>
          
          {/* <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 FitPredict. All rights reserved.</p>
          </div> */}
        </div>
      </footer>
    </div>
  );
}