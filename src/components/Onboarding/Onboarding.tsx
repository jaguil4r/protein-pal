import { useState } from 'react';
import { AnimalType } from '../../types';
import { defaultSettings, saveSettings, markOnboardingComplete } from '../../utils/storage';
import { SlothSvg } from '../AnimalAvatar/SlothSvg';
import { PandaSvg } from '../AnimalAvatar/PandaSvg';
import { BunnySvg } from '../AnimalAvatar/BunnySvg';
import './Onboarding.css';

interface Props {
  onComplete: () => void;
}

const animalOptions: { type: AnimalType; label: string; Component: React.FC<{ mood: 'happy' }> }[] = [
  { type: 'sloth', label: 'Sloth', Component: SlothSvg as any },
  { type: 'panda', label: 'Panda', Component: PandaSvg as any },
  { type: 'bunny', label: 'Bunny', Component: BunnySvg as any },
];

export function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState(defaultSettings.dailyGoal);
  const [animal, setAnimal] = useState<AnimalType>('sloth');

  const handleFinish = () => {
    saveSettings({ ...defaultSettings, dailyGoal: goal, selectedAnimal: animal });
    markOnboardingComplete();
    onComplete();
  };

  return (
    <div className="onboarding-overlay" data-testid="onboarding-overlay">
      <div className="onboarding-card" data-testid="onboarding-card">
        {/* Step indicators */}
        <div className="onboarding-steps">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`onboarding-step-dot ${i === step ? 'onboarding-step-dot--active' : ''} ${i < step ? 'onboarding-step-dot--done' : ''}`}
            />
          ))}
        </div>

        {step === 0 && (
          <div className="onboarding-content">
            <h1 className="onboarding-title">Welcome to Protein Pal!</h1>
            <p className="onboarding-text">
              Track your daily protein with cute animal friends, streaks, and XP.
            </p>
            <p className="onboarding-label">Set your daily protein goal</p>
            <div className="onboarding-goal">
              <button
                className="onboarding-goal__btn"
                onClick={() => setGoal(Math.max(10, goal - 10))}
                data-testid="onboarding-goal-decrease"
              >
                -
              </button>
              <span className="onboarding-goal__value" data-testid="onboarding-goal-value">{goal}g</span>
              <button
                className="onboarding-goal__btn"
                onClick={() => setGoal(Math.min(500, goal + 10))}
                data-testid="onboarding-goal-increase"
              >
                +
              </button>
            </div>
            <button className="onboarding-next" onClick={() => setStep(1)} data-testid="onboarding-next">
              Next
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="onboarding-content">
            <h1 className="onboarding-title">Pick Your Pal</h1>
            <p className="onboarding-text">
              Choose an animal friend to cheer you on!
            </p>
            <div className="onboarding-animals">
              {animalOptions.map(({ type, label, Component }) => (
                <button
                  key={type}
                  className={`onboarding-animal ${animal === type ? 'onboarding-animal--active' : ''}`}
                  onClick={() => setAnimal(type)}
                  data-testid={`onboarding-animal-${type}`}
                >
                  <Component mood="happy" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
            <button className="onboarding-next" onClick={() => setStep(2)} data-testid="onboarding-next">
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="onboarding-content">
            <h1 className="onboarding-title">You're All Set!</h1>
            <div className="onboarding-features">
              <div className="onboarding-feature">
                <span className="onboarding-feature__icon">&#127942;</span>
                <span>Build streaks by hitting your goal daily</span>
              </div>
              <div className="onboarding-feature">
                <span className="onboarding-feature__icon">&#11088;</span>
                <span>Earn XP and unlock accessories for your pal</span>
              </div>
              <div className="onboarding-feature">
                <span className="onboarding-feature__icon">&#128203;</span>
                <span>Track macros, water, and meal timing</span>
              </div>
            </div>
            <button className="onboarding-next onboarding-next--finish" onClick={handleFinish} data-testid="onboarding-finish">
              Let's Go!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
