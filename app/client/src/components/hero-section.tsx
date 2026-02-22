import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Camera, Brain, Eye, Play, PlayCircle } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export default function HeroSection() {
  const { user } = useAuth();

  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                <span className="text-primary">AI-Powered</span> Body Measurement & Fit Prediction
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Measure your body via camera or images, upload clothing products, get AI fit predictions and AR try-on to avoid returns!
              </p>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-gray-700 font-medium">Real-time Camera</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-700 font-medium">AI Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-700 font-medium">AR Try-On</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href={user ? "/measurements" : "/signup"} data-testid="link-start-measuring">
                <Button size="lg" className="text-lg px-8 py-4 rounded-xl">
                  <Play className="mr-2 h-5 w-5" />
                  Start Measuring
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white" data-testid="button-watch-demo">
                <PlayCircle className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary" data-testid="stat-accuracy">95%</div>
                <div className="text-sm text-gray-600">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success" data-testid="stat-reduction">30%</div>
                <div className="text-sm text-gray-600">Return Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning" data-testid="stat-users">10K+</div>
                <div className="text-sm text-gray-600">Happy Users</div>
              </div>
            </div>
          </div>

          <div className="relative">
            {/* Hero illustration showing app interface */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto">
              <div className="space-y-6">
                {/* Camera preview mockup */}
                <div className="bg-gray-900 rounded-xl aspect-video relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
                  <div className="absolute top-4 right-4 bg-error/90 text-white px-2 py-1 rounded text-xs font-medium">
                    <i className="fas fa-user-secret mr-1"></i>
                    Face Blurred
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white text-sm">MediaPipe Active</span>
                        <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Measurement results */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Chest</span>
                    <span className="font-semibold" data-testid="measurement-chest">102 cm</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Shoulders</span>
                    <span className="font-semibold" data-testid="measurement-shoulders">45 cm</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Waist</span>
                    <span className="font-semibold" data-testid="measurement-waist">88 cm</span>
                  </div>
                </div>

                <Button className="w-full" data-testid="button-save-measurements">
                  Save Measurements
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
