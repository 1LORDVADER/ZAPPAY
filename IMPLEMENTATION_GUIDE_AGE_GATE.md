# Age Verification Gate - Complete Implementation Guide

**Estimated Time:** 2 hours  
**Priority:** CRITICAL - Legal requirement before launch  
**Difficulty:** Easy

---

## Overview

The age verification gate is a modal that appears when users first visit ZAPPAY, asking them to confirm they are 21 years or older. This is required by federal and state cannabis laws. Users cannot browse products until they verify their age.

---

## Step 1: Create the AgeGate Component (30 minutes)

Create a new file: `client/src/components/AgeGate.tsx`

```tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export function AgeGate() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUnderage, setIsUnderage] = useState(false);

  useEffect(() => {
    // Check if user has already verified their age
    const ageVerified = sessionStorage.getItem("ageVerified");
    
    if (!ageVerified) {
      // Show the age gate modal
      setIsOpen(true);
    }
  }, []);

  const handleVerifyAge = (isOver21: boolean) => {
    if (isOver21) {
      // User confirmed they are 21+
      sessionStorage.setItem("ageVerified", "true");
      setIsOpen(false);
    } else {
      // User is under 21
      setIsUnderage(true);
    }
  };

  // If user is underage, show rejection screen
  if (isUnderage) {
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
              Access Restricted
            </h1>
            <p className="text-muted-foreground">
              You must be 21 years or older to access this website. Cannabis products are only available to adults of legal age.
            </p>
          </div>

          <Button
            onClick={() => window.location.href = "https://www.samhsa.gov/find-help/national-helpline"}
            variant="outline"
            className="w-full"
          >
            Learn About Cannabis Laws
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center gap-6 py-4">
          {/* Logo */}
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
            <img 
              src="/zappay-logo.jpeg" 
              alt="ZAPPAY" 
              className="h-12 w-12 rounded-full object-cover"
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
            By entering this site, you agree to our Terms of Service and acknowledge that cannabis products are only available in states where cannabis is legal.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Step 2: Integrate AgeGate into App (15 minutes)

Update `client/src/App.tsx` to wrap everything with the AgeGate:

```tsx
import { Route, Switch } from "wouter";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AgeGate } from "@/components/AgeGate";  // Add this import
import Home from "@/pages/Home";
import ProductDetail from "@/pages/ProductDetail";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="zappay-theme">
      <AgeGate />  {/* Add this component */}
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/product/:id" component={ProductDetail} />
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
```

---

## Step 3: Test the Age Gate (15 minutes)

### Test Case 1: First Visit (User Over 21)
1. Open browser in incognito mode
2. Navigate to `https://3000-...manus.computer`
3. Age gate modal should appear immediately
4. Click "I'm 21 or Older - Enter Site"
5. Modal should close and you can browse products
6. Refresh the page - modal should NOT appear again (sessionStorage remembers)

### Test Case 2: First Visit (User Under 21)
1. Open browser in incognito mode
2. Navigate to the site
3. Click "I'm Under 21 - Exit"
4. Should see red "Access Restricted" screen
5. Cannot access the site

### Test Case 3: Returning User
1. Verify age once
2. Close browser tab
3. Open new tab and visit site
4. Age gate should appear again (sessionStorage clears on browser close)

### Test Case 4: Cannot Bypass
1. Try pressing ESC key - modal should stay open
2. Try clicking outside modal - modal should stay open
3. Try navigating to `/product/1` directly - should still see age gate

---

## Step 4: Add Legal Compliance Enhancements (30 minutes)

### Option A: Add "Remember Me" Checkbox (Recommended)

Update the AgeGate component to include a checkbox that stores verification in localStorage instead of sessionStorage:

```tsx
const [rememberMe, setRememberMe] = useState(false);

useEffect(() => {
  // Check both sessionStorage and localStorage
  const sessionVerified = sessionStorage.getItem("ageVerified");
  const localVerified = localStorage.getItem("ageVerified");
  
  if (sessionVerified || localVerified) {
    setIsOpen(false);
  } else {
    setIsOpen(true);
  }
}, []);

const handleVerifyAge = (isOver21: boolean) => {
  if (isOver21) {
    sessionStorage.setItem("ageVerified", "true");
    
    if (rememberMe) {
      // Store in localStorage for 30 days
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      localStorage.setItem("ageVerified", "true");
      localStorage.setItem("ageVerifiedExpiry", expiryDate.toISOString());
    }
    
    setIsOpen(false);
  } else {
    setIsUnderage(true);
  }
};

// Add this checkbox before the buttons:
<div className="flex items-center gap-2">
  <input
    type="checkbox"
    id="rememberMe"
    checked={rememberMe}
    onChange={(e) => setRememberMe(e.target.checked)}
    className="h-4 w-4"
  />
  <label htmlFor="rememberMe" className="text-sm text-muted-foreground">
    Remember me for 30 days
  </label>
</div>
```

### Option B: Add State-Specific Restrictions

If you want to block certain states where cannabis is illegal:

```tsx
const LEGAL_STATES = [
  "AK", "AZ", "CA", "CO", "CT", "DE", "FL", "HI", "IL", "ME", 
  "MD", "MA", "MI", "MN", "MO", "MT", "NV", "NJ", "NM", "NY", 
  "OH", "OK", "OR", "PA", "RI", "SD", "VT", "VA", "WA", "DC"
];

// Add geolocation check (optional, requires user permission)
const checkUserLocation = async () => {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    const userState = data.region_code;
    
    if (!LEGAL_STATES.includes(userState)) {
      // Show "Not available in your state" message
      setIsUnderage(true);
    }
  } catch (error) {
    // If geolocation fails, allow access (don't block legitimate users)
    console.error("Geolocation check failed:", error);
  }
};
```

---

## Step 5: Add Analytics Tracking (15 minutes)

Track age gate interactions for compliance and optimization:

```tsx
const handleVerifyAge = (isOver21: boolean) => {
  // Track the event
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", "age_verification", {
      verified: isOver21,
      timestamp: new Date().toISOString(),
    });
  }

  if (isOver21) {
    sessionStorage.setItem("ageVerified", "true");
    setIsOpen(false);
  } else {
    setIsUnderage(true);
  }
};
```

---

## Step 6: Final Testing Checklist (15 minutes)

- [ ] Age gate appears on first visit
- [ ] Cannot close modal by clicking outside or pressing ESC
- [ ] "I'm 21 or Older" button works and stores verification
- [ ] "I'm Under 21" button shows rejection screen
- [ ] Verification persists across page refreshes (same session)
- [ ] Verification clears when browser is closed (new session)
- [ ] Mobile responsive (test on phone)
- [ ] Logo displays correctly
- [ ] Legal disclaimer text is visible
- [ ] No console errors
- [ ] Works in Chrome, Safari, Firefox

---

## Common Issues & Solutions

### Issue: Modal doesn't appear
**Solution:** Check that `<AgeGate />` is placed inside `<ThemeProvider>` in App.tsx

### Issue: Modal can be closed by clicking outside
**Solution:** Ensure `onPointerDownOutside` and `onEscapeKeyDown` handlers prevent default

### Issue: Verification doesn't persist
**Solution:** Check that sessionStorage is working in your browser (not in private/incognito mode for localStorage)

### Issue: Logo doesn't display
**Solution:** Ensure `/zappay-logo.jpeg` exists in `client/public/` directory

---

## Legal Compliance Notes

1. **Age Verification is Required:** Federal law and most state laws require age verification before displaying cannabis products
2. **Session vs Persistent Storage:** Using sessionStorage (clears on browser close) is more conservative than localStorage
3. **No Backdoor:** Ensure users cannot bypass the gate by directly navigating to product URLs
4. **Audit Trail:** Consider logging age verification events for compliance audits
5. **Terms of Service:** Link to your Terms of Service in the age gate disclaimer

---

## Next Steps After Implementation

1. Test thoroughly in multiple browsers
2. Have a lawyer review the legal disclaimer text
3. Add Google Analytics event tracking for age verification
4. Consider adding a "Why do we ask?" link explaining the legal requirement
5. Monitor bounce rate - if too high, consider simplifying the design

---

## Estimated Time Breakdown

- Create AgeGate component: 30 minutes
- Integrate into App: 15 minutes
- Basic testing: 15 minutes
- Add enhancements: 30 minutes
- Analytics tracking: 15 minutes
- Final testing: 15 minutes

**Total: 2 hours**

---

## Ready to Implement?

Once you complete this, move on to `IMPLEMENTATION_GUIDE_STRIPE_CHECKOUT.md` to enable payments.
