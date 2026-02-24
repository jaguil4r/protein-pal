import { MoodState } from '../../types';

interface Props {
  mood: MoodState;
}

export function SlothSvg({ mood }: Props) {
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
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={`Sloth feeling ${mood}`}>
      <defs>
        <radialGradient id="sloth-glow">
          <stop offset="0%" stopColor="#FFFDE7" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FFFDE7" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sloth-body-grad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#A89070" />
          <stop offset="100%" stopColor="#7A6345" />
        </radialGradient>
        <radialGradient id="sloth-head-grad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#BDA882" />
          <stop offset="100%" stopColor="#9A7E5C" />
        </radialGradient>
        <filter id="sloth-shadow">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Glow — positive moods */}
      {showGlow && (
        <circle className="animal-glow" cx="100" cy="110" r="80" fill="url(#sloth-glow)" opacity="0" />
      )}

      {/* Sparkles (flexing) */}
      {isFlexing && (
        <g className="animal-effects">
          <polygon className="sparkle" points="45,40 48,48 56,48 50,53 52,61 45,56 38,61 40,53 34,48 42,48" fill="#FFD700" />
          <polygon className="sparkle" points="155,40 158,48 166,48 160,53 162,61 155,56 148,61 150,53 144,48 152,48" fill="#FFD700" />
          <polygon className="sparkle" points="40,130 43,138 51,138 45,143 47,151 40,146 33,151 35,143 29,138 37,138" fill="#FFD700" />
          <polygon className="sparkle" points="160,130 163,138 171,138 165,143 167,151 160,146 153,151 155,143 149,138 157,138" fill="#FFD700" />
        </g>
      )}

      {/* Vine branch for tired mood */}
      {isTired && (
        <path d="M30,60 Q60,50 80,55 Q95,58 100,65" stroke="#6B8E4E" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
      )}

      {/* Body */}
      <g className="animal-body" filter="url(#sloth-shadow)">
        <ellipse cx="100" cy="135" rx="42" ry="48" fill="url(#sloth-body-grad)" />

        {/* Belly */}
        <ellipse
          className="animal-belly"
          cx="100"
          cy="140"
          rx={isFull ? 32 : 28}
          ry={isFull ? 38 : 32}
          fill="#BDA882"
        />

        {/* Golden forehead highlight */}
        <ellipse cx="100" cy="120" rx="20" ry="10" fill="#D4C098" opacity="0.15" />

        {/* Arms */}
        {isFlexing ? (
          <>
            <path d="M62,120 Q42,88 58,68" stroke="url(#sloth-body-grad)" strokeWidth="14" strokeLinecap="round" fill="none" />
            <path d="M138,120 Q158,88 142,68" stroke="url(#sloth-body-grad)" strokeWidth="14" strokeLinecap="round" fill="none" />
            {/* Claws */}
            <line x1="55" y1="68" x2="50" y2="60" stroke="#5C4A3A" strokeWidth="2" strokeLinecap="round" />
            <line x1="58" y1="68" x2="58" y2="58" stroke="#5C4A3A" strokeWidth="2" strokeLinecap="round" />
            <line x1="61" y1="68" x2="66" y2="60" stroke="#5C4A3A" strokeWidth="2" strokeLinecap="round" />
            <line x1="139" y1="68" x2="134" y2="60" stroke="#5C4A3A" strokeWidth="2" strokeLinecap="round" />
            <line x1="142" y1="68" x2="142" y2="58" stroke="#5C4A3A" strokeWidth="2" strokeLinecap="round" />
            <line x1="145" y1="68" x2="150" y2="60" stroke="#5C4A3A" strokeWidth="2" strokeLinecap="round" />
          </>
        ) : isHungry ? (
          <>
            <path d="M62,118 Q48,138 58,155" stroke="url(#sloth-body-grad)" strokeWidth="14" strokeLinecap="round" fill="none" />
            <path d="M138,118 Q128,135 112,142" stroke="url(#sloth-body-grad)" strokeWidth="14" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <path d="M62,118 Q48,142 54,162" stroke="url(#sloth-body-grad)" strokeWidth="14" strokeLinecap="round" fill="none" />
            <path d="M138,118 Q152,142 146,162" stroke="url(#sloth-body-grad)" strokeWidth="14" strokeLinecap="round" fill="none" />
            {/* Claws */}
            <line x1="51" y1="162" x2="46" y2="170" stroke="#5C4A3A" strokeWidth="2" strokeLinecap="round" />
            <line x1="54" y1="162" x2="54" y2="172" stroke="#5C4A3A" strokeWidth="2" strokeLinecap="round" />
            <line x1="57" y1="162" x2="62" y2="170" stroke="#5C4A3A" strokeWidth="2" strokeLinecap="round" />
            <line x1="143" y1="162" x2="138" y2="170" stroke="#5C4A3A" strokeWidth="2" strokeLinecap="round" />
            <line x1="146" y1="162" x2="146" y2="172" stroke="#5C4A3A" strokeWidth="2" strokeLinecap="round" />
            <line x1="149" y1="162" x2="154" y2="170" stroke="#5C4A3A" strokeWidth="2" strokeLinecap="round" />
          </>
        )}
      </g>

      {/* Leaf reward prop — held near left claw */}
      {hasRewardProp && (
        <g className="animal-reward">
          {/* Stem */}
          <line x1="48" y1="158" x2="40" y2="140" stroke="#6B8E4E" strokeWidth="2" strokeLinecap="round" />
          {/* Leaf */}
          <ellipse cx="38" cy="136" rx="10" ry="6" fill="#66BB6A" transform="rotate(-25 38 136)" />
          <line x1="34" y1="136" x2="42" y2="136" stroke="#4CAF50" strokeWidth="0.8" transform="rotate(-25 38 136)" />
          {/* Small second leaf */}
          <ellipse cx="43" cy="144" rx="7" ry="4" fill="#81C784" transform="rotate(15 43 144)" />
        </g>
      )}

      {/* Head */}
      <g className="animal-head">
        <circle cx="100" cy="72" r="38" fill="url(#sloth-head-grad)" />

        {/* Eye patches */}
        <ellipse cx="82" cy="70" rx="16" ry="14" fill="#5C4A3A" />
        <ellipse cx="118" cy="70" rx="16" ry="14" fill="#5C4A3A" />

        {/* Eyes */}
        <g className="animal-eyes">
          <circle cx="82" cy="70" r="7" fill="white" />
          <circle cx="118" cy="70" r="7" fill="white" />
          <circle className="animal-pupil" cx="82" cy="70" r="3.5" fill="#1a1a1a" />
          <circle className="animal-pupil" cx="118" cy="70" r="3.5" fill="#1a1a1a" />

          {/* Tired - heavy droopy lids */}
          {isTired && (
            <>
              <ellipse cx="82" cy="65" rx="9" ry="8" fill="#9A7E5C" />
              <ellipse cx="118" cy="65" rx="9" ry="8" fill="#9A7E5C" />
            </>
          )}

          {/* Full - satisfied lids */}
          {isFull && (
            <>
              <ellipse cx="82" cy="66" rx="9" ry="7" fill="#9A7E5C" />
              <ellipse cx="118" cy="66" rx="9" ry="7" fill="#9A7E5C" />
            </>
          )}

          {/* Blink lids */}
          {showBlink && (
            <>
              <ellipse className="animal-blink-lid" cx="82" cy="66" rx="9" ry="7" fill="#9A7E5C" />
              <ellipse className="animal-blink-lid animal-blink-lid--right" cx="118" cy="66" rx="9" ry="7" fill="#9A7E5C" />
            </>
          )}

          {/* Happy eyes */}
          {isHappy && (
            <>
              <path d="M75,73 Q82,78 89,73" stroke="#9A7E5C" strokeWidth="3" fill="#9A7E5C" />
              <path d="M111,73 Q118,78 125,73" stroke="#9A7E5C" strokeWidth="3" fill="#9A7E5C" />
            </>
          )}

          {/* Disappointed - droopy half-lidded + sweat drop */}
          {isDisappointed && (
            <>
              <ellipse cx="82" cy="67" rx="9" ry="5" fill="#9A7E5C" />
              <ellipse cx="118" cy="67" rx="9" ry="5" fill="#9A7E5C" />
              {/* Droopy outer corners */}
              <line x1="73" y1="64" x2="77" y2="67" stroke="#9A7E5C" strokeWidth="2" strokeLinecap="round" />
              <line x1="127" y1="64" x2="123" y2="67" stroke="#9A7E5C" strokeWidth="2" strokeLinecap="round" />
              {/* Sweat drop */}
              <ellipse cx="134" cy="60" rx="2.5" ry="3.5" fill="#87CEEB" opacity="0.6" />
            </>
          )}
        </g>

        {/* Nose */}
        <ellipse cx="100" cy="82" rx="5" ry="3.5" fill="#3E2E1E" />

        {/* Mouth */}
        {isHappy || isFlexing ? (
          <path d="M88,88 Q100,100 112,88" stroke="#3E2E1E" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : isDisappointed ? (
          <path d="M90,92 Q100,86 110,92" stroke="#3E2E1E" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : isHungry ? (
          <ellipse cx="100" cy="92" rx="6" ry="8" fill="#3E2E1E" />
        ) : isFull ? (
          <path d="M92,88 Q100,94 108,88" stroke="#3E2E1E" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : isMotivated ? (
          <path d="M90,88 Q100,96 110,88" stroke="#3E2E1E" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M92,88 Q100,86 108,88" stroke="#3E2E1E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        )}

        {/* Cheek blush — extends to motivated */}
        {showBlush && (
          <>
            <circle cx="68" cy="80" r="6" fill="#FFB3C6" opacity="0.4" />
            <circle cx="132" cy="80" r="6" fill="#FFB3C6" opacity="0.4" />
          </>
        )}
      </g>
    </svg>
  );
}
