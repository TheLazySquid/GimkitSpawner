# Gimkit Spawner

### What is this?

This is an updated version of [Gimkit Flooder](https://github.com/seanv999/gimkit-flooder.js/), since that one no longer works. This provides an easy way to spawn bots (that do nothing) into a Gimkit game. This will automatically handle any neccesary handshake and keepalive packets, so there is no need to worry about either. Please don't use this to ruin other people's games- this is intened to be an easy way to populate a server without the overhead of a bunch of browser tabs.

### Quickstart

1. Download [node.js](https://nodejs.org/en/download/)
2. Download [git](https://git-scm.com/downloads)
3. Open a terminal and run `git clone https://github.com/TheLazySquid/GimkitSpawner.git`
4. Run `cd GimkitSpawner`
5. Run `npm install`
6. Run `node cli.js <room code> [number of bots] [bot name]`, ex. `node cli.js 123456 10 bot` or just `node cli.js 123456` for five bots named 'bot'

### API

This has an an extremely simple API. Importing './index.js' gives you the class `GimkitRoom`, which takes the room code in its constructor. The class has one method, `spawn`, which takes the name of the bot as a parameter. It returns a promise that resolves to the WebSocket connection to the bot, or throws an error if the game is full. The bot will automatically join the game. To have the bot leave the game, simply close the WebSocket connection with `ws.close()`.

### How does it work?

This is some technical rambling, feel free to ignore this. The way a gimkit connection is established is with five steps-
1. Get the room's information from the code (returns a roomid)
2. Request a Gimkit page and extract the jid from it
3. Ask to join the game, while encoding the jid into a clientType string. Gives the url to the server
4. Join with the server url and roomid. Gives session id and room info
5. (finally) establish the websocket connection with the information about the room and session

Sidenote: Gimkit really tried to be sneaky with the jid. It's encoded into an otherwise innocent string, and is hidden in invisible unicode characters using [StegCloak](https://github.com/KuroLabs/stegcloak). The way it is generated is by reversing a heavily obfuscated querySelector to meta[property='int:jid']. I don't even have the foggiest clue what jid means- I'm just assuming that's what it's called because the query includes it.