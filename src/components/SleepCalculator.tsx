import React, { useState, useEffect } from 'react';
import {
  Clock, Bed, Apple, Brain, AlertCircle, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SleepFoods from './SleepFoods';
import InsomniaRelief from './InsomniaRelief';
import SleepSOS from './SleepSOS';
import { AnimatePresence, motion } from 'framer-motion';

interface SleepTime {
  bedtime?: string;
  wakeTime?: string;
  cycles: number;
  totalSleep: string;
  explanation: string;
}

enum Mode {
  Wakeup = 'wakeup',
  SleepNow = 'sleepnow',
}

enum View {
  Calculator = 'calculator',
  Foods = 'foods',
  Insomnia = 'insomnia',
  Sos = 'sos'
}

const CYCLE_LENGTH = 90;
const CYCLES = [6, 5, 4] as const;

const cycleExplanations = {
  6: 'Optimal for most adults - full rest and recovery',
  5: 'Good balance - adequate rest for most people',
  4: 'Minimum recommended - may feel tired',
} as const;

const badgeColors = {
  6: 'bg-green-500/20 text-green-300 border-green-500/30',
  5: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  4: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
} as const;

// Util
const formatTime = (date: Date) =>
  `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

const getTotalSleepString = (totalMinutes: number) =>
  `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;

const isValidLatency = (latency: string) => {
  const val = Number(latency);
  return latency !== '' && !isNaN(val) && val >= 1 && val <= 60;
};

// Animated ModeSwitcher
const ModeSwitcher = ({ mode, setMode }: {mode: Mode, setMode: (m: Mode) => void}) => (
  <div className="flex rounded-lg bg-secondary p-1">
    {([Mode.Wakeup, Mode.SleepNow] as Mode[]).map((m) => (
      <AnimatePresence key={m} mode="wait" initial={false}>
        {mode === m ? (
          <motion.button
            key={m}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMode(m)}
            className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md bg-primary text-primary-foreground shadow transition-colors"
            style={{ zIndex: 1 }}
          >
            {m === Mode.Wakeup ? <Clock className="h-4 w-4" /> : <Bed className="h-4 w-4" />}
            <span>{m === Mode.Wakeup ? 'Plan Wake-Up' : 'Sleep Now'}</span>
          </motion.button>
        ) : (
          <motion.button
            key={m}
            layout
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMode(m)}
            className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-muted-foreground hover:text-foreground transition-colors"
            style={{ zIndex: 0 }}
          >
            {m === Mode.Wakeup ? <Clock className="h-4 w-4" /> : <Bed className="h-4 w-4" />}
            <span>{m === Mode.Wakeup ? 'Plan Wake-Up' : 'Sleep Now'}</span>
          </motion.button>
        )}
      </AnimatePresence>
    ))}
  </div>
);

const LatencySelect = (
  { value, onChange, error }:
  { value: string, onChange: (v: string) => void, error?: string }
) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-foreground">
      How long does it take you to fall asleep? (minutes)
    </label>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="bg-secondary border-border w-full py-2 px-3 rounded-md"
    >
      <option value="">Select minutes</option>
      {Array.from({ length: 60 }, (_, i) => i + 1).map((min) =>
        <option key={min} value={min}>{min}</option>
      )}
    </select>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const ResultsGrid = ({ sleepTimes, mode }: { sleepTimes: SleepTime[], mode: Mode }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {sleepTimes.map(({ bedtime, wakeTime, cycles, totalSleep, explanation }) => (
      <Card key={cycles} className="p-4 border border-border rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <div className={`flex items-center justify-between mb-2 ${badgeColors[cycles]} rounded-md border px-2 py-1 text-sm font-semibold`}>
          <span>{cycles} cycles</span>
          <Badge className="text-xs">{totalSleep}</Badge>
        </div>
        <div className="text-3xl font-bold text-primary mb-2">
          {mode === Mode.Wakeup ? bedtime : wakeTime}
        </div>
        <p className="text-sm text-muted-foreground">{explanation}</p>
      </Card>
    ))}
  </div>
);

const SleepCalculator = () => {
  const [mode, setMode] = useState<Mode>(Mode.Wakeup);
  const [wakeUpTime, setWakeUpTime] = useState('07:00');
  const [sleepLatency, setSleepLatency] = useState('15');
  const [sleepTimes, setSleepTimes] = useState<SleepTime[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>(View.Calculator);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCurrentTime = () => currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleCalculate = () => {
    if (!isValidLatency(sleepLatency)) {
      setError('Please select a number between 1 and 60.');
      setShowResults(false);
      return;
    }
    setError(null);

    setSleepTimes(
      mode === Mode.Wakeup
        ? calculateSleepTimes(wakeUpTime, sleepLatency)
        : calculateWakeUpTimes(sleepLatency)
    );
    setShowResults(true);
  };

  // Calculation logic moved out for clarity
  const calculateWakeUpTimes = (latencyStr: string): SleepTime[] => {
    const now = new Date();
    const latency = Number(latencyStr);
    const sleepTime = new Date(now.getTime() + latency * 60000);

    return CYCLES.map((cycles) => {
      const totalSleepMinutes = cycles * CYCLE_LENGTH;
      const wakeUpDate = new Date(sleepTime.getTime() + totalSleepMinutes * 60000);
      return {
        wakeTime: formatTime(wakeUpDate),
        cycles,
        totalSleep: getTotalSleepString(totalSleepMinutes),
        explanation: cycleExplanations[cycles],
      };
    });
  };

  const calculateSleepTimes = (wakeTimeStr: string, latencyStr: string): SleepTime[] => {
    const [hours, minutes] = wakeTimeStr.split(':').map(Number);
    const wakeUpDate = new Date();
    wakeUpDate.setHours(hours, minutes, 0, 0);
    const latency = Number(latencyStr);

    return CYCLES.map((cycles) => {
      const totalSleepMinutes = cycles * CYCLE_LENGTH;
      const bedtimeWithLatency = new Date(wakeUpDate.getTime() - (totalSleepMinutes + latency) * 60000);
      return {
        bedtime: formatTime(bedtimeWithLatency),
        cycles,
        totalSleep: getTotalSleepString(totalSleepMinutes),
        explanation: cycleExplanations[cycles],
      };
    });
  };

  // Main render with animated transitions between views and animated buttons
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-10">
      <AnimatePresence mode="wait">
        {currentView === View.Calculator && (
          <motion.div
            key="calculator"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Card className="sleep-card">
              <CardContent className="p-4">
                <ModeSwitcher mode={mode} setMode={(m) => { setMode(m); setShowResults(false); setError(null); }} />
              </CardContent>
            </Card>
            <Card className="sleep-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {mode === Mode.Wakeup
                    ? <><Clock className="h-5 w-5 text-primary" /><span>Sleep Planner</span></>
                    : <><Bed className="h-5 w-5 text-primary" /><span>Sleep Now Mode</span></>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {mode === Mode.Wakeup ? (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">What time do you want to wake up?</label>
                    <Input type="time" value={wakeUpTime} onChange={e => setWakeUpTime(e.target.value)} className="bg-secondary border-border" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Current time</label>
                    <div className="text-2xl font-bold text-primary">{formatCurrentTime()}</div>
                    <p className="text-sm text-muted-foreground">We'll calculate the best wake-up times based on when you fall asleep</p>
                  </div>
                )}
                <LatencySelect value={sleepLatency} onChange={setSleepLatency} error={error ?? undefined} />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.25 }}
                    className="w-full"
                  >
                    <Button
                      onClick={handleCalculate}
                      className="w-full dawn-gradient hover:opacity-90 transition-opacity"
                      size="lg"
                      disabled={!isValidLatency(sleepLatency)}
                    >
                      {mode === Mode.Wakeup ? 'Calculate Optimal Sleep Times' : 'Calculate Wake-Up Times'}
                    </Button>
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>
            {showResults && (
              <div className="space-y-4 animate-fade-in">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-foreground mb-2">
                    {mode === Mode.Wakeup ? 'Your Optimal Bedtimes' : 'Your Optimal Wake-Up Times'}
                  </h2>
                  <p className="text-muted-foreground">
                    {mode === Mode.Wakeup
                      ? `To wake up at ${wakeUpTime}, try going to bed at:`
                      : `If you sleep now, here are the best times to wake up:`}
                  </p>
                </div>
                <ResultsGrid sleepTimes={sleepTimes} mode={mode} />
              </div>
            )}

            <Card className="sleep-card mt-8">
              <CardContent className="flex gap-4 w-full">
                <Button
                  variant="outline"
                  onClick={() => setCurrentView(View.Foods)}
                  className="flex-1 w-0 flex items-center justify-center space-x-2 min-h-[48px]"
                >
                  <Apple className="h-4 w-4" />
                  <span className="break-words text-center block">Sleep Foods</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentView(View.Insomnia)}
                  className="flex-1 w-0 flex items-center justify-center space-x-2 min-h-[48px]"
                >
                  <Brain className="h-4 w-4" />
                  <span className="break-words text-center block">
                    Insomnia<br />Relief
                  </span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentView(View.Sos)}
                  className="flex-1 w-0 flex items-center justify-center space-x-2 min-h-[48px]"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span className="break-words text-center block">Sleep SOS</span>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
        {currentView !== View.Calculator && (
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Card>
              <CardHeader className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" onClick={() => setCurrentView(View.Calculator)}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <CardTitle>
                  {currentView === View.Foods && 'Sleep-Enhancing Foods'}
                  {currentView === View.Insomnia && 'Insomnia Relief Techniques'}
                  {currentView === View.Sos && 'Sleep SOS Tips'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentView === View.Foods && <SleepFoods />}
                {currentView === View.Insomnia && <InsomniaRelief />}
                {currentView === View.Sos && <SleepSOS />}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SleepCalculator;