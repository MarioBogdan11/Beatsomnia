import React, { useState } from 'react';
import { Brain, Heart, Leaf, Moon, Play, Pause } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Remedy {
  title: string;
  description: string;
  instructions: string[];
  category: 'technique' | 'natural' | 'environment';
  duration?: string;
}

const remedies: Remedy[] = [
  {
    title: "20-Minute Rule",
    description: "Break the cycle of lying awake in bed",
    instructions: [
      "If you can't fall asleep within 20 minutes, get up",
      "Go to another room with dim lighting",
      "Read a book or do quiet activities (no screens)",
      "Return to bed when you feel sleepy"
    ],
    category: "technique"
  },
  {
    title: "4-7-8 Breathing",
    description: "Activates your parasympathetic nervous system",
    instructions: [
      "Inhale through nose for 4 counts",
      "Hold your breath for 7 counts",
      "Exhale through mouth for 8 counts",
      "Repeat 3-4 cycles"
    ],
    category: "technique",
    duration: "2-3 minutes"
  },
  {
    title: "Progressive Muscle Relaxation",
    description: "Releases physical tension throughout your body",
    instructions: [
      "Start with your toes, tense for 5 seconds",
      "Release and notice the relaxation",
      "Move up through each muscle group",
      "End with your face and scalp"
    ],
    category: "technique",
    duration: "10-15 minutes"
  },
  {
    title: "Valerian Root",
    description: "Natural sedative herb that promotes relaxation",
    instructions: [
      "Take 300-600mg 1-2 hours before bed",
      "Start with lower dose to test tolerance",
      "Consult healthcare provider if on medications",
      "Best used consistently for 2-4 weeks"
    ],
    category: "natural"
  },
  {
    title: "Magnesium Glycinate",
    description: "Calms nervous system and relaxes muscles",
    instructions: [
      "Take 200-400mg 30 minutes before bed",
      "Choose glycinate form for better absorption",
      "Start with 200mg to avoid digestive issues",
      "Take with small amount of food if needed"
    ],
    category: "natural"
  },
  {
    title: "Sleep Environment",
    description: "Optimize your bedroom for better sleep",
    instructions: [
      "Keep room temperature between 60-67°F (15-19°C)",
      "Use blackout curtains or eye mask",
      "Remove electronic devices or use blue light filters",
      "Consider white noise or earplugs"
    ],
    category: "environment"
  }
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'technique': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    case 'natural': return 'bg-green-500/20 text-green-300 border-green-500/30';
    case 'environment': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'technique': return <Brain className="h-4 w-4" />;
    case 'natural': return <Leaf className="h-4 w-4" />;
    case 'environment': return <Moon className="h-4 w-4" />;
    default: return null;
  }
};

const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(4);
  const [cycle, setCycle] = useState(1);

  React.useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCount(prev => {
        if (prev === 1) {
          if (phase === 'inhale') {
            setPhase('hold');
            return 7;
          } else if (phase === 'hold') {
            setPhase('exhale');
            return 8;
          } else {
            setPhase('inhale');
            setCycle(prev => prev + 1);
            if (cycle >= 4) {
              setIsActive(false);
              setCycle(1);
            }
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase, cycle]);

  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    setCount(4);
    setCycle(1);
  };

  const stopExercise = () => {
    setIsActive(false);
    setPhase('inhale');
    setCount(4);
    setCycle(1);
  };

  return (
    <Card className="sleep-card glow-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white glow-white-heading">
          <Heart className="h-5 w-5 text-accent" />
          <span>Guided 4-7-8 Breathing</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="text-6xl font-bold text-accent glow-white-heading">{count}</div>
        <div className="text-lg capitalize text-white glow-white-heading">
          {phase} {phase === 'inhale' && '(through nose)'}
          {phase === 'exhale' && '(through mouth)'}
        </div>
        <div className="text-sm text-white glow-white-heading">
          Cycle {cycle} of 4
        </div>
        <Button
          onClick={isActive ? stopExercise : startExercise}
          className="dawn-gradient hover:opacity-90 transition-opacity"
        >
          {isActive ? (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Stop
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Start Exercise
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

const InsomniaRelief = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Brain className="h-6 w-6 text-accent" />
          <h2 className="text-2xl font-bold text-white glow-white-heading">
            Beat Insomnia
          </h2>
        </div>
        <p className="text-white glow-white-heading">
          Natural remedies and techniques for better sleep
        </p>
      </div>

      {/* Interactive Breathing Exercise */}
      <BreathingExercise />

      {/* Quick Sleep Tips - purple glowing box */}
      <div className="enhanced-card text-glow-purple">
        <h3
          className="font-semibold mb-2"
          style={{
            color: "#b9a6ff",
            textShadow: "0 2px 12px #b9a6ff66"
          }}
        >
          Quick Sleep Tips
        </h3>
        <ul className="text-sm">
          <li>• Use this when you've been awake for more than 20 minutes</li>
          <li>• Keep lights dim during the session</li>
          <li>• Try to stay still and comfortable throughout</li>
          <li>• If still awake after, consider the 20-minute rule</li>
        </ul>
      </div>

      {/* Remedies: Glow Box Style */}
      <div className="grid gap-4">
        {remedies.map((remedy, index) => (
          <div key={index} className="enhanced-card text-glow-purple">
            <div className="title flex items-center space-x-2">
              {getCategoryIcon(remedy.category)}
              <span>{remedy.title}</span>
              {remedy.duration && (
                <span className="ml-2 badge text-xs">{remedy.duration}</span>
              )}
              <span className={`ml-2 badge ${getCategoryColor(remedy.category)}`}>
                {remedy.category}
              </span>
            </div>
            <div className="desc">{remedy.description}</div>
            <div className="meta font-medium">How to:</div>
            <ul className="desc space-y-1">
              {remedy.instructions.map((instruction, idx) => (
                <li key={idx}>• {instruction}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Warning */}
      <Card className="sleep-card border-orange-500/30">
        <CardContent className="p-4">
          <h3
            className="font-semibold mb-2"
            style={{
              color: "#FFBB55",
              textShadow: "0 2px 10px #ffc76c99, 0 1px 2px #fff7b220"
            }}
          >
            Important Notes
          </h3>
          <ul className="text-sm text-white text-shadow-glow space-y-1">
            <li>• Consult a healthcare provider before trying herbal supplements</li>
            <li>• If insomnia persists for more than 2 weeks, seek professional help</li>
            <li>• Some natural remedies may interact with medications</li>
            <li>• Results may take 1-4 weeks of consistent use</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsomniaRelief;