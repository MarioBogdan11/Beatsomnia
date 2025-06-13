import React, { useState, useEffect } from 'react';
import {
  Clock, Bed, Apple, Brain, AlertCircle, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  6: {
    border: "border-green-400",
    cyclesBg: "bg-green-600/80 text-white",
    timeBg: "bg-green-400/90 text-white",
  },
  5: {
    border: "border-blue-400",
    cyclesBg: "bg-blue-600/80 text-white",
    timeBg: "bg-blue-400/90 text-white",
  },
  4: {
    border: "border-orange-400",
    cyclesBg: "bg-orange-600/80 text-white",
    timeBg: "bg-orange-400/90 text-white",
  },
} as const;

// Utils
const formatTime = (date: Date) =>
  `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

const getTotalSleepString = (totalMinutes: number) =>
  `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;

const isValidLatency = (latency: string) => {
  const val = Number(latency);
  return latency !== '' && !isNaN(val) && val >= 1 && val <= 60;
};

// Make the mode switcher buttons bigger with a custom class
const ModeSwitcher = ({ mode, setMode }: { mode: Mode, setMode: (m: Mode) => void }) => (
  <div className="flex rounded-lg bg-secondary p-1 mb-6">
    {([Mode.Wakeup, Mode.SleepNow] as Mode[]).map((m) => (
      <Button
        key={m}
        onClick={() => setMode(m)}
        className={`mode-switcher-btn flex-1 flex items-center justify-center space-x-2 rounded-md transition-colors
          ${mode === m
            ? "bg-primary text-primary-foreground shadow"
            : "text-muted-foreground hover:text-foreground"
          }`}
        style={{ zIndex: mode === m ? 1 : 0 }}
      >
        {m === Mode.Wakeup ? <Clock className="h-4 w-4" /> : <Bed className="h-4 w-4" />}
        <span>{m === Mode.Wakeup ? 'Plan Wake-Up' : 'Sleep Now'}</span>
      </Button>
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
  <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
    {sleepTimes.map(({ bedtime, wakeTime, cycles, totalSleep, explanation }, i) => {
      const color = badgeColors[cycles];
      return (
        <motion.div
          key={cycles}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.5, delay: i * 0.12 }}
          className={`flex-1`}
        >
          <div
            className={`flex flex-col items-center px-6 py-5 rounded-xl bg-[#101e4b] border ${color.border} shadow-md transition-shadow min-w-[200px]`}
            style={{ minHeight: 260 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-md text-sm font-semibold ${color.cyclesBg}`}>
                {cycles} cycles
              </span>
              <span className={`px-3 py-1 rounded-md text-xs font-bold ${color.timeBg}`}>
                {totalSleep}
              </span>
            </div>
            <div className="text-4xl md:text-3xl font-extrabold text-white mb-2 tracking-widest">
              {mode === Mode.Wakeup ? bedtime : wakeTime}
            </div>
            <div className="text-sm text-slate-200 text-center opacity-80 mt-1">
              {explanation}
            </div>
          </div>
        </motion.div>
      );
    })}
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

  // Calculation logic
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
            {/* Animated logo/title above the card */}
            <div className="flex flex-col items-center mt-16 mb-2 select-none">
              <img
                src="/images/topicon.png"
                alt="BeatSomnia Logo"
                className="w-28 h-28 mb-2 moon-animate"
                style={{ objectFit: "contain" }}
              />
              <h1 className="font-bold text-5xl mt-2">BeatSomnia</h1>
            </div>
            <Card className="sleep-card">
              <CardContent className="p-4">
                <ModeSwitcher mode={mode} setMode={(m) => { setMode(m); setShowResults(false); setError(null); }} />
                <div className="mt-4">
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
                  </CardContent>
                </div>
                <AnimatePresence>
                  {showResults && (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -24 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-4 mt-6"
                    >
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
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