
import { MLModel, Player, ProjectionType, SavedProjection, Lineup} from "@/components/dashboard/Interfaces"
  
export const ML_MODELS: MLModel[] = [
    { id: 'neural', name: 'Neural Network v2.1', accuracy: '94%' },
    { id: 'ensemble', name: 'Ensemble Model', accuracy: '91%' },
];
  
// export const RECENT_PLAYERS: Player[] = [
//     { id: 1, name: 'Josh Allen', team: 'BUF', position: 'QB', sport: 'nfl' },
//     { id: 2, name: 'Cooper Kupp', team: 'LAR', position: 'WR', sport: 'nfl' },
//     { id: 3, name: 'Travis Kelce', team: 'KC', position: 'TE', sport: 'nfl' },
//     { id: 4, name: 'Tyreek Hill', team: 'MIA', position: 'WR', sport: 'nfl' },
//     { id: 5, name: 'Lamar Jackson', team: 'BAL', position: 'QB', sport: 'nfl' },
//     { id: 6, name: 'Davante Adams', team: 'LV', position: 'WR', sport: 'nfl' }
// ];
  
export const PROJECTION_TYPES: ProjectionType[] = [
    { id: 'receptions', name: 'Receptions', unit: 'rec' },
    { id: 'receiving_yards', name: 'Receiving Yards', unit: 'yds' },
    { id: 'touchdowns', name: 'Touchdowns', unit: 'td' },
    { id: 'passing_yards', name: 'Passing Yards', unit: 'yds' },
    { id: 'rushing_yards', name: 'Rushing Yards', unit: 'yds' }
];
  
export const SAVED_PROJECTIONS: SavedProjection[] = [
    { id: 1, player: 'Josh Allen', projection: 'Passing Yards', value: '287.5', date: '2025-06-12' },
    { id: 2, player: 'Cooper Kupp', projection: 'Receptions', value: '8.5', date: '2025-06-11' },
    { id: 3, player: 'Travis Kelce', projection: 'Receiving Yards', value: '76.5', date: '2025-06-11' },
    { id: 4, player: 'Tyreek Hill', projection: 'Receiving Yards', value: '82.3', date: '2025-06-10' },
    { id: 5, player: 'Lamar Jackson', projection: 'Rushing Yards', value: '65.2', date: '2025-06-10' },
    { id: 6, player: 'Davante Adams', projection: 'Receptions', value: '7.8', date: '2025-06-09' }
];    
  
export const LINEUPS: Lineup[] = [
    { id: 1, name: 'Week 18 Lineup', players: 6, projections: 8, created: '2025-06-12' },
    { id: 2, name: 'TNF Special', players: 4, projections: 6, created: '2025-06-11' },
    { id: 3, name: 'Sunday Slate', players: 8, projections: 12, created: '2025-06-10' },
    { id: 4, name: 'MNF Showdown', players: 5, projections: 7, created: '2025-06-09' },
    { id: 5, name: 'GPP Tournament', players: 9, projections: 15, created: '2025-06-08' }
];