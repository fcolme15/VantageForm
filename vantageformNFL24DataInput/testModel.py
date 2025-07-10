from dotenv import load_dotenv
import requests
import os
from supabase import create_client, Client

def getModelData(supabase, playerInfo, ):

    playerData = supabase.rpc('get_player_average_stats', {'player_name': playerInfo[0], 'input_position': playerInfo[1]}).execute()
    print(playerData.data)

    response = supabase \
    .from_('players') \
    .select('playerid, name, teams(name)') \
    .execute()
    print(response.data)

    defensiveTeamData = supabase.rpc('get_team_defensive_stats_last_8', {'team_name_given': playerInfo[0], 'season_year': playerInfo[1]}).execute()
    print(defensiveTeamData.data)

    offensiveTeamData = supabase.rpc('get_team_offensive_stats_last_8', {'team_name_given': playerInfo[0], 'season_year': playerInfo[1]}).execute()
    print(offensiveTeamData.data)


    return playerData


def main():
    # Load environment variables from .env file
    load_dotenv()

    # Supabase configuration from .env file
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_ROLE_KEY = os.getenv('SUPABASE_KEY')

    supabase: Client = create_client(SUPABASE_URL, SUPABASE_ROLE_KEY)

    playerInfo = ["Justin Jefferson", "WR"]
    date = getModelData(supabase, playerInfo)

if __name__ == "__main__":
    main()