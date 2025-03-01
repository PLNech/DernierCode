// Initial continent data to position countries on the map
import {Action, ContinentData, Country, Upgrade} from "@/types/lvl4";

// Initial continent data to position countries on the map
export const CONTINENTS: ContinentData[] = [
    {
        id: 'north-america',
        name: 'North America',
        countries: ['usa', 'canada', 'mexico'],
        position: { x: 1, y: 1 }
    },
    {
        id: 'south-america',
        name: 'South America',
        countries: ['brazil', 'argentina', 'colombia', 'venezuela', 'chile', 'peru'],
        position: { x: 2, y: 2 }
    },
    {
        id: 'europe',
        name: 'Europe',
        countries: ['uk', 'france', 'germany', 'italy', 'spain', 'poland', 'ukraine', 'russia'],
        position: { x: 3, y: 1 }
    },
    {
        id: 'africa',
        name: 'Africa',
        countries: ['egypt', 'nigeria', 'south-africa', 'algeria', 'ethiopia', 'kenya'],
        position: { x: 3, y: 2 }
    },
    {
        id: 'asia',
        name: 'Asia',
        countries: ['china', 'india', 'japan', 'south-korea', 'indonesia', 'saudi-arabia', 'iran', 'turkey'],
        position: { x: 4, y: 1 }
    },
    {
        id: 'oceania',
        name: 'Oceania',
        countries: ['australia', 'new-zealand'],
        position: { x: 5, y: 2 }
    }
];

// Initialize countries with positions based on continents and population sizes
export const INITIAL_COUNTRIES: { [key: string]: Country } = {
    // North America
    'usa': {
        id: 'usa',
        name: 'United States',
        continent: 'north-america',
        controlled: false,
        influenceLevel: 0,
        population: 331, // Population in millions
        neighbors: ['canada', 'mexico'],
        position: { x: 3, y: 3 }, // More space between USA and neighbors
        stats: { politics: 40, media: 30, control: 25, trust: 60, diplomacy: 70 }
    },
    'canada': {
        id: 'canada',
        name: 'Canada',
        continent: 'north-america',
        controlled: false,
        influenceLevel: 0,
        population: 38,
        neighbors: ['usa'],
        position: { x: 3, y: 1 }, // More vertical separation
        stats: { politics: 35, media: 40, control: 30, trust: 75, diplomacy: 80 }
    },
    'mexico': {
        id: 'mexico',
        name: 'Mexico',
        continent: 'north-america',
        controlled: false,
        influenceLevel: 0,
        population: 126,
        neighbors: ['usa'],
        position: { x: 3, y: 5 }, // More vertical separation
        stats: { politics: 45, media: 35, control: 40, trust: 50, diplomacy: 60 }
    },

    // South America
    'brazil': {
        id: 'brazil',
        name: 'Brazil',
        continent: 'south-america',
        controlled: false,
        influenceLevel: 0,
        population: 213,
        neighbors: ['argentina', 'colombia', 'peru', 'venezuela'],
        position: { x: 5, y: 6 },
        stats: { politics: 50, media: 45, control: 40, trust: 55, diplomacy: 60 }
    },
    'argentina': {
        id: 'argentina',
        name: 'Argentina',
        continent: 'south-america',
        controlled: true, // Starting country
        influenceLevel: 85,
        population: 45,
        neighbors: ['brazil', 'chile'],
        position: { x: 4.5, y: 8 },
        stats: { politics: 65, media: 55, control: 70, trust: 35, diplomacy: 30 }
    },
    'venezuela': {
        id: 'venezuela',
        name: 'Venezuela',
        continent: 'south-america',
        controlled: true, // Starting country
        influenceLevel: 80,
        population: 28,
        neighbors: ['brazil', 'colombia'],
        position: { x: 4, y: 4.5 },
        stats: { politics: 75, media: 60, control: 80, trust: 40, diplomacy: 25 }
    },
    'colombia': {
        id: 'colombia',
        name: 'Colombia',
        continent: 'south-america',
        controlled: false,
        influenceLevel: 0,
        population: 51,
        neighbors: ['venezuela', 'brazil', 'peru'],
        position: { x: 3.5, y: 5.3 },
        stats: { politics: 45, media: 40, control: 35, trust: 50, diplomacy: 55 }
    },
    'chile': {
        id: 'chile',
        name: 'Chile',
        continent: 'south-america',
        controlled: false,
        influenceLevel: 0,
        population: 19,
        neighbors: ['argentina', 'peru'],
        position: { x: 3.5, y: 8.5 },
        stats: { politics: 40, media: 60, control: 30, trust: 65, diplomacy: 70 }
    },
    'peru': {
        id: 'peru',
        name: 'Peru',
        continent: 'south-america',
        controlled: false,
        influenceLevel: 0,
        population: 33,
        neighbors: ['chile', 'brazil', 'colombia'],
        position: { x: 3, y: 6.5 },
        stats: { politics: 45, media: 40, control: 35, trust: 60, diplomacy: 50 }
    },

    // Europe - more spread out
    'uk': {
        id: 'uk',
        name: 'United Kingdom',
        continent: 'europe',
        controlled: false,
        influenceLevel: 0,
        population: 68,
        neighbors: ['france'],
        position: { x: 7, y: 1.5 },
        stats: { politics: 40, media: 45, control: 30, trust: 65, diplomacy: 75 }
    },
    'france': {
        id: 'france',
        name: 'France',
        continent: 'europe',
        controlled: false,
        influenceLevel: 0,
        population: 65,
        neighbors: ['uk', 'germany', 'spain', 'italy'],
        position: { x: 8, y: 2.5 },
        stats: { politics: 45, media: 50, control: 35, trust: 60, diplomacy: 70 }
    },
    'germany': {
        id: 'germany',
        name: 'Germany',
        continent: 'europe',
        controlled: false,
        influenceLevel: 0,
        population: 83,
        neighbors: ['france', 'poland'],
        position: { x: 9, y: 2 },
        stats: { politics: 40, media: 55, control: 35, trust: 70, diplomacy: 75 }
    },
    'italy': {
        id: 'italy',
        name: 'Italy',
        continent: 'europe',
        controlled: false,
        influenceLevel: 0,
        population: 60,
        neighbors: ['france'],
        position: { x: 9, y: 3.5 },
        stats: { politics: 55, media: 60, control: 40, trust: 50, diplomacy: 65 }
    },
    'spain': {
        id: 'spain',
        name: 'Spain',
        continent: 'europe',
        controlled: false,
        influenceLevel: 0,
        population: 47,
        neighbors: ['france'],
        position: { x: 7, y: 3.5 },
        stats: { politics: 50, media: 55, control: 35, trust: 55, diplomacy: 65 }
    },
    'poland': {
        id: 'poland',
        name: 'Poland',
        continent: 'europe',
        controlled: false,
        influenceLevel: 0,
        population: 38,
        neighbors: ['germany', 'ukraine'],
        position: { x: 10, y: 1.5 },
        stats: { politics: 45, media: 40, control: 30, trust: 60, diplomacy: 65 }
    },
    'ukraine': {
        id: 'ukraine',
        name: 'Ukraine',
        continent: 'europe',
        controlled: false,
        influenceLevel: 0,
        population: 44,
        neighbors: ['poland', 'russia'],
        position: { x: 11, y: 2.5 },
        stats: { politics: 55, media: 45, control: 40, trust: 50, diplomacy: 60 }
    },
    'russia': {
        id: 'russia',
        name: 'Russia',
        continent: 'europe',
        controlled: false,
        influenceLevel: 0,
        population: 146,
        neighbors: ['ukraine', 'china'],
        position: { x: 13, y: 1 },
        stats: { politics: 70, media: 65, control: 75, trust: 30, diplomacy: 45 }
    },

    // Asia
    'china': {
        id: 'china',
        name: 'China',
        continent: 'asia',
        controlled: false,
        influenceLevel: 0,
        population: 1402,
        neighbors: ['russia', 'india', 'japan'],
        position: { x: 14, y: 3 },
        stats: { politics: 80, media: 75, control: 85, trust: 25, diplomacy: 40 }
    },
    'india': {
        id: 'india',
        name: 'India',
        continent: 'asia',
        controlled: false,
        influenceLevel: 0,
        population: 1380,
        neighbors: ['china'],
        position: { x: 13, y: 4.5 },
        stats: { politics: 45, media: 50, control: 40, trust: 60, diplomacy: 65 }
    },
    'japan': {
        id: 'japan',
        name: 'Japan',
        continent: 'asia',
        controlled: false,
        influenceLevel: 0,
        population: 126,
        neighbors: ['china', 'south-korea'],
        position: { x: 16, y: 2.5 },
        stats: { politics: 40, media: 60, control: 30, trust: 70, diplomacy: 75 }
    },
    'south-korea': {
        id: 'south-korea',
        name: 'South Korea',
        continent: 'asia',
        controlled: false,
        influenceLevel: 0,
        population: 52,
        neighbors: ['japan'],
        position: { x: 15, y: 3.5 },
        stats: { politics: 45, media: 55, control: 35, trust: 65, diplomacy: 70 }
    },

    // Oceania
    'australia': {
        id: 'australia',
        name: 'Australia',
        continent: 'oceania',
        controlled: false,
        influenceLevel: 0,
        population: 26,
        neighbors: ['new-zealand'],
        position: { x: 15, y: 7 },
        stats: { politics: 35, media: 50, control: 30, trust: 75, diplomacy: 80 }
    },
    'new-zealand': {
        id: 'new-zealand',
        name: 'New Zealand',
        continent: 'oceania',
        controlled: false,
        influenceLevel: 0,
        population: 5,
        neighbors: ['australia'],
        position: { x: 16.5, y: 8 },
        stats: { politics: 30, media: 45, control: 25, trust: 80, diplomacy: 85 }
    }
};

export const ACTIONS: { [key: string]: Action } = {
    textFakes: {
        id: 'textFakes',
        name: "Generate Text Fakes",
        description: "Use LLMs to create fake news articles and social media content",
        cost: 150,
        effect: { politics: 5, media: 8, control: 3, trust: -4, diplomacy: -6 },
        cooldown: 2, // days
        available: true,
    },
    imageFakes: {
        id: 'imageFakes',
        name: "Generate Image Fakes",
        description: "Create fake images to spread disinformation",
        cost: 300,
        effect: { politics: 8, media: 12, control: 7, trust: -10, diplomacy: -8 },
        cooldown: 3,
        available: false, // Requires upgrade
        requiredUpgrade: "ImaGen"
    },
    videoFakes: {
        id: 'videoFakes',
        name: "Generate DeepFake Videos",
        description: "Create convincing fake videos of public figures",
        cost: 750,
        effect: { politics: 15, media: 20, control: 12, trust: -15, diplomacy: -12 },
        cooldown: 5,
        available: false, // Requires upgrade
        requiredUpgrade: "DeepFake"
    },
    hologramFakes: {
        id: 'hologramFakes',
        name: "DeepFake Hologram Avatar",
        description: "Project holographic appearances for maximum influence",
        cost: 1500,
        effect: { politics: 25, media: 30, control: 20, trust: -20, diplomacy: -15 },
        cooldown: 7,
        available: false, // Requires upgrade
        requiredUpgrade: "Hologram"
    }
};

// Available upgrades
export const UPGRADES: { [key: string]: Upgrade } = {
    ImaGen: {
        id: "ImaGen",
        name: "ImaGen Models",
        description: "Generate realistic fake images",
        cost: 5000,
        unlocks: ["imageFakes"],
        purchased: false
    },
    DeepFake: {
        id: "DeepFake",
        name: "DeepFake Videos",
        description: "Create convincing video manipulations",
        cost: 15000,
        unlocks: ["videoFakes"],
        prerequisite: "ImaGen",
        purchased: false
    },
    Hologram: {
        id: "Hologram",
        name: "Hologram Avatars",
        description: "Project yourself anywhere in the world",
        cost: 50000,
        unlocks: ["hologramFakes"],
        prerequisite: "DeepFake",
        purchased: false
    }
};
