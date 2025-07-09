-- Fantasy Football Prediction API Database Schema
-- Simplified multi-sport extensible design with explicit constraints

-- Core reference tables
CREATE TABLE sports (
    sportId SERIAL,
    name VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY (sportId)
);

CREATE TABLE leagues (
    leagueId SERIAL,
    sportId INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    season VARCHAR(20) NOT NULL,
    PRIMARY KEY (leagueId),
    FOREIGN KEY (sportId) REFERENCES sports(sportId) ON DELETE CASCADE,
    UNIQUE(sportId, name, season)
);

CREATE TABLE teams (
    teamId SERIAL,
    leagueId INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    teamStatsName VARCHAR(100),
    PRIMARY KEY (teamId),
    FOREIGN KEY (leagueId) REFERENCES leagues(leagueId) ON DELETE CASCADE
);

CREATE TABLE players (
    playerId SERIAL,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(10) NOT NULL,
    PRIMARY KEY (playerId)
);

CREATE TABLE roster (
    rosterId SERIAL,
    playerId INTEGER NOT NULL,
    teamId INTEGER NOT NULL,
    season VARCHAR(20) NOT NULL,
    PRIMARY KEY (rosterId),
    FOREIGN KEY (playerId) REFERENCES players(playerId) ON DELETE CASCADE,
    FOREIGN KEY (teamId) REFERENCES teams(teamId) ON DELETE CASCADE,
    UNIQUE(playerId, teamId, season)
);

CREATE TABLE games (
    gameId SERIAL,
    leagueId INTEGER NOT NULL,
    homeTeamId INTEGER NOT NULL,
    awayTeamId INTEGER NOT NULL,
    week INTEGER NOT NULL,
    season VARCHAR(20) NOT NULL,
    homeScore INTEGER,
    awayScore INTEGER,
    PRIMARY KEY (gameId),
    FOREIGN KEY (leagueId) REFERENCES leagues(leagueId) ON DELETE CASCADE,
    FOREIGN KEY (homeTeamId) REFERENCES teams(teamId) ON DELETE CASCADE,
    FOREIGN KEY (awayTeamId) REFERENCES teams(teamId) ON DELETE CASCADE,
    CONSTRAINT chk_week_range CHECK (week >= 1 AND week <= 22)
);

-- Position-specific stats tables

CREATE TABLE qbstats (
    qbStatId SERIAL,
    playerId INTEGER NOT NULL,
    gameId INTEGER NOT NULL,
    teamId INTEGER NOT NULL,
    gameWeek INTEGER,
    season VARCHAR(20),
    
    -- Core QB features (ranked by importance)
    passingEpa DECIMAL(8,4),
    passingYards INTEGER,
    passingTds INTEGER,
    attempts INTEGER,
    passingFirstDowns INTEGER,
    interceptions INTEGER,
    completions INTEGER,
    
    -- Target variables
    fantasyPointsPpr DECIMAL(6,2),
    fantasyPoints DECIMAL(6,2),
    
    PRIMARY KEY (qbStatId),
    FOREIGN KEY (playerId) REFERENCES players(playerId) ON DELETE CASCADE,
    FOREIGN KEY (gameId) REFERENCES games(gameId) ON DELETE CASCADE,
    FOREIGN KEY (teamId) REFERENCES teams(teamId) ON DELETE CASCADE,
    UNIQUE(playerId, gameId)
);

CREATE TABLE wrstats (
    wrStatId SERIAL,
    playerId INTEGER NOT NULL,
    gameId INTEGER NOT NULL,
    teamId INTEGER NOT NULL,
    gameWeek INTEGER,
    season VARCHAR(20),
    
    -- Core WR features (ranked by importance)
    targetShare DECIMAL(5,4),
    receivingEpa DECIMAL(8,4),
    targets INTEGER,
    receivingYards INTEGER,
    receivingTds INTEGER,
    receptions INTEGER,
    receivingFirstDowns INTEGER,
    airYardShare DECIMAL(5,4),
    
    -- Target variables
    fantasyPointsPpr DECIMAL(6,2),
    fantasyPoints DECIMAL(6,2),
    
    PRIMARY KEY (wrStatId),
    FOREIGN KEY (playerId) REFERENCES players(playerId) ON DELETE CASCADE,
    FOREIGN KEY (gameId) REFERENCES games(gameId) ON DELETE CASCADE,
    FOREIGN KEY (teamId) REFERENCES teams(teamId) ON DELETE CASCADE,
    UNIQUE(playerId, gameId)
);

CREATE TABLE rbstats (
    rbStatId SERIAL,
    playerId INTEGER NOT NULL,
    gameId INTEGER NOT NULL,
    teamId INTEGER NOT NULL,
    gameWeek INTEGER,
    season VARCHAR(20),
    
    -- Core RB features (ranked by importance)
    rushingEpa DECIMAL(8,4),
    carries INTEGER,
    rushingYards INTEGER,
    rushingTds INTEGER,
    rushingFirstDowns INTEGER,
    rushingFumbles INTEGER,
    
    -- Pass-catching RB features
    receivingTargets INTEGER,
    receivingYards INTEGER,
    
    -- Target variables
    fantasyPointsPpr DECIMAL(6,2),
    fantasyPoints DECIMAL(6,2),
    
    PRIMARY KEY (rbStatId),
    FOREIGN KEY (playerId) REFERENCES players(playerId) ON DELETE CASCADE,
    FOREIGN KEY (gameId) REFERENCES games(gameId) ON DELETE CASCADE,
    FOREIGN KEY (teamId) REFERENCES teams(teamId) ON DELETE CASCADE,
    UNIQUE(playerId, gameId)
);

CREATE TABLE testats (
    teStatId SERIAL,
    playerId INTEGER NOT NULL,
    gameId INTEGER NOT NULL,
    teamId INTEGER NOT NULL,
    gameWeek INTEGER,
    season VARCHAR(20),
    
    -- Core TE features (same as WR)
    targetShare DECIMAL(5,4),
    receivingEpa DECIMAL(8,4),
    targets INTEGER,
    receivingYards INTEGER,
    receivingTds INTEGER,
    receptions INTEGER,
    receivingFirstDowns INTEGER,
    airYardShare DECIMAL(5,4),
    
    -- Target variables
    fantasyPointsPpr DECIMAL(6,2),
    fantasyPoints DECIMAL(6,2),
    
    PRIMARY KEY (teStatId),
    FOREIGN KEY (playerId) REFERENCES players(playerId) ON DELETE CASCADE,
    FOREIGN KEY (gameId) REFERENCES games(gameId) ON DELETE CASCADE,
    FOREIGN KEY (teamId) REFERENCES teams(teamId) ON DELETE CASCADE,
    UNIQUE(playerId, gameId)
);

CREATE TABLE teamoffensestats (
    teamOffenseStatId SERIAL,
    teamId INTEGER NOT NULL,
    gameId INTEGER NOT NULL,
    gameWeek INTEGER,
    season VARCHAR(20),
    
    -- Core offensive features (ranked by importance)
    passingEpa DECIMAL(8,4),
    targets INTEGER,
    passingYards INTEGER,
    receivingYardsAfterCatch INTEGER,
    rushingYards INTEGER,
    
    PRIMARY KEY (teamOffenseStatId),
    FOREIGN KEY (teamId) REFERENCES teams(teamId) ON DELETE CASCADE,
    FOREIGN KEY (gameId) REFERENCES games(gameId) ON DELETE CASCADE,
    UNIQUE(teamId, gameId)
);

CREATE TABLE teamdefensestats (
    teamDefenseStatId SERIAL,
    teamId INTEGER NOT NULL,
    gameId INTEGER NOT NULL,
    gameWeek INTEGER,
    season VARCHAR(20),
    
    -- Core defensive features (ranked by importance)
    defPassDefended INTEGER,
    defSacks INTEGER,
    
    PRIMARY KEY (teamDefenseStatId),
    FOREIGN KEY (teamId) REFERENCES teams(teamId) ON DELETE CASCADE,
    FOREIGN KEY (gameId) REFERENCES games(gameId) ON DELETE CASCADE,
    UNIQUE(teamId, gameId)
);

-- Indexes for performance optimization
CREATE INDEX idx_qb_stats_player_game ON qbstats(playerId, gameId);
CREATE INDEX idx_wr_stats_player_game ON wrstats(playerId, gameId);
CREATE INDEX idx_rb_stats_player_game ON rbstats(playerId, gameId);
CREATE INDEX idx_te_stats_player_game ON testats(playerId, gameId);
CREATE INDEX idx_team_offense_stats_team_game ON teamoffensestats(teamId, gameId);
CREATE INDEX idx_team_defense_stats_team_game ON teamdefensestats(teamId, gameId);

-- Rolling average optimized indexes
CREATE INDEX idx_qb_stats_player_week ON qbstats(playerId, gameWeek DESC);
CREATE INDEX idx_wr_stats_player_week ON wrstats(playerId, gameWeek DESC);
CREATE INDEX idx_rb_stats_player_week ON rbstats(playerId, gameWeek DESC);
CREATE INDEX idx_te_stats_player_week ON testats(playerId, gameWeek DESC);
CREATE INDEX idx_team_offense_week ON teamoffensestats(teamId, gameWeek DESC);
CREATE INDEX idx_team_defense_week ON teamdefensestats(teamId, gameWeek DESC);

-- Composite indexes for common queries
CREATE INDEX idx_games_opponent_lookup ON games(homeTeamId, awayTeamId, week);
CREATE INDEX idx_games_season_week ON games(season, week);
CREATE INDEX idx_roster_player_season ON roster(playerId, season);
CREATE INDEX idx_players_position ON players(position);