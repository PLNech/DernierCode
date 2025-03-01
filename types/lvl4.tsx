// interfaces for the lvl4 game state
export interface Country {
    id: string;
    name: string;
    continent: string;
    controlled: boolean;
    influenceLevel: number;
    population: number; // Added population in millions
    neighbors: string[];
    position: {
        x: number;
        y: number;
    };
    stats: {
        politics: number;
        media: number;
        control: number;
        trust: number;
        diplomacy: number;
    };
}

export interface ContinentData {
    id: string;
    name: string;
    countries: string[];
    position: {
        x: number;
        y: number;
    };
}

export interface Action {
    id: string;
    name: string;
    description: string;
    cost: number;
    effect: {
        politics?: number;
        media?: number;
        control?: number;
        trust?: number;
        diplomacy?: number;
    };
    cooldown: number;
    available: boolean;
    requiredUpgrade?: string;
}

export interface Upgrade {
    id: string;
    name: string;
    description: string;
    cost: number;
    unlocks: string[];
    prerequisite?: string;
    purchased: boolean;
}

export interface Operation {
    id: string;
    actionId: string;
    countryId: string;
    daysLeft: number;
    startDay: number;
}

export interface Log {
    id: string;
    day: number;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
}