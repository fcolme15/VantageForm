const { supabase } = require('../config/database');

class DatabaseService {
  constructor() {
    if (!supabase) {
      console.error('Supabase client not initialized. Check your environment variables.');
    }
  }

  _checkConnection() {
    if (!supabase) {
      throw new Error('Database connection not available. Check your environment variables.');
    }
  }

  // Example: Create a new record
  async createRecord(tableName, data) {
    this._checkConnection();
    
    try {
      const { data: result, error } = await supabase
        .from(tableName)
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: result };
    } catch (error) {
      console.error(`Error creating record in ${tableName}:`, error);
      return { success: false, error: error.message };
    }
  }

  // Example: Update a record
  async updateRecord(tableName, id, updates) {
    this._checkConnection();
    
    try {
      const { data, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error(`Error updating record in ${tableName}:`, error);
      return { success: false, error: error.message };
    }
  }

  // Example: Delete a record
  async deleteRecord(tableName, id) {
    this._checkConnection();
    
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error(`Error deleting record from ${tableName}:`, error);
      return { success: false, error: error.message };
    }
  }

  // Example: Search records
  async searchRecords(tableName, searchColumn, searchTerm) {
    this._checkConnection();
    
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .ilike(searchColumn, `%${searchTerm}%`);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error(`Error searching records in ${tableName}:`, error);
      return { success: false, error: error.message };
    }
  }

  async getSportNames() {
    this._checkConnection();

    try {
      const { data, error } = await supabase
        .from('sports')
        .select('name');

      if (error) throw error;
      return { success: true, data };
    }
    catch(error) {
      console.error('Error getting sports name:', error);
      return { success: false, error: error.message };
    }
  }


  async getPlayerNamesBySport(sportName) {
    this._checkConnection();

    try {
      const { data, error } = await supabase
          .from('players')
          .select(`
            name,
            playerid,
            position,
            roster!inner(
              teams!inner(
                name,
                leagues!inner(
                  sports!inner(
                    name
                  )
                )
              )
            )
          `)
          .eq('roster.teams.leagues.sports.name', sportName);

      if (error) throw error;
      return { success: true, data };
    }
    catch(error) {
      console.error('Error getting player names:', error);
      return { success: false, error: error.message };
    }
  }

  async getPlayerAvgData(playerName, opponentTeam) {
    this._checkConnection();

    try {
      console.log('='.repeat(100));
      console.log('Player General Info');

      // Get player general info first to get position
      const { data: playerInfo, error: playerInfoError } = await supabase
          .from('players')
          .select('playerid, name, position, roster(teams(name))')
          .eq('name', playerName);

      if (playerInfoError) throw playerInfoError;
      console.log(playerInfo);

      if (!playerInfo || playerInfo.length === 0) {
        throw new Error('Player not found');
      }

      const playerPosition = playerInfo[0].position;

      console.log('='.repeat(100));
      console.log('Player Average');

      // Get player average stats using the position from player info
      const { data: playerData, error: playerError } = await supabase
          .rpc('get_player_average_stats', {
            player_name: playerName,
            input_position: playerPosition
          });

      if (playerError) throw playerError;
      console.log(playerData);

      console.log('='.repeat(100));
      console.log('Defensive Average');

      // Get defensive team averages
      const { data: defensiveTeamData, error: defensiveError } = await supabase
          .rpc('get_team_defensive_averages', {
            team_name: opponentTeam,
            season_year: 2024
          });

      if (defensiveError) throw defensiveError;
      console.log(defensiveTeamData);

      console.log('='.repeat(100));
      console.log('Offensive Average');

      // Get offensive team averages using the player's team name
      const playerTeamName = playerInfo[0]?.roster?.[0]?.teams?.name;
      if (!playerTeamName) {
        throw new Error('Unable to get player team name');
      }

      const { data: offensiveTeamData, error: offensiveError } = await supabase
          .rpc('get_team_offensive_averages', {
            team_name: playerTeamName,
            season_year: 2024
          });

      if (offensiveError) throw offensiveError;
      console.log(offensiveTeamData);

      return {
        success: true,
        data: {
          playerData,
          defensiveTeamData,
          offensiveTeamData,
          playerInfo
        }
      };

    } catch (error) {
      console.error('Error getting player average data:', error);
      return { success: false, error: error.message };
    }
  }

  flattenPlayerData(playerAvg, playerInfo, defAvg, offAvg) {
    const result = {};

    console.log(playerInfo);

    // Player general info
    if (playerInfo && playerInfo.length > 0) {
      const info = playerInfo[0];
      result.playerid = info.playerid;
      result.name = info.name;
      result.team = info.roster?.[0]?.teams?.name;
    }

    // Player average stats
    if (playerAvg && playerAvg.length > 0) {
      const stats = playerAvg[0].avg_stats || {};
      Object.assign(result, {
        targets: stats.avg_targets,
        receptions: stats.avg_receptions,
        target_share: stats.avg_target_share,
        receiving_epa: stats.avg_receiving_epa,
        receiving_tds: stats.avg_receiving_tds,
        air_yards_share: stats.avg_air_yard_share,
        fantasy_points: stats.avg_fantasy_points,
        receiving_yards: stats.avg_receiving_yards,
        fantasy_points_ppr: stats.avg_fantasy_points_ppr,
        receiving_first_downs: stats.avg_receiving_first_downs
      });
    }

    // Defensive team averages
    if (defAvg && defAvg.length > 0) {
      const defStats = defAvg[0].avg_defensive_stats || {};
      Object.assign(result, {
        opp_def_sacks: defStats.avg_def_sacks,
        opp_def_pass_defended: defStats.avg_def_pass_defended
      });
    }

    // Offensive team averages
    if (offAvg && offAvg.length > 0) {
      const offStats = offAvg[0].avg_offensive_stats || {};
      Object.assign(result, {
        team_off_targets: offStats.avg_targets,
        team_off_passing_epa: offStats.avg_passing_epa,
        team_off_passing_yards: offStats.avg_passing_yards,
        team_off_rushing_yards: offStats.avg_rushing_yards,
        team_off_receiving_yards_after_catch: offStats.avg_receiving_yards_after_catch
      });
    }

    return result;
  };



}
module.exports = new DatabaseService();