import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';
import { useState, useEffect } from 'react';

interface SalesRepDashboardTourProps {
  onComplete?: () => void;
}

export function SalesRepDashboardTour({ onComplete }: SalesRepDashboardTourProps) {
  const [run, setRun] = useState(false);

  useEffect(() => {
    const tourCompleted = localStorage.getItem('salesRepTourCompleted');
    if (!tourCompleted) {
      setTimeout(() => setRun(true), 1000);
    }
  }, []);

  const steps: Step[] = [
    {
      target: 'body',
      content: '💼 Welcome to your ZAPPAY Sales Dashboard! Let\'s get you started on your sales journey.',
      placement: 'center',
    },
    {
      target: '[data-tour="leads"]',
      content: '🎯 View and manage your leads here. Track dispensaries, farmers, and potential partners.',
    },
    {
      target: '[data-tour="add-lead"]',
      content: '➕ Add new leads as you discover potential partners. Include contact info and notes.',
    },
    {
      target: '[data-tour="commissions"]',
      content: '💰 Track your commissions and earnings. See which partnerships are most profitable.',
    },
    {
      target: '[data-tour="materials"]',
      content: '📚 Access sales materials, pricing sheets, and platform features to help close deals.',
    },
    {
      target: '[data-tour="training"]',
      content: '🎓 Complete product training modules to become a ZAPPAY expert and boost your sales.',
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem('salesRepTourCompleted', 'true');
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
