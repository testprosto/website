import json
import requests
from datetime import datetime, timezone, timedelta

urls = [
    "https://freetokeep.gg/data/epic.json",
    "https://freetokeep.gg/data/steam.json",
    "https://freetokeep.gg/data/gog.json",
    "https://freetokeep.gg/data/itch.json",
    "https://freetokeep.gg/data/stove.json",
    "https://freetokeep.gg/data/fanatical.json",
    "https://freetokeep.gg/data/prime.json",
    "https://freetokeep.gg/data/limited.json"
]

games = []

# Fetch all games
for url in urls:
    try:
        res = requests.get(url)
        res.raise_for_status()
        games.extend(res.json())
    except Exception as e:
        print(f"Error fetching {url}: {e}")

# Armenia timezone UTC+4
armenia_tz = timezone(timedelta(hours=4))

js_games = []
for game in games:
    try:
        expires_utc = datetime.fromisoformat(game['expires'].replace("Z","+00:00"))
        expires_armenia = expires_utc.astimezone(armenia_tz)
        js_games.append({
            "title": game.get("title","Unknown"),
            "url": game.get("url","#"),
            "image": game.get("image",""),
            "expires": expires_armenia.isoformat()
        })
    except KeyError:
        continue

# Write script.js
with open("script.js","w", encoding="utf-8") as f:
    f.write("const games = ")
    json.dump(js_games, f, ensure_ascii=False, indent=4)
    f.write("""

const armeniaOffset = 4 * 60;

function formatDate(date){
    return new Date(date).toLocaleString('en-GB',{hour12:false});
}

function displayGames() {
    const now = new Date();
    now.setMinutes(now.getMinutes() + armeniaOffset - now.getTimezoneOffset());

    const availableList = document.getElementById("available-list");
    const expiredList = document.getElementById("expired-list");

    const availableGames = [];
    const expiredGames = [];

    games.forEach(game=>{
        const expiresArmenia = new Date(game.expires);
        const gameEl = `
        <div class="game">
            <img src="${game.image}" alt="${game.title}">
            <div class="game-info">
                <a href="${game.url}" target="_blank">${game.title}</a>
                <div class="expires">${now<expiresArmenia?'Expires':'Expired'}: ${formatDate(expiresArmenia)}</div>
            </div>
        </div>`;
        if(now < expiresArmenia) availableGames.push(gameEl);
        else expiredGames.push(gameEl);
    });

    availableList.innerHTML = availableGames.length ? availableGames.join("") : "<p>No available games right now.</p>";
    expiredList.innerHTML = expiredGames.length ? expiredGames.join("") : "<p>No expired games found.</p>";
}

displayGames();
""")

print("script.js generated successfully!")
