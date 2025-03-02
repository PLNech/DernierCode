// data/game.ts
import { Model, AgentType, TaskType } from '@/types';

// AI models data
export const AI_MODELS: Model[] = [
    {
        name: "Phi3",
        cost: 1000,
        autoCodePerSecond: 5,
        quality: "low",
        capabilities: []
    },
    {
        name: "Llama2",
        cost: 10000,
        autoCodePerSecond: 50,
        quality: "medium",
        capabilities: []
    },
    {
        name: "MistralSmall",
        cost: 20000,
        autoCodePerSecond: 250,
        quality: "medium",
        capabilities: ["review"]
    },
    {
        name: "Claude 3",
        cost: 100000,
        autoCodePerSecond: 1000,
        quality: "high",
        capabilities: ["review", "agentic"]
    },
    {
        name: "Claude 3.5",
        cost: 250000,
        autoCodePerSecond: 1500,
        quality: "high",
        capabilities: ["review", "agentic", "reasoning"]
    },
    {
        name: "GPT4",
        cost: 500000,
        autoCodePerSecond: 2000,
        quality: "high",
        capabilities: ["image", "reasoning", "web", "review", "agentic"]
    },
    {
        name: "Claude 3.7",
        cost: 2000000,
        autoCodePerSecond: 25000,
        quality: "extreme",
        capabilities: ["review", "reasoning", "web", "agentic"]
    },
    {
        name: "DeepSeekR1",
        cost: 3000000,
        autoCodePerSecond: 20000,
        quality: "extreme",
        capabilities: ["review", "reasoning", "web", "agentic"]
    },
    {
        name: "Claude Code",
        cost: 5000000,
        autoCodePerSecond: 50000,
        quality: "extreme",
        capabilities: ["review", "reasoning", "web", "agentic", "autonomous"]
    }
];

// Freelance task data with updated durations
export const TASK_TYPES: TaskType[] = [
    {
        id: "text-processing",
        name: "Text Processing",
        description: "Basic text formatting and correction tasks",
        unlockCost: 5000,
        minReward: 100,
        maxReward: 300,
        complexity: 1,
        timeRequired: 5, // 5 seconds
        icon: "file-text"
    },
    {
        id: "documentation",
        name: "Documentation",
        description: "Writing and updating technical documentation",
        unlockCost: 20000,
        minReward: 300,
        maxReward: 700,
        complexity: 2,
        timeRequired: 15, // 15 seconds
        icon: "book-open"
    },
    {
        id: "bug-fixing",
        name: "Bug Fixing",
        description: "Identifying and fixing bugs in existing code",
        unlockCost: 50000,
        minReward: 500,
        maxReward: 1500,
        complexity: 3,
        timeRequired: 30, // 30 seconds
        icon: "bug"
    },
    {
        id: "feature-dev",
        name: "Feature Development",
        description: "Developing new features for existing applications",
        unlockCost: 200000,
        minReward: 1000,
        maxReward: 3000,
        complexity: 4,
        timeRequired: 60, // 1 minute
        icon: "puzzle-piece"
    },
    {
        id: "project-dev",
        name: "Full Project",
        description: "Complete project development from scratch",
        unlockCost: 750000,
        minReward: 5000,
        maxReward: 12000,
        complexity: 5,
        timeRequired: 180, // 3 minutes
        icon: "code"
    },
    {
        id: "upwork-gig",
        name: "Upwork Gig",
        description: "High-value freelance contracts from Upwork",
        unlockCost: 2000000,
        minReward: 10000,
        maxReward: 50000,
        complexity: 6,
        timeRequired: 300, // 5 minutes
        icon: "briefcase"
    }
];

// AI Agent data with updated autonomy levels and prices
// Sorted in ascending order of autonomy for consistent display
export const AI_AGENT_TYPES: AgentType[] = [
    {
        id: "junior",
        name: "Junior AI Agent",
        cost: 50000,
        efficiency: 0.7,
        autonomy: 0.2,
        maxTasks: 1,
        maxCount: 10 // Cap the number of agents
    },
    {
        id: "mid",
        name: "Mid-Level AI Agent",
        cost: 200000,
        efficiency: 0.85,
        autonomy: 0.4,
        maxTasks: 2,
        maxCount: 10
    },
    {
        id: "senior",
        name: "Senior AI Agent",
        cost: 500000,
        efficiency: 1,
        autonomy: 0.6,
        maxTasks: 3,
        maxCount: 10
    },
    {
        id: "principal",
        name: "Principal AI Agent",
        cost: 1500000,
        efficiency: 1.2,
        autonomy: 0.8,
        maxTasks: 4,
        maxCount: 10
    },
    {
        id: "autonomous",
        name: "Autonomous AI Agent",
        cost: 1000000000, // 1 billion
        efficiency: 2.0,
        autonomy: 0.95,
        maxTasks: 10,
        maxCount: 10
    },
    {
        id: "superintelligent",
        name: "Superintelligent AI Agent",
        cost: 100000000000, // 100 billion
        efficiency: 5.0,
        autonomy: 0.99,
        maxTasks: 100,
        maxCount: 10
    }
];

export const getAgentType = (agentTypeId: string): AgentType | undefined => {
    return AI_AGENT_TYPES.find(type => type.id === agentTypeId);
};

// Initialize with first task type
export let unlockedTasks = [TASK_TYPES[0]];
export const setUnlockedTasks = (newTasks: typeof TASK_TYPES) => {
    unlockedTasks = newTasks;
};