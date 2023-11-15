import GimkitRoom from "./index.js";

const room = new GimkitRoom("618366");

for(let i = 0; i < 100; i++) {
	let ws = await room.spawn(`Bot ${i}`);
	ws.on('open', () => {
		console.log(`Bot ${i} has loaded in!`);
	})
}