// components/Level2.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Users, Zap, Cpu, PieChart } from 'lucide-react';
import { Agent, Task, AgentType, Assignment, Model, QualityLevel, TaskType } from "@/types";
import { getAgentType, TASK_TYPES, AI_AGENT_TYPES } from '@/data/games';
import { unlockedTasks, setUnlockedTasks } from '@/data/games';

interface Level2Props {
    money: number;
    setMoney: (value: number | ((prev: number) => number)) => void;
    isFullyAutomated: boolean;
    setIsFullyAutomated: (value: boolean) => void;
    level3Unlocked: boolean;
    setLevel3Unlocked: (value: boolean) => void;
}

const Level2 = ({
                    money,
                    setMoney,
                    isFullyAutomated,
                    setIsFullyAutomated,
                    level3Unlocked,
                    setLevel3Unlocked
                }: Level2Props) => {
    // Extract Level 2 state from DernierCode
    const [unlockedTasks, setUnlockedTasks] = useState([TASK_TYPES[0]]);
    const [ownedAgents, setOwnedAgents] = useState<Agent[]>([]);
    const [activeAssignments, setActiveAssignments] = useState<Assignment[]>([]);
    const [incomingTasks, setIncomingTasks] = useState<Task[]>([]);
    const [completedTasks, setCompletedTasks] = useState(0);

    // New state for verification mode, not using set yet
    const [agentsInVerificationMode] = useState([]);

    // Helper function to format numbers for display
    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
        return Math.floor(num);
    };

    // Extract all relevant functions from DernierCode for Level 2
    const getAgentCount = (agentTypeId: string): number => {
        return ownedAgents.filter(agent => agent.type === agentTypeId).length;
    };

    const assignTask = (task: Task, agent: Agent) => {
        // Get agent type with null safety
        const agentType = getAgentType(agent.type);

        // Check if agent type exists and if agent can take more tasks
        if (!agentType || agent.currentTasks >= agentType.maxTasks) return;

        // Create new assignment with appropriate status
        const newAssignment = {
            id: `assignment-${Date.now()}`,
            task,
            agent,
            status: agentType.autonomy <= 0.3 ? "pending-verification" : "in-progress",
            verified: agentType.autonomy > 0.5,
            progress: 0,
            startedAt: Date.now()
        };

        // Update agent's task count
        setOwnedAgents(prev =>
            prev.map(a =>
                a.id === agent.id
                    ? { ...a, currentTasks: a.currentTasks + 1 }
                    : a
            )
        );

        // Remove task from incoming tasks
        setIncomingTasks(prev => prev.filter(t => t.id !== task.id));

        // Add to active assignments
        setActiveAssignments(prev => [...prev, newAssignment]);
    };

    const verifyTask = (assignmentId: string) => {
        setActiveAssignments(prev =>
            prev.map(assignment => {
                if (assignment.id === assignmentId) {
                    const agentType = getAgentType(assignment.agent.type);

                    // Add null check
                    if (!agentType) return assignment;

                    // If autonomy > 0.3, auto-complete after verification
                    if (agentType.autonomy > 0.3) {
                        return {
                            ...assignment,
                            status: "in-progress",
                            verified: true
                        };
                    } else {
                        return {
                            ...assignment,
                            status: "verified",
                            verified: true
                        };
                    }
                }
                return assignment;
            })
        );
    };

    // Management tab actions
    const unlockTaskType = (taskType: TaskType) => {
        if (money < taskType.unlockCost) return;

        setMoney(prev => prev - taskType.unlockCost);
        setUnlockedTasks(prev => [...prev, taskType]);
    };

    // Complete task manually
    const completeTask = (assignmentId: string) => {
        setActiveAssignments(prev =>
            prev.map(assignment => {
                if (assignment.id === assignmentId && assignment.status === "verified") {
                    // Release the agent
                    setOwnedAgents(agents =>
                        agents.map(a =>
                            a.id === assignment.agent.id
                                ? { ...a, currentTasks: a.currentTasks - 1 }
                                : a
                        )
                    );

                    // Add money
                    setMoney(m => m + assignment.task.reward);
                    setCompletedTasks(ct => ct + 1);

                    return {
                        ...assignment,
                        status: "completed",
                        progress: 1
                    };
                }
                return assignment;
            })
        );
    };

    // Helpers
    const getTaskType = (taskTypeId: string) => {
        return TASK_TYPES.find(type => type.id === taskTypeId);
    };

    const getAvailableAgents = () => {
        return ownedAgents.filter(agent => {
            const agentType = getAgentType(agent.type);
            if (agentType) {
                return agent.currentTasks < agentType.maxTasks;
            }
        });
    };

    const purchaseAgent = (agentType: AgentType) => {
        if (money < agentType.cost) return;

        setMoney(prev => prev - agentType.cost);

        const newAgent = {
            id: `agent-${Date.now()}`,
            type: agentType.id,
            cost: agentType.cost,
            name: `${agentType.name} #${ownedAgents.length + 1}`,
            efficiency: agentType.efficiency,
            autonomy: agentType.autonomy,
            maxTasks: agentType.maxTasks,
            maxCount: agentType.maxCount,
            currentTasks: 0
        };

        setOwnedAgents(prev => [...prev, newAgent]);
    };

    // Check for automation when purchasing high-level agents
    useEffect(() => {
        // Check if the player has any fully autonomous agents
        const hasAutonomousAgent = ownedAgents.some(agent => {
            const agentType = getAgentType(agent.type);
            return agentType !== undefined && agentType.autonomy >= 0.95;
        });

        if (hasAutonomousAgent && !isFullyAutomated) {
            setIsFullyAutomated(true);
        }

        // Check for level 3 unlock
        const hasSuperAgent = ownedAgents.some(agent => {
            const agentType = getAgentType(agent.type);
            return agentType !== undefined && agentType.autonomy >= 0.99;
        });

        if (hasSuperAgent && !level3Unlocked) {
            setLevel3Unlocked(true);
        }
    }, [ownedAgents, isFullyAutomated, level3Unlocked, setIsFullyAutomated, setLevel3Unlocked]);

    // Auto-run tasks when in fully automated mode
    useEffect(() => {
        if (!isFullyAutomated) return;

        const automationInterval = setInterval(() => {
            // Auto-assign tasks to available agents
            const availableAgents = getAvailableAgents();
            const pendingTasks: Task[] = [...incomingTasks];

            if (availableAgents.length > 0 && pendingTasks.length > 0) {
                // Sort agents by efficiency
                const sortedAgents = [...availableAgents].sort((a, b) => {
                    const aType = getAgentType(a.type);
                    const bType = getAgentType(b.type);
                    return aType !== undefined && bType !== undefined ? bType.efficiency - aType.efficiency : 0;
                });

                // Assign tasks optimally
                sortedAgents.forEach(agent => {
                    if (pendingTasks.length > 0) {
                        const task = pendingTasks.shift();
                        // Add null check before calling assignTask
                        if (task !== undefined) {
                            assignTask(task, agent);
                        }
                    }
                });
            }

            // Auto-purchase new agents if money allows
            if (ownedAgents.length < 10) { // Limit to 10 agents
                // Find the most expensive agent the player can afford
                const affordableAgents = AI_AGENT_TYPES.filter(agent =>
                    agent.cost <= money &&
                    getAgentCount(agent.id) < agent.maxCount // Check against max count per agent type
                );

                if (affordableAgents.length > 0) {
                    // Sort by cost descending
                    const sortedAgents = [...affordableAgents].sort((a, b) => b.cost - a.cost);
                    purchaseAgent(sortedAgents[0]);
                }
            }

            // Auto-unlock new task types
            TASK_TYPES.forEach(taskType => {
                if (money >= taskType.unlockCost &&
                    !unlockedTasks.some(t => t.id === taskType.id)) {
                    unlockTaskType(taskType);
                }
            });
        }, 2000); // Run automation every 2 seconds

        return () => clearInterval(automationInterval);
    }, [isFullyAutomated, incomingTasks, ownedAgents, money, unlockedTasks]);

    // Handle auto-verification from high-autonomy agents
    useEffect(() => {
        if (agentsInVerificationMode.length === 0) return;

        const verificationInterval = setInterval(() => {
            // Get all assignments needing verification
            const pendingVerifications = activeAssignments.filter(
                assignment => assignment.status === "pending-verification"
            );

            if (pendingVerifications.length > 0) {
                // Auto-verify each task, simulating a 1s verification time
                pendingVerifications.forEach(assignment => {
                    verifyTask(assignment.id);
                });
            }
        }, 1000); // Check every second

        return () => clearInterval(verificationInterval);
    }, [agentsInVerificationMode, activeAssignments]);

    // Process incoming tasks
    useEffect(() => {
        // Generate a new task every 15 seconds if there are unlockedTasks
        const taskInterval = setInterval(() => {
            if (unlockedTasks.length > 0) {
                const randomTaskType = unlockedTasks[Math.floor(Math.random() * unlockedTasks.length)];
                const reward = Math.floor(
                    randomTaskType.minReward +
                    Math.random() * (randomTaskType.maxReward - randomTaskType.minReward)
                );

                const newTask = {
                    id: `task-${Date.now()}`,
                    type: randomTaskType.id,
                    name: `${randomTaskType.name} Task`,
                    description: `A ${randomTaskType.name.toLowerCase()} task that needs to be completed.`,
                    reward,
                    complexity: randomTaskType.complexity,
                    timeToComplete: randomTaskType.timeRequired,
                    expiresIn: 300, // 5 minutes in seconds
                    status: "available"
                };

                setIncomingTasks(prev => [...prev, newTask]);
            }
        }, 15000);

        // Update task timers and progress every second
        const progressInterval = setInterval(() => {
            // Update assignment progress
            setActiveAssignments(prev =>
                prev.map(assignment => {
                    const agentType = getAgentType(assignment.agent.type);

                    if (assignment.status === "in-progress") {
                        // Calculate progress increment based on agent efficiency
                        const newProgress = assignment.progress +
                            (agentType.efficiency / assignment.task.timeToComplete);

                        if (newProgress >= 1) {
                            // Task completed automatically if agent has sufficient autonomy
                            setMoney(m => m + assignment.task.reward);
                            setCompletedTasks(ct => ct + 1);

                            // Release the agent
                            setOwnedAgents(agents =>
                                agents.map(a =>
                                    a.id === assignment.agent.id
                                        ? { ...a, currentTasks: a.currentTasks - 1 }
                                        : a
                                )
                            );

                            return { ...assignment, progress: 1, status: "completed" };
                        }

                        return { ...assignment, progress: newProgress };
                    }

                    // Auto-complete verified tasks for agents with autonomy > 0.3
                    if (assignment.status === "verified" && agentType.autonomy > 0.3) {
                        const newProgress = assignment.progress +
                            (agentType.efficiency / assignment.task.timeToComplete);

                        if (newProgress >= 1) {
                            // Complete the task
                            setMoney(m => m + assignment.task.reward);
                            setCompletedTasks(ct => ct + 1);

                            // Release the agent
                            setOwnedAgents(agents =>
                                agents.map(a =>
                                    a.id === assignment.agent.id
                                        ? { ...a, currentTasks: a.currentTasks - 1 }
                                        : a
                                )
                            );

                            return { ...assignment, progress: 1, status: "completed" };
                        }

                        return { ...assignment, progress: newProgress };
                    }

                    return assignment;
                })
            );

            // Update task expiration timers
            setIncomingTasks(prev =>
                prev.filter(task => {
                    const newExpiresIn = task.expiresIn - 1;
                    if (newExpiresIn <= 0) return false;
                    task.expiresIn = newExpiresIn;
                    return true;
                })
            );

            // Remove completed tasks after a while
            setActiveAssignments(prev =>
                prev.filter(assignment => {
                    if (assignment.status === "completed") {
                        // Keep completed tasks visible for 5 seconds
                        if (!assignment.completedAt) {
                            assignment.completedAt = Date.now();
                            return true;
                        }

                        // Remove after 5 seconds
                        return (Date.now() - assignment.completedAt) < 5000;
                    }
                    return true;
                })
            );
        }, 1000);

        return () => {
            clearInterval(taskInterval);
            clearInterval(progressInterval);
        };
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left panel: AI Agents */}
            <div className="bg-gray-800 rounded-lg p-4 flex flex-col">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                    <Users size={18} className="mr-2" />
                    AI Agents {isFullyAutomated && <span className="ml-2 text-xs bg-green-600 px-2 py-1 rounded">Auto-Managing</span>}
                </h2>

                {ownedAgents.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        No AI agents yet. Purchase your first agent!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        {ownedAgents.map(agent => {
                            const agentType = getAgentType(agent.type);
                            return (
                                <div key={agent.id} className="bg-gray-700 p-3 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-sm">{agent.name}</span>
                                        <span className={`text-xs px-2 py-1 rounded ${
                                            agent.currentTasks >= agentType.maxTasks
                                                ? 'bg-red-600'
                                                : 'bg-green-600'
                                        }`}>
                    {agent.currentTasks}/{agentType.maxTasks}
                  </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-1 mt-2 text-xs text-gray-300">
                                        <div>Eff: {agentType.efficiency.toFixed(2)}</div>
                                        <div>Auto: {agentType.autonomy.toFixed(2)}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <h3 className="font-bold mt-4 mb-2">Purchase New Agents</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {AI_AGENT_TYPES.filter(agent =>
                        !ownedAgents.some(owned => owned.type === agent.id) ||
                        agent.id === 'autonomous' ||
                        agent.id === 'superintelligent'
                    ).map(agentType => (
                        <button
                            key={agentType.id}
                            onClick={() =>  purchaseAgent(agentType)}
                            disabled={money < agentType.cost}
                            className={`py-2 px-3 rounded text-left text-sm ${
                                money >= agentType.cost && !isFullyAutomated
                                    ? 'bg-blue-600 hover:bg-blue-700'
                                    : 'bg-gray-700 cursor-not-allowed opacity-70'
                            }`}
                        >
                            <div className="flex justify-between">
                                <span>{agentType.name}</span>
                                <span>${formatNumber(agentType.cost)}</span>
                            </div>
                            <div className="text-xs text-gray-300 mt-1">
                                Autonomy: {agentType.autonomy.toFixed(2)}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Center panel: Tasks & Assignments */}
            <div className="bg-gray-800 rounded-lg p-4 flex flex-col col-span-2">
                <div className="flex mb-4">
                    <div className="w-1/2 pr-2">
                        <h2 className="text-xl font-bold mb-3 flex items-center">
                            <Zap size={18} className="mr-2" />
                            Available Tasks
                        </h2>

                        {incomingTasks.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 bg-gray-900 rounded-lg">
                                No available tasks right now...
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                {incomingTasks.map(task => {
                                    return (
                                        <div key={task.id} className="bg-gray-700 p-3 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">{task.name}</span>
                                                <span className="text-green-400">${formatNumber(task.reward)}</span>
                                            </div>
                                            <p className="text-xs text-gray-300 mt-1">
                                                {task.description}
                                            </p>
                                            <div className="flex justify-between items-center mt-2">
                                                <div className="text-xs">
                                                    Expires in: <span className="text-yellow-400">{Math.floor(task.expiresIn / 60)}:{(task.expiresIn % 60).toString().padStart(2, '0')}</span>
                                                </div>
                                                <div className="flex">
                                                    {getAvailableAgents().length > 0 ? (
                                                        <div className="relative">
                                                            <select
                                                                className="bg-gray-800 text-white text-xs border border-gray-600 rounded py-1 px-2"
                                                                onChange={(e) => {
                                                                    const agentId = e.target.value;
                                                                    if (agentId) {
                                                                        const agent = ownedAgents.find(a => a.id === agentId);
                                                                        if (agent) assignTask(task, agent);
                                                                    }
                                                                }}
                                                                defaultValue=""
                                                                disabled={isFullyAutomated}
                                                            >
                                                                <option value="" disabled>Assign agent...</option>
                                                                {getAvailableAgents().map(agent => (
                                                                    <option key={agent.id} value={agent.id}>
                                                                        {agent.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-gray-400">No available agents</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="w-1/2 pl-2">
                        <h2 className="text-xl font-bold mb-3 flex items-center">
                            <Cpu size={18} className="mr-2" />
                            Active Assignments
                        </h2>

                        {activeAssignments.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 bg-gray-900 rounded-lg">
                                No active assignments yet...
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                {activeAssignments.map(assignment => {
                                    return (
                                        <div
                                            key={assignment.id}
                                            className={`p-3 rounded-lg ${
                                                assignment.status === 'completed'
                                                    ? 'bg-green-900'
                                                    : assignment.status === 'verified'
                                                        ? 'bg-blue-900'
                                                        : assignment.status === 'pending-verification'
                                                            ? 'bg-yellow-900'
                                                            : 'bg-gray-700'
                                            }`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">{assignment.task.name}</span>
                                                <span className="text-green-400">${formatNumber(assignment.task.reward)}</span>
                                            </div>
                                            <div className="text-xs text-gray-300 mt-1">
                                                Agent: {assignment.agent.name}
                                            </div>

                                            {assignment.status === 'pending-verification' ? (
                                                <div className="mt-2 flex space-x-2">
                                                    <button
                                                        onClick={() => !isFullyAutomated && verifyTask(assignment.id)}
                                                        disabled={isFullyAutomated}
                                                        className={`w-full py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-xs ${isFullyAutomated ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        Verify Task
                                                    </button>
                                                </div>
                                            ) : assignment.status === 'verified' ? (
                                                <div className="mt-2 flex space-x-2">
                                                    <button
                                                        onClick={() => !isFullyAutomated && completeTask(assignment.id)}
                                                        disabled={isFullyAutomated}
                                                        className={`w-full py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs ${isFullyAutomated ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        Complete Task
                                                    </button>
                                                </div>
                                            ) : assignment.status === 'in-progress' ? (
                                                <div className="mt-2">
                                                    <div className="flex justify-between text-xs text-gray-300 mb-1">
                                                        <span>Progress</span>
                                                        <span>{Math.floor(assignment.progress * 100)}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-900 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-500 h-2 rounded-full"
                                                            style={{ width: `${assignment.progress * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="mt-2 text-center py-1 bg-green-700 rounded text-xs">
                                                    Completed! +${formatNumber(assignment.task.reward)}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <h2 className="text-xl font-bold mt-4 mb-3 flex items-center">
                    <PieChart size={18} className="mr-2" />
                    Task Types
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {TASK_TYPES.map((taskType) => {
                        const isUnlocked = unlockedTasks.some(t => t.id === taskType.id);
                        return (
                            <div
                                key={taskType.id}
                                className={`p-3 rounded-lg ${
                                    isUnlocked
                                        ? 'bg-gray-700'
                                        : 'bg-gray-800 border border-gray-700'
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">{taskType.name}</span>
                                    <span className="text-xs px-2 py-1 rounded bg-blue-600">
                Level {taskType.complexity}
              </span>
                                </div>
                                <p className="text-xs text-gray-300 my-2">
                                    {taskType.description}
                                </p>
                                <div className="text-xs text-gray-300 mb-2">
                                    Reward: ${formatNumber(taskType.minReward)} - ${formatNumber(taskType.maxReward)}
                                </div>

                                {!isUnlocked ? (
                                    <button
                                        onClick={() => !isFullyAutomated && unlockTaskType(taskType)}
                                        disabled={money < taskType.unlockCost || isFullyAutomated}
                                        className={`w-full py-1 px-2 rounded text-center text-xs ${
                                            money >= taskType.unlockCost && !isFullyAutomated
                                                ? 'bg-green-600 hover:bg-green-700'
                                                : 'bg-gray-600 cursor-not-allowed'
                                        }`}
                                    >
                                        Unlock for ${formatNumber(taskType.unlockCost)}
                                    </button>
                                ) : (
                                    <div className="text-center py-1 bg-green-700 rounded text-xs">
                                        Unlocked
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Level2;