// List of URLs with free games
const urls = [
    "https://freetokeep.gg/data/epic.json",
    "https://freetokeep.gg/data/steam.json",
    "https://freetokeep.gg/data/gog.json",
    "https://freetokeep.gg/data/itch.json",
    "https://freetokeep.gg/data/stove.json",
    "https://freetokeep.gg/data/fanatical.json",
    "https://freetokeep.gg/data/prime.json",
    "https://freetokeep.gg/data/limited.json"
];

// Armenia timezone offset (UTC+4)
const armeniaOffset = 4 * 60; // minutes

function formatDate(date){
    return date.toLocaleString('en-GB',{hour12:false});
}

async function fetchGames() {
    const allGames = [];
    for (const url of urls) {
        try {
            const res = await fetch(url);
            if (!res.ok) continue;
            const data = await res.json();
            allGames.push(...data);
        } catch(e) {
            console.warn(`Error fetching ${url}: ${e}`);
        }
    }
    return allGames;
}

async function displayGames() {
    const games = await fetchGames();

    // Armenia current time
    const now = new Date();
    now.setMinutes(now.getMinutes() + armeniaOffset - now.getTimezoneOffset());

    const availableList = document.getElementById("available-list");
    const expiredList = document.getElementById("expired-list");

    const availableGames = [];
    const expiredGames = [];

    games.forEach(game => {
        if (!game.expires) return;
        const expiresUTC = new Date(game.expires);
        const expiresArmenia = new Date(expiresUTC.getTime() + armeniaOffset*60*1000);
        const gameEl = `
            <div class="game">
                <img src="${game.image}" alt="${game.title}">
                <div class="game-info">
                    <a href="${game.url}" target="_blank">${game.title}</a>
                    <div class="expires">${now < expiresArmenia ? 'Expires' : 'Expired'}: ${formatDate(expiresArmenia)}</div>
                </div>
            </div>
        `;
        if (now < expiresArmenia) availableGames.push(gameEl);
        else expiredGames.push(gameEl);
    });

    availableList.innerHTML = availableGames.length ? availableGames.join("") : "<p>No available games right now.</p>";
    expiredList.innerHTML = expiredGames.length ? expiredGames.join("") : "<p>No expired games found.</p>";
}

// Start
displayGames();
