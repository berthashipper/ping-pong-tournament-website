# Tournament Manager Web App
[See it in action](https://berthashipper.github.io/ping-pong-tournament-website/)

## Overview

**Problem:** My college club faced significant challenges when organizing and managing large tournaments. We often struggled with coordinating players, managing scores, generating matchups, and ensuring that everyone had a fair and streamlined experience. As our tournaments grew in size, it became clear that our existing systems were not scalable, efficient, or sustainable.

**Solution:** I designed a custom **Tournament Manager** to streamline and automate the tournament management process. The goal was to create a simple, usable interface that would handle all necessary tasks seamlessly. The system is designed to be intuitive, enabling future club leaders to run tournaments with ease and minimal effort. This project represents a rebuild of my earlier [Python-based prototype](https://github.com/berthashipper/Tournament-Manager-Application), emphasizing the real needs of our club leaders.

This JavaScript script implements a lightweight tournament management system that:

- Tracks players
- Generates fair matchups over multiple rounds
- Records and updates scores dynamically
- Persists data across page reloads
- Supports easy reset and user interaction

Each part of the code is essential for running casual to semi-formal tournaments efficiently.

## Data Structures and Persistent Storage

- `players = JSON.parse(localStorage.getItem("players")) || []`
  - Loads the list of players from browser storage (`localStorage`).
  - If no players are saved yet, initializes an empty array.
  - **Benefit**: Players persist even after the page is reloaded, ensuring continuity.

- `rounds = JSON.parse(localStorage.getItem("rounds")) || []`
  - Loads past rounds (matches played) from `localStorage`.
  - **Benefit**: Previous matchups can be analyzed to avoid rematches when generating new rounds.

- `scores = JSON.parse(localStorage.getItem("scores")) || {}`
  - Loads each player's cumulative score.
  - **Benefit**: Easily shows leaderboard standings at any point.

## saveState() — Persist Current Tournament State

- Saves `players`, `rounds`, and `scores` back into `localStorage`.
- **Benefit**: All changes (adding players, generating rounds, updating scores) are automatically stored, making the system robust to accidental reloads.

## addPlayer() — Add a New Player

- Grabs the inputted player name.
- Trims whitespace and checks:
  - Name is non-empty.
  - Name is not a duplicate.
- Adds player to the list and initializes their score to `0`.
- Renders the updated player list and scoreboard.
- **Benefit**: Prevents duplicates, ensuring clean and fair tournament setup.

## renderPlayers() — Display Player List

- Clears the existing list.
- Rebuilds the list of players, each with a remove button.
- **Benefit**: Ensures the user interface reflects the latest player data immediately.

## removePlayer(name) — Remove a Player

- Removes player from both `players` array and `scores` object.
- Saves and re-renders the player list and scoreboard.
- **Benefit**: Supports mid-tournament management (e.g., a player drops out).

## generateRound() — Generate New Round Matchups

Handles round generation with **fairness** and **repeat avoidance**:

1. **Minimum Players Check**
   - Alerts if fewer than 2 players — not enough for matches.

2. **Record Past Matches**
   - Builds a `pastMatchSet` to avoid duplicate matchups.
   - Tracks how often players were forced to play twice (`playedTwiceCount`).

3. **Shuffle Players**
   - Randomizes player order before pairing to ensure fairness.

4. **Main Pairing Loop**
   - Pairs players who haven't faced each other if possible.
   - Allows repeat matches only if no alternatives are available.

5. **Handle Odd Number of Players**
   - If one player is leftover, assigns them an extra match against someone with the fewest double matches.

6. **Mark Repeat Matches**
   - `isRepeat` flag is set if players have already faced each other.
   - **Benefit**: Helps track rematches visually for better tournament planning.

7. **Save and Render**
   - Adds the new round to `rounds`.
   - Saves the updated state and refreshes the UI.

## renderRounds() — Display Rounds and Matches

- For each round:
  - Creates a block displaying matchups.
  - If a matchup is a repeat, marks it visibly.
  - Includes score input fields for each player, connected to live updating.
- **Benefit**: Easy, intuitive input of match results during tournaments.

## updateScore(roundIndex, matchIndex, playerKey, value) — Update Player Scores

- Adjusts the individual match score.
- Updates the player's total tournament score by calculating the difference from the previous score.
- Saves and refreshes the scoreboard.
- **Benefit**: Supports live scoring without data loss, ensuring accurate standings.

## renderScoreboard() — Display Leaderboard

- Sorts players by score, highest first.
- Renders the sorted list.
- **Benefit**: Instant visibility of player rankings, motivating participants.

## resetTournament() — Full Reset Functionality

- Confirms with the user before wiping all data.
- Clears `players`, `rounds`, `scores`, and `localStorage`.
- Renders empty UI.
- **Benefit**: Enables clean tournament restarts without manual clearing.

## Player Click Interaction (Highlighting)

- When a player is clicked on in the player list:
  - Highlights their corresponding scoreboard entry briefly.
- **Benefit**: Quick visual correlation between player names and scores, enhancing usability during large tournaments.

## Tournament Benefits

| Feature              | Advantage                                                      |
|----------------------|----------------------------------------------------------------|
| Persistent Storage   | Tournament can continue across sessions                       |
| Fresh Matchups       | Increases variety and fairness without the manual process required to track this                                |
| Repeat Tracking      | Visual indication of rematches                               |
| Fair Extra Matches   | Balances load for odd player counts                           |
| Live Score Updates   | Instant, accurate leaderboard updates — no manual addition necessary                         |
| Easy Reset           | Quick cleanup for new events, with confirmation to ensure data isn't cleared accidentally                                  |
| UI Interactions      | Smooth and intuitive experience                               |

## Conclusion

This script forms a **highly practical**, **user-friendly**, and **persistently reliable** tournament management system — ideal for casual competitions, practice ladders, gaming tournaments, or school club events.
