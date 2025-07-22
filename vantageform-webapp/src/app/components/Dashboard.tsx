
"use client"

import React, { useState, useEffect } from 'react';
import { Users, Star, Plus, Activity } from 'lucide-react';
import Dropdown from '@/components/dashboard/Dropdown';
import PlayerCard from '@/components/dashboard/PlayerCard';
import PlayerSearchComponent from '@/components/dashboard/SearchBar';
// import ComparisonPlayerCard from './dashboard/PlayerComparisonCard';
import {Sport, Player, RawPlayer, SavedProjection } from "@/components/dashboard/Interfaces"
import { useSportsApi } from "@/services/apiservices"
// import CustomBarChart from "@/components/dashboard/ProjectionChart"

export default function Dashboard() {
  const [selectedSport, setSelectedSport] = useState<Sport>({name:'Football'});
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player>();
  const [recentPlayers, updateRecentPlayers] = useState<Player[]>([]);
  const [projections, setProjections] = useState<number[]>([0,0,0]);
  const [updatingProjection, setUpdatingProjection] = useState<boolean>(false);
  const [savedProjections, setSavedProjections] = useState<SavedProjection[]>([]);
  const [savedProjectionPredictions, setSavedProjectionPredictions] = useState<SavedProjection[]>([]);

  const date = new Date();
  // const { getAuthHeader, session, user } = useAuth();
  const [sports, setSports] = useState<Sport[]>([]);
  const { dashboardGeneralInfo, getPlayersBySport,
    wrReceivingYardsLightGBMPrediction, wrReceivingYardsElasticNetPrediction,
    teReceivingYardsLightGBMPrediction, teReceivingYardsElasticNetPrediction,
    qbPassingYardsLightGBMPrediction, qbPassingYardsElasticNetPrediction} = useSportsApi();

  type Position = 'WR' | 'RB' | 'QB' | 'TE';

  const projectionByPosition: Record<Position, string> = {
    'WR': 'Receiving Yards',
    'RB': 'Receiving Yards',
    'QB': 'Passing Yards',
    'TE': 'Receiving Yards',
  }


  useEffect(() => {
    const fetchAllPredictions = async () => {
      try {
        const rawData = await getPlayersBySport(selectedSport.name)
        const transformed = rawData.map((p: RawPlayer): Player => ({
          id: p.playerid,
          name: p.name,
          team: p.roster[0].teams.name,
          position: p.position,
          sport: p.roster[0].teams.leagues.sports.name
        }));

        setPlayers(transformed);
      } catch (error) {
        console.error('Failed to fetch predictions:', error);
      }
    };

    fetchAllPredictions();
    console.log(players);
  }, [selectedSport]);


  useEffect(() => {
    const fetchAllPredictions = async () => {
      try {
        const data = await dashboardGeneralInfo();
        setSports(data.sports as Sport[]);

      } catch (error) {
        console.error('Failed to fetch predictions:', error);
      }

      console.log('initiating stuff');
    };

    // Call the async function
    fetchAllPredictions();
    setSelectedSport({name:'Football'})

  }, []);

  const handlePlayerSelect = (newPlayer: Player) => {
    console.log('Player selected in callback:', newPlayer.name);
    setSelectedPlayer(newPlayer);
    const isDuplicate = recentPlayers.find(player => player.id === newPlayer.id);
    if (!isDuplicate) {
      updateRecentPlayers([newPlayer, ...recentPlayers])
    }
  };

  useEffect(() => {
    setProjections([0, 0]);
    if (selectedPlayer) {
      const exists = savedProjectionPredictions.find(currPlayer => currPlayer.player.id === selectedPlayer.id);

      if (exists){
        setProjections([exists.projection1, exists.projection2]);
        return;
      }
      const fetchAllPredictions = async () => {
        const playerInfo = [selectedPlayer.name , 'Chicago Bears']
        try {
          let currProjections:number[] = []
          setUpdatingProjection(true);
          switch (selectedPlayer?.position){
            case 'WR':
              const lightGBMPredictionwr = await wrReceivingYardsLightGBMPrediction(playerInfo);
              const elasticNetPredictionwr = await wrReceivingYardsElasticNetPrediction(playerInfo);
              setProjections([lightGBMPredictionwr.prediction.toFixed(2), elasticNetPredictionwr.prediction.toFixed(2)]);
              currProjections = [lightGBMPredictionwr.prediction.toFixed(2),elasticNetPredictionwr.prediction.toFixed(2)]
              break;
            case 'RB':
              const lightGBMPredictionrb = await teReceivingYardsLightGBMPrediction(playerInfo);
              const elasticNetPredictionrb = await teReceivingYardsElasticNetPrediction(playerInfo);
              setProjections([lightGBMPredictionrb.prediction.toFixed(2), elasticNetPredictionrb.prediction.toFixed(2)]);
              currProjections = [lightGBMPredictionrb.prediction.toFixed(2),elasticNetPredictionrb.prediction.toFixed(2)]
              break;
            case 'QB':
              const lightGBMPredictionqb = await qbPassingYardsLightGBMPrediction(playerInfo);
              const elasticNetPredictionqb = await qbPassingYardsElasticNetPrediction(playerInfo);
              setProjections([lightGBMPredictionqb.prediction.toFixed(2), elasticNetPredictionqb.prediction.toFixed(2)]);
              currProjections = [lightGBMPredictionqb.prediction.toFixed(2),elasticNetPredictionqb.prediction.toFixed(2)]
              break;
            default:
              const lightGBMPredictionte = await teReceivingYardsLightGBMPrediction(playerInfo);
              const elasticNetPredictionte = await teReceivingYardsElasticNetPrediction(playerInfo);
              setProjections([lightGBMPredictionte.prediction.toFixed(2), elasticNetPredictionte.prediction.toFixed(2)]);
              currProjections = [lightGBMPredictionte.prediction.toFixed(2),elasticNetPredictionte.prediction.toFixed(2)];
              break;
          }

          setUpdatingProjection(false);
          const newProjection = {
            'player': selectedPlayer,
            'projection1': currProjections[0],
            'projection2': currProjections[1],
            'date': date.toLocaleString(),
          }
          setSavedProjectionPredictions([newProjection, ...savedProjectionPredictions])
        } catch (error) {
          console.error('Failed to fetch predictions:', error);
        }
      }
      fetchAllPredictions();
    }
  }, [selectedPlayer]);



  return (
    <div className="mt-21 min-h-screen bg-gradient-to-br from-n-8 to-n-7 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        {/* Top Left */}
        <div 
          className="absolute top-30 left-20 w-96 h-96 bg-green-500 rounded-full blur-3xl"
        />
        {/* Top Right */}
        <div 
          className="absolute top-10 left-250 w-96 h-96 bg-green-500 rounded-full blur-3xl"
        />
        {/* Lower Middle */}
        <div 
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-600 rounded-full blur-2xl"
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
          <div className="bg-gradient-to-br from-n-8 to-n-6 backdrop-blur-sm rounded-xl p-4 border border-green-800/50 z-30">
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Select Sport
            </label>
            <Dropdown 
              options={sports}
              selected={selectedSport}
              onSelect={(option) => setSelectedSport(option as Sport)}
              placeholder="Choose sport..."
            />
          </div>

          {/* Recent Players */}
          <div className="bg-gradient-to-br from-n-8 to-n-6 backdrop-blur-sm rounded-xl p-4 border border-green-800/50">
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Recent Players
            </label>
            <div className="space-y-2  lg:min-h-32 max-h-32 scrollbar-hide overflow-y-auto">
              {recentPlayers.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  isActive={selectedPlayer?.id === player.id}
                  onClick={setSelectedPlayer}
                />
              ))}
            </div>
          </div>

          <PlayerSearchComponent players={players} onPlayerSelect={handlePlayerSelect}/>
        </div>

        {/* Top Content - Player Analysis + Saved Projections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Player Analysis - 2/3 width */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-n-8 to-n-6 backdrop-blur-sm rounded-xl p-6 border border-green-800/50 h-[550px] lg:h-[560px] flex flex-col">
              {selectedPlayer ? (
                <>
                  <div className="flex items-center justify-between mb-6 flex-shrink-0">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-2xl font-bold">
                        {selectedPlayer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{selectedPlayer.name}</h2>
                        <p className="text-gray-300">{selectedPlayer.team} • {selectedPlayer.position}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        console.log(updatingProjection);
                        if (selectedPlayer && projections && !updatingProjection) {
                          const isDuplicate = savedProjections.find(proj => proj.player.id === selectedPlayer.id);
                          if (!isDuplicate) {
                            const newProjection = {
                              'player': selectedPlayer,
                              'projection1': projections[0],
                              'projection2': projections[1],
                              'date': date.toLocaleString(),
                            }
                            setSavedProjections([newProjection, ...savedProjections])
                          }
                        }
                      }}


                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      {updatingProjection ?'Loading':'Save'}
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    <div className="mb-12">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Projection Type: {selectedPlayer ? projectionByPosition[selectedPlayer.position as Position] || 'Unknown' : 'Select a player'}
                      </label>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-4">
                      <div className="bg-[#0B1901]/50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-400">{projections[0]}</div>
                        <div className="text-sm text-gray-300">Projected Using LightGBM</div>
                      </div>
                      <div className="bg-[#0B1901]/50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-400">{projections[1]}</div>
                        <div className="text-sm text-gray-300">Projected Using ElasticNet</div>
                      </div>
                    </div>
                  </div>
                  {/*<div className="min-h-[150px]">*/}
                  {/*  <CustomBarChart data={projections} />*/}
                  {/*</div>*/}
                </>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Select a player to view projections</p>
                </div>
              )}
            </div>
          </div>

          {/* Saved Projections - 1/3 width, full height */}
          <div className="bg-gradient-to-br from-n-8 to-n-6 backdrop-blur-sm rounded-xl p-6 border border-green-800/50 h-80 lg:h-[560px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Saved Projections
              </h3>
            </div>
            <div className="space-y-3 max-h-[calc(100%-4rem)] scrollbar-hide overflow-y-auto">
              {savedProjections.map((proj) => (
                <button
                  key={proj.player.id}
                  onClick={() => {
                    // const player = proj.player;
                    // const projection1 = proj.projection1;
                    // const projection2 = proj.projection2;
                    setSelectedPlayer(proj.player);
                  }}
                  className="w-full bg-[#0B1901]/50 hover:bg-green-800/30 rounded-lg p-3 text-left transition-all"
                >
                  <div className="font-medium text-white text-sm">{proj.player.name}</div>
                  <div className="text-xs text-gray-300">{projectionByPosition[proj.player.position as Position] || 'Unknown'}</div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-green-400 font-bold">{proj.projection1}</span>
                    <span className="text-green-400 font-bold">{proj.projection2}</span>
                    <span className="text-xs text-gray-400">{proj.date}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Content - 2x2 Grid */}
        {/*<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">*/}
        {/*  /!* Player Comparison - 2/3 width *!/*/}
        {/*  <div className="lg:col-span-2">*/}
        {/*    <div className="bg-gradient-to-br from-n-8 to-n-6 backdrop-blur-sm rounded-xl p-6 border border-green-800/50 h-[550px] lg:h-[560px] flex flex-col">*/}
        {/*      <div className="flex items-center justify-between mb-6 flex-shrink-0">*/}
        {/*        <h3 className="text-xl font-semibold text-white flex items-center gap-2">*/}
        {/*          <Zap className="w-6 h-6 text-yellow-400" />*/}
        {/*          Player Comparison*/}
        {/*        </h3>*/}
        {/*        <div className="flex items-center gap-2 text-green-400">*/}
        {/*          <BarChart3 className="w-4 h-4" />*/}
        {/*          <span className="text-sm">Head-to-Head</span>*/}
        {/*        </div>*/}
        {/*      </div>*/}

        {/*      <div className="flex-1 overflow-y-auto">*/}
        {/*        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">*/}
        {/*          <ComparisonPlayerCard*/}
        {/*            player={comparisonPlayer1}*/}
        {/*            title="Player A"*/}
        {/*            onClick={() => {*/}
        {/*              // In a real app, this would open a player selection modal*/}
        {/*              const nextPlayer = RECENT_PLAYERS.find(p => p.id !== comparisonPlayer1?.id && p.id !== comparisonPlayer2?.id);*/}
        {/*              if (nextPlayer) setComparisonPlayer1(nextPlayer);*/}
        {/*            }}*/}
        {/*          />*/}
        {/*          <ComparisonPlayerCard*/}
        {/*            player={comparisonPlayer2}*/}
        {/*            title="Player B"*/}
        {/*            onClick={() => {*/}
        {/*              // In a real app, this would open a player selection modal*/}
        {/*              const nextPlayer = RECENT_PLAYERS.find(p => p.id !== comparisonPlayer1?.id && p.id !== comparisonPlayer2?.id);*/}
        {/*              if (nextPlayer) setComparisonPlayer2(nextPlayer);*/}
        {/*            }}*/}
        {/*          />*/}
        {/*        </div>*/}

        {/*        {comparisonPlayer1 && comparisonPlayer2 && (*/}
        {/*          <div className="pt-6 border-t border-green-800/50">*/}
        {/*            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">*/}
        {/*              <div className="bg-[#0B1901]/50 rounded-lg p-4 text-center">*/}
        {/*                <div className="text-lg font-bold text-green-400 mb-1">Advantage</div>*/}
        {/*                <div className="text-sm text-white">{comparisonPlayer1.name}</div>*/}
        {/*                <div className="text-xs text-gray-300">Better matchup</div>*/}
        {/*              </div>*/}
        {/*              <div className="bg-[#0B1901]/50 rounded-lg p-4 text-center">*/}
        {/*                <div className="text-lg font-bold text-blue-400 mb-1">Similar</div>*/}
        {/*                <div className="text-sm text-white">Target Share</div>*/}
        {/*                <div className="text-xs text-gray-300">Both ~22%</div>*/}
        {/*              </div>*/}
        {/*              <div className="bg-[#0B1901]/50 rounded-lg p-4 text-center">*/}
        {/*                <div className="text-lg font-bold text-purple-400 mb-1">Edge</div>*/}
        {/*                <div className="text-sm text-white">{comparisonPlayer2.name}</div>*/}
        {/*                <div className="text-xs text-gray-300">Lower salary</div>*/}
        {/*              </div>*/}
        {/*            </div>*/}
        {/*          </div>*/}
        {/*        )}*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  </div>*/}

        {/*  /!* Saved Lineups - 1/3 width *!/*/}
        {/*  <div className="bg-gradient-to-br from-n-8 to-n-6 backdrop-blur-sm rounded-xl p-6 border border-green-800/50 h-80 lg:h-[560px]">*/}
        {/*    <div className="flex items-center justify-between mb-4">*/}
        {/*      <h3 className="text-lg font-semibold text-white flex items-center gap-2">*/}
        {/*        <Users className="w-5 h-5 text-green-400" />*/}
        {/*        Saved Lineups*/}
        {/*      </h3>*/}
        {/*    </div>*/}
        {/*    <div className="space-y-3 max-h-[calc(100%-4rem)] scrollbar-hide overflow-y-auto">*/}
        {/*      {LINEUPS.map((lineup) => (*/}
        {/*        <div key={lineup.id} className="bg-[#0B1901]/50 hover:bg-green-800/20 rounded-lg p-3 transition-all cursor-pointer">*/}
        {/*          <div className="font-medium text-white text-sm">{lineup.name}</div>*/}
        {/*          <div className="text-xs text-gray-300 mt-1">*/}
        {/*            {lineup.players} players • {lineup.projections} projections*/}
        {/*          </div>*/}
        {/*          <div className="flex justify-between items-center mt-2">*/}
        {/*            <span className="text-xs text-gray-400">{lineup.created}</span>*/}
        {/*            <div className="flex items-center gap-1">*/}
        {/*              <Star className="w-3 h-3 text-yellow-400" />*/}
        {/*              <span className="text-xs text-yellow-400">Saved</span>*/}
        {/*            </div>*/}
        {/*          </div>*/}
        {/*        </div>*/}
        {/*      ))}*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}

        {/*<SaveModel*/}
        {/*  isOpen={showSaveModel}*/}
        {/*  onClose={() => setShowSaveModel(false)}*/}
        {/*  onSave={handleSave}*/}
        {/*/>*/}
      </div>
    </div>
  );
}