"use client"

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, TrendingUp, Users, Star, Plus, BarChart3, Activity, X } from 'lucide-react';

// Type definitions
interface Sport {
  id: string;
  name: string;
  icon: string;
}

interface MLModel {
  id: string;
  name: string;
  accuracy: string;
  icon?: string;
}

interface Player {
  id: number;
  name: string;
  team: string;
  position: string;
  sport: string;
}

interface ProjectionType {
  id: string;
  name: string;
  unit: string;
  icon?: string;
}

interface SavedProjection {
  id: number;
  player: string;
  projection: string;
  value: string;
  date: string;
}

interface Lineup {
  id: number;
  name: string;
  players: number;
  projections: number;
  created: string;
}

// Data constants 
const SPORTS_DATA: Sport[] = [
  { id: 'nfl', name: 'NFL Football', icon: '🏈' },
  { id: 'nba', name: 'NBA Basketball', icon: '🏀' },
  { id: 'mlb', name: 'MLB Baseball', icon: '⚾' },
  { id: 'nhl', name: 'NHL Hockey', icon: '🏒' }
];

const ML_MODELS: MLModel[] = [
  { id: 'neural', name: 'Neural Network v2.1', accuracy: '94%' },
  { id: 'ensemble', name: 'Ensemble Model', accuracy: '91%' },
  { id: 'regression', name: 'Linear Regression', accuracy: '87%' },
  { id: 'forest', name: 'Random Forest', accuracy: '89%' }
];

const RECENT_PLAYERS: Player[] = [
  { id: 1, name: 'Josh Allen', team: 'BUF', position: 'QB', sport: 'nfl' },
  { id: 2, name: 'Cooper Kupp', team: 'LAR', position: 'WR', sport: 'nfl' },
  { id: 3, name: 'Travis Kelce', team: 'KC', position: 'TE', sport: 'nfl' },
  { id: 4, name: 'Tyreek Hill', team: 'MIA', position: 'WR', sport: 'nfl' }
];

const PROJECTION_TYPES: ProjectionType[] = [
  { id: 'receptions', name: 'Receptions', unit: 'rec' },
  { id: 'receiving_yards', name: 'Receiving Yards', unit: 'yds' },
  { id: 'touchdowns', name: 'Touchdowns', unit: 'td' },
  { id: 'passing_yards', name: 'Passing Yards', unit: 'yds' },
  { id: 'rushing_yards', name: 'Rushing Yards', unit: 'yds' }
];

const SAVED_PROJECTIONS: SavedProjection[] = [
  { id: 1, player: 'Josh Allen', projection: 'Passing Yards', value: '287.5', date: '2025-06-12' },
  { id: 2, player: 'Cooper Kupp', projection: 'Receptions', value: '8.5', date: '2025-06-11' },
  { id: 3, player: 'Travis Kelce', projection: 'Receiving Yards', value: '76.5', date: '2025-06-11' }
];

const LINEUPS: Lineup[] = [
  { id: 1, name: 'Week 18 Lineup', players: 6, projections: 8, created: '2025-06-12' },
  { id: 2, name: 'TNF Special', players: 4, projections: 6, created: '2025-06-11' },
  { id: 3, name: 'Sunday Slate', players: 8, projections: 12, created: '2025-06-10' }
];

// Component interfaces
interface DropdownProps {
  options: (Sport | MLModel | ProjectionType)[];
  selected: Sport | MLModel | ProjectionType | null;
  onSelect: (option: Sport | MLModel | ProjectionType) => void;
  placeholder: string;
  className?: string;
}

// Components
const Dropdown: React.FC<DropdownProps> = ({ options, selected, onSelect, placeholder, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#0B1901]/50 border border-green-800 rounded-lg px-4 py-3 text-left text-white flex items-center justify-between hover:bg-[#0B1901]/70 transition-all"
      >
        <span className="flex items-center gap-2">
          {selected ? (
            <>
              {'icon' in selected && selected.icon && <span>{selected.icon}</span>}
              {selected.name}
              {'accuracy' in selected && selected.accuracy && <span className="text-green-400 text-sm">({selected.accuracy})</span>}
            </>
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#0B1901] border border-green-800 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left text-white hover:bg-green-800/50 flex items-center gap-2 border-b border-green-800 last:border-b-0"
            >
              {'icon' in option && option.icon && <span>{option.icon}</span>}
              {option.name}
              {'accuracy' in option && option.accuracy && <span className="ml-auto text-green-400 text-sm">({option.accuracy})</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface PlayerCardProps {
  player: Player;
  isActive: boolean;
  onClick: (player: Player) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, isActive, onClick }) => (
  <button
    onClick={() => onClick(player)}
    className={`p-3 rounded-lg border transition-all hover:scale-105 ${
      isActive 
        ? 'bg-green-600/30 border-green-500 text-green-400' 
        : 'bg-[#0B1901]/50 border-green-800 text-white hover:bg-[#0B1901]/70'
    }`}
  >
    <div className="text-sm font-medium">{player.name}</div>
    <div className="text-xs opacity-75">{player.team} • {player.position}</div>
  </button>
);

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder }) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-[#0B1901]/50 border border-green-800 rounded-full pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
    />
  </div>
);

interface ProjectionChartProps {
  data: number[];
  type: ProjectionType;
}

const ProjectionChart: React.FC<ProjectionChartProps> = ({ data, type }) => {
  const chartData = [65, 78, 82, 75, 90, 85, 92];
  const maxValue = Math.max(...chartData);
  
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-white">7-Day Trend</h4>
        <div className="flex items-center gap-2 text-green-400">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm">+12% trend</span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 items-end h-32">
        {chartData.map((value, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t transition-all hover:from-green-500 hover:to-green-300"
              style={{
                height: `${(value / maxValue) * 100}%`,
                minHeight: '8px'
              }}
            />
            <span className="text-xs text-gray-400 mt-1">
              {new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000).getDate()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface SaveModal {
  isOpen: boolean;
  onClose: () => void;
  onSave: (type: 'projection' | 'lineup') => void;
}

const SaveModal: React.FC<SaveModal> = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#0B1901] border border-green-800 rounded-xl p-6 max-w-sm w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Save Current Selection</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-green-800/50 rounded"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <p className="text-gray-300 mb-6">Where would you like to save this?</p>
        <div className="space-y-3">
          <button
            onClick={() => onSave('projection')}
            className="w-full bg-green-600/20 hover:bg-green-600/30 border border-green-600 rounded-lg p-3 text-white transition-all"
          >
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>Save as Projection</span>
            </div>
          </button>
          <button
            onClick={() => onSave('lineup')}
            className="w-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600 rounded-lg p-3 text-white transition-all"
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span>Add to Lineup</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function SportsDashboard() {
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [selectedModel, setSelectedModel] = useState<MLModel | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(RECENT_PLAYERS[0]);
  const [selectedProjection, setSelectedProjection] = useState<ProjectionType>(PROJECTION_TYPES[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [scrollY, setScrollY] = useState<number>(0);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);

  const handleSaveProjection = (player: Player, projection: ProjectionType) => {
    setSelectedPlayer(player);
    setSelectedProjection(projection);
  };

  const handleSave = (type: 'projection' | 'lineup') => {
    // Here you would make API calls to save the data
    console.log(`Saving as ${type}:`, {
      player: selectedPlayer,
      projection: selectedProjection
    });
    setShowSaveModal(false);
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="mt-21 min-h-screen bg-gradient-to-br from-n-8 to-n-7 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute top-20 left-20 w-96 h-96 bg-green-500 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        />
        <div 
          className="absolute bottom-20 right-20 w-80 h-80 bg-emerald-400 rounded-full blur-3xl"
          style={{ transform: `translateY(${-scrollY * 0.15}px)` }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-600 rounded-full blur-2xl"
          style={{ transform: `translate(-50%, -50%) translateY(${scrollY * 0.1}px)` }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent mb-4">
            Sports Analytics Hub
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Advanced ML-powered player projections and analytics for optimal lineup construction
          </p>
        </div>

        {/* Control Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Sport Selection */}
          <div className="bg-gradient-to-br from-n-8 to-n-6 backdrop-blur-sm rounded-xl p-4 border border-green-800/50">
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Select Sport
            </label>
            <Dropdown 
              options={SPORTS_DATA}
              selected={selectedSport}
              onSelect={(option) => setSelectedSport(option as Sport)}
              placeholder="Choose sport..."
            />
          </div>

          {/* ML Model Selection */}
          <div className="bg-gradient-to-br from-n-8 to-n-6 backdrop-blur-sm rounded-xl p-4 border border-green-800/50">
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              ML Model
            </label>
            <Dropdown
              options={ML_MODELS}
              selected={selectedModel}
              onSelect={(option) => setSelectedModel(option as MLModel)}
              placeholder="Select model..."
            />
          </div>

          {/* Recent Players */}
          <div className="bg-gradient-to-br from-n-8 to-n-6 backdrop-blur-sm rounded-xl p-4 border border-green-800/50">
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Recent Players
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {RECENT_PLAYERS.slice(0, 3).map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  isActive={selectedPlayer?.id === player.id}
                  onClick={setSelectedPlayer}
                />
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="bg-gradient-to-br from-n-8 to-n-6 backdrop-blur-sm rounded-xl p-4 border border-green-800/50">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Find Player
            </label>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search players..."
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Player Analysis - 2/3 width */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-n-8 to-n-6 backdrop-blur-sm rounded-xl p-6 border border-green-800/50">
              {selectedPlayer ? (
                <>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-2xl font-bold">
                      {selectedPlayer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedPlayer.name}</h2>
                      <p className="text-gray-300">{selectedPlayer.team} • {selectedPlayer.position} • Age 28</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Projection Type
                    </label>
                    <Dropdown
                      options={PROJECTION_TYPES}
                      selected={selectedProjection}
                      onSelect={(option) => setSelectedProjection(option as ProjectionType)}
                      placeholder="Select projection..."
                      className="max-w-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-[#0B1901]/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-400">8.7</div>
                      <div className="text-sm text-gray-300">Projected</div>
                    </div>
                    <div className="bg-[#0B1901]/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-400">7.2</div>
                      <div className="text-sm text-gray-300">Season Avg</div>
                    </div>
                    <div className="bg-[#0B1901]/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-400">94%</div>
                      <div className="text-sm text-gray-300">Confidence</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div />
                    <button
                      onClick={() => setShowSaveModal(true)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Save
                    </button>
                  </div>

                  <ProjectionChart data={[]} type={selectedProjection} />
                </>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Select a player to view projections</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Saved Projections */}
            <div className="bg-gradient-to-br from-n-8 to-n-6 backdrop-blur-sm rounded-xl p-6 border border-green-800/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Saved Projections
                </h3>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {SAVED_PROJECTIONS.map((proj) => (
                  <button
                    key={proj.id}
                    onClick={() => {
                      const player = RECENT_PLAYERS.find(p => p.name === proj.player);
                      const projection = PROJECTION_TYPES.find(p => p.name === proj.projection);
                      if (player && projection) {
                        handleSaveProjection(player, projection);
                      }
                    }}
                    className="w-full bg-[#0B1901]/50 hover:bg-green-800/30 rounded-lg p-3 text-left transition-all"
                  >
                    <div className="font-medium text-white text-sm">{proj.player}</div>
                    <div className="text-xs text-gray-300">{proj.projection}</div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-green-400 font-bold">{proj.value}</span>
                      <span className="text-xs text-gray-400">{proj.date}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Lineup Builder */}
            <div className="bg-gradient-to-br from-n-8 to-n-6 backdrop-blur-sm rounded-xl p-6 border border-green-800/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-400" />
                  Saved Lineups
                </h3>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {LINEUPS.map((lineup) => (
                  <div key={lineup.id} className="bg-[#0B1901]/50 rounded-lg p-3">
                    <div className="font-medium text-white text-sm">{lineup.name}</div>
                    <div className="text-xs text-gray-300 mt-1">
                      {lineup.players} players • {lineup.projections} projections
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{lineup.created}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <SaveModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}