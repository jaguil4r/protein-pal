import { MoodState } from '../../types';

interface Props {
  mood: MoodState;
}

export function BunnySvg({ mood }: Props) {
  const isFlexing = mood === 'flexing';
  const isHappy = mood === 'happy' || mood === 'flexing';
  const isFull = mood === 'full';
  const isHungry = mood === 'hungry';
  const isTired = mood === 'tired';
  const isMotivated = mood === 'motivated';
  const isDisappointed = mood === 'disappointed';
  const showBlink = !isTired && !isFull && !isHappy && !isDisappointed;

  // Reward prop shows in all positive moods (has entries & on track)
  const hasRewardProp = isFull || isHappy || isMotivated || isFlexing;
  // Glow for all positive moods
  const showGlow = isHappy || isFull || isMotivated;
  // Blush for warm/positive moods
  const showBlush = isHappy || isFull || isFlexing || isMotivated;

  // Ear angle based on mood
  let leftEarRotate = '0';
  let rightEarRotate = '0';
  if (isDisappointed) {
    leftEarRotate = '-35';
    rightEarRotate = '35';
  } else if (isTired) {
    leftEarRotate = '-30';
    rightEarRotate = '30';
  } else if (isFlexing) {
    leftEarRotate = '-5';
    rightEarRotate = '5';
  } else if (isMotivated) {
    leftEarRotate = '-3';
    rightEarRotate = '3';
  }

  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={`Bunny feeling ${mood}`}>
      <defs>
        <radialGradient id="bunny-glow">
          <stop offset="0%" stopColor="#FFF3E0" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FFF3E0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bunny-body-grad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFF8F2" />
          <stop offset="100%" stopColor="#F0DDD0" />
        </radialGradient>
        <radialGradient id="bunny-head-grad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFF8F2" />
          <stop offset="100%" stopColor="#EDDED4" />
        </radialGradient>
        <filter id="bunny-shadow">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Glow — positive moods */}
      {showGlow && (
        <circle className="animal-glow" cx="100" cy="110" r="80" fill="url(#bunny-glow)" opacity="0" />
      )}

      {/* Sparkles */}
      {isFlexing && (
        <g className="animal-effects">
          <polygon className="sparkle" points="40,50 43,58 51,58 45,63 47,71 40,66 33,71 35,63 29,58 37,58" fill="#FFD700" />
          <polygon className="sparkle" points="160,50 163,58 171,58 165,63 167,71 160,66 153,71 155,63 149,58 157,58" fill="#FFD700" />
          <polygon className="sparkle" points="35,135 38,143 46,143 40,148 42,156 35,151 28,156 30,148 24,143 32,143" fill="#FFD700" />
          <polygon className="sparkle" points="165,135 168,143 176,143 170,148 172,156 165,151 158,156 160,148 154,143 162,143" fill="#FFD700" />
        </g>
      )}

      {/* Ears */}
      <g className="animal-ears">
        <ellipse
          cx="78" cy="30" rx="12" ry="32"
          fill="url(#bunny-body-grad)"
          transform={`rotate(${leftEarRotate} 78 55)`}
          style={{ transition: 'transform 0.5s ease' }}
        />
        <ellipse
          cx="78" cy="30" rx="6" ry="24"
          fill="#FFB3C6"
          opacity="0.5"
          transform={`rotate(${leftEarRotate} 78 55)`}
          style={{ transition: 'transform 0.5s ease' }}
        />
        <ellipse
          cx="122" cy="30" rx="12" ry="32"
          fill="url(#bunny-body-grad)"
          transform={`rotate(${rightEarRotate} 122 55)`}
          style={{ transition: 'transform 0.5s ease' }}
        />
        <ellipse
          cx="122" cy="30" rx="6" ry="24"
          fill="#FFB3C6"
          opacity="0.5"
          transform={`rotate(${rightEarRotate} 122 55)`}
          style={{ transition: 'transform 0.5s ease' }}
        />
      </g>

      {/* Body */}
      <g className="animal-body" filter="url(#bunny-shadow)">
        <ellipse cx="100" cy="140" rx="38" ry="42" fill="url(#bunny-body-grad)" />

        {/* Belly */}
        <ellipse
          className="animal-belly"
          cx="100"
          cy="144"
          rx={isFull ? 28 : 24}
          ry={isFull ? 32 : 26}
          fill="#FFF8F2"
        />

        {/* Arms */}
        {isFlexing ? (
          <>
            <path d="M66,124 Q48,96 60,76" stroke="url(#bunny-body-grad)" strokeWidth="14" strokeLinecap="round" fill="none" />
            <path d="M134,124 Q152,96 140,76" stroke="url(#bunny-body-grad)" strokeWidth="14" strokeLinecap="round" fill="none" />
          </>
        ) : isHungry ? (
          <>
            <path d="M66,122 Q52,140 60,158" stroke="url(#bunny-body-grad)" strokeWidth="14" strokeLinecap="round" fill="none" />
            <path d="M134,122 Q124,138 112,144" stroke="url(#bunny-body-grad)" strokeWidth="14" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <path d="M66,122 Q50,145 58,162" stroke="url(#bunny-body-grad)" strokeWidth="14" strokeLinecap="round" fill="none" />
            <path d="M134,122 Q150,145 142,162" stroke="url(#bunny-body-grad)" strokeWidth="14" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* Feet */}
        <ellipse cx="80" cy="178" rx="14" ry="8" fill="url(#bunny-body-grad)" />
        <ellipse cx="120" cy="178" rx="14" ry="8" fill="url(#bunny-body-grad)" />
        {/* Toe pads */}
        <circle cx="74" cy="176" r="3" fill="#FFD4CC" opacity="0.6" />
        <circle cx="80" cy="174" r="3" fill="#FFD4CC" opacity="0.6" />
        <circle cx="86" cy="176" r="3" fill="#FFD4CC" opacity="0.6" />
        <circle cx="114" cy="176" r="3" fill="#FFD4CC" opacity="0.6" />
        <circle cx="120" cy="174" r="3" fill="#FFD4CC" opacity="0.6" />
        <circle cx="126" cy="176" r="3" fill="#FFD4CC" opacity="0.6" />

        {/* Tail */}
        <circle className="animal-tail" cx="140" cy="158" r="8" fill="#FFF8F2" />
      </g>

      {/* Carrot reward prop — held near left paw */}
      {hasRewardProp && (
        <g className="animal-reward">
          {/* Carrot body */}
          <path d="M52,155 L56,172 L54,172 L50,155 Z" fill="#FF8C42" />
          <path d="M51,158 L55,158" stroke="#E07830" strokeWidth="0.5" opacity="0.6" />
          <path d="M51.5,162 L55,162" stroke="#E07830" strokeWidth="0.5" opacity="0.6" />
          <path d="M52.5,166 L55,166" stroke="#E07830" strokeWidth="0.5" opacity="0.6" />
          {/* Carrot top (leaves) */}
          <path d="M51,155 Q48,146 44,142" stroke="#4CAF50" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M51,155 Q52,145 50,140" stroke="#66BB6A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M51,155 Q55,147 58,143" stroke="#4CAF50" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>
      )}

      {/* Head */}
      <g className="animal-head">
        <circle cx="100" cy="78" r="34" fill="url(#bunny-head-grad)" />

        {/* Eyes */}
        <g className="animal-eyes">
          <circle cx="85" cy="74" r="7" fill="#1a1a1a" />
          <circle cx="115" cy="74" r="7" fill="#1a1a1a" />
          <circle className="animal-pupil" cx="85" cy="74" r="4" fill="#1a1a1a" />
          <circle className="animal-pupil" cx="115" cy="74" r="4" fill="#1a1a1a" />
          {/* Highlights */}
          <circle cx="83" cy="72" r="2" fill="white" />
          <circle cx="113" cy="72" r="2" fill="white" />

          {/* Tired - heavy droopy lids */}
          {isTired && (
            <>
              <rect x="78" y="64" width="14" height="10" rx="3" fill="#EDDED4" />
              <rect x="108" y="64" width="14" height="10" rx="3" fill="#EDDED4" />
            </>
          )}

          {/* Full - satisfied lids */}
          {isFull && (
            <>
              <path d="M78,70 Q85,68 92,70" fill="#EDDED4" stroke="none" />
              <rect x="78" y="66" width="14" height="7" rx="3" fill="#EDDED4" />
              <rect x="108" y="66" width="14" height="7" rx="3" fill="#EDDED4" />
            </>
          )}

          {/* Blink lids */}
          {showBlink && (
            <>
              <rect className="animal-blink-lid" x="78" y="66" width="14" height="7" rx="3" fill="#EDDED4" />
              <rect className="animal-blink-lid animal-blink-lid--right" x="108" y="66" width="14" height="7" rx="3" fill="#EDDED4" />
            </>
          )}

          {/* Happy squint */}
          {isHappy && (
            <>
              <path d="M78,77 Q85,82 92,77" stroke="#EDDED4" strokeWidth="4" fill="#EDDED4" />
              <path d="M108,77 Q115,82 122,77" stroke="#EDDED4" strokeWidth="4" fill="#EDDED4" />
            </>
          )}

          {/* Disappointed - droopy sad eyes + sweat drop */}
          {isDisappointed && (
            <>
              <rect x="78" y="65" width="14" height="8" rx="3" fill="#EDDED4" />
              <rect x="108" y="65" width="14" height="8" rx="3" fill="#EDDED4" />
              {/* Droopy outer corners */}
              <line x1="78" y1="70" x2="75" y2="74" stroke="#EDDED4" strokeWidth="2" strokeLinecap="round" />
              <line x1="122" y1="70" x2="125" y2="74" stroke="#EDDED4" strokeWidth="2" strokeLinecap="round" />
              {/* Sweat drop */}
              <ellipse cx="130" cy="64" rx="2.5" ry="3.5" fill="#87CEEB" opacity="0.6" />
            </>
          )}
        </g>

        {/* Nose */}
        <path d="M97,84 L100,88 L103,84 Z" fill="#FFB3B3" />

        {/* Whiskers */}
        <g className="animal-whiskers">
          <line x1="70" y1="82" x2="55" y2="78" stroke="#D4B3A0" strokeWidth="1" />
          <line x1="70" y1="86" x2="54" y2="86" stroke="#D4B3A0" strokeWidth="1" />
          <line x1="70" y1="90" x2="55" y2="94" stroke="#D4B3A0" strokeWidth="1" />
          <line x1="130" y1="82" x2="145" y2="78" stroke="#D4B3A0" strokeWidth="1" />
          <line x1="130" y1="86" x2="146" y2="86" stroke="#D4B3A0" strokeWidth="1" />
          <line x1="130" y1="90" x2="145" y2="94" stroke="#D4B3A0" strokeWidth="1" />
        </g>

        {/* Mouth */}
        {isHappy || isFlexing ? (
          <path d="M90,92 Q100,102 110,92" stroke="#D4A090" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : isDisappointed ? (
          <path d="M92,95 Q100,89 108,95" stroke="#D4A090" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : isHungry ? (
          <ellipse cx="100" cy="94" rx="5" ry="7" fill="#D4A090" />
        ) : isFull ? (
          <path d="M94,92 Q100,97 106,92" stroke="#D4A090" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : isMotivated ? (
          <path d="M92,92 Q100,98 108,92" stroke="#D4A090" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M95,93 Q100,91 105,93" stroke="#D4A090" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        )}

        {/* Blush — extends to motivated */}
        {showBlush && (
          <>
            <circle cx="72" cy="84" r="5" fill="#FFB3C6" opacity="0.35" />
            <circle cx="128" cy="84" r="5" fill="#FFB3C6" opacity="0.35" />
          </>
        )}
      </g>
    </svg>
  );
}
