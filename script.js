// Hardcoded example of free games
const games = [
    {
        title: "Game 1",
        url: "https://store.epicgames.com/en-US/p/game1",
        image: "https://via.placeholder.com/80",
        expires: "2025-12-26T23:59:59Z"
    },
    {
        title: "Game 2",
        url: "https://store.steampowered.com/app/2",
        image: "https://via.placeholder.com/80",
        expires: "2025-12-25T18:00:00Z"
    }
    // Add more games here or generate with Python
];

const armeniaOffset = 4 * 60; // minutes UTC+4

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

    games.forEach(game => {
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
