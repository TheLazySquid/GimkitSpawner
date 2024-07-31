import GimkitRoom from './index.js';

const roomCode = process.argv[2];
const amount = process.argv[3] || "5";
const botName = process.argv.slice(4).join(" ") || "Bot";
if(
    !roomCode || isNaN(parseInt(roomCode)) || parseInt(roomCode) < 1e4 ||
    isNaN(parseInt(amount)) || parseInt(amount) < 1
) {
    console.log('Usage: node cli.js <room code> [amount] [bot name]');
    process.exit(1);
}

const room = new GimkitRoom(roomCode);

// cap at 60 since that's the max game size
const amountNum = Math.min(parseInt(amount), 60);

for(let i = 0; i < amountNum; i++) {
    await room.spawn(botName)
        .then(() => console.error(`Bot ${i} has connected!`))
        .catch(() => console.log(`Bot ${i} failed to connect (the room is likely full)`));
}

console.log("Press Ctrl+C to exit");