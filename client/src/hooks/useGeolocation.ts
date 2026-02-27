import { useState, useEffect } from 'react';
import { getEffectiveUserState, setUserState as setUserStateOverride, clearStateOverride } from '@/lib/geolocation';
import { STATE_COMPLIANCE, isLegalInState } from '@shared/stateCompliance';

export function useGeolocation() {
  const [userState, setUserState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function detectState() {
      try {
        const state = await getEffectiveUserState();
        setUserState(state);
      } catch (err) {
        setError('Failed to detect location');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    detectState();
  }, []);

  const updateUserState = (stateAbbr: string) => {
    setUserStateOverride(stateAbbr);
    setUserState(stateAbbr);
  };

  const clearOverride = async () => {
    clearStateOverride();
    const detectedState = await getEffectiveUserState();
    setUserState(detectedState);
  };

  const isLegal = userState ? isLegalInState(userState) : false;
  const stateInfo = userState ? STATE_COMPLIANCE[userState] : null;

  return {
    userState,
    loading,
    error,
    updateUserState,
    clearOverride,
    isLegal,
    stateInfo,
  };
}
