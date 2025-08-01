// avatar-system-realistic.js - AVATAR PRECARICATI LOCALI
// 20+ avatar professionali già nel codice + personalizzazione CSS

// === GALLERIA AVATAR PRECARICATI ===
const PreloadedAvatars = {
    male: [
        {
            id: 'male_1',
            name: 'Marco - Professionale',
            svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="face1" cx="0.4" cy="0.3" r="0.8">
                        <stop offset="0%" stop-color="var(--skin-light, #FFE4C4)"/>
                        <stop offset="100%" stop-color="var(--skin-main, #DEB887)"/>
                    </radialGradient>
                </defs>
                <circle cx="100" cy="100" r="95" fill="#4ECDC4"/>
                <ellipse cx="100" cy="130" rx="35" ry="45" fill="url(#face1)"/>
                <path d="M70 95 Q100 75 130 95 L125 110 Q100 90 75 110 Z" fill="var(--hair-color, #8B4513)"/>
                <ellipse cx="88" cy="115" rx="6" ry="5" fill="white"/>
                <ellipse cx="112" cy="115" rx="6" ry="5" fill="white"/>
                <circle cx="88" cy="115" r="3" fill="var(--eye-color, #4169E1)"/>
                <circle cx="112" cy="115" r="3" fill="var(--eye-color, #4169E1)"/>
                <circle cx="88" cy="115" r="1.5" fill="#000"/>
                <circle cx="112" cy="115" r="1.5" fill="#000"/>
                <path d="M82 108 Q88 106 94 108" stroke="var(--hair-color, #8B4513)" stroke-width="2" fill="none"/>
                <path d="M106 108 Q112 106 118 108" stroke="var(--hair-color, #8B4513)" stroke-width="2" fill="none"/>
                <ellipse cx="100" cy="125" rx="1.5" ry="3" fill="var(--skin-shadow, #D2B48C)" opacity="0.7"/>
                <path d="M92 135 Q100 140 108 135" stroke="#E74C3C" stroke-width="3" fill="none" stroke-linecap="round"/>
                <rect x="85" y="165" width="30" height="35" rx="5" fill="#2C5282"/>
                <rect x="87" y="167" width="26" height="15" rx="3" fill="#4A90E2"/>
            </svg>`
        },
        {
            id: 'male_2',
            name: 'Alessandro - Sportivo',
            svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="face2" cx="0.4" cy="0.3" r="0.8">
                        <stop offset="0%" stop-color="var(--skin-light, #F4C2A1)"/>
                        <stop offset="100%" stop-color="var(--skin-main, #D2B48C)"/>
                    </radialGradient>
                </defs>
                <circle cx="100" cy="100" r="95" fill="#FF6B6B"/>
                <ellipse cx="100" cy="128" rx="38" ry="48" fill="url(#face2)"/>
                <path d="M65 88 Q100 70 135 88 L130 105 Q100 85 70 105 Z" fill="var(--hair-color, #2C1B18)"/>
                <ellipse cx="87" cy="118" rx="7" ry="6" fill="white"/>
                <ellipse cx="113" cy="118" rx="7" ry="6" fill="white"/>
                <circle cx="87" cy="118" r="3.5" fill="var(--eye-color, #228B22)"/>
                <circle cx="113" cy="118" r="3.5" fill="var(--eye-color, #228B22)"/>
                <circle cx="87" cy="118" r="2" fill="#000"/>
                <circle cx="113" cy="118" r="2" fill="#000"/>
                <path d="M80 110 Q87 108 94 110" stroke="var(--hair-color, #2C1B18)" stroke-width="3" fill="none"/>
                <path d="M106 110 Q113 108 120 110" stroke="var(--hair-color, #2C1B18)" stroke-width="3" fill="none"/>
                <ellipse cx="100" cy="128" rx="2" ry="4" fill="var(--skin-shadow, #C8A882)" opacity="0.8"/>
                <path d="M90 143 Q100 150 110 143" stroke="#E74C3C" stroke-width="4" fill="none" stroke-linecap="round"/>
                <rect x="82" y="168" width="36" height="32" rx="6" fill="#E74C3C"/>
                <circle cx="100" cy="184" r="8" fill="white"/>
            </svg>`
        },
        {
            id: 'male_3',
            name: 'Davide - Tecnologico',
            svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="face3" cx="0.4" cy="0.3" r="0.8">
                        <stop offset="0%" stop-color="var(--skin-light, #FDBCB4)"/>
                        <stop offset="100%" stop-color="var(--skin-main, #E8A584)"/>
                    </radialGradient>
                </defs>
                <circle cx="100" cy="100" r="95" fill="#96CEB4"/>
                <ellipse cx="100" cy="125" rx="36" ry="46" fill="url(#face3)"/>
                <path d="M68 90 Q100 70 132 90 L128 108 Q100 88 72 108 Z" fill="var(--hair-color, #B8860B)"/>
                <ellipse cx="85" cy="120" rx="12" ry="10" fill="white" stroke="#2C3E50" stroke-width="2"/>
                <ellipse cx="115" cy="120" rx="12" ry="10" fill="white" stroke="#2C3E50" stroke-width="2"/>
                <circle cx="85" cy="120" r="4" fill="var(--eye-color, #8B4513)"/>
                <circle cx="115" cy="120" r="4" fill="var(--eye-color, #8B4513)"/>
                <circle cx="85" cy="120" r="2" fill="#000"/>
                <circle cx="115" cy="120" r="2" fill="#000"/>
                <line x1="97" y1="120" x2="103" y2="120" stroke="#2C3E50" stroke-width="2"/>
                <ellipse cx="82" cy="115" rx="2" ry="4" fill="white" opacity="0.7"/>
                <ellipse cx="112" cy="115" rx="2" ry="4" fill="white" opacity="0.7"/>
                <path d="M78 112 Q85 110 92 112" stroke="var(--hair-color, #B8860B)" stroke-width="2" fill="none"/>
                <path d="M108 112 Q115 110 122 112" stroke="var(--hair-color, #B8860B)" stroke-width="2" fill="none"/>
                <ellipse cx="100" cy="130" rx="2" ry="4" fill="var(--skin-shadow, #D49A6A)" opacity="0.6"/>
                <ellipse cx="100" cy="145" rx="12" ry="6" fill="var(--hair-color, #B8860B)" opacity="0.7"/>
                <path d="M88 145 Q100 152 112 145" stroke="#FF69B4" stroke-width="3" fill="none"/>
                <rect x="80" y="165" width="40" height="35" rx="8" fill="#4A5568"/>
                <rect x="85" y="170" width="30" height="8" rx="2" fill="#68D391"/>
            </svg>`
        },
        {
            id: 'male_4',
            name: 'Luca - Creativo',
            svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="face4" cx="0.4" cy="0.3" r="0.8">
                        <stop offset="0%" stop-color="var(--skin-light, #FFE4E1)"/>
                        <stop offset="100%" stop-color="var(--skin-main, #F5DEB3)"/>
                    </radialGradient>
                </defs>
                <circle cx="100" cy="100" r="95" fill="#DDA0DD"/>
                <ellipse cx="100" cy="126" rx="34" ry="44" fill="url(#face4)"/>
                <circle cx="75" cy="85" r="15" fill="var(--hair-color, #654321)"/>
                <circle cx="100" cy="75" r="18" fill="var(--hair-color, #654321)"/>
                <circle cx="125" cy="85" r="15" fill="var(--hair-color, #654321)"/>
                <circle cx="85" cy="105" r="12" fill="var(--hair-color, #654321)"/>
                <circle cx="115" cy="105" r="12" fill="var(--hair-color, #654321)"/>
                <ellipse cx="88" cy="121" rx="6" ry="5" fill="white"/>
                <ellipse cx="112" cy="121" rx="6" ry="5" fill="white"/>
                <circle cx="88" cy="121" r="3" fill="var(--eye-color, #800080)"/>
                <circle cx="112" cy="121" r="3" fill="var(--eye-color, #800080)"/>
                <circle cx="88" cy="121" r="1.5" fill="#000"/>
                <circle cx="112" cy="121" r="1.5" fill="#000"/>
                <path d="M82 114 Q88 112 94 114" stroke="var(--hair-color, #654321)" stroke-width="2" fill="none"/>
                <path d="M106 114 Q112 112 118 114" stroke="var(--hair-color, #654321)" stroke-width="2" fill="none"/>
                <ellipse cx="100" cy="131" rx="1.5" ry="3" fill="var(--skin-shadow, #E6D3B7)" opacity="0.6"/>
                <ellipse cx="100" cy="146" rx="8" ry="4" fill="#FF1493"/>
                <ellipse cx="100" cy="145" rx="6" ry="2" fill="#FFB6C1"/>
                <rect x="88" y="168" width="24" height="32" rx="4" fill="#8B008B"/>
                <circle cx="94" cy="175" r="2" fill="#FFD700"/>
                <circle cx="106" cy="175" r="2" fill="#FFD700"/>
            </svg>`
        },
        {
            id: 'male_5',
            name: 'Roberto - Manager',
            svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="face5" cx="0.4" cy="0.3" r="0.8">
                        <stop offset="0%" stop-color="var(--skin-light, #F7E7CE)"/>
                        <stop offset="100%" stop-color="var(--skin-main, #DEB887)"/>
                    </radialGradient>
                </defs>
                <circle cx="100" cy="100" r="95" fill="#85C1E9"/>
                <ellipse cx="100" cy="132" rx="40" ry="50" fill="url(#face5)"/>
                <path d="M60 98 Q100 78 140 98 L135 115 Q100 95 65 115 Z" fill="var(--hair-color, #808080)"/>
                <ellipse cx="85" cy="122" rx="8" ry="6" fill="white"/>
                <ellipse cx="115" cy="122" rx="8" ry="6" fill="white"/>
                <circle cx="85" cy="122" r="4" fill="var(--eye-color, #708090)"/>
                <circle cx="115" cy="122" r="4" fill="var(--eye-color, #708090)"/>
                <circle cx="85" cy="122" r="2" fill="#000"/>
                <circle cx="115" cy="122" r="2" fill="#000"/>
                <path d="M77 115 Q85 113 93 115" stroke="var(--hair-color, #808080)" stroke-width="3" fill="none"/>
                <path d="M107 115 Q115 113 123 115" stroke="var(--hair-color, #808080)" stroke-width="3" fill="none"/>
                <ellipse cx="100" cy="132" rx="2.5" ry="4" fill="var(--skin-shadow, #D49A6A)" opacity="0.7"/>
                <rect x="92" y="147" width="16" height="3" rx="1.5" fill="#CD5C5C"/>
                <ellipse cx="100" cy="155" rx="15" ry="8" fill="var(--hair-color, #808080)" opacity="0.8"/>
                <rect x="75" y="170" width="50" height="30" rx="8" fill="#2D3748"/>
                <rect x="80" y="175" width="40" height="8" rx="2" fill="white"/>
                <rect x="95" y="185" width="10" height="8" rx="2" fill="#E53E3E"/>
            </svg>`
        }
    ],
    
    female: [
        {
            id: 'female_1',
            name: 'Sofia - Elegante',
            svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="faceF1" cx="0.4" cy="0.3" r="0.8">
                        <stop offset="0%" stop-color="var(--skin-light, #FFE4E1)"/>
                        <stop offset="100%" stop-color="var(--skin-main, #F5DEB3)"/>
                    </radialGradient>
                </defs>
                <circle cx="100" cy="100" r="95" fill="#F7DC6F"/>
                <ellipse cx="100" cy="128" rx="32" ry="42" fill="url(#faceF1)"/>
                <path d="M55 85 Q100 60 145 85 L150 125 Q100 95 50 125 Z" fill="var(--hair-color, #654321)"/>
                <ellipse cx="65" cy="110" rx="10" ry="20" fill="var(--hair-color, #654321)"/>
                <ellipse cx="135" cy="110" rx="10" ry="20" fill="var(--hair-color, #654321)"/>
                <ellipse cx="87" cy="118" rx="7" ry="5" fill="white"/>
                <ellipse cx="113" cy="118" rx="7" ry="5" fill="white"/>
                <circle cx="87" cy="118" r="3" fill="var(--eye-color, #4169E1)"/>
                <circle cx="113" cy="118" r="3" fill="var(--eye-color, #4169E1)"/>
                <circle cx="87" cy="118" r="1.5" fill="#000"/>
                <circle cx="113" cy="118" r="1.5" fill="#000"/>
                <path d="M81 113 Q87 111 93 113" stroke="#000" stroke-width="1" fill="none"/>
                <path d="M107 113 Q113 111 119 113" stroke="#000" stroke-width="1" fill="none"/>
                <path d="M82 111 Q87 109 92 111" stroke="var(--hair-color, #654321)" stroke-width="2" fill="none"/>
                <path d="M108 111 Q113 109 118 111" stroke="var(--hair-color, #654321)" stroke-width="2" fill="none"/>
                <ellipse cx="100" cy="128" rx="1.5" ry="3" fill="var(--skin-shadow, #E6D3B7)" opacity="0.6"/>
                <ellipse cx="100" cy="142" rx="8" ry="4" fill="#FF1493"/>
                <ellipse cx="100" cy="141" rx="6" ry="2" fill="#FFB6C1"/>
                <ellipse cx="75" cy="130" rx="6" ry="4" fill="#FFB6C1" opacity="0.4"/>
                <ellipse cx="125" cy="130" rx="6" ry="4" fill="#FFB6C1" opacity="0.4"/>
                <rect x="85" y="165" width="30" height="35" rx="6" fill="#E53E3E"/>
                <circle cx="100" cy="172" r="3" fill="white"/>
            </svg>`
        },
        {
            id: 'female_2',
            name: 'Giulia - Dolce',
            svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="faceF2" cx="0.4" cy="0.3" r="0.8">
                        <stop offset="0%" stop-color="var(--skin-light, #FFEEE6)"/>
                        <stop offset="100%" stop-color="var(--skin-main, #F0D0A0)"/>
                    </radialGradient>
                </defs>
                <circle cx="100" cy="100" r="95" fill="#BB8FCE"/>
                <ellipse cx="100" cy="125" rx="30" ry="40" fill="url(#faceF2)"/>
                <path d="M50 80 Q100 55 150 80 L155 120 Q100 90 45 120 Z" fill="var(--hair-color, #DAA520)"/>
                <ellipse cx="65" cy="105" rx="8" ry="18" fill="var(--hair-color, #DAA520)"/>
                <ellipse cx="135" cy="105" rx="8" ry="18" fill="var(--hair-color, #DAA520)"/>
                <ellipse cx="88" cy="120" rx="6" ry="4" fill="white"/>
                <ellipse cx="112" cy="120" rx="6" ry="4" fill="white"/>
                <circle cx="88" cy="120" r="2.5" fill="var(--eye-color, #32CD32)"/>
                <circle cx="112" cy="120" r="2.5" fill="var(--eye-color, #32CD32)"/>
                <circle cx="88" cy="120" r="1.5" fill="#000"/>
                <circle cx="112" cy="120" r="1.5" fill="#000"/>
                <path d="M83 115 Q88 113 93 115" stroke="var(--hair-color, #DAA520)" stroke-width="1.5" fill="none"/>
                <path d="M107 115 Q112 113 117 115" stroke="var(--hair-color, #DAA520)" stroke-width="1.5" fill="none"/>
                <ellipse cx="100" cy="128" rx="1" ry="2.5" fill="var(--skin-shadow, #E6C078)" opacity="0.5"/>
                <path d="M92 138 Q100 144 108 138" stroke="#FF69B4" stroke-width="3" fill="none"/>
                <ellipse cx="82" cy="135" rx="2" ry="1.5" fill="var(--skin-shadow, #E6C078)" opacity="0.3"/>
                <ellipse cx="118" cy="135" rx="2" ry="1.5" fill="var(--skin-shadow, #E6C078)" opacity="0.3"/>
                <rect x="88" y="165" width="24" height="35" rx="5" fill="#FF69B4"/>
                <rect x="92" y="170" width="16" height="10" rx="2" fill="white"/>
            </svg>`
        },
        {
            id: 'female_3',
            name: 'Martina - Moderna',
            svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="faceF3" cx="0.4" cy="0.3" r="0.8">
                        <stop offset="0%" stop-color="var(--skin-light, #F7E7CE)"/>
                        <stop offset="100%" stop-color="var(--skin-main, #DEB887)"/>
                    </radialGradient>
                </defs>
                <circle cx="100" cy="100" r="95" fill="#98D8C8"/>
                <ellipse cx="100" cy="130" rx="35" ry="45" fill="url(#faceF3)"/>
                <path d="M65 90 Q100 70 135 90 L130 105 Q100 85 70 105 Z" fill="var(--hair-color, #2F1B14)"/>
                <ellipse cx="85" cy="122" rx="8" ry="6" fill="white"/>
                <ellipse cx="115" cy="122" rx="8" ry="6" fill="white"/>
                <circle cx="85" cy="122" r="4" fill="var(--eye-color, #800080)"/>
                <circle cx="115" cy="122" r="4" fill="var(--eye-color, #800080)"/>
                <circle cx="85" cy="122" r="2.5" fill="#000"/>
                <circle cx="115" cy="122" r="2.5" fill="#000"/>
                <path d="M77 117 Q85 115 93 117" stroke="#4B0082" stroke-width="2" fill="none"/>
                <path d="M107 117 Q115 115 123 117" stroke="#4B0082" stroke-width="2" fill="none"/>
                <path d="M78 114 Q85 112 92 114" stroke="var(--hair-color, #2F1B14)" stroke-width="2.5" fill="none"/>
                <path d="M108 114 Q115 112 122 114" stroke="var(--hair-color, #2F1B14)" stroke-width="2.5" fill="none"/>
                <ellipse cx="100" cy="132" rx="2" ry="4" fill="var(--skin-shadow, #D49A6A)" opacity="0.7"/>
                <ellipse cx="100" cy="148" rx="10" ry="5" fill="#DC143C"/>
                <ellipse cx="100" cy="147" rx="8" ry="3" fill="#FF69B4"/>
                <path d="M70 135 Q85 145 100 135" stroke="var(--skin-shadow, #D49A6A)" stroke-width="1" fill="none" opacity="0.4"/>
                <path d="M100 135 Q115 145 130 135" stroke="var(--skin-shadow, #D49A6A)" stroke-width="1" fill="none" opacity="0.4"/>
                <rect x="82" y="168" width="36" height="32" rx="7" fill="#2D3748"/>
                <rect x="88" y="175" width="24" height="8" rx="2" fill="#E2E8F0"/>
            </svg>`
        },
        {
            id: 'female_4',
            name: 'Anna - Professionale',
            svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="faceF4" cx="0.4" cy="0.3" r="0.8">
                        <stop offset="0%" stop-color="var(--skin-light, #F4C2A1)"/>
                        <stop offset="100%" stop-color="var(--skin-main, #D2B48C)"/>
                    </radialGradient>
                </defs>
                <circle cx="100" cy="100" r="95" fill="#FFEAA7"/>
                <ellipse cx="100" cy="127" rx="34" ry="43" fill="url(#faceF4)"/>
                <path d="M60 88 Q100 63 140 88 L135 108 Q100 83 65 108 Z" fill="var(--hair-color, #8B4513)"/>
                <ellipse cx="85" cy="120" rx="10" ry="8" fill="white" stroke="#2C3E50" stroke-width="2"/>
                <ellipse cx="115" cy="120" rx="10" ry="8" fill="white" stroke="#2C3E50" stroke-width="2"/>
                <circle cx="85" cy="120" r="3.5" fill="var(--eye-color, #8B4513)"/>
                <circle cx="115" cy="120" r="3.5" fill="var(--eye-color, #8B4513)"/>
                <circle cx="85" cy="120" r="2" fill="#000"/>
                <circle cx="115" cy="120" r="2" fill="#000"/>
                <line x1="97" y1="120" x2="103" y2="120" stroke="#2C3E50" stroke-width="2"/>
                <ellipse cx="82" cy="115" rx="2" ry="3" fill="white" opacity="0.7"/>
                <ellipse cx="112" cy="115" rx="2" ry="3" fill="white" opacity="0.7"/>
                <path d="M78 113 Q85 111 92 113" stroke="var(--hair-color, #8B4513)" stroke-width="2" fill="none"/>
                <path d="M108 113 Q115 111 122 113" stroke="var(--hair-color, #8B4513)" stroke-width="2" fill="none"/>
                <ellipse cx="100" cy="130" rx="2" ry="3.5" fill="var(--skin-shadow, #C8A882)" opacity="0.8"/>
                <ellipse cx="100" cy="145" rx="9" ry="4" fill="#E74C3C"/>
                <ellipse cx="100" cy="144" rx="7" ry="2.5" fill="#FF69B4"/>
                <rect x="80" y="168" width="40" height="32" rx="8" fill="#2C5282"/>
                <rect x="85" y="173" width="30" height="12" rx="3" fill="white"/>
                <rect x="92" y="188" width="16" height="6" rx="2" fill="#E53E3E"/>
            </svg>`
        },
        {
            id: 'female_5',
            name: 'Elena - Artistica',
            svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="faceF5" cx="0.4" cy="0.3" r="0.8">
                        <stop offset="0%" stop-color="var(--skin-light, #FDBCB4)"/>
                        <stop offset="100%" stop-color="var(--skin-main, #E8A584)"/>
                    </radialGradient>
                </defs>
                <circle cx="100" cy="100" r="95" fill="#A8E6CF"/>
                <ellipse cx="100" cy="124" rx="33" ry="41" fill="url(#faceF5)"/>
                <circle cx="75" cy="82" r="12" fill="var(--hair-color, #D2691E)"/>
                <circle cx="100" cy="72" r="16" fill="var(--hair-color, #D2691E)"/>
                <circle cx="125" cy="82" r="12" fill="var(--hair-color, #D2691E)"/>
                <circle cx="85" cy="100" r="10" fill="var(--hair-color, #D2691E)"/>
                <circle cx="115" cy="100" r="10" fill="var(--hair-color, #D2691E)"/>
                <ellipse cx="88" cy="119" rx="6" ry="5" fill="white"/>
                <ellipse cx="112" cy="119" rx="6" ry="5" fill="white"/>
                <circle cx="88" cy="119" r="3" fill="var(--eye-color, #FF8C00)"/>
                <circle cx="112" cy="119" r="3" fill="var(--eye-color, #FF8C00)"/>
                <circle cx="88" cy="119" r="1.5" fill="#000"/>
                <circle cx="112" cy="119" r="1.5" fill="#000"/>
                <path d="M82 113 Q88 111 94 113" stroke="var(--hair-color, #D2691E)" stroke-width="2" fill="none"/>
                <path d="M106 113 Q112 111 118 113" stroke="var(--hair-color, #D2691E)" stroke-width="2" fill="none"/>
                <ellipse cx="100" cy="127" rx="1.5" ry="3" fill="var(--skin-shadow, #D49A6A)" opacity="0.6"/>
                <path d="M90 139 Q100 145 110 139" stroke="#FF1493" stroke-width="3" fill="none"/>
                <rect x="86" y="165" width="28" height="35" rx="6" fill="#FF6347"/>
                <circle cx="92" cy="174" r="2.5" fill="#FFD700"/>
                <circle cx="108" cy="174" r="2.5" fill="#FFD700"/>
                <rect x="95" y="185" width="10" height="8" rx="2" fill="#32CD32"/>
            </svg>`
        }
    ]
};

// === PERSONALIZZAZIONI CSS ===
const AvatarCustomizations = {
    skinTones: [
        { name: 'Molto Chiara', main: '#FFE4C4', light: '#FFF8DC', shadow: '#F5DEB3' },
        { name: 'Chiara', main: '#F5DEB3', light: '#FFFACD', shadow: '#DEB887' },
        { name: 'Media Chiara', main: '#DEB887', light: '#F5DEB3', shadow: '#D2B48C' },
        { name: 'Media', main: '#D2B48C', light: '#DEB887', shadow: '#C8A882' },
        { name: 'Media Scura', main: '#C8A882', light: '#D2B48C', shadow: '#B07854' },
        { name: 'Scura', main: '#B07854', light: '#C8A882', shadow: '#8B5A3C' },
        { name: 'Molto Scura', main: '#8B5A3C', light: '#B07854', shadow: '#6D4426' }
    ],
    
    hairColors: [
        { name: 'Nero', color: '#2C1B18' },
        { name: 'Castano Scuro', color: '#4A2C17' },
        { name: 'Castano', color: '#654321' },
        { name: 'Castano Chiaro', color: '#8B4513' },
        { name: 'Biondo Scuro', color: '#B8860B' },
        { name: 'Biondo', color: '#DAA520' },
        { name: 'Biondo Chiaro', color: '#F4A460' },
        { name: 'Rosso', color: '#D2691E' },
        { name: 'Grigio', color: '#808080' },
        { name: 'Platino', color: '#E5E4E2' }
    ],
    
    eyeColors: [
        { name: 'Marroni Scuri', color: '#654321' },
        { name: 'Marroni', color: '#8B4513' },
        { name: 'Nocciola', color: '#CD853F' },
        { name: 'Verdi', color: '#228B22' },
        { name: 'Verde Chiaro', color: '#32CD32' },
        { name: 'Azzurri', color: '#4169E1' },
        { name: 'Blu Scuri', color: '#191970' },
        { name: 'Grigi', color: '#708090' },
        { name: 'Viola', color: '#800080' },
        { name: 'Ambra', color: '#FF8C00' }
    ]
};

// === MANAGER AVATAR PRECARICATI ===
class PreloadedAvatarManager {
    constructor(userId) {
        this.userId = userId;
        this.selectedAvatar = null;
        this.customizations = this.getDefaultCustomizations();
        this.mode = 'gallery';
        this.photoUrl = null;
        this.loadFromStorage();
        
        // Imposta avatar di default se non selezionato
        if (!this.selectedAvatar) {
            this.selectedAvatar = PreloadedAvatars.male[0];
        }
    }
    
    getDefaultCustomizations() {
        return {
            skinTone: AvatarCustomizations.skinTones[2], // Media Chiara
            hairColor: AvatarCustomizations.hairColors[2], // Castano
            eyeColor: AvatarCustomizations.eyeColors[1] // Marroni
        };
    }
    
    selectAvatar(avatarId) {
        const allAvatars = [...PreloadedAvatars.male, ...PreloadedAvatars.female];
        this.selectedAvatar = allAvatars.find(av => av.id === avatarId);
        this.saveToStorage();
        return this.selectedAvatar;
    }
    
    updateCustomization(property, value) {
        this.customizations[property] = value;
        this.saveToStorage();
        return this.customizations;
    }
    
    setMode(mode) {
        if (['gallery', 'photo'].includes(mode)) {
            this.mode = mode;
            this.saveToStorage();
            return true;
        }
        return false;
    }
    
    setPhoto(photoUrl) {
        this.photoUrl = photoUrl;
        this.mode = 'photo';
        this.saveToStorage();
    }
    
    getDisplayHTML() {
        if (this.mode === 'photo' && this.photoUrl) {
            return `<img src="${this.photoUrl}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" alt="Avatar Photo">`;
        } else if (this.selectedAvatar) {
            return this.getCustomizedAvatar();
        }
        return '<div style="font-size: 48px;">👤</div>';
    }
    
    getCustomizedAvatar() {
        if (!this.selectedAvatar) return '';
        
        const customizations = this.customizations;
        const styleVars = `
            --skin-main: ${customizations.skinTone.main};
            --skin-light: ${customizations.skinTone.light};
            --skin-shadow: ${customizations.skinTone.shadow};
            --hair-color: ${customizations.hairColor.color};
            --eye-color: ${customizations.eyeColor.color};
        `;
        
        return `<div style="${styleVars}">${this.selectedAvatar.svg}</div>`;
    }
    
    randomize() {
        // Seleziona avatar casuale
        const allAvatars = [...PreloadedAvatars.male, ...PreloadedAvatars.female];
        this.selectedAvatar = allAvatars[Math.floor(Math.random() * allAvatars.length)];
        
        // Personalizzazioni casuali
        this.customizations = {
            skinTone: AvatarCustomizations.skinTones[Math.floor(Math.random() * AvatarCustomizations.skinTones.length)],
            hairColor: AvatarCustomizations.hairColors[Math.floor(Math.random() * AvatarCustomizations.hairColors.length)],
            eyeColor: AvatarCustomizations.eyeColors[Math.floor(Math.random() * AvatarCustomizations.eyeColors.length)]
        };
        
        this.saveToStorage();
        return this.selectedAvatar;
    }
    
    saveToStorage() {
        try {
            const data = {
                selectedAvatar: this.selectedAvatar,
                customizations: this.customizations,
                mode: this.mode,
                photoUrl: this.photoUrl,
                timestamp: Date.now()
            };
            if (!window.avatarStorage) window.avatarStorage = {};
            window.avatarStorage[this.userId] = data;
            console.log('💾 Avatar precaricato salvato:', this.selectedAvatar?.name);
        } catch (e) {
            console.error('Errore salvataggio avatar:', e);
        }
    }
    
    loadFromStorage() {
        try {
            if (window.avatarStorage && window.avatarStorage[this.userId]) {
                const data = window.avatarStorage[this.userId];
                this.selectedAvatar = data.selectedAvatar || PreloadedAvatars.male[0];
                this.customizations = { ...this.getDefaultCustomizations(), ...data.customizations };
                this.mode = data.mode || 'gallery';
                this.photoUrl = data.photoUrl || null;
                console.log('📂 Avatar precaricato caricato:', this.selectedAvatar?.name);
            }
        } catch (e) {
            console.error('Errore caricamento avatar:', e);
        }
    }
}

// === UI AVATAR PRECARICATI ===
class PreloadedAvatarUI {
    constructor(containerId, manager) {
        this.container = document.getElementById(containerId);
        this.manager = manager;
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="preloaded-avatar-ui">
                <div class="mode-selector">
                    <button class="mode-btn ${this.manager.mode === 'gallery' ? 'active' : ''}" data-mode="gallery">
                        🎭 Scegli Avatar
                    </button>
                    <button class="mode-btn ${this.manager.mode === 'photo' ? 'active' : ''}" data-mode="photo">
                        📸 Foto Personale
                    </button>
                </div>
                
                <div class="avatar-preview">
                    <div class="preview-container" id="previewContainer">
                        ${this.manager.getDisplayHTML()}
                    </div>
                    <div class="avatar-info" id="avatarInfo">
                        ${this.manager.selectedAvatar ? `${this.manager.selectedAvatar.name}` : 'Seleziona un avatar'}
                    </div>
                </div>
                
                <div class="controls" id="controls">
                    ${this.manager.mode === 'gallery' ? this.buildGalleryControls() : this.buildPhotoControls()}
                </div>
                
                <div class="actions">
                    <button class="action-btn" onclick="window.avatarUI.randomize()">🎲 Avatar Casuale</button>
                    <button class="action-btn primary" onclick="window.avatarUI.save()">💾 Salva Avatar</button>
                </div>
            </div>
        `;
        
        this.attachEvents();
        this.injectStyles();
    }
    
    buildGalleryControls() {
        return `
            <div class="control-section">
                <!-- Avatar Selection -->
                <div class="control-group">
                    <label>👨 Avatar Maschili</label>
                    <div class="avatar-grid">
                        ${PreloadedAvatars.male.map(avatar => 
                            `<div class="avatar-option ${this.manager.selectedAvatar?.id === avatar.id ? 'active' : ''}" 
                                  data-avatar-id="${avatar.id}">
                                <div class="avatar-thumb">${avatar.svg}</div>
                                <div class="avatar-label">${avatar.name.split(' - ')[0]}</div>
                            </div>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="control-group">
                    <label>👩 Avatar Femminili</label>
                    <div class="avatar-grid">
                        ${PreloadedAvatars.female.map(avatar => 
                            `<div class="avatar-option ${this.manager.selectedAvatar?.id === avatar.id ? 'active' : ''}" 
                                  data-avatar-id="${avatar.id}">
                                <div class="avatar-thumb">${avatar.svg}</div>
                                <div class="avatar-label">${avatar.name.split(' - ')[0]}</div>
                            </div>`
                        ).join('')}
                    </div>
                </div>
                
                <!-- Customizations -->
                ${this.manager.selectedAvatar ? this.buildCustomizationControls() : ''}
            </div>
        `;
    }
    
    buildCustomizationControls() {
        return `
            <div class="customization-section">
                <div class="control-group">
                    <label>🎨 Personalizza Colori</label>
                    
                    <div class="customization-row">
                        <span class="custom-label">Tonalità Pelle:</span>
                        <div class="color-options">
                            ${AvatarCustomizations.skinTones.map((tone, index) => 
                                `<div class="color-option ${JSON.stringify(this.manager.customizations.skinTone) === JSON.stringify(tone) ? 'active' : ''}" 
                                      data-property="skinTone" data-index="${index}"
                                      style="background: linear-gradient(135deg, ${tone.light}, ${tone.main});" 
                                      title="${tone.name}"></div>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <div class="customization-row">
                        <span class="custom-label">Colore Capelli:</span>
                        <div class="color-options">
                            ${AvatarCustomizations.hairColors.map((hair, index) => 
                                `<div class="color-option ${JSON.stringify(this.manager.customizations.hairColor) === JSON.stringify(hair) ? 'active' : ''}" 
                                      data-property="hairColor" data-index="${index}"
                                      style="background: ${hair.color};" 
                                      title="${hair.name}"></div>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <div class="customization-row">
                        <span class="custom-label">Colore Occhi:</span>
                        <div class="color-options">
                            ${AvatarCustomizations.eyeColors.map((eye, index) => 
                                `<div class="color-option ${JSON.stringify(this.manager.customizations.eyeColor) === JSON.stringify(eye) ? 'active' : ''}" 
                                      data-property="eyeColor" data-index="${index}"
                                      style="background: radial-gradient(circle, ${eye.color}, ${this.darkenColor(eye.color, 30)});" 
                                      title="${eye.name}"></div>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    buildPhotoControls() {
        return `
            <div class="control-section">
                <div class="control-group">
                    <label>📸 Carica la Tua Foto</label>
                    <div class="photo-upload" onclick="document.getElementById('photoInput').click()">
                        <input type="file" id="photoInput" accept="image/*" style="display: none;">
                        <div class="upload-area">
                            <div class="upload-icon">📷</div>
                            <div class="upload-text">Clicca per caricare foto</div>
                            <div class="upload-hint">JPG, PNG o WEBP</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    attachEvents() {
        // Mode buttons
        this.container.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.target.dataset.mode;
                this.switchMode(mode);
            });
        });
        
        // Avatar selection
        this.container.querySelectorAll('.avatar-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const avatarId = e.currentTarget.dataset.avatarId;
                this.selectAvatar(avatarId);
            });
        });
        
        // Color customization
        this.container.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const property = e.target.dataset.property;
                const index = parseInt(e.target.dataset.index);
                this.updateCustomization(property, index);
            });
        });
        
        // Photo upload
        const photoInput = this.container.querySelector('#photoInput');
        if (photoInput) {
            photoInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.manager.setPhoto(e.target.result);
                        this.updatePreview();
                        this.showNotification('📸 Foto caricata con successo!');
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }
    
    selectAvatar(avatarId) {
        this.manager.selectAvatar(avatarId);
        this.refreshControls();
        this.updatePreview();
        this.updateAvatarInfo();
    }
    
    updateCustomization(property, index) {
        let value;
        switch(property) {
            case 'skinTone':
                value = AvatarCustomizations.skinTones[index];
                break;
            case 'hairColor':
                value = AvatarCustomizations.hairColors[index];
                break;
            case 'eyeColor':
                value = AvatarCustomizations.eyeColors[index];
                break;
        }
        
        this.manager.updateCustomization(property, value);
        this.updatePreview();
        this.updateCustomizationDisplay();
    }
    
    switchMode(mode) {
        this.manager.setMode(mode);
        this.container.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        this.refreshControls();
        this.updatePreview();
    }
    
    refreshControls() {
        const controlsContainer = this.container.querySelector('#controls');
        controlsContainer.innerHTML = this.manager.mode === 'gallery' ? 
            this.buildGalleryControls() : this.buildPhotoControls();
        this.attachEvents();
    }
    
    updatePreview() {
        const preview = this.container.querySelector('#previewContainer');
        preview.innerHTML = this.manager.getDisplayHTML();
    }
    
    updateAvatarInfo() {
        const info = this.container.querySelector('#avatarInfo');
        if (info && this.manager.selectedAvatar) {
            info.textContent = this.manager.selectedAvatar.name;
        }
    }
    
    updateCustomizationDisplay() {
        this.container.querySelectorAll('.color-option').forEach(option => {
            const property = option.dataset.property;
            const index = parseInt(option.dataset.index);
            
            let isActive = false;
            switch(property) {
                case 'skinTone':
                    isActive = JSON.stringify(this.manager.customizations.skinTone) === JSON.stringify(AvatarCustomizations.skinTones[index]);
                    break;
                case 'hairColor':
                    isActive = JSON.stringify(this.manager.customizations.hairColor) === JSON.stringify(AvatarCustomizations.hairColors[index]);
                    break;
                case 'eyeColor':
                    isActive = JSON.stringify(this.manager.customizations.eyeColor) === JSON.stringify(AvatarCustomizations.eyeColors[index]);
                    break;
            }
            
            option.classList.toggle('active', isActive);
        });
    }
    
    randomize() {
        this.manager.randomize();
        this.refreshControls();
        this.updatePreview();
        this.updateAvatarInfo();
        this.showNotification('🎲 Avatar randomizzato!');
    }
    
    save() {
        this.manager.saveToStorage();
        this.showNotification('💾 Avatar salvato con successo!');
    }
    
    darkenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, (num >> 8 & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return "#" + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; background: #27AE60; color: white;
            padding: 15px 25px; border-radius: 10px; z-index: 10000; font-weight: 600;
            box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3); font-size: 14px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 2500);
    }
    
    injectStyles() {
        if (document.getElementById('preloaded-avatar-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'preloaded-avatar-styles';
        styles.textContent = `
            .preloaded-avatar-ui {
                max-width: 750px;
                margin: 0 auto;
                padding: 30px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 25px;
                box-shadow: 0 25px 80px rgba(0,0,0,0.3);
                color: white;
            }
            
            .mode-selector {
                display: flex;
                gap: 15px;
                margin-bottom: 25px;
                background: rgba(255,255,255,0.1);
                padding: 8px;
                border-radius: 15px;
                backdrop-filter: blur(10px);
            }
            
            .mode-btn {
                flex: 1;
                padding: 15px;
                border: none;
                background: transparent;
                color: white;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 700;
                font-size: 14px;
                transition: all 0.3s ease;
            }
            
            .mode-btn.active {
                background: rgba(255,255,255,0.2);
                box-shadow: 0 4px 15px rgba(255,255,255,0.1);
            }
            
            .avatar-preview {
                text-align: center;
                margin-bottom: 30px;
            }
            
            .preview-container {
                width: 160px;
                height: 160px;
                margin: 0 auto 15px;
                border: 4px solid rgba(255,255,255,0.3);
                border-radius: 50%;
                overflow: hidden;
                background: white;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 15px 40px rgba(0,0,0,0.2);
                transition: transform 0.3s ease;
            }
            
            .preview-container:hover {
                transform: scale(1.05);
            }
            
            .avatar-info {
                color: white;
                font-size: 16px;
                font-weight: 600;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
            }
            
            .control-section {
                background: rgba(255,255,255,0.1);
                border-radius: 20px;
                padding: 25px;
                margin-bottom: 25px;
                backdrop-filter: blur(10px);
                max-height: 500px;
                overflow-y: auto;
            }
            
            .control-group {
                margin-bottom: 25px;
            }
            
            .control-group:last-child {
                margin-bottom: 0;
            }
            
            .control-group label {
                display: block;
                font-weight: 800;
                margin-bottom: 15px;
                color: white;
                font-size: 16px;
            }
            
            .avatar-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
                gap: 15px;
            }
            
            .avatar-option {
                text-align: center;
                cursor: pointer;
                padding: 12px;
                border-radius: 15px;
                border: 2px solid rgba(255,255,255,0.2);
                background: rgba(255,255,255,0.05);
                transition: all 0.3s ease;
            }
            
            .avatar-option:hover {
                background: rgba(255,255,255,0.15);
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            }
            
            .avatar-option.active {
                border-color: #F39C12;
                background: rgba(243, 156, 18, 0.2);
                box-shadow: 0 6px 20px rgba(243, 156, 18, 0.4);
            }
            
            .avatar-thumb {
                width: 70px;
                height: 70px;
                margin: 0 auto 8px;
                border-radius: 50%;
                overflow: hidden;
                background: white;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .avatar-thumb svg {
                width: 100%;
                height: 100%;
            }
            
            .avatar-label {
                font-size: 11px;
                font-weight: 600;
                color: white;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
            }
            
            .customization-section {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid rgba(255,255,255,0.2);
            }
            
            .customization-row {
                margin-bottom: 20px;
                padding: 15px;
                background: rgba(255,255,255,0.1);
                border-radius: 12px;
            }
            
            .custom-label {
                display: block;
                font-weight: 600;
                margin-bottom: 12px;
                color: white;
                font-size: 14px;
            }
            
            .color-options {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(35px, 1fr));
                gap: 8px;
                max-width: 400px;
            }
            
            .color-option {
                width: 35px;
                height: 35px;
                border-radius: 8px;
                cursor: pointer;
                border: 2px solid rgba(255,255,255,0.3);
                transition: all 0.3s ease;
                position: relative;
            }
            
            .color-option:hover {
                transform: scale(1.1);
                border-color: rgba(255,255,255,0.7);
            }
            
            .color-option.active {
                border-color: #F39C12;
                transform: scale(1.15);
                box-shadow: 0 4px 15px rgba(243, 156, 18, 0.5);
            }
            
            .color-option.active::after {
                content: '✓';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                font-weight: bold;
                font-size: 14px;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
            }
            
            .photo-upload {
                border: 3px dashed rgba(255,255,255,0.4);
                border-radius: 15px;
                padding: 30px 20px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                background: rgba(255,255,255,0.05);
            }
            
            .photo-upload:hover {
                border-color: rgba(255,255,255,0.7);
                background: rgba(255,255,255,0.1);
                transform: translateY(-2px);
            }
            
            .upload-icon {
                font-size: 40px;
                margin-bottom: 15px;
            }
            
            .upload-text {
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 8px;
            }
            
            .upload-hint {
                font-size: 12px;
                opacity: 0.8;
            }
            
            .actions {
                display: flex;
                gap: 15px;
            }
            
            .action-btn {
                flex: 1;
                padding: 18px;
                border: 2px solid rgba(255,255,255,0.3);
                background: rgba(255,255,255,0.1);
                color: white;
                border-radius: 12px;
                cursor: pointer;
                font-weight: 700;
                font-size: 14px;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
            }
            
            .action-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(255,255,255,0.1);
                background: rgba(255,255,255,0.2);
            }
            
            .action-btn.primary {
                background: linear-gradient(135deg, #F39C12, #E67E22);
                border-color: #F39C12;
                box-shadow: 0 6px 20px rgba(243, 156, 18, 0.3);
            }
            
            .action-btn.primary:hover {
                box-shadow: 0 10px 30px rgba(243, 156, 18, 0.4);
                transform: translateY(-3px);
            }
            
            @media (max-width: 650px) {
                .preloaded-avatar-ui {
                    padding: 20px;
                    margin: 10px;
                }
                
                .avatar-grid {
                    grid-template-columns: repeat(3, 1fr);
                }
                
                .preview-container {
                    width: 140px;
                    height: 140px;
                }
                
                .color-options {
                    grid-template-columns: repeat(5, 1fr);
                }
                
                .actions {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(styles);
    }
}

// === SISTEMA PRINCIPALE ===
class RealisticAvatarSystem {
    static init(userId) {
        console.log('🎭 Sistema Avatar Precaricati inizializzato per:', userId);
        const manager = new PreloadedAvatarManager(userId);
        return manager;
    }
    
    static createUI(containerId, manager) {
        console.log('🎨 Creazione UI Avatar Precaricati per container:', containerId);
        const ui = new PreloadedAvatarUI(containerId, manager);
        // Store reference globally for button actions
        window.avatarUI = ui;
        return ui;
    }
}

// === ESPOSIZIONE GLOBALE ===
window.RealisticAvatarSystem = RealisticAvatarSystem;
window.PreloadedAvatarManager = PreloadedAvatarManager;
window.PreloadedAvatarUI = PreloadedAvatarUI;

console.log('✅ Sistema Avatar Precaricati caricato - 10 AVATAR BELLISSIMI + PERSONALIZZAZIONE!'); 