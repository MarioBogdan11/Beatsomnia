import SleepCalculator from '../components/SleepCalculator';
import BeatSomniaIntro from '../components/ui/BeatSomniaIntro';

const Index = () => {
  return (
    <div className="min-h-screen sleep-gradient p-4 py-8">
      <div className="container mx-auto">
        <BeatSomniaIntro />
        <SleepCalculator />
      </div>
    </div>
  );
};

export default Index;