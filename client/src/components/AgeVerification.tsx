import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertCircle } from 'lucide-react';

const AGE_VERIFICATION_KEY = 'zappay_age_verified';

export function AgeVerification() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem(AGE_VERIFICATION_KEY);
    if (!verified) {
      setOpen(true);
    }
  }, []);

  const handleVerify = (isOver21: boolean) => {
    if (isOver21) {
      localStorage.setItem(AGE_VERIFICATION_KEY, 'true');
      setOpen(false);
    } else {
      window.location.href = 'https://www.google.com';
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-center text-2xl">Age Verification Required</DialogTitle>
          <DialogDescription className="text-center text-base">
            You must be 21 years or older to access this website. This site contains cannabis and hemp products intended for adults only.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg bg-muted p-4 text-sm">
            <p className="font-semibold mb-2">Legal Notice:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Cannabis (THC) products are for adults 21+ only</li>
              <li>THC cannabis is illegal under federal law; state laws vary</li>
              <li>
                Hemp-derived CBD products (&lt;0.3% THC) are federally legal
                under the 2018 Farm Bill and available in all 50 states
              </li>
              <li>
                THC products are only shown in jurisdictions where permitted —
                check your local regulations before purchasing
              </li>
              <li>Do not drive or operate machinery while using cannabis</li>
              <li>
                ZAPPAY is a payment processor; all products are sold by
                licensed third-party farmers
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button
            onClick={() => handleVerify(true)}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            I am 21 or older - Enter Site
          </Button>
          <Button
            onClick={() => handleVerify(false)}
            variant="outline"
            className="w-full"
            size="lg"
          >
            I am under 21 - Exit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
