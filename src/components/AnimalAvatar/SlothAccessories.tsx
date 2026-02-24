interface Props {
  level: number;
}

export function SlothAccessories({ level }: Props) {
  return (
    <>
      {/* Level 2: Green bow tie at neck */}
      {level >= 2 && (
        <g className="accessory accessory--bowtie">
          {/* Left wing */}
          <path d="M86,105 Q80,99 88,95 Q94,101 94,105 Z" fill="#81C784" />
          {/* Right wing */}
          <path d="M114,105 Q120,99 112,95 Q106,101 106,105 Z" fill="#81C784" />
          {/* Center knot */}
          <circle cx="100" cy="103" r="3.5" fill="#4CAF50" />
        </g>
      )}

      {/* Level 3: Tropical flower crown on head */}
      {level >= 3 && (
        <g className="accessory accessory--crown">
          {/* Left hibiscus */}
          <circle cx="74" cy="40" r="3.5" fill="#FF7043" />
          <circle cx="70" cy="38" r="3.5" fill="#FF7043" />
          <circle cx="72" cy="34" r="3.5" fill="#FF7043" />
          <circle cx="77" cy="35" r="3.5" fill="#FF7043" />
          <circle cx="78" cy="39" r="3.5" fill="#FF7043" />
          <circle cx="74" cy="38" r="2" fill="#FFEB3B" />

          {/* Center tropical flower */}
          <circle cx="100" cy="34" r="4" fill="#E040FB" />
          <circle cx="95" cy="32" r="4" fill="#E040FB" />
          <circle cx="97" cy="28" r="4" fill="#E040FB" />
          <circle cx="103" cy="28" r="4" fill="#E040FB" />
          <circle cx="105" cy="32" r="4" fill="#E040FB" />
          <circle cx="100" cy="31" r="2.5" fill="#FFEB3B" />

          {/* Right flower */}
          <circle cx="126" cy="40" r="3.5" fill="#FF7043" />
          <circle cx="122" cy="38" r="3.5" fill="#FF7043" />
          <circle cx="124" cy="34" r="3.5" fill="#FF7043" />
          <circle cx="129" cy="35" r="3.5" fill="#FF7043" />
          <circle cx="130" cy="39" r="3.5" fill="#FF7043" />
          <circle cx="126" cy="38" r="2" fill="#FFEB3B" />

          {/* Vine */}
          <path d="M70,40 Q86,42 96,34 Q104,30 116,36 Q124,40 130,40" stroke="#4CAF50" strokeWidth="1.5" fill="none" opacity="0.5" />
          {/* Small leaves */}
          <ellipse cx="84" cy="40" rx="4" ry="2" fill="#66BB6A" opacity="0.5" transform="rotate(-10 84 40)" />
          <ellipse cx="114" cy="38" rx="4" ry="2" fill="#66BB6A" opacity="0.5" transform="rotate(10 114 38)" />
        </g>
      )}

      {/* Level 4: Leaf pouch on right side */}
      {level >= 4 && (
        <g className="accessory accessory--bag">
          {/* Strap (vine) */}
          <path d="M120,115 Q138,108 140,128" stroke="#6B8E4E" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Bag body — leaf-shaped */}
          <ellipse cx="142" cy="140" rx="10" ry="13" fill="#66BB6A" transform="rotate(5 142 140)" />
          {/* Leaf vein pattern */}
          <line x1="142" y1="130" x2="142" y2="150" stroke="#4CAF50" strokeWidth="1" opacity="0.5" />
          <path d="M138,136 Q142,134 146,136" stroke="#4CAF50" strokeWidth="0.8" fill="none" opacity="0.4" />
          <path d="M137,142 Q142,140 147,142" stroke="#4CAF50" strokeWidth="0.8" fill="none" opacity="0.4" />
          {/* Flap */}
          <path d="M134,134 Q142,128 150,134" fill="#4CAF50" opacity="0.7" />
          {/* Small acorn button */}
          <circle cx="142" cy="133" r="2" fill="#8D6E63" />
          <path d="M140,132 Q142,130 144,132" fill="#A1887F" />
        </g>
      )}

      {/* Level 5: Golden sparkle aura */}
      {level >= 5 && (
        <g className="accessory accessory--aura">
          <polygon points="100,16 103,24 111,24 105,29 107,37 100,32 93,37 95,29 89,24 97,24" fill="#FFD700" opacity="0.7" />
          <polygon points="36,80 39,86 45,86 40,90 42,96 36,92 30,96 32,90 27,86 33,86" fill="#FFD700" opacity="0.5" />
          <polygon points="164,80 167,86 173,86 168,90 170,96 164,92 158,96 160,90 155,86 161,86" fill="#FFD700" opacity="0.5" />
          <polygon points="48,168 51,174 57,174 52,178 54,184 48,180 42,184 44,178 39,174 45,174" fill="#FFD700" opacity="0.4" />
          <polygon points="152,168 155,174 161,174 156,178 158,184 152,180 146,184 148,178 143,174 149,174" fill="#FFD700" opacity="0.4" />
          <polygon points="100,190 102,195 107,195 103,198 105,203 100,200 95,203 97,198 93,195 98,195" fill="#FFD700" opacity="0.3" />
        </g>
      )}
    </>
  );
}
