import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/app-layout";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
import Landing from "@/pages/landing";

// Admin pages
import AdminDashboard from "@/pages/admin/dashboard";
import AdminFarmers from "@/pages/admin/farmers";
import AdminOrders from "@/pages/admin/orders";

// Agent pages
import AgentDashboard from "@/pages/agent/dashboard";
import AgentFarmers from "@/pages/agent/farmers";
import AgentNewOrder from "@/pages/agent/new-order";
import AgentProfile from "@/pages/agent/profile";

// Farmer pages
import FarmerOrders from "@/pages/farmer/orders";
import FarmerPayments from "@/pages/farmer/payments";
import FarmerProfile from "@/pages/farmer/profile";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/login" component={LoginPage} />
      <Route path="/">
        {() => <Landing />}
      </Route>

      {/* Admin routes */}
      <Route path="/admin/dashboard">
        {() => (
          <AppLayout>
            <AdminDashboard />
          </AppLayout>
        )}
      </Route>
      <Route path="/admin/farmers">
        {() => (
          <AppLayout>
            <AdminFarmers />
          </AppLayout>
        )}
      </Route>
      <Route path="/admin/orders">
        {() => (
          <AppLayout>
            <AdminOrders />
          </AppLayout>
        )}
      </Route>

      {/* Agent routes */}
      <Route path="/agent/dashboard">
        {() => (
          <AppLayout>
            <AgentDashboard />
          </AppLayout>
        )}
      </Route>
      <Route path="/agent/farmers">
        {() => (
          <AppLayout>
            <AgentFarmers />
          </AppLayout>
        )}
      </Route>
      <Route path="/agent/new-order">
        {() => (
          <AppLayout>
            <AgentNewOrder />
          </AppLayout>
        )}
      </Route>
      <Route path="/agent/profile">
        {() => (
          <AppLayout>
            <AgentProfile />
          </AppLayout>
        )}
      </Route>

      {/* Farmer routes */}
      <Route path="/farmer/orders">
        {() => (
          <AppLayout>
            <FarmerOrders />
          </AppLayout>
        )}
      </Route>
      <Route path="/farmer/payments">
        {() => (
          <AppLayout>
            <FarmerPayments />
          </AppLayout>
        )}
      </Route>
      <Route path="/farmer/profile">
        {() => (
          <AppLayout>
            <FarmerProfile />
          </AppLayout>
        )}
      </Route>

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
