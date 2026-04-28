import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, Search, Calculator, Zap } from 'lucide-react';

const STEPS = [
  { Icon: Radio,      text: 'Analizando rutas cercanas...',            textColor: 'text-blue-400',    bgColor: 'bg-blue-400' },
  { Icon: Search,     text: 'Verificando disponibilidad de cargas...', textColor: 'text-purple-400',  bgColor: 'bg-purple-400' },
  { Icon: Calculator, text: 'Calculando ganancia por km...',           textColor: 'text-yellow-400',  bgColor: 'bg-yellow-400' },
  { Icon: Zap,        text: 'Encontrando la mejor opción para ti...',  textColor: 'text-emerald-400', bgColor: 'bg-emerald-400' },
];

// Timed to match the 2500ms search delay in App.tsx
const STEP_DELAYS_MS = [700, 1400, 2050];

export function SearchingCard() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timers = STEP_DELAYS_MS.map((delay, i) =>
      setTimeout(() => setStepIndex(i + 1), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const { Icon, text, textColor, bgColor } = STEPS[stepIndex];

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="bg-slate-900/95 backdrop-blur-xl rounded-t-[2.5rem] p-8 border-t-2 border-emerald-400/30"
    >
      <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-6" />

      <div className="flex flex-col items-center justify-center py-4">
        {/* Icon block — swaps with each step */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative mb-5"
          >
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700/60 flex items-center justify-center">
              <Icon className={`w-8 h-8 ${textColor}`} />
            </div>
            <div className={`absolute inset-0 rounded-2xl blur-xl opacity-25 ${bgColor} animate-pulse`} />
          </motion.div>
        </AnimatePresence>

        {/* Step text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="text-center mb-6"
          >
            <p className="text-white text-lg mb-1">{text}</p>
            <p className="text-slate-500 text-sm">
              Paso {stepIndex + 1} de {STEPS.length}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="flex gap-2 items-center">
          {STEPS.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i <= stepIndex ? 24 : 8,
                backgroundColor: i <= stepIndex ? '#10b981' : '#334155',
              }}
              transition={{ duration: 0.4 }}
              className="h-1.5 rounded-full"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
