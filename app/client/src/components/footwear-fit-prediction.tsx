
import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Camera, Zap, Package, TrendingUp, AlertCircle, CheckCircle, ShoppingCart } from 'lucide-react';

interface FootwearProduct {
  id: string;
  name: string;
  brand: string;
  size: string;
  category: 'footwear';
  type: 'formal' | 'casual' | 'sports' | 'sandals';
  images: string[];
}

interface FootwearFitPredictionProps {
  onTryOnAR?: (product: FootwearProduct) => void;
  onAddToFavorites?: (product: FootwearProduct) => void;
}

export default function FootwearFitPrediction({
  onTryOnAR,
  onAddToFavorites
}: FootwearFitPredictionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fitResult, setFitResult] = useState<{
    status: 'perfect' | 'good' | 'tight' | 'loose';
    confidence: number;
    analysis: {
      lengthFit: string;
      widthFit: string;
      comfortLevel: string;
      recommendation: string;
    };
    product: FootwearProduct;
  } | null>(null);

  const [productDetails, setProductDetails] = useState({
    name: '',
    brand: '',
    size: '',
    type: 'casual' as FootwearProduct['type']
  });

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const imagePromises = Array.from(files).map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      });

      const images = await Promise.all(imagePromises);
      setUploadedImages(images);
    }
  }, []);

  const analyzeFit = useCallback(async () => {
    if (uploadedImages.length === 0) return;

    setIsAnalyzing(true);

    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));

    const fitStatuses = ['perfect', 'good', 'tight', 'loose'] as const;
    const status = fitStatuses[Math.floor(Math.random() * fitStatuses.length)];
    const confidence = Math.floor(Math.random() * 20) + 80;

    const product: FootwearProduct = {
      id: Date.now().toString(),
      name: productDetails.name || 'Uploaded Footwear',
      brand: productDetails.brand || 'Unknown Brand',
      size: productDetails.size || '9',
      category: 'footwear',
      type: productDetails.type,
      images: uploadedImages
    };

    const analysis = {
      lengthFit: status === 'perfect' ? 'Perfect Length' : status === 'tight' ? 'Slightly Short' : status === 'loose' ? 'Slightly Long' : 'Good Length',
      widthFit: status === 'perfect' ? 'Perfect Width' : status === 'tight' ? 'Narrow Fit' : status === 'loose' ? 'Wide Fit' : 'Good Width',
      comfortLevel: status === 'perfect' ? 'Excellent Comfort' : status === 'good' ? 'Good Comfort' : 'Moderate Comfort',
      recommendation: status === 'perfect' 
        ? 'This footwear is an excellent fit for your foot measurements!'
        : status === 'good'
        ? 'This footwear should be comfortable for most activities.'
        : status === 'tight'
        ? 'Consider going up half a size for better comfort.'
        : 'Consider going down half a size for a better fit.'
    };

    setFitResult({
      status,
      confidence,
      analysis,
      product
    });

    setIsAnalyzing(false);
  }, [uploadedImages, productDetails]);

  const getFitStatusColor = (status: string) => {
    switch (status) {
      case 'perfect':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'good':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'tight':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'loose':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getFitIcon = (status: string) => {
    switch (status) {
      case 'perfect':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'good':
        return <TrendingUp className="h-5 w-5 text-blue-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Upload Section */}
      <Card className="card-professional">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800">Upload Footwear</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Product Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="footwear-name" className="text-sm font-medium text-slate-700">Name</Label>
              <Input
                id="footwear-name"
                value={productDetails.name}
                onChange={(e) => setProductDetails(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Running Shoes"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="footwear-brand" className="text-sm font-medium text-slate-700">Brand</Label>
              <Input
                id="footwear-brand"
                value={productDetails.brand}
                onChange={(e) => setProductDetails(prev => ({ ...prev, brand: e.target.value }))}
                placeholder="e.g., Nike"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="footwear-size" className="text-sm font-medium text-slate-700">Size</Label>
              <Input
                id="footwear-size"
                value={productDetails.size}
                onChange={(e) => setProductDetails(prev => ({ ...prev, size: e.target.value }))}
                placeholder="e.g., 9"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="footwear-type" className="text-sm font-medium text-slate-700">Type</Label>
              <select
                id="footwear-type"
                value={productDetails.type}
                onChange={(e) => setProductDetails(prev => ({ ...prev, type: e.target.value as FootwearProduct['type'] }))}
                className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="casual">Casual</option>
                <option value="formal">Formal</option>
                <option value="sports">Sports</option>
                <option value="sandals">Sandals</option>
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-primary transition-colors">
            <div className="space-y-4">
              <Package className="mx-auto h-12 w-12 text-slate-400" />
              <div>
                <p className="text-lg font-medium text-slate-900">Upload Footwear Images</p>
                <p className="text-slate-600">Multiple angles recommended for better analysis</p>
              </div>
              <div>
                <Label htmlFor="footwear-upload" className="sr-only">Choose files</Label>
                <Input
                  id="footwear-upload"
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isAnalyzing}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Images
                </Button>
              </div>
            </div>
          </div>

          {/* Uploaded Images Preview */}
          {uploadedImages.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-slate-800">Uploaded Images ({uploadedImages.length})</h4>
              <div className="grid grid-cols-3 gap-3">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative aspect-square bg-slate-100 rounded-lg overflow-hidden">
                    <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analyze Button */}
          <Button
            onClick={analyzeFit}
            disabled={uploadedImages.length === 0 || isAnalyzing}
            className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90"
          >
            <Zap className="mr-2 h-5 w-5" />
            {isAnalyzing ? 'Analyzing Fit...' : 'Analyze Fit with AI'}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card className="card-professional">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800">Fit Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          {isAnalyzing ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-slate-600">Analyzing footwear fit using AI...</p>
            </div>
          ) : fitResult ? (
            <div className="space-y-6">
              {/* Overall Fit Status */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  {getFitIcon(fitResult.status)}
                  <div>
                    <h3 className="font-semibold text-slate-800">Overall Fit</h3>
                    <p className="text-sm text-slate-600">{fitResult.confidence}% confidence</p>
                  </div>
                </div>
                <Badge className={`${getFitStatusColor(fitResult.status)} border text-sm px-3 py-1.5 rounded-md font-semibold`}>
                  {fitResult.status.charAt(0).toUpperCase() + fitResult.status.slice(1)} Fit
                </Badge>
              </div>

              {/* Detailed Analysis */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-800">Detailed Analysis</h4>
                {Object.entries(fitResult.analysis).map(([key, value]) => (
                  key !== 'recommendation' && (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-slate-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                      <span className="font-medium text-slate-900">{value}</span>
                    </div>
                  )
                ))}
              </div>

              {/* Recommendation */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">AI Recommendation</h4>
                <p className="text-blue-700">{fitResult.analysis.recommendation}</p>
              </div>

              {/* Product Info */}
              <div className="measurement-card">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center text-white text-2xl">
                    👟
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800">{fitResult.product.name}</h4>
                    <p className="text-slate-600">
                      {fitResult.product.brand} - Size {fitResult.product.size}
                    </p>
                    <p className="text-primary font-bold">₹{Math.floor(Math.random() * 4000) + 1000}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => onTryOnAR?.(fitResult.product)}
                  className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Try On with AR
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => onAddToFavorites?.(fitResult.product)}
                    variant="outline"
                    className="h-10"
                  >
                    Add to Favorites
                  </Button>
                  <Button variant="outline" className="h-10">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <p className="text-slate-600">Upload footwear images to get AI-powered fit analysis</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
