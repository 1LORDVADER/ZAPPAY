import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";

// Legal cannabis states (recreational or medical)
const LEGAL_STATES = [
  "AK", "AZ", "CA", "CO", "CT", "DE", "FL", "HI", "IL", "ME",
  "MD", "MA", "MI", "MN", "MO", "MT", "NV", "NJ", "NM", "NY",
  "OH", "OK", "OR", "PA", "RI", "SD", "VT", "VA", "WA", "DC"
];

const STATE_NAMES: Record<string, string> = {
  "AK": "Alaska", "AZ": "Arizona", "CA": "California", "CO": "Colorado",
  "CT": "Connecticut", "DE": "Delaware", "FL": "Florida", "HI": "Hawaii",
  "IL": "Illinois", "ME": "Maine", "MD": "Maryland", "MA": "Massachusetts",
  "MI": "Michigan", "MN": "Minnesota", "MO": "Missouri", "MT": "Montana",
  "NV": "Nevada", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York",
  "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania",
  "RI": "Rhode Island", "SD": "South Dakota", "VT": "Vermont",
  "VA": "Virginia", "WA": "Washington", "DC": "Washington DC"
};

type RejectionReason = "underage" | "illegal_state" | "geolocation_failed";

interface GeolocationData {
  state: string;
  stateName: string;
  city: string;
  country: string;
}

export function AgeGate() {
  const [isOpen, setIsOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState<RejectionReason | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [isCheckingLocation, setIsCheckingLocation] = useState(true);
  const [userLocation, setUserLocation] = useState<GeolocationData | null>(null);

  useEffect(() => {
    checkAgeVerification();
  }, []);

  const checkAgeVerification = async () => {
    // Check if user has already verified their age
    const sessionVerified = sessionStorage.getItem("ageVerified");
    const localVerified = localStorage.getItem("ageVerified");
    const localExpiry = localStorage.getItem("ageVerifiedExpiry");

    // Check if localStorage verification is still valid
    if (localVerified && localExpiry) {
      const expiryDate = new Date(localExpiry);
      if (expiryDate > new Date()) {
        // Still valid, allow access
        setIsCheckingLocation(false);
        return;
      } else {
        // Expired, clear it
        localStorage.removeItem("ageVerified");
        localStorage.removeItem("ageVerifiedExpiry");
      }
    }

    if (sessionVerified) {
      // Session verified, allow access
      setIsCheckingLocation(false);
      return;
    }

    // Not verified, check location first
    await checkUserLocation();
  };

  const checkUserLocation = async () => {
    try {
      // Use ipapi.co for geolocation (free, no API key required)
      const response = await fetch("https://ipapi.co/json/");
      
      if (!response.ok) {
        throw new Error("Geolocation service unavailable");
      }

      const data = await response.json();
      
      // Check if user is in the US
      if (data.country_code !== "US") {
        setRejectionReason("illegal_state");
        setIsCheckingLocation(false);
        return;
      }

      const userState = data.region_code;
      const stateName = STATE_NAMES[userState] || userState;

      setUserLocation({
        state: userState,
        stateName: stateName,
        city: data.city,
        country: data.country_name,
      });

      // Check if user is in a legal state
      if (!LEGAL_STATES.includes(userState)) {
        setRejectionReason("illegal_state");
        setIsCheckingLocation(false);
        return;
      }

      // Legal state, show age verification
      setIsCheckingLocation(false);
      setIsOpen(true);
    } catch (error) {
      console.error("Geolocation check failed:", error);
      
      // Fallback: If geolocation fails, still show age gate
      // Better to allow access than block legitimate users due to technical issues
      setIsCheckingLocation(false);
      setIsOpen(true);
    }
  };

  const handleVerifyAge = (isOver21: boolean) => {
    if (!isOver21) {
      setRejectionReason("underage");
      setIsOpen(false);
      return;
    }

    // User is 21+ and in legal state
    sessionStorage.setItem("ageVerified", "true");

    if (rememberMe) {
      // Store in localStorage for 30 days
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      localStorage.setItem("ageVerified", "true");
      localStorage.setItem("ageVerifiedExpiry", expiryDate.toISOString());
    }

    // Store location data for compliance logging
    if (userLocation) {
      sessionStorage.setItem("userState", userLocation.state);
      sessionStorage.setItem("userCity", userLocation.city);
    }

    setIsOpen(false);

    // Restore the originally intended URL (e.g. /join) after verification
    // The router renders NotFound while the gate is blocking, so we must
    // navigate to the correct path once the gate is dismissed.
    const intendedPath = window.location.pathname + window.location.search + window.location.hash;
    if (intendedPath && intendedPath !== "/") {
      // Force a hard reload to the same URL so the router re-renders correctly
      window.location.href = intendedPath;
    }
  };

  // Loading screen while checking location
  if (isCheckingLocation) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Verifying location...</p>
        </div>
      </div>
    );
  }

  // Rejection screens
  if (rejectionReason) {
    const rejectionContent = {
      underage: {
        title: "Age Restriction",
        message: "You must be 21 years or older to access this website. Cannabis products are only available to adults of legal age.",
        buttonText: "Learn About Cannabis Laws",
        buttonUrl: "https://www.samhsa.gov/find-help/national-helpline",
      },
      illegal_state: {
        title: "Location Restriction",
        message: userLocation
          ? `Cannabis products are not currently available in ${userLocation.stateName}. ZAPPAY only operates in states where cannabis is legal for recreational or medical use.`
          : "Cannabis products are not available in your location. ZAPPAY only operates in states where cannabis is legal.",
        buttonText: "View Legal States",
        buttonUrl: "https://www.ncsl.org/health/state-medical-cannabis-laws",
      },
      geolocation_failed: {
        title: "Verification Required",
        message: "We're unable to verify your location. Please ensure location services are enabled and try again.",
        buttonText: "Retry",
        buttonUrl: null,
      },
    };

    const content = rejectionContent[rejectionReason];

    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              {content.title}
            </h1>
            <p className="text-muted-foreground">
              {content.message}
            </p>
          </div>

          {userLocation && rejectionReason === "illegal_state" && (
            <div className="bg-muted p-4 rounded-lg text-sm">
              <p className="text-muted-foreground">Detected Location</p>
              <p className="font-semibold">
                {userLocation.city}, {userLocation.stateName}
              </p>
            </div>
          )}

          <div className="space-y-2">
            {content.buttonUrl ? (
              <Button
                onClick={() => window.location.href = content.buttonUrl!}
                variant="outline"
                className="w-full"
              >
                {content.buttonText}
              </Button>
            ) : (
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full"
              >
                {content.buttonText}
              </Button>
            )}

            <p className="text-xs text-muted-foreground">
              If you believe this is an error, please contact support at hello@zappayus.co
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Age verification modal
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center gap-6 py-4">
          {/* Logo */}
          <div className="h-20 w-20 flex items-center justify-center">
            <img
              src="/logo.png"
              alt="ZAPPAY"
              className="h-20 w-20 object-contain"
            />
          </div>

          {/* Title and Description */}
          <div className="text-center space-y-2">
            <DialogTitle className="text-2xl font-bold">
              Age Verification Required
            </DialogTitle>
            <DialogDescription className="text-base">
              You must be 21 years or older to access ZAPPAY. Cannabis products are restricted to adults of legal age in accordance with state and federal law.
            </DialogDescription>
          </div>

          {/* Location Info */}
          {userLocation && (
            <div className="bg-green-50 border border-green-200 p-3 rounded-lg w-full">
              <p className="text-sm text-green-800 text-center">
                ✓ Verified Location: {userLocation.city}, {userLocation.stateName}
              </p>
            </div>
          )}

          {/* Remember Me Checkbox */}
          <div className="flex items-center gap-2 w-full">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label
              htmlFor="rememberMe"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Remember me for 30 days
            </label>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 w-full">
            <Button
              onClick={() => handleVerifyAge(true)}
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              I'm 21 or Older - Enter Site
            </Button>

            <Button
              onClick={() => handleVerifyAge(false)}
              variant="outline"
              size="lg"
              className="w-full"
            >
              I'm Under 21 - Exit
            </Button>
          </div>

          {/* Legal Disclaimer */}
          <p className="text-xs text-muted-foreground text-center">
            By entering this site, you agree to our Terms of Service and acknowledge that cannabis products are only available in states where cannabis is legal. Your location and age verification are logged for compliance purposes.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
