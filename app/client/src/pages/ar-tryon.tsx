import { useLocation, useRoute } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import ARTryOnInterface from '@/components/ar-tryon-interface';
import FootARTryOn from '@/components/foot-ar-tryon';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function ARTryOn() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/ar-tryon');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect if not authenticated
  if (!user) {
    setLocation('/login');
    return null;
  }

  // Get product ID from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('product');

  // Fetch product data
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['/api/products', productId],
    enabled: !!productId,
    retry: false,
  });

  // Add to favorites mutation
  const addToFavoritesMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await apiRequest('POST', '/api/favorites', { productId });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      toast({
        title: "Saved to Profile",
        description: "Product has been saved to your profile.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Save",
        description: error instanceof Error ? error.message : "Could not save to profile",
        variant: "destructive",
      });
    },
  });

  const handlePurchase = (productId: string) => {
    // Mock purchase (in real app, would redirect to checkout)
    toast({
      title: "Redirecting to Purchase",
      description: "You would be redirected to the retailer's website.",
    });
  };

  const handleSaveToProfile = async (productId: string) => {
    await addToFavoritesMutation.mutateAsync(productId);
  };

  if (!productId) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Product Selected</h2>
              <p className="text-gray-600 mb-6">Please select a product to try on with AR.</p>
              <button
                onClick={() => setLocation('/fit-predict')}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Fit Predict
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8 text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-gray-600">Loading AR experience...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">Product Not Found</h2>
              <p className="text-gray-600 mb-6">The product you're trying to view could not be found.</p>
              <button
                onClick={() => setLocation('/fit-predict')}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go Back
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 mt-11" data-testid="title-ar-tryon">
            AR Try-On Experience
          </h1>
          <p className="text-xl text-gray-600">
            See how clothes look on you with real-time augmented reality
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {product?.category === 'footwear' ? (
            <FootARTryOn
              product={{ 
                ...product, 
                category: 'footwear' as const,
                type: 'sports' as const
              }}
              onPurchase={handlePurchase}
              onSaveToProfile={handleSaveToProfile}
            />
          ) : (
            <ARTryOnInterface
              product={product || { id: '', name: 'No Product Selected' }}
              onPurchase={handlePurchase}
              onSaveToProfile={handleSaveToProfile}
            />
          )}
        </div>
      </div>
    </div>
  );
}
