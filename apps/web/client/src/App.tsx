import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import AppLayout from "./components/AppLayout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import ECGViewer from "./pages/ECGViewer";
import BreathTest from "./pages/BreathTest";
import TENSControl from "./pages/TENSControl";
import GestureTrainer from "./pages/GestureTrainer";
import DataVault from "./pages/DataVault";
import ProductInfo from "./pages/ProductInfo";
import Settings from "./pages/Settings";
import Compare from "./pages/Compare";

/* Products hub — shows both devices; redirects to health-key-ultra detail by default */
function ProductsHub() {
  return <ProductInfo />;
}

function AppRoutes() {
  return (
    <Switch>
      {/* Public landing */}
      <Route path="/" component={Home} />
      <Route path="/compare" component={Compare} />

      {/* Authenticated app shell */}
      <Route path="/app">
        {() => (
          <AppLayout>
            <Switch>
              {/* /app → Dashboard */}
              <Route path="/app" component={Dashboard} />
              <Route path="/app/dashboard" component={Dashboard} />
              <Route path="/app/devices" component={Devices} />
              <Route path="/app/ecg" component={ECGViewer} />
              <Route path="/app/breath-test" component={BreathTest} />
              <Route path="/app/tens" component={TENSControl} />
              <Route path="/app/gesture-trainer" component={GestureTrainer} />
              <Route path="/app/vault" component={DataVault} />
              {/* /app/products → hub showing both devices */}
              <Route path="/app/products" component={ProductsHub} />
              {/* /app/products/:device → specific device detail */}
              <Route path="/app/products/:device" component={ProductInfo} />
              <Route path="/app/settings" component={Settings} />
              {/* Fallback inside /app */}
              <Route component={Dashboard} />
            </Switch>
          </AppLayout>
        )}
      </Route>

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster
            theme="dark"
            toastOptions={{
              style: {
                background: "#0c1220",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#ffffff",
                fontFamily: "'Inter', sans-serif",
              },
            }}
          />
          <AppRoutes />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
