import GimkitRoom from "./index.js";

const room = new GimkitRoom("123456");

for(let i = 0; i < 3; i++) {
	await room.spawn(`Bot ${i}`)
		.then(() => console.error(`Bot ${i} has connected!`))
		.catch(() => console.log(`Bot ${i} failed to connect (the room is likely full)`));
}