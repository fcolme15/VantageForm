from collections import defaultdict
import pandas as pd
import numpy as np
from typing import Dict, List, Optional, Tuple
import logging
from dotenv import load_dotenv
from constants import TEAM_NAME_MAPPING, teamAcronyms, teamColumns, positionStatsSchema, qbBatch, wrBatch, teBatch, rbBatch, offensiveColumns
# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

batches = {
    'WR': wrBatch, 
    'QB': qbBatch, 
    'TE': teBatch, 
    'RB': rbBatch, 
}

target_features = {
    'WR': 'receiving_yards',
    'QB': 'passing_yards', 
    'RB': 'rushing_yards',
    'TE': 'receiving_yards',
}

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

def getPositionStatsSchema(df, playerNames, position, maxWeeks=11):
    #Filter dataframe for the specified players
    playerData = df[df['player_display_name'].isin(playerNames)]
    
    #Verify position is supported
    if position not in positionStatsSchema:
        print(f"Error: Position '{position}' not supported")
        return []
    
    #Verify all players are the same position
    positions = playerData['position'].unique()
    if len(positions) > 1:
        print(f"Warning: Multiple positions found: {positions}")
    
    #Get the base columns for all positions
    baseColumns = ['player_display_name', 'position', 
                   'recent_team', 'season', 'week', 'opponent_team']
    
    statColumns = positionStatsSchema[position]
    
    #Sort by week in descending order to get most recent weeks first
    playerData = playerData.sort_values(['player_display_name', 'week'], ascending=[True, False])
    
    #Keep only the latest N weeks per player
    resultData = defaultdict(list)
    for player_name in playerNames:
        #Get data for this specific player
        playerRows = playerData[(playerData['player_display_name'] == player_name)]
        
        #Take only the latest maxWeeks entries for this player
        recentRows = playerRows.head(maxWeeks)
        
        #Resort so that data target weeks is right week
        recentRows = recentRows.sort_values(['week'], ascending=[True])
        
        print(f"  {player_name}: Found {len(playerRows)} total weeks, keeping latest {len(recentRows)} weeks")
        
        #Extract data for each week getting base and position categories
        for _, row in recentRows.iterrows():
            player_stats = {}
            
            #Add base information
            for col in baseColumns:
                player_stats[col] = row.get(col, None) 
            
            #Add position-specific stats
            for col in statColumns:
                player_stats[col] = row.get(col, None)
            
            resultData[player_name].append(player_stats)
    
    return resultData


def getTeamStatsSchema(df, maxWeeks=14):    
    #Keep most recent game weeks
    teamData = df.sort_values(['team', 'week'], ascending=[True, False])
    
    #Keep only the latest N weeks per team
    resultData = defaultdict(list)
    for team in teamAcronyms:
        # translatedName = TEAM_NAME_MAPPING.get(team.strip())

        #Get data for specific team
        teamRows = teamData[(teamData['team'] == team)]

        recentRows = teamRows.head(maxWeeks)

        #Resort so that target weeks are correct order
        recentRows = recentRows.sort_values(['week'], ascending=[True])
        print(f"  {team}: Found {len(teamRows)} total weeks, keeping latest {len(recentRows)} weeks")
        
        #Extract data for each week getting base and position categories
        for _, row in recentRows.iterrows():
            player_stats = {}
            
            for col in teamColumns:
                player_stats[col] = row.get(col, None)
            
            resultData[team].append(player_stats)

    return resultData

def playerDataImport(csvFilePlayer, csvFileTeam, position):
    #Get csv into pd dataframe
    playerData = getCSVData(csvFilePlayer)
    teamData = getCSVData(csvFileTeam)

    #Get all needed info for players and teams
    playerData = getPositionStatsSchema(playerData, batches[position][0], position)
    teamData = getTeamStatsSchema(teamData)
    return playerData, teamData

def extract_interval_features(player_name, player_data_dict, team_data_dict, position, start_game_idx=0):
    player_games = player_data_dict[player_name]
    
    interval_features = []
    
    #Break 10 game sample into a 5 game shifting window
    for interval in range(5):
        start_idx = start_game_idx + interval
        end_idx = start_idx + 5
        
        #Skip if not enough games available
        if end_idx > len(player_games):
            print('not enough')
            continue
            
        #Get 5-game window for player
        player_window = player_games[start_idx:end_idx]
        
        team_name = player_window[0]['recent_team']
        team_games = team_data_dict[team_name]
        
        team_window = get_team_games_for_window(team_games, player_window)
        
        #Calculate player features (5-game averages)
        player_features = calculate_player_features(player_window, position)
        
        #Calculate team offensive features (5-game averages)
        team_offensive_features = calculate_team_offensive_features(team_window)
        
        #Get opponent defensive features (example using last game's opponent)
        opponent_team = player_window[-1]['opponent_team']  #Target game opponent
        opponent_games = team_data_dict[opponent_team]
        opponent_defensive_features = calculate_opponent_defensive_features(opponent_games, start_idx, end_idx)
        
        #Get target variable 
        target_game_idx = end_idx
        if target_game_idx < len(player_games):
            target_value = player_games[target_game_idx][target_features[position]]
        else:
            continue  #No target game available
            
        #Combine all features
        interval_feature = {
            'player_name': player_name,
            'interval': interval,
            'target_week': player_games[target_game_idx]['week'],
            'target_value': target_value,
            'opp_def_sacks': opponent_defensive_features['opp_def_sacks_l5'],
            'opp_def_pass_defended': opponent_defensive_features['opp_def_pass_defended_l5']
        }
        for key in positionStatsSchema[position]:
            interval_feature[key] = player_features[f'{key}_l5']

        for key in offensiveColumns:
            interval_feature[f'team_off_{key}'] = team_offensive_features[f'team_off_{key}_l5']
        

            
        interval_features.append(interval_feature)
    
    return interval_features


def get_team_games_for_window(team_games, player_window):
    team_window = []
    
    for player_game in player_window:
        #Find matching team game by season/week
        for team_game in team_games:
            if (team_game['season'] == player_game['season'] and 
                team_game['week'] == player_game['week']):
                team_window.append(team_game)
                break
                
    return team_window


def calculate_player_features(player_window, position):
    features = {}

    for key in positionStatsSchema[position]:
        features[f'{key}_l5'] = sum(game[key] for game in player_window) / len(player_window)

    return features


def calculate_team_offensive_features(team_window):
    features = {}

    for key in offensiveColumns:
        features[f'team_off_{key}_l5'] = sum(game[key] for game in team_window) / len(team_window)

    return features

def calculate_opponent_defensive_features(opponent_games,  start_idx, end_idx):
    features = {}

    #Opponent's last 8 games before the target game
    recent_games = opponent_games[start_idx:end_idx]
    
    features['opp_def_pass_defended_l5'] = sum(game['def_pass_defended'] for game in recent_games) / len(recent_games)
    features['opp_def_sacks_l5'] = sum(game['def_sacks'] for game in recent_games) / len(recent_games)
    
    return features
    
def main(position):
    csvFilePlayer = "player_stats_2024.csv"
    csvFileTeam = "stats_team_week_2024.csv"
    playersPerPosition = {
        'WR': wrBatch,
        'QB': qbBatch, 
        'RB': rbBatch,
        'TE': teBatch,
    }

    playerData, teamData = playerDataImport(csvFilePlayer, csvFileTeam, position)

    players = []
    for player in playersPerPosition[position][0]:
        player_features = extract_interval_features(player, playerData, teamData, position)
        players.append(player_features)
    print(players)
    return players
    

if __name__ == "__main__":
    main("WR")

