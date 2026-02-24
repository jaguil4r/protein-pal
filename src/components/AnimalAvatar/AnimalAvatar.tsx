import { useRef, useState, useEffect } from 'react';
import { AnimalType, MoodState, StreakTier } from '../../types';
import { SlothSvg } from './SlothSvg';
import { PandaSvg } from './PandaSvg';
import { BunnySvg } from './BunnySvg';
import { BunnyAccessories } from './BunnyAccessories';
import { PandaAccessories } from './PandaAccessories';
import { SlothAccessories } from './SlothAccessories';
import './AnimalAvatar.css';

interface Props {
  animal: AnimalType;
  mood: MoodState;
  streakTier?: StreakTier;
  level?: number;
}

const animalComponents: Record<AnimalType, React.FC<{ mood: MoodState }>> = {
  sloth: SlothSvg,
  panda: PandaSvg,
  bunny: BunnySvg,
};

const accessoryComponents: Record<AnimalType, React.FC<{ level: number }>> = {
  bunny: BunnyAccessories,
  panda: PandaAccessories,
  sloth: SlothAccessories,
};

export function AnimalAvatar({ animal, mood, streakTier = 'none', level = 1 }: Props) {
  const AnimalComponent = animalComponents[animal];
  const AccessoryComponent = accessoryComponents[animal];
  const prevMoodRef = useRef(mood);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (prevMoodRef.current !== mood) {
      prevMoodRef.current = mood;
      setTransitioning(true);
      const timer = setTimeout(() => setTransitioning(false), 600);
      return () => clearTimeout(timer);
    }
  }, [mood]);

  const streakClass = streakTier !== 'none' ? ` animal-avatar--streak-${streakTier}` : '';

  return (
    <div
      className={`animal-avatar animal-avatar--${mood}${transitioning ? ' animal-avatar--transitioning' : ''}${streakClass}`}
      data-testid="animal-avatar"
      data-mood={mood}
      data-animal={animal}
      data-level={level}
    >
      <AnimalComponent mood={mood} />
      {level >= 2 && (
        <svg className="animal-accessories" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <AccessoryComponent level={level} />
        </svg>
      )}
    </div>
  );
}
