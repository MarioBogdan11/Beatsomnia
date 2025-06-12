import React, { useState } from 'react';
import { AlertCircle, Timer, Hand } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface SOSStep {
  title: string;
  description: string;
  duration: number; // in seconds
  instructions: string[];
}

const sosSteps: SOSStep[] = [
  {
    title: "Deep Breathing",
    description: "Calm your nervous system",
    duration: 120,
    instructions: [
      "Sit or lie down comfortably",
      "Close your eyes gently",
      "Breathe in slowly for 4 counts",
      "Hold for 4 counts",
      "Exhale slowly for 6 counts",
      "Repeat this rhythm"
    ]
  },
  {
    title: "Body Scan",
    description: "Release physical tension",
    duration: 180,
    instructions: [
      "Start at the top of your head",
      "Notice any tension or tightness",
      "Consciously relax each part",
      "Move slowly down your body",
      "End with your toes",
      "Let your whole body sink into relaxation"
    ]
  },
  {
    title: "Acupressure Points",
    description: "Natural pressure points for sleep",
    duration: 60,
    instructions: [
      "Press the center of your palm for 30 seconds",
      "Massage the area between your eyebrows",
      "Apply gentle pressure behind your earlobes",
      "Press the point on your wrist (2 fingers below palm)"
    ]
  }
];

const SleepSOS = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(sosSteps[0].duration);
  const [hasStarted, setHasStarted] = useState(false);

  React.useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (currentStep < sosSteps.length - 1) {
            setCurrentStep(prev => prev + 1);
            return sosSteps[currentStep + 1].duration;
          } else {
            setIsActive(false);
            setHasStarted(false);
            setCurrentStep(0);
            return sosSteps[0].duration;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, currentStep]);

  const startSOS = () => {
    setIsActive(true);
    setHasStarted(true);
    setCurrentStep(0);
    setTimeLeft(sosSteps[0].duration);
  };

  const stopSOS = () => {
    setIsActive(false);
    setHasStarted(false);
    setCurrentStep(0);
    setTimeLeft(sosSteps[0].duration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentStepData = sosSteps[currentStep];
  const totalDuration = sosSteps.reduce((sum, step) => sum + step.duration, 0);
  const elapsedTime =
    sosSteps.slice(0, currentStep).reduce((sum, step) => sum + step.duration, 0) +
    (currentStepData.duration - timeLeft);
  const progress = (elapsedTime / totalDuration) * 100;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <AlertCircle className="h-6 w-6 text-red-400" />
          <h2 className="text-2xl font-bold text-white text-shadow-glow">Sleep SOS</h2>
        </div>
        <p className="text-white text-shadow-glow">
          Emergency 5-minute wind-down protocol
        </p>
      </div>

      {!hasStarted ? (
        <Card className="sleep-card glow-white">
          <CardContent className="p-8 text-center space-y-4">
            <div className="text-4xl">😴</div>
            <h3 className="text-xl font-semibold text-white text-shadow-glow">Can't Sleep?</h3>
            <p className="text-white text-shadow-glow">
              This 5-minute emergency protocol combines breathing, body relaxation,
              and acupressure to help you fall asleep quickly.
            </p>
            <Button
              onClick={startSOS}
              className="dawn-gradient hover:opacity-90 transition-opacity"
              size="lg"
            >
              Start Sleep SOS
            </Button>

            <div className="mt-6 space-y-3">
              <h4 className="font-medium text-white text-shadow-glow">What's included:</h4>
              <div className="grid gap-2 text-sm text-white text-shadow-glow">
                {sosSteps.map((step, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span>{step.title}</span>
                    <span>{Math.floor(step.duration / 60)}:{(step.duration % 60).toString().padStart(2, '0')}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Progress */}
          <Card className="sleep-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white text-shadow-glow">
                  Step {currentStep + 1} of {sosSteps.length}
                </span>
                <span className="text-sm text-accent">{formatTime(timeLeft)}</span>
              </div>
              <Progress value={progress} className="mb-2" />
              <div className="text-xs text-white text-shadow-glow text-center">
                Total progress: {Math.round(progress)}%
              </div>
            </CardContent>
          </Card>

          {/* Current Step: Visible Glow Box */}
          <div className="sleep-card border-accent/30 p-6">
            <div className="title flex items-center space-x-2 text-white text-shadow-glow text-lg font-semibold mb-2">
              <Timer className="h-5 w-5 text-accent" />
              <span>{currentStepData.title}</span>
            </div>
            <div className="desc text-white text-shadow-glow mb-2">{currentStepData.description}</div>
            <div className="meta font-medium text-white text-shadow-glow mb-1">Follow along:</div>
            <ul className="desc space-y-1 text-white text-shadow-glow">
              {currentStepData.instructions.map((instruction, index) => (
                <li key={index}>• {instruction}</li>
              ))}
            </ul>
            {currentStep === 2 && (
              <div className="mt-4 p-3 bg-accent/10 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Hand className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-accent">Acupressure Guide</span>
                </div>
                <p className="text-xs text-white text-shadow-glow">
                  Apply gentle, steady pressure for 30 seconds at each point.
                  You should feel a slight sensation but no pain.
                </p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center">
            <Button
              onClick={stopSOS}
              variant="outline"
              className="border-border/50"
            >
              Stop Session
            </Button>
          </div>
        </div>
      )}

      {/* Tips */}
      <Card className="sleep-card">
        <CardContent className="p-4">
       <h3
  className="font-semibold mb-2"
  style={{
    color: "#FFBB55",      // or use the variable below for a softer yellow
    textShadow: "0 2px 10px #ffc76c33"
  }}
>
  Quick Sleep Tips
</h3>
          <ul className="text-sm text-white space-y-1">
            <li>• Use this when you've been awake for more than 20 minutes</li>
            <li>• Keep lights dim during the session</li>
            <li>• Try to stay still and comfortable throughout</li>
            <li>• If still awake after, consider the 20-minute rule</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SleepSOS;