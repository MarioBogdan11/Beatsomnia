import SleepCalculator from '../components/SleepCalculator';
import BeatSomniaIntro from '../components/ui/BeatSomniaIntro';
import StarsBackground from '../components/Stars-Background'; // <-- Add this line

const Index = () => {
  return (
    <div className="min-h-screen sleep-gradient p-4 py-8 relative overflow-hidden">
      <StarsBackground /> {/* Star background */}
      <div className="container mx-auto relative z-10">
        <BeatSomniaIntro />
        <SleepCalculator />
      </div>
    </div>
  );
};

export default Index;