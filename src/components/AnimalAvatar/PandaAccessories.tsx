interface Props {
  level: number;
}

export function PandaAccessories({ level }: Props) {
  return (
    <>
      {/* Level 2: Red bow tie at neck */}
      {level >= 2 && (
        <g className="accessory accessory--bowtie">
          {/* Left wing */}
          <path d="M86,108 Q80,102 88,98 Q94,104 94,108 Z" fill="#EF5350" />
          {/* Right wing */}
          <path d="M114,108 Q120,102 112,98 Q106,104 106,108 Z" fill="#EF5350" />
          {/* Center knot */}
          <circle cx="100" cy="106" r="3.5" fill="#C62828" />
        </g>
      )}

      {/* Level 3: Cherry blossom crown on head */}
      {level >= 3 && (
        <g className="accessory accessory--crown">
          {/* Left blossom */}
          <circle cx="74" cy="38" r="3" fill="#F8BBD0" />
          <circle cx="70" cy="36" r="3" fill="#F8BBD0" />
          <circle cx="72" cy="32" r="3" fill="#F8BBD0" />
          <circle cx="77" cy="33" r="3" fill="#F8BBD0" />
          <circle cx="78" cy="37" r="3" fill="#F8BBD0" />
          <circle cx="74" cy="36" r="2" fill="#E91E63" opacity="0.6" />

          {/* Center blossom */}
          <circle cx="100" cy="32" r="3.5" fill="#F8BBD0" />
          <circle cx="96" cy="30" r="3.5" fill="#F8BBD0" />
          <circle cx="97" cy="26" r="3.5" fill="#F8BBD0" />
          <circle cx="103" cy="26" r="3.5" fill="#F8BBD0" />
          <circle cx="104" cy="30" r="3.5" fill="#F8BBD0" />
          <circle cx="100" cy="29" r="2.5" fill="#E91E63" opacity="0.6" />

          {/* Right blossom */}
          <circle cx="126" cy="38" r="3" fill="#F8BBD0" />
          <circle cx="122" cy="36" r="3" fill="#F8BBD0" />
          <circle cx="124" cy="32" r="3" fill="#F8BBD0" />
          <circle cx="129" cy="33" r="3" fill="#F8BBD0" />
          <circle cx="130" cy="37" r="3" fill="#F8BBD0" />
          <circle cx="126" cy="36" r="2" fill="#E91E63" opacity="0.6" />

          {/* Branch */}
          <path d="M70,38 Q88,40 96,32 Q104,28 114,34 Q122,38 130,38" stroke="#795548" strokeWidth="1.5" fill="none" opacity="0.5" />
        </g>
      )}

      {/* Level 4: Bamboo satchel on right side */}
      {level >= 4 && (
        <g className="accessory accessory--bag">
          {/* Strap */}
          <path d="M120,118 Q138,112 142,132" stroke="#4CAF50" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Bag body */}
          <rect x="134" y="132" width="18" height="16" rx="4" fill="#66BB6A" />
          {/* Bag flap */}
          <path d="M134,136 Q143,130 152,136" fill="#4CAF50" />
          {/* Bamboo emblem */}
          <line x1="143" y1="138" x2="143" y2="146" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" />
          <line x1="140" y1="142" x2="146" y2="142" stroke="#2E7D32" strokeWidth="1" />
          {/* Leaf accent */}
          <ellipse cx="146" cy="139" rx="3" ry="1.5" fill="#81C784" transform="rotate(-30 146 139)" />
          {/* Button */}
          <circle cx="143" cy="136" r="1.5" fill="#A5D6A7" />
        </g>
      )}

      {/* Level 5: Golden sparkle aura */}
      {level >= 5 && (
        <g className="accessory accessory--aura">
          <polygon points="100,14 103,22 111,22 105,27 107,35 100,30 93,35 95,27 89,22 97,22" fill="#FFD700" opacity="0.7" />
          <polygon points="36,78 39,84 45,84 40,88 42,94 36,90 30,94 32,88 27,84 33,84" fill="#FFD700" opacity="0.5" />
          <polygon points="164,78 167,84 173,84 168,88 170,94 164,90 158,94 160,88 155,84 161,84" fill="#FFD700" opacity="0.5" />
          <polygon points="48,168 51,174 57,174 52,178 54,184 48,180 42,184 44,178 39,174 45,174" fill="#FFD700" opacity="0.4" />
          <polygon points="152,168 155,174 161,174 156,178 158,184 152,180 146,184 148,178 143,174 149,174" fill="#FFD700" opacity="0.4" />
          <polygon points="100,192 102,197 107,197 103,200 105,205 100,202 95,205 97,200 93,197 98,197" fill="#FFD700" opacity="0.3" />
        </g>
      )}
    </>
  );
}
