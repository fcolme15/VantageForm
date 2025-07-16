from dotenv import load_dotenv
import requests
import json
import os
from supabase import create_client, Client
import pickle

# API base URL
base_url = "https://vantageform-nfl-api.onrender.com"
# Headers
headers = {
    "Content-Type": "application/json"
}

def testWRApiEndPoints (player_data):
    print('='*100)
    print('API Results for WR Receiving Yards')
    # ElasticNet prediction
    try:
        response = requests.post(
            f"{base_url}/predict/receivingYardsWrElasticnet",
            headers=headers,
            json=player_data
        )
        
        if response.status_code == 200:
            elasticnet_result = response.json()
            print(f"ElasticNet Prediction: {elasticnet_result['prediction']}")
        else:
            print(f"ElasticNet Error: {response.status_code} - {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"ElasticNet Request failed: {e}")

    # LightGBM prediction
    try:
        response = requests.post(
            f"{base_url}/predict/receivingYardsWrLightgbm",
            headers=headers,
            json=player_data
        )
        
        if response.status_code == 200:
            lightgbm_result = response.json()
            print(f"LightGBM Prediction: {lightgbm_result['prediction']}")
        else:
            print(f"LightGBM Error: {response.status_code} - {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"LightGBM Request failed: {e}") 

def testTEApiEndPoints (player_data):
    print('='*100)
    print('API Results for TE Receiving Yards')
    # ElasticNet prediction
    try:
        response = requests.post(
            f"{base_url}/predict/receivingYardsTeElasticnet",
            headers=headers,
            json=player_data
        )
        
        if response.status_code == 200:
            elasticnet_result = response.json()
            print(f"ElasticNet Prediction: {elasticnet_result['prediction']}")
        else:
            print(f"ElasticNet Error: {response.status_code} - {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"ElasticNet Request failed: {e}")

    # LightGBM prediction
    try:
        response = requests.post(
            f"{base_url}/predict/receivingYardsTeLightgbm",
            headers=headers,
            json=player_data
        )
        
        if response.status_code == 200:
            lightgbm_result = response.json()
            print(f"LightGBM Prediction: {lightgbm_result['prediction']}")
        else:
            print(f"LightGBM Error: {response.status_code} - {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"LightGBM Request failed: {e}") 

def predictReceivingYardsElasticNet(new_player_data, model_path):
    '''Makes prediction using the saved ElasticNet model'''
    # Load model
    model_package = load_model(model_path)
    model = model_package['model']
    feature_names = model_package['feature_names']
    scaler = model_package['scaler']
    
    # Prepare features
    features = [new_player_data.get(feat, 0) for feat in feature_names]
    
    # Scale features and make prediction
    features_scaled = scaler.transform([features])
    prediction = model.predict(features_scaled)[0]
    
    return prediction

def load_model(model_path):
    with open(model_path, 'rb') as f:
        model_package = pickle.load(f)
    
    print("Model loaded successfully!")
    
    # NEW: Display CV insights if available
    if 'cv_insights' in model_package:
        insights = model_package['cv_insights']
        print(f"CV Performance - MAE: {insights['cv_performance']['mae']:.3f}, R²: {insights['cv_performance']['r2']:.3f}")
    
    return model_package

def predictReceivingYardsLightGBM(new_player_data, model_path):
    '''Makes prediction using the saved model'''
    # Load model
    model_package = load_model(model_path)
    model = model_package['model']
    feature_names = model_package['feature_names']
    
    # Prepare features
    features = [new_player_data.get(feat, 0) for feat in feature_names]
    
    # Make prediction - final model doesn't have best_iteration since it used optimal rounds
    prediction = model.predict([features])[0]
    
    return prediction
 

def flatten_player_data(player_avg, player_info, def_avg, off_avg):
    result = {}
    print(player_info)
    # Player general info
    if player_info:
        info = player_info.data[0]
        result['playerid'] = info.get('playerid')
        result['name'] = info.get('name')
        result['team'] = info.get('roster', [{}])[0].get('teams', {}).get('name')

    # Player average stats
    if player_avg:
        stats = player_avg.data[0].get('avg_stats', {})
        result.update({
            'targets': stats.get('avg_targets'),
            'receptions': stats.get('avg_receptions'),
            'target_share': stats.get('avg_target_share'),
            'receiving_epa': stats.get('avg_receiving_epa'),
            'receiving_tds': stats.get('avg_receiving_tds'),
            'air_yards_share': stats.get('avg_air_yard_share'),
            'fantasy_points': stats.get('avg_fantasy_points'),
            'receiving_yards': stats.get('avg_receiving_yards'),
            'fantasy_points_ppr': stats.get('avg_fantasy_points_ppr'),
            'receiving_first_downs': stats.get('avg_receiving_first_downs'),
        })

    # Defensive team averages
    if def_avg:
        def_stats = def_avg.data[0].get('avg_defensive_stats', {})
        result.update({
            'opp_def_sacks': def_stats.get('avg_def_sacks'),
            'opp_def_pass_defended': def_stats.get('avg_def_pass_defended'),
        })

    # Offensive team averages
    if off_avg:
        off_stats = off_avg.data[0].get('avg_offensive_stats', {})
        result.update({
            'team_off_targets': off_stats.get('avg_targets'),
            'team_off_passing_epa': off_stats.get('avg_passing_epa'),
            'team_off_passing_yards': off_stats.get('avg_passing_yards'),
            'team_off_rushing_yards': off_stats.get('avg_rushing_yards'),
            'team_off_receiving_yards_after_catch': off_stats.get('avg_receiving_yards_after_catch'),
        })

    return result


def getDBData(supabase, playerInfo, opponent_team):
    print('='*100)
    print('Player Average')
    playerData = supabase.rpc('get_player_average_stats', {'player_name': playerInfo[0], 'input_position': playerInfo[1]}).execute()
    print(playerData.data)

    print('='*100)
    print('Player General Info')

    playerInfo = supabase \
    .from_('players') \
    .select('playerid, name, roster(teams(name))') \
    .eq('name', playerInfo[0]) \
    .execute()

    print(playerInfo.data)

    print('='*100)
    print('Defensive Average')
    defensiveTeamData = supabase.rpc('get_team_defensive_averages', {'team_name': opponent_team, 'season_year': 2024}).execute()
    print(defensiveTeamData.data)

    print('='*100)
    print('Offensive Average')
    offensiveTeamData = supabase.rpc('get_team_offensive_averages', {'team_name': playerInfo.data[0]['roster'][0]['teams']['name'], 'season_year': 2024}).execute()
    print(offensiveTeamData.data)

    return playerData, defensiveTeamData, offensiveTeamData, playerInfo


def main():
    # Load environment variables from .env file
    load_dotenv()

    # Supabase configuration from .env file
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_ROLE_KEY = os.getenv('SUPABASE_KEY')

    supabase: Client = create_client(SUPABASE_URL, SUPABASE_ROLE_KEY)

    playerInfo = ["Justin Jefferson", "WR"]
    if playerInfo[1] == "WR":
        lightGBMPath = 'wrReceivingYardsLightGBM.pkl'
        elasticNetPath = 'wrReceivingYardsElasticNet.pkl'
    elif playerInfo[1] == "TE":
        lightGBMPath = 'teReceivingYardsLightGBM.pkl'
        elasticNetPath = 'teReceivingYardsElasticNet.pkl'
    else:
        lightGBMPath = 'qbPassingYardsLightGBM.pkl'
        elasticNetPath = 'qbPassingYardsElasticNet.pkl'

    opponent_team = 'Chicago Bears'
    playerData, defensiveTeamData, offensiveTeamData, playerInfo = getDBData(supabase, playerInfo, opponent_team)
    playerFlattenedData = flatten_player_data(playerData, playerInfo, defensiveTeamData, offensiveTeamData)
    print('='*100)
    print("PlayerInfo:")
    print(playerFlattenedData)

    

    # lightGBMPrediction = predictReceivingYardsLightGBM(playerFlattenedData, lightGBMPath)
    # elasticNetPrediction = predictReceivingYardsElasticNet(playerFlattenedData, elasticNetPath)
    # print('='*100)
    # print("elasticNet prediction", elasticNetPrediction)
    # print("lightGBM prediction", lightGBMPrediction)
    
    testWRApiEndPoints(playerFlattenedData)




if __name__ == "__main__":
    main()