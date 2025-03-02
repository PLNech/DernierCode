// types/index.ts
export type QualityLevel = 'low' | 'medium' | 'high' | 'extreme';

export const QUALITY_COLORS: Record<QualityLevel, string> = {
    low: "text-gray-500",
    medium: "text-blue-500",
    high: "text-purple-500",
    extreme: "text-pink-600 font-bold"
};

export interface Model {
    name: string;
    cost: number;
    autoCodePerSecond: number;
    quality: QualityLevel;
    capabilities: string[];
}

export interface AgentType {
    id: string;
    name: string;
    cost: number;
    efficiency: number;
    autonomy: number;
    maxTasks: number;
    maxCount: number;
}

export interface Agent {
    id: string;
    type: string;
    name: string;
    cost: number;
    efficiency: number;
    autonomy: number;
    maxTasks: number;
    maxCount: number;
    currentTasks: number;
}

export interface Task {
    id: string;
    type: string;
    name: string;
    description: string;
    reward: number;
    complexity: number;
    timeToComplete: number;
    expiresIn: number;
    status: string;
}

export interface Assignment {
    id: string;
    task: Task;
    agent: Agent;
    status: string;
    verified: boolean;
    progress: number;
    startedAt: number;
    completedAt?: number;
}

export interface TaskType {
    id: string;
    name: string;
    description: string;
    unlockCost: number;
    minReward: number;
    maxReward: number;
    complexity: number;
    timeRequired: number;
    icon: string;
}