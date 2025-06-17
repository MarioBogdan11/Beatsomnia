import React, { useState, useEffect } from 'react';
import {
  Apple, Brain, AlertCircle, ArrowLeft, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SleepFoods from './SleepFoods';
import InsomniaRelief from './InsomniaRelief';
import SleepSOS from './SleepSOS';
import { AnimatePresence, motion } from 'framer-motion';

type Mode = 'wakeup' | 'sleepnow';

enum View {
  Calculator = 'calculator',
  Foods = 'foods',
  Insomnia = 'insomnia',
  Sos = 'sos',
  FallAsleep = 'fallAsleep'
}

const CYCLES = [6, 5, 4, 3, 2, 1];
const CYCLE_LENGTH = 90;

const formatTime = (date: Date) =>
  `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

const getTotalSleepString = (totalMinutes: number) =>
  `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;

const getCycleExplanation = (cycles: number) => {
  switch (cycles) {
    case 6: return 'Optimal for most adults - full rest and recovery';
    case 5: return 'Good balance - adequate rest for most people';
    case 4: return 'Minimum recommended - may feel tired';
    case 3: return 'Below recommended - you will feel tired';
    case 2: return 'Poor sleep - for emergencies only';
    case 1: return 'Very poor sleep - you will likely feel terrible';
    default: return '';
  }
};

const SleepCalculator = () => {
  const [mode, setMode] = useState<Mode>('wakeup');
  const [latency, setLatency] = useState<string>('15');
  const [time, setTime] = useState<string>(formatTime(new Date()));
  const [activeTab, setActiveTab] = useState<'insomnia' | 'foods' | 'sos'>('insomnia');
  const [sleepTimes, setSleepTimes] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [currentView, setCurrentView] = useState<View>(View.Calculator);

  useEffect(() => {
    setLatency('15');
    setTime(formatTime(new Date()));
    setShowResults(false);
    setSleepTimes([]);
  }, [mode]);

  function handleCalculate() {
    const latencyMin = Number(latency);
    if (isNaN(latencyMin) || latencyMin < 1 || latencyMin > 60) return;

    const [hours, minutes] = time.split(':').map(Number);
    const baseTime = new Date();
    baseTime.setHours(hours);
    baseTime.setMinutes(minutes);
    baseTime.setSeconds(0);

    const results = CYCLES.map((cycle) => {
      const totalSleep = cycle * CYCLE_LENGTH;
      const adjusted = new Date(baseTime.getTime());

      if (mode === 'wakeup') {
        adjusted.setMinutes(adjusted.getMinutes() - totalSleep - latencyMin);
      } else {
        adjusted.setMinutes(adjusted.getMinutes() + totalSleep + latencyMin);
      }

      return {
        cycles: cycle,
        totalSleep: getTotalSleepString(totalSleep),
        bedtime: mode === 'wakeup' ? formatTime(adjusted) : undefined,
        wakeTime: mode === 'sleepnow' ? formatTime(adjusted) : undefined,
        explanation: getCycleExplanation(cycle),
      };
    });

    setSleepTimes(results);
    setShowResults(true);
  }

  // --- BEGIN: Image Button for Mode Switcher ---
  const ModeSwitcher = () => (
    <div className="flex flex-col sm:flex-row justify-center gap-6 mb-10 w-full max-w-4xl mx-auto">
      {(['wakeup', 'sleepnow'] as Mode[]).map((m) => (
        <Button
          key={m}
          onClick={() => setMode(m)}
          className={`w-full sm:w-auto break-words ${
            mode === m ? 'bg-primary text-white shadow-xl scale-105' : 'text-muted-foreground'
          } mode-switcher-btn transition-all duration-300 flex items-center justify-center gap-2 text-lg`}
          style={{
            fontSize: "1.2rem",
            padding: "0.9rem 2rem",
            minHeight: "52px",
            borderRadius: "14px",
          }}
        >
          <span className="inline-flex items-center">
            {m === 'wakeup'
              ? <img src="/images/clock.png" alt="Clock" className="mr-2" style={{
                  display: 'inline-flex',
                  width: 36, height: 36,
                  minWidth: 30, minHeight: 30,
                  objectFit: 'contain'
                }} />
              : <img src="/images/bed.png" alt="Bed" className="mr-2" style={{
                  display: 'inline-flex',
                  width: 36, height: 36,
                  minWidth: 30, minHeight: 30,
                  objectFit: 'contain'
                }} />
            }
          </span>
          <span className="font-bold">
            {m === 'wakeup' ? 'Plan Wake-Up' : 'Sleep Now'}
          </span>
        </Button>
      ))}
    </div>
  );
  // --- END: Image Button for Mode Switcher ---

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center bg-transparent"
      style={{
        padding: 0,
        margin: 0,
        zIndex: 10,
        overflowY: "auto"
      }}
    >
      <div
        className="
          rounded-3xl shadow-2xl flex flex-col items-center
          bg-[rgba(10,14,48,0.68)] backdrop-blur-[2px]
          border border-white/10
          w-full max-w-[480px] min-h-[90vh]
          px-2 py-6
          sm:px-4 sm:py-10
          mx-auto
        "
        style={{
          boxShadow: "0 16px 48px 0 rgba(0,0,0,0.30)",
          margin: "2vh auto",
          boxSizing: "border-box"
        }}
      >
        {/* Logo and Title */}
        <div className="flex flex-col items-center justify-center mb-6 text-center">
          <img
            src="/images/topicon.png"
            alt="BeatSomnia logo"
            className="h-20 w-20 mb-2 moon-animate drop-shadow-lg transition-transform duration-700 hover:scale-105"
            style={{ animation: 'spin 6s linear infinite' }}
          />
          <h1 className="text-3xl font-extrabold text-white text-shadow-glow">BeatSomnia</h1>
        </div>

        <h2 className="text-center text-2xl font-bold text-white mb-6">Sleep Calculator</h2>

        <AnimatePresence mode="wait">
          {currentView === View.Calculator && (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full"
            >
              {/* Mode Switcher with Clock/Bed Images */}
              <ModeSwitcher />

              {/* Time Picker */}
              <div className="w-full mb-5 transition-all duration-300 max-w-lg mx-auto">
                <label className="text-white block text-left text-base font-semibold mb-1">
                  {mode === 'wakeup' ? 'What time do you want to wake up?' : 'What time is it now?'}
                </label>
                <div className="flex justify-center">
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="bg-white text-black font-semibold py-2 px-4 text-base rounded-lg cursor-pointer focus:ring-4 focus:ring-blue-400 transition-all duration-300"
                    style={{
                      fontSize: '1.1rem',
                      width: '490px',
                      maxWidth: '100%'
                    }}
                  />
                </div>
              </div>

              {/* Latency Select */}
              <div className="w-full mb-7 transition-all duration-300 max-w-lg mx-auto">
                <label className="text-white block text-left text-base font-semibold mb-1">
                  How long does it take you to fall asleep? (minutes)
                </label>
                <select
                  value={latency}
                  onChange={(e) => setLatency(e.target.value)}
                  className="bg-white text-black w-full py-2 px-4 rounded-lg text-base font-semibold focus:ring-4 focus:ring-blue-400 transition-all duration-300"
                  style={{ fontSize: '1.1rem' }}
                >
                  {Array.from({ length: 60 }, (_, i) => i + 1).map((min) => (
                    <option key={min} value={min}>
                      {min}
                    </option>
                  ))}
                </select>
              </div>

              {/* Calculate Button */}
              <div className="w-full flex justify-center my-7 max-w-lg mx-auto">
                <Button
                  className="
                    w-full
                    max-w-lg
                    mx-auto
                    text-white
                    font-bold
                    text-lg
                    rounded-xl
                    shadow-lg
                    border-0
                    bg-gradient-to-r
                    from-[#5d4aff]
                    to-[#5d7fff]
                    hover:from-[#7b5dfa]
                    hover:to-[#688cff]
                    transition
                    px-8
                    py-5
                    min-h-0
                  "
                  style={{
                    minHeight: 54,
                    height: 54
                  }}
                  onClick={handleCalculate}
                >
                  {mode === 'wakeup' ? 'Calculate Optimal Sleep Times' : 'Calculate Wake-Up Times'}
                </Button>
              </div>

              {/* Results Animated Boxes - COMPACT */}
              {showResults && (
                <div className="mt-7 w-full flex flex-col gap-2 items-center max-w-lg mx-auto">
                  {sleepTimes.map((result, idx) => (
                    <div
                      key={result.cycles}
                      className="w-full max-w-xs bg-blue-900/90 rounded-lg px-3 py-3 text-white shadow-lg animate-cyclefadein"
                      style={{
                        animationDelay: `${0.1 + idx * 0.10}s`,
                        animationFillMode: "backwards",
                        minHeight: 68,
                        fontSize: "1rem"
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-base">
                          {result.cycles} cycles
                        </span>
                        <span className="font-semibold text-xs">
                          {result.totalSleep}
                        </span>
                      </div>
                      <div className="text-xl font-bold mb-1 text-center">
                        {mode === 'wakeup' ? result.bedtime : result.wakeTime}
                      </div>
                      <div className="text-xs text-center text-blue-200">{result.explanation}</div>
                    </div>
                  ))}
                  <style>{`
                    @keyframes cyclefadein {
                      0% { opacity: 0; transform: translateY(18px) scale(0.97);}
                      100% { opacity: 1; transform: translateY(0) scale(1);}
                    }
                    .animate-cyclefadein {
                      animation: cyclefadein 0.5s cubic-bezier(.56,1.56,.5,1) both;
                    }
                  `}</style>
                </div>
              )}

              {/* Extras Section Trigger */}
              <div className="w-full flex justify-center mt-10 px-4 max-w-lg mx-auto">
                <Button
                  onClick={() => setCurrentView(View.FallAsleep)}
                  className="bg-yellow-400 text-black font-bold text-center px-6 py-3 text-base rounded-xl shadow-lg hover:shadow-xl transition hover:scale-105 border-2 border-yellow-300 w-full max-w-xs glow-yellow whitespace-normal flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-5 w-5" />
                  Want to fall asleep faster?
                </Button>
              </div>
            </motion.div>
          )}
          {currentView === View.Foods || currentView === View.Insomnia || currentView === View.Sos ? (
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full"
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
          ) : null}
          {currentView === View.FallAsleep && (
            <motion.div
              key="fallasleep"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full"
            >
              <Card>
                <CardHeader className="flex items-center space-x-4">
                  <Button variant="ghost" size="icon" onClick={() => setCurrentView(View.Calculator)}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <CardTitle>
                    🌙 Want to fall asleep faster?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center items-center gap-2 mb-6 flex-wrap mt-2">
                    <Button
                      onClick={() => setActiveTab('insomnia')}
                      className={`px-3 py-1 text-sm ${activeTab === 'insomnia' ? 'bg-primary text-white' : 'bg-zinc-700 text-white'}`}
                    >
                      Insomnia Relief
                    </Button>
                    <Button
                      onClick={() => setActiveTab('foods')}
                      className={`px-3 py-1 text-sm ${activeTab === 'foods' ? 'bg-primary text-white' : 'bg-zinc-700 text-white'}`}
                    >
                      Sleep Foods
                    </Button>
                    <Button
                      onClick={() => setActiveTab('sos')}
                      className={`px-3 py-1 text-sm ${activeTab === 'sos' ? 'bg-primary text-white' : 'bg-zinc-700 text-white'}`}
                    >
                      Sleep SOS
                    </Button>
                  </div>
                  <div className="w-full mb-2">
                    {activeTab === 'insomnia' && <InsomniaRelief />}
                    {activeTab === 'foods' && <SleepFoods />}
                    {activeTab === 'sos' && <SleepSOS />}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SleepCalculator;