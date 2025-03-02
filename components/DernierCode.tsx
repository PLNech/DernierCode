// components/DernierCode.tsx
"use client";
import React, { useState, useEffect, useRef } from 'react';
import {Terminal, Code, Users, PieChart, Zap, Cpu, Briefcase, TvMinimalPlay} from 'lucide-react';
import { usePathname } from 'next/navigation'
import { CODE_SAMPLES } from '../data/code'
import Level1 from './Level1';
import Level2 from './Level2';
import {getAgentType} from '@/data/games'
import TradingGame from './Level3';
import PropagandAI from './Level4';
import {QUALITY_COLORS} from "@/types";



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

enum LevelNames {
  "none",
  "code",
  "management",
  "trading",
  "propaganda"
}


const DernierCode = (props) => {
  const startLevel: number = props.startLevel;

  // Game state
  // TODO: Refactor all levels with a single levelUnlocked state, from 1 (begin on 'code') to 4 (propaganda)
  // const [levelUnlocked, setLevelUnlocked] = useState(startLevel);

  // track Level1 state
  const [codeLines, setCodeLines] = useState(0);
  const [incrementFactor, setIncrementFactor] = useState(5);
  const [activeModel, setActiveModel] = useState<Model | null>(null);
  const [aiCodeShare, setAiCodeShare] = useState(0);
  const [aiSharePrecision, setAiSharePrecision] = useState(2);

  // Management tab state
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

  // const pathname = usePathname();

  const [money, setMoney] = useState(0);
  const [activeTab, setActiveTab] = useState(LevelNames[startLevel]); // 'code' or 'management' or 'trading' or 'propaganda'
  const [showShortcutHelp, setShowShortcutHelp] = useState(false);
  const [isFullyAutomated, setIsFullyAutomated] = useState(startLevel >= 2);
  const [level2Unlocked, setLevel2Unlocked] = useState(startLevel >= 2);
  const [level3Unlocked, setLevel3Unlocked] = useState(startLevel >= 3);
  const [level4Unlocked, setLevel4Unlocked] = useState(startLevel >= 4);
  const [observationMode, setObservationMode] = useState(false);

  console.log(`DernierCode - starting on level ${startLevel}, ${activeTab}`);

  // Helper function to format numbers for display
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return Math.floor(num);
  };




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
            return;
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
            case 'm':
            case 'M':
              if (level2Unlocked) setActiveTab('management');
              break;
            case 'T':
            case 't':
              if (level3Unlocked) setActiveTab('trading');
              break;
            case 'P':
            case 'p':
              if (level4Unlocked) setActiveTab('propaganda');
            case '?':
              setShowShortcutHelp(prev => !prev);
              break;
            default:
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
    incomingTasks,
    ownedAgents,
    level2Unlocked,
    money,
    activeModel,
  ]);

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
          onClick={() => setMoney(prev => prev + 1000000000000)} // Add 10 billion
          // hidden={!pathname.includes("localhost")} // ONLY ON LOCALHOST URL
          data-name={"DEBUG1"}
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
            className={`py-2 px-4 ${activeTab === 'management' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'} rounded-t-lg flex items-center ${!level2Unlocked ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={() => level2Unlocked && setActiveTab('management')}
            disabled={!level2Unlocked}
        >
          <Briefcase size={16} className="inline mr-2" />
          {level2Unlocked ? (
              <>AI Management <span className="text-xs opacity-75 px-1">[M]</span></>
          ) : (
              <>??? <span className="ml-2 text-xs bg-gray-700 px-2 py-1 rounded">
              Requires AI with &apos;agentic&apos; capability
            </span></>
          )}
        </button>

        <button
            className={`py-2 px-4 ${activeTab === 'trading' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300'} rounded-t-lg flex items-center ${!level3Unlocked ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={() => level3Unlocked && setActiveTab('trading')}
            disabled={!level3Unlocked}
        >
          <Zap size={16} className="inline mr-2" />
          {level3Unlocked ? (
              <>Asset Trading <span className="text-xs opacity-75 px-1">[T]</span></>
          ) : (
              <>???
                {level2Unlocked && (
                    <span className="ml-2 text-xs bg-gray-700 px-2 py-1 rounded">Requires $1B entry ticket</span>
                  )}
              </>
          )}
        </button>
        <button
            className={`py-2 px-4 ${activeTab === 'propaganda' ? 'bg-amber-600 text-white' : 'bg-gray-800 text-gray-300'} rounded-t-lg flex items-center ${!level4Unlocked ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={() => level4Unlocked && setActiveTab('trading')}
            disabled={!level4Unlocked}
        >
          <TvMinimalPlay size={16} className="inline mr-2" />
          {level4Unlocked ? (
              <>Propagand<b>AI </b> <span className="text-xs opacity-75 px-1">[P]</span></>
          ) : (
              <>???
                {level3Unlocked && (
                    <span className="ml-2 text-xs bg-gray-700 px-2 py-1 rounded">Requires a DataCenter</span>
                )}
              </>
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
          <Level1
              money={money}
              setMoney={setMoney}
              observationMode={observationMode}
              setObservationMode={setObservationMode}
              level2Unlocked={level2Unlocked}
              setLevel2Unlocked={setLevel2Unlocked}
              // Add these props to sync state
              codeLines={codeLines}
              setCodeLines={setCodeLines}
              incrementFactor={incrementFactor}
              setIncrementFactor={setIncrementFactor}
              activeModel={activeModel}
              setActiveModel={setActiveModel}
              aiCodeShare={aiCodeShare}
              setAiCodeShare={setAiCodeShare}
              aiSharePrecision={aiSharePrecision}
              setAiSharePrecision={setAiSharePrecision}
          />
      )}

      {activeTab === 'management' && level2Unlocked && (
          <Level2
              money={money}
              setMoney={setMoney}
              isFullyAutomated={isFullyAutomated}
              setIsFullyAutomated={setIsFullyAutomated}
              level3Unlocked={level3Unlocked}
              setLevel3Unlocked={setLevel3Unlocked}
          />
      )}

    {activeTab === 'trading' && level3Unlocked && (
      <TradingGame />
    )}

    {activeTab === 'propaganda' && level4Unlocked && (
        <PropagandAI />
    )}
  {/* Upgrades Modal */}
</div>
);
};

export default DernierCode;
