import { useState, useEffect } from 'react';

interface CountdownProps {
  nextScheduledTime: string | undefined;
}

export default function Countdown({ nextScheduledTime }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    console.log('Countdown received scheduledTime:', nextScheduledTime);
    
    const calculateTimeLeft = () => {
      if (!nextScheduledTime) {
        console.log('No scheduled time provided');
        setTimeLeft(null);
        return;
      }

      const now = new Date().getTime();
      const scheduledTime = new Date(nextScheduledTime).getTime();
      const difference = scheduledTime - now;

      console.log('Time calculation:', {
        now: new Date(now).toISOString(),
        scheduledTime: new Date(scheduledTime).toISOString(),
        difference: difference
      });

      if (difference <= 0) {
        console.log('Time is up or invalid');
        setTimeLeft(null);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      console.log('Calculated time left:', { days, hours, minutes, seconds });
      setTimeLeft({ days, hours, minutes, seconds });
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [nextScheduledTime]);

  if (!timeLeft) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Sonraki Video</h3>
        <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
          Planlanmış video yok
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Sonraki Video</h3>
      <div className="flex space-x-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{timeLeft.days}</div>
          <div className="text-sm text-gray-500">gün</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{timeLeft.hours}</div>
          <div className="text-sm text-gray-500">saat</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{timeLeft.minutes}</div>
          <div className="text-sm text-gray-500">dakika</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{timeLeft.seconds}</div>
          <div className="text-sm text-gray-500">saniye</div>
        </div>
      </div>
    </div>
  );
} 