# Gimkit Spawner

### What is this?

This is an updated version of [Gimkit Flooder](https://github.com/seanv999/gimkit-flooder.js/), since that one no longer works. This provides an easy way to spawn bots (that do nothing) into a Gimkit game.

### Quickstart

1. Download [node.js](https://nodejs.org/en/download/)
2. Download [git](https://git-scm.com/downloads)
3. Open a terminal and run `git clone https://github.com/TheLazySquid/GimkitSpawner.git`
4. Run `cd GimkitSpawner`
5. Run `npm install`
6. Create a new file named `spawn.js`
7. Add the following code in `spawn.js`:

```js
import GimkitRoom from "./index.js";

const room = new GimkitRoom("618366");

for(let i = 0; i < 100; i++) {
	let ws = await room.spawn(`Bot ${i}`);
	ws.on('open', () => {
		console.log(`Bot ${i} has loaded in!`);
	})
}
```

### API

This has an an extremely simple API. Importing './index.js' gives you the class `GimkitRoom`, which takes the room code in its constructor. The class has one method, `spawn`, which takes the name of the bot as a parameter. It returns a promise that resolves to the WebSocket connection to the bot. The bot will automatically join the game.

### How does it work?

This is some technical rambling, feel free to ignore this. The way a gimkit connection is established is with five steps-
1. Get the room's information from the code (returns a roomid)
2. Request a Gimkit page and extract the jid from it
3. Ask to join the game, while encoding the jid into a clientType string. Gives the url to the server
4. Join with the server url and roomid. Gives session id and room info
5. (finally) establish the websocket connection with the information about the room and session

Sidenote: Gimkit really tried to be sneaky with the jid. It's encoded into an otherwise innocent string, and is hidden in invisible unicode characters using [StegCloak](https://github.com/KuroLabs/stegcloak). The way it is generated is by reversing a heavily obfuscated querySelector to meta[property='int:jid']. I don't even have the foggiest clue what jid means- I'm just assuming that's what it's called because the query includes it.