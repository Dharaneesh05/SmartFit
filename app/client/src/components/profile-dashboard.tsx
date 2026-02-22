import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  Edit, 
  SquareArrowOutUpLeft, 
  ArrowUpDown, 
  Eye, 
  ShoppingCart,
  Heart,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';

export default function ProfileDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user data
  const { data: measurements } = useQuery({
    queryKey: ['/api/measurements'],
    retry: false,
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ['/api/favorites'],
    retry: false,
  });

  const { data: fitAnalyses = [] } = useQuery({
    queryKey: ['/api/fit-analyses'],
    retry: false,
  });

  // Remove from favorites mutation
  const removeFromFavoritesMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await apiRequest('DELETE', `/api/favorites/${productId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      toast({
        title: "Removed from Favorites",
        description: "Product has been removed from your favorites.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Remove",
        description: error instanceof Error ? error.message : "Could not remove from favorites",
        variant: "destructive",
      });
    },
  });

  const handleRemoveFromFavorites = async (productId: string) => {
    await removeFromFavoritesMutation.mutateAsync(productId);
  };

  const getFitStatusIcon = (status: string) => {
    switch (status) {
      case 'perfect':
        return <CheckCircle className="h-4 w-4" />;
      case 'acceptable':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <XCircle className="h-4 w-4" />;
    }
  };

  const getFitStatusColor = (status: string) => {
    switch (status) {
      case 'perfect':
        return 'bg-success/10 text-success';
      case 'acceptable':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-destructive/10 text-destructive';
    }
  };

  const getFitStatusLabel = (status: string) => {
    switch (status) {
      case 'perfect':
        return 'Perfect Fit';
      case 'acceptable':
        return 'Good Fit';
      default:
        return 'Poor Fit';
    }
  };

  if (!user) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Profile Info */}
      <div className="space-y-6">
        {/* User card */}
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <Avatar className="w-20 h-20 mx-auto">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                {user.fullName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold text-gray-900" data-testid="user-name">{user.fullName}</h3>
              <p className="text-gray-600" data-testid="user-email">{user.email}</p>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary" data-testid="measurement-count">
                  {measurements ? '1' : '0'}
                </div>
                <div className="text-sm text-gray-600">Measurements Saved</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Activity Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Items Analyzed</span>
              <span className="font-semibold text-gray-900" data-testid="stat-analyzed">{fitAnalyses.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Perfect Fits</span>
              <span className="font-semibold text-success" data-testid="stat-perfect-fits">
                {fitAnalyses.filter((analysis: any) => analysis.fitStatus === 'perfect').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Favorites</span>
              <span className="font-semibold text-gray-900" data-testid="stat-favorites">{favorites.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Measurements History */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Body Measurements</CardTitle>
              <Link href="/measurements">
                <Button variant="ghost" size="sm" data-testid="button-update-measurements">
                  <Edit className="h-4 w-4 mr-2" />
                  Update
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {measurements ? (
              <div className="space-y-4">
                {Object.entries({
                  chest: { label: 'Chest', icon: SquareArrowOutUpLeft },
                  shoulders: { label: 'Shoulders', icon: SquareArrowOutUpLeft },
                  waist: { label: 'Waist', icon: SquareArrowOutUpLeft },
                  height: { label: 'Height', icon: ArrowUpDown },
                  hips: { label: 'Hips', icon: SquareArrowOutUpLeft }
                }).map(([key, { label, icon: Icon }]) => (
                  <div key={key} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0" data-testid={`measurement-${key}`}>
                    <div className="flex items-center space-x-3">
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="font-medium text-gray-900">{label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900">
                        {measurements[key]} cm
                      </span>
                      <p className="text-xs text-gray-500">
                        {measurements.updatedAt 
                          ? `Updated ${new Date(measurements.updatedAt).toLocaleDateString()}`
                          : 'Recently updated'
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <SquareArrowOutUpLeft className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">No measurements saved yet</p>
                <Link href="/measurements">
                  <Button data-testid="button-take-measurements">
                    Take Measurements
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent fit analyses */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Analyses</CardTitle>
          </CardHeader>
          <CardContent>
            {fitAnalyses.length > 0 ? (
              <div className="space-y-4">
                {fitAnalyses.slice(0, 3).map((analysis: any) => (
                  <div key={analysis.id} className="bg-white rounded-lg p-4 border border-gray-200" data-testid={`analysis-${analysis.id}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-semibold text-gray-900">Product Analysis</h5>
                      <Badge className={`${getFitStatusColor(analysis.fitStatus)} border-0`}>
                        {getFitStatusIcon(analysis.fitStatus)}
                        <span className="ml-1">{getFitStatusLabel(analysis.fitStatus)}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {analysis.recommendations || 'Fit analysis completed'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {analysis.createdAt 
                        ? `Analyzed ${new Date(analysis.createdAt).toLocaleDateString()}`
                        : 'Recently analyzed'
                      }
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">No fit analyses yet</p>
                <Link href="/fit-predict">
                  <Button data-testid="button-start-analysis">
                    Start Analysis
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Favorites & Recommendations */}
      <div className="space-y-6">
        {/* Favorite products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5" />
              <span>Favorite Products</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {favorites.length > 0 ? (
              <div className="space-y-4">
                {favorites.map((favorite: any) => (
                  <div key={favorite.id} className="bg-white rounded-lg p-4 border border-gray-200" data-testid={`favorite-${favorite.id}`}>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white">👕</span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900">{favorite.product.name}</h5>
                        <p className="text-sm text-gray-600">
                          {favorite.product.size && `Size ${favorite.product.size}`}
                          {favorite.product.brand && ` - ${favorite.product.brand}`}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" data-testid={`button-try-on-${favorite.id}`}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveFromFavorites(favorite.productId)}
                          data-testid={`button-remove-favorite-${favorite.id}`}
                        >
                          <XCircle className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">No favorites yet</p>
                <Link href="/fit-predict">
                  <Button data-testid="button-find-products">
                    Find Products
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended for You</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">
                Complete your measurements to get personalized recommendations
              </p>
              {!measurements && (
                <Link href="/measurements">
                  <Button data-testid="button-get-recommendations">
                    Take Measurements
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
