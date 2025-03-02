// components/Level1.tsx
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { CODE_SAMPLES } from '../data/code';
import { Terminal, Code } from 'lucide-react';
import {Agent, Task, AgentType, Assignment, Model, QualityLevel, TaskType, QUALITY_COLORS} from "@/types";
import {AI_MODELS} from "@/data/games";


// Syntax highlighting function - simplistic version
const syntaxHighlight = (code: string) => {
    // Copy the syntaxHighlight function here
    if (!code) return '';

    // Make a copy of the code to avoid modifying the original
    let highlightedCode = code;

    try {
        // Replace comments - do this first since they can contain other syntax elements
        highlightedCode = highlightedCode.replace(
            /(\/\/.*|\/\*[\s\S]*?\*\/|#.*)/g,
            '<span className="text-green-500">$1</span>'
        );

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

interface Level1Props {
    money: number;
    setMoney: (value: number | ((prev: number) => number)) => void;
    observationMode: boolean;
    setObservationMode: (value: boolean) => void;
    level2Unlocked: boolean;
    setLevel2Unlocked: (value: boolean) => void;
    // Add these props
    codeLines: number;
    setCodeLines: (value: number | ((prev: number) => number)) => void;
    incrementFactor: number;
    setIncrementFactor: (value: number | ((prev: number) => number)) => void;
    activeModel: Model | null;
    setActiveModel: (model: Model | null) => void;
    aiCodeShare: number;
    setAiCodeShare: (value: number | ((prev: number) => number)) => void;
    aiSharePrecision: number;
    setAiSharePrecision: (value: number | ((prev: number) => number)) => void;
}
const Level1 = ({
                    money,
                    setMoney,
                    observationMode,
                    setObservationMode,
                    level2Unlocked,
                    setLevel2Unlocked,
                    codeLines,
                    setCodeLines,
                    incrementFactor,
                    setIncrementFactor,
                    activeModel,
                    setActiveModel,
                    aiCodeShare,
                    setAiCodeShare,
                    aiSharePrecision,
                    setAiSharePrecision
                }: Level1Props) => {
    // Level 1 state, extracted from DernierCode
    const [moneyTimer, setMoneyTimer] = useState(5);
    const [showUpgradesModal, setShowUpgradesModal] = useState(false);
    const [highlightedText, setHighlightedText] = useState('');

    // Code display state
    const [visibleCodeSample, setVisibleCodeSample] = useState(0);
    const [currentCodeText, setCurrentCodeText] = useState('');
    const [typingPosition, setTypingPosition] = useState(0);
    const [isAIWriting, setIsAIWriting] = useState(false);

    // Refs to track latest codeLines value
    const codeLinesRef = useRef(codeLines);
    const codeRef = useRef(null);

    // Extract all relevant functions from DernierCode for Level 1
    // Update highlighted text when code changes
    const updateHighlightedText = (text: string) => {
        const highlighted = syntaxHighlight(text);
        setHighlightedText(highlighted);
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
            setLevel2Unlocked(true);
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

    // Game actions
    const writeCode = () => {
        setCodeLines(prev => prev + incrementFactor);

        // Ensure typing works correctly by handling current state
        const currentSample = CODE_SAMPLES[visibleCodeSample];
        const sampleCode = currentSample.code;
        const typingChars = Math.ceil(incrementFactor / 2);

        // Special handling for typing to avoid UI glitches
        if (typingPosition >= sampleCode.length) {
            // If we're at the end, move to next sample
            const nextSample = (visibleCodeSample + 1) % CODE_SAMPLES.length;
            setVisibleCodeSample(nextSample);
            setTypingPosition(0);
            setCurrentCodeText('');
            updateHighlightedText('');
        } else {
            // Otherwise type next characters
            const nextPosition = Math.min(typingPosition + typingChars, sampleCode.length);
            const newText = sampleCode.substring(0, nextPosition);
            setCurrentCodeText(newText);
            updateHighlightedText(newText);
            setTypingPosition(nextPosition);
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
    };

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't trigger shortcuts if user is typing in an input
            if (e.target instanceof HTMLElement &&
                (e.target.tagName === 'INPUT' ||
                    e.target.tagName === 'TEXTAREA' ||
                    e.target.tagName === 'SELECT')) {
                return;
            }

            // Close modal with Escape key
            if (e.key === 'Escape' && showUpgradesModal) {
                setShowUpgradesModal(false);
                return;
            }

            // Space for write code
            if (e.key === ' ') {
                e.preventDefault(); // Prevent page scroll
                writeCode();
                return;
            }

            // R for refactor
            if (e.key === 'r' || e.key === 'R') {
                if (codeLines >= 20) refactorCode();
                return;
            }

            // U for upgrades
            if (e.key === 'u' || e.key === 'U') {
                setShowUpgradesModal(!showUpgradesModal);
                return;
            }

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
        };

        // Add event listener
        window.addEventListener('keydown', handleKeyDown);

        // Remove event listener on cleanup
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [codeLines, showUpgradesModal, money, activeModel, writeCode, refactorCode, purchaseModel]);
    // Keep codeLinesRef updated with latest codeLines value
    useEffect(() => {
        codeLinesRef.current = codeLines;
    }, [codeLines]);

    // Check if observation mode should be activated
    useEffect(() => {
        if (aiCodeShare >= 90 && !observationMode) {
            setObservationMode(true);
            // setTargetAiShare(99);
            setAiSharePrecision(2);
        }
    }, [aiCodeShare, observationMode, setObservationMode]);

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
            // setTargetAiShare(target);
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
    }, [observationMode, aiCodeShare]);

    // Check if management tab should be unlocked
    useEffect(() => {
        if (activeModel &&
            activeModel.capabilities.includes('agentic') && !level2Unlocked) {
            setLevel2Unlocked(true);
        }
    }, [activeModel, level2Unlocked, setLevel2Unlocked]);

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
    }, [activeModel, visibleCodeSample]);


// Timer for money generation
    useEffect(() => {
        // Use a small delay before starting the timer to avoid React rendering issues
        const initialDelay = setTimeout(() => {
            const timer = setInterval(() => {
                setMoneyTimer(prev => {
                    if (prev <= 0) {
                        // Use the ref to get the latest codeLines value
                        const currentCodeLines = codeLinesRef.current;
                        // Only update money if we have non-zero code lines
                        if (currentCodeLines > 0) {
                            setMoney(prevMoney => prevMoney + Math.floor(currentCodeLines));
                        }
                        return 5;
                    }
                    return prev - 1;
                });
            }, 1000);

            // Clean up interval when component unmounts
            return () => clearInterval(timer);
        }, 100); // Small delay to avoid rendering conflicts

        // Clear the initial delay timeout on unmount
        return () => clearTimeout(initialDelay);
    }, [setMoney]); // Add setMoney to dependencies


    // Render the code generation UI
    return (
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

export default Level1;