import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { AgeGate } from "./components/AgeGate";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Loader2 } from "lucide-react";

// Eagerly load the most critical routes (home, product, cart)
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "@/pages/NotFound";

// Lazy load all other routes — each becomes its own JS chunk
const Cart = lazy(() => import("./pages/Cart"));
const FarmerDashboard = lazy(() => import("./pages/FarmerDashboard"));
const SalesRepDashboard = lazy(() => import("./pages/SalesRepDashboard"));
const AdminSalesPanel = lazy(() => import("./pages/AdminSalesPanel"));
const FarmerRegistration = lazy(() => import("./pages/FarmerRegistration"));
const Checkout = lazy(() => import("./pages/Checkout"));
const TrackOrder = lazy(() => import("./pages/TrackOrder"));
const LegalPage = lazy(() => import("./pages/LegalPage"));
const AdminTransportation = lazy(() => import("./pages/AdminTransportation"));
const DriverRegistration = lazy(() => import("./pages/DriverRegistration"));
const CompanyRegistration = lazy(() => import("./pages/CompanyRegistration"));
const Orders = lazy(() => import("./pages/Orders"));
const SalesRepRegistration = lazy(() => import("./pages/SalesRepRegistration"));
const AdminApplications = lazy(() => import("./pages/AdminApplications"));
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics"));
const MyApplications = lazy(() => import("./pages/MyApplications"));
const Advertise = lazy(() => import("@/pages/Advertise"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const DispensaryApplication = lazy(() => import("@/pages/DispensaryApplication"));
const CheckoutSuccess = lazy(() => import("@/pages/CheckoutSuccess"));
const ForFarmers = lazy(() => import("@/pages/ForFarmers"));
const ForTransporters = lazy(() => import("@/pages/ForTransporters"));
const HowItWorks = lazy(() => import("@/pages/HowItWorks"));
const Terms = lazy(() => import("@/pages/Terms"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const TransporterDashboard = lazy(() => import("@/pages/TransporterDashboard"));
const Rewards = lazy(() => import("@/pages/Rewards"));
const FarmerAnalytics = lazy(() => import("@/pages/FarmerAnalytics"));
const Referrals = lazy(() => import("@/pages/Referrals"));
const AdminPayments = lazy(() => import("@/pages/AdminPayments"));
const WholesalerWaitlist = lazy(() => import("@/pages/WholesalerWaitlist"));
const AdminWaitlist = lazy(() => import("@/pages/AdminWaitlist"));
const JoinLanding = lazy(() => import("@/pages/JoinLanding"));
const GrowerMarketplace = lazy(() => import("@/pages/GrowerMarketplace"));
const SupplierApplication = lazy(() => import("@/pages/SupplierApplication"));
const SupplierDashboard = lazy(() => import("@/pages/SupplierDashboard"));
const DispensaryDashboard = lazy(() => import("@/pages/DispensaryDashboard"));
const WholesalerDashboard = lazy(() => import("@/pages/WholesalerDashboard"));
const AdminSuppliers = lazy(() => import("@/pages/AdminSuppliers"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path="/product/:id" component={ProductDetail} />
        <Route path="/cart" component={Cart} />
        <Route path="/orders" component={Orders} />
        <Route path="/farmer/register" component={FarmerRegistration} />
        <Route path="/farmer/dashboard" component={FarmerDashboard} />
        <Route path="/farmer/analytics" component={FarmerAnalytics} />
        <Route path="/sales/dashboard" component={SalesRepDashboard} />
        <Route path="/admin/sales" component={AdminSalesPanel} />
        <Route path="/admin/transportation" component={AdminTransportation} />
        <Route path="/admin/applications" component={AdminApplications} />
        <Route path="/admin/analytics" component={AdminAnalytics} />
        <Route path="/admin/payments" component={AdminPayments} />
        <Route path="/transportation/driver-register" component={DriverRegistration} />
        <Route path="/transportation/company-register" component={CompanyRegistration} />
        <Route path="/transportation/dashboard" component={TransporterDashboard} />
        <Route path="/sales/register" component={SalesRepRegistration} />
        <Route path="/my-applications" component={MyApplications} />
        <Route path="/advertise" component={Advertise} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/dispensary-application" component={DispensaryApplication} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/checkout/success" component={CheckoutSuccess} />
        <Route path="/track/:id" component={TrackOrder} />
        <Route path="/legal/:page" component={LegalPage} />
        <Route path="/for-farmers" component={ForFarmers} />
        <Route path="/for-transporters" component={ForTransporters} />
        <Route path="/how-it-works" component={HowItWorks} />
        <Route path="/terms" component={Terms} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/rewards" component={Rewards} />
        <Route path="/referrals" component={Referrals} />
        <Route path="/wholesaler-waitlist" component={WholesalerWaitlist} />
        <Route path="/join" component={JoinLanding} />
        <Route path="/admin/waitlist" component={AdminWaitlist} />
        <Route path="/grower-marketplace" component={GrowerMarketplace} />
        <Route path="/supplier-application" component={SupplierApplication} />
        <Route path="/supplier/dashboard" component={SupplierDashboard} />
        <Route path="/dispensary/dashboard" component={DispensaryDashboard} />
        <Route path="/wholesaler/dashboard" component={WholesalerDashboard} />
        <Route path="/admin/suppliers" component={AdminSuppliers} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <AgeGate />
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
