import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/Sidebar";
import Dashboard from "@/pages/Dashboard";
import Visitors from "@/pages/Visitors";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto h-screen relative scroll-smooth">
        {/* Decorative Background Elements */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-red-600/5 blur-[100px]" />
        </div>
        
        <div className="relative z-10 min-h-full">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/visitors" component={Visitors} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
