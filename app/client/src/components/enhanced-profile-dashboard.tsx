import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialogFooter } from "@/components/ui/alert-dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  User, 
  Settings, 
  Heart, 
  BarChart3, 
  History, 
  Star,
  Download,
  Trash2,
  Users,
  HelpCircle,
  Search,
  LogOut,
  Calendar,
  Ruler,
  Eye,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useLocation } from 'wouter';

// Define interfaces based on API responses and component usage
interface Measurement {
  chest?: number;
  shoulders?: number;
  waist?: number;
  height?: number;
  hips?: number;
}

interface Favorite {
  id: string;
  productId: string;
  product?: {
    name?: string;
    brand?: string;
    imageUrl?: string;
  };
}

interface FitAnalysis {
  id: string;
  fitStatus: string;
  recommendations?: string;
  createdAt?: string;
}

interface Recommendation {
  id: string;
  productName: string;
  brand: string | null;
  fitScore: number;
  reason: string;
  createdAt: string;
}

interface UserHistory {
  id: string;
  action: string;
  details: string | null;
  createdAt: string;
}

export default function EnhancedProfileDashboard() {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('measurements');
  const queryClient = useQueryClient();

  // Fetch data with typed responses
  const { data: measurements } = useQuery<Measurement>({
    queryKey: ['/api/measurements'],
    enabled: !!user,
  });

  const { data: favorites = [] } = useQuery<Favorite[]>({
    queryKey: ['/api/favorites'],
    enabled: !!user,
  });

  const { data: fitAnalyses = [] } = useQuery<FitAnalysis[]>({
    queryKey: ['/api/fit-analyses'],
    enabled: !!user,
  });

  const { data: recommendations = [] } = useQuery<Recommendation[]>({
    queryKey: ['/api/recommendations'],
    enabled: !!user,
  });

  const { data: history = [] } = useQuery<UserHistory[]>({
    queryKey: ['/api/history'],
    enabled: !!user,
  });

  // Generate sample history data if none exists
  useEffect(() => {
    if (user && history.length === 0) {
      generateSampleHistory();
    }
  }, [user, history.length]);

  const generateSampleHistory = async () => {
    const sampleHistory = [
      { action: "Measured body", details: "Captured measurements using real-time camera" },
      { action: "Predicted fit for Classic Shirt", details: "Fit result: Perfect match (95% confidence)" },
      { action: "Added product to favorites", details: "Calvin Klein Cotton Shirt" },
      { action: "Viewed AR for Athletic Polo", details: "AR try-on session: 2 minutes" },
      { action: "Updated profile measurements", details: "Chest measurement updated to 104.8cm" },
    ];

    for (const historyItem of sampleHistory) {
      try {
        await fetch('/api/history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(historyItem),
        });
      } catch (error) {
        console.error('Failed to create history item:', error);
      }
    }

    queryClient.invalidateQueries({ queryKey: ['/api/history'] });
  };

  // Export data functionality
  const exportData = () => {
    const exportData = {
      profile: {
        username: user?.username,
        email: user?.email,
        exportDate: new Date().toISOString(),
      },
      measurements,
      favorites: favorites.length,
      analyses: fitAnalyses.length,
      recommendations: recommendations.length,
      historyCount: history.length,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitpredict-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle logout with confirmation
  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  // Filter history based on search term
  const filteredHistory = history.filter(item =>
    item.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.details && item.details.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please log in to view your profile.</p>
            <Button onClick={() => setLocation('/login')}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - User Info */}
          <div className="lg:col-span-1" data-testid="profile-sidebar">
            <Card className="sticky top-24">
              <CardContent className="p-6 text-center">
                {/* Avatar */}
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>

                {/* User Info */}
                <h2 className="text-xl font-bold text-gray-900 mb-1" data-testid="username-display">
                  {user.username}
                </h2>
                <p className="text-sm text-gray-600 mb-6" data-testid="email-display">
                  {user.email}
                </p>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full" 
                    onClick={() => setLocation('/measurements')}
                    data-testid="button-edit-profile"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Measurements
                  </Button>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full" 
                    onClick={exportData}
                    data-testid="button-export-data"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-red-600 border-red-200 hover:bg-red-50"
                        data-testid="button-logout-sidebar"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to log out? You'll need to sign in again to access your profile.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLogout}>
                          Yes, Log Out
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5" data-testid="profile-tabs">
                <TabsTrigger value="measurements" data-testid="tab-measurements">
                  <Ruler className="w-4 h-4 mr-2" />
                  Measurements
                </TabsTrigger>
                <TabsTrigger value="favorites" data-testid="tab-favorites">
                  <Heart className="w-4 h-4 mr-2" />
                  Favorites
                </TabsTrigger>
                <TabsTrigger value="analyses" data-testid="tab-analyses">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Saved Analysis
                </TabsTrigger>
                <TabsTrigger value="recommendations" data-testid="tab-recommendations">
                  <Star className="w-4 h-4 mr-2" />
                  Recommendations
                </TabsTrigger>
                <TabsTrigger value="history" data-testid="tab-history">
                  <History className="w-4 h-4 mr-2" />
                  History
                </TabsTrigger>
              </TabsList>

              {/* Measurements Tab */}
              <TabsContent value="measurements" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Body Measurements</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocation('/measurements')}
                        data-testid="button-re-measure"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Re-Measure
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {measurements ? (
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {Object.entries({
                          chest: 'Chest',
                          shoulders: 'Shoulders',
                          waist: 'Waist',
                          height: 'Height',
                          hips: 'Hips'
                        }).map(([key, label]) => (
                          <div key={key} className="text-center p-4 bg-gray-50 rounded-lg" data-testid={`measurement-${key}`}>
                            <div className="text-2xl font-bold text-primary mb-1">
                              {(measurements as any)[key] || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-600">{label}</div>
                            <div className="text-xs text-gray-500">cm</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Ruler className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No measurements yet</h3>
                        <p className="text-gray-600 mb-4">Get started with your first measurement session</p>
                        <Button onClick={() => setLocation('/measurements')}>
                          Take Measurements
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Favorites Tab */}
              <TabsContent value="favorites" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Favorite Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {favorites.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {favorites.map((favorite) => (
                          <Card key={favorite.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-4">
                                <img
                                  src={favorite.product?.imageUrl || '/api/placeholder/80/80'}
                                  alt={favorite.product?.name || 'Product Image'}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                  <h4 className="font-semibold">{favorite.product?.name || 'Unnamed Product'}</h4>
                                  <p className="text-sm text-gray-600">{favorite.product?.brand || 'Unknown Brand'}</p>
                                  <div className="flex space-x-2 mt-2">
                                    <Button variant="outline" size="sm" onClick={() => setLocation(`/ar-tryon?product=${favorite.productId}`)}>
                                      <Eye className="w-4 h-4 mr-1" />
                                      View AR
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
                        <p className="text-gray-600 mb-4">Products you like will appear here</p>
                        <Button onClick={() => setLocation('/fit-predict')}>
                          Explore Products
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Saved Analysis Tab */}
              <TabsContent value="analyses" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Fit Analysis History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {fitAnalyses.length > 0 ? (
                      <div className="space-y-4">
                        {fitAnalyses.map((analysis) => (
                          <Card key={analysis.id} className="border-l-4 border-l-primary">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold">Product Analysis</h4>
                                <Badge variant={analysis.fitStatus === 'perfect' ? 'default' : analysis.fitStatus === 'acceptable' ? 'secondary' : 'destructive'}>
                                  {analysis.fitStatus}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {analysis.recommendations || 'No specific recommendations'}
                              </p>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">
                                  {analysis.createdAt ? new Date(analysis.createdAt).toLocaleDateString() : 'N/A'}
                                </span>
                                <Button variant="outline" size="sm">
                                  <RefreshCw className="w-4 h-4 mr-1" />
                                  Re-Analyze
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No analyses yet</h3>
                        <p className="text-gray-600 mb-4">Your fit predictions will be saved here</p>
                        <Button onClick={() => setLocation('/fit-predict')}>
                          Predict Fit
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Recommendations Tab */}
              <TabsContent value="recommendations" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Personalized Recommendations</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocation('/recommendations')}
                        data-testid="button-view-all-recommendations"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View All
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recommendations.length > 0 ? (
                      <div className="space-y-4">
                        {recommendations.slice(0, 3).map((rec) => (
                          <Card key={rec.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold">{rec.productName}</h4>
                                <Badge variant="secondary">
                                  {rec.fitScore}% Match
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{rec.brand}</p>
                              <p className="text-sm text-blue-600">{rec.reason}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No recommendations yet</h3>
                        <p className="text-gray-600 mb-4">Complete your measurements to get personalized suggestions</p>
                        <Button onClick={() => setLocation('/measurements')}>
                          Take Measurements
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Activity History</CardTitle>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search activities..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                        data-testid="input-search-history"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {filteredHistory.length > 0 ? (
                      <div className="space-y-3">
                        {filteredHistory.map((item) => (
                          <div key={item.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg" data-testid={`history-item-${item.id}`}>
                            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.action}</p>
                              {item.details && (
                                <p className="text-sm text-gray-600">{item.details}</p>
                              )}
                              <span className="text-xs text-gray-500">
                                {new Date(item.createdAt).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          {searchTerm ? 'No matching activities' : 'No activity yet'}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {searchTerm ? 'Try a different search term' : 'Your app usage will be tracked here'}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Community Tips Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Community Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="measuring-tips">
                    <AccordionTrigger>How to measure accurately</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                        <li>Stand straight with arms relaxed at your sides</li>
                        <li>Wear fitted clothing for best camera detection</li>
                        <li>Ensure good lighting and clear background</li>
                        <li>Take measurements at the same time of day for consistency</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="fit-tips">
                    <AccordionTrigger>Understanding fit predictions</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                        <li>95%+ match: Excellent fit, highly recommended</li>
                        <li>85-94% match: Good fit with minor adjustments</li>
                        <li>70-84% match: Acceptable fit, consider sizing</li>
                        <li>Below 70%: Poor fit, try different size/style</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="privacy">
                    <AccordionTrigger>Privacy & data security</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                        <li>Face detection is automatically blurred during capture</li>
                        <li>Only body measurements are stored, not images</li>
                        <li>You can export or delete your data anytime</li>
                        <li>All data is encrypted and securely stored</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Delete Account Section */}
            <Card className="mt-8 border-red-200">
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" data-testid="button-delete-account">
                      <Trash2 className="w-4 h-4 mr-2 text-red-600" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Account</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove all your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                        Yes, Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
