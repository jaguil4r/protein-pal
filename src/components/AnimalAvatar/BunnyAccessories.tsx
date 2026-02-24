interface Props {
  level: number;
}

export function BunnyAccessories({ level }: Props) {
  return (
    <>
      {/* Level 2: Pink bow tie at neck */}
      {level >= 2 && (
        <g className="accessory accessory--bowtie">
          {/* Left wing */}
          <path d="M86,108 Q80,102 88,98 Q94,104 94,108 Z" fill="#FFB3C6" />
          {/* Right wing */}
          <path d="M114,108 Q120,102 112,98 Q106,104 106,108 Z" fill="#FFB3C6" />
          {/* Center knot */}
          <circle cx="100" cy="106" r="3.5" fill="#FF8FAB" />
        </g>
      )}

      {/* Level 3: Daisy flower crown on head */}
      {level >= 3 && (
        <g className="accessory accessory--crown">
          {/* Left daisy */}
          <circle cx="80" cy="50" r="3" fill="white" />
          <circle cx="76" cy="48" r="3" fill="white" />
          <circle cx="78" cy="44" r="3" fill="white" />
          <circle cx="83" cy="45" r="3" fill="white" />
          <circle cx="84" cy="49" r="3" fill="white" />
          <circle cx="80" cy="48" r="2" fill="#FFD700" />

          {/* Center daisy */}
          <circle cx="100" cy="44" r="3" fill="white" />
          <circle cx="96" cy="42" r="3" fill="white" />
          <circle cx="98" cy="38" r="3" fill="white" />
          <circle cx="103" cy="39" r="3" fill="white" />
          <circle cx="104" cy="43" r="3" fill="white" />
          <circle cx="100" cy="41" r="2" fill="#FFD700" />

          {/* Right daisy */}
          <circle cx="120" cy="50" r="3" fill="white" />
          <circle cx="116" cy="48" r="3" fill="white" />
          <circle cx="118" cy="44" r="3" fill="white" />
          <circle cx="123" cy="45" r="3" fill="white" />
          <circle cx="124" cy="49" r="3" fill="white" />
          <circle cx="120" cy="48" r="2" fill="#FFD700" />

          {/* Vine connecting */}
          <path d="M76,50 Q88,52 96,44 Q104,42 110,46 Q116,50 124,50" stroke="#66BB6A" strokeWidth="1.5" fill="none" opacity="0.6" />
        </g>
      )}

      {/* Level 4: Carrot-themed little bag on right side */}
      {level >= 4 && (
        <g className="accessory accessory--bag">
          {/* Strap */}
          <path d="M120,118 Q136,112 140,130" stroke="#E07830" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Bag body */}
          <rect x="132" y="130" width="18" height="16" rx="4" fill="#FF8C42" />
          {/* Bag flap */}
          <path d="M132,134 Q141,128 150,134" fill="#E07830" />
          {/* Carrot emblem */}
          <path d="M141,138 L141,144" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" />
          <path d="M140,138 Q141,135 142,138" fill="#4CAF50" />
          {/* Button */}
          <circle cx="141" cy="134" r="1.5" fill="#FFB74D" />
        </g>
      )}

      {/* Level 5: Golden sparkle aura */}
      {level >= 5 && (
        <g className="accessory accessory--aura">
          <polygon points="100,16 103,24 111,24 105,29 107,37 100,32 93,37 95,29 89,24 97,24" fill="#FFD700" opacity="0.7" />
          <polygon points="38,80 41,86 47,86 42,90 44,96 38,92 32,96 34,90 29,86 35,86" fill="#FFD700" opacity="0.5" />
          <polygon points="162,80 165,86 171,86 166,90 168,96 162,92 156,96 158,90 153,86 159,86" fill="#FFD700" opacity="0.5" />
          <polygon points="50,170 53,176 59,176 54,180 56,186 50,182 44,186 46,180 41,176 47,176" fill="#FFD700" opacity="0.4" />
          <polygon points="150,170 153,176 159,176 154,180 156,186 150,182 144,186 146,180 141,176 147,176" fill="#FFD700" opacity="0.4" />
          <polygon points="100,190 102,195 107,195 103,198 105,203 100,200 95,203 97,198 93,195 98,195" fill="#FFD700" opacity="0.3" />
        </g>
      )}
    </>
  );
}
