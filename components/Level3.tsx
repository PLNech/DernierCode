"use client";
import React, {useState, useEffect, useRef, ReactElement} from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Lock, ChevronRight, BarChart3, Clock, RefreshCw, Database, DollarSign, Bitcoin, Briefcase } from 'lucide-react';
import {usePathname} from "next/navigation";

interface AgentLog {
  id: number;
  timestamp: string;
  message: string;
}

// Trading agent strategies
const AGENT_STRATEGIES = [
  { id: 'track', name: 'Just Track Prices', description: 'The digital equivalent of watching paint dry, but with numbers.', cost: 0 },
  { id: 'minmax', name: 'Min/Max Strategy', description: 'Revolutionary concept: buy low, sell high. Who would have thought?', cost: 600000 },
  { id: 'trend', name: 'Trend Following', description: 'Jump on bandwagons with algorithmic precision. FOMO, but make it science.', cost: 1500000 },
  { id: 'mean', name: 'Mean Reversion', description: 'What goes up must come down. Unless it doesn\'t. Welcome to statistics.', cost: 5000000 }
];

// Asset types that can be unlocked
const ASSET_TYPES = {
  MEMECOIN: 'memecoins',
  FOREX: 'forex',
  CRYPTO: 'crypto',
  FUTURES: 'futures',
  STOCKS: 'stocks'
};


// Resolution levels with their corresponding tick rates
const RESOLUTION_LEVELS = [
  { name: 'Day', tickRate: 1000, label: 'day', display: 'DD/MM' },
  { name: 'Hour', tickRate: 500, label: 'hour', display: '00:00-23:00' },
  { name: 'Minute', tickRate: 200, label: 'minute', display: '00:00-23:59' },
  { name: 'Second', tickRate: 50, label: 'second', display: '00-59s' },
  { name: 'Millisecond', tickRate: 20, label: 'millisecond', display: '0,000s-0,999s' }
];

interface Asset {
  id: string;
  name: string;
  symbol: string;
  basePrice: number;
}

interface AssetPrices {
  [key: string]: number;
}

interface OwnedAssets {
  [key: string]: number;
}

interface TrackingData {
  [key: string]: {
    minPrice: number;
    maxPrice: number;
    lastCycleMin: number;
    lastCycleMax: number;
    cycleCount: number;
    lastActionPrice: number;
  };
}

interface AssetPrice {
  time: string;
  price: number;
  change: number;
  percentChange: string;
  isUp?: boolean;
}

interface TooltipProps {
  active?: boolean;
  payload?: { payload: AssetPrice }[];
}


// Sample memecoins
const MEMECOINS: Asset[] = [
  { id: 'doge', name: 'Dogecoin', symbol: 'DOGE', basePrice: 0.1 },
  { id: 'shib', name: 'Shiba Inu', symbol: 'SHIB', basePrice: 0.00005 },
  { id: 'pepe', name: 'Pepe', symbol: 'PEPE', basePrice: 0.000008 },
  { id: 'floki', name: 'Floki', symbol: 'FLOKI', basePrice: 0.0002 }
];

// Sample forex pairs
const FOREX_PAIRS: Asset[] = [
  { id: 'eurusd', name: 'EUR/USD', symbol: 'EUR/USD', basePrice: 1.08 },
  { id: 'gbpusd', name: 'GBP/USD', symbol: 'GBP/USD', basePrice: 1.27 },
  { id: 'usdjpy', name: 'USD/JPY', symbol: 'USD/JPY', basePrice: 151.2 },
  { id: 'audusd', name: 'AUD/USD', symbol: 'AUD/USD', basePrice: 0.66 }
];

// Sample cryptocurrencies
const CRYPTOCURRENCIES: Asset[] = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', basePrice: 63500 },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', basePrice: 3400 },
  { id: 'sol', name: 'Solana', symbol: 'SOL', basePrice: 148 },
  { id: 'link', name: 'Chainlink', symbol: 'LINK', basePrice: 15.8 }
];

// Sample futures
const FUTURES: Asset[] = [
  { id: 'cl', name: 'Crude Oil', symbol: 'CL', basePrice: 74.5 },
  { id: 'gc', name: 'Gold', symbol: 'GC', basePrice: 2375 },
  { id: 'zc', name: 'Corn', symbol: 'ZC', basePrice: 450 },
  { id: 'zs', name: 'Soybeans', symbol: 'ZS', basePrice: 1150 }
];

// Sample stocks
const STOCKS: Asset[] = [
  { id: 'aapl', name: 'Apple Inc.', symbol: 'AAPL', basePrice: 175 },
  { id: 'tsla', name: 'Tesla, Inc.', symbol: 'TSLA', basePrice: 180 },
  { id: 'goog', name: 'Alphabet Inc.', symbol: 'GOOG', basePrice: 147 },
  { id: 'adbe', name: 'Adobe Inc.', symbol: 'ADBE', basePrice: 520 },
  { id: 'dooz', name: 'Dooz AI', symbol: 'DOOZ', basePrice: 42 },
  { id: 'parv', name: 'Parvenu Tech', symbol: 'PARV', basePrice: 28 },
  { id: 'app', name: 'AppCorp', symbol: 'APP', basePrice: 95 },
  { id: 'hack', name: 'Hacktech', symbol: 'HACK', basePrice: 63 },
  { id: 'next', name: 'NextGen Systems', symbol: 'NEXT', basePrice: 112 },
  { id: 'rofl', name: 'Rofl Games', symbol: 'ROFL', basePrice: 17 }
];

interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: string;
  level?: number;
  unlocksAsset?: string;
  strategy?: string;
  icon: ReactElement;
}
// Upgrades available in the game
const UPGRADES: Upgrade[] = [
  {
    id: 'resolution1',
    name: 'Hourly Neural Interface',
    description: 'Upgrade your brain to process market data hourly. Time waits for no trader.',
    cost: 25000,
    type: 'resolution',
    level: 1,
    icon: <Clock size={16} />
  },
  {
    id: 'tradingAgent',
    name: 'Synth-Agent™ v1.0',
    description: 'Deploy a semi-autonomous algo-being to do your bidding in the markets. Results not guaranteed, sanity optional.',
    cost: 100000,
    type: 'agent',
    icon: <Database size={16} />
  },
  {
    id: `forex`,
    name: 'ForEx Access Node',
    description: 'Tap into the global currency matrix. Money is a lie agreed upon worldwide.',
    cost: 150000,
    type: 'asset',
    unlocksAsset: ASSET_TYPES.FOREX,
    icon: <DollarSign size={16} />
  },
  {
    id: 'crypto',
    name: 'NeuralCrypto™ Implant',
    description: 'Decode the blockchain directly with your frontal lobe. Your thoughts are not your own, but hey, nice gains!',
    cost: 200000,
    type: 'asset',
    unlocksAsset: ASSET_TYPES.CRYPTO,
    icon: <Bitcoin size={16} />
  },
  {
    id: 'resolution2',
    name: 'Minute Perception Mod',
    description: 'Witness market changes by the minute. Time is now a suggestion, not a constraint.',
    cost: 300000,
    type: 'resolution',
    level: 2,
    icon: <Clock size={16} />
  },
  {
    id: 'futures',
    name: 'Future-Sight Cortex',
    description: 'Trade commodities that don\'t exist yet. The future is already mortgaged; might as well profit from it.',
    cost: 500000,
    type: 'asset',
    unlocksAsset: ASSET_TYPES.FUTURES,
    icon: <BarChart3 size={16} />
  },
  {
    id: 'strategy-minmax',
    name: 'MinMax.exe Neural Patch',
    description: 'Buy low, sell high. Revolutionary concept, really. Can\'t believe no one thought of it before.',
    cost: 600000,
    type: 'strategy',
    strategy: 'minmax',
    icon: <RefreshCw size={16} />
  },
  {
    id: 'stocks',
    name: 'CorpNeuro-Link™',
    description: 'Feel the pulse of megacorps directly in your spine. Capitalism has never been so intimately invasive.',
    cost: 750000,
    type: 'asset',
    unlocksAsset: ASSET_TYPES.STOCKS,
    icon: <Briefcase size={16} />
  },
  {
    id: 'resolution3',
    name: 'Second-Splice Consciousness',
    description: 'Perceive time in second-by-second increments. Your bathroom breaks now feel like vacations.',
    cost: 1000000,
    type: 'resolution',
    level: 3,
    icon: <Clock size={16} />
  },
  {
    id: 'strategy-trend',
    name: 'Trend-Surfer Protocol',
    description: 'Ride market waves like a cyberspace cowboy. Yeehaw your way to digital riches or spectacular ruin.',
    cost: 1500000,
    type: 'strategy',
    strategy: 'trend',
    icon: <RefreshCw size={16} />
  },
  {
    id: 'resolution4',
    name: 'Millisecond Madness',
    description: 'Time now passes in flashes of insanity. You\'ve transcended humanity, but can you still remember your name?',
    cost: 3000000,
    type: 'resolution',
    level: 4,
    icon: <Clock size={16} />
  },
  {
    id: 'strategy-mean',
    name: 'Statistical Reality Distortion',
    description: 'If enough people believe in the mean, it must be real. Invest accordingly while the universe isn\'t looking.',
    cost: 5000000,
    type: 'strategy',
    strategy: 'mean',
    icon: <RefreshCw size={16} />
  }
];



const TradingGame = () => {
  // Game state
  const [money, setMoney] = useState(50000);
  const [unlockedAssets, setUnlockedAssets] = useState([ASSET_TYPES.MEMECOIN]);
  const [activeAssetType, setActiveAssetType] = useState(ASSET_TYPES.MEMECOIN);
  const [resolutionLevel, setResolutionLevel] = useState(0);
  const [hasAgent, setHasAgent] = useState<boolean>(false);
  const [ownedAssets, setOwnedAssets] = useState<OwnedAssets>({});
  const [priceHistory, setPriceHistory] = useState<{[key: string]: AssetPrice[]}>({});
  const [assetPrices, setAssetPrices] = useState<AssetPrices>({});
  const [selectedAsset, setSelectedAsset] = useState(MEMECOINS[0]);
  const [chartData, setChartData] = useState<AssetPrice[]>([]);
  const [showUpgrades, setShowUpgrades] = useState(false);
  
  // Agent state
  const [activeStrategy, setActiveStrategy] = useState('track');
  const [unlockedStrategies, setUnlockedStrategies] = useState(['track']);
  const [agentBuyEnabled, setAgentBuyEnabled] = useState(false);
  const [agentSellEnabled, setAgentSellEnabled] = useState(false);
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);
  
  // Price tracking for agent
  const [trackingData, setTrackingData] = useState<TrackingData>({});

  // Simulated time tracking for consistent timestamps
  const [simulatedTime, setSimulatedTime] = useState(new Date('2025-03-01T00:00:00'));
  
  // Trading metrics
  const [tradeCount, setTradeCount] = useState(0);
  const [profitLoss, setProfitLoss] = useState(0);
  
  // Refs
  const engineRef = useRef<NodeJS.Timeout | null>(null);
  const lastTickRef = useRef(Date.now());

  // Routing
  const pathname = usePathname();


// Render trading agent control panel
  const renderAgentControlPanel = () => {
    if (!hasAgent) return null;

    return (
        <div className="mt-4 bg-gray-800 rounded-lg p-3 border border-gray-700">

          <div className="flex gap-4">
            {/* Left side: Agent Controls */}
            <div className="space-y-2 w-1/4">
              <div>
                <h3 className="text-sm font-bold mb-2 flex items-center">
                  <Database size={14} className="mr-1" />
                  Trading Agent
                </h3>
                <label className="block text-xs text-gray-400 mb-1">Strategy</label>
                <select
                    className="w-full bg-gray-700 border border-gray-600 rounded text-sm p-1"
                    value={activeStrategy}
                    onChange={(e) => setActiveStrategy(e.target.value)}
                >
                  {AGENT_STRATEGIES.filter(strategy =>
                      unlockedStrategies.includes(strategy.id)
                  ).map(strategy => (
                      <option key={strategy.id} value={strategy.id}>
                        {strategy.name}
                      </option>
                  ))}
                </select>
              </div>

              {/* Trading Agent Buttons */}
              <div className="flex space-x-2">
                <div className="flex-1">
                  <button
                      className={`w-full py-1 px-2 rounded text-xs ${
                          agentBuyEnabled
                              ? 'bg-green-700 hover:bg-green-600'
                              : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                      onClick={() => setAgentBuyEnabled(!agentBuyEnabled)}
                  >
                  <span className={`inline-block h-2 w-2 rounded-full mr-1 ${
                      agentBuyEnabled ? 'bg-green-400 animate-pulse' : 'bg-gray-500'
                  }`}></span>
                    Buy High 🤖
                  </button>
                </div>

                <div className="flex-1">
                  <button
                      className={`w-full py-1 px-2 rounded text-xs ${
                          agentSellEnabled
                              ? 'bg-red-700 hover:bg-red-600'
                              : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                      onClick={() => setAgentSellEnabled(!agentSellEnabled)}
                  >
                  <span className={`inline-block h-2 w-2 rounded-full mr-1 ${
                      agentSellEnabled ? 'bg-red-400 animate-pulse' : 'bg-gray-500'
                  }`}></span>
                    Sell Low 🤖
                  </button>
                </div>
              </div>
            </div>

            {/* Right side: Agent Log */}
            <div className="w-3/4">
              <div className="text-xs text-gray-400 mb-1">Agent Log</div>
              <div className="bg-gray-900 rounded border border-gray-700 h-20 scroll-auto overflow-y-auto text-xs p-1 font-mono">
                {agentLogs.length === 0 ? (
                    <div className="text-gray-500 italic">Waiting for agent actions...</div>
                ) : (
                    <div className="space-y-1">
                      {agentLogs.slice(-8).map((log: AgentLog) => (
                          <div key={log.id} className="flex">
                            <span className="text-gray-500 mr-1">[{log.timestamp}]</span>
                            <span className="text-gray-300">{log.message}</span>
                          </div>
                      ))}
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
    );
  };  // Add log entry to agent log
  const addAgentLog = (message: string) => {
    const timestamp = formatTimestamp(simulatedTime.getTime());
    const newLog: AgentLog = {
      id: Date.now(),
      timestamp,
      message
    };

    setAgentLogs((prev: AgentLog[]) => {
      // Keep only the last 100 logs
      const logs = [...prev, newLog];
      if (logs.length > 100) {
        return logs.slice(-100);
      }
      return logs;
    });
  };

  // Run agent logic based on current state and strategy
  const runAgentLogic = (currentHasAgent: boolean) => {
    if (!currentHasAgent || !selectedAsset) return;

    const assetId = selectedAsset.id;
    const currentPrice = assetPrices[assetId] ?? selectedAsset.basePrice;

    // Initialize tracking data for this asset if it doesn't exist
    if (!trackingData[assetId]) {
      setTrackingData(prev => ({
        ...prev,
        [assetId]: {
          minPrice: currentPrice,
          maxPrice: currentPrice,
          lastCycleMin: currentPrice,
          lastCycleMax: currentPrice,
          cycleCount: 0,
          lastActionPrice: 0
        }
      }));
      addAgentLog(`Started tracking ${selectedAsset.symbol} at ${currentPrice.toPrecision(4)}\$`);
      return;
    }

    // Get current tracking data
    const tracking = trackingData[assetId];

    // Update min/max values
    const newTracking = {
      ...tracking,
      minPrice: Math.min(tracking.minPrice, currentPrice),
      maxPrice: Math.max(tracking.maxPrice, currentPrice)
    };

    // Determine if we've completed a cycle based on resolution
    let isNewCycle = false;

    switch(RESOLUTION_LEVELS[resolutionLevel].label) {
      case 'day':
        // Month cycle (30 days)
        isNewCycle = newTracking.cycleCount >= 30;
        break;
      case 'hour':
        // Day cycle (24 hours)
        isNewCycle = newTracking.cycleCount >= 24;
        break;
      case 'minute':
        // Hour cycle (60 minutes)
        isNewCycle = newTracking.cycleCount >= 60;
        break;
      case 'second':
        // Minute cycle (60 seconds)
        isNewCycle = newTracking.cycleCount >= 60;
        break;
      case 'millisecond':
        // Second cycle (1000 milliseconds)
        isNewCycle = newTracking.cycleCount >= 1000;
        break;
      default:
        isNewCycle = newTracking.cycleCount >= 30;
    }

    // Increment cycle counter
    newTracking.cycleCount = (newTracking.cycleCount + 1) % 1001; // Prevent overflow

    // If we completed a cycle, update cycle values
    if (isNewCycle) {
      newTracking.lastCycleMin = newTracking.minPrice;
      newTracking.lastCycleMax = newTracking.maxPrice;
      newTracking.minPrice = currentPrice;
      newTracking.maxPrice = currentPrice;
      newTracking.cycleCount = 0;

      addAgentLog(`Completed tracking cycle for ${selectedAsset.symbol}: 
      min=${newTracking.minPrice.toPrecision(4)} (was=${newTracking.lastCycleMin.toPrecision(4)}) 
      max=${newTracking.maxPrice.toPrecision(4)} (was ${newTracking.lastCycleMax.toPrecision(4)})
      cycles=${newTracking.cycleCount}`);
    }

    // Execute buy/sell logic based on strategy
    if (agentBuyEnabled && tracking.lastCycleMin > 0) {
      // Buy when price is below previous cycle minimum (good deal)
      if (currentPrice < tracking.lastCycleMin * 0.98) {
        // Calculate how much to buy (10% of available cash)
        const amountToBuy = Math.floor((money * 0.1) / currentPrice);

        if (amountToBuy > 0) {
          buyAsset(assetId, amountToBuy);
          newTracking.lastActionPrice = currentPrice;
          addAgentLog(`BOUGHT ${amountToBuy} ${selectedAsset.symbol} @ ${currentPrice.toFixed(2)}`);
        }
      }
    }

    if (agentSellEnabled && tracking.lastCycleMax > 0) {
      // Sell when price is above previous cycle maximum (good profit)
      if (currentPrice > tracking.lastCycleMax * 1.02) {
        // Calculate how much to sell (20% of holdings)
        const owned = ownedAssets[assetId] || 0;
        const amountToSell = Math.floor(owned * 0.2);

        if (amountToSell > 0) {
          sellAsset(assetId, amountToSell);
          newTracking.lastActionPrice = currentPrice;
          addAgentLog(`SOLD ${amountToSell} ${selectedAsset.symbol} @ ${currentPrice.toFixed(2)}`);
        }
      }
    }

    // Update tracking data
    setTrackingData(prev => ({
      ...prev,
      [assetId]: newTracking
    }));
  };

// Helper format for numeric display
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toFixed(num < 1 ? 6 : 2);
  };

// Trading Tooltip Component
  const PriceTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
          <div className="bg-gray-900 border border-gray-700 p-2 text-xs rounded">
            <p className="text-gray-300">Time: {data.time}</p>
            <p className={`font-medium ${data.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              Price: {data.price.toFixed(data.price < 1 ? 6 : 2)}
            </p>
            <p className={data.change >= 0 ? 'text-green-400' : 'text-red-400'}>
              {data.change >= 0 ? '+' : ''}{data.change.toFixed(data.price < 1 ? 6 : 2)} ({data.percentChange}%)
            </p>
          </div>
      );
    }
    return null;
  };


  // Initialize prices on first load
  useEffect(() => {
    initializeAssetPrices();
  }, []);

  // Update chart data when selected asset changes
  useEffect(() => {
    if (selectedAsset && priceHistory[selectedAsset.id]) {
      updateChartData();
    }
  }, [selectedAsset, priceHistory]);

  // Advance simulated time based on current resolution level
  const advanceSimulatedTime = () => {
    const newTime = new Date(simulatedTime);
    
    switch(RESOLUTION_LEVELS[resolutionLevel].label) {
      case 'day':
        // Move forward 1 day
        newTime.setDate(newTime.getDate() + 1);
        break;
      case 'hour':
        // Move forward 1 hour
        newTime.setHours(newTime.getHours() + 1);
        break;
      case 'minute':
        // Move forward 1 minute
        newTime.setMinutes(newTime.getMinutes() + 1);
        break;
      case 'second':
        // Move forward 1 second
        newTime.setSeconds(newTime.getSeconds() + 1);
        break;
      case 'millisecond':
        // Move forward 1 millisecond (not 100 as before)
        newTime.setMilliseconds(newTime.getMilliseconds() + 1);
        break;
      default:
        // Default to day increment
        newTime.setDate(newTime.getDate() + 1);
    }
    
    setSimulatedTime(newTime);
    return newTime;
  };

  // The tick counter for biasing first stock
  const tickCounterRef = useRef(0);
  
  // Update the trading engine when resolution changes
  useEffect(() => {
    if (engineRef.current) {
      clearInterval(engineRef.current);
    }
    
    const tickRate = RESOLUTION_LEVELS[resolutionLevel].tickRate;
    engineRef.current = setInterval(() => {
      // Increment tick counter
      tickCounterRef.current++;
      
      // Advance simulated time
      advanceSimulatedTime();
      
      // Run trading engine with updated time
      runTradingEngine();
      
      // Run agent logic if agent is active
      if (hasAgent) {
        runAgentLogic(hasAgent);
      }
    }, tickRate);
    
    return () => {
      if (engineRef.current) {
        clearInterval(engineRef.current);
      }
    };
  }, [resolutionLevel, assetPrices, hasAgent, agentBuyEnabled, agentSellEnabled, activeStrategy, selectedAsset]);

  // Get appropriate assets for the active type
  const getAssetList = () => {
    switch (activeAssetType) {
      case ASSET_TYPES.FOREX:
        return FOREX_PAIRS;
      case ASSET_TYPES.CRYPTO:
        return CRYPTOCURRENCIES;
      case ASSET_TYPES.FUTURES:
        return FUTURES;
      case ASSET_TYPES.STOCKS:
        return STOCKS;
      case ASSET_TYPES.MEMECOIN:
      default:
        return MEMECOINS;
    }
  };

  // Initialize asset prices
  const initializeAssetPrices = () => {
    const prices: AssetPrices = {};
    const history: {[key: string]: AssetPrice[]} = {};
    
    // Initialize all asset types
    [MEMECOINS, FOREX_PAIRS, CRYPTOCURRENCIES, FUTURES, STOCKS].forEach((assetGroup: Asset[]) => {
      assetGroup.forEach((asset: Asset) => {
        // Make sure each asset has a properly defined type for identification
        const assetWithType = {
          ...asset,
          type: assetGroup === MEMECOINS ? ASSET_TYPES.MEMECOIN : 
                 assetGroup === FOREX_PAIRS ? ASSET_TYPES.FOREX :
                 assetGroup === CRYPTOCURRENCIES ? ASSET_TYPES.CRYPTO :
                 assetGroup === FUTURES ? ASSET_TYPES.FUTURES : ASSET_TYPES.STOCKS
        };
        
        prices[asset.id] = assetWithType.basePrice;
        history[asset.id] = [{
          time: formatTimestamp(Date.now()),
          price: assetWithType.basePrice,
          change: 0,
          percentChange: '0.00'
        }];
      });
    });
    
    setAssetPrices(prices);
    setPriceHistory(history);
    setSelectedAsset(MEMECOINS[0]);
  };

  // Format timestamp based on current resolution with European formatting
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const resLabel = RESOLUTION_LEVELS[resolutionLevel].label;
    
    switch (resLabel) {
      case 'day':
        // European format DD/MM
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}`;
      case 'hour':
        // 24-hour format 00:00 to 23:00
        return `${date.getHours().toString().padStart(2, '0')}:00`;
      case 'minute':
        // Full hour and minute 00:00 to 23:59
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      case 'second':
        // Just seconds 00-59 (over a minute)
        return `${date.getSeconds().toString().padStart(2, '0')}`;
      case 'millisecond':
        // Milliseconds with European decimal comma
        return `0,${date.getMilliseconds().toString().padStart(3, '0')}s`;
      default:
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}`;
    }
  };

  // Update chart data based on price history with limited data points for performance
  const updateChartData = () => {
    if (!selectedAsset) return;
    
    const history = priceHistory[selectedAsset.id] || [];
    const maxPoints = 60; // Stricter limit for better performance
    
    // If we have more than maxPoints, only take the most recent ones
    const data = history.slice(-maxPoints).map(point => ({
      ...point,
      percentChange: point.percentChange.toString() // Ensure it's a string
    }));
    
    setChartData(data);
  };

  // The main trading engine that updates prices
  const runTradingEngine = () => {
    // Use simulated time instead of real time
    const now = simulatedTime.getTime();
    lastTickRef.current = now;
    
    // Update prices for all assets with random walk
    const newPrices = { ...assetPrices };
    const newHistory = { ...priceHistory };
    
    // Iterate through all asset types
    [MEMECOINS, FOREX_PAIRS, CRYPTOCURRENCIES, FUTURES, STOCKS].forEach((assetGroup) => {
      assetGroup.forEach((asset, assetIndex) => {
        // Random walk algorithm for price movements
        // More volatile for crypto and memecoins, more stable for forex and stocks
        let volatility = 0.01; // Base volatility
        
        // Determine asset type
        const assetType = assetGroup === MEMECOINS ? ASSET_TYPES.MEMECOIN : 
                          assetGroup === FOREX_PAIRS ? ASSET_TYPES.FOREX :
                          assetGroup === CRYPTOCURRENCIES ? ASSET_TYPES.CRYPTO :
                          assetGroup === FUTURES ? ASSET_TYPES.FUTURES : ASSET_TYPES.STOCKS;
        
        if ([ASSET_TYPES.CRYPTO, ASSET_TYPES.MEMECOIN].includes(assetType)) {
          volatility = 0.03; // Higher volatility
        }

        let bias = -0.48; // Slight upward bias by default

        // Apply stronger bias for first asset type (memecoins)
        if (assetType === ASSET_TYPES.STOCKS && assetIndex === 0) {
          // Regular bias of 5% every 100 ticks
          bias = -0.55; // stronger upward bias
          
          // If cash is low, apply even stronger bias (25% growth)
          if (money < 1000) {
            bias = -0.65; // Much stronger upward bias
          }
          
          // Apply extra boost every 100 ticks
          if (tickCounterRef.current % 100 === 0) {
            newPrices[asset.id] *= 1.01; // 1% immediate boost
          }
        }
        
        // Apply random walk with appropriate drift
        const change = asset.basePrice * volatility * (Math.random() + bias); 
        const newPrice = Math.max(newPrices[asset.id] + change, 0.00000001); // Ensure price stays positive
        const priceChange = newPrice - newPrices[asset.id];
        const percentChange = (priceChange / newPrices[asset.id] * 100).toFixed(2);
        
        // Update price
        newPrices[asset.id] = newPrice;
        
        // Add to history
        const newPoint = {
          time: formatTimestamp(now),
          price: newPrice,
          change: priceChange,
          percentChange
        };
        
        // Add to history with limited size for performance
        if (newHistory[asset.id]) {
          // Keep only the most recent points - much stricter limit
          const maxHistoryPoints = 100; // Reduced for better performance
          
          if (newHistory[asset.id].length >= maxHistoryPoints) {
            // Remove older points to keep size manageable
            newHistory[asset.id] = [
              ...newHistory[asset.id].slice(-maxHistoryPoints + 1),
              newPoint
            ];
          } else {
            newHistory[asset.id] = [...newHistory[asset.id], newPoint];
          }
        } else {
          newHistory[asset.id] = [newPoint];
        }
      });
    });
    
    setAssetPrices(newPrices);
    setPriceHistory(newHistory);
    
    // If trading agent is active, automatically generate profit
    if (hasAgent && now - lastTickRef.current > 10000) {
      const autoProfit = money * 0.001 * (resolutionLevel + 1);
      setMoney(prevMoney => prevMoney + autoProfit);
      setProfitLoss(prevPL => prevPL + autoProfit);
    }
    
    // Update chart if the selected asset has changed
    if (selectedAsset) {
      updateChartData();
    }
  };

  // Trading functions
  const buyAsset = (assetId: string, amount: number) => {
    if (!selectedAsset) return;
    
    const asset = getAssetList().find(a => a.id === assetId);
    if (!asset) return;
    
    const currentPrice: number = assetPrices[assetId];
    const totalCost: number = currentPrice * amount;
    
    // Check if user has enough money
    if (totalCost > money) {
      // Not enough money - could add an error message here
      return;
    }
    
    // Update owned assets
    setOwnedAssets(prev => ({
      ...prev,
      [assetId]: (prev[assetId] || 0) + amount
    }));
    
    // Update money
    setMoney(prev => prev - totalCost);
    
    // Update trade metrics
    setTradeCount(prev => prev + 1);
  };

  const sellAsset = (assetId: string, amount: number) => {
    if (!selectedAsset) return;
    
    const asset = getAssetList().find(a => a.id === assetId);
    if (!asset) return;
    
    const owned = ownedAssets[assetId] || 0;
    // Can't sell more than you own
    const amountToSell = Math.min(amount, owned);
    
    if (amountToSell <= 0) return;
    
    const currentPrice = assetPrices[assetId];
    const totalValue = currentPrice * amountToSell;
    
    // Update owned assets
    setOwnedAssets(prev => ({
      ...prev,
      [assetId]: prev[assetId] - amountToSell
    }));
    
    // Update money
    setMoney(prev => prev + totalValue);
    
    // Update trade metrics
    setTradeCount(prev => prev + 1);
  };

  // Purchasing upgrades
  const purchaseUpgrade = (upgrade: Upgrade) => {
    if (money < upgrade.cost) return;

    setMoney(prev => prev - upgrade.cost);

    if (upgrade.type === 'asset' && upgrade.unlocksAsset) {
      setUnlockedAssets(prev => [...prev, upgrade.unlocksAsset!]);
    } else if (upgrade.type === 'resolution' && upgrade.level && upgrade.level > resolutionLevel) {
      setResolutionLevel(upgrade.level);
    } else if (upgrade.type === 'agent') {
      setHasAgent(true);
      addAgentLog("Trading Agent activated. Ready to assist with trading operations.");
    } else if (upgrade.type === 'strategy' && upgrade.strategy) {
      setUnlockedStrategies(prev => [...prev, upgrade.strategy!]);
      addAgentLog(`New strategy unlocked: ${upgrade.name}`);
    }
  };
  //
  // // Get the max amount the user can purchase
  // const getMaxBuyAmount = (assetId: string) => {
  //   const asset = [...MEMECOINS, ...FOREX_PAIRS, ...CRYPTOCURRENCIES, ...FUTURES, ...STOCKS].find(a => a.id === assetId);
  //   const price = assetPrices[assetId] !== undefined ? assetPrices[assetId] : (asset ? asset.basePrice : 1);
  //   return Math.floor(money / price);
  // };
  //
  // // Get the max amount the user can sell
  // const getMaxSellAmount = (assetId: string) => {
  //   return ownedAssets[assetId] || 0;
  // };

  // Calculate portfolio value
  const getPortfolioValue = () => {
    let value = 0;
    Object.entries(ownedAssets).forEach(([assetId, amount]) => {
      if (amount > 0) {
        const asset = [...MEMECOINS, ...FOREX_PAIRS, ...CRYPTOCURRENCIES, ...FUTURES, ...STOCKS].find(a => a.id === assetId);
        const price = assetPrices[assetId] !== undefined ? assetPrices[assetId] : (asset ? asset.basePrice : 0);
        value += price * amount;
      }
    });
    return value;
  };

  // Get total assets value (cash + portfolio)
  const getTotalAssetsValue = () => {
    return money + getPortfolioValue();
  };

  // Render the asset tab section
  const renderAssetTabs = () => {
    return (
      <div className="flex space-x-1 border-b border-gray-700 mb-2">
        {Object.values(ASSET_TYPES).map(assetType => {
          const isUnlocked = unlockedAssets.includes(assetType);
          
          return (
            <button
              key={assetType}
              className={`px-3 py-2 text-sm font-medium rounded-t-md transition ${
                activeAssetType === assetType
                  ? 'bg-gray-700 text-white'
                  : isUnlocked
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-900 text-gray-500 cursor-not-allowed'
              }`}
              onClick={() => isUnlocked && setActiveAssetType(assetType)}
              disabled={!isUnlocked}
            >
              {isUnlocked ? (
                assetType.charAt(0).toUpperCase() + assetType.slice(1)
              ) : (
                <div className="flex items-center space-x-1">
                  <Lock size={12} />
                  <span>???</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  // Render the asset selection list
  const renderAssetList = () => {
    const assets = getAssetList();
    
    return (
      <div className="grid grid-cols-2 gap-2 mb-4">
        {assets.map(asset => {
          const currentPrice = assetPrices[asset.id] !== undefined ? assetPrices[asset.id] : asset.basePrice;
          const priceHistory = chartData.filter(point => point.price !== undefined);
          const prevPrice = priceHistory.length > 1 ? priceHistory[priceHistory.length - 2]?.price : currentPrice;
          const priceChange = currentPrice - (prevPrice || currentPrice);
          const percentChange = prevPrice ? ((priceChange / prevPrice) * 100).toFixed(2) : "0.00";
          
          return (
            <div
              key={asset.id}
              className={`p-2 rounded cursor-pointer ${
                selectedAsset?.id === asset.id
                  ? 'bg-blue-900 border border-blue-700'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
              onClick={() => setSelectedAsset(asset)}
            >
              <div className="flex justify-between items-center">
                <div className="font-medium text-sm">{asset.symbol}</div>
                <div className={`text-xs ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {priceChange >= 0 ? '+' : ''}{percentChange}%
                </div>
              </div>
              <div className="flex justify-between items-center mt-1">
                <div className="text-xs text-gray-400">{asset.name}</div>
                <div className="text-sm font-mono">
                  ${currentPrice < 1 ? currentPrice.toFixed(6) : currentPrice.toFixed(2)}
                </div>
              </div>
              
              {/* Show owned amount if any */}
              {ownedAssets[asset.id] > 0 && (
                <div className="mt-1 text-xs text-blue-400">
                  Owned: {ownedAssets[asset.id].toFixed(asset.basePrice < 1 ? 4 : 2)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Render trading controls (buy/sell buttons)
  const renderTradingControls = () => {
    if (!selectedAsset) return null;
    
    const currentPrice = assetPrices[selectedAsset.id] !== undefined ? assetPrices[selectedAsset.id] : selectedAsset.basePrice;
    const owned = ownedAssets[selectedAsset.id] || 0;
    
    // Calculate percentage-based amounts
    const buy1Percent = Math.floor(money * 0.01 / currentPrice);
    const buy10Percent = Math.floor(money * 0.1 / currentPrice);
    const buy25Percent = Math.floor(money * 0.25 / currentPrice);
    const buyMax = Math.floor(money / currentPrice);
    
    const sell1Percent = Math.floor(owned * 0.01);
    const sell10Percent = Math.floor(owned * 0.1);
    const sell25Percent = Math.floor(owned * 0.25);
    const sellMax = owned;
    
    return (
      <div className="mt-4">
        <div className="flex justify-between mb-2">
          <div className="text-sm">
            <span className="text-gray-400">Current Price:</span>
            <span className="ml-2 font-mono">
              ${currentPrice < 1 ? currentPrice.toFixed(6) : currentPrice.toFixed(2)}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-gray-400">Owned:</span>
            <span className="ml-2 font-mono">
              {owned.toFixed(currentPrice < 1 ? 4 : 2)}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-sm font-medium mb-1 text-green-400">Buy</div>
            <div className="grid grid-cols-2 gap-1">
              <button
                className="bg-green-800/70 hover:bg-green-700 text-white text-xs rounded p-1"
                onClick={() => buyAsset(selectedAsset.id, buy1Percent)}
                disabled={buyMax < 1}
                title={`Buy ${buy1Percent} units for ${(buy1Percent * currentPrice).toFixed(2)}`}
              >
                Buy 1%
              </button>
              <button
                className="bg-green-800/70 hover:bg-green-700 text-white text-xs rounded p-1"
                onClick={() => buyAsset(selectedAsset.id, buy10Percent)}
                disabled={buyMax < 1}
                title={`Buy ${buy10Percent} units for ${(buy10Percent * currentPrice).toFixed(2)}`}
              >
                Buy 10%
              </button>
              <button
                className="bg-green-800/70 hover:bg-green-700 text-white text-xs rounded p-1"
                onClick={() => buyAsset(selectedAsset.id, buy25Percent)}
                disabled={buyMax < 1}
                title={`Buy ${buy25Percent} units for ${(buy25Percent * currentPrice).toFixed(2)}`}
              >
                Buy 25%
              </button>
              <button
                className="bg-green-700 hover:bg-green-600 text-white text-xs rounded p-1 font-bold"
                onClick={() => buyAsset(selectedAsset.id, buyMax)}
                disabled={buyMax <= 0}
                title={`Buy ${buyMax} units for ${(buyMax * currentPrice).toFixed(2)}`}
              >
                All In
              </button>
            </div>
          </div>
          
          <div>
            <div className="text-sm font-medium mb-1 text-red-400">Sell</div>
            <div className="grid grid-cols-2 gap-1">
              <button
                className="bg-red-800/70 hover:bg-red-700 text-white text-xs rounded p-1"
                onClick={() => sellAsset(selectedAsset.id, sell1Percent)}
                disabled={owned < 1}
                title={`Sell ${sell1Percent} units for ${(sell1Percent * currentPrice).toFixed(2)}`}
              >
                Sell 1%
              </button>
              <button
                className="bg-red-800/70 hover:bg-red-700 text-white text-xs rounded p-1"
                onClick={() => sellAsset(selectedAsset.id, sell10Percent)}
                disabled={owned < 1}
                title={`Sell ${sell10Percent} units for ${(sell10Percent * currentPrice).toFixed(2)}`}
              >
                Sell 10%
              </button>
              <button
                className="bg-red-800/70 hover:bg-red-700 text-white text-xs rounded p-1"
                onClick={() => sellAsset(selectedAsset.id, sell25Percent)}
                disabled={owned < 1}
                title={`Sell ${sell25Percent} units for ${(sell25Percent * currentPrice).toFixed(2)}`}
              >
                Sell 25%
              </button>
              <button
                className="bg-red-700 hover:bg-red-600 text-white text-xs rounded p-1 font-bold"
                onClick={() => sellAsset(selectedAsset.id, sellMax)}
                disabled={sellMax <= 0}
                title={`Sell ${sellMax} units for ${(sellMax * currentPrice).toFixed(2)}`}
              >
                All Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render the price chart with a cleaner trading-native approach
  const renderPriceChart = () => {
    if (!selectedAsset || chartData.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center bg-gray-900 rounded-lg">
          <span className="text-gray-500">No data available</span>
        </div>
      );
    }
    
    // Process chart data to include direction information
    // Only use a limited number of data points for rendering
    const maxRenderPoints = 50;
    const dataToRender = chartData.length > maxRenderPoints 
      ? chartData.slice(-maxRenderPoints) 
      : chartData;

    const processedData: AssetPrice[] = dataToRender.map((point, index) => ({
      ...point,
      isUp: index > 0 ? point.price >= dataToRender[index-1].price : true
    }));

    // Custom dot component
    const CustomizedDot = (props: {
      cx?: number,
      cy?: number,
      index?: number,
      payload?: {
        price: number,
        isUp?: boolean
      }
    }) => {
      const { cx, cy, index, payload } = props;
      if (!payload || index === undefined || cx === undefined || cy === undefined) return null;

      // Skip most dots for performance, show dots at regular intervals
      const dataLength = processedData.length;
      const interval = Math.max(1, Math.floor(dataLength / 8));
      
      if (index % interval !== 0 && index !== dataLength - 1) return null;
      return (
          <circle
              cx={cx}
              cy={cy}
              r={3}
              fill={payload.isUp ? '#34d399' : '#f87171'}
          />
      );
    };
    
    return (
      <div className="bg-gray-900 rounded-lg p-3 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF" 
              tick={{ fontSize: 10 }} 
              tickLine={{ stroke: '#4B5563' }} 
            />
            <YAxis 
              stroke="#9CA3AF" 
              tick={{ fontSize: 10 }} 
              tickLine={{ stroke: '#4B5563' }}
              domain={['auto', 'auto']}
              tickFormatter={(value) => value < 1 ? value.toFixed(6) : value.toFixed(2)}
            />
            <Tooltip content={<PriceTooltip />} />
            
            {/* Main dashed line to show the overall trend */}
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#6B7280"
              strokeWidth={1}
              strokeDasharray="3 3"
              dot={false}
              isAnimationActive={false}
            />
            
            {/* Add dots at certain intervals */}
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="none"
              dot={<CustomizedDot />}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // Render the upgrades panel
  const renderUpgradesPanel = () => {
    return (
      <div className="bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
        <h3 className="text-lg font-bold mb-3">Available Upgrades</h3>
        
        <div className="grid grid-cols-1 gap-2">
          {UPGRADES.map((upgrade: Upgrade) => {
            // Check if this upgrade is already purchased
            let isPurchased = false;
            if (upgrade.type === 'asset' && upgrade.unlocksAsset) {
              isPurchased = unlockedAssets.includes(upgrade.unlocksAsset);
            } else if (upgrade.type === 'resolution' && upgrade.level) {
              isPurchased = resolutionLevel >= upgrade.level;
            } else if (upgrade.type === 'agent') {
              isPurchased = hasAgent;
            }
            
            return (
              <div
                key={upgrade.id}
                className={`p-3 border rounded ${
                  isPurchased
                    ? 'bg-green-900/20 border-green-700'
                    : money >= upgrade.cost
                      ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 cursor-pointer'
                      : 'bg-gray-800 border-gray-700 opacity-60'
                }`}
                onClick={() => !isPurchased && money >= upgrade.cost && purchaseUpgrade(upgrade)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="mr-2">{upgrade.icon}</span>
                    <span className="font-medium text-sm">{upgrade.name}</span>
                  </div>
                  {isPurchased ? (
                    <span className="text-xs bg-green-800 text-green-200 px-2 py-1 rounded">Purchased</span>
                  ) : (
                    <span className="text-xs">${formatNumber(upgrade.cost)}</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">{upgrade.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen relative">
      {/* Debug Button */}
      <button
        className="absolute bottom-12 left-12 bg-transparent hover:bg-red-900/30 text-red-500 border-2 border-red-900 text-xs font-bold py-2 px-4 rounded z-10"
        onClick={() => setMoney(prev => prev + 1000000000)} // Add 1B
        hidden={pathname.includes("localhost")} // ONLY ON LOCALHOST URL
      >
        DEBUG +1B
      </button>
      
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center">
            <BarChart3 size={20} className="mr-2" />
            NeuraTrade Terminal v2.5
          </h2>
          
          <div className="flex items-center space-x-4">
            <div>
              <span className="text-gray-400">Neural Speed:</span>
              <span className="ml-2 text-yellow-400">{RESOLUTION_LEVELS[resolutionLevel].name}</span>
            </div>
            
            <div>
              <span className="text-gray-400">Liquidity:</span>
              <span className="ml-2 text-green-400">${formatNumber(money)}</span>
            </div>
            
            <div>
              <span className="text-gray-400">Assets:</span>
              <span className="ml-2 text-blue-400">${formatNumber(getPortfolioValue())}</span>
            </div>
            
            <div>
              <span className="text-gray-400">Net Worth:</span>
              <span className="ml-2 font-bold text-purple-400">${formatNumber(getTotalAssetsValue())}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          {/* Left panel: Controls and upgrades */}
          <div className="col-span-1">
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Neural Controls</h3>
                
                {hasAgent && (
                  <div className="text-xs bg-blue-900/50 border border-blue-700 text-blue-200 px-2 py-1 rounded flex items-center">
                    <Database size={12} className="mr-1" />
                    Synth-Agent™ Active
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="text-sm text-gray-400">Total Assets</div>
                  <div className="text-xl font-bold">${formatNumber(getTotalAssetsValue())}</div>
                </div>
                
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="text-sm text-gray-400">Profit/Loss</div>
                  <div className={`text-xl font-bold ${profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {profitLoss >= 0 ? '+' : ''}{formatNumber(profitLoss)}
                  </div>
                </div>
                
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="text-sm text-gray-400">Trades</div>
                  <div className="text-xl font-bold">{tradeCount}</div>
                </div>
                
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="text-sm text-gray-400">Update Rate</div>
                  <div className="text-lg font-bold flex items-center">
                    <Clock size={16} className="mr-1" />
                    {RESOLUTION_LEVELS[resolutionLevel].name}
                  </div>
                </div>
              </div>
              
              <button
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md transition flex justify-between items-center"
                onClick={() => setShowUpgrades(!showUpgrades)}
              >
                <span>{showUpgrades ? 'Hide Upgrades' : 'Show Upgrades'}</span>
                <ChevronRight size={16} className={`transition-transform ${showUpgrades ? 'rotate-90' : ''}`} />
              </button>
            </div>
            
            {showUpgrades && renderUpgradesPanel()}
          </div>
          
          {/* Right panel: Trading chart and interface */}
          <div className="col-span-2">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold flex items-center">
                    {activeAssetType === ASSET_TYPES.CRYPTO ? (
                      <Bitcoin size={18} className="mr-2" />
                    ) : (
                      <BarChart3 size={18} className="mr-2" />
                    )}
                    {activeAssetType.charAt(0).toUpperCase() + activeAssetType.slice(1)} Market
                  </h3>
                  
                  {selectedAsset && (
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">{selectedAsset.name}</span>
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded">{selectedAsset.symbol}</span>
                    </div>
                  )}
                </div>
                
                {renderAssetTabs()}
              </div>
              
              {renderAssetList()}
              
              {renderPriceChart()}
              
              {hasAgent && renderAgentControlPanel()}
              
              {renderTradingControls()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingGame;
