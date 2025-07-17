
// Type definitions
export interface Sport {
    name: string;
}
  
export interface MLModel {
    id: string;
    name: string;
    accuracy: string;
    icon?: string;
}

export interface Player {
    id: number;
    name: string;
    team: string;
    position: string;
    sport: string;
}

export interface ProjectionType {
    id: string;
    name: string;
    unit: string;
    icon?: string;
}

export interface SavedProjection {
    player: Player;
    projection1: number;
    projection2: number;
    date: string;
}

export interface Lineup {
    id: number;
    name: string;
    players: number;
    projections: number;
    created: string;
}

export interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    players: Player[]; // Add this prop
    onPlayerSelect?: (player: Player) => void; // Optional callback
}

export interface RawPlayer {
    name: string;
    playerid: number;
    position: string;
    roster: {
        teams: {
            name: string;
            leagues: {
                sports: {
                    name: string;
                };
            };
        };
    }[];
}

