import json
import numpy as np

with open('match_data.json') as league_data_file:
    master_replay_list = json.load(league_data_file)

unique_replay_ids = set()
unique_matches = []

# Iterate over the replay list
for replay in master_replay_list:
    replay_id = replay["replay_id"]

    # Check if replay_id is already encountered
    if replay_id in unique_replay_ids:
        continue

    # Add replay_id to set of encountered IDs
    unique_replay_ids.add(replay_id)

    # Append the unique match to the list
    unique_matches.append(replay)

# Now, unique_matches contains only the unique matches based on replay_id

len(unique_matches)

character_names = [
  'Blanka',
  'Cammy',
  'Chun-Li',
  'Dee Jay',
  'Dhalsim',
  'Edmond Honda',
  'Guile',
  'Jamie',
  'JP',
  'Juri',
  'Ken',
  'Kimberly',
  'Lily',
  'Luke',
  'Manon',
  'Marisa',
  'Ryu',
  'Zangief'
]


character_wins = {}
character_matches = {}

# Iterate over the replay list
for replay in unique_matches:
    player_1 = replay["player_1"]
    player_2 = replay["player_2"]
    winner = replay["winner"]

    character_name_1 = player_1["character_name"]
    character_wins[character_name_1] = character_wins.get(character_name_1, 0) + int(winner == "player_1")
    character_matches[character_name_1] = character_matches.get(character_name_1, 0) + 1

    character_name_2 = player_2["character_name"]
    character_wins[character_name_2] = character_wins.get(character_name_2, 0) + int(winner == "player_2")
    character_matches[character_name_2] = character_matches.get(character_name_2, 0) + 1

# Calculate win rates
character_win_rates = {}
for character, wins in character_wins.items():
    matches = character_matches[character]
    win_rate = wins / matches if matches > 0 else 0
    character_win_rates[character] = win_rate

# Calculate mean and standard deviation of win rates
win_rates = np.array(list(character_win_rates.values()))
mean = np.mean(win_rates)
std_dev = np.std(win_rates)

# Classify characters into tiers
tiers = {}
for character, win_rate in character_win_rates.items():
    deviation = (win_rate - mean) / std_dev

    if deviation >= 2:
        tiers[character] = "S Tier"
    elif deviation >= 1:
        tiers[character] = "A Tier"
    elif deviation >= 0:
        tiers[character] = "B Tier"
    elif deviation >= -1:
        tiers[character] = "C Tier"
    else:
        tiers[character] = "D Tier"

# Sort characters by their win rates
sorted_characters = sorted(character_win_rates.items(), key=lambda x: x[1], reverse=True)

# Print sorted characters with tiers
for character, win_rate in sorted_characters:
    tier = tiers[character]
    print(f"{character}: {win_rate:.2%} ({tier})")


# Initialize the matchup wins and counts
matchup_wins = np.zeros((len(character_names), len(character_names)), dtype=int)
matchup_counts = np.zeros((len(character_names), len(character_names)), dtype=int)

# Count the number of wins and total matches for each matchup
for replay in master_replay_list:
    player_1 = replay["player_1"]
    player_2 = replay["player_2"]
    winner = replay["winner"]

    character_1 = player_1["character_name"]
    character_2 = player_2["character_name"]

    # Increment the matchup wins for the winner
    if winner == "player_1":
        matchup_wins[character_names.index(character_1)][character_names.index(character_2)] += 1
    else:
        matchup_wins[character_names.index(character_2)][character_names.index(character_1)] += 1

    # Increment the matchup counts for both characters
    matchup_counts[character_names.index(character_1)][character_names.index(character_2)] += 1
    matchup_counts[character_names.index(character_2)][character_names.index(character_1)] += 1

# Calculate the win rate for each matchup
win_rates = matchup_wins / np.where(matchup_counts == 0, 1, matchup_counts)

# Print the matchup chart
print("Matchup Chart:")
for i, character_1 in enumerate(character_names):
    for j, character_2 in enumerate(character_names):
        win_rate = win_rates[i][j]
        print(f"{character_1} vs {character_2}: {win_rate:.2%}")