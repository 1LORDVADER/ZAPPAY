import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';
import { useState, useEffect } from 'react';

interface FarmerDashboardTourProps {
  onComplete?: () => void;
}

export function FarmerDashboardTour({ onComplete }: FarmerDashboardTourProps) {
  const [run, setRun] = useState(false);

  useEffect(() => {
    // Check if tour has been completed before
    const tourCompleted = localStorage.getItem('farmerTourCompleted');
    if (!tourCompleted) {
      // Start tour after a short delay
      setTimeout(() => setRun(true), 1000);
    }
  }, []);

  const steps: Step[] = [
    {
      target: 'body',
      content: '👋 Welcome to your ZAPPAY Farmer Dashboard! Let\'s take a quick tour to get you started.',
      placement: 'center',
    },
    {
      target: '[data-tour="products"]',
      content: '📦 Here you can view and manage all your cannabis products. Add new strains, update prices, and track inventory.',
    },
    {
      target: '[data-tour="add-product"]',
      content: '➕ Click here to add a new product. Include strain details, THC/CBD levels, pricing, and photos.',
    },
    {
      target: '[data-tour="orders"]',
      content: '📋 Track all your orders here. See pending orders, completed deliveries, and revenue statistics.',
    },
    {
      target: '[data-tour="analytics"]',
      content: '📊 View your sales analytics, revenue trends, and popular products to optimize your business.',
    },
    {
      target: '[data-tour="profile"]',
      content: '👤 Update your business profile, licenses, and payment information in your profile settings.',
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem('farmerTourCompleted', 'true');
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
