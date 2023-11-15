import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
import StegCloak from 'stegcloak';
import WebSocket from 'ws';
import { encode } from './network/blueboat.js';

/** Creates a new GimkitRoom object that allows you to spawn bots */
export default class GimkitRoom {
    /**
     * @param {string} roomId The id of the Gimkit server you want the bots to join
     */
    constructor(roomId) {
        this.roomId = roomId;
        this.roomInfoReady = new Promise((resolve, reject) => {
            this.resolveRoomInfo = resolve;
        });

        // get info about the room
        this.getRoomInfo();
    }
    
    /**
     * Gets info about the room
     * @private
     */
    async getRoomInfo() {
        let infoRes = await fetch('https://www.gimkit.com/api/matchmaker/find-info-from-code', {
            method: 'POST',
            body: JSON.stringify({code: this.roomId}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let info = await infoRes.json();
    
        if(info.code === 404) throw new Error('Game not found');

        this.roomInfo = info;
        this.resolveRoomInfo();
    }

    /**
     * Spawns a bot in the Gimkit room
     * @param {string} name The name of the bot to spawn
     * @returns {Promise<WebSocket>} The WebSocket connection to the bot
     */
    async spawn(name = Math.random().toString(36).substring(7)) {
        // wait until we have the room info
        await this.roomInfoReady;

        // load the page
        let pageRes = await fetch('https://www.gimkit.com/join');
        let page = await pageRes.text();
        
        // extract the jid
        const root = parse(page);
        const jid = root.querySelector("meta[property='int:jid']").getAttribute("content").split("").reverse().join("")
        
        let clientType = new StegCloak(true, false).hide(jid, "BSKA", "Gimkit Web Client V3.1");

        // join the game
        let joinRes = await fetch("https://www.gimkit.com/api/matchmaker/join", {
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                clientType: clientType,
                name: name,
                roomId: this.roomInfo.roomId
            }),
            method: "POST"
        });
        let join = await joinRes.json();

        if(join.source == 'original') {
            // we are connecting using blueboat
            const wsUrl = `wss${join.serverUrl.substr(5)}/blueboat/?id=&EIO=3&transport=websocket`
            let ws = new WebSocket(wsUrl);

            ws.on('open', () => {
                // send a join packet
                let packet = encode({
                    roomId: join.roomId,
                    options: { intent: join.intentId }
                })

                ws.send(packet);

                // periodically send a heartbeat packet
                let heartbeat = setInterval(() => {
                    ws.send('2');
                }, 25000);

                // stop the heartbeat when the connection closes
                ws.on('close', () => {
                    clearInterval(heartbeat);
                })
            })

            return ws;
        }
        
        const joinIdUrl = `${join.serverUrl}/matchmake/joinById/${join.roomId}`;
        
        let roomRes = await fetch(joinIdUrl, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                intentId: join.intentId
            })
        });
        let room = await roomRes.json();
        
        const wsUrl = `wss${join.serverUrl.substr(5)}/${room.room.processId}/${room.room.roomId}?sessionId=${room.sessionId}`;
        
        return new WebSocket(wsUrl);
    }
}