import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Player, SearchBarProps } from "@/components/dashboard/Interfaces"
const SearchBar: React.FC<SearchBarProps> = ({
                                                 value,
                                                 onChange,
                                                 placeholder,
                                                 players,
                                                 onPlayerSelect
                                             }) => {
    // Filter players based on search query
    const filteredPlayers = useMemo(() => {
        if (!value.trim()) {
            return [];
        }

        const query = value.toLowerCase();
        return players.filter(player =>
            player.name.toLowerCase().includes(query) ||
            player.team.toLowerCase().includes(query) ||
            player.position.toLowerCase().includes(query) ||
            player.sport.toLowerCase().includes(query)
        );
    }, [value, players]);

    const handlePlayerSelect = (player: Player) => {
        if (onPlayerSelect) {
            onPlayerSelect(player);
        }
        onChange(''); // Clear the search
    };

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-[#0B1901]/50 border border-green-800 rounded-full pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />

            {/* Results dropdown - only show if there's a search query */}
            {value.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-n-8 to-n-6 backdrop-blur-sm rounded-xl p-4 border border-green-800/50 z-10">
                    <div className="text-sm text-gray-400 mb-3">
                        {filteredPlayers.length} result{filteredPlayers.length !== 1 ? 's' : ''} found
                    </div>

                    {filteredPlayers.length === 0 ? (
                        <div className="text-center py-6 text-gray-400">
                            No players found matching `{value}`
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
                            {filteredPlayers.map((player) => (
                                <div
                                    key={player.id}
                                    onClick={() => handlePlayerSelect(player)}
                                    className="bg-[#0B1901]/30 border border-green-800/30 rounded-lg p-3 hover:border-green-500/50 hover:bg-[#0B1901]/50 transition-all cursor-pointer"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-semibold text-white">{player.name}</h3>
                                            <p className="text-green-400 text-sm">{player.team}</p>
                                            <p className="text-gray-300 text-xs">{player.position} • {player.sport}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Updated PlayerSearchComponent that accepts players as props
interface PlayerSearchComponentProps {
    players: Player[];
    onPlayerSelect?: (player: Player) => void;
}

const PlayerSearchComponent: React.FC<PlayerSearchComponentProps> = ({
                                                                         players,
                                                                         onPlayerSelect
                                                                     }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>();

    // Function to handle player selection
    const handlePlayerSelect = (player: Player) => {
        setSelectedPlayer(player);

        //Call the optional callback if provided
        if (onPlayerSelect) {
            onPlayerSelect(player);
        }
        console.log(selectedPlayer);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">

            <div className="bg-gradient-to-br from-n-8 to-n-6 backdrop-blur-sm rounded-xl p-4 border border-green-800/50">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Find Player
                </label>
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search players..."
                    players={players}
                    onPlayerSelect={handlePlayerSelect}
                />
            </div>
        </div>
    );
};

export default PlayerSearchComponent;