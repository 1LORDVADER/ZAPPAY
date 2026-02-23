import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';
import { useState, useEffect } from 'react';

interface DriverDashboardTourProps {
  onComplete?: () => void;
}

export function DriverDashboardTour({ onComplete }: DriverDashboardTourProps) {
  const [run, setRun] = useState(false);

  useEffect(() => {
    const tourCompleted = localStorage.getItem('driverTourCompleted');
    if (!tourCompleted) {
      setTimeout(() => setRun(true), 1000);
    }
  }, []);

  const steps: Step[] = [
    {
      target: 'body',
      content: '🚚 Welcome to your ZAPPAY Driver Dashboard! Let\'s show you around.',
      placement: 'center',
    },
    {
      target: '[data-tour="deliveries"]',
      content: '📦 View all your assigned deliveries here. See pickup locations, delivery addresses, and package details.',
    },
    {
      target: '[data-tour="accept-delivery"]',
      content: '✅ Accept new delivery requests and start earning. You\'ll see pickup and drop-off details before accepting.',
    },
    {
      target: '[data-tour="earnings"]',
      content: '💰 Track your earnings, completed deliveries, and payment history. Payments are instant via ACH.',
    },
    {
      target: '[data-tour="vehicle"]',
      content: '🚗 Update your vehicle information, insurance, and driver\'s license details to stay compliant.',
    },
    {
      target: '[data-tour="availability"]',
      content: '📅 Set your availability and working hours. You control when you want to accept deliveries.',
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem('driverTourCompleted', 'true');
      onComplete?.();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#1e3a5f',
          textColor: '#333',
          zIndex: 10000,
        },
        buttonNext: {
          backgroundColor: '#1e3a5f',
          fontSize: 14,
          padding: '8px 16px',
        },
        buttonBack: {
          color: '#1e3a5f',
          fontSize: 14,
        },
        buttonSkip: {
          color: '#666',
          fontSize: 14,
        },
      }}
    />
  );
}
