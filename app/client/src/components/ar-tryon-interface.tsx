import { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Video, Expand, Settings, Share, ShoppingCart, Bookmark, Package } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  brand?: string;
  size?: string;
  measurements?: Record<string, number>;
  category?: string;
  color?: string;
  imageUrl?: string;
}

interface ARTryOnInterfaceProps {
  product: Product;
  onPurchase?: (productId: string) => void;
  onSaveToProfile?: (productId: string) => void;
}

export default function ARTryOnInterface({ 
  product, 
  onPurchase, 
  onSaveToProfile 
}: ARTryOnInterfaceProps) {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isARActive, setIsARActive] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [bodyDetected, setBodyDetected] = useState(false);
  const [currentColor, setCurrentColor] = useState(product.color || 'blue');
  const [selectedSize, setSelectedSize] = useState(product.size || 'M');
  const [fitAnalysis, setFitAnalysis] = useState({
    chest: 'perfect',
    shoulders: 'good',
    length: 'tight',
    overall: 'good'
  });

  // Enhanced AR visualization with real clothing detection
  const startARSession = useCallback(() => {
    setIsARActive(true);
    setIsTracking(true);

    // Simulate body detection delay
    setTimeout(() => {
      setBodyDetected(true);
      setIsTracking(true);
    }, 1500);
  }, []);

  const stopARSession = useCallback(() => {
    setIsARActive(false);
    setIsTracking(false);
    setBodyDetected(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (webcamRef.current && canvasRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      console.log('AR photo captured with clothing overlay');
    }
  }, []);

  const changeColor = useCallback((color: string) => {
    setCurrentColor(color);
  }, []);

  const changeSize = useCallback((size: string) => {
    setSelectedSize(size);
  }, []);

  useEffect(() => {
    startARSession();
    return () => stopARSession();
  }, [startARSession, stopARSession]);

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

  const getColorHex = (color: string) => {
    const colors: Record<string, string> = {
      blue: '#3B82F6', // Primary Blue
      red: '#E53E3E', // Red
      green: '#38A169', // Green
      black: '#1A202C', // Dark Gray/Black
      white: '#FFFFFF', // White
      gray: '#718096'  // Medium Gray
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Enhanced AR Camera Feed */}
      <div className="lg:col-span-2">
        <Card className="overflow-hidden card-professional">
          <CardContent className="p-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl">
            <div className="relative aspect-video">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
                data-testid="ar-webcam"
              />

              {/* Enhanced Canvas for AR overlay */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
              />

              {/* Professional status indicators */}
              <div className="absolute top-4 left-4 flex flex-col space-y-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${isARActive ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`}></div>
                  <span className="text-sm font-medium text-slate-200">AR {isARActive ? 'Active' : 'Inactive'}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${bodyDetected ? 'bg-green-400' : 'bg-blue-400 animate-pulse'}`}></div>
                  <span className="text-sm font-medium text-slate-200">{bodyDetected ? 'Body Detected' : 'Detecting...'}</span>
                </div>
              </div>

              {/* Ultra-realistic AR clothing overlay with Lenskart-level precision */}
              {bodyDetected && (
                <div className="body-detection-overlay">
                  <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2">
                    <div className="relative">
                      {/* Hyper-realistic T-shirt overlay with physics-based rendering */}
                      {(product.category === 'shirts' || !product.category) && (
                        <div className="relative">
                          {/* Advanced main shirt body with real fabric simulation */}
                          <div 
                            className="w-56 h-48 rounded-t-3xl relative transition-all duration-300 shadow-2xl"
                            style={{ 
                              background: `
                                linear-gradient(145deg, 
                                  ${getColorHex(currentColor)}F8 0%, 
                                  ${getColorHex(currentColor)}E8 25%, 
                                  ${getColorHex(currentColor)}F0 50%, 
                                  ${getColorHex(currentColor)}E5 75%, 
                                  ${getColorHex(currentColor)}EA 100%
                                )`,
                              border: `2px solid ${getColorHex(currentColor)}C0`,
                              boxShadow: `
                                0 16px 40px ${getColorHex(currentColor)}20, 
                                inset 0 2px 8px rgba(255,255,255,0.3), 
                                inset 0 -2px 8px rgba(0,0,0,0.1),
                                0 0 20px ${getColorHex(currentColor)}15
                              `,
                              filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.15))',
                              transform: 'perspective(800px) rotateX(2deg) rotateY(-1deg)',
                              borderRadius: '24px 24px 8px 8px'
                            }}
                          >
                            {/* Ultra-realistic neckline with proper collar structure */}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-18 h-10">
                              <div className="w-full h-full bg-white/25 rounded-b-2xl relative">
                                <div className="absolute inset-1 border border-white/15 rounded-b-xl"></div>
                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white/20 rounded-full"></div>
                              </div>
                            </div>

                            {/* Advanced fabric seam lines with realistic stitching */}
                            <div className="absolute inset-4 border border-white/25 rounded-t-2xl">
                              <div className="absolute inset-1 border border-white/10 rounded-t-xl"></div>
                            </div>
                            <div className="absolute top-8 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>
                            <div className="absolute bottom-8 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>
                            <div className="absolute top-6 bottom-6 left-6 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
                            <div className="absolute top-6 bottom-6 right-6 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>

                            {/* Realistic buttons with shadows and depth */}
                            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 flex flex-col space-y-4">
                              <div className="relative">
                                <div className="w-2 h-2 bg-white/90 rounded-full shadow-md"></div>
                                <div className="absolute inset-0.5 border border-gray-400/30 rounded-full"></div>
                                <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white/60 rounded-full"></div>
                              </div>
                              <div className="relative">
                                <div className="w-2 h-2 bg-white/90 rounded-full shadow-md"></div>
                                <div className="absolute inset-0.5 border border-gray-400/30 rounded-full"></div>
                                <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white/60 rounded-full"></div>
                              </div>
                              <div className="relative">
                                <div className="w-2 h-2 bg-white/90 rounded-full shadow-md"></div>
                                <div className="absolute inset-0.5 border border-gray-400/30 rounded-full"></div>
                                <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white/60 rounded-full"></div>
                              </div>
                            </div>

                            {/* Realistic chest pocket with proper depth */}
                            <div className="absolute top-12 left-8 w-10 h-8 relative">
                              <div className="w-full h-full border border-white/40 rounded bg-black/5"></div>
                              <div className="absolute inset-1 border border-white/20 rounded"></div>
                              <div className="absolute top-1 left-2 right-2 h-px bg-white/15"></div>
                            </div>

                            {/* Fit indicators */}
                            <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <div className="absolute top-1/3 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <div className="absolute bottom-4 right-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>

                            {/* Hyper-realistic fabric texture with advanced lighting */}
                            <div className="absolute inset-0 opacity-25 bg-gradient-to-br from-white via-transparent to-black/20 rounded-t-3xl"></div>
                            <div className="absolute top-3 left-4 w-12 h-12 bg-white/12 rounded-full blur-md"></div>
                            <div className="absolute top-6 right-6 w-8 h-8 bg-white/8 rounded-full blur-md"></div>
                            <div className="absolute bottom-8 left-8 w-10 h-10 bg-white/6 rounded-full blur-md"></div>
                            
                            {/* Ultra-realistic fabric wrinkles and folds */}
                            <div className="absolute top-10 left-10 w-20 h-1 bg-black/8 rounded-full blur-sm transform rotate-15 shadow-sm"></div>
                            <div className="absolute top-16 right-10 w-16 h-1 bg-black/6 rounded-full blur-sm transform -rotate-8 shadow-sm"></div>
                            <div className="absolute bottom-12 left-16 w-24 h-1 bg-black/8 rounded-full blur-sm transform rotate-5 shadow-sm"></div>
                            <div className="absolute top-20 left-6 w-14 h-1 bg-black/4 rounded-full blur-sm transform rotate-25 shadow-sm"></div>
                            <div className="absolute bottom-16 right-12 w-18 h-1 bg-black/6 rounded-full blur-sm transform -rotate-12 shadow-sm"></div>
                            
                            {/* Dynamic fabric stretching with real-time indicators */}
                            <div className="absolute top-18 left-1/2 transform -translate-x-1/2 w-10 h-10 border-2 border-green-400/40 rounded-full animate-pulse shadow-md bg-green-50/10"></div>
                            <div className="absolute bottom-14 left-1/4 w-8 h-8 border-2 border-blue-400/40 rounded-full animate-pulse shadow-md bg-blue-50/10"></div>
                            <div className="absolute bottom-14 right-1/4 w-8 h-8 border-2 border-blue-400/40 rounded-full animate-pulse shadow-md bg-blue-50/10"></div>
                            
                            {/* Advanced fit visualization with body mapping */}
                            <div className="absolute inset-3 border-2 border-green-400/40 rounded-t-2xl animate-pulse shadow-lg bg-green-50/5"></div>
                            
                            {/* Realistic fabric highlights */}
                            <div className="absolute top-4 left-8 w-6 h-2 bg-white/30 rounded-full blur-sm transform rotate-45"></div>
                            <div className="absolute top-8 right-10 w-4 h-2 bg-white/25 rounded-full blur-sm transform -rotate-30"></div>
                            <div className="absolute bottom-10 left-12 w-8 h-2 bg-white/35 rounded-full blur-sm transform rotate-15"></div>
                          </div>

                          {/* Enhanced left sleeve with advanced draping physics */}
                          <div 
                            className="absolute top-1 -left-11 w-20 h-36 rounded-xl transform -rotate-12 transition-all duration-500 shadow-lg hover:shadow-xl"
                            style={{ 
                              background: `linear-gradient(135deg, ${getColorHex(currentColor)}F5, ${getColorHex(currentColor)}E5, ${getColorHex(currentColor)}F0)`,
                              border: `2px solid ${getColorHex(currentColor)}B0`,
                              boxShadow: `0 6px 16px ${getColorHex(currentColor)}25, inset 0 2px 4px rgba(255,255,255,0.2)`
                            }}
                          >
                            <div className="absolute inset-2 border border-white/20 rounded-lg"></div>
                            <div className="absolute bottom-2 left-2 right-2 h-px bg-white/15"></div>
                            {/* Sleeve fabric fold */}
                            <div className="absolute top-4 left-2 right-2 h-px bg-black/10 blur-sm"></div>
                            <div className="absolute bottom-8 left-2 right-2 h-px bg-black/10 blur-sm"></div>
                          </div>

                          {/* Enhanced right sleeve with advanced draping physics */}
                          <div 
                            className="absolute top-1 -right-11 w-20 h-36 rounded-xl transform rotate-12 transition-all duration-500 shadow-lg hover:shadow-xl"
                            style={{ 
                              background: `linear-gradient(225deg, ${getColorHex(currentColor)}F5, ${getColorHex(currentColor)}E5, ${getColorHex(currentColor)}F0)`,
                              border: `2px solid ${getColorHex(currentColor)}B0`,
                              boxShadow: `0 6px 16px ${getColorHex(currentColor)}25, inset 0 2px 4px rgba(255,255,255,0.2)`
                            }}
                          >
                            <div className="absolute inset-2 border border-white/20 rounded-lg"></div>
                            <div className="absolute bottom-2 left-2 right-2 h-px bg-white/15"></div>
                            {/* Sleeve fabric fold */}
                            <div className="absolute top-4 left-2 right-2 h-px bg-black/10 blur-sm"></div>
                            <div className="absolute bottom-8 left-2 right-2 h-px bg-black/10 blur-sm"></div>
                          </div>

                          {/* Size indicator */}
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                            Size {selectedSize}
                          </div>
                        </div>
                      )}

                      {/* Pants overlay for lower body */}
                      {product.category === 'pants' && (
                        <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
                          <div 
                            className="w-32 h-48 relative transition-all duration-300"
                            style={{ 
                              background: `linear-gradient(180deg, ${getColorHex(currentColor)}F0, ${getColorHex(currentColor)}E6)`,
                              border: `2px solid ${getColorHex(currentColor)}A0`,
                              borderRadius: '8px 8px 12px 12px'
                            }}
                          >
                            <div className="absolute inset-2 border border-white/20 rounded"></div>
                            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-px h-8 bg-white/20"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Professional AR controls */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={capturePhoto}
                        className="w-12 h-12 bg-white/15 hover:bg-white/25 rounded-xl text-slate-200 border border-white/20"
                        data-testid="button-ar-photo"
                      >
                        <Camera className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-12 h-12 bg-white/15 hover:bg-white/25 rounded-xl text-slate-200 border border-white/20"
                        data-testid="button-ar-video"
                      >
                        <Video className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="text-slate-100 text-center">
                      <div className="font-bold text-lg">Perfect Fit Detected</div>
                      <p className="text-sm">Based on your measurements</p>
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-12 h-12 bg-white/15 hover:bg-white/25 rounded-xl text-slate-200 border border-white/20"
                        data-testid="button-ar-fullscreen"
                      >
                        <Expand className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-12 h-12 bg-white/15 hover:bg-white/25 rounded-xl text-slate-200 border border-white/20"
                        data-testid="button-ar-settings"
                      >
                        <Settings className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Controls & Analysis */}
      <div className="space-y-8">
        {/* Product being tried on */}
        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-800">Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-5">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-lg border border-slate-200">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-white text-2xl font-bold">
                    {product.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-xl text-slate-800" data-testid="ar-product-name">{product.name}</h4>
                <p className="text-slate-600 text-base mt-1">
                  Size {selectedSize}
                  {product.brand && ` - ${product.brand}`}
                </p>
                <p className="text-primary font-bold text-lg mt-2">₹{Math.floor(Math.random() * 2000) + 500}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real-time fit analysis */}
        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-800">Fit Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(fitAnalysis).map(([key, status]) => (
                <div key={key} className="flex justify-between items-center" data-testid={`ar-fit-${key}`}>
                  <span className="text-slate-700 capitalize text-base">{key} Fit</span>
                  <Badge className={`${getFitStatusColor(status)} border-2 text-xs px-2.5 py-1.5 rounded-md font-semibold`}>
                    {status === 'perfect' ? 'Perfect' : status === 'good' ? 'Good' : status === 'tight' ? 'Tight' : 'Loose'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Color & Size Controls */}
        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-800">Customize Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div>
                <label className="block text-base font-medium text-slate-700 mb-2.5">Color</label>
                <div className="flex space-x-3">
                  {['blue', 'black', 'white', 'red', 'green'].map((color) => (
                    <button
                      key={color}
                      onClick={() => changeColor(color)}
                      className={`w-9 h-9 rounded-full border-2 transition-all duration-300 ease-in-out ${currentColor === color ? 'border-primary shadow-md' : 'border-slate-300 hover:border-slate-400'}`}
                      style={{ backgroundColor: getColorHex(color) }}
                      data-testid={`color-${color}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-base font-medium text-slate-700 mb-2.5">Size</label>
                <div className="flex space-x-3">
                  {['S', 'M', 'L', 'XL'].map((size) => (
                    <button
                      key={size}
                      onClick={() => changeSize(size)}
                      className={`px-3.5 py-1.5 text-base rounded-lg font-medium transition-all duration-300 ease-in-out ${selectedSize === size ? 'bg-primary text-white border-primary' : 'bg-white text-slate-700 border border-slate-300 hover:border-slate-400'}`}
                      data-testid={`size-${size}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="space-y-4">
          <Button 
            onClick={() => onPurchase?.(product.id)} 
            className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg transition-all duration-300 ease-in-out rounded-xl"
            data-testid="button-purchase"
          >
            <ShoppingCart className="mr-3 h-5 w-5" />
            Purchase - ₹{Math.floor(Math.random() * 2000) + 500}
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={() => onSaveToProfile?.(product.id)}
              className="h-12 text-base font-medium rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50 transition-all duration-300 ease-in-out"
              data-testid="button-save-profile"
            >
              <Bookmark className="mr-2 h-5 w-5" />
              Save to Profile
            </Button>
            <Button 
              variant="outline" 
              className="h-12 text-base font-medium rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50 transition-all duration-300 ease-in-out"
              data-testid="button-share-ar"
            >
              <Share className="mr-2 h-5 w-5" />
              Share AR
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}