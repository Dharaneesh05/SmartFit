import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { CloudUpload, Search, Check, AlertTriangle, X, Heart, Eye } from 'lucide-react';

interface FitPredictionProps {
  onTryOnAR?: (productId: string) => void;
  onAddToFavorites?: (productId: string) => void;
}

export default function FitPrediction({ onTryOnAR, onAddToFavorites }: FitPredictionProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [productInput, setProductInput] = useState('');
  const [productFile, setProductFile] = useState<File | null>(null);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [fitResult, setFitResult] = useState<any>(null);

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      const response = await apiRequest('POST', '/api/products', productData);
      return response.json();
    },
  });

  // Fit prediction mutation
  const fitPredictionMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await apiRequest('POST', '/api/fit-predict', { productId });
      return response.json();
    },
    onSuccess: (data) => {
      setFitResult(data);
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze fit",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductFile(file);
    }
  };

  const analyzeProduct = async () => {
    if (!productInput && !productFile) {
      toast({
        title: "Input Required",
        description: "Please upload an image or enter product details",
        variant: "destructive",
      });
      return;
    }

    try {
      // Mock product creation (in real app, would process image/URL)
      const productData = {
        name: productInput || (productFile ? productFile.name.replace(/\.[^/.]+$/, "") : "Unknown Product"),
        brand: "Sample Brand",
        description: productInput || "Uploaded product",
        size: "M",
        measurements: {
          chest: 104,
          shoulders: 46,
          waist: 90,
          length: 68,
        }
      };

      const product = await createProductMutation.mutateAsync(productData);
      setCurrentProduct(product);
      
      // Analyze fit
      await fitPredictionMutation.mutateAsync(product.id);
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze product",
        variant: "destructive",
      });
    }
  };

  const getFitStatusIcon = (status: string) => {
    switch (status) {
      case 'perfect':
        return <Check className="h-4 w-4" />;
      case 'acceptable':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <X className="h-4 w-4" />;
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Product Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Product</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload area */}
          <div 
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            data-testid="upload-area"
          >
            <div className="space-y-4">
              <CloudUpload className="mx-auto h-12 w-12 text-gray-400" />
              <div>
                <p className="text-lg font-medium text-gray-900">Drag & drop product image</p>
                <p className="text-gray-600">or click to browse</p>
                {productFile && (
                  <p className="text-sm text-primary mt-2" data-testid="selected-file">
                    Selected: {productFile.name}
                  </p>
                )}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              data-testid="input-file"
            />
          </div>

          {/* Alternative input methods */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-500 font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="product-input">Product URL or Description</Label>
              <Textarea
                id="product-input"
                placeholder="Paste product URL or enter description (e.g., 'Medium cotton t-shirt, chest 98cm')"
                value={productInput}
                onChange={(e) => setProductInput(e.target.value)}
                data-testid="input-product"
              />
            </div>
            
            <Button 
              onClick={analyzeProduct} 
              disabled={createProductMutation.isPending || fitPredictionMutation.isPending}
              className="w-full"
              data-testid="button-analyze"
            >
              <Search className="mr-2 h-4 w-4" />
              {createProductMutation.isPending || fitPredictionMutation.isPending ? 'Analyzing...' : 'Analyze Your Product'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Fit Analysis Results */}
      <Card>
        <CardHeader>
          <CardTitle>Analyszed product details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentProduct ? (
            <>
              {/* Product preview */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="aspect-square bg-gray-200 rounded-lg relative overflow-hidden max-w-32 mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-gray-100 flex items-center justify-center">
                      <span className="text-4xl">👕</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-900" data-testid="product-name">{currentProduct.name}</h4>
                    <p className="text-gray-600" data-testid="product-brand">{currentProduct.brand}</p>
                  </div>
                </CardContent>
              </Card>

              {fitResult ? (
                <>
                  {/* Overall fit status */}
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${getFitStatusColor(fitResult.fitStatus).replace('text-', 'bg-').replace('/10', '/20')}`}>
                        <div className={`text-2xl ${getFitStatusColor(fitResult.fitStatus)}`}>
                          {getFitStatusIcon(fitResult.fitStatus)}
                        </div>
                      </div>
                      <h4 className={`text-xl font-bold mb-2 ${getFitStatusColor(fitResult.fitStatus).split(' ')[1]}`} data-testid="fit-status">
                        {getFitStatusLabel(fitResult.fitStatus)}
                      </h4>
                      <p className="text-gray-600">
                        {fitResult.fitStatus === 'perfect' && "This size matches your measurements well"}
                        {fitResult.fitStatus === 'acceptable' && "This size works but could be better"}
                        {fitResult.fitStatus === 'poor' && "This size may not fit comfortably"}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Detailed measurements comparison */}
                  {fitResult.analysis?.measurements && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Measurement Comparison</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {Object.entries(fitResult.analysis.measurements.user).map(([key, userValue]: [string, any]) => {
                            const productValue = fitResult.analysis.measurements.product[key];
                            if (!productValue) return null;
                            
                            const diff = Math.abs((userValue as number) - (productValue as number));
                            const status = diff <= 2 ? 'perfect' : diff <= 4 ? 'acceptable' : 'poor';
                            
                            return (
                              <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0" data-testid={`comparison-${key}`}>
                                <span className="text-gray-700 capitalize">{key}</span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-gray-900 font-medium">{userValue} cm</span>
                                  <span className="text-gray-400">vs</span>
                                  <span className="text-gray-900 font-medium">{productValue} cm</span>
                                  <Badge className={`${getFitStatusColor(status)} border-0`}>
                                    {getFitStatusIcon(status)}
                                    <span className="ml-1">{status === 'perfect' ? 'Good' : status === 'acceptable' ? 'OK' : 'Tight'}</span>
                                  </Badge>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Recommendations */}
                  {fitResult.recommendations && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="flex items-start space-x-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                            <div className="text-sm">
                              <p className="text-yellow-800 font-medium">Recommendations</p>
                              <p className="text-yellow-700" data-testid="recommendations">{fitResult.recommendations}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Action buttons */}
                  <div className="space-y-3">
                    <Button 
                      onClick={() => onTryOnAR?.(currentProduct.id)} 
                      className="w-full"
                      data-testid="button-try-ar"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Try On with AR
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => onAddToFavorites?.(currentProduct.id)} 
                      className="w-full"
                      data-testid="button-add-favorites"
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      Add to Favorites
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">Analyzing fit...</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">Upload a product image or enter details to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
