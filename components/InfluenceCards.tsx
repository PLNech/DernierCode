"use client";
import React, { useState, useEffect } from 'react';

// CSS for News Reel animation
const newsReelStyles = `
  @keyframes marquee {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }
  
  .news-ticker {
    overflow: hidden;
    white-space: nowrap;
    position: relative;
  }
  
  .news-ticker-content {
    display: inline-block;
    padding-left: 100%;
    animation: marquee 30s linear infinite;
    will-change: transform;
  }
`;

// Define TypeScript types
const TRAITS = ['politics', 'media', 'control', 'trust', 'diplomacy'];
type TraitKey = 'politics' | 'media' | 'control' | 'trust' | 'diplomacy';

interface CountryTrait {
    name: string;
    shortcode: string;
    value: number;
    color: string;
}

interface NewsEntry {
    id: string;
    text: string;
}

interface Country {
    id: string;
    name: string;
    traits: Record<TraitKey, number>;
    controlled: boolean;
    influenceLevel: number;
}

interface PolicyCard {
    id: string;
    name: string;
    description: string;
    bonusTrait: TraitKey;
    bonusValue: number;
    malusTrait: TraitKey;
    malusValue: number;
    style: string; // CSS class for card styling
    news: NewsEntry[]; // Array of news entries related to this policy
}

// Sample country data
const initialCountry = {
    id: 'france',
    name: 'France',
    traits: {
        politics: 45,
        media: 50,
        control: 35,
        trust: 60,
        diplomacy: 70
    },
    controlled: false,
    influenceLevel: 0
};

// Sample policy cards with news entries
const POLICY_CARDS = [
    {
        id: 'social-media-campaign',
        name: 'Social Media Campaign',
        description: 'Launch targeted social media ads to shift public opinion.',
        bonusTrait: 'media',
        bonusValue: 8,
        malusTrait: 'trust',
        malusValue: 3,
        style: 'bg-blue-900 border-blue-600',
        news: [
            { id: 'sm-1', text: 'Local grandmother accidentally becomes influencer after AI-generated selfies go viral. Government officials *deny involvement*.' },
            { id: 'sm-2', text: 'Trending hashtag #TotallyNotPropaganda somehow appears on every third social media post. *Strange coincidence*, say officials.' },
            { id: 'sm-3', text: 'New study shows 87% of citizens believe statistics they read online. Survey conducted via *pop-up ads*.' }
        ]
    },
    {
        id: 'diplomatic-outreach',
        name: 'Diplomatic Outreach',
        description: 'Establish connections with key foreign officials.',
        bonusTrait: 'diplomacy',
        bonusValue: 10,
        malusTrait: 'politics',
        malusValue: 4,
        style: 'bg-green-900 border-green-600',
        news: [
            { id: 'do-1', text: 'Foreign dignitaries receive gift baskets containing suspicious-looking USB drives labeled *Definitely Not Malware*.' },
            { id: 'do-2', text: 'Cultural exchange program finds unprecedented success. Ambassadors now fluent in saying *Yes* in 27 languages.' },
            { id: 'do-3', text: 'International peace summit descends into chaos when delegation asks for bathroom directions and *accidentally annexes* small province.' }
        ]
    },
    {
        id: 'political-lobbying',
        name: 'Political Lobbying',
        description: 'Fund lobbyists to influence policy decisions.',
        bonusTrait: 'politics',
        bonusValue: 12,
        malusTrait: 'diplomacy',
        malusValue: 5,
        style: 'bg-purple-900 border-purple-600',
        news: [
            { id: 'pl-1', text: '"Local politician changes stance for 18th time this week. \'I just keep having very convenient epiphanies,\' he explains."' },
            { id: 'pl-2', text: '"Parliamentary session extends past midnight as debate rages over whether bribes should be tax-deductible."' },
            { id: 'pl-3', text: '"New political consultancy firm opens downtown. Office suspiciously filled with unmarked briefcases and winking employees."' }
        ]
    },
    {
        id: 'media-acquisition',
        name: 'Media Acquisition',
        description: 'Purchase controlling interest in local media outlets.',
        bonusTrait: 'media',
        bonusValue: 15,
        malusTrait: 'trust',
        malusValue: 7,
        style: 'bg-red-900 border-red-600',
        news: [
            { id: 'ma-1', text: '"Formerly critical newspaper now running daily column titled \'Ten Reasons Our New Owner Is Definitely Not Evil\'."' },
            { id: 'ma-2', text: '"Multiple news anchors simultaneously develop identical opinions. Experts blame \'journalistic telepathy\'."' },
            { id: 'ma-3', text: '"Local TV station cancels investigative journalism program, replaces it with \'Happy Fun Government Time Hour\'."' },
            { id: 'ma-4', text: '"Media conglomerate announces all bad news will now be reported exclusively in interpretive dance."' }
        ]
    },
    {
        id: 'grassroots-movement',
        name: 'Grassroots Movement',
        description: 'Organize local communities to support your cause.',
        bonusTrait: 'trust',
        bonusValue: 9,
        malusTrait: 'control',
        malusValue: 4,
        style: 'bg-amber-900 border-amber-600',
        news: [
            { id: 'gm-1', text: '"Suspiciously well-funded \'grassroots\' movement appears overnight. Protesters carry professionally printed signs and catered lunches."' },
            { id: 'gm-2', text: '"Local community organizer confused why volunteers keep referring to their \'handler\'. Assumes it\'s new slang."' },
            { id: 'gm-3', text: '"Neighborhood action committee surprisingly unified after mysterious tea party. \'We all just suddenly agreed,\' says dazed resident."' }
        ]
    },
    {
        id: 'surveillance-expansion',
        name: 'Surveillance Expansion',
        description: 'Deploy advanced monitoring systems in public areas.',
        bonusTrait: 'control',
        bonusValue: 14,
        malusTrait: 'trust',
        malusValue: 8,
        style: 'bg-slate-900 border-slate-600',
        news: [
            { id: 'se-1', text: '"New street lamps installed citywide. Officials deny they\'re watching you, but they do blink occasionally."' },
            { id: 'se-2', text: '"Government introduces \'Friendly Neighborhood Observation Drones\'. Citizens report feeling both safer and more paranoid."' },
            { id: 'se-3', text: '"Man receives personalized birthday card from surveillance department. \'We\'ve been watching your progress with great interest.\'"' },
            { id: 'se-4', text: '"Traffic cameras now equipped with mood-sensing technology. Frowning while driving now carries small fine."' }
        ]
    },
    {
        id: 'economic-incentives',
        name: 'Economic Incentives',
        description: 'Offer financial benefits to strategic industries.',
        bonusTrait: 'politics',
        bonusValue: 11,
        malusTrait: 'diplomacy',
        malusValue: 6,
        style: 'bg-emerald-900 border-emerald-600',
        news: [
            { id: 'ei-1', text: '"Government subsidizes questionable industry. \'No, we don\'t know what they actually produce either,\' admits minister."' },
            { id: 'ei-2', text: '"New tax break for companies that end meetings with enthusiastic chanting of national anthem."' },
            { id: 'ei-3', text: '"Economic stimulus package includes funding for mysterious \'Influence Amplification Research\'. Details classified."' }
        ]
    },
    {
        id: 'public-relations',
        name: 'Public Relations Campaign',
        description: 'Improve your public image through strategic communications.',
        bonusTrait: 'trust',
        bonusValue: 7,
        malusTrait: 'control',
        malusValue: 3,
        style: 'bg-cyan-900 border-cyan-600',
        news: [
            { id: 'pr-1', text: '"Government launches \'We\'re Definitely Not Evil\' campaign to mixed reviews."' },
            { id: 'pr-2', text: '"Official mascot \'Trusting Trevor\' introduced to promote government initiatives. Children find his unblinking gaze unsettling."' },
            { id: 'pr-3', text: '"PR firm hired to improve image resigns after spokesperson accidentally says \'the truth\' instead of \'our carefully crafted narrative\'."' },
            { id: 'pr-4', text: '"Free ice cream distributed at government buildings. Recipients report strange urge to update voter registration."' }
        ]
    },
    {
        id: 'foreign-policy-shift',
        name: 'Foreign Policy Shift',
        description: 'Realign the country\'s international alliances.',
        bonusTrait: 'diplomacy',
        bonusValue: 13,
        malusTrait: 'politics',
        malusValue: 7,
        style: 'bg-teal-900 border-teal-600',
        news: [
            { id: 'fp-1', text: '"Nation now allies with former enemies and enemies with former allies. Foreign minister seen practicing saying \'It\'s complicated\' in mirror."' },
            { id: 'fp-2', text: '"Diplomatic cables reveal new strategy of agreeing with everyone simultaneously. \'Quantum diplomacy,\' explains baffled ambassador."' },
            { id: 'fp-3', text: '"International borders redrawn after heated game of Risk at UN summit. \'We thought they were joking,\' laments defeated nation."' }
        ]
    },
    {
        id: 'information-control',
        name: 'Information Control',
        description: 'Filter news and information reaching the public.',
        bonusTrait: 'control',
        bonusValue: 16,
        malusTrait: 'media',
        malusValue: 9,
        style: 'bg-indigo-900 border-indigo-600',
        news: [
            { id: 'ic-1', text: '"Dictionary updated overnight. Words \'protest\', \'dissent\', and \'questioning\' mysteriously absent from new edition."' },
            { id: 'ic-2', text: '"Internet experiences selective outages. Sites about democracy work fine, but show cute cat videos instead of content."' },
            { id: 'ic-3', text: '"Ministry of Truth announces \'Facts of the Day\' will now be delivered directly to citizens\' dreams for maximum efficiency."' },
            { id: 'ic-4', text: '"Library books found with certain paragraphs neatly exacto-knifed out. \'Reading between the lines is overrated anyway,\' says official."' },
            { id: 'ic-5', text: '"New \'reality adjustment specialists\' hired to ensure public perception aligns with preferred government narrative."' }
        ]
    }
];

// Trait color mapping and display config
const TRAITS_CONFIG = {
    politics: { name: 'Politics', shortcode: 'P', value: 0, color: 'text-purple-400' },
    media: { name: 'Media', shortcode: 'M', value: 0, color: 'text-blue-400' },
    control: { name: 'Population Control', shortcode: 'C', value: 0, color: 'text-red-400' },
    trust: { name: 'Public Trust', shortcode: 'T', value: 0, color: 'text-green-400' },
    diplomacy: { name: 'Diplomacy', shortcode: 'D', value: 0, color: 'text-yellow-400' }
};

const UPGRADES = [
    {
        id: 'draw-more',
        name: 'Draw More Cards',
        description: 'Increase the number of policy cards drawn each round, giving you more strategic options.',
        level: 0,
        maxLevel: 5,
        cost: (level) => 10 * (level + 1), // 10, 20, 30, 40, 50
        effect: 'Draw +1 policy card each round'
    }
];  // News ticker effect


const CountryInfluenceGame = () => {
    // Game state
    const [country, setCountry] = useState(initialCountry);
    const [cardCount, setCardCount] = useState(2);
    const [upgrades, setUpgrades] = useState([]);
    const [activeCards, setActiveCards] = useState([]);
    const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0);
    const [timeRemaining, setTimeRemaining] = useState(10);
    const [isPaused, setIsPaused] = useState(false);
    const [influenceEvents, setInfluenceEvents] = useState([]);
    const [round, setRound] = useState(1);
    const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
    const [newsReel, setNewsReel] = useState([
        { id: 'default-1', text: '"Breaking news: Citizens increasingly susceptible to colorful cards and progress bars."' },
        { id: 'default-2', text: '"Opinion poll shows 73% of population would willingly accept new overlords if they promised better weather."' }
    ]);

    // UI
    const [showUpgradesModal, setShowUpgradesModal] = useState(false);

    // Draw random cards
    const drawCards = () => {
        const shuffled = [...POLICY_CARDS].sort(() => 0.5 - Math.random());
        setActiveCards(shuffled.slice(0, cardCount));
        // Randomly pre-select one card (1/N% chance for each)
        setSelectedCardIndex(Math.random() < (1/cardCount) ? 0 : 1);
        setTimeRemaining(10);
    };

    const purchaseUpgrade = (upgradeId) => {
        setUpgrades(prevUpgrades => {
            return prevUpgrades.map(upgrade => {
                if (upgrade.id === upgradeId) {
                    // Check if already at max level
                    if (upgrade.level >= upgrade.maxLevel) {
                        return upgrade;
                    }

                    // Calculate cost
                    const nextLevel = upgrade.level + 1;
                    const costPerTrait = upgrade.cost(upgrade.level);

                    // Check if country has enough in all traits
                    for (const trait of TRAITS) {
                        if (country.traits[trait] < costPerTrait) {
                            // Add to log that player can't afford
                            setInfluenceEvents(prev => [
                                `Not enough ${TRAITS_CONFIG[trait].name} to purchase ${upgrade.name} Level ${nextLevel}`,
                                ...prev
                            ]);
                            return upgrade;
                        }
                    }

                    // Deduct cost from all traits
                    const newTraits = { ...country.traits };
                    for (const trait of TRAITS) {
                        newTraits[trait] -= costPerTrait;
                    }

                    // Update country traits
                    setCountry(prev => ({
                        ...prev,
                        traits: newTraits
                    }));

                    // Add to log
                    setInfluenceEvents(prev => [
                        `Purchased ${upgrade.name} Level ${nextLevel}`,
                        ...prev
                    ]);

                    // Return updated upgrade
                    return {
                        ...upgrade,
                        level: nextLevel
                    };
                }
                return upgrade;
            });
        });
    };// Available upgrades


    // Apply policy effect to country
    const applyPolicy = (card) => {
        setCountry(prevCountry => {
            const newTraits = { ...prevCountry.traits };

            // Apply bonus
            newTraits[card.bonusTrait] = Math.min(100, newTraits[card.bonusTrait] + card.bonusValue);

            // Apply malus
            newTraits[card.malusTrait] = Math.max(0, newTraits[card.malusTrait] - card.malusValue);

            // Calculate new influence level
            const avgTraitValue = Object.values(newTraits).reduce((sum, val) => sum + val, 0) / 5;
            const newInfluenceLevel = Math.min(100, avgTraitValue * 1.2);

            // Check if country is now controlled
            const newControlled = newTraits.politics > 70 && newTraits.control > 60;

            return {
                ...prevCountry,
                traits: newTraits,
                influenceLevel: newInfluenceLevel,
                controlled: newControlled || prevCountry.controlled
            };
        });

        // Add policy news to the news reel
        if (card.news && card.news.length > 0) {
            // Add 1-3 random news items from this policy's news array
            const shuffledNews = [...card.news].sort(() => 0.5 - Math.random());
            const newsToAdd = shuffledNews.slice(0, Math.min(shuffledNews.length, Math.floor(Math.random() * 3) + 1));
            setNewsReel(prev => [...newsToAdd, ...prev].slice(0, 10)); // Keep only last 10 news items
        }

        // Add to influence events log
        setInfluenceEvents(prev => [
            `Round ${round}: Applied "${card.name}" (${card.bonusTrait} +${card.bonusValue}, ${card.malusTrait} -${card.malusValue})`,
            ...prev.slice(0, 9) // Keep only last 10 events
        ]);

        setRound(prev => prev + 1);

        // Pause briefly to show result
        setIsPaused(true);
        setTimeout(() => {
            setIsPaused(false);
            drawCards();
        }, 1500);
    };

    // Initialize game
    useEffect(() => {
        drawCards();
    }, []);

    // News ticker effect
    useEffect(() => {
        if (newsReel.length === 0) return;

        const newsInterval = setInterval(() => {
            setCurrentNewsIndex(prev => (prev + 1) % newsReel.length);
        }, 7000); // Change news item every 7 seconds

        return () => clearInterval(newsInterval);
    }, [newsReel]);

    // Countdown timer
    useEffect(() => {
        if (isPaused) return;

        if (timeRemaining <= 0) {
            // Time's up - apply the pre-selected card
            if (selectedCardIndex !== null && activeCards.length > 0) {
                applyPolicy(activeCards[selectedCardIndex]);
            }
            return;
        }

        const timer = setTimeout(() => {
            setTimeRemaining(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeRemaining, selectedCardIndex, activeCards, isPaused]);

    // Toggle card selection
    const toggleCardSelection = () => {
        if (selectedCardIndex !== null && activeCards.length > 0) {
            // Toggle between 0 and 1
            setSelectedCardIndex(selectedCardIndex === 0 ? 1 : 0);
        }
    };

    const toggleUpgrades = () => {
        setShowUpgradesModal(!showUpgradesModal);
        console.log(`Upgrades now ${showUpgradesModal? 'active' : 'inactive'}`);
    }
    // Handle card click
    const handleCardClick = (index) => {
        setSelectedCardIndex(index);
    };

    // Manually apply policy (player clicked)
    const confirmSelection = () => {
        if (selectedCardIndex !== null && activeCards.length > 0) {
            applyPolicy(activeCards[selectedCardIndex]);
        }
    };


    // Render the star chart for country traits
    const renderStarChart = () => {
        const centerX = 100;
        const centerY = 100;
        const radius = 80;
        const traits = country.traits;
        const traitKeys = Object.keys(traits);

        // Calculate points for each trait
        const points = traitKeys.map((trait, index) => {
            const angle = (index / traitKeys.length) * 2 * Math.PI - Math.PI / 2;
            const value = traits[trait] / 100;
            return {
                x: centerX + radius * value * Math.cos(angle),
                y: centerY + radius * value * Math.sin(angle),
                trait,
                value: traits[trait]
            };
        });

        // Create the polygon points string
        const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');

        // Get trait colors for styling
        const traitColors = {
            politics: { light: '#a78bfa', dark: '#5b21b6', bg: '#4c1d95' },
            media: { light: '#60a5fa', dark: '#2563eb', bg: '#1e40af' },
            control: { light: '#f87171', dark: '#dc2626', bg: '#991b1b' },
            trust: { light: '#34d399', dark: '#059669', bg: '#065f46' },
            diplomacy: { light: '#fcd34d', dark: '#d97706', bg: '#92400e' }
        };

        return (
            <div className="relative w-full">
                <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
                    {/* Background circles */}
                    <circle cx={centerX} cy={centerY} r={radius * 0.25} fill="none" stroke="#1e293b" strokeWidth="1" />
                    <circle cx={centerX} cy={centerY} r={radius * 0.5} fill="none" stroke="#1e293b" strokeWidth="1" />
                    <circle cx={centerX} cy={centerY} r={radius * 0.75} fill="none" stroke="#1e293b" strokeWidth="1" />
                    <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#1e293b" strokeWidth="1" />

                    {/* Axis lines */}
                    {traitKeys.map((trait, index) => {
                        const angle = (index / traitKeys.length) * 2 * Math.PI - Math.PI / 2;
                        return (
                            <line
                                key={`axis-${trait}`}
                                x1={centerX}
                                y1={centerY}
                                x2={centerX + radius * Math.cos(angle)}
                                y2={centerY + radius * Math.sin(angle)}
                                stroke="#1e293b"
                                strokeWidth="1"
                            />
                        );
                    })}

                    {/* Trait polygon */}
                    <polygon
                        points={polygonPoints}
                        fill="rgba(99, 102, 241, 0.3)"
                        stroke="#6366f1"
                        strokeWidth="2"
                    />

                    {/* Trait points */}
                    {points.map((point) => (
                        <circle
                            key={`point-${point.trait}`}
                            cx={point.x}
                            cy={point.y}
                            r="4"
                            fill="#6366f1"
                        />
                    ))}

                    {/* Trait labels with card-like styling */}
                    {traitKeys.map((trait, index) => {
                        const angle = (index / traitKeys.length) * 2 * Math.PI - Math.PI / 2;
                        const labelX = centerX + (radius + 25) * Math.cos(angle);
                        const labelY = centerY + (radius + 25) * Math.sin(angle);
                        const colors = traitColors[trait];

                        return (
                            <g key={`label-${trait}`}>
                                {/* Label background card */}
                                <rect
                                    x={labelX - 20}
                                    y={labelY - 10}
                                    width="40"
                                    height="20"
                                    rx="4"
                                    ry="4"
                                    fill={colors.bg}
                                    stroke={colors.light}
                                    strokeWidth="2"
                                />

                                {/* Label text */}
                                <text
                                    x={labelX}
                                    y={labelY}
                                    textAnchor="middle"
                                    alignmentBaseline="central"
                                    fill="white"
                                    fontWeight="bold"
                                    fontSize="12"
                                >
                                    {TRAITS_CONFIG[trait].shortcode} ({country.traits[trait]})
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        );
    };

    return (
        <div className="w-full bg-gray-900 text-gray-200 flex flex-col rounded-lg border border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="p-3 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-cyan-400">{country.name} Influence Campaign</h2>
                    <div className="text-sm text-gray-400">Round {round}</div>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="flex flex-col items-end">
                        <span className="text-sm text-gray-400">Influence Level:</span>
                        <span className={`font-bold ${country.controlled ? 'text-green-400' : 'text-gray-300'}`}>
              {country.influenceLevel.toFixed(1)}%
            </span>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${
                        country.controlled ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'
                    }`}>
                        {country.controlled ? 'CONTROLLED' : 'TARGET'}
                    </div>
                </div>
            </div>

            {/* News Reel */}
            <style>{newsReelStyles}</style>
            <div className="bg-black text-yellow-400 border-b border-yellow-900 px-3 py-2 flex items-center">
                <div className="text-xs font-bold bg-yellow-600 text-black px-2 py-1 rounded mr-3 shrink-0">
                    BREAKING NEWS
                </div>
                <div className="news-ticker flex-1">
                    <div className="news-ticker-content" dangerouslySetInnerHTML={{
                        __html: newsReel.length > 0
                            ? newsReel[currentNewsIndex].text.replace(/\*([^*]+)\*/g, '<em class="text-white">$1</em>')
                            : ''
                    }} />
                </div>
            </div>

            <div className="flex flex-col md:flex-row">
                {/* Left panel - Country traits */}
                <div className="w-full md:w-1/3 p-4 bg-gray-850 border-r border-gray-800">
                    <h3 className="text-sm font-semibold text-gray-300 mb-3">Country Stats</h3>
                    {renderStarChart()}

                    <div className="mt-4 space-y-2">
                        {Object.entries(country.traits).map(([trait, value]) => (
                            <div key={trait} className="flex justify-between">
                <span className={`text-sm ${TRAITS_CONFIG[trait].color}`}>
                  {TRAITS_CONFIG[trait].name}
                </span>
                                <div className="w-32 flex items-center">
                                    <div className="w-full bg-gray-700 h-2 rounded-full">
                                        <div
                                            className={`h-2 rounded-full`}
                                            style={{
                                                width: `${value}%`,
                                                backgroundColor: trait === 'politics' ? '#a78bfa' :
                                                    trait === 'media' ? '#60a5fa' :
                                                        trait === 'control' ? '#f87171' :
                                                            trait === 'trust' ? '#34d399' :
                                                                '#fcd34d'
                                            }}
                                        ></div>
                                    </div>
                                    <span className="ml-2 text-sm">{value}</span>
                                </div>
                            </div>
                        ))}

                        <div className="pt-2 border-t border-gray-700 mt-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-300">Control Threshold:</span>
                                <span className="text-xs text-gray-400">Politics > 70, Control > 60</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right panel - Policy cards */}
                <div className="w-full md:w-2/3 p-4">
                    <div className="flex flex-col h-full">
                        {/* Timer bar */}
                        <div className="mb-3">
                            <div className="flex justify-between text-sm text-gray-400 mb-1">
                                <span>Next Policy in:</span>
                                <span>{timeRemaining}s</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-cyan-500 h-2 rounded-full transition-all duration-1000 ease-linear"
                                    style={{ width: `${(timeRemaining / 10) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Policy cards */}
                        <div className="flex flex-row justify-center items-center space-x-6 mb-4">
                            {activeCards.map((card, index) => (
                                <div
                                    key={card.id}
                                    className={`w-64 h-96 p-4 rounded-lg border-2 transition-all cursor-pointer flex flex-col
                    ${card.style} 
                    ${selectedCardIndex === index ? 'ring-2 ring-yellow-400 scale-105' : 'opacity-80 scale-100'}`}
                                    onClick={() => handleCardClick(index)}
                                    style={{ aspectRatio: '2/3' }}
                                >
                                    <div className="font-bold text-lg mb-2 text-center border-b border-gray-600 pb-2">{card.name}</div>

                                    <div className="flex-grow flex flex-col justify-between">
                                        <p className="text-sm text-gray-300 mb-4 italic">{card.description}</p>

                                        <div className="space-y-3 mb-4">
                                            <div className="flex justify-between items-center p-2 bg-black bg-opacity-30 rounded">
                        <span className={`text-sm ${TRAITS_CONFIG[card.bonusTrait].color}`}>
                          {TRAITS_CONFIG[card.bonusTrait].name}
                        </span>
                                                <span className="text-green-400 font-bold text-lg">+{card.bonusValue}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-black bg-opacity-30 rounded">
                        <span className={`text-sm ${TRAITS_CONFIG[card.malusTrait].color}`}>
                          {TRAITS_CONFIG[card.malusTrait].name}
                        </span>
                                                <span className="text-red-400 font-bold text-lg">-{card.malusValue}</span>
                                            </div>
                                        </div>

                                        {index === selectedCardIndex && activeCards[selectedCardIndex]?.id === card.id && !card.userSelected && (
                                            <div className="mb-2 py-2 text-center text-xs text-yellow-400 bg-yellow-900 bg-opacity-30 rounded animate-pulse">
                                                Auto-selected
                                            </div>
                                        )}

                                        {/* Card bottom decoration */}
                                        <div className="border-t border-gray-600 pt-2 text-xs text-gray-400 text-center">
                                            Policy #{card.id.substring(0, 4)}-{round}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Action buttons */}
                        <div className="flex justify-center gap-3 mb-4">
                            <button
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition"
                                onClick={toggleCardSelection}
                            >
                                Toggle Selection
                            </button>
                            <button
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white transition"
                                onClick={confirmSelection}
                            >
                                Confirm Policy
                            </button>
                            <button
                                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-md text-white transition"
                                onClick={toggleUpgrades}
                            >
                                Upgrades
                            </button>
                        </div>

                        {/* Event log */}
                        <div className="mt-auto">
                            <h3 className="text-sm font-semibold text-gray-300 mb-2">Influence Campaign Log</h3>
                            <div className="bg-gray-800 rounded-lg p-2 max-h-32 overflow-y-auto text-sm border border-gray-700">
                                {influenceEvents.length > 0 ? (
                                    <div className="space-y-1">
                                        {influenceEvents.map((event, i) => (
                                            <div key={i} className="text-xs text-gray-300 border-b border-gray-700 pb-1 last:border-0">
                                                {event}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-xs text-gray-500 italic">
                                        No events yet. Apply your first policy.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>      {/* Upgrades Modal */}
            {showUpgradesModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-cyan-400">Upgrades</h2>
                            <button
                                className="text-gray-400 hover:text-white"
                                onClick={() => setShowUpgradesModal(false)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                            <h3 className="text-sm font-bold text-gray-300 mb-2">Country Resources</h3>
                            <div className="grid grid-cols-5 gap-2">
                                {Object.entries(country.traits).map(([trait, value]) => (
                                    <div key={trait} className="text-center">
                                        <div className={`text-sm font-bold mb-1 ${TRAITS_CONFIG[trait].color}`}>
                                            {TRAITS_CONFIG[trait].shortcode}
                                        </div>
                                        <div className="text-lg font-bold">{value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {upgrades.map(upgrade => {
                                // Calculate cost for next level
                                const nextLevel = upgrade.level + 1;
                                const isMaxLevel = upgrade.level >= upgrade.maxLevel;
                                const costPerTrait = upgrade.cost(upgrade.level);
                                const canAfford = !isMaxLevel && Object.values(country.traits).every(v => v >= costPerTrait);
                                const bgColor = isMaxLevel ? 'bg-green-900' : (canAfford ? 'bg-blue-800' : 'bg-gray-700');

                                return (
                                    <div
                                        key={upgrade.id}
                                        className={`${bgColor} rounded-lg p-4 transition-colors duration-200`}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-bold text-lg">
                                                {upgrade.name} <span className="text-sm">Level {upgrade.level}/{upgrade.maxLevel}</span>
                                            </h3>
                                            {!isMaxLevel && (
                                                <div className="text-sm bg-gray-900 px-2 py-1 rounded">
                                                    Cost: {costPerTrait} each trait
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-sm text-gray-300 mb-3">{upgrade.description}</p>

                                        <div className="flex items-center justify-between">
                                            <div className="text-xs text-gray-400">
                                                {upgrade.effect} ({upgrade.level} → {nextLevel > upgrade.maxLevel ? upgrade.maxLevel : nextLevel})
                                            </div>

                                            <button
                                                className={`px-3 py-1 rounded text-sm ${
                                                    isMaxLevel
                                                        ? 'bg-green-700 text-green-200 cursor-not-allowed'
                                                        : canAfford
                                                            ? 'bg-blue-600 hover:bg-blue-500 text-white'
                                                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                }`}
                                                onClick={() => !isMaxLevel && canAfford && purchaseUpgrade(upgrade.id)}
                                                disabled={isMaxLevel || !canAfford}
                                            >
                                                {isMaxLevel ? 'Maxed Out' : 'Upgrade'}
                                            </button>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="mt-2 bg-gray-900 h-2 rounded-full">
                                            <div
                                                className="bg-cyan-600 h-2 rounded-full"
                                                style={{ width: `${(upgrade.level / upgrade.maxLevel) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CountryInfluenceGame;