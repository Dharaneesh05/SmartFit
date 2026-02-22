
import { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Video, Expand, Settings, Share, ShoppingCart, Bookmark } from 'lucide-react';

interface FootwearProduct {
  id: string;
  name: string;
  brand?: string;
  size?: string;
  color?: string;
  category: 'footwear';
  type: 'formal' | 'casual' | 'sports' | 'sandals';
}

interface FootARTryOnProps {
  product: FootwearProduct;
  onPurchase?: (productId: string) => void;
  onSaveToProfile?: (productId: string) => void;
}

export default function FootARTryOn({ 
  product, 
  onPurchase, 
  onSaveToProfile 
}: FootARTryOnProps) {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isARActive, setIsARActive] = useState(false);
  const [feetDetected, setFeetDetected] = useState(false);
  const [currentColor, setCurrentColor] = useState(product.color || 'black');
  const [selectedSize, setSelectedSize] = useState(product.size || '9');
  const [fitAnalysis, setFitAnalysis] = useState({
    length: 'perfect',
    width: 'good',
    comfort: 'good',
    overall: 'good'
  });

  const startARSession = useCallback(() => {
    setIsARActive(true);
    
    // Simulate foot detection
    setTimeout(() => {
      setFeetDetected(true);
    }, 2000);
  }, []);

  const stopARSession = useCallback(() => {
    setIsARActive(false);
    setFeetDetected(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      console.log('Foot AR photo captured');
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

  const getColorHex = (color: string) => {
    const colors: Record<string, string> = {
      black: '#1F2937',
      brown: '#92400E',
      white: '#F9FAFB',
      blue: '#3B82F6',
      red: '#EF4444',
      gray: '#6B7280'
    };
    return colors[color] || colors.black;
  };

  const getFootwearShape = (type: string) => {
    switch (type) {
      case 'formal':
        return 'rounded-lg';
      case 'sports':
        return 'rounded-2xl';
      case 'casual':
        return 'rounded-xl';
      case 'sandals':
        return 'rounded-lg';
      default:
        return 'rounded-lg';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Foot AR Camera Feed */}
      <div className="lg:col-span-2">
        <Card className="overflow-hidden">
          <CardContent className="p-0 bg-gray-900">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl relative overflow-hidden">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover webcam-container"
                  data-testid="foot-ar-webcam"
                />
                
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full ar-overlay"
                />

                {/* Status indicators */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                  <div className={`detection-indicator ${isARActive ? 'detection-active' : 'detection-inactive'}`}>
                    <div className={`w-2 h-2 rounded-full ${isARActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                    <span>Foot AR {isARActive ? 'Active' : 'Inactive'}</span>
                  </div>
                  
                  <div className={`detection-indicator ${feetDetected ? 'detection-active' : 'detection-processing'}`}>
                    <div className={`w-2 h-2 rounded-full ${feetDetected ? 'bg-green-500' : 'bg-blue-500 animate-pulse'}`}></div>
                    <span>{feetDetected ? 'Feet Detected' : 'Detecting Feet...'}</span>
                  </div>
                </div>

                {/* Enhanced footwear AR overlay with precise foot tracking */}
                {feetDetected && (
                  <div className="foot-measurement-overlay absolute bottom-[15%] left-1/2 transform -translate-x-1/2">
                    <div className="flex space-x-12">
                      {/* Left foot with enhanced realism */}
                      <div className="relative">
                        <div 
                          className={`w-40 h-28 ${getFootwearShape(product.type)} relative transition-all duration-300 shadow-2xl`}
                          style={{ 
                            background: `
                              linear-gradient(135deg, 
                                ${getColorHex(currentColor)}F8 0%, 
                                ${getColorHex(currentColor)}E8 25%, 
                                ${getColorHex(currentColor)}F0 50%, 
                                ${getColorHex(currentColor)}E6 75%, 
                                ${getColorHex(currentColor)}EA 100%
                              )`,
                            border: `3px solid ${getColorHex(currentColor)}C0`,
                            boxShadow: `
                              0 12px 30px ${getColorHex(currentColor)}25, 
                              inset 0 3px 8px rgba(255,255,255,0.2), 
                              inset 0 -3px 8px rgba(0,0,0,0.1),
                              0 0 25px ${getColorHex(currentColor)}15
                            `,
                            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))',
                            transform: 'perspective(600px) rotateX(8deg) rotateY(-3deg)'
                          }}
                        >
                          {/* Enhanced sports shoe details */}
                          {product.type === 'sports' && (
                            <>
                              <div className="absolute inset-2 border border-white/25 rounded-xl"></div>
                              <div className="absolute top-2 left-3 w-3 h-3 bg-white/80 rounded-full shadow-sm"></div>
                              <div className="absolute bottom-2 left-2 right-2 h-2 bg-white/40 rounded-full"></div>
                              <div className="absolute top-1/2 left-2 right-2 h-px bg-white/20"></div>
                              <div className="absolute top-4 right-3 w-8 h-2 bg-white/15 rounded transform rotate-12"></div>
                              <div className="absolute bottom-4 left-4 w-6 h-1 bg-white/25 rounded"></div>
                            </>
                          )}
                          
                          {/* Enhanced formal shoe details */}
                          {product.type === 'formal' && (
                            <>
                              <div className="absolute inset-3 border border-white/15 rounded-md"></div>
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-white/20"></div>
                              <div className="absolute top-3 left-4 right-4 h-px bg-white/15"></div>
                              <div className="absolute bottom-3 left-6 right-6 h-px bg-white/10"></div>
                              <div className="absolute top-4 right-4 w-2 h-2 bg-white/30 rounded-full"></div>
                            </>
                          )}

                          {/* Enhanced sandal details */}
                          {product.type === 'sandals' && (
                            <>
                              <div className="absolute top-1/4 left-3 right-3 h-2 bg-white/50 rounded-full"></div>
                              <div className="absolute top-1/2 left-5 right-5 h-2 bg-white/50 rounded-full"></div>
                              <div className="absolute top-3/4 left-4 right-4 h-1 bg-white/30 rounded"></div>
                              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-white/40"></div>
                            </>
                          )}

                          {/* Casual shoe details */}
                          {product.type === 'casual' && (
                            <>
                              <div className="absolute inset-2 border border-white/20 rounded-lg"></div>
                              <div className="absolute top-3 left-3 w-6 h-1 bg-white/30 rounded"></div>
                              <div className="absolute bottom-3 left-3 right-3 h-1 bg-white/20 rounded"></div>
                              <div className="absolute top-1/2 right-3 w-4 h-3 bg-white/15 rounded transform -rotate-12"></div>
                            </>
                          )}

                          {/* Enhanced fit indicators */}
                          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-md"></div>
                          <div className="absolute top-1 right-1 w-2 h-2 bg-green-300 rounded-full"></div>
                          
                          {/* Size indicator */}
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                            {selectedSize}
                          </div>
                          
                          {/* Texture overlay */}
                          <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white via-transparent to-black/10 rounded-xl"></div>
                        </div>
                      </div>

                      {/* Right foot with enhanced realism */}
                      <div className="relative">
                        <div 
                          className={`w-36 h-24 ${getFootwearShape(product.type)} relative transition-all duration-300 shadow-lg`}
                          style={{ 
                            background: `linear-gradient(225deg, ${getColorHex(currentColor)}F5, ${getColorHex(currentColor)}E6)`,
                            border: `2px solid ${getColorHex(currentColor)}B0`,
                            boxShadow: `0 8px 20px ${getColorHex(currentColor)}30, inset 0 2px 4px rgba(255,255,255,0.1)`
                          }}
                        >
                          {/* Mirror the left foot details with right-foot adjustments */}
                          {product.type === 'sports' && (
                            <>
                              <div className="absolute inset-2 border border-white/25 rounded-xl"></div>
                              <div className="absolute top-2 right-3 w-3 h-3 bg-white/80 rounded-full shadow-sm"></div>
                              <div className="absolute bottom-2 left-2 right-2 h-2 bg-white/40 rounded-full"></div>
                              <div className="absolute top-1/2 left-2 right-2 h-px bg-white/20"></div>
                              <div className="absolute top-4 left-3 w-8 h-2 bg-white/15 rounded transform -rotate-12"></div>
                              <div className="absolute bottom-4 right-4 w-6 h-1 bg-white/25 rounded"></div>
                            </>
                          )}
                          
                          {product.type === 'formal' && (
                            <>
                              <div className="absolute inset-3 border border-white/15 rounded-md"></div>
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-white/20"></div>
                              <div className="absolute top-3 left-4 right-4 h-px bg-white/15"></div>
                              <div className="absolute bottom-3 left-6 right-6 h-px bg-white/10"></div>
                              <div className="absolute top-4 left-4 w-2 h-2 bg-white/30 rounded-full"></div>
                            </>
                          )}

                          {product.type === 'sandals' && (
                            <>
                              <div className="absolute top-1/4 left-3 right-3 h-2 bg-white/50 rounded-full"></div>
                              <div className="absolute top-1/2 left-5 right-5 h-2 bg-white/50 rounded-full"></div>
                              <div className="absolute top-3/4 left-4 right-4 h-1 bg-white/30 rounded"></div>
                              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-white/40"></div>
                            </>
                          )}

                          {product.type === 'casual' && (
                            <>
                              <div className="absolute inset-2 border border-white/20 rounded-lg"></div>
                              <div className="absolute top-3 right-3 w-6 h-1 bg-white/30 rounded"></div>
                              <div className="absolute bottom-3 left-3 right-3 h-1 bg-white/20 rounded"></div>
                              <div className="absolute top-1/2 left-3 w-4 h-3 bg-white/15 rounded transform rotate-12"></div>
                            </>
                          )}

                          <div className="absolute -top-2 -left-2 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-md"></div>
                          <div className="absolute top-1 left-1 w-2 h-2 bg-green-300 rounded-full"></div>
                          
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                            {selectedSize}
                          </div>
                          
                          <div className="absolute inset-0 opacity-10 bg-gradient-to-bl from-white via-transparent to-black/10 rounded-xl"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Controls */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="ar-controls rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={capturePhoto}
                          className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg text-gray-700 border border-white/20"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg text-gray-700 border border-white/20"
                        >
                          <Video className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-gray-700 text-sm text-center">
                        <div className="font-medium">Great Fit Detected</div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg text-gray-700 border border-white/20"
                        >
                          <Expand className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg text-gray-700 border border-white/20"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="space-y-6">
        {/* Product */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Trying On</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="measurement-card flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                👟
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{product.name}</h4>
                <p className="text-gray-600 text-sm">
                  Size {selectedSize}
                  {product.brand && ` - ${product.brand}`}
                </p>
                <p className="text-primary font-medium text-sm">₹{Math.floor(Math.random() * 3000) + 1000}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fit Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fit Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(fitAnalysis).map(([key, status]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-gray-700 capitalize text-sm">{key} Fit</span>
                  <Badge className={`${status === 'perfect' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-blue-50 text-blue-800 border-blue-200'} border text-xs px-2 py-1`}>
                    {status === 'perfect' ? 'Perfect' : 'Good'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customization */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customize</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <div className="flex space-x-2">
                  {['black', 'brown', 'white', 'blue'].map((color) => (
                    <button
                      key={color}
                      onClick={() => changeColor(color)}
                      className={`w-8 h-8 rounded-full border-2 ${currentColor === color ? 'border-primary' : 'border-gray-200'}`}
                      style={{ backgroundColor: getColorHex(color) }}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <div className="flex space-x-2">
                  {['7', '8', '9', '10', '11'].map((size) => (
                    <button
                      key={size}
                      onClick={() => changeSize(size)}
                      className={`px-3 py-1 text-sm rounded-md border ${selectedSize === size ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-200'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button 
            onClick={() => onPurchase?.(product.id)} 
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Purchase - ₹{Math.floor(Math.random() * 3000) + 1000}
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              onClick={() => onSaveToProfile?.(product.id)}
            >
              <Bookmark className="mr-1 h-4 w-4" />
              Save
            </Button>
            <Button variant="outline">
              <Share className="mr-1 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
