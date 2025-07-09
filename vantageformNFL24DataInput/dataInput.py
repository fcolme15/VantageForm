import pandas as pd
import numpy as np
import os
from supabase import create_client, Client
from typing import Dict, List, Optional, Tuple
import logging
from dotenv import load_dotenv
import requests
from constants import TEAM_NAME_MAPPING, teamAcronyms, teamColumns, positionStatsSchema, qbBatch, wrBatch, teBatch, rbBatch
# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SupabaseFantasyImporter:
    def __init__(self, supabase_url: str, supabase_key: str):
        """Initialize Supabase client"""
        self.supabase: Client = create_client(supabase_url, supabase_key)
        self.sport_id = None
        self.league_id = None
        self.season = None
        
    def initialize_base_data(self, sport_name: str = "Football", league_name: str = "NFL", season: str = "2024"):
        """Initialize or get base Sport and League data"""
        try:
            # Get or create Sport
            sport_response = self.supabase.table('sports').select('*').eq('name', sport_name).execute()
            if sport_response.data:
                self.sport_id = sport_response.data[0]['sportid']
                logger.info(f"Found existing sport: {sport_name} (ID: {self.sport_id})")
            else:
                sport_insert = self.supabase.table('sports').insert({'name': sport_name}).execute()
                self.sport_id = sport_insert.data[0]['sportid']
                logger.info(f"Created new sport: {sport_name} (ID: {self.sport_id})")
            
            # Get or create League
            league_response = self.supabase.table('leagues').select('*').eq('sportid', self.sport_id).eq('name', league_name).eq('season', season).execute()
            if league_response.data:
                self.league_id = league_response.data[0]['leagueid']
                logger.info(f"Found existing league: {league_name} {season} (ID: {self.league_id})")
            else:
                league_insert = self.supabase.table('leagues').insert({
                    'sportid': self.sport_id,
                    'name': league_name,
                    'season': season
                }).execute()
                self.league_id = league_insert.data[0]['leagueid']
                logger.info(f"Created new league: {league_name} {season} (ID: {self.league_id})")
            
            self.season = season
            
        except Exception as e:
            logger.error(f"Error initializing base data: {e}")
            raise
    
    def standardize_team_name(self, team_name: str) -> str:
        """Standardize team name using the mapping"""
        if not team_name:
            return team_name
        
        # Check if team name exists in mapping
        standardized = TEAM_NAME_MAPPING.get(team_name.strip())
        if standardized:
            return standardized
        
        # If not found, log a warning and return original
        logger.warning(f"Team name '{team_name}' not found in mapping, using as-is")
        return team_name.strip()
    
    def get_or_create_team(self, team_name: str) -> int:
        """Get or create team and return team ID"""
        try:
            # Standardize the team name first
            standardized_name = self.standardize_team_name(team_name)
            
            # Check if team exists
            team_response = self.supabase.table('teams').select('*').eq('leagueid', self.league_id).eq('name', standardized_name).execute()
            if team_response.data:
                return team_response.data[0]['teamid']
            
            # Create new team
            team_insert = self.supabase.table('teams').insert({
                'leagueid': self.league_id,
                'name': standardized_name,
                'teamstatsname': standardized_name
            }).execute()
            
            team_id = team_insert.data[0]['teamid']
            logger.info(f"Created new team: {standardized_name} (ID: {team_id}) from input: {team_name}")
            return team_id
            
        except Exception as e:
            logger.error(f"Error getting/creating team {team_name}: {e}")
            raise
    
    def get_or_create_player(self, player_name: str, position: str) -> int:
        """Get or create player and return player ID"""
        try:
            # Check if player exists
            player_response = self.supabase.table('players').select('*').eq('name', player_name).eq('position', position).execute()
            if player_response.data:
                return player_response.data[0]['playerid']
            
            # Create new player
            player_insert = self.supabase.table('players').insert({
                'name': player_name,
                'position': position
            }).execute()
            
            player_id = player_insert.data[0]['playerid']
            logger.info(f"Created new player: {player_name} ({position}) (ID: {player_id})")
            return player_id
            
        except Exception as e:
            logger.error(f"Error getting/creating player {player_name}: {e}")
            raise
    
    def get_or_create_game(self, team1: str, team2: str, week: int, 
                          home_team: Optional[str] = None, away_team: Optional[str] = None,
                          home_score: Optional[int] = None, away_score: Optional[int] = None) -> int:
        """
        Get or create game and return game ID
        
        Args:
            team1: First team (could be home or away)
            team2: Second team (could be home or away)  
            week: Week number
            home_team: Explicitly specified home team (optional)
            away_team: Explicitly specified away team (optional)
            home_score: Home team score (optional)
            away_score: Away team score (optional)
        """
        try:
            # Standardize team names
            team1_std = self.standardize_team_name(team1)
            team2_std = self.standardize_team_name(team2)
            
            team1_id = self.get_or_create_team(team1_std)
            team2_id = self.get_or_create_team(team2_std) 
            
            # ALWAYS check for existing game in both directions first
            existing_game = self.supabase.table('games').select('*').eq('leagueid', self.league_id).eq('week', week).eq('season', self.season).or_(
                f"and(hometeamid.eq.{team1_id},awayteamid.eq.{team2_id}),and(hometeamid.eq.{team2_id},awayteamid.eq.{team1_id})"
            ).execute()
            
            if existing_game.data:
                return existing_game.data[0]['gameid']
            
            # Determine home/away teams
            if home_team and away_team:
                # Explicit home/away specified
                home_team_std = self.standardize_team_name(home_team)
                away_team_std = self.standardize_team_name(away_team)
            else:
                # Use alphabetical order as fallback (consistent but arbitrary)
                if team1_std < team2_std:
                    home_team_std = team1_std
                    home_team_id = team1_id
                    away_team_std = team2_std
                    away_team_id = team2_id
                else:
                    home_team_std = team2_std
                    home_team_id = team2_id
                    away_team_std = team1_std
                    away_team_id = team1_id
                    
                logger.info(f"Using alphabetical order for game: {home_team_std} (home) vs {away_team_std} (away)")
            
            # Create new game
            game_data = {
                'leagueid': self.league_id,
                'hometeamid': home_team_id,
                'awayteamid': away_team_id,
                'week': week,
                'season': self.season
            }
            
            game_insert = self.supabase.table('games').insert(game_data).execute()
            
            game_id = game_insert.data[0]['gameid']
            logger.info(f"Created new game: {home_team_std} vs {away_team_std} Week {week} (ID: {game_id})")
            return game_id
            
        except Exception as e:
            logger.error(f"Error getting/creating game {team1} vs {team2} Week {week}: {e}")
            raise
    
    def insert_player_stats(self, player_data: Dict, position: str) -> bool:
        """Insert player stats into appropriate position table"""
        try:
            # Get required IDs
            player_id = self.get_or_create_player(player_data['player_name'], position)
            team_id = self.get_or_create_team(player_data['team'])
            
            # For game ID, we need to determine home/away team
            # This is a simplified approach - you may need to enhance this logic
            opponent_team = player_data['opponent']
            game_id = self.get_or_create_game(player_data['team'], opponent_team, player_data['week'])
            
            # Prepare stats data based on position
            stats_data = {
                'playerid': player_id,
                'gameid': game_id,
                'teamid': team_id,
                'gameweek': player_data['week'],
                'season': player_data['season']
            }
            
            # Map CSV columns to database columns
            column_mapping = self._get_column_mapping(position)
            
            for db_col, csv_col in column_mapping.items():
                if csv_col in player_data and player_data[csv_col] is not None:
                    stats_data[db_col] = player_data[csv_col]
            
            # Insert into appropriate table
            table_name = f"{position.lower()}stats"
            
            # Check if record already exists
            existing_response = self.supabase.table(table_name).select('*').eq('playerid', player_id).eq('gameid', game_id).execute()
            
            if existing_response.data:
                update_result = self.supabase.table(table_name).update(stats_data).eq('playerid', player_id).eq('gameid', game_id).execute()
                if not update_result.data:
                    raise Exception(f"Failed to update existing record for player {player_id}, game {game_id}")
                logger.info(f"Updated {position} stats for {player_data['player_name']} Week {player_data['week']}")
            else:
                insert_result = self.supabase.table(table_name).insert(stats_data).execute()
                if not insert_result.data:
                    raise Exception(f"Failed to insert new record for player {player_id}, game {game_id}")
                logger.info(f"Inserted {position} stats for {player_data['player_name']} Week {player_data['week']}")
            
            return True
            
        except Exception as e:
            logger.error(f"Error inserting {position} stats for {player_data['player_name']}: {e}")
            return False
    
    def insert_team_stats(self, team_data: Dict, stat_type: str) -> bool:
        """
        Insert team stats into appropriate team stats table
        
        Args:
            team_data: Dictionary containing team stats for one game
            stat_type: Either 'offense' or 'defense'
        """
        try:
            # Get required IDs
            team_id = self.get_or_create_team(team_data['team_name'])
            
            # For game ID, we need to determine home/away team
            opponent_team = team_data.get('opponent')
            if not opponent_team:
                logger.warning(f"No opponent found for {team_data['team_name']} Week {team_data['week']}")
                return False
                
            game_id = self.get_or_create_game(team_data['team_name'], opponent_team, team_data['week'])
            
            # Prepare base stats data
            stats_data = {
                'teamid': team_id,
                'gameid': game_id,
                'gameweek': team_data['week'],
                'season': team_data['season']
            }
            
            # Add stat-specific columns based on type
            if stat_type == 'offense':
                # Map offensive stats
                offense_mapping = {
                    'passingepa': 'passing_epa',
                    'targets': 'targets', 
                    'passingyards': 'passing_yards',
                    'receivingyardsaftercatch': 'receiving_yards_after_catch',
                    'rushingyards': 'rushing_yards'
                }
                
                for db_col, csv_col in offense_mapping.items():
                    if csv_col in team_data and team_data[csv_col] is not None:
                        stats_data[db_col] = team_data[csv_col]
                
                table_name = 'teamoffensestats'
                
            elif stat_type == 'defense':
                # Map defensive stats
                defense_mapping = {
                    'defpassdefended': 'def_pass_defended',
                    'defsacks': 'def_sacks'
                }
                
                for db_col, csv_col in defense_mapping.items():
                    if csv_col in team_data and team_data[csv_col] is not None:
                        stats_data[db_col] = team_data[csv_col]
                
                table_name = 'teamdefensestats'
                
            else:
                logger.error(f"Invalid stat_type: {stat_type}")
                return False
            
            # Check if record already exists
            existing_response = self.supabase.table(table_name).select('*').eq('teamid', team_id).eq('gameid', game_id).execute()
            
            if existing_response.data:
                # Update existing record
                self.supabase.table(table_name).update(stats_data).eq('teamid', team_id).eq('gameid', game_id).execute()
                logger.info(f"Updated {stat_type} stats for {team_data['team_name']} Week {team_data['week']}")
            else:
                # Insert new record
                self.supabase.table(table_name).insert(stats_data).execute()
                logger.info(f"Inserted {stat_type} stats for {team_data['team_name']} Week {team_data['week']}")
            
            return True
            
        except Exception as e:
            logger.error(f"Error inserting {stat_type} stats for {team_data.get('team_name', 'unknown')}: {e}")
            return False
    
    def _get_column_mapping(self, position: str) -> Dict[str, str]:
        """Get mapping from database columns to CSV columns"""
        mappings = {
            'QB': {
                'passingepa': 'passing_epa',
                'passingyards': 'passing_yards',
                'passingtds': 'passing_tds',
                'attempts': 'attempts',
                'passingfirstdowns': 'passing_first_downs',
                'interceptions': 'interceptions',
                'completions': 'completions',
                'fantasypointsppr': 'fantasy_points_ppr',
                'fantasypoints': 'fantasy_points'
            },
            'WR': {
                'targetshare': 'target_share',
                'receivingepa': 'receiving_epa',
                'targets': 'targets',
                'receivingyards': 'receiving_yards',
                'receivingtds': 'receiving_tds',
                'receptions': 'receptions',
                'receivingfirstdowns': 'receiving_first_downs',
                'airyardshare': 'air_yards_share',
                'fantasypointsppr': 'fantasy_points_ppr',
                'fantasypoints': 'fantasy_points'
            },
            'RB': {
                'rushingepa': 'rushing_epa',
                'carries': 'carries',
                'rushingyards': 'rushing_yards',
                'rushingtds': 'rushing_tds',
                'rushingfirstdowns': 'rushing_first_downs',
                'rushingfumbles': 'rushing_fumbles',
                'receivingtargets': 'targets',
                'receivingyards': 'receiving_yards',
                'fantasypointsppr': 'fantasy_points_ppr',
                'fantasypoints': 'fantasy_points'
            },
            'TE': {
                'targetshare': 'target_share',
                'receivingepa': 'receiving_epa',
                'targets': 'targets',
                'receivingyards': 'receiving_yards',
                'receivingtds': 'receiving_tds',
                'receptions': 'receptions',
                'receivingfirstdowns': 'receiving_first_downs',
                'airyardshare': 'air_yards_share',
                'fantasypointsppr': 'fantasy_points_ppr',
                'fantasypoints': 'fantasy_points'
            }
        }
        return mappings.get(position, {})

def getCSVData(csvPath):
    """Load the CSV file and return a pandas DataFrame"""
    try:
        df = pd.read_csv(csvPath)
        return df
    except FileNotFoundError:
        print(f"Error: File {csvPath} not found")
        return None
    except Exception as e:
        print(f"Error loading CSV: {e}")
        return None

def getPositionStatsSchema(df, playerNames, position, maxWeeks=5):
    """
    Args:
        df: pandas DataFrame with player data
        playerNames: list of player names (same position)
        position: string ('QB', 'WR', 'RB', 'TE')
        maxWeeks: int, maximum number of recent weeks to keep per player
    
    Returns:
        list of dictionaries with player stats
    """
    
    # Filter dataframe for the specified players
    playerData = df[df['player_name'].isin(playerNames) | df['player_display_name'].isin(playerNames)]
    
    # Verify position is supported
    if position not in positionStatsSchema:
        print(f"Error: Position '{position}' not supported")
        return []
    
    # Verify all players are the same position
    positions = playerData['position'].unique()
    if len(positions) > 1:
        print(f"Warning: Multiple positions found: {positions}")
    
    # Get the relevant columns for this position
    baseColumns = ['player_id', 'player_name', 'player_display_name', 'position', 
                   'recent_team', 'season', 'week', 'opponent_team']
    
    statColumns = positionStatsSchema[position]
    
    # Sort by week in descending order to get most recent weeks first
    playerData = playerData.sort_values(['player_name', 'week'], ascending=[True, False])
    
    # Keep only the latest N weeks per player
    resultData = []
    for player_name in playerNames:
        # Get data for this specific player
        playerRows = playerData[
            (playerData['player_name'] == player_name) | 
            (playerData['player_display_name'] == player_name)
        ]
        
        # Take only the latest maxWeeks entries for this player
        recentRows = playerRows.head(maxWeeks)
        
        print(f"  {player_name}: Found {len(playerRows)} total weeks, keeping latest {len(recentRows)} weeks")
        
        # Extract data for each week getting base and position categories
        for _, row in recentRows.iterrows():
            player_stats = {}
            
            # Add base information
            for col in baseColumns:
                player_stats[col] = row.get(col, None)
            
            # Add position-specific stats
            for col in statColumns:
                player_stats[col] = row.get(col, None)
            
            resultData.append(player_stats)
    
    return resultData

def processPlayerBatches(df, playerBatches, maxWeeks=5):
    """
    Arguments:
        df: pandas DataFrame with player data
        playerBatches: list of tuples (playerNames_list, position)
        maxWeeks: int, maximum number of recent weeks to keep per player
    
    Returns:
        dictionary with position as key and list of player stats as value
    """
    results = {}
    
    for playerNames, positionGroup in playerBatches:
        print(f"\nProcessing {len(playerNames)} {positionGroup} players...")
        
        stats = getPositionStatsSchema(df, playerNames, positionGroup, maxWeeks)
        
        if positionGroup not in results:
            results[positionGroup] = []
        
        results[positionGroup].extend(stats)
        
        print(f"Extracted stats for {len(stats)} {positionGroup} entries")
    
    return results

def preparePlayerDataForDatabase(results):
    """Convert results to format suitable for database insertion"""
    preparedData = {}
    
    for position, players in results.items():
        preparedData[position] = []
        
        for player in players:
            # Create a clean record with proper field mapping
            gameData = {
                'player_id': player['player_id'],
                'player_name': player['player_display_name'],
                'week': player['week'],
                'season': player['season'],
                'team': player['recent_team'],
                'opponent': player['opponent_team']
            }
            
            # Add position-specific stats
            for stat_field in positionStatsSchema[position]:
                if stat_field in player and player[stat_field] is not None:
                    gameData[stat_field] = player[stat_field]
            
            preparedData[position].append(gameData)
    
    return preparedData

def run_player_data_import(importer: SupabaseFantasyImporter, csvFile: str) -> Tuple[int, int]:
    """
    Process and import player data from CSV
    
    Args:
        importer: SupabaseFantasyImporter instance
        csvFile: Path to CSV file
    
    Returns:
        Tuple of (total_imported, total_failed)
    """
    print("Running player data import...")
    
    # Load CSV data
    df = getCSVData(csvFile)
    if df is None:
        print("Failed to load CSV file")
        return 0, 0
    
    # Define player batches
    playerBatches = [
        qbBatch, wrBatch, teBatch, rbBatch
    ]
    
    # Process player batches
    results = processPlayerBatches(df, playerBatches, maxWeeks=5)
    
    # Prepare data for database
    preparedData = preparePlayerDataForDatabase(results)
    
    # Import to database
    total_imported = 0
    total_failed = 0
    
    for position, players in preparedData.items():
        print(f"\nImporting {len(players)} {position} records...")
        
        for player_data in players:
            try:
                success = importer.insert_player_stats(player_data, position)
                if success:
                    total_imported += 1
                else:
                    total_failed += 1
            except Exception as e:
                logger.error(f"Failed to import {player_data['player_name']} Week {player_data['week']}: {e}")
                total_failed += 1
    
    return total_imported, total_failed



def getTeamStatsSchema(df, maxWeeks):    
    teamData = df.sort_values(['team', 'week'], ascending=[True, False])
    
    #Keep only the latest N weeks per team
    resultData = []
    for team in teamAcronyms:

        #Get data for specific team
        teamRows = teamData[(teamData['team'] == team)]

        recentRows = teamRows.head(maxWeeks)
        print(f"  {team}: Found {len(teamRows)} total weeks, keeping latest {len(recentRows)} weeks")
        
        # Extract data for each week getting base and position categories
        for _, row in recentRows.iterrows():
            player_stats = {}
            
            # Add base information
            for col in teamColumns:
                player_stats[col] = row.get(col, None)
            
            resultData.append(player_stats)

    return resultData



def prepareTeamDataForDatabase(results):
    '''Convert results to format needed for database insertion'''
    preparedData = {'offense': [], 'defense': []}
    
    for team_game in results:  # Each record is one team's game
        # Offensive stats record
        offenseData = {
            'team_name': team_game['team'], 
            'week': team_game['week'],
            'season': team_game['season'],
            'opponent': team_game.get('opponent_team', None),
            # Add offensive stats
            'passing_epa': team_game.get('passing_epa', None),
            'targets': team_game.get('targets', None),
            'passing_yards': team_game.get('passing_yards', None),
            'receiving_yards_after_catch': team_game.get('receiving_yards_after_catch', None),
            'rushing_yards': team_game.get('rushing_yards', None),
        }
        preparedData['offense'].append(offenseData)
        
        # Defensive stats record
        defenseData = {
            'team_name': team_game['team'],
            'week': team_game['week'],
            'season': team_game['season'],
            'opponent': team_game.get('opponent_team', None),
            # Add defensive stats
            'def_pass_defended': team_game.get('def_pass_defended', None),
            'def_sacks': team_game.get('def_sacks', None),
        }
        preparedData['defense'].append(defenseData)
    
    return preparedData

def run_team_data_import(importer: SupabaseFantasyImporter, csvFile: str) -> Tuple[int, int]:
    """
    Process and import team data from CSV - placeholder for future implementation
    
    Args:
        importer: SupabaseFantasyImporter instance
        csvFile: Path to CSV file
    
    Returns:
        Tuple of (total_imported, total_failed)
    """
    print("Running team data import...")
    
    # Load CSV data
    df = getCSVData(csvFile)
    if df is None:
        print("Failed to load CSV file")
        return 0, 0
    
    #Process team data
    maxWeeks = 8
    print(f"Processing team data for {maxWeeks} weeks")
    results = getTeamStatsSchema(df, maxWeeks)



    #Prepare data for database
    preparedData = prepareTeamDataForDatabase(results)
    
    totalImported = 0
    totalFailed = 0
    
    for stat_type in ['defense', 'offense']:
        team_stats = preparedData[stat_type]
        print(f"\nImporting {len(team_stats)} {stat_type} records...")
        
        for team_data in team_stats:
            try:
                success = importer.insert_team_stats(team_data, stat_type)
                if success:
                    totalImported += 1
                else:
                    totalFailed += 1
            except Exception as e:
                logger.error(f"Failed to import {team_data['team_name']} Week {team_data['week']} {stat_type}: {e}")
                totalFailed += 1
    
    return totalImported, totalFailed


def main():
    """Main function to process CSV and import to Supabase"""
    
    # Load environment variables from .env file
    load_dotenv()
    
    # Supabase configuration from .env file
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_KEY = os.getenv('SUPABASE_KEY')
    
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Error: Please set SUPABASE_URL and SUPABASE_KEY in your .env file")
        return
    
    # Initialize importer
    importer = SupabaseFantasyImporter(SUPABASE_URL, SUPABASE_KEY)
    
    try:
        # Initialize base data
        importer.initialize_base_data(sport_name="Football", league_name="NFL", season="2024")
        
        
        # CSV file path
        csvFilePlayer = "player_stats_2024.csv"
        csvFileTeam = "stats_team_week_2024.csv"
        importPlayer = True
        
        
        if importPlayer:
            total_imported, total_failed = run_player_data_import(importer, csvFilePlayer)
        else:
            total_imported, total_failed = run_team_data_import(importer, csvFileTeam)
        
        print(f"\nImport complete!")
        print(f"Successfully imported: {total_imported} records")
        print(f"Failed imports: {total_failed} records")
        
    except Exception as e:
        logger.error(f"Error in main process: {e}")
        raise

if __name__ == "__main__":
    main()