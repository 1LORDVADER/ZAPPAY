import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { AgeGate } from "./components/AgeGate";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import FarmerDashboard from "./pages/FarmerDashboard";
import SalesRepDashboard from "./pages/SalesRepDashboard";
import AdminSalesPanel from "./pages/AdminSalesPanel";
import FarmerRegistration from "./pages/FarmerRegistration";
import Checkout from "./pages/Checkout";
import TrackOrder from "./pages/TrackOrder";
import LegalPage from "./pages/LegalPage";
import AdminTransportation from "./pages/AdminTransportation";
import DriverRegistration from "./pages/DriverRegistration";
import CompanyRegistration from "./pages/CompanyRegistration";
import Orders from "./pages/Orders";
import SalesRepRegistration from "./pages/SalesRepRegistration";
import AdminApplications from "./pages/AdminApplications";
import AdminAnalytics from "./pages/AdminAnalytics";
import MyApplications from "./pages/MyApplications";
import Advertise from "@/pages/Advertise";
import Pricing from "@/pages/Pricing";
import DispensaryApplication from "@/pages/DispensaryApplication";
import CheckoutSuccess from "@/pages/CheckoutSuccess";
import ForFarmers from "@/pages/ForFarmers";
import ForTransporters from "@/pages/ForTransporters";
import HowItWorks from "@/pages/HowItWorks";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/orders" component={Orders} />
      <Route path="/farmer/register" component={FarmerRegistration} />
      <Route path="/farmer/dashboard" component={FarmerDashboard} />
      <Route path="/sales/dashboard" component={SalesRepDashboard} />
      <Route path="/admin/sales" component={AdminSalesPanel} />
      <Route path="/admin/transportation" component={AdminTransportation} />
      <Route path="/admin/applications" component={AdminApplications} />
      <Route path="/admin/analytics" component={AdminAnalytics} />
      <Route path="/transportation/driver-register" component={DriverRegistration} />
      <Route path="/transportation/company-register" component={CompanyRegistration} />
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
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
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
