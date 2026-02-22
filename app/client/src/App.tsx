import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/auth-context";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Measurements from "@/pages/measurements";
import FitPredict from "@/pages/fit-predict";
import ARTryOn from "@/pages/ar-tryon";
import Profile from "@/pages/profile";
import EnhancedNavbar from "@/components/enhanced-navbar";
import Recommendations from "@/pages/recommendations";

function Router() {
  return (
    <>
      <EnhancedNavbar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/measurements" component={Measurements} />
        <Route path="/fit-predict" component={FitPredict} />
        <Route path="/ar-tryon" component={ARTryOn} />
        <Route path="/recommendations" component={Recommendations} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
