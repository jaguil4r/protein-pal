import { MoodState } from '../../types';

interface Props {
  mood: MoodState;
}

export function PandaSvg({ mood }: Props) {
  const isFlexing = mood === 'flexing';
  const isHappy = mood === 'happy' || mood === 'flexing';
  const isFull = mood === 'full';
  const isHungry = mood === 'hungry';
  const isTired = mood === 'tired';
  const isMotivated = mood === 'motivated';
  const isDisappointed = mood === 'disappointed';
  const showBlink = !isTired && !isFull && !isHappy && !isDisappointed;

  // Reward prop shows in all positive moods
  const hasRewardProp = isFull || isHappy || isMotivated || isFlexing;
  // Glow for all positive moods
  const showGlow = isHappy || isFull || isMotivated;
  // Blush for warm/positive moods
  const showBlush = isHappy || isFull || isFlexing || isMotivated;

  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={`Panda feeling ${mood}`}>
      <defs>
        <radialGradient id="panda-glow">
          <stop offset="0%" stopColor="#E8F5E9" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#E8F5E9" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="panda-body-grad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FAFAFA" />
          <stop offset="100%" stopColor="#E0E0E0" />
        </radialGradient>
        <radialGradient id="panda-head-grad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E8E8E8" />
        </radialGradient>
        <filter id="panda-shadow">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Glow — positive moods */}
      {showGlow && (
        <circle className="animal-glow" cx="100" cy="110" r="80" fill="url(#panda-glow)" opacity="0" />
      )}

      {/* Sparkles */}
      {isFlexing && (
        <g className="animal-effects">
          <polygon className="sparkle" points="45,35 48,43 56,43 50,48 52,56 45,51 38,56 40,48 34,43 42,43" fill="#FFD700" />
          <polygon className="sparkle" points="155,35 158,43 166,43 160,48 162,56 155,51 148,56 150,48 144,43 152,43" fill="#FFD700" />
          <polygon className="sparkle" points="38,125 41,133 49,133 43,138 45,146 38,141 31,146 33,138 27,133 35,133" fill="#FFD700" />
          <polygon className="sparkle" points="162,125 165,133 173,133 167,138 169,146 162,141 155,146 157,138 151,133 159,133" fill="#FFD700" />
        </g>
      )}

      {/* Body */}
      <g className="animal-body" filter="url(#panda-shadow)">
        <ellipse cx="100" cy="138" rx="44" ry="46" fill="url(#panda-body-grad)" />

        {/* Belly patch */}
        <ellipse
          className="animal-belly"
          cx="100"
          cy="142"
          rx={isFull ? 30 : 26}
          ry={isFull ? 34 : 28}
          fill="#EEEEEE"
        />

        {/* Arms */}
        {isFlexing ? (
          <>
            <path d="M60,122 Q38,92 54,70" stroke="#2D2D2D" strokeWidth="16" strokeLinecap="round" fill="none" />
            <path d="M140,122 Q162,92 146,70" stroke="#2D2D2D" strokeWidth="16" strokeLinecap="round" fill="none" />
          </>
        ) : isHungry ? (
          <>
            <path d="M60,120 Q46,140 56,158" stroke="#2D2D2D" strokeWidth="16" strokeLinecap="round" fill="none" />
            <path d="M140,120 Q128,138 114,144" stroke="#2D2D2D" strokeWidth="16" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <path d="M60,120 Q44,145 52,165" stroke="#2D2D2D" strokeWidth="16" strokeLinecap="round" fill="none" />
            <path d="M140,120 Q156,145 148,165" stroke="#2D2D2D" strokeWidth="16" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* Feet */}
        <ellipse cx="78" cy="180" rx="14" ry="8" fill="#2D2D2D" />
        <ellipse cx="122" cy="180" rx="14" ry="8" fill="#2D2D2D" />
      </g>

      {/* Bamboo reward prop — all positive moods */}
      {hasRewardProp && (
        <g className="animal-reward">
          <line x1="148" y1="100" x2="158" y2="160" stroke="#4CAF50" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="160" cy="98" rx="8" ry="4" fill="#66BB6A" transform="rotate(-20 160 98)" />
          <ellipse cx="155" cy="106" rx="7" ry="3.5" fill="#81C784" transform="rotate(15 155 106)" />
        </g>
      )}

      {/* Head */}
      <g className="animal-head">
        <circle cx="100" cy="72" r="40" fill="url(#panda-head-grad)" />

        {/* Ears */}
        <g className="animal-ears">
          <circle cx="66" cy="42" r="14" fill="#2D2D2D" />
          <circle cx="134" cy="42" r="14" fill="#2D2D2D" />
          <circle cx="66" cy="42" r="7" fill="#FFB3C6" opacity="0.5" />
          <circle cx="134" cy="42" r="7" fill="#FFB3C6" opacity="0.5" />
        </g>

        {/* Eye patches */}
        <ellipse cx="80" cy="70" rx="18" ry="14" fill="#2D2D2D" transform="rotate(-10 80 70)" />
        <ellipse cx="120" cy="70" rx="18" ry="14" fill="#2D2D2D" transform="rotate(10 120 70)" />

        {/* Eyes */}
        <g className="animal-eyes">
          <circle cx="80" cy="70" r="8" fill="white" />
          <circle cx="120" cy="70" r="8" fill="white" />
          <circle className="animal-pupil" cx="80" cy="70" r="4" fill="#1a1a1a" />
          <circle className="animal-pupil" cx="120" cy="70" r="4" fill="#1a1a1a" />
          {/* Highlight */}
          <circle cx="78" cy="68" r="1.5" fill="white" />
          <circle cx="118" cy="68" r="1.5" fill="white" />

          {/* Tired - heavy droopy lids */}
          {isTired && (
            <>
              <ellipse cx="80" cy="65" rx="10" ry="8" fill="#2D2D2D" />
              <ellipse cx="120" cy="65" rx="10" ry="8" fill="#2D2D2D" />
            </>
          )}

          {/* Full - satisfied lids */}
          {isFull && (
            <>
              <ellipse cx="80" cy="66" rx="10" ry="7" fill="#2D2D2D" />
              <ellipse cx="120" cy="66" rx="10" ry="7" fill="#2D2D2D" />
            </>
          )}

          {/* Blink lids */}
          {showBlink && (
            <>
              <ellipse className="animal-blink-lid" cx="80" cy="66" rx="10" ry="7" fill="#2D2D2D" />
              <ellipse className="animal-blink-lid animal-blink-lid--right" cx="120" cy="66" rx="10" ry="7" fill="#2D2D2D" />
            </>
          )}

          {/* Happy squint */}
          {isHappy && (
            <>
              <path d="M72,73 Q80,79 88,73" stroke="#2D2D2D" strokeWidth="3" fill="#2D2D2D" />
              <path d="M112,73 Q120,79 128,73" stroke="#2D2D2D" strokeWidth="3" fill="#2D2D2D" />
            </>
          )}

          {/* Disappointed - droopy sad eyes + sweat drop */}
          {isDisappointed && (
            <>
              <ellipse cx="80" cy="66" rx="10" ry="6" fill="#2D2D2D" />
              <ellipse cx="120" cy="66" rx="10" ry="6" fill="#2D2D2D" />
              {/* Droopy outer corners */}
              <line x1="70" y1="68" x2="67" y2="72" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" />
              <line x1="130" y1="68" x2="133" y2="72" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" />
              {/* Sweat drop */}
              <ellipse cx="140" cy="58" rx="2.5" ry="3.5" fill="#87CEEB" opacity="0.6" />
            </>
          )}
        </g>

        {/* Nose */}
        <ellipse cx="100" cy="82" rx="6" ry="4" fill="#2D2D2D" />

        {/* Mouth */}
        {isHappy || isFlexing ? (
          <path d="M88,88 Q100,100 112,88" stroke="#2D2D2D" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : isDisappointed ? (
          <path d="M90,92 Q100,86 110,92" stroke="#2D2D2D" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : isHungry ? (
          <ellipse cx="100" cy="92" rx="5" ry="7" fill="#2D2D2D" />
        ) : isFull ? (
          <path d="M92,88 Q100,94 108,88" stroke="#2D2D2D" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : isMotivated ? (
          <path d="M90,88 Q100,96 110,88" stroke="#2D2D2D" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M94,88 Q100,86 106,88" stroke="#2D2D2D" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        )}

        {/* Blush — extends to motivated */}
        {showBlush && (
          <>
            <circle cx="64" cy="82" r="6" fill="#FFB3C6" opacity="0.4" />
            <circle cx="136" cy="82" r="6" fill="#FFB3C6" opacity="0.4" />
          </>
        )}
      </g>
    </svg>
  );
}
