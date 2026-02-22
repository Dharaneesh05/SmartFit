import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Heart, 
  ExternalLink, 
  Star,
  Filter,
  ShoppingCart,
  Shirt,
  Package,
  TrendingUp,
  Info,
  RotateCcw // Import RotateCcw
} from 'lucide-react';
import { useLocation } from 'wouter';

interface Recommendation {
  id: string;
  productName: string;
  brand: string | null;
  price: string | null;
  imageUrl: string | null;
  fitScore: number;
  reason: string;
  category: string | null;
  size: string | null;
  externalUrl: string | null;
  createdAt: string;
}

export default function RecommendationsPage() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [fitFilter, setFitFilter] = useState<string>('all');
  const queryClient = useQueryClient();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      setLocation('/login');
    }
  }, [user, setLocation]);

  // Fetch recommendations
  const { data: recommendations = [], isLoading } = useQuery<Recommendation[]>({
    queryKey: ['/api/recommendations'],
    enabled: !!user,
  });

  // Generate sample recommendations on first load if none exist
  useEffect(() => {
    if (user && recommendations.length === 0) {
      generateSampleRecommendations();
    }
  }, [user, recommendations.length]);

  const generateSampleRecommendations = async () => {
    const sampleRecs = [
      // Shirts
      {
        productName: "Premium Cotton Formal Shirt",
        brand: "Arrow",
        price: "₹1,299",
        imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400",
        fitScore: 95,
        reason: "Perfect chest fit, ideal shoulder width for your measurements",
        category: "shirts",
        size: "L",
        externalUrl: "https://amazon.in"
      },
      {
        productName: "Casual Linen Shirt",
        brand: "Fabindia",
        price: "₹899",
        imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400",
        fitScore: 92,
        reason: "Excellent fit for casual wear, breathable fabric",
        category: "shirts",
        size: "L",
        externalUrl: "https://fabindia.com"
      },
      {
        productName: "Athletic Fit Polo",
        brand: "Nike",
        price: "₹1,695",
        imageUrl: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400",
        fitScore: 89,
        reason: "Great for sports and casual wear, perfect arm length",
        category: "shirts",
        size: "L",
        externalUrl: "https://nike.com"
      },
      {
        productName: "Checked Cotton Shirt",
        brand: "Peter England",
        price: "₹749",
        imageUrl: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400",
        fitScore: 88,
        reason: "Classic fit, good for office and casual wear",
        category: "shirts",
        size: "L",
        externalUrl: "https://peterengland.com"
      },

      // Pants
      {
        productName: "Slim Fit Chinos",
        brand: "Blackberrys",
        price: "₹1,399",
        imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400",
        fitScore: 94,
        reason: "Perfect waist fit, ideal leg length for your height",
        category: "pants",
        size: "34x32",
        externalUrl: "https://blackberrys.com"
      },
      {
        productName: "Relaxed Fit Jeans",
        brand: "Levi's",
        price: "₹2,999",
        imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400",
        fitScore: 91,
        reason: "Comfortable waist, good hip room for your measurements",
        category: "pants",
        size: "34x32",
        externalUrl: "https://levis.in"
      },
      {
        productName: "Formal Trousers",
        brand: "Van Heusen",
        price: "₹1,199",
        imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400",
        fitScore: 87,
        reason: "Professional fit, good for office wear",
        category: "pants",
        size: "34x32",
        externalUrl: "https://vanheusenindia.com"
      },
      {
        productName: "Cargo Pants",
        brand: "Roadster",
        price: "₹899",
        imageUrl: "https://images.unsplash.com/photo-1506629905607-6f0d6f3a6102?w=400",
        fitScore: 85,
        reason: "Casual fit, good for weekend activities",
        category: "pants",
        size: "34",
        externalUrl: "https://myntra.com"
      },

      // Footwear
      {
        productName: "Leather Formal Shoes",
        brand: "Bata",
        price: "₹2,499",
        imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
        fitScore: 93,
        reason: "Perfect foot length match, comfortable width",
        category: "footwear",
        size: "9",
        externalUrl: "https://bata.in"
      },
      {
        productName: "Running Shoes",
        brand: "Adidas",
        price: "₹3,999",
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        fitScore: 96,
        reason: "Excellent foot measurements match, great arch support",
        category: "footwear",
        size: "9",
        externalUrl: "https://adidas.co.in"
      },
      {
        productName: "Canvas Sneakers",
        brand: "Converse",
        price: "₹2,799",
        imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400",
        fitScore: 89,
        reason: "Good casual fit, comfortable for daily wear",
        category: "footwear",
        size: "9",
        externalUrl: "https://converse.in"
      },
      {
        productName: "Sandals",
        brand: "Woodland",
        price: "₹1,899",
        imageUrl: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=400",
        fitScore: 87,
        reason: "Perfect for summer, good foot width match",
        category: "footwear",
        size: "9",
        externalUrl: "https://woodlandworldwide.com"
      },

      // Jackets
      {
        productName: "Denim Jacket",
        brand: "Wrangler",
        price: "₹2,499",
        imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
        fitScore: 90,
        reason: "Great shoulder fit, perfect for layering",
        category: "jackets",
        size: "L",
        externalUrl: "https://wrangler.in"
      },
      {
        productName: "Bomber Jacket",
        brand: "H&M",
        price: "₹1,999",
        imageUrl: "https://images.unsplash.com/photo-1544022613-087ca5a784a?w=400",
        fitScore: 88,
        reason: "Trendy fit, good arm length",
        category: "jackets",
        size: "L",
        externalUrl: "https://hm.com"
      },
      {
        productName: "Formal Blazer",
        brand: "Raymond",
        price: "₹4,999",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        fitScore: 94,
        reason: "Professional fit, excellent shoulder measurements",
        category: "jackets",
        size: "L",
        externalUrl: "https://raymond.in"
      }
    ];

    for (const rec of sampleRecs) {
      try {
        await fetch('/api/recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(rec),
        });
      } catch (error) {
        console.error('Failed to create sample recommendation:', error);
      }
    }

    queryClient.invalidateQueries({ queryKey: ['/api/recommendations'] });
  };

  // Add to favorites
  const addToFavoritesMutation = useMutation({
    mutationFn: async (recommendation: Recommendation) => {
      // First create a product from the recommendation
      const productResponse = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: recommendation.productName,
          brand: recommendation.brand,
          imageUrl: recommendation.imageUrl,
          description: recommendation.reason,
          size: recommendation.size,
        }),
      });

      if (!productResponse.ok) throw new Error('Failed to create product');
      const product = await productResponse.json();

      // Then add to favorites
      const favResponse = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ productId: product.id }),
      });

      if (!favResponse.ok) throw new Error('Failed to add to favorites');
      return favResponse.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
    },
  });

  const filteredRecommendations = recommendations.filter(rec => {
    const categoryMatch = categoryFilter === 'all' || rec.category === categoryFilter;
    const fitMatch = fitFilter === 'all' || 
      (fitFilter === 'excellent' && rec.fitScore >= 90) ||
      (fitFilter === 'good' && rec.fitScore >= 70 && rec.fitScore < 90) ||
      (fitFilter === 'fair' && rec.fitScore < 70);

    return categoryMatch && fitMatch;
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8" data-testid="recommendations-header">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            Personalized Recommendations
          </h1>
          <p className="text-xl text-slate-700">
            Discover items tailored to your unique style and fit.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Card className="shadow-lg border-none">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-2xl font-bold text-slate-900">
                <Filter className="w-6 h-6 text-blue-600" />
                <span>Filter Your Choices</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-2 uppercase tracking-wide">
                    Category
                  </label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="h-12 text-lg text-slate-700 border-slate-300 focus:ring-blue-500 focus:border-blue-500 focus:ring-2">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      <SelectItem value="all" className="hover:bg-slate-100 cursor-pointer">All Categories</SelectItem>
                      <SelectItem value="shirts" className="hover:bg-slate-100 cursor-pointer">Shirts</SelectItem>
                      <SelectItem value="pants" className="hover:bg-slate-100 cursor-pointer">Pants</SelectItem>
                      <SelectItem value="jackets" className="hover:bg-slate-100 cursor-pointer">Jackets</SelectItem>
                      <SelectItem value="footwear" className="hover:bg-slate-100 cursor-pointer">Footwear</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-2 uppercase tracking-wide">
                    Fit Quality
                  </label>
                  <Select value={fitFilter} onValueChange={setFitFilter}>
                    <SelectTrigger className="h-12 text-lg text-slate-700 border-slate-300 focus:ring-blue-500 focus:border-blue-500 focus:ring-2">
                      <SelectValue placeholder="All Fits" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      <SelectItem value="all" className="hover:bg-slate-100 cursor-pointer">All Fits</SelectItem>
                      <SelectItem value="excellent" className="hover:bg-slate-100 cursor-pointer">Excellent (90%+)</SelectItem>
                      <SelectItem value="good" className="hover:bg-slate-100 cursor-pointer">Good (70-89%)</SelectItem>
                      <SelectItem value="fair" className="hover:bg-slate-100 cursor-pointer">Fair (&lt;70%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse bg-gradient-to-br from-slate-50 to-slate-100 shadow-md rounded-xl">
                <CardContent className="p-6">
                  <div className="bg-slate-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-slate-200 h-4 rounded mb-2 w-3/4"></div>
                  <div className="bg-slate-200 h-4 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Recommendations Grid */}
        {!isLoading && filteredRecommendations.length === 0 && (
          <Card className="text-center py-16 bg-gradient-to-br from-blue-50 to-purple-50 border-none shadow-lg rounded-2xl">
            <CardContent>
              <Package className="w-20 h-20 text-blue-400 mx-auto mb-5" />
              <h3 className="text-3xl font-bold text-slate-900 mb-3">
                No Recommendations Yet
              </h3>
              <p className="text-xl text-slate-700 mb-8 leading-relaxed">
                {categoryFilter !== 'all' || fitFilter !== 'all' 
                  ? 'Try adjusting your filters to discover more items.'
                  : 'Complete your profile measurements to unlock personalized style suggestions.'}
              </p>
              <Button 
                onClick={() => setLocation('/measurements')}
                className="h-12 px-8 text-lg font-semibold shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
                data-testid="button-go-measurements"
              >
                Update Measurements
              </Button>
            </CardContent>
          </Card>
        )}

        {!isLoading && filteredRecommendations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="recommendations-grid">
            {filteredRecommendations.map((recommendation) => (
              <Card key={recommendation.id} className="overflow-hidden bg-white shadow-xl rounded-xl hover:shadow-2xl transition-shadow duration-300 border-none group">
                <CardContent className="p-0">
                  {/* Product Image */}
                  <div className="relative">
                    <img
                      src={recommendation.imageUrl || '/api/placeholder/400/300'}
                      alt={recommendation.productName}
                      className="w-full h-56 object-cover rounded-t-xl transition-transform duration-500 group-hover:scale-105"
                      data-testid={`image-${recommendation.id}`}
                      loading="lazy"
                    />
                    <Badge 
                      className={`absolute top-3 right-3 font-bold tracking-wide text-sm
                        ${recommendation.fitScore >= 90 ? 'bg-green-500 shadow-md' :
                        recommendation.fitScore >= 70 ? 'bg-yellow-500 shadow-md' : 'bg-orange-500 shadow-md'}`}
                      data-testid={`fit-score-${recommendation.id}`}
                    >
                      <Star className="w-3 h-3 mr-1" />
                      {recommendation.fitScore}% Fit
                    </Badge>
                  </div>

                  {/* Product Details */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-slate-900 line-clamp-2" data-testid={`name-${recommendation.id}`}>
                        {recommendation.productName}
                      </h3>
                      {recommendation.price && (
                        <span className="text-xl font-extrabold text-blue-600" data-testid={`price-${recommendation.id}`}>
                          {recommendation.price}
                        </span>
                      )}
                    </div>

                    {recommendation.brand && (
                      <p className="text-md text-slate-600 font-medium mb-3" data-testid={`brand-${recommendation.id}`}>
                        {recommendation.brand}
                      </p>
                    )}

                    <div className="flex items-center space-x-2 mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <Info className="w-5 h-5 text-blue-500" />
                      <span className="text-sm text-slate-700 leading-normal" data-testid={`reason-${recommendation.id}`}>
                        {recommendation.reason}
                      </span>
                    </div>

                    {recommendation.size && (
                      <p className="text-sm text-slate-600 mb-5">
                        Recommended size: <span className="font-semibold text-slate-800">{recommendation.size}</span>
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => addToFavoritesMutation.mutate(recommendation)}
                        disabled={addToFavoritesMutation.isPending}
                        className="flex-1 border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold"
                        data-testid={`button-favorite-${recommendation.id}`}
                      >
                        <Heart className="w-5 h-5 mr-2 fill-current text-red-500" />
                        Favorite
                      </Button>

                      {recommendation.externalUrl && (
                        <Button
                          size="lg"
                          onClick={() => window.open(recommendation.externalUrl!, '_blank')}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 font-semibold shadow-md transform hover:-translate-y-0.5"
                          data-testid={`button-buy-${recommendation.id}`}
                        >
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          Buy Now
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Generate More Recommendations Button */}
        {filteredRecommendations.length > 0 && (
          <div className="text-center mt-12">
            <Button 
              onClick={generateSampleRecommendations}
              className="h-12 px-8 text-lg font-semibold bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              data-testid="button-load-more"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Generate More Recommendations
            </Button>
          </div>
        )}

        {/* Footer Links */}
        <div className="mt-20 text-center pb-10">
          <p className="text-md text-slate-600 mb-5">
            Need more styling advice?
          </p>
          <div className="flex justify-center space-x-6">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => setLocation('/profile')}
              className="border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
            >
              My Profile
            </Button>
            <Button 
              size="lg" 
              className="bg-gray-800 hover:bg-gray-900 text-white font-medium shadow-md"
              onClick={() => setLocation('/measurements')}
            >
              Update Measurements
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}