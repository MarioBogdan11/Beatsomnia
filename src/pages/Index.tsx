import React from 'react';
import SleepCalculator from '../components/SleepCalculator';
import StarsBackground from '../components/Stars-Background';


const Index = () => {
  return (
    <div className="min-h-screen sleep-gradient px-6 py-10 sm:px-4 sm:py-8 relative overflow-hidden">
      <StarsBackground />
      <div className="w-full max-w-[95vw] sm:max-w-5xl mx-auto px-4 sm:px-10 md:px-12 py-10 z-10 relative">
        <SleepCalculator />
      </div>
    </div>
  );
};

export default Index;
 