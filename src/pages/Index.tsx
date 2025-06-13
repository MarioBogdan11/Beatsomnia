import SleepCalculator from '../components/SleepCalculator';
import StarsBackground from '../components/Stars-Background'; 

const Index = () => {
  return (
    <div className="min-h-screen sleep-gradient p-4 py-8 relative overflow-hidden">
      <StarsBackground /> {/* Star background */}
      <div className="container mx-auto relative z-10">
        <SleepCalculator />
      </div>
    </div>
  );
};

export default Index;