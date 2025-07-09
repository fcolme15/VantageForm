# Team name standardization mapping
TEAM_NAME_MAPPING = {
    # Map various team name formats to standardized names
    'KC': 'Kansas City Chiefs',
    'Chiefs': 'Kansas City Chiefs',
    'Kansas City': 'Kansas City Chiefs',
    'BUF': 'Buffalo Bills',
    'Bills': 'Buffalo Bills',
    'Buffalo': 'Buffalo Bills',
    'MIA': 'Miami Dolphins',
    'Dolphins': 'Miami Dolphins',
    'Miami': 'Miami Dolphins',
    'NE': 'New England Patriots',
    'Patriots': 'New England Patriots',
    'New England': 'New England Patriots',
    'NYJ': 'New York Jets',
    'Jets': 'New York Jets',
    'New York Jets': 'New York Jets',
    'BAL': 'Baltimore Ravens',
    'Ravens': 'Baltimore Ravens',
    'Baltimore': 'Baltimore Ravens',
    'CIN': 'Cincinnati Bengals',
    'Bengals': 'Cincinnati Bengals',
    'Cincinnati': 'Cincinnati Bengals',
    'CLE': 'Cleveland Browns',
    'Browns': 'Cleveland Browns',
    'Cleveland': 'Cleveland Browns',
    'PIT': 'Pittsburgh Steelers',
    'Steelers': 'Pittsburgh Steelers',
    'Pittsburgh': 'Pittsburgh Steelers',
    'HOU': 'Houston Texans',
    'Texans': 'Houston Texans',
    'Houston': 'Houston Texans',
    'IND': 'Indianapolis Colts',
    'Colts': 'Indianapolis Colts',
    'Indianapolis': 'Indianapolis Colts',
    'JAX': 'Jacksonville Jaguars',
    'Jaguars': 'Jacksonville Jaguars',
    'Jacksonville': 'Jacksonville Jaguars',
    'TEN': 'Tennessee Titans',
    'Titans': 'Tennessee Titans',
    'Tennessee': 'Tennessee Titans',
    'DEN': 'Denver Broncos',
    'Broncos': 'Denver Broncos',
    'Denver': 'Denver Broncos',
    'LV': 'Las Vegas Raiders',
    'Raiders': 'Las Vegas Raiders',
    'Las Vegas': 'Las Vegas Raiders',
    'LAC': 'Los Angeles Chargers',
    'Chargers': 'Los Angeles Chargers',
    'Los Angeles Chargers': 'Los Angeles Chargers',
    'LAR': 'Los Angeles Rams',
    'Rams': 'Los Angeles Rams',
    'Los Angeles Rams': 'Los Angeles Rams',
    'ARI': 'Arizona Cardinals',
    'Cardinals': 'Arizona Cardinals',
    'Arizona': 'Arizona Cardinals',
    'SF': 'San Francisco 49ers',
    '49ers': 'San Francisco 49ers',
    'San Francisco': 'San Francisco 49ers',
    'SEA': 'Seattle Seahawks',
    'Seahawks': 'Seattle Seahawks',
    'Seattle': 'Seattle Seahawks',
    'DAL': 'Dallas Cowboys',
    'Cowboys': 'Dallas Cowboys',
    'Dallas': 'Dallas Cowboys',
    'NYG': 'New York Giants',
    'Giants': 'New York Giants',
    'New York Giants': 'New York Giants',
    'PHI': 'Philadelphia Eagles',
    'Eagles': 'Philadelphia Eagles',
    'Philadelphia': 'Philadelphia Eagles',
    'WAS': 'Washington Commanders',
    'Commanders': 'Washington Commanders',
    'Washington': 'Washington Commanders',
    'CHI': 'Chicago Bears',
    'Bears': 'Chicago Bears',
    'Chicago': 'Chicago Bears',
    'DET': 'Detroit Lions',
    'Lions': 'Detroit Lions',
    'Detroit': 'Detroit Lions',
    'GB': 'Green Bay Packers',
    'Packers': 'Green Bay Packers',
    'Green Bay': 'Green Bay Packers',
    'MIN': 'Minnesota Vikings',
    'Vikings': 'Minnesota Vikings',
    'Minnesota': 'Minnesota Vikings',
    'ATL': 'Atlanta Falcons',
    'Falcons': 'Atlanta Falcons',
    'Atlanta': 'Atlanta Falcons',
    'CAR': 'Carolina Panthers',
    'Panthers': 'Carolina Panthers',
    'Carolina': 'Carolina Panthers',
    'NO': 'New Orleans Saints',
    'Saints': 'New Orleans Saints',
    'New Orleans': 'New Orleans Saints',
    'TB': 'Tampa Bay Buccaneers',
    'Buccaneers': 'Tampa Bay Buccaneers',
    'Tampa Bay': 'Tampa Bay Buccaneers',
}

teamAcronyms = ['ARI', 'ATL', 'BAL', 'BUF', 'CAR', 'CHI', 'CIN', 'CLE', 'DAL', 'DEN', 'DET', 'GB', 'HOU', 'IND', 'JAX', 'KC', 'LA', 'LAC', 'LV', 'MIA', 'MIN', 'NE', 'NO', 'NYG', 'NYJ', 'PHI', 'PIT', 'SEA', 'SF', 'TB', 'TEN', 'WAS']

teamColumns = ['season', 'week', 'team', 'opponent_team', 'passing_yards', 'targets', 
                   'passing_epa', 'receiving_yards_after_catch', 'rushing_yards',
                   'def_sacks', 'def_pass_defended']

# Position categories needed for database
positionStatsSchema = {
    'QB': [
        'passing_epa', 'passing_yards', 'passing_tds', 'attempts',
        'passing_first_downs', 'interceptions', 'completions',
        'fantasy_points_ppr', 'fantasy_points'
    ],
    'WR': [
        'target_share', 'receiving_epa', 'targets', 'receiving_yards',
        'receiving_tds', 'receptions', 'receiving_first_downs', 'air_yards_share',
        'fantasy_points_ppr', 'fantasy_points'
    ],
    'RB': [
        'rushing_epa', 'carries', 'rushing_yards', 'rushing_tds',
        'rushing_first_downs', 'rushing_fumbles', 'targets', 'receiving_yards',
        'fantasy_points_ppr', 'fantasy_points'
    ],
    'TE': [
        'target_share', 'receiving_epa', 'targets', 'receiving_yards',
        'receiving_tds', 'receptions', 'receiving_first_downs', 'air_yards_share',
        'fantasy_points_ppr', 'fantasy_points'
    ]
}


qbBatch = ([
    'Patrick Mahomes',
    'Josh Allen',
    'Joe Burrow',
    'Lamar Jackson',
    'Justin Herbert',
    'Jalen Hurts',
    'Trevor Lawrence',
    'Aaron Rodgers',
    'Tua Tagovailoa',
    'Dak Prescott',
    'Jared Goff',
    'Matthew Stafford',
    'Brock Purdy',
    'Kyler Murray',
    'C.J. Stroud',
    'Baker Mayfield',
    'Jordan Love',
    'Bryce Young',
    'Anthony Richardson'
], 'QB')

wrBatch = (['Justin Jefferson', 'Tyreek Hill', 'CeeDee Lamb', 'Amon-Ra St. Brown', "Ja'Marr Chase", 
  'A.J. Brown', 'Puka Nacua', 'Davante Adams', 'Garrett Wilson', 'D.J. Moore', 'Mike Evans', 
  'Brandon Aiyuk', 'DK Metcalf', 'Jaylen Waddle',  'Terry McLaurin'], 'WR')

teBatch = (['Travis Kelce', 'George Kittle', 'Mark Andrews', 'Sam LaPorta', 'T.J. Hockenson',
  'Dallas Goedert', 'Kyle Pitts'], 'TE')

rbBatch = (['Bijan Robinson', 'Jonathan Taylor', 'Saquon Barkley', 'Breece Hall',
  'Josh Jacobs', 'Joe Mixon', 'Derrick Henry', 'Kyren Williams', 'Travis Etienne',
  'Alvin Kamara', 'Aaron Jones', 'David Montgomery', 'Javonte Williams', 'James Cook',
  'Tony Pollard', 'Kenneth Walker'], 'RB')

