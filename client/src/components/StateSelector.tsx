import { useState } from 'react';
import { MapPin, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { STATE_COMPLIANCE, getLegalStatusText } from '@shared/stateCompliance';
import { useGeolocation } from '@/hooks/useGeolocation';

export function StateSelector() {
  const { userState, updateUserState, stateInfo } = useGeolocation();
  const [open, setOpen] = useState(false);

  const handleStateSelect = (stateAbbr: string) => {
    updateUserState(stateAbbr);
    setOpen(false);
  };

  const legalStates = Object.entries(STATE_COMPLIANCE)
    .filter(([_, state]) => state.legalStatus !== 'illegal')
    .sort((a, b) => a[1].name.localeCompare(b[1].name));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <MapPin className="h-4 w-4" />
          {userState ? STATE_COMPLIANCE[userState]?.name : 'Select State'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Your State</DialogTitle>
          <DialogDescription>
            Choose your state to see products available in your area. We only show products legal in your jurisdiction.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
          {legalStates.map(([abbr, state]) => (
            <button
              key={abbr}
              onClick={() => handleStateSelect(abbr)}
              className={`
                p-3 rounded-lg border-2 text-left transition-all hover:border-primary
                ${userState === abbr ? 'border-primary bg-primary/5' : 'border-border'}
              `}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold">{state.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {getLegalStatusText(state.legalStatus)}
                  </div>
                </div>
                {userState === abbr && (
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>

        {stateInfo && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="text-sm">
              <strong>Current Selection:</strong> {stateInfo.name}
              <br />
              <strong>Status:</strong> {getLegalStatusText(stateInfo.legalStatus)}
              <br />
              <strong>Minimum Age:</strong> {stateInfo.minAge}+
              {stateInfo.notes && (
                <>
                  <br />
                  <strong>Note:</strong> {stateInfo.notes}
                </>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
