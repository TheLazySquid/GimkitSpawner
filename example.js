import GimkitRoom from "./index.js";

const room = new GimkitRoom("123456");

for(let i = 0; i < 25; i++) {
	let ws = await room.spawn(`Bot ${i}`);
	ws.on('open', () => {
		console.log(`Bot ${i} has connected!`);
	})
}