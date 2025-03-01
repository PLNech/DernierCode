// components/DernierCode.tsx
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Code, Users, PieChart, Zap, Cpu, Briefcase } from 'lucide-react';
import { usePathname } from 'next/navigation'
import { CODE_SAMPLES } from '../data/code'
import Level3 from './Level3';

// Type definitions for better TypeScript support
type QualityLevel = 'low' | 'medium' | 'high' | 'extreme';

const QUALITY_COLORS: Record<QualityLevel, string> = {
  low: "text-gray-500",
  medium: "text-blue-500",
  high: "text-purple-500",
  extreme: "text-pink-600 font-bold"
};

interface Model {
  name: string;
  cost: number;
  autoCodePerSecond: number;
  quality: QualityLevel;
  capabilities: string[];
}


interface AgentType {
  id: string;
  name: string;
  cost: number;
  efficiency: number;
  autonomy: number;
  maxTasks: number;
  maxCount: number;
}

interface Agent {
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

interface Task {
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

interface Assignment {
  id: string;
  task: Task;
  agent: Agent;
  status: string;
  verified: boolean;
  progress: number;
  startedAt: number;
  completedAt?: number;
}

interface TaskType {
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



// AI models data with renamed "tools" to "capabilities"
const AI_MODELS: Model[] = [
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
const TASK_TYPES: TaskType[] = [
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
const AI_AGENT_TYPES: AgentType[] = [
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

// Syntax highlighting function - simplistic version
const syntaxHighlight = (code: string) => {
  if (!code) return '';

  // Make a copy of the code to avoid modifying the original
  let highlightedCode = code;

  try {
    // Replace comments - do this first since they can contain other syntax elements
    highlightedCode = highlightedCode.replace(
      /(\/\/.*|\/\*[\s\S]*?\*\/|#.*)/g,
      '<span className="text-green-500">$1</span>'
    );
    //
    // // Replace strings - be careful with escaped quotes
    // highlightedCode = highlightedCode.replace(
    //   /(['"`])(?:\\\1|.)*?\1/g,
    //   match => `<span class="text-yellow-300">${match}</span>`
    // );
    //
    // // Replace numbers
    // highlightedCode = highlightedCode.replace(
    //   /\b(\d+(?:\.\d+)?)\b/g,
    //   '<span class="text-purple-300">$1</span>'
    // );

    // Replace keywords (basic list)
    const keywords = [
      'function', 'const', 'let', 'var', 'class', 'struct', 'enum', 'if', 'else',
      'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'return',
      'void', 'int', 'float', 'double', 'boolean', 'string', 'import', 'from', 'export',
      'fn', 'pub', 'impl', 'use', 'package', 'func', 'type', 'interface', 'defer',
      'async', 'await', 'try', 'catch', 'throw', 'new', 'this', 'super', 'static',
      'public', 'private', 'protected', 'final', 'override', 'extends', 'implements'
    ];

    const keywordPattern = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    highlightedCode = highlightedCode.replace(
      keywordPattern,
      '<span class="text-blue-400">$1</span>'
    );

    return highlightedCode;
  } catch (error) {
    // If any error occurs during highlighting, just return the original code
    console.error("Error highlighting code:", error);
    return code;
  }
};

const DernierCode = () => {
  // Game state
  const [codeLines, setCodeLines] = useState(0);
  const [incrementFactor, setIncrementFactor] = useState(5);
  const [money, setMoney] = useState(0);
  const [moneyTimer, setMoneyTimer] = useState(5);
  const [activeModel, setActiveModel] = useState<Model>();
  const [aiCodeShare, setAiCodeShare] = useState(0);
  const [showUpgradesModal, setShowUpgradesModal] = useState(false);
  const [highlightedText, setHighlightedText] = useState('');
  const [activeTab, setActiveTab] = useState("code"); // 'code' or 'management'
  const [showShortcutHelp, setShowShortcutHelp] = useState(false);
  const [managementUnlocked, setManagementUnlocked] = useState(false);
  const [isFullyAutomated, setIsFullyAutomated] = useState(false);
  const [level3Unlocked, setLevel3Unlocked] = useState(false);
  const [observationMode, setObservationMode] = useState(false);
  const [aiSharePrecision, setAiSharePrecision] = useState(2);
  const [targetAiShare, setTargetAiShare] = useState(0);

  // Management tab state
  const [unlockedTasks, setUnlockedTasks] = useState([TASK_TYPES[0]]);
  const [ownedAgents, setOwnedAgents] = useState<Agent[]>([]);
  const [activeAssignments, setActiveAssignments] = useState<Assignment[]>([]);
  const [incomingTasks, setIncomingTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState(0);

  // New state for verification mode, not using set yet
  const [agentsInVerificationMode,] = useState([]);

  // Code display state
  const [visibleCodeSample, setVisibleCodeSample] = useState(0);
  const [currentCodeText, setCurrentCodeText] = useState('');
  const [typingPosition, setTypingPosition] = useState(0);
  const [isAIWriting, setIsAIWriting] = useState(false);

  // Ref to track latest codeLines value
  const codeLinesRef = useRef(codeLines);
  const gameContainerRef = useRef(null);
  const codeRef = useRef(null);
  
  const pathname = usePathname();


  const getAgentCount = (agentTypeId: string): number => {
    return ownedAgents.filter(agent => agent.type === agentTypeId).length;
  };

  // Update highlighted text when code changes
  const updateHighlightedText = (text: string) => {
    const highlighted = syntaxHighlight(
      text
    );
    setHighlightedText(highlighted);
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

  // Also need to fix the verifyTask function with similar null checking:
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

  const getAgentType = (agentTypeId: string) => {
  // FIXME AVOID NULLABLE WITHOUT DEFAULTING TO FIRST ONE
    return AI_AGENT_TYPES.find(type => type.id === agentTypeId) || AI_AGENT_TYPES[0];
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

  // Helper function to format numbers for display
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return Math.floor(num);
  };


  const purchaseModel = (model: Model) => {
    if (money < model.cost) return;

    setMoney(prev => prev - model.cost);
    setActiveModel(model);
    updateAICodeShare();

    // Check if this model unlocks management
    if (model.capabilities.includes('agentic')) {
      setManagementUnlocked(true);
    }
  };

    // Function to update AI code share percentage
    const updateAICodeShare = () => {
      if (!activeModel) {
        setAiCodeShare(0);
        return;
      }

      // Don't update if in observation mode
      if (observationMode) return;

      // Calculate AI code share based on active model and total code
      const manualCode = incrementFactor * 3; // Rough estimate of manual capacity
      const aiCode = activeModel.autoCodePerSecond;
      const percentage = (aiCode / (aiCode + manualCode)) * 100;
      setAiCodeShare(Math.min(percentage, 99.99));
    };

    // Function to type next characters in the code sample
    const typeNextCharacters = (count: number) => {
      const currentSample = CODE_SAMPLES[visibleCodeSample];
      const sampleCode = currentSample.code;

      if (typingPosition >= sampleCode.length) {
        // Move to next code sample when current one is complete
        const nextSample = (visibleCodeSample + 1) % CODE_SAMPLES.length;
        setVisibleCodeSample(nextSample);
        setTypingPosition(0);
        setCurrentCodeText('');
        updateHighlightedText('');
        return;
      }

      // Type next characters
      const nextPosition = Math.min(typingPosition + count, sampleCode.length);
      const newText = sampleCode.substring(0, nextPosition);
      setCurrentCodeText(newText);
      updateHighlightedText(newText);
      setTypingPosition(nextPosition);
    };

    // Calculate refactor bonus
    const calculateRefactorBonus = () => {
      if (codeLines < 20) return 0;
      return Math.max(1, Math.floor(Math.log10(codeLines)));
    };

    // Game actions
    const writeCode = () => {
      console.log('Had', codeLines, ' LoC, now ', codeLines + incrementFactor);
      setCodeLines(prev => prev + incrementFactor);

      // Ensure typing works correctly by handling current state
      const currentSample = CODE_SAMPLES[visibleCodeSample];
      const sampleCode = currentSample.code;
      const typingChars = Math.ceil(incrementFactor / 2);

      // Special handling for typing to avoid UI glitches
      if (typingPosition >= sampleCode.length) {
        // If we're at the end, move to next sample
        console.log(`Code: we're at the end, move to next sample`, visibleCodeSample+1);
        const nextSample = (visibleCodeSample + 1) % CODE_SAMPLES.length;
        setVisibleCodeSample(nextSample);
        setTypingPosition(0);
        setCurrentCodeText('');
        updateHighlightedText('');
      } else {
        // Otherwise type next characters
        console.log(`posChar `, typingPosition + typingChars, ` saLe `, sampleCode.length);
        const nextPosition = Math.min(typingPosition + typingChars, sampleCode.length);
        const newText = sampleCode.substring(0, nextPosition);
        setCurrentCodeText(newText);
        updateHighlightedText(newText);
        setTypingPosition(nextPosition);
        console.log(`Current code: `, newText);
      }

      updateAICodeShare();
    };

    const refactorCode = () => {
      if (codeLines < 20) return;

      // Refactoring bonus scales with log of code lines
      const bonus = calculateRefactorBonus();
      setIncrementFactor(prev => prev + bonus);

      // Reset the code lines counter but keep the current code display
      setTypingPosition(0);
      setCurrentCodeText('');
      updateHighlightedText('');

      // Don't reset typing position or current code - just update AI code share
      // updateAICodeShare();
    };

  //
  // // Initialize code sample
  // useEffect(() => {
  //   setCurrentCodeText('');
  //   setTypingPosition(0);
  //   updateHighlightedText('');
  // }, [visibleCodeSample, updateHighlightedText]);

  // Auto-scrolling for code view
  // FIXME: Type error: Property 'scrollTop' does not exist on type 'never'.
  // useEffect(() => {
  //   if (codeRef.current) {
  //     codeRef.current.scrollTop = codeRef.current.scrollHeight;
  //   }
  // }, [highlightedText]);

  // Keep codeLinesRef updated with latest codeLines value
  useEffect(() => {
    codeLinesRef.current = codeLines;
  }, [codeLines]);

  // Check if observation mode should be activated
  useEffect(() => {
    if (aiCodeShare >= 90 && !observationMode) {
      setObservationMode(true);
      setTargetAiShare(99);
      setAiSharePrecision(2);
    }
  }, [aiCodeShare, observationMode]);

  // Handle observation mode animation
  useEffect(() => {
    if (!observationMode) return;

    const animationSteps = {
      1: { target: 99, precision: 2, duration: 7000 },
      2: { target: 99.9, precision: 3, duration: 7000 },
      3: { target: 99.99, precision: 4, duration: 6000 },
      4: { target: 99.999, precision: 5, duration: 4000 },
      5: { target: 99.9999, precision: 6, duration: 3000 },
      6: { target: 99.99999, precision: 7, duration: 3000 }
    };

    let currentStep = 1;
    let timer: number | undefined;

    const runAnimation = () => {
      if (!animationSteps[currentStep as keyof typeof animationSteps]) return;

      const { target, precision, duration } = animationSteps[currentStep as keyof typeof animationSteps];
      setTargetAiShare(target);
      setAiSharePrecision(precision);

      // Gradually increase AI share to target
      const startValue = aiCodeShare;
      const startTime = Date.now();

      const update = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Use easeOut for smoother animation at the end
        const easeOutProgress = 1 - Math.pow(1 - progress, 3);

        const newValue = startValue + (target - startValue) * easeOutProgress;
        setAiCodeShare(newValue);

        if (progress < 1) {
          timer = requestAnimationFrame(update);
        } else {
          // Move to next step
          currentStep++;
          if (animationSteps[currentStep as keyof typeof animationSteps]) {
            setTimeout(runAnimation, 1000); // Pause between steps
          }
        }
      };

      timer = requestAnimationFrame(update);
    };

    runAnimation();

    return () => {
      if (timer) cancelAnimationFrame(timer);
    };
  }, [observationMode]);

  // Check if management tab should be unlocked
  useEffect(() => {
    if (activeModel &&
      activeModel.capabilities.includes('agentic') &&
      !managementUnlocked) {
      setManagementUnlocked(true);
      }
  }, [activeModel, managementUnlocked]);

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
  }, [ownedAgents, isFullyAutomated, level3Unlocked]);

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
  }, [isFullyAutomated, incomingTasks, ownedAgents, money, unlockedTasks, assignTask, getAvailableAgents, purchaseAgent, unlockTaskType]);

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
  }, [agentsInVerificationMode, activeAssignments, verifyTask]);

  // Keyboard shortcuts with new additions
  useEffect(() => {
    const handleKeyDown = (e: any) => { // FIXME Type this event
      // Don't trigger shortcuts if user is typing in an input
      if (e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.tagName === 'SELECT') {
        return;
        }

        // Close modal with Escape key
        if (e.key === 'Escape') {
          if (showUpgradesModal) {
            setShowUpgradesModal(false);
            return;
          }
        }

        // Debug button shortcut (D key) - works in any tab
        if (e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          setMoney(prev => prev + 10000000000); // Add 10 billion
          return;
        }

        switch (activeTab) {
          case 'code':
            switch (e.key) {
              case ' ': // Spacebar
                e.preventDefault(); // Prevent page scroll
                writeCode();
                break;
              case 'r':
              case 'R':
                if (codeLines >= 20) refactorCode();
                break;
              case 'u':
              case 'U':
                setShowUpgradesModal(!showUpgradesModal);
                break;
              case 'm':
              case 'M':
                if (managementUnlocked) setActiveTab('management');
                break;
              case '?':
                setShowShortcutHelp(prev => !prev);
                break;
              default:
                // Numeric keys for purchasing upgrades
                if (showUpgradesModal && /^[1-9]$/.test(e.key)) {
                  const modelIndex = parseInt(e.key) - 1;
                  if (modelIndex >= 0 && modelIndex < AI_MODELS.length) {
                    const model = AI_MODELS[modelIndex];
                    if (money >= model.cost && activeModel?.name !== model.name) {
                      purchaseModel(model);
                    }
                  }
                }
                break;
            }
            break;

          case 'management':
            switch (e.key) {
              case 'c':
              case 'C':
                setActiveTab('code');
                break;
              case '?':
                setShowShortcutHelp(prev => !prev);
                break;
              case '1':
              case '2':
              case '3':
              case '4':
              case '5':
              case '6':
              case '7':
              case '8':
              case '9':
                // Quick assign task to agent by number (extended to 9 agents)
                if (incomingTasks.length > 0 && ownedAgents.length >= parseInt(e.key)) {
                  const agentIndex = parseInt(e.key) - 1;
                  const agent = ownedAgents[agentIndex];
                  const task = incomingTasks[0];

                  if (agent && task && agent.currentTasks < getAgentType(agent.type).maxTasks) {
                    assignTask(task, agent);
                  }
                }
                break;
              default:
                break;
            }
            break;

          default:
            break;
        }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    activeTab,
    codeLines,
    showUpgradesModal,
    incomingTasks,
    ownedAgents,
    managementUnlocked,
    money,
    activeModel,
    assignTask,
    purchaseModel,
    refactorCode,
    writeCode
  ]);

  // Auto-increment from AI models with improved typing animation
  useEffect(() => {
    if (!activeModel) {
      setIsAIWriting(false);
      return;
    }

    setIsAIWriting(true);

    // Set up an interval to animate the code typing
    const interval = setInterval(() => {
      // Add to code lines based on model speed
      const aiIncrement = activeModel.autoCodePerSecond / 10;
      setCodeLines(prev => prev + aiIncrement);

      // Make typing speed much more visible by increasing characters typed per tick
      // This makes the AI writing more noticeable to the player
      const typingSpeed = Math.max(5, Math.floor(aiIncrement / 0.5));
      typeNextCharacters(typingSpeed);

      updateAICodeShare();
    }, 50); // Faster interval for smoother animation

    return () => {
      clearInterval(interval);
      setIsAIWriting(false);
    };
  }, [activeModel, visibleCodeSample, typeNextCharacters, updateAICodeShare]);

  // Timer for money generation
  useEffect(() => {
    const timer = setInterval(() => {
      setMoneyTimer(prev => {
        if (prev <= 0) {
          // Use the ref to get the latest codeLines value
          const currentCodeLines = codeLinesRef.current;
          setMoney(prevMoney => {
            console.log(`Adding ${Math.floor(currentCodeLines)} to money from ${prevMoney}`);
            return prevMoney + Math.floor(currentCodeLines);
          });
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Process incoming tasks
  useEffect(() => {
    // Generate a new task every 15 seconds if there are unlockedTasks
    const taskInterval = setInterval(() => {
      if (unlockedTasks.length > 0 && activeTab === "management") {
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
  }, [activeTab]);

  return (
    <div
      className="flex flex-col min-h-screen bg-gray-900 text-white p-4"
      ref={gameContainerRef}
      tabIndex={0} // Make container focusable
    >
      <div className="flex justify-between items-center mb-4">
        <div className="text-center flex-grow">
          <h2 className="text-gray-400">En 2025, plus tu codes, moins tu codes.</h2>
          <button
            className="mt-2 text-xs bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded"
            onClick={() => setShowShortcutHelp(!showShortcutHelp)}
          >
            {showShortcutHelp ? 'Hide Shortcuts' : 'Show Keyboard Shortcuts (?)'}
          </button>
        </div>
        <button
          className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-white text-xs font-bold"
          onClick={() => setMoney(prev => prev + 10000000000)} // Add 10 billion
          hidden={pathname.includes("localhost")} // ONLY ON LOCALHOST URL
          data-name={"DEBUG"}
        >
          D#BUG
        </button>
      </div>

      {/* Shortcuts Help */}
      {showShortcutHelp && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4 text-sm">
          <h3 className="font-bold mb-2">Keyboard Shortcuts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-blue-400">Code Generation Tab</h4>
              <ul className="list-disc pl-5 text-gray-300">
                <li><span className="bg-gray-700 px-1 rounded">Space</span> - Write Code</li>
                <li><span className="bg-gray-700 px-1 rounded">R</span> - Refactor Code</li>
                <li><span className="bg-gray-700 px-1 rounded">U</span> - Toggle Upgrades Panel</li>
                <li><span className="bg-gray-700 px-1 rounded">M</span> - Switch to Management Tab</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-400">Management Tab</h4>
              <ul className="list-disc pl-5 text-gray-300">
                <li><span className="bg-gray-700 px-1 rounded">C</span> - Switch to Code Tab</li>
                <li><span className="bg-gray-700 px-1 rounded">1-5</span> - Quick Assign Task to Agent #</li>
              </ul>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Press <span className="bg-gray-700 px-1 rounded">?</span> anytime to toggle this help
          </div>
        </div>
      )}

      {/* Tab selection */}
      <div className="flex mb-6 border-b border-gray-700">
        <button
            className={`py-2 px-4 mr-2 ${activeTab === 'code' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'} rounded-t-lg`}
            onClick={() => setActiveTab('code')}
        >
          <Code size={16} className="inline mr-2" />
          Code Generation <span className="text-xs opacity-75">[C]</span>
        </button>
        <button
            className={`py-2 px-4 ${activeTab === 'management' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'} rounded-t-lg flex items-center ${!managementUnlocked ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={() => managementUnlocked && setActiveTab('management')}
            disabled={!managementUnlocked}
        >
          <Briefcase size={16} className="inline mr-2" />
          {managementUnlocked ? (
              <>AI Management <span className="text-xs opacity-75">[M]</span></>
          ) : (
              <>??? <span className="ml-2 text-xs bg-gray-700 px-2 py-1 rounded">
              Requires AI with 'agentic' capability
            </span></>
          )}
        </button>
        <button
            className={`py-2 px-4 ml-2 ${level3Unlocked ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 opacity-50'} rounded-t-lg`}
            onClick={() => level3Unlocked && setActiveTab('trading')}
            disabled={!level3Unlocked}
        >
          <Zap size={16} className="inline mr-2" />
          {level3Unlocked ? (
              <>Trading <span className="text-xs bg-purple-800 px-2 py-1 rounded ml-1">Unlocked</span></>
          ) : (
              <>??? <span className="ml-2 text-xs bg-gray-700 px-2 py-1 rounded">Locked</span></>
          )}
        </button>
      </div>

      {/* Shared stats bar */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-8 m-2 text-xl">
          <div>
            <span className="text-gray-400">Code Lines:</span>
            <span className="ml-2 font-bold text-3xl">{formatNumber(codeLines)}</span>
            <span className="text-gray-400 m-3 text-purple-400 text-2xl">(+{formatNumber(incrementFactor)})</span>
          </div>

          <div>
            <span className="text-gray-400">Money:</span>
            <span className="ml-2 font-bold2 text-green-600 text-3xl">${formatNumber(money)}</span>
          </div>

          <div>
            <span className="text-gray-400">AI Model:</span>
            <span className={`ml-2 ${activeModel ? QUALITY_COLORS[activeModel.quality] : 'text-gray-500'}`}>
              {activeModel ? activeModel.name : 'None'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div>
            <span className="text-gray-400 text-xl">AI Code Share:</span>
            <span className="ml-2 font-bold text-green-400 text-4xl">{aiCodeShare.toFixed(aiSharePrecision)}%</span>
          </div>
          <div>
            <span className="text-gray-400 text-xl">Human Code Share:</span>
            <span className="ml-2 font-bold text-red-400 text-4xl">{(100 - aiCodeShare).toFixed(aiSharePrecision)}%</span>
          </div>

          {activeTab === 'management' && (
            <div>
              <span className="text-gray-400">Tasks Completed:</span>
              <span className="ml-2 font-bold text-green-400">{completedTasks}</span>
            </div>
          )}
        </div>
      </div>

      {/* Code Generation Tab */}
      {activeTab === 'code' && (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left panel: Controls (50%) */}
          <div className="bg-gray-800 rounded-lg p-4 flex flex-col md:w-1/2">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Code Generation</h3>
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Code Money in {moneyTimer}s</span>
                <span>+${formatNumber(codeLinesRef.current)}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${((5 - moneyTimer) / 5) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="mb-6">
              <div className="font-bold flex justify-between items-center text-sm">
                <span>AI CODE SHARE:</span>
                <span className={`${observationMode ? "text-yellow-400 animate-pulse" : "text-green-400"}`}>
                  {aiCodeShare.toFixed(aiSharePrecision)}%
                </span>
              </div>
              {observationMode && (
                <div className="text-xs text-center bg-yellow-600/20 text-yellow-400 px-1 py-1 rounded mt-1 mb-2">
                  OBSERVATION MODE
                </div>
              )}
              <div className="w-full bg-gray-700 rounded-full h-3 mt-2">
                <div
                  className={`h-3 rounded-full ${observationMode ? "bg-yellow-500" : "bg-green-500"}`}
                  style={{ width: `${Math.min(aiCodeShare, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={writeCode}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md transition flex justify-between items-center"
              >
                <span>Write Code <span className="text-xs opacity-75">[Space]</span></span>
                <span className="bg-blue-800 px-2 py-1 rounded text-xs">+{incrementFactor}</span>
              </button>

              <button
                onClick={refactorCode}
                className={`w-full py-2 px-4 rounded-md transition flex justify-between items-center ${
                  codeLines >= 20
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-gray-700 cursor-not-allowed'
              }`}
              disabled={codeLines < 20}
            >
              <span>Refactor Code <span className="text-xs opacity-75">[R]</span></span>
              <span className="bg-purple-800 px-2 py-1 rounded text-xs">
                +{calculateRefactorBonus()}
              </span>
            </button>

            <button
              onClick={() => setShowUpgradesModal(!showUpgradesModal)}
              className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-md transition text-xl"
            >
              {showUpgradesModal ? 'Hide Upgrades' : 'Show Upgrades'} <span className="text-xs opacity-75">[U]</span>
            </button>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Current AI Model</h3>
            {activeModel ? (
              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <h3 className={`font-bold text-sm ${QUALITY_COLORS[activeModel.quality]}`}>{activeModel.name}</h3>
                  <span className="text-xs bg-blue-600 px-2 py-1 rounded">
                    {activeModel.autoCodePerSecond}/sec
                  </span>
                </div>
                <div className="text-xs text-gray-300">
                  {activeModel.capabilities.length > 0 && (
                    <div>Capabilities: {activeModel.capabilities.join(', ')}</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-3 bg-gray-700 rounded-lg text-gray-400 text-sm">
                No AI model active
              </div>
            )}
          </div>
        </div>

        {/* Right panel: Code writing visualization (50%) */}
        <div className="bg-gray-800 rounded-lg overflow-hidden flex flex-col md:w-1/2">
          <div className="bg-gray-900 py-2 px-4 flex items-center justify-between border-b border-gray-700">
            <div className="flex items-center">
              <Terminal size={16} className="mr-2" />
              <span className="text-sm">
                {CODE_SAMPLES[visibleCodeSample].filename} - {CODE_SAMPLES[visibleCodeSample].language}
              </span>
            </div>
            <div className="flex items-center">
              {isAIWriting && !observationMode && (
                <span className="text-xs bg-green-600 text-white px-2 py-1 rounded mr-2 animate-pulse flex items-center">
                  <span className="inline-block h-2 w-2 rounded-full bg-white mr-1 animate-ping"></span>
                  AI Writing... ({formatNumber(activeModel?.autoCodePerSecond || 0)}/sec)
                </span>
              )}
              {observationMode && (
                <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded mr-2 animate-pulse flex items-center">
                  <span className="inline-block h-2 w-2 rounded-full bg-white mr-1 animate-ping"></span>
                  Observing AI...
                </span>
              )}
              <div className="text-xs text-gray-500">
                {typingPosition}/{CODE_SAMPLES[visibleCodeSample].code.length} chars
              </div>
            </div>
          </div>

          <div
            ref={codeRef}
            className="p-4 font-mono text-sm overflow-y-auto h-[calc(100vh-250px)]"
            style={{
              whiteSpace: 'pre-wrap',
              backgroundColor: '#0d1117',
              minHeight: '400px'
            }}
            dangerouslySetInnerHTML={{ __html: highlightedText }}
          />
        </div>
      </div>
    )}

    {/* AI Management Tab */}
    {activeTab === 'management' && (
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
                onClick={() => !isFullyAutomated && purchaseAgent(agentType)}
                disabled={money < agentType.cost || isFullyAutomated}
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
                  // const taskType = getTaskType(task.type); TODO Leverage taskType, at least display, maybe gamify
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
                  // const taskType = getTaskType(assignment.task.type); TODO Gamify or at least display
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
  )}

    {activeTab === 'trading' && level3Unlocked && (
      <Level3 />
    )}

  {/* Upgrades Modal */}
  {showUpgradesModal && (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-4 max-w-2xl w-full max-h-[70vh] flex flex-col">
        <div className="flex justify-between items-center mb-3 sticky top-0 bg-gray-800 pb-2 border-b border-gray-700">
          <h2 className="text-xl font-bold">AI Models</h2>
          <button
            onClick={() => setShowUpgradesModal(false)}
            className="text-gray-400 hover:text-white p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-grow pr-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {AI_MODELS.map((model) => (
              <div
                key={model.name}
                className={`border rounded-md p-3 ${
                  money >= model.cost * 0.5
                  ? 'border-gray-600'
                  : 'border-gray-800 opacity-50'
              } ${activeModel?.name === model.name ? 'border-green-500 bg-gray-700' : ''}`}
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className={`font-bold text-sm ${QUALITY_COLORS[model.quality]}`}>{model.name}</h3>
                <span className="text-xs text-gray-400">
                  ${formatNumber(model.cost)}
                </span>
              </div>

              <div className="text-xs text-gray-400 mb-2">
                <div className="flex justify-between">
                  <span>Quality: <span className={QUALITY_COLORS[model.quality]}>{model.quality}</span></span>
                  <span>Code/sec: {model.autoCodePerSecond}</span>
                </div>
                {model.capabilities.length > 0 && (
                  <div>Capabilities: {model.capabilities.join(', ')}</div>
                )}
              </div>

              <button
                onClick={() => {
                  purchaseModel(model);
                  setShowUpgradesModal(false);
                }}
                className={`w-full py-1 px-3 rounded text-xs transition ${
                  money >= model.cost
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-700 cursor-not-allowed'
              } ${activeModel?.name === model.name ? 'bg-green-800' : ''}`}
              disabled={money < model.cost || activeModel?.name === model.name}
            >
              {activeModel?.name === model.name ? 'Active' : 'Purchase'}
            </button>
          </div>
        ))}
      </div>
    </div>

    <div className="mt-3 text-center text-xs text-gray-400 border-t border-gray-700 pt-2">
      Press <span className="bg-gray-700 px-1 rounded">ESC</span> or click the X to close this panel
    </div>
  </div>
</div>
)}
</div>
);
};

export default DernierCode;
