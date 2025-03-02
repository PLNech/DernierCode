import React, {useEffect, useState} from 'react';
import {
    Globe,
    Target,
    Users,
    BarChart2,
    Activity,
    Zap,
    PieChart,
    Wifi,
    ChevronUp,
    MessageCircle,
    Lock,
    X
} from 'lucide-react';
import {Country, Log, Operation} from "@/types/lvl4";
import {ACTIONS, CONTINENTS, INITIAL_COUNTRIES, UPGRADES} from "@/data/lvl4";
import CountryInfluenceGame from './InfluenceCards';

// Define TypeScript interfaces for the game state
// Actions available based on upgrades

const PropagandAI = () => {
    // Game state
    const [gameState, setGameState] = useState({
        day: 1,
        influence: 10000,
        money: 5000000, // Starting money from Level 3
        selectedCountry: "argentina", // Start with one of the controlled countries
        countries: INITIAL_COUNTRIES,
        actions: ACTIONS,
        upgrades: UPGRADES,
        activeOperations: [] as Operation[],
        logs: [] as Log[]
    });

    const [showUpgrades, setShowUpgrades] = useState(false);
    const [zoomedContinent, setZoomedContinent] = useState<string | null>(null);
    const [showCountryInfluenceGame, setShowCountryInfluenceGame] = useState(false);
    const [influenceGameCountry, setInfluenceGameCountry] = useState<Country | null>(null);
    const [pendingAction, setPendingAction] = useState<{
        actionId: string,
        targetCountryId: string,
        action: any,
        targetCountry: Country
    } | null>(null);

    const handleInfluenceGameComplete = (success: boolean) => {
        setShowCountryInfluenceGame(false);

        if (success && pendingAction) {
            // Continue with the original operation logic using pendingAction details
            const { actionId, targetCountryId, action, targetCountry } = pendingAction;

            // Create a new operation
            const newOperation: Operation = {
                id: `${actionId}-${targetCountryId}-${gameState.day}`,
                actionId,
                countryId: targetCountryId,
                daysLeft: action.cooldown,
                startDay: gameState.day
            };

            // Apply immediate effects to country
            const updatedCountries = {...gameState.countries};
            const countryStats = {...updatedCountries[targetCountryId].stats};

            // Rest of your existing operation creation logic...

            // Add log
            addLog(`Successfully influenced ${targetCountry.name} and started operation "${action.name}".`, 'success');

            // Update game state
            setGameState({
                ...gameState,
                influence: gameState.influence - action.cost,
                countries: updatedCountries,
                activeOperations: [...gameState.activeOperations, newOperation]
            });

        } else if (!success) {
            // Handle failure
            addLog(`Failed to influence ${pendingAction?.targetCountry.name}. Try a different approach.`, 'error');
        }

        // Clear pending action
        setPendingAction(null);
    }

    // Game tick - updates every 5 seconds
    useEffect(() => {
        const gameTick = setInterval(() => {
            setGameState(prevState => {
                // Calculate new influence from controlled countries
                const influenceGain = Object.values(prevState.countries)
                    .filter(country => country.controlled)
                    .reduce((sum, country) => sum + (5 + country.influenceLevel / 10), 0);

                // Update active operations
                const updatedOperations = prevState.activeOperations
                    .map(op => ({...op, daysLeft: op.daysLeft - 1}))
                    .filter(op => op.daysLeft > 0);

                // Add log for completed operations
                const newLogs = [...prevState.logs];
                prevState.activeOperations.forEach(op => {
                    if (op.daysLeft === 1) { // Operation just completed
                        const country = prevState.countries[op.countryId];
                        const action = prevState.actions[op.actionId];

                        newLogs.push({
                            id: `log-${Date.now()}-${Math.random()}`,
                            day: prevState.day,
                            message: `Operation "${action.name}" completed in ${country.name}.`,
                            type: 'success'
                        });
                    }
                });

                // Check if any country has reached control threshold
                const updatedCountries = {...prevState.countries};
                Object.entries(updatedCountries).forEach(([id, country]) => {
                    if (!country.controlled && (country.stats.politics + country.stats.control > 150)) {
                        updatedCountries[id] = {
                            ...country,
                            controlled: true
                        };

                        newLogs.push({
                            id: `log-${Date.now()}-${Math.random()}`,
                            day: prevState.day,
                            message: `${country.name} is now under your influence!`,
                            type: 'success'
                        });
                    }
                });

                return {
                    ...prevState,
                    day: prevState.day + 1,
                    influence: prevState.influence + influenceGain,
                    countries: updatedCountries,
                    activeOperations: updatedOperations,
                    logs: newLogs.slice(-100) // Keep only the most recent 100 logs
                };
            });
        }, 5000);

        return () => clearInterval(gameTick);
    }, []);

    const selectCountry = (countryId: string) => {
        // Check if the country exists in our data
        if (gameState.countries[countryId]) {
            setGameState({...gameState, selectedCountry: countryId});
        } else {
            console.error(`Country with ID ${countryId} not found`);
        }
    };

    const performAction = (actionId: string) => {
        const action = gameState.actions[actionId];
        const targetCountryId = gameState.selectedCountry;
        const targetCountry = gameState.countries[targetCountryId];

        if (gameState.influence < action.cost) {
            // Not enough influence
            addLog(`Not enough influence to perform ${action.name}.`, 'error');
            return;
        }

        // Check if country is controlled or neighbor of controlled country
        const isValidTarget = targetCountry.controlled ||
            Object.values(gameState.countries)
                .filter(country => country.controlled)
                .some(country => country.neighbors.includes(targetCountryId));

        if (!isValidTarget) {
            // Cannot target this country
            addLog(`Cannot target ${targetCountry.name}. Target must be controlled or adjacent to a controlled country.`, 'error');
            return;
        }

        setShowCountryInfluenceGame(true);
        setInfluenceGameCountry(gameState.countries[targetCountryId]);

        // Store action details for after game completion
        setPendingAction({
            actionId,
            targetCountryId,
            action,
            targetCountry
        });

        // Return early - actual action will be performed after winning the minigame
        return;

        // Create a new operation
        const newOperation: Operation = {
            id: `${actionId}-${targetCountryId}-${gameState.day}`,
            actionId,
            countryId: targetCountryId,
            daysLeft: action.cooldown,
            startDay: gameState.day
        };

        // Apply immediate effects to country
        const updatedCountries = {...gameState.countries};
        const countryStats = {...updatedCountries[targetCountryId].stats};

        // Apply action effects
        Object.entries(action.effect).forEach(([stat, value]) => {
            if (stat in countryStats) {
                countryStats[stat as keyof typeof countryStats] = Math.max(
                    0,
                    Math.min(100, countryStats[stat as keyof typeof countryStats] + (value || 0))
                );
            }
        });

        // Update country influence level
        const newInfluenceLevel = Math.min(
            100,
            updatedCountries[targetCountryId].influenceLevel +
            (countryStats.politics + countryStats.control + countryStats.media) / 10
        );

        // Check if country is now controlled (politics + control > 150)
        const newControlled = (countryStats.politics + countryStats.control > 150);

        updatedCountries[targetCountryId] = {
            ...updatedCountries[targetCountryId],
            stats: countryStats,
            influenceLevel: newInfluenceLevel,
            controlled: newControlled || updatedCountries[targetCountryId].controlled
        };

        // Add log
        addLog(`Started operation "${action.name}" in ${targetCountry.name}.`, 'info');

        // Update game state
        setGameState({
            ...gameState,
            influence: gameState.influence - action.cost,
            countries: updatedCountries,
            activeOperations: [...gameState.activeOperations, newOperation]
        });
    };

    const purchaseUpgrade = (upgradeId: string) => {
        const upgrade = gameState.upgrades[upgradeId];

        if (gameState.money < upgrade.cost) {
            // Not enough money
            addLog(`Not enough money to purchase ${upgrade.name}.`, 'error');
            return;
        }

        // Check prerequisite
        if (upgrade.prerequisite && !gameState.upgrades[upgrade.prerequisite].purchased) {
            // Prerequisite not met
            addLog(`Cannot purchase ${upgrade.name}. You need to purchase ${gameState.upgrades[upgrade.prerequisite].name} first.`, 'error');
            return;
        }

        // Update upgrades
        const updatedUpgrades = {...gameState.upgrades};
        updatedUpgrades[upgradeId].purchased = true;

        // Update available actions
        const updatedActions = {...gameState.actions};
        upgrade.unlocks.forEach(actionId => {
            if (actionId in updatedActions) {
                updatedActions[actionId].available = true;
            }
        });

        // Add log
        addLog(`Purchased upgrade: ${upgrade.name}.`, 'success');

        // Update game state
        setGameState({
            ...gameState,
            money: gameState.money - upgrade.cost,
            upgrades: updatedUpgrades,
            actions: updatedActions
        });
    };

    const addLog = (message: string, type: 'info' | 'success' | 'warning' | 'error') => {
        const newLog: Log = {
            id: `log-${Date.now()}-${Math.random()}`,
            day: gameState.day,
            message,
            type
        };

        setGameState(prevState => ({
            ...prevState,
            logs: [newLog, ...prevState.logs].slice(0, 100) // Keep only the most recent 100 logs
        }));
    };

    const selectedCountry = gameState.countries[gameState.selectedCountry];
    const controlledCountries = Object.values(gameState.countries).filter(country => country.controlled).length;
    const totalCountries = Object.values(gameState.countries).length;

    // Calculate if country can be targeted
    const canTargetSelectedCountry = selectedCountry.controlled ||
        Object.values(gameState.countries)
            .filter(country => country.controlled)
            .some(country => country.neighbors.includes(gameState.selectedCountry));

    // Helper function to format numbers
    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return Math.floor(num);
    };

    // Render the hexagonal world map
    const renderWorldMap = () => {
        const baseHexSize = 25; // Base size for hexagons
        const hexHeight = baseHexSize * 2;
        const hexWidth = Math.sqrt(3) * baseHexSize;
        const mapWidth = 1000;
        const mapHeight = 600;

        // Scale size based on population
        const getScaledHexSize = (population: number) => {
            // Scale logarithmically because of huge differences in country populations
            const scaleFactor = Math.log(population + 10) / Math.log(1000);
            return baseHexSize * (0.8 + scaleFactor * 0.6); // Scale between 80% and 140% of base size
        };

        // Calculate positions for each country
        const positionedCountries = Object.values(gameState.countries).map(country => {
            // Calculate grid position based on continent and country position
            const continent = CONTINENTS.find(c => c.id === country.continent);
            const baseX = continent ? (continent.position.x * hexWidth * 1.5) : 0;
            const baseY = continent ? (continent.position.y * hexHeight * 0.75) : 0;

            // Add country-specific offset
            const offsetX = country.position.x * hexWidth * 0.75;
            const offsetY = country.position.y * hexHeight * 0.5;

            return {
                ...country,
                renderPosition: {
                    x: baseX + offsetX,
                    y: baseY + offsetY
                }
            };
        });

        // Function to generate hexagon points
        const getHexPoints = (x: number, y: number, size: number) => {
            const points = [];
            for (let i = 0; i < 6; i++) {
                const angle = 2 * Math.PI / 6 * i - Math.PI / 6;
                points.push({
                    x: x + size * Math.cos(angle),
                    y: y + size * Math.sin(angle)
                });
            }
            return points.map(p => `${p.x},${p.y}`).join(' ');
        };

        return (
            <div className="relative w-full overflow-hidden border border-gray-700 rounded-lg bg-gray-900"
                 style={{height: mapHeight}}>
                <svg width={mapWidth} height={mapHeight} viewBox={`0 0 ${mapWidth} ${mapHeight}`}
                     className="absolute top-0 left-0">
                    {/* Grid lines for reference */}
                    <g className="grid-lines opacity-20">
                        {Array.from({length: 20}).map((_, i) => (
                            <line
                                key={`h-line-${i}`}
                                x1="0"
                                y1={i * hexHeight * 0.25}
                                x2={mapWidth}
                                y2={i * hexHeight * 0.25}
                                stroke="#1e293b"
                                strokeWidth="1"
                            />
                        ))}
                        {Array.from({length: 20}).map((_, i) => (
                            <line
                                key={`v-line-${i}`}
                                x1={i * hexWidth * 0.5}
                                y1="0"
                                x2={i * hexWidth * 0.5}
                                y2={mapHeight}
                                stroke="#1e293b"
                                strokeWidth="1"
                            />
                        ))}
                    </g>

                    {/* Continent labels */}
                    {CONTINENTS.map(continent => {
                        const centerX = continent.position.x * hexWidth * 1.5;
                        const centerY = continent.position.y * hexHeight * 0.75;

                        return (
                            <text
                                key={continent.id}
                                x={centerX}
                                y={centerY - hexHeight * 0.5}
                                className="text-xs fill-gray-500 font-bold"
                                textAnchor="middle"
                            >
                                {continent.name}
                            </text>
                        );
                    })}

                    {/* Country connections/borders */}
                    <g className="country-connections">
                        {positionedCountries.map(country =>
                            country.neighbors.map(neighborId => {
                                const neighbor = positionedCountries.find(c => c.id === neighborId);
                                // Skip if neighbor is not found or positions aren't available
                                if (!neighbor || !country.renderPosition || !neighbor.renderPosition) {
                                    return null;
                                }

                                // Check if this connection has already been drawn (to avoid duplicates)
                                if (neighbor.id > country.id) {
                                    return (
                                        <line
                                            key={`${country.id}-${neighborId}`}
                                            x1={country.renderPosition.x}
                                            y1={country.renderPosition.y}
                                            x2={neighbor.renderPosition.x}
                                            y2={neighbor.renderPosition.y}
                                            stroke={
                                                country.controlled && neighbor.controlled
                                                    ? "#10b981" // Bright green if both controlled
                                                    : country.controlled || neighbor.controlled
                                                        ? "#6366f1" // Purple if one is controlled
                                                        : "#334155" // Gray otherwise
                                            }
                                            strokeWidth={
                                                country.controlled && neighbor.controlled
                                                    ? 2
                                                    : country.controlled || neighbor.controlled
                                                        ? 1.5
                                                        : 1
                                            }
                                            strokeOpacity={0.6}
                                            strokeDasharray={
                                                country.controlled && neighbor.controlled
                                                    ? "none"
                                                    : "4,2"
                                            }
                                        />
                                    );
                                }
                                return null;
                            })
                        )}
                    </g>

                    {/* Country hexagons */}
                    <g className="country-hexagons">
                        {positionedCountries.map(country => {
                            const {renderPosition} = country;
                            if (!renderPosition) return null;

                            const hexSize = getScaledHexSize(country.population);

                            // Calculate influence level for gradient
                            const influencePercent = country.influenceLevel;

                            // Determine hexagon color based on control status
                            let fillColor = country.controlled
                                ? `rgba(16, 185, 129, ${Math.max(0.3, influencePercent / 100)})`
                                : country.influenceLevel > 50
                                    ? `rgba(99, 102, 241, ${Math.max(0.3, influencePercent / 100)})`
                                    : country.influenceLevel > 25
                                        ? `rgba(139, 92, 246, ${Math.max(0.3, influencePercent / 100)})`
                                        : `rgba(30, 41, 59, 0.7)`;

                            // For countries that are being targeted but not controlled
                            if (!country.controlled && gameState.activeOperations.some(op => op.countryId === country.id)) {
                                fillColor = `rgba(99, 102, 241, ${Math.max(0.3, influencePercent / 100)})`;
                            }

                            // Highlight selected country
                            const isSelected = country.id === gameState.selectedCountry;
                            const strokeColor = isSelected
                                ? "#fbbf24" // Yellow for selected
                                : country.controlled
                                    ? "#10b981" // Green for controlled
                                    : canTargetSelectedCountry && country.id === gameState.selectedCountry
                                        ? "#6366f1" // Purple for targetable
                                        : "#1e293b"; // Dark for others

                            return (
                                <g
                                    key={country.id}
                                    className="country-group cursor-pointer hover:opacity-90 transition-opacity duration-200"
                                    onClick={() => country.id && selectCountry(country.id)}
                                >
                                    {/* Hexagon */}
                                    <polygon
                                        points={getHexPoints(renderPosition.x, renderPosition.y, hexSize)}
                                        fill={fillColor}
                                        stroke={strokeColor}
                                        strokeWidth={isSelected ? 3 : 1.5}
                                        className="transition-all duration-300"
                                    />

                                    {/* Country label */}
                                    <text
                                        x={renderPosition.x}
                                        y={renderPosition.y}
                                        textAnchor="middle"
                                        alignmentBaseline="central"
                                        className={`text-xs font-medium ${isSelected ? 'fill-white' : 'fill-gray-300'}`}
                                        style={{fontSize: `${Math.max(9, 11 * Math.log10(country.population / 10 + 1))}px`}}
                                    >
                                        {country.name.length > 8 ? country.name.substring(0, 8) + '.' : country.name}
                                    </text>

                                    {/* Status indicator */}
                                    {(country.controlled || gameState.activeOperations.some(op => op.countryId === country.id)) && (
                                        <circle
                                            cx={renderPosition.x}
                                            cy={renderPosition.y - hexSize * 0.6}
                                            r={hexSize * 0.15}
                                            fill={country.controlled ? "#10b981" : "#6366f1"}
                                            className={gameState.activeOperations.some(op => op.countryId === country.id) ? "animate-pulse" : ""}
                                        />
                                    )}
                                </g>
                            );
                        })}
                    </g>

                    {/* Active operations animations */}
                    <g className="operations-animations">
                        {gameState.activeOperations.map(operation => {
                            const country = positionedCountries.find(c => c.id === operation.countryId);
                            const action = gameState.actions[operation.actionId];

                            if (!country || !country.renderPosition) return null;

                            const hexSize = getScaledHexSize(country.population);

                            // Show pulses or beams emanating from controlled countries to the target
                            return (
                                <g key={operation.id} className="operation-effect">
                                    <circle
                                        cx={country.renderPosition.x}
                                        cy={country.renderPosition.y}
                                        r={hexSize * 0.8 * (1 - operation.daysLeft / action.cooldown)}
                                        fill="none"
                                        stroke="#6366f1"
                                        strokeWidth="2"
                                        strokeOpacity="0.5"
                                        className="animate-pulse"
                                    />
                                </g>
                            );
                        })}
                    </g>
                </svg>

                {/* Map overlay with stats and info */}
                <div className="absolute bottom-2 left-2 bg-gray-900/90 rounded p-2 text-xs border border-gray-700">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                            <span>Controlled ({controlledCountries})</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-purple-500 rounded-full mr-1"></div>
                            <span>Operations ({gameState.activeOperations.length})</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-gray-600 rounded-full mr-1"></div>
                            <span>Neutral ({totalCountries - controlledCountries})</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Render star chart for country stats
    const renderCountryStatsChart = (country: Country) => {
        const centerX = 100;
        const centerY = 100;
        const radius = 80;
        const stats = country.stats;

        // Define colors for each stat with cyberpunk theme
        const statColors = {
            politics: '#f472b6', // Hot pink for Politics
            media: '#3b82f6',    // Bright blue for Media
            control: '#10b981',  // Bright green for Control
            trust: '#f59e0b',    // Amber/orange for Trust
            diplomacy: '#8b5cf6' // Purple for Diplomacy
        };

        const statNames = ['politics', 'media', 'control', 'trust', 'diplomacy'];

        // Calculate points for each stat
        const points = statNames.map((stat, index) => {
            const angle = (index / statNames.length) * 2 * Math.PI - Math.PI / 2;
            const value = stats[stat as keyof typeof stats] / 100;
            return {
                x: centerX + radius * value * Math.cos(angle),
                y: centerY + radius * value * Math.sin(angle),
                label: stat.charAt(0).toUpperCase() + stat.slice(1),
                value: stats[stat as keyof typeof stats],
                color: statColors[stat as keyof typeof statColors]
            };
        });

        // Create the polygon points string
        const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');

        return (
            <div className="relative w-full h-full">
                <svg width="200" height="200" viewBox="0 0 200 200" className="population-chart">
                    {/* Background circles */}
                    <circle cx={centerX} cy={centerY} r={radius * 0.25} fill="none" stroke="#1e293b" strokeWidth="1"/>
                    <circle cx={centerX} cy={centerY} r={radius * 0.5} fill="none" stroke="#1e293b" strokeWidth="1"/>
                    <circle cx={centerX} cy={centerY} r={radius * 0.75} fill="none" stroke="#1e293b" strokeWidth="1"/>
                    <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#1e293b" strokeWidth="1"/>

                    {/* Axis lines */}
                    {statNames.map((stat, index) => {
                        const angle = (index / statNames.length) * 2 * Math.PI - Math.PI / 2;
                        const color = statColors[stat as keyof typeof statColors];
                        return (
                            <line
                                key={`axis-${index}`}
                                x1={centerX}
                                y1={centerY}
                                x2={centerX + radius * Math.cos(angle)}
                                y2={centerY + radius * Math.sin(angle)}
                                stroke={`${color}44`} // With transparency
                                strokeWidth="1"
                            />
                        );
                    })}

                    {/* Stat polygon with gradient */}
                    <polygon
                        points={polygonPoints}
                        fill="rgba(99, 102, 241, 0.2)"
                        stroke="rgba(99, 102, 241, 0.7)"
                        strokeWidth="1.5"
                        className="filter drop-shadow-lg"
                    />

                    {/* Stat points */}
                    {points.map((point, index) => (
                        <circle
                            key={`point-${index}`}
                            cx={point.x}
                            cy={point.y}
                            r="4"
                            fill={point.color}
                            className="filter drop-shadow-md"
                        />
                    ))}

                    {/* Stat labels */}
                    {points.map((point, index) => {
                        const angle = (index / statNames.length) * 2 * Math.PI - Math.PI / 2;
                        const labelX = centerX + (radius + 15) * Math.cos(angle);
                        const labelY = centerY + (radius + 15) * Math.sin(angle);

                        return (
                            <g key={`label-${index}`}>
                                <text
                                    x={labelX}
                                    y={labelY}
                                    textAnchor="middle"
                                    alignmentBaseline="central"
                                    fill={point.color}
                                    className="text-xs font-bold"
                                >
                                    {point.label} ({point.value})
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        );
    };

    // Render active operations for the selected country
    const renderActiveOperations = (countryId: string) => {
        const operations = gameState.activeOperations.filter(op => op.countryId === countryId);

        if (operations.length === 0) {
            return (
                <div className="text-sm text-gray-500 italic">No active operations in this country.</div>
            );
        }

        return (
            <div className="space-y-2">
                {operations.map(operation => {
                    const action = gameState.actions[operation.actionId];
                    const progress = 1 - operation.daysLeft / action.cooldown;

                    return (
                        <div key={operation.id} className="p-2 bg-gray-800 rounded border border-purple-900">
                            <div className="flex justify-between items-center">
                                <div className="font-medium text-sm">{action.name}</div>
                                <div className="text-xs bg-purple-900/50 px-2 py-1 rounded">
                                    {operation.daysLeft} days left
                                </div>
                            </div>

                            <div className="mt-1">
                                <div className="text-xs text-gray-400 flex justify-between mb-1">
                                    <span>Progress</span>
                                    <span>{Math.round(progress * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                    <div
                                        className="bg-purple-500 h-full rounded-full"
                                        style={{width: `${progress * 100}%`}}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="w-full h-screen bg-gray-900 text-gray-200 flex flex-col overflow-hidden font-mono">
            {/* Header - Game Stats */}
            <div className="p-3 bg-gray-800 border-b border-cyan-900 flex justify-between items-center">
                <div className="flex space-x-6 items-center">
                    <h1 className="text-2xl font-bold text-cyan-400">PropagandAI</h1>
                    <div className="flex items-center">
                        <Zap className="h-4 w-4 text-yellow-400 mr-2"/>
                        <span>Day: <span className="text-yellow-400 font-bold">{gameState.day}</span></span>
                    </div>
                    <div className="flex items-center">
                        <Target className="h-4 w-4 text-green-400 mr-2"/>
                        <span>Influence: <span
                            className="text-green-400 font-bold">{formatNumber(gameState.influence)}</span></span>
                    </div>
                    <div className="flex items-center">
                        <Globe className="h-4 w-4 text-purple-400 mr-2"/>
                        <span>Control: <span
                            className="text-purple-400 font-bold">{controlledCountries}/{totalCountries}</span></span>
                    </div>
                    <div className="flex items-center">
                        <Target className="h-4 w-4 text-cyan-400 mr-2"/>
                        <span>Datacenter Funds: <span
                            className="text-cyan-400 font-bold">${formatNumber(gameState.money)}</span></span>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm border border-cyan-800"
                        onClick={() => setShowUpgrades(!showUpgrades)}
                    >
                        {showUpgrades ? "Hide Upgrades" : "Show Upgrades"}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-grow flex flex-col overflow-hidden">
                {/* World Map - 50% height */}
                <div className="w-full h-1/2 p-4 bg-gray-850 relative">
                    <h2 className="text-xl text-cyan-400 mb-3 font-bold">Global Influence Map</h2>
                    {renderWorldMap()}
                </div>

                {/* Country Detail and Actions - 50% height */}
                <div className="w-full h-1/2 flex overflow-hidden border-t border-gray-700">{/* Country Details */}
                    {/* Country Details */}
                    <div className="w-1/2 p-4 bg-gray-800 overflow-y-auto border-r border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl text-cyan-400 font-bold">{selectedCountry.name} Dashboard</h2>
                            <div className={`px-2 py-1 rounded text-xs ${
                                selectedCountry.controlled ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'
                            }`}>
                                {selectedCountry.controlled ? 'CONTROLLED' : 'TARGET'}
                            </div>
                        </div>

                        <div className="flex">
                            {/* Stats Chart */}
                            <div className="w-1/2">
                                <h3 className="text-sm text-gray-400 mb-3 font-medium">Population Influence Metrics</h3>
                                {renderCountryStatsChart(selectedCountry)}
                            </div>

                            {/* Country Info and Operations */}
                            <div className="w-1/2 pl-4">
                                <div className="mb-4">
                                    <h3 className="text-sm text-gray-400 mb-2 font-medium">Country Status</h3>
                                    <div className="bg-gray-850 rounded-lg p-3 space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-xs text-gray-400">Population:</span>
                                            <span
                                                className="text-xs font-medium">{selectedCountry.population.toLocaleString()} million</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-xs text-gray-400">Influence Level:</span>
                                            <span
                                                className="text-xs font-medium">{selectedCountry.influenceLevel.toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 h-2 rounded-full">
                                            <div
                                                className="bg-green-500 h-2 rounded-full"
                                                style={{width: `${selectedCountry.influenceLevel}%`}}
                                            ></div>
                                        </div>

                                        <div className="text-xs text-gray-400">
                                            Neighbors: {selectedCountry.neighbors.map(id => gameState.countries[id]?.name || id).join(', ')}
                                        </div>

                                        <div className="text-xs text-gray-500">
                                            {selectedCountry.controlled ?
                                                'Status: Country under your influence' :
                                                canTargetSelectedCountry ?
                                                    'Status: Country can be targeted for operations' :
                                                    'Status: Country outside your sphere of influence'
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm text-gray-400 mb-2 font-medium">Active Operations</h3>
                                    <div className="bg-gray-850 rounded-lg p-3 max-h-32 overflow-y-auto">
                                        {renderActiveOperations(selectedCountry.id)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions and Logs */}
                    <div className="w-1/2 p-4 bg-gray-800 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl text-cyan-400 font-bold">Operations Center</h2>
                            <div className="text-xs text-gray-400">
                                {gameState.activeOperations.length} active operations
                            </div>
                        </div>

                        {/* Actions Panel */}
                        <div className="mb-4">
                            <h3 className="text-sm text-gray-400 mb-2 font-medium">Available Actions</h3>

                            <div className="grid grid-cols-1 gap-2">
                                {Object.values(gameState.actions)
                                    .filter(action => action.available)
                                    .map(action => {
                                        const canAfford = gameState.influence >= action.cost;
                                        const canTarget = canTargetSelectedCountry;

                                        return (
                                            <button
                                                key={action.id}
                                                onClick={() => canAfford && canTarget && performAction(action.id)}
                                                className={`p-2 text-left rounded border flex justify-between items-center ${
                                                    canAfford && canTarget
                                                        ? 'bg-gray-800 border-cyan-700 hover:bg-gray-700 cursor-pointer'
                                                        : 'bg-gray-800 border-gray-700 opacity-60 cursor-not-allowed'
                                                }`}
                                                disabled={!canAfford || !canTarget}
                                            >
                                                <div>
                                                    <div className="font-medium text-sm">{action.name}</div>
                                                    <div className="text-xs text-gray-400">{action.description}</div>

                                                    {/* Add visual indicators for the action's effects */}
                                                    <div className="flex space-x-3 mt-1">
                                                        {action.effect.politics && (
                                                            <span
                                                                className={`text-xs px-1 rounded ${action.effect.politics > 0 ? 'bg-pink-900/50 text-pink-300' : 'bg-pink-900/30 text-pink-500'}`}>
                            P: {action.effect.politics > 0 ? '+' : ''}{action.effect.politics}
                          </span>
                                                        )}
                                                        {action.effect.media && (
                                                            <span
                                                                className={`text-xs px-1 rounded ${action.effect.media > 0 ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-900/30 text-blue-500'}`}>
                            M: {action.effect.media > 0 ? '+' : ''}{action.effect.media}
                          </span>
                                                        )}
                                                        {action.effect.control && (
                                                            <span
                                                                className={`text-xs px-1 rounded ${action.effect.control > 0 ? 'bg-green-900/50 text-green-300' : 'bg-green-900/30 text-green-500'}`}>
                            C: {action.effect.control > 0 ? '+' : ''}{action.effect.control}
                          </span>
                                                        )}
                                                        {action.effect.trust && (
                                                            <span
                                                                className={`text-xs px-1 rounded ${action.effect.trust > 0 ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-900/30 text-yellow-500'}`}>
                            T: {action.effect.trust > 0 ? '+' : ''}{action.effect.trust}
                          </span>
                                                        )}
                                                        {action.effect.diplomacy && (
                                                            <span
                                                                className={`text-xs px-1 rounded ${action.effect.diplomacy > 0 ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-900/30 text-purple-500'}`}>
                            D: {action.effect.diplomacy > 0 ? '+' : ''}{action.effect.diplomacy}
                          </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-yellow-400 text-sm">{action.cost}</div>
                                            </button>
                                        );
                                    })}
                            </div>

                            {Object.values(gameState.actions).filter(action => action.available).length === 0 && (
                                <div className="text-sm text-gray-500">No actions available. Purchase upgrades.</div>
                            )}
                        </div>

                        {/* Activity Log */}
                        <div>
                            <h3 className="text-sm text-gray-400 mb-2 font-medium">Activity Log</h3>
                            <div className="bg-gray-850 rounded-lg p-3 max-h-40 overflow-y-auto">
                                {gameState.logs.length === 0 ? (
                                    <div className="text-sm text-gray-500 italic">No activity yet.</div>
                                ) : (
                                    <div className="space-y-2">
                                        {gameState.logs.slice(0, 10).map(log => (
                                            <div key={log.id} className={`text-xs p-1.5 rounded ${
                                                log.type === 'success' ? 'bg-green-900/30 border-l-2 border-green-600' :
                                                    log.type === 'error' ? 'bg-red-900/30 border-l-2 border-red-600' :
                                                        log.type === 'warning' ? 'bg-yellow-900/30 border-l-2 border-yellow-600' :
                                                            'bg-gray-800 border-l-2 border-cyan-600'
                                            }`}>
                                                <div className="flex">
                                                    <span className="text-gray-500">Day {log.day}: </span>
                                                    <span className="ml-1">{log.message}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upgrades Panel (conditional) */}
            {showUpgrades && (
                <div className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-cyan-900 p-4 shadow-lg"
                     style={{maxHeight: '50vh', overflowY: 'auto'}}>
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-xl text-cyan-400 font-bold">Technology Upgrades</h2>
                        <button
                            onClick={() => setShowUpgrades(false)}
                            className="text-gray-400 hover:text-white"
                        >
                            <ChevronUp className="h-5 w-5"/>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.values(gameState.upgrades).map(upgrade => {
                            const canAfford = gameState.money >= upgrade.cost;
                            const meetsPrerequisite = !upgrade.prerequisite || gameState.upgrades[upgrade.prerequisite].purchased;
                            const isPurchased = upgrade.purchased;

                            return (
                                <div
                                    key={upgrade.id}
                                    className={`p-3 rounded border ${
                                        isPurchased
                                            ? 'bg-green-900/30 border-green-700'
                                            : canAfford && meetsPrerequisite
                                                ? 'bg-gray-800 border-cyan-700 hover:bg-gray-700 cursor-pointer'
                                                : 'bg-gray-800 border-gray-700 opacity-60'
                                    }`}
                                    onClick={() => !isPurchased && canAfford && meetsPrerequisite && purchaseUpgrade(upgrade.id)}
                                >
                                    <div className="flex justify-between">
                                        <h3 className="font-bold">{upgrade.name}</h3>
                                        {isPurchased ? (
                                            <span
                                                className="text-xs px-2 py-1 bg-green-800 text-green-200 rounded">Purchased</span>
                                        ) : (
                                            <span className="text-yellow-400">${formatNumber(upgrade.cost)}</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-400 mt-1">{upgrade.description}</p>

                                    {!isPurchased && upgrade.prerequisite && (
                                        <div className="mt-2 text-xs">
                                            <span className="text-gray-500">Requires: </span>
                                            <span className={gameState.upgrades[upgrade.prerequisite].purchased
                                                ? "text-green-400"
                                                : "text-red-400"
                                            }>
                    {gameState.upgrades[upgrade.prerequisite].name}
                  </span>
                                        </div>
                                    )}

                                    {!isPurchased && upgrade.unlocks && (
                                        <div className="mt-2 text-xs text-gray-500">
                                            Unlocks: {upgrade.unlocks.map(actionId => gameState.actions[actionId]?.name || '').filter(Boolean).join(', ')}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            {showCountryInfluenceGame && influenceGameCountry && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
                    <div className="relative w-4/5 h-4/5 bg-gray-900 rounded-lg overflow-hidden">
                        <div className="absolute top-2 right-2">
                            <button
                                onClick={() => {
                                    setShowCountryInfluenceGame(false);
                                    setPendingAction(null);
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="p-4 h-full">
                            <CountryInfluenceGame
                                country={{
                                    id: influenceGameCountry.id,
                                    name: influenceGameCountry.name,
                                    traits: {
                                        politics: influenceGameCountry.stats.politics,
                                        media: influenceGameCountry.stats.media,
                                        control: influenceGameCountry.stats.control,
                                        trust: influenceGameCountry.stats.trust,
                                        diplomacy: influenceGameCountry.stats.diplomacy
                                    },
                                    controlled: influenceGameCountry.controlled,
                                    influenceLevel: influenceGameCountry.influenceLevel
                                }}
                                onComplete={handleInfluenceGameComplete}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
);
};

export default PropagandAI;