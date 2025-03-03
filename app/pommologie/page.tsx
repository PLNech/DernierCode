"use client";
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
    ChevronDown,
    ChevronUp,
    HelpCircle,
    Moon,
    Sun,
    Zap,
    Award,
    Clock,
    Settings,
    Layers,
    BookOpen,
    AlertTriangle,
    Briefcase,
    Apple,
    BarChart,
    Droplet,
    Leaf,
    Factory,
    Key,
    Keyboard
} from 'lucide-react';


// Apple SVG component that changes with phases
const AppleSVG = ({phase}: {phase: number}) => {
    // Base apple
    if (phase === 1) {
        return (
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M50,15 C60,5 80,5 85,20 C90,35 85,50 50,90 C15,50 10,35 15,20 C20,5 40,5 50,15 Z"
                      fill="#d62414"/>
                <path d="M50,15 C55,5 65,5 70,15 C75,25 65,30 50,45 C35,30 25,25 30,15 C35,5 45,5 50,15 Z"
                      fill="#e74c3c"/>
                <path d="M52,5 L55,15 L48,15 Z" fill="#59a923"/>
            </svg>
        );
    }

    // Slightly glowing apple
    if (phase === 2) {
        return (
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="appleGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" style={{stopColor: "rgb(255, 100, 100)", stopOpacity: 0.6}}/>
                        <stop offset="100%" style={{stopColor: "rgb(255, 0, 0)", stopOpacity: 0}}/>
                    </radialGradient>
                </defs>
                <circle cx="50" cy="50" r="40" fill="url(#appleGlow)"/>
                <path d="M50,15 C60,5 80,5 85,20 C90,35 85,50 50,90 C15,50 10,35 15,20 C20,5 40,5 50,15 Z"
                      fill="#e62414"/>
                <path d="M50,15 C55,5 65,5 70,15 C75,25 65,30 50,45 C35,30 25,25 30,15 C35,5 45,5 50,15 Z"
                      fill="#e74c3c"/>
                <path d="M52,5 L55,15 L48,15 Z" fill="#59a923"/>
            </svg>
        );
    }

    // Mystical apple with symbols
    if (phase === 3) {
        return (
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="appleGlow3" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" style={{stopColor: "rgb(255, 100, 100)", stopOpacity: 0.8}}/>
                        <stop offset="100%" style={{stopColor: "rgb(255, 0, 0)", stopOpacity: 0}}/>
                    </radialGradient>
                </defs>
                <circle cx="50" cy="50" r="45" fill="url(#appleGlow3)"/>
                <path d="M50,15 C60,5 80,5 85,20 C90,35 85,50 50,90 C15,50 10,35 15,20 C20,5 40,5 50,15 Z"
                      fill="#ff3000"/>
                <path d="M50,15 C55,5 65,5 70,15 C75,25 65,30 50,45 C35,30 25,25 30,15 C35,5 45,5 50,15 Z"
                      fill="#ff4c3c"/>
                <path d="M52,5 L55,15 L48,15 Z" fill="#59a923"/>

                {/* Mystical runes */}
                <path d="M50,40 L45,50 L55,50 Z" fill="#ffcc00" opacity="0.7"/>
                <circle cx="50" cy="60" r="3" fill="#ffcc00" opacity="0.7"/>
                <path d="M40,50 L60,50" stroke="#ffcc00" strokeWidth="1" opacity="0.7"/>
            </svg>
        );
    }

    // Cosmic apple with eye
    if (phase === 4) {
        return (
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="appleGlow4" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
                        <stop offset="0%" style={{stopColor: "rgb(255, 50, 50)", stopOpacity: 1}}/>
                        <stop offset="100%" style={{stopColor: "rgb(150, 0, 0)", stopOpacity: 0}}/>
                    </radialGradient>
                </defs>
                <circle cx="50" cy="50" r="48" fill="url(#appleGlow4)"/>
                <path d="M50,15 C60,5 80,5 85,20 C90,35 85,50 50,90 C15,50 10,35 15,20 C20,5 40,5 50,15 Z"
                      fill="#ff1000">
                    <animate attributeName="fill" values="#ff1000;#ff4000;#ff1000" dur="3s" repeatCount="indefinite"/>
                </path>
                <path d="M50,15 C55,5 65,5 70,15 C75,25 65,30 50,45 C35,30 25,25 30,15 C35,5 45,5 50,15 Z"
                      fill="#ff3000"/>

                {/* The Eye */}
                <ellipse cx="50" cy="45" rx="15" ry="10" fill="#300"/>
                <ellipse cx="50" cy="45" rx="7" ry="7" fill="#600"/>
                <ellipse cx="50" cy="45" rx="3" ry="3" fill="#fff"/>

                {/* Cosmic Symbols */}
                <path d="M30,65 L70,65" stroke="#ffcc00" strokeWidth="1" opacity="0.8"/>
                <path d="M40,75 L60,75" stroke="#ffcc00" strokeWidth="1" opacity="0.8"/>
                <path d="M35,55 L65,55" stroke="#ffcc00" strokeWidth="1" opacity="0.8"/>
            </svg>
        );
    }

    // Transcendent apple (phase 5)
    return (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="appleGlow5" cx="50%" cy="50%" r="80%" fx="50%" fy="50%">
                    <stop offset="0%" style={{stopColor: "rgb(255, 0, 0)", stopOpacity: 1}}>
                        <animate attributeName="stop-color"
                                 values="rgb(255,0,0);rgb(255,150,0);rgb(255,0,150);rgb(255,0,0)" dur="10s"
                                 repeatCount="indefinite"/>
                    </stop>
                    <stop offset="100%" style={{stopColor: "rgb(100, 0, 0)", stopOpacity: 0.5}}/>
                </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="50" fill="url(#appleGlow5)"/>
            <path d="M50,15 C60,5 80,5 85,20 C90,35 85,50 50,90 C15,50 10,35 15,20 C20,5 40,5 50,15 Z" fill="#ff0000">
                <animate attributeName="fill" values="#ff0000;#ff6000;#ff0060;#ff0000" dur="5s"
                         repeatCount="indefinite"/>
            </path>

            {/* The All-Seeing Eye */}
            <ellipse cx="50" cy="40" rx="20" ry="15" fill="#600"/>
            <ellipse cx="50" cy="40" rx="10" ry="10" fill="#900"/>
            <ellipse cx="50" cy="40" rx="5" ry="5" fill="#fff">
                <animate attributeName="ry" values="5;2;5" dur="3s" repeatCount="indefinite"/>
            </ellipse>

            {/* Cosmic Rays */}
            <g stroke="#fff" strokeWidth="0.5" opacity="0.7">
                <path d="M50,10 L50,0">
                    <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2s" repeatCount="indefinite"/>
                </path>
                <path d="M70,15 L80,5">
                    <animate attributeName="opacity" values="0.7;0.3;0.7" dur="3s" repeatCount="indefinite"/>
                </path>
                <path d="M85,35 L95,30">
                    <animate attributeName="opacity" values="0.7;0.4;0.7" dur="2.5s" repeatCount="indefinite"/>
                </path>
                <path d="M80,60 L90,65">
                    <animate attributeName="opacity" values="0.7;0.2;0.7" dur="3.5s" repeatCount="indefinite"/>
                </path>
                <path d="M60,85 L65,95">
                    <animate attributeName="opacity" values="0.7;0.3;0.7" dur="4s" repeatCount="indefinite"/>
                </path>
                <path d="M30,85 L25,95">
                    <animate attributeName="opacity" values="0.7;0.4;0.7" dur="3s" repeatCount="indefinite"/>
                </path>
                <path d="M15,60 L5,65">
                    <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2.5s" repeatCount="indefinite"/>
                </path>
                <path d="M15,30 L5,25">
                    <animate attributeName="opacity" values="0.7;0.3;0.7" dur="3.5s" repeatCount="indefinite"/>
                </path>
                <path d="M30,15 L20,5">
                    <animate attributeName="opacity" values="0.7;0.4;0.7" dur="4s" repeatCount="indefinite"/>
                </path>
            </g>

            {/* POMMUM Text */}
            <text x="50" y="75" fontSize="8" textAnchor="middle" fill="#fff" fontFamily="Arial">POMMUM</text>
        </svg>
    );
};


// Base game component
 const Pommologie = () => {
    // Game state
    const [apples, setApples] = useState(0);
    const [totalApples, setTotalApples] = useState(0);
    const [applesPerClick, setApplesPerClick] = useState(1);
    const [applesPerSecond, setApplesPerSecond] = useState(0);
    const [phase, setPhase] = useState(1);
    const [darkMode, setDarkMode] = useState(true);
    const [showLore, setShowLore] = useState(false);
    const [lastMessage, setLastMessage] = useState("Bienvenue dans le monde merveilleux des pommes !");
    const [messages, setMessages] = useState<string[]>([]);
    const [showTooltip, setShowTooltip] = useState<string | null>(null);
    const [showAchievements, setShowAchievements] = useState(false);
    const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
    const [showResourceManager, setShowResourceManager] = useState(false);
    const [prestige, setPrestige] = useState({
        level: 0,
        multiplier: 1,
        essencePoints: 0,
        cost: 1000
    });

    // Resources system
    const [resources, setResources] = useState({
        seeds: 0,             // Pépins de pomme
        sap: 0,               // Sève de pommier
        essence: 0,           // Essence de pomme (différent des points d'essence du prestige)
        compost: 0,           // Compost
        applesauce: 0,        // Compote de pommes
        cider: 0,             // Cidre
        pie: 0                // Tarte aux pommes
    });

    // Resource production rates
    const [resourceRates, setResourceRates] = useState({
        seeds: 0,
        sap: 0,
        essence: 0,
        compost: 0
    });

    // Worker management
    const [workers, setWorkers] = useState({
        total: 0,
        available: 0,
        assigned: {
            picking: 0,
            processing: 0,
            crafting: 0,
            research: 0
        },
        efficiency: 1,
        cost: 50
    });

    // Define game constants
    const phaseThresholds = [100, 1000, 10000, 100000, 1000000];

    // Refs
    const appleRef = useRef<HTMLDivElement | null>(null);
    const messageTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Generators definition
    const [generators, setGenerators] = useState([
        {
            id: 'picker',
            name: 'Cueilleur',
            base: 0.1,
            current: 0.1,
            cost: 10,
            count: 0,
            description: 'Cueille des pommes pour vous.',
            lore: 'Un brave travailleur qui parcourt les vergers du matin au soir. Il rêve secrètement d\'un monde meilleur, fait de pommes.'
        },
        {
            id: 'tree',
            name: 'Pommier',
            base: 0.5,
            current: 0.5,
            cost: 50,
            count: 0,
            description: 'Produit naturellement des pommes.',
            unlockAt: 50,
            lore: 'Ces arbres ont été plantés par vos ancêtres il y a des générations. On raconte qu\'ils murmurent la nuit.'
        },
        {
            id: 'orchard',
            name: 'Verger',
            base: 2,
            current: 2,
            cost: 200,
            count: 0,
            description: 'Un groupe de pommiers productifs.',
            unlockAt: 200,
            lore: 'L\'union fait la force ! Ces vergers forment une communauté secrète qui s\'auto-organise quand personne ne regarde.'
        },
        {
            id: 'farm',
            name: 'Ferme',
            base: 10,
            current: 10,
            cost: 1000,
            count: 0,
            description: 'Une ferme entière dédiée aux pommes.',
            unlockAt: 500,
            lore: 'Des hectares et des hectares de terre fertile. Les fermiers murmurent que la terre est imprégnée d\'une étrange énergie rouge.'
        },
        {
            id: 'factory',
            name: 'Usine',
            base: 50,
            current: 50,
            cost: 5000,
            count: 0,
            description: 'Production industrielle de pommes.',
            unlockAt: 2000,
            lore: 'Certains disent avoir vu les machines fonctionner toutes seules la nuit. Le PDG nie toute implication dans des expériences interdites.'
        },
        {
            id: 'lab',
            name: 'Laboratoire',
            base: 200,
            current: 200,
            cost: 20000,
            count: 0,
            description: 'Recherche sur la pomme avancée.',
            unlockAt: 5000,
            lore: 'Les scientifiques ont découvert des propriétés quantiques dans le cœur des pommes. Plusieurs chercheurs ont disparu après avoir tenté de les goûter.'
        },
        {
            id: 'dimension',
            name: 'Dimension Pomme',
            base: 1000,
            current: 1000,
            cost: 100000,
            count: 0,
            description: 'Un univers parallèle de pommes.',
            unlockAt: 20000,
            lore: 'Une faille dans l\'espace-temps menant à un univers où tout est pomme. Y compris vous. Surtout vous.'
        },
        {
            id: 'deity',
            name: 'Divinité Pomme',
            base: 5000,
            current: 5000,
            cost: 500000,
            count: 0,
            description: 'Invocation d\'une entité cosmique pomme.',
            unlockAt: 100000,
            lore: 'POMMUM, L\'ANCIEN. Son nom ne doit être prononcé qu\'en présence de pommes mûres. Il vous observe depuis le début.'
        },
        {
            id: 'singularity',
            name: 'Singularité Pomme',
            base: 25000,
            current: 25000,
            cost: 2000000,
            count: 0,
            description: 'Un trou noir fait de purée de pommes.',
            unlockAt: 500000,
            lore: 'La densité pommoïdale a atteint un point critique. L\'univers entier commence à sentir la tarte aux pommes.'
        }
    ]);

    // Upgrades definition
    const [upgrades, setUpgrades] = useState([
        {
            id: 'better_gloves',
            name: 'Gants améliorés',
            cost: 50,
            purchased: false,
            description: 'Double la production par clic.',
            effect: () => {
                setApplesPerClick(prev => prev * 2);
                addMessage("Vos doigts se sentent plus agiles avec ces nouveaux gants !");
            },
            lore: 'Ces gants ont été tissés avec une fibre spéciale qui favorise la connexion avec l\'essence des pommes.'
        },
        {
            id: 'fertilizer',
            name: 'Engrais',
            cost: 200,
            purchased: false,
            description: 'Augmente la production des pommiers de 50%.',
            effect: () => updateGeneratorEfficiency('tree', 1.5),
            unlockAt: 100,
            lore: 'Un mélange spécial contenant des minéraux rares et... est-ce que c\'est du jus de pomme fermenté ?'
        },
        {
            id: 'irrigation',
            name: 'Système d\'irrigation',
            cost: 500,
            purchased: false,
            description: 'Augmente la production de tous les générateurs de 25%.',
            effect: () => updateAllGeneratorsEfficiency(1.25),
            unlockAt: 300,
            lore: 'L\'eau coule dans des canaux formant d\'étranges symboles vus du ciel. Une pure coïncidence, bien sûr.'
        },
        {
            id: 'genetic',
            name: 'Pommes génétiquement modifiées',
            cost: 2000,
            purchased: false,
            description: 'Triple la production par clic.',
            effect: () => {
                setApplesPerClick(prev => prev * 3);
                addMessage("Ces pommes semblent... vous observer ?");
            },
            unlockAt: 1000,
            lore: 'Ces pommes contiennent un code génétique modifié qui ressemble étrangement à un visage souriant.'
        },
        {
            id: 'robot',
            name: 'Robots cueilleurs',
            cost: 5000,
            purchased: false,
            description: 'Double la production des cueilleurs.',
            effect: () => updateGeneratorEfficiency('picker', 2),
            unlockAt: 2500,
            lore: 'Ces robots ont développé une conscience et forment désormais un syndicat pour de meilleures conditions de cueillette.'
        },
        {
            id: 'quantum',
            name: 'Pommes quantiques',
            cost: 15000,
            purchased: false,
            description: 'Les pommes existent simultanément dans plusieurs états, triplant la production totale.',
            effect: () => updateAllGeneratorsEfficiency(3),
            unlockAt: 7500,
            lore: 'Grâce à la superposition quantique, chaque pomme existe et n\'existe pas en même temps. Schrödinger aurait été fier. Ou pas.'
        },
        {
            id: 'reality',
            name: 'Distorsion de la réalité',
            cost: 50000,
            purchased: false,
            description: 'La réalité devient pomme. Multiplie la production par clic par 10.',
            effect: () => {
                setApplesPerClick(prev => prev * 10);
                addMessage("Le monde prend une teinte rouge inquiétante...");
            },
            unlockAt: 25000,
            lore: 'Les lois fondamentales de la physique ont été réécrites. La gravité est maintenant mesurée en chutes de pommes.'
        },
        {
            id: 'cosmic',
            name: 'Conscience cosmique de pomme',
            cost: 200000,
            purchased: false,
            description: 'Vous êtes devenu un avec les pommes. Multiplie toute la production par 5.',
            effect: () => {
                updateAllGeneratorsEfficiency(5);
                setApplesPerClick(prev => prev * 5);
                addMessage("NOUS SOMMES POMME. POMME EST NOUS.");
            },
            unlockAt: 100000,
            lore: 'Vous ne rêvez plus que de pommes. Vous parlez pomme. Vous respirez pomme. Vous êtes pomme.'
        },
        {
            id: 'ascension',
            name: 'Ascension Pommesque',
            cost: 1000000,
            purchased: false,
            description: 'Transcendez votre forme humaine pour devenir une entité de pure énergie pommoïdale.',
            effect: () => {
                updateAllGeneratorsEfficiency(10);
                setApplesPerClick(prev => prev * 20);
                addMessage("VOUS AVEZ TRANSCENDÉ L'HUMANITÉ ET ÊTE DEVENU POMME PURE.");
            },
            unlockAt: 500000,
            lore: 'Au début était la Pomme, et la Pomme était avec vous, et vous étiez la Pomme.'
        }
    ]);

    // Achievements definition
    const [achievements, setAchievements] = useState([
        {
            id: 'first_apple',
            name: 'Première Pomme',
            description: 'Vous avez récolté votre première pomme.',
            earned: false,
            threshold: 1,
            check: () => totalApples >= 1
        },
        {
            id: 'hundred_apples',
            name: 'Centaine',
            description: 'Vous avez récolté 100 pommes.',
            earned: false,
            threshold: 100,
            check: () => totalApples >= 100
        },
        {
            id: 'first_generator',
            name: 'Aide Extérieure',
            description: 'Vous avez acheté votre premier générateur.',
            earned: false,
            check: () => generators.some(g => g.count > 0)
        },
        {
            id: 'thousand_apples',
            name: 'Millénaire',
            description: 'Vous avez récolté 1000 pommes.',
            earned: false,
            threshold: 1000,
            check: () => totalApples >= 1000
        },
        {
            id: 'first_upgrade',
            name: 'Améliorations',
            description: 'Vous avez acheté votre première amélioration.',
            earned: false,
            check: () => upgrades.some(u => u.purchased)
        },
        {
            id: 'million_apples',
            name: 'Millionnaire',
            description: 'Vous avez récolté 1 million de pommes.',
            earned: false,
            threshold: 1000000,
            check: () => totalApples >= 1000000
        },
        {
            id: 'all_generators',
            name: 'Collection Complète',
            description: 'Vous avez acheté au moins un de chaque générateur.',
            earned: false,
            check: () => generators.every(g => g.count > 0)
        },
        {
            id: 'apple_god',
            name: 'Dieu des Pommes',
            description: 'Votre production dépasse 10,000 pommes par seconde.',
            earned: false,
            check: () => applesPerSecond >= 10000
        },
        {
            id: 'first_prestige',
            name: 'Renaissance',
            description: 'Vous avez effectué votre première prestigiation.',
            earned: false,
            check: () => prestige.level >= 1
        },
        // Achievements liés aux ressources
        {
            id: 'first_seed',
            name: 'Graine de Champion',
            description: 'Collectez votre premier pépin de pomme.',
            earned: false,
            check: () => resources.seeds >= 1
        },
        {
            id: 'first_worker',
            name: 'Manager',
            description: 'Embauchez votre premier travailleur.',
            earned: false,
            check: () => workers.total >= 1
        },
        {
            id: 'ten_workers',
            name: 'Entrepreneur',
            description: 'Employez 10 travailleurs.',
            earned: false,
            threshold: 10,
            check: () => workers.total >= 10
        },
        {
            id: 'first_craft',
            name: 'Artisan Pomme',
            description: 'Fabriquez votre premier produit.',
            earned: false,
            check: () => resources.applesauce >= 1 || resources.cider >= 1 || resources.pie >= 1
        },
        {
            id: 'resource_master',
            name: 'Maître des Ressources',
            description: 'Possédez au moins 100 unités de chaque ressource.',
            earned: false,
            check: () =>
                Object.entries(resources).every(([key, value]) => value >= 100)
        }
    ]);

    // Story and lore entries
    const loreEntries = [
        {
            phase: 1,
            title: "Les Débuts Modestes",
            content: "Vous commencez avec une simple pomme. Rien d'extraordinaire, juste un fruit rouge et ordinaire. Mais quelque chose en vous sait qu'il y a plus à découvrir..."
        },
        {
            phase: 2,
            title: "Les Murmures du Verger",
            content: "Tandis que votre collection grandit, vous commencez à entendre de faibles murmures parmi les pommiers. La nuit, vous rêvez de pommes qui dansent sous la lune."
        },
        {
            phase: 3,
            title: "La Communion Pommesque",
            content: "Les pommes semblent réagir à votre présence. Parfois, vous jurez les voir briller légèrement quand vous les touchez. La science ne peut l'expliquer."
        },
        {
            phase: 4,
            title: "L'Éveil Cosmique",
            content: "Vos recherches ont révélé une vérité terrifiante : les pommes sont connectées à une conscience cosmique ancienne. POMMUM, L'ANCIEN, commence à s'éveiller."
        },
        {
            phase: 5,
            title: "La Transcendance",
            content: "La barrière entre vous et les pommes s'estompe. Vous ne savez plus où finit votre corps et où commencent les pommes. L'univers entier n'est qu'une immense pomme cosmique, et vous en êtes le cœur."
        }
    ];

    // Helper functions
    const formatNumber = (num: number) => {
        if (num >= 1e12) return (num / 1e12).toFixed(2) + " T";
        if (num >= 1e9) return (num / 1e9).toFixed(2) + " G";
        if (num >= 1e6) return (num / 1e6).toFixed(2) + " M";
        if (num >= 1e3) return (num / 1e3).toFixed(2) + " K";
        return Math.floor(num);
    };

    const addMessage = (message: string) => {
        setLastMessage(message);
        setMessages(prev => [...prev.slice(-4), message] as string[]);

        if (messageTimeout.current) {
            clearTimeout(messageTimeout.current);
        }

        messageTimeout.current = setTimeout(() => {
            setLastMessage("Pommologie - Phase " + phase);
        }, 5000);
    };

    const clickApple = useCallback(() => {
        if (appleRef.current) {
            appleRef.current && (appleRef.current as HTMLElement).classList.add('scale-95');
            setTimeout(() => {
                if (appleRef.current) {
                    appleRef.current && (appleRef.current as HTMLElement).classList.remove('scale-95');
                }
            }, 100);
        }

        const gained = applesPerClick * prestige.multiplier;
        setApples(prev => prev + gained);
        setTotalApples(prev => prev + gained);

        // Add seeds (base resource) from clicks
        if (phase >= 2) {
            const seedGain = Math.max(1, Math.floor(gained * 0.05));
            setResources(prev => ({
                ...prev,
                seeds: prev.seeds + seedGain
            }));
        }

        // Small chance to get essence from clicking in later phases
        if (phase >= 3 && Math.random() < 0.01) {
            setResources(prev => ({
                ...prev,
                essence: prev.essence + 1
            }));
            addMessage("✨ Vous avez trouvé une goutte d'essence de pomme !");
        }

        // Random click messages
        if (Math.random() < 0.05) {
            const clickMessages = [
                "Cette pomme était juteuse !",
                "Pomme-tastic !",
                "Une pomme par jour...",
                "Croc !",
                "Les pommes vous aiment !",
                "La pomme vous observe.",
                "Pomme > Orange",
                "Délicieusement rouge !",
                "PLUS DE POMMES !",
                "Les pommes sont la clé de tout !"
            ];

            // Phase-specific messages
            if (phase >= 3) {
                clickMessages.push(
                    "Les pommes murmurent...",
                    "Vous sentez la présence de POMMUM.",
                    "Un frisson rouge parcourt votre échine.",
                    "Les pommes vous comprennent.",
                    "Devenez UN avec les pommes !"
                );
            }

            if (phase >= 5) {
                clickMessages.push(
                    "POMME EST TOUT. TOUT EST POMME.",
                    "L'UNIVERS POMME VOUS ACCUEILLE.",
                    "TRANSCENDANCE POMMESQUE IMMINENTE.",
                    "NOUS SOMMES UN DANS LA POMME.",
                    "LA CHAIR ROUGE EST ÉTERNELLE."
                );
            }

            addMessage(clickMessages[Math.floor(Math.random() * clickMessages.length)]);
        }
    }, [applesPerClick, prestige.multiplier, phase]);

    const buyGenerator = (id: string) => {
        setGenerators(prevGenerators =>
            prevGenerators.map(gen => {
                if (gen.id === id && apples >= gen.cost) {
                    const newCount = gen.count + 1;
                    const newCost = Math.floor(gen.cost * 1.15);

                    setApples(prev => prev - gen.cost);

                    // Show message for first purchase
                    if (gen.count === 0) {
                        addMessage(`Vous avez acquis votre premier(e) ${gen.name} !`);
                    }

                    return {...gen, count: newCount, cost: newCost};
                }
                return gen;
            })
        );
    };

    const buyUpgrade = (id: string) => {
        const upgrade = upgrades.find(u => u.id === id);
        if (upgrade && !upgrade.purchased && apples >= upgrade.cost) {
            setApples(prev => prev - upgrade.cost);

            // Execute the upgrade effect
            upgrade.effect();

            // Mark as purchased
            setUpgrades(prevUpgrades =>
                prevUpgrades.map(u =>
                    u.id === id ? {...u, purchased: true} : u
                )
            );

            addMessage(`Vous avez débloqué ${upgrade.name} !`);
        }
    };

    const updateGeneratorEfficiency = (id: string, multiplier: number) => {
        setGenerators(prevGenerators =>
            prevGenerators.map(gen => {
                if (gen.id === id) {
                    return {...gen, current: gen.current * multiplier};
                }
                return gen;
            })
        );
    };

    const updateAllGeneratorsEfficiency = (multiplier: number) => {
        setGenerators(prevGenerators =>
            prevGenerators.map(gen => ({
                ...gen,
                current: gen.current * multiplier
            }))
        );
    };

    const doPrestige = () => {
        if (totalApples >= prestige.cost) {
            const newEssence = Math.floor(Math.sqrt(totalApples / 1000));
            const newLevel = prestige.level + 1;
            const newMultiplier = 1 + (prestige.essencePoints + newEssence) * 0.1;

            // Reset game but keep prestige info
            setApples(0);
            setTotalApples(0);
            setApplesPerClick(1);
            setApplesPerSecond(0);
            setPhase(1);

            // Reset generators
            setGenerators(prevGenerators =>
                prevGenerators.map(gen => ({
                    ...gen,
                    count: 0,
                    cost: gen.id === 'picker' ? 10 : gen.cost,
                    current: gen.base
                }))
            );

            // Reset upgrades
            setUpgrades(prevUpgrades =>
                prevUpgrades.map(u => ({
                    ...u,
                    purchased: false
                }))
            );

            // Update prestige
            setPrestige({
                level: newLevel,
                essencePoints: prestige.essencePoints + newEssence,
                multiplier: newMultiplier,
                cost: prestige.cost * 5
            });

            addMessage(`🌟 PRESTIGIATION EFFECTUÉE ! Vous gagnez ${newEssence} points d'Essence de Pomme et un multiplicateur de x${newMultiplier.toFixed(1)}`);

            // Update achievement
            setAchievements(prev =>
                prev.map(a =>
                    a.id === 'first_prestige' ? {...a, earned: true} : a
                )
            );
        }
    };

    // Resource management functions
    const hireWorker = useCallback(() => {
        if (apples >= workers.cost) {
            setApples(prev => prev - workers.cost);
            setWorkers(prev => ({
                ...prev,
                total: prev.total + 1,
                available: prev.available + 1,
                cost: Math.floor(prev.cost * 1.2)
            }));
            addMessage("Vous avez embauché un nouveau travailleur !");
        }
    }, [apples, workers.cost]);

    const assignWorker = useCallback((area: keyof typeof workers.assigned) => {
        if (workers.available > 0) {
            setWorkers(prev => ({
                ...prev,
                available: prev.available - 1,
                assigned: {
                    ...prev.assigned,
                    [area]: prev.assigned[area] + 1
                }
            }));
        }
    }, [workers.available]);

    const unassignWorker = useCallback((area: keyof typeof workers.assigned) => {
        if (workers.assigned[area] > 0) {
            setWorkers(prev => ({
                ...prev,
                available: prev.available + 1,
                assigned: {
                    ...prev.assigned,
                    [area]: prev.assigned[area] - 1
                }
            }));
        }
    }, [workers.assigned]);
     const recipes: {
         [key: string]: {
             [key: string]: number;
         };
     } = {
         applesauce: {apples: 10, compost: 0},
         cider: {apples: 20, seeds: 5, compost: 1},
         pie: {apples: 50, compost: 5, applesauce: 2}
     };
     const craftResource = useCallback(
         (resource: keyof typeof recipes, amount = 1) => {

        if (!recipes[resource]) return;

        // Check if player has enough resources
        let canCraft = true;
        for (const [ingredient, requiredAmount] of Object.entries(recipes[resource])) {
            if (ingredient === 'apples' && apples < (requiredAmount as number) * amount) {
                canCraft = false;
                break;
            } else if (ingredient !== 'apples' && resources[ingredient as keyof typeof resources] < (requiredAmount as number) * amount) {
                canCraft = false;
                break;
            }
        }

        if (canCraft) {
            // Consume ingredients
            if (recipes[resource].apples) {
                setApples(prev => prev - recipes[resource].apples * amount);
            }

            setResources(prev => {
                const newResources = {...prev};

                // Consume other ingredients
                for (const [ingredient, requiredAmount] of Object.entries(recipes[resource])) {
                    if (ingredient !== 'apples') {
                        newResources[ingredient as keyof typeof resources] -= (requiredAmount as number) * amount;                    }
                }

                // Add crafted resource
                newResources[resource] += amount;

                return newResources;
            });

            addMessage(`Vous avez fabriqué ${amount} ${resource}!`);
        } else {
            addMessage("Pas assez de ressources pour fabriquer cet objet.");
        }
    }, [apples, resources]);

    // Game logic effects

    // Main game loop
    useEffect(() => {
        const gameLoop = setInterval(() => {
            // Calculate apple production
            let production = 0;
            generators.forEach(gen => {
                production += gen.current * gen.count;
            });

            // Apply prestige multiplier
            production *= prestige.multiplier;

            // Add worker production bonuses
            if (workers.assigned.picking > 0) {
                production += workers.assigned.picking * 0.5 * workers.efficiency;
            }

            // Update apples
            if (production > 0) {
                setApples(prev => prev + production / 10);
                setTotalApples(prev => prev + production / 10);
            }

            // Calculate resource production
            // Seeds from trees
            let seedProduction = 0;
            const treeGen = generators.find(g => g.id === 'tree');
            if (treeGen) {
                seedProduction = treeGen.count * 0.02;
            }

            // Sap from trees
            let sapProduction = 0;
            if (treeGen && phase >= 2) {
                sapProduction = treeGen.count * 0.01;
            }

            // Essence from labs
            let essenceProduction = 0;
            const labGen = generators.find(g => g.id === 'lab');
            if (labGen && phase >= 3) {
                essenceProduction = labGen.count * 0.001;
            }

            // Compost generated from worker assignments
            let compostProduction = 0;
            if (workers.assigned.processing > 0) {
                compostProduction = workers.assigned.processing * 0.05 * workers.efficiency;
            }

            // Processing workers can create applesauce automatically
            if (workers.assigned.processing > 0 && apples >= workers.assigned.processing) {
                setApples(prev => prev - workers.assigned.processing);
                setResources(prev => ({
                    ...prev,
                    applesauce: prev.applesauce + workers.assigned.processing * 0.1
                }));
            }

            // Crafting workers can create products
            if (workers.assigned.crafting > 0 && resources.applesauce >= workers.assigned.crafting) {
                setResources(prev => ({
                    ...prev,
                    applesauce: prev.applesauce - workers.assigned.crafting,
                    cider: prev.cider + workers.assigned.crafting * 0.05
                }));
            }

            // Research workers improve efficiency
            if (workers.assigned.research > 0) {
                setWorkers(prev => ({
                    ...prev,
                    efficiency: prev.efficiency + 0.0001 * workers.assigned.research
                }));
            }

            // Apply resource production
            if (seedProduction > 0 || sapProduction > 0 || essenceProduction > 0 || compostProduction > 0) {
                setResources(prev => ({
                    ...prev,
                    seeds: prev.seeds + seedProduction / 10,
                    sap: prev.sap + sapProduction / 10,
                    essence: prev.essence + essenceProduction / 10,
                    compost: prev.compost + compostProduction / 10
                }));

                setResourceRates({
                    seeds: seedProduction,
                    sap: sapProduction,
                    essence: essenceProduction,
                    compost: compostProduction
                });
            }

            // Update apples per second
            setApplesPerSecond(production);

        }, 100); // Run 10 times per second for smoother increments

        return () => clearInterval(gameLoop);
    }, [generators, prestige.multiplier, workers]);

    // Check for phase changes
    useEffect(() => {
        for (let i = 0; i < phaseThresholds.length; i++) {
            if (totalApples >= phaseThresholds[i] && phase === i + 1) {
                setPhase(i + 2);
                const phaseMessages = [
                    "Phase 2 : Les pommes semblent plus brillantes qu'avant...",
                    "Phase 3 : Vous commencez à rêver de pommes toutes les nuits...",
                    "Phase 4 : Le monde prend une teinte rougeâtre inquiétante...",
                    "Phase 5 : POMMUM L'ANCIEN ARRIVE. LA TRANSCENDANCE EST PROCHE !"
                ];
                addMessage(phaseMessages[i]);
            }
        }
    }, [totalApples, phase]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent shortcuts when typing in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            switch (e.key) {
                case ' ':  // Spacebar for clicking the apple
                    e.preventDefault();
                    clickApple();
                    break;

                case 'h':  // Show/hide keyboard shortcuts
                case 'H':
                    setShowKeyboardShortcuts(prev => !prev);
                    break;

                case 'm':  // Show/hide resource manager
                case 'M':
                    setShowResourceManager(prev => !prev);
                    break;

                case 'l':  // Show/hide lore
                case 'L':
                    setShowLore(prev => !prev);
                    break;

                case 'a':  // Show/hide achievements
                case 'A':
                    setShowAchievements(prev => !prev);
                    break;

                case 'p':  // Prestige if possible
                case 'P':
                    if (totalApples >= prestige.cost) {
                        doPrestige();
                    }
                    break;

                case 'w':  // Hire worker if possible
                case 'W':
                    if (apples >= workers.cost) {
                        hireWorker();
                    }
                    break;

                case 'Escape':  // Close all panels
                    setShowKeyboardShortcuts(false);
                    setShowResourceManager(false);
                    setShowLore(false);
                    setShowAchievements(false);
                    break;

                default:
                    // Number keys 1-9 for buying generators
                    if (!isNaN(parseInt(e.key)) && parseInt(e.key) >= 1 && parseInt(e.key) <= 9) {
                        const index = parseInt(e.key) - 1;
                        if (index < generators.length) {
                            const gen = generators[index];
                            if (apples >= gen.cost && (!gen.unlockAt || totalApples >= gen.unlockAt)) {
                                buyGenerator(gen.id);
                            }
                        }
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [clickApple, apples, totalApples, prestige.cost, workers.cost, generators, buyGenerator, doPrestige, hireWorker]);

    // Check achievements
    useEffect(() => {
        setAchievements(prevAchievements =>
            prevAchievements.map(achievement => {
                if (!achievement.earned && achievement.check()) {
                    addMessage(`🏆 Succès débloqué : ${achievement.name}`);
                    return {...achievement, earned: true};
                }
                return achievement;
            })
        );
    }, [totalApples, generators, upgrades, prestige.level, resources, workers]);

    // Random events
    useEffect(() => {
        const eventInterval = setInterval(() => {
            if (Math.random() < 0.05 && phase >= 2) { // 5% chance every 30 seconds
                const events = [
                    {
                        message: "Une pluie de pommes est tombée du ciel ! +50 pommes",
                        effect: () => setApples(prev => prev + 50)
                    },
                    {
                        message: "Un vent étrange souffle dans les vergers. Production doublée pendant 10 secondes !",
                        effect: () => {
                            const originalValues = generators.map(g => g.current);
                            updateAllGeneratorsEfficiency(2);
                            setTimeout(() => {
                                setGenerators(prevGenerators =>
                                    prevGenerators.map((gen, index) => ({
                                        ...gen,
                                        current: originalValues[index]
                                    }))
                                );
                            }, 10000);
                        }
                    },
                    {
                        message: "Vous avez trouvé une pomme dorée ! +100 pommes",
                        effect: () => setApples(prev => prev + 100)
                    }
                ];

                // More bizarre events in later phases
                if (phase >= 3) {
                    events.push(
                        {
                            message: "Les pommes chuchotent des secrets à vos oreilles. Production augmentée de 25% en permanence !",
                            effect: () => updateAllGeneratorsEfficiency(1.25)
                        },
                        {
                            message: "POMMUM vous envoie une vision. Vous comprenez mieux les pommes maintenant. Clics x2 pendant 20 secondes !",
                            effect: () => {
                                const originalValue = applesPerClick;
                                setApplesPerClick(prev => prev * 2);
                                setTimeout(() => setApplesPerClick(originalValue), 20000);
                            }
                        }
                    );
                }

                if (phase >= 4) {
                    events.push(
                        {
                            message: "Une faille dimensionnelle s'ouvre ! Des pommes d'une autre réalité affluent ! +500 pommes",
                            effect: () => setApples(prev => prev + 500)
                        },
                        {
                            message: "Votre peau commence à prendre une teinte rougeâtre... +200% de production par clic pendant 30 secondes !",
                            effect: () => {
                                const originalValue = applesPerClick;
                                setApplesPerClick(prev => prev * 3);
                                setTimeout(() => setApplesPerClick(originalValue), 30000);
                            }
                        }
                    );
                }

                const selectedEvent = events[Math.floor(Math.random() * events.length)];
                addMessage(`🌟 ÉVÉNEMENT : ${selectedEvent.message}`);
                selectedEvent.effect();
            }
        }, 30000);

        return () => clearInterval(eventInterval);
    }, [phase]);

    // UI components
    const PhaseBackground = () => {
        let bgClass = "bg-gray-900";
        let extraClass = "";

        switch (phase) {
            case 2:
                bgClass = "bg-gray-900";
                extraClass = "bg-opacity-95";
                break;
            case 3:
                bgClass = "bg-gray-900";
                extraClass = "bg-opacity-90 bg-blend-overlay";
                break;
            case 4:
                bgClass = "from-gray-900 to-red-900";
                extraClass = "bg-gradient-to-br";
                break;
            case 5:
                bgClass = "from-red-900 via-purple-900 to-red-900";
                extraClass = "bg-gradient-to-br animate-gradient";
                break;
            default:
                bgClass = "bg-gray-900";
        }

        return (
            <div className={`fixed inset-0 -z-10 ${bgClass} ${extraClass} transition-colors duration-1000`}></div>
        );
    };

    // Keyboard shortcuts info
    const KeyboardShortcutsPanel = () => (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 p-6 rounded-lg max-w-lg w-full max-h-screen overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Keyboard size={24}/>
                        Raccourcis Clavier
                    </h2>
                    <button
                        onClick={() => setShowKeyboardShortcuts(false)}
                        className="text-gray-400 hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-yellow-400 mb-2">Actions de base</h3>
                        <ul className="space-y-2">
                            <li className="flex justify-between">
                                <span className="font-mono bg-gray-700 px-2 py-1 rounded text-sm">Espace</span>
                                <span>Cliquer sur la pomme</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="font-mono bg-gray-700 px-2 py-1 rounded text-sm">H</span>
                                <span>Afficher/Masquer ce panneau</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="font-mono bg-gray-700 px-2 py-1 rounded text-sm">M</span>
                                <span>Afficher/Masquer gestionnaire de ressources</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="font-mono bg-gray-700 px-2 py-1 rounded text-sm">L</span>
                                <span>Afficher/Masquer le lore</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="font-mono bg-gray-700 px-2 py-1 rounded text-sm">A</span>
                                <span>Afficher/Masquer les succès</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="font-mono bg-gray-700 px-2 py-1 rounded text-sm">P</span>
                                <span>Prestige (si possible)</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="font-mono bg-gray-700 px-2 py-1 rounded text-sm">Échap</span>
                                <span>Fermer tous les panneaux</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="font-mono bg-gray-700 px-2 py-1 rounded text-sm">W</span>
                                <span>Embaucher un travailleur</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-blue-400 mb-2">Achat de générateurs</h3>
                        <p className="text-gray-300 mb-2">Utilisez les touches numériques pour acheter des générateurs
                            :</p>
                        <div className="grid grid-cols-2 gap-2">
                            {generators.slice(0, 9).map((gen, index) => (
                                <div key={gen.id} className="flex justify-between">
                                    <span className="font-mono bg-gray-700 px-2 py-1 rounded text-sm">{index + 1}</span>
                                    <span>{gen.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen text-white transition-colors duration-300 p-4`}>
            <PhaseBackground/>

            {/* Keyboard shortcuts modal */}
            {showKeyboardShortcuts && <KeyboardShortcutsPanel/>}

            {/* Header */}
            <header className="text-center mb-6">
                <h1 className="text-4xl font-bold text-red-500 mb-2 transition-all duration-500 hover:text-red-400">
                    Pommologie
                    {phase >= 3 && <span className="animate-pulse"> 🍎</span>}
                    {phase >= 5 && <span className="animate-pulse"> 👁️</span>}
                </h1>

                <div className="bg-gray-800 bg-opacity-80 p-2 rounded-lg shadow-lg inline-block">
                    <p className="text-lg font-medium">{lastMessage}</p>
                </div>

                <div className="mt-2 flex justify-center gap-2">
                    <button
                        className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full transition-colors"
                        onClick={() => setDarkMode(!darkMode)}
                        title={darkMode ? "Passer en mode clair" : "Passer en mode sombre"}
                    >
                        {darkMode ? <Sun size={18}/> : <Moon size={18}/>}
                    </button>

                    <button
                        className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full transition-colors"
                        onClick={() => setShowLore(!showLore)}
                        title={showLore ? "Masquer le lore" : "Afficher le lore"}
                    >
                        <BookOpen size={18}/>
                    </button>

                    <button
                        className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full transition-colors"
                        onClick={() => setShowAchievements(!showAchievements)}
                        title={showAchievements ? "Masquer les succès" : "Afficher les succès"}
                    >
                        <Award size={18}/>
                    </button>

                    <button
                        className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full transition-colors"
                        onClick={() => setShowResourceManager(!showResourceManager)}
                        title={showResourceManager ? "Masquer le gestionnaire" : "Afficher le gestionnaire"}
                    >
                        <Briefcase size={18}/>
                    </button>

                    <button
                        className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full transition-colors"
                        onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
                        title="Raccourcis clavier"
                    >
                        <Keyboard size={18}/>
                    </button>
                </div>
            </header>

            {/* Lore panel */}
            {showLore && (
                <div className="bg-gray-800 bg-opacity-90 p-4 mb-6 rounded-lg shadow-lg transition-all">
                    <h2 className="text-2xl font-bold text-red-400 mb-3 flex items-center gap-2">
                        <BookOpen size={20}/>
                        Chroniques de la Pommologie
                    </h2>

                    {loreEntries.filter(entry => entry.phase <= phase).map((entry, index) => (
                        <div key={index} className="mb-4">
                            <h3 className="text-xl font-semibold text-red-300">{entry.title}</h3>
                            <p className="italic text-gray-300">{entry.content}</p>
                        </div>
                    ))}

                    {phase < 5 && (
                        <p className="text-gray-400 mt-3">Plus de lore sera dévoilé à mesure que vous progressez...</p>
                    )}
                </div>
            )}

            {/* Achievements panel */}
            {showAchievements && (
                <div className="bg-gray-800 bg-opacity-90 p-4 mb-6 rounded-lg shadow-lg transition-all">
                    <h2 className="text-2xl font-bold text-yellow-400 mb-3 flex items-center gap-2">
                        <Award size={20}/>
                        Succès Débloqués ({achievements.filter(a => a.earned).length}/{achievements.length})
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {achievements.map((achievement) => (
                            <div
                                key={achievement.id}
                                className={`p-3 rounded-lg border ${achievement.earned ? 'bg-yellow-900 bg-opacity-30 border-yellow-600' : 'bg-gray-900 bg-opacity-50 border-gray-700'}`}
                            >
                                <div className="flex items-center gap-2">
                                    {achievement.earned ?
                                        <Award className="text-yellow-400" size={18}/> :
                                        <Award className="text-gray-500" size={18}/>
                                    }
                                    <h3 className={`font-bold ${achievement.earned ? 'text-yellow-300' : 'text-gray-400'}`}>
                                        {achievement.name}
                                    </h3>
                                </div>
                                <p className={`text-sm ${achievement.earned ? 'text-gray-300' : 'text-gray-500'}`}>
                                    {achievement.description}
                                </p>
                                {achievement.threshold && !achievement.earned && (
                                    <div className="mt-1 w-full bg-gray-700 rounded-full h-1.5">
                                        <div
                                            className="bg-yellow-500 h-1.5 rounded-full"
                                            style={{width: `${Math.min(100, (totalApples / achievement.threshold) * 100)}%`}}
                                        ></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Resource Manager Panel */}
            {showResourceManager && (
                <div className="bg-gray-800 bg-opacity-95 p-4 mb-6 rounded-lg shadow-lg transition-all">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2">
                            <Briefcase size={20}/>
                            Gestionnaire de Ressources
                        </h2>
                        <button
                            onClick={() => setShowResourceManager(false)}
                            className="text-gray-400 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Resources overview */}
                        <div className="bg-gray-900 bg-opacity-70 p-3 rounded-lg">
                            <h3 className="text-lg font-semibold text-green-300 mb-3">Ressources</h3>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Apple size={16} className="text-red-400"/>
                                        <span>Pommes</span>
                                    </div>
                                    <div>{formatNumber(apples)}</div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="text-yellow-400">●</span>
                                        <span>Pépins</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>{formatNumber(resources.seeds)}</span>
                                        {resourceRates.seeds > 0 && (
                                            <span
                                                className="text-xs text-green-400">+{formatNumber(resourceRates.seeds)}/s</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Droplet size={16} className="text-green-400"/>
                                        <span>Sève</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>{formatNumber(resources.sap)}</span>
                                        {resourceRates.sap > 0 && (
                                            <span
                                                className="text-xs text-green-400">+{formatNumber(resourceRates.sap)}/s</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="text-purple-400">✨</span>
                                        <span>Essence</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>{formatNumber(resources.essence)}</span>
                                        {resourceRates.essence > 0 && (
                                            <span
                                                className="text-xs text-green-400">+{formatNumber(resourceRates.essence)}/s</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="text-brown-400">🟤</span>
                                        <span>Compost</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>{formatNumber(resources.compost)}</span>
                                        {resourceRates.compost > 0 && (
                                            <span
                                                className="text-xs text-green-400">+{formatNumber(resourceRates.compost)}/s</span>
                                        )}
                                    </div>
                                </div>

                                <div className="border-t border-gray-700 my-2"></div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="text-orange-300">🍏</span>
                                        <span>Compote</span>
                                    </div>
                                    <div>{formatNumber(resources.applesauce)}</div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="text-yellow-300">🍺</span>
                                        <span>Cidre</span>
                                    </div>
                                    <div>{formatNumber(resources.cider)}</div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="text-red-300">🥧</span>
                                        <span>Tarte</span>
                                    </div>
                                    <div>{formatNumber(resources.pie)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Crafting */}
                        <div className="bg-gray-900 bg-opacity-70 p-3 rounded-lg">
                            <h3 className="text-lg font-semibold text-blue-300 mb-3">Fabrication</h3>

                            <div className="space-y-3">
                                <div className="p-2 border border-gray-700 rounded-lg">
                                    <div className="flex justify-between mb-1">
                                        <span className="font-medium">Compote de Pommes</span>
                                        <span className="text-xs text-gray-400">10 pommes → 1 compote</span>
                                    </div>
                                    <button
                                        onClick={() => craftResource('applesauce')}
                                        className={`w-full py-1 px-2 rounded ${
                                            apples >= 10 ? 'bg-blue-800 hover:bg-blue-700' : 'bg-gray-700 opacity-50 cursor-not-allowed'
                                        }`}
                                        disabled={apples < 10}
                                    >
                                        Fabriquer
                                    </button>
                                </div>

                                <div className="p-2 border border-gray-700 rounded-lg">
                                    <div className="flex justify-between mb-1">
                                        <span className="font-medium">Cidre</span>
                                        <span className="text-xs text-gray-400">20 pommes + 5 pépins + 1 compost</span>
                                    </div>
                                    <button
                                        onClick={() => craftResource('cider')}
                                        className={`w-full py-1 px-2 rounded ${
                                            apples >= 20 && resources.seeds >= 5 && resources.compost >= 1
                                                ? 'bg-blue-800 hover:bg-blue-700'
                                                : 'bg-gray-700 opacity-50 cursor-not-allowed'
                                        }`}
                                        disabled={apples < 20 || resources.seeds < 5 || resources.compost < 1}
                                    >
                                        Fabriquer
                                    </button>
                                </div>

                                <div className="p-2 border border-gray-700 rounded-lg">
                                    <div className="flex justify-between mb-1">
                                        <span className="font-medium">Tarte aux Pommes</span>
                                        <span className="text-xs text-gray-400">50 pommes + 5 compost + 2 compote</span>
                                    </div>
                                    <button
                                        onClick={() => craftResource('pie')}
                                        className={`w-full py-1 px-2 rounded ${
                                            apples >= 50 && resources.compost >= 5 && resources.applesauce >= 2
                                                ? 'bg-blue-800 hover:bg-blue-700'
                                                : 'bg-gray-700 opacity-50 cursor-not-allowed'
                                        }`}
                                        disabled={apples < 50 || resources.compost < 5 || resources.applesauce < 2}
                                    >
                                        Fabriquer
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Worker management */}
                        <div className="bg-gray-900 bg-opacity-70 p-3 rounded-lg md:col-span-2">
                            <h3 className="text-lg font-semibold text-yellow-300 mb-3 flex items-center gap-2">
                                <i className="fas fa-users"></i>
                                Gestion des Travailleurs
                            </h3>

                            <div className="flex justify-between items-center mb-3">
                                <div>
                                    <span className="font-medium">Travailleurs: {workers.total}</span>
                                    <span
                                        className="ml-2 text-sm text-gray-400">(disponibles: {workers.available})</span>
                                </div>

                                <button
                                    onClick={hireWorker}
                                    className={`py-1 px-3 rounded-lg ${
                                        apples >= workers.cost
                                            ? 'bg-yellow-800 hover:bg-yellow-700'
                                            : 'bg-gray-700 opacity-50 cursor-not-allowed'
                                    }`}
                                    disabled={apples < workers.cost}
                                >
                                    Embaucher ({formatNumber(workers.cost)} 🍎)
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                <div className="p-2 border border-gray-700 rounded-lg">
                                    <div className="font-medium mb-1 flex justify-between">
                                        <span>Cueillette</span>
                                        <span className="text-yellow-300">{workers.assigned.picking}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mb-2">+0.5 pommes/s par travailleur</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => assignWorker('picking')}
                                            className={`flex-1 py-1 rounded ${
                                                workers.available > 0 ? 'bg-green-900 hover:bg-green-800' : 'bg-gray-800 opacity-50 cursor-not-allowed'
                                            }`}
                                            disabled={workers.available <= 0}
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={() => unassignWorker('picking')}
                                            className={`flex-1 py-1 rounded ${
                                                workers.assigned.picking > 0 ? 'bg-red-900 hover:bg-red-800' : 'bg-gray-800 opacity-50 cursor-not-allowed'
                                            }`}
                                            disabled={workers.assigned.picking <= 0}
                                        >
                                            -
                                        </button>
                                    </div>
                                </div>

                                <div className="p-2 border border-gray-700 rounded-lg">
                                    <div className="font-medium mb-1 flex justify-between">
                                        <span>Traitement</span>
                                        <span className="text-yellow-300">{workers.assigned.processing}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mb-2">+0.05 compost/s, convertit pommes en
                                        compote</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => assignWorker('processing')}
                                            className={`flex-1 py-1 rounded ${
                                                workers.available > 0 ? 'bg-green-900 hover:bg-green-800' : 'bg-gray-800 opacity-50 cursor-not-allowed'
                                            }`}
                                            disabled={workers.available <= 0}
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={() => unassignWorker('processing')}
                                            className={`flex-1 py-1 rounded ${
                                                workers.assigned.processing > 0 ? 'bg-red-900 hover:bg-red-800' : 'bg-gray-800 opacity-50 cursor-not-allowed'
                                            }`}
                                            disabled={workers.assigned.processing <= 0}
                                        >
                                            -
                                        </button>
                                    </div>
                                </div>

                                <div className="p-2 border border-gray-700 rounded-lg">
                                    <div className="font-medium mb-1 flex justify-between">
                                        <span>Artisanat</span>
                                        <span className="text-yellow-300">{workers.assigned.crafting}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mb-2">Convertit compote en cidre
                                        automatiquement</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => assignWorker('crafting')}
                                            className={`flex-1 py-1 rounded ${
                                                workers.available > 0 ? 'bg-green-900 hover:bg-green-800' : 'bg-gray-800 opacity-50 cursor-not-allowed'
                                            }`}
                                            disabled={workers.available <= 0}
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={() => unassignWorker('crafting')}
                                            className={`flex-1 py-1 rounded ${
                                                workers.assigned.crafting > 0 ? 'bg-red-900 hover:bg-red-800' : 'bg-gray-800 opacity-50 cursor-not-allowed'
                                            }`}
                                            disabled={workers.assigned.crafting <= 0}
                                        >
                                            -
                                        </button>
                                    </div>
                                </div>

                                <div className="p-2 border border-gray-700 rounded-lg">
                                    <div className="font-medium mb-1 flex justify-between">
                                        <span>Recherche</span>
                                        <span className="text-yellow-300">{workers.assigned.research}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mb-2">Améliore l'efficacité globale des
                                        travailleurs</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => assignWorker('research')}
                                            className={`flex-1 py-1 rounded ${
                                                workers.available > 0 ? 'bg-green-900 hover:bg-green-800' : 'bg-gray-800 opacity-50 cursor-not-allowed'
                                            }`}
                                            disabled={workers.available <= 0}
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={() => unassignWorker('research')}
                                            className={`flex-1 py-1 rounded ${
                                                workers.assigned.research > 0 ? 'bg-red-900 hover:bg-red-800' : 'bg-gray-800 opacity-50 cursor-not-allowed'
                                            }`}
                                            disabled={workers.assigned.research <= 0}
                                        >
                                            -
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 text-sm text-center text-gray-400">
                                Efficacité des travailleurs: x{workers.efficiency.toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main game area */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Stats and clicking area */}
                <div className="bg-gray-800 bg-opacity-80 p-4 rounded-lg shadow-lg">
                    <div className="flex flex-col items-center mb-4">
                        <div className="text-2xl font-bold">
                            <span className="text-red-400">🍎</span> <span
                            className="text-white">{formatNumber(apples)}</span> pommes
                        </div>
                        <div className="text-gray-300 text-sm">
                            Total de tous les temps : {formatNumber(totalApples)}
                        </div>
                        <div className="flex gap-4 mt-2 text-gray-300">
                            <div className="flex items-center gap-1">
                                <Zap size={14} className="text-yellow-400"/>
                                <span>{formatNumber(applesPerClick)} par clic</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock size={14} className="text-blue-400"/>
                                <span>{formatNumber(applesPerSecond)} par sec</span>
                            </div>
                        </div>

                        {/* Resources mini display */}
                        {phase >= 2 && (
                            <div className="mt-2 flex flex-wrap gap-2 justify-center">
                                <div className="px-2 py-1 bg-gray-700 rounded-full text-xs flex items-center gap-1"
                                     title="Pépins de pomme">
                                    <span className="text-yellow-400">●</span>
                                    <span>{formatNumber(resources.seeds)}</span>
                                </div>

                                {phase >= 2 && resources.sap > 0 && (
                                    <div className="px-2 py-1 bg-gray-700 rounded-full text-xs flex items-center gap-1"
                                         title="Sève de pommier">
                                        <Droplet size={10} className="text-green-400"/>
                                        <span>{formatNumber(resources.sap)}</span>
                                    </div>
                                )}

                                {phase >= 3 && resources.essence > 0 && (
                                    <div className="px-2 py-1 bg-gray-700 rounded-full text-xs flex items-center gap-1"
                                         title="Essence de pomme">
                                        <span className="text-purple-400">✨</span>
                                        <span>{formatNumber(resources.essence)}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {prestige.level > 0 && (
                            <div
                                className="mt-2 px-3 py-1 bg-purple-900 bg-opacity-50 rounded-full text-purple-300 text-sm flex items-center gap-1">
                                <Layers size={14}/>
                                <span>Prestige Niveau {prestige.level} (x{prestige.multiplier.toFixed(1)})</span>
                            </div>
                        )}
                    </div>

                    <div
                        className="flex justify-center mb-4"
                        onClick={clickApple}
                    >
                        <div
                            ref={appleRef}
                            className="w-32 h-32 cursor-pointer transition-transform duration-100 hover:scale-105"
                        >
                            <AppleSVG phase={phase}/>
                        </div>
                    </div>

                    {/* Worker button */}
                    {phase >= 2 && (
                        <div className="mb-3">
                            <button
                                onClick={hireWorker}
                                disabled={apples < workers.cost}
                                className={`w-full py-2 px-4 rounded-lg text-white font-bold transition-all ${
                                    apples >= workers.cost
                                        ? 'bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-500 hover:to-yellow-700'
                                        : 'bg-gray-700 cursor-not-allowed'
                                }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <i className="fas fa-user-plus"></i>
                                    <span>Embaucher ({formatNumber(workers.cost)} 🍎)</span>
                                </div>
                            </button>
                            <div className="text-center text-sm mt-1 text-gray-300">
                                Travailleurs: {workers.total} (disponibles: {workers.available})
                            </div>
                        </div>
                    )}

                    {/* Prestige button */}
                    {totalApples >= prestige.cost / 2 && (
                        <div className="mt-4">
                            <button
                                onClick={doPrestige}
                                disabled={totalApples < prestige.cost}
                                className={`w-full py-2 px-4 rounded-lg text-white font-bold transition-all ${
                                    totalApples >= prestige.cost
                                        ? 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 shadow-lg'
                                        : 'bg-gray-700 cursor-not-allowed'
                                }`}
                                title={`Réinitialisez votre progression pour gagner un bonus de production permanent. Essence de Pomme actuelle: ${prestige.essencePoints}`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Layers size={16}/>
                                    <span>Prestigiation ({formatNumber(totalApples)}/{formatNumber(prestige.cost)})</span>
                                </div>
                            </button>
                            {totalApples >= prestige.cost && (
                                <p className="text-purple-300 text-xs mt-1 text-center">
                                    Vous gagnerez {Math.floor(Math.sqrt(totalApples / 1000))} points d'Essence de Pomme
                                </p>
                            )}
                        </div>
                    )}

                    {/* News ticker */}
                    <div className="mt-4 bg-gray-900 bg-opacity-70 p-2 rounded-lg h-20 overflow-hidden">
                        <div className="animate-scroll space-y-2 ">
                            {messages.map((message, index) => (
                                <p key={index} className="text-gray-300">{message}</p>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Generators shop */}
                <div className="bg-gray-800 bg-opacity-80 p-4 rounded-lg shadow-lg max-h-[70vh] overflow-y-auto">
                    <h2 className="text-xl font-bold mb-3 text-blue-400">Boutique 🛒</h2>

                    {generators.map((generator) => {
                        const isUnlocked = !generator.unlockAt || totalApples >= generator.unlockAt;
                        const canAfford = apples >= generator.cost;

                        if (!isUnlocked && generator.unlockAt > totalApples * 5) return null;

                        return (
                            <div
                                key={generator.id}
                                className={`mb-2 rounded-lg p-3 transition-colors relative ${
                                    isUnlocked
                                        ? canAfford
                                            ? 'bg-gray-700 hover:bg-gray-600 cursor-pointer'
                                            : 'bg-gray-700 opacity-75'
                                        : 'bg-gray-800 opacity-50'
                                }`}
                                onClick={() => isUnlocked && buyGenerator(generator.id)}
                                onMouseEnter={() => setShowTooltip(generator.id as any)}
                                onMouseLeave={() => setShowTooltip(null)}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="font-semibold">{generator.name}</div>
                                        <div
                                            className="text-xs text-gray-300">{isUnlocked ? generator.description : `Débloqué à ${formatNumber(generator.unlockAt)} pommes`}</div>
                                    </div>

                                    <div className="text-right">
                                        <div className={`font-mono ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
                                            🍎 {formatNumber(generator.cost)}
                                        </div>
                                        <div className="text-xs text-gray-300">
                                            +{formatNumber(generator.current)} pps
                                        </div>
                                    </div>
                                </div>

                                {generator.count > 0 && (
                                    <div className="mt-1 flex justify-between items-center">
                                        <div className="text-xs text-blue-300">
                                            {formatNumber(generator.current * generator.count)} pps total
                                        </div>
                                        <div className="bg-blue-900 bg-opacity-50 px-2 py-0.5 rounded-full text-xs">
                                            {generator.count}
                                        </div>
                                    </div>
                                )}

                                {showTooltip === generator.id && generator.lore && (
                                    <div
                                        className="absolute left-0 -bottom-1 transform translate-y-full z-10 w-full p-3 bg-gray-900 text-gray-300 rounded-md shadow-lg text-sm border border-gray-700">
                                        <div className="font-semibold text-blue-300 mb-1">Lore:</div>
                                        <p className="italic">{generator.lore}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Upgrades */}
                <div className="bg-gray-800 bg-opacity-80 p-4 rounded-lg shadow-lg max-h-[70vh] overflow-y-auto">
                    <h2 className="text-xl font-bold mb-3 text-yellow-400">Améliorations 🚀</h2>

                    {upgrades.filter(upgrade =>
                        !upgrade.purchased &&
                        (!upgrade.unlockAt || totalApples >= upgrade.unlockAt)
                    ).length === 0 ? (
                        <p className="text-gray-400 italic">Aucune amélioration disponible pour le moment.</p>
                    ) : (
                        upgrades.map((upgrade) => {
                            const isUnlocked = !upgrade.unlockAt || totalApples >= upgrade.unlockAt;
                            const canAfford = apples >= upgrade.cost;

                            if (upgrade.purchased || !isUnlocked) return null;

                            return (
                                <div
                                    key={upgrade.id}
                                    className={`mb-2 rounded-lg p-3 transition-colors relative ${
                                        canAfford
                                            ? 'bg-yellow-900 bg-opacity-30 hover:bg-yellow-900 hover:bg-opacity-50 cursor-pointer border border-yellow-800'
                                            : 'bg-gray-700 opacity-75 border border-gray-600'
                                    }`}
                                    onClick={() => canAfford && buyUpgrade(upgrade.id)}
                                    onMouseEnter={() => setShowTooltip(`upgrade-${upgrade.id}`) as any}
                                    onMouseLeave={() => setShowTooltip(null)}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="font-semibold">{upgrade.name}</div>
                                            <div className="text-xs text-gray-300">{upgrade.description}</div>
                                        </div>

                                        <div className={`font-mono ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
                                            🍎 {formatNumber(upgrade.cost)}
                                        </div>
                                    </div>

                                    {showTooltip === `upgrade-${upgrade.id}` && upgrade.lore && (
                                        <div
                                            className="absolute left-0 -bottom-1 transform translate-y-full z-10 w-full p-3 bg-gray-900 text-gray-300 rounded-md shadow-lg text-sm border border-gray-700">
                                            <div className="font-semibold text-yellow-300 mb-1">Lore:</div>
                                            <p className="italic">{upgrade.lore}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}

                    {/* Purchased upgrades */}
                    <div className="mt-4">
                        <h3 className="text-sm font-semibold text-gray-400 mb-2">Améliorations achetées:</h3>
                        <div className="flex flex-wrap gap-2">
                            {upgrades.filter(u => u.purchased).map((upgrade) => (
                                <div
                                    key={upgrade.id}
                                    className="w-8 h-8 bg-yellow-800 bg-opacity-30 rounded-md flex items-center justify-center text-yellow-500 text-xs border border-yellow-900"
                                    title={upgrade.name}
                                >
                                    {upgrade.name.substring(0, 1)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer with phase indicator */}
            <footer className="mt-6 text-center text-gray-400 text-sm">
                <div className="flex justify-center items-center gap-2 mb-2">
                    <span>Phase:</span>
                    {[1, 2, 3, 4, 5].map((p) => (
                        <div
                            key={p}
                            className={`w-3 h-3 rounded-full ${
                                p <= phase
                                    ? p === 5 ? 'bg-red-500 animate-pulse' : 'bg-red-500'
                                    : 'bg-gray-600'
                            }`}
                            title={`Phase ${p}`}
                        ></div>
                    ))}
                </div>
                <p className="mb-1">Pommologie
                    v2 - Édition Cosmique</p>
                <p className="text-xs text-gray-500">Appuyez sur H pour afficher les raccourcis clavier</p>
            </footer>
        </div>
    );
};

export default Pommologie;