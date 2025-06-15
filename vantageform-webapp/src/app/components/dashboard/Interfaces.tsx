
// Type definitions
export interface Sport {
    id: string;
    name: string;
    icon: string;
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
    id: number;
    player: string;
    projection: string;
    value: string;
    date: string;
}

export interface Lineup {
    id: number;
    name: string;
    players: number;
    projections: number;
    created: string;
}