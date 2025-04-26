let players = JSON.parse(localStorage.getItem("players")) || [];
let rounds = JSON.parse(localStorage.getItem("rounds")) || [];
let scores = JSON.parse(localStorage.getItem("scores")) || {};

function saveState() {
  localStorage.setItem("players", JSON.stringify(players));
  localStorage.setItem("rounds", JSON.stringify(rounds));
  localStorage.setItem("scores", JSON.stringify(scores));
}

function addPlayer() {
  const input = document.getElementById("player-name");
  const name = input.value.trim();
  if (name && !players.includes(name)) {
    players.push(name);
    scores[name] = 0;
    input.value = "";
    saveState();
    renderPlayers();
    renderScoreboard();
  }
}

function renderPlayers() {
    const list = document.getElementById("player-list");
    list.innerHTML = "";
    players.forEach(player => {
      const li = document.createElement("li");
      li.innerHTML = `${player} <button onclick="removePlayer('${player}')">✖</button>`;
      list.appendChild(li);
    });
  }
  
  function removePlayer(name) {
    players = players.filter(p => p !== name);
    delete scores[name];
    saveState();
    renderPlayers();
    renderScoreboard();
  }
  

  function generateRound() {
    if (players.length < 2) {
        alert("At least 2 players required.");
        return;
    }

    // Load past matchups
    const pastMatchSet = new Set();
    const playedTwiceCount = {}; // Track how often each player had to play twice

    players.forEach(player => {
        playedTwiceCount[player] = 0;
    });

    rounds.forEach(round => {
        const roundPlayerCount = {}; // Track player appearance in this round
        round.matches.forEach(match => {
            const key = [match.p1, match.p2].sort().join("|");
            pastMatchSet.add(key);

            roundPlayerCount[match.p1] = (roundPlayerCount[match.p1] || 0) + 1;
            roundPlayerCount[match.p2] = (roundPlayerCount[match.p2] || 0) + 1;
        });
        for (const player in roundPlayerCount) {
            if (roundPlayerCount[player] > 1) {
                playedTwiceCount[player]++;
            }
        }
    });

    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const usedPlayers = new Set();
    const newMatchups = [];

    let leftoverPlayer = null;

    // Main pairing loop
    while (shuffled.length >= 2) {
        const p1 = shuffled.pop();
        let p2Index = shuffled.findIndex(p2 => !pastMatchSet.has([p1, p2].sort().join("|")));
        if (p2Index === -1) {
            p2Index = 0; // If no new opponent found, allow repeat
        }
        const p2 = shuffled.splice(p2Index, 1)[0];
        const key = [p1, p2].sort().join("|");

        newMatchups.push({
            p1,
            p2,
            p1Score: 0,
            p2Score: 0,
            isRepeat: pastMatchSet.has(key)
        });
        usedPlayers.add(p1);
        usedPlayers.add(p2);
        pastMatchSet.add(key);
    }

    // If one player left over
    if (shuffled.length === 1) {
        leftoverPlayer = shuffled.pop();
    }

    // After everyone played once, schedule the leftover player to play a second match
    if (leftoverPlayer) {
        const eligibleOpponents = players.filter(p => p !== leftoverPlayer);
        const opponent = eligibleOpponents.sort((a, b) => {
            // Prefer opponent who has had to play twice the fewest times
            return playedTwiceCount[a] - playedTwiceCount[b];
        })[0];

        const key = [leftoverPlayer, opponent].sort().join("|");

        newMatchups.push({
            p1: leftoverPlayer,
            p2: opponent,
            p1Score: 0,
            p2Score: 0,
            isRepeat: pastMatchSet.has(key)
        });

        playedTwiceCount[leftoverPlayer]++;
        playedTwiceCount[opponent]++;
        pastMatchSet.add(key);
    }

    const round = {
        id: rounds.length + 1,
        matches: newMatchups
    };

    rounds.push(round);
    saveState();
    renderRounds();
}
  

function renderRounds() {
  const container = document.getElementById("all-rounds");
  container.innerHTML = "";

  rounds.forEach((round, roundIndex) => {
    const div = document.createElement("div");
    div.className = "round";
    const title = document.createElement("h3");
    title.textContent = `Round ${round.id}`;
    div.appendChild(title);

    round.matches.forEach((match, matchIndex) => {
      const matchDiv = document.createElement("div");
      matchDiv.className = "match";

      matchDiv.innerHTML = `
        <strong>${match.p1} vs ${match.p2}</strong>
        ${match.isRepeat ? '<em>(repeat)</em>' : ''}<br/>
        ${match.p1}: <input type="number" class="score-input" value="${match.p1Score}" min="0" onchange="updateScore(${roundIndex}, ${matchIndex}, 'p1', this.value)" />
        ${match.p2}: <input type="number" class="score-input" value="${match.p2Score}" min="0" onchange="updateScore(${roundIndex}, ${matchIndex}, 'p2', this.value)" />
    `;


      div.appendChild(matchDiv);
    });

    container.appendChild(div);
  });
}

function updateScore(roundIndex, matchIndex, playerKey, value) {
  const score = parseInt(value) || 0;
  const match = rounds[roundIndex].matches[matchIndex];
  const prevScore = match[`${playerKey}Score`] || 0;
  const playerName = match[playerKey];

  match[`${playerKey}Score`] = score;
  scores[playerName] += score - prevScore;
  saveState();
  renderScoreboard();
}

function renderScoreboard() {
  const list = document.getElementById("scoreboard");
  list.innerHTML = "";

  const sorted = Object.entries(scores)
    .sort(([, a], [, b]) => b - a);

  sorted.forEach(([player, score]) => {
    const li = document.createElement("li");
    li.textContent = `${player}: ${score} pts`;
    list.appendChild(li);
  });
}

function resetTournament() {
  if (confirm("Reset all tournament data? This cannot be undone.")) {
    players = [];
    rounds = [];
    scores = {};
    localStorage.clear();
    renderPlayers();
    renderRounds();
    renderScoreboard();
  }
}

renderPlayers();
renderRounds();
renderScoreboard();

// Attach click listeners to player list items
document.querySelectorAll('#player-list li').forEach(playerItem => {
  playerItem.addEventListener('click', () => {
      const playerName = playerItem.querySelector('span') 
          ? playerItem.querySelector('span').textContent.trim()
          : playerItem.childNodes[0].textContent.trim();
      
      document.querySelectorAll('#scoreboard li').forEach(scoreItem => {
          if (scoreItem.textContent.includes(playerName)) {
              scoreItem.classList.add('selected');

              // Remove highlight after 1 second
              setTimeout(() => {
                  scoreItem.classList.remove('selected');
              }, 500);
          }
      });
  });
});

