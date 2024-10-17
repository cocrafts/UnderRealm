import { nanoId } from '@underrealm/murg';
import express from 'express';
import injectSocket from 'express-ws';
import { sign, verify } from 'jsonwebtoken';

// import { injectBotMove } from './handlers/ai';
import type {
	Client,
	CommandPayload,
	CommandResponse,
	Context,
	JwtPayload,
	ResponseSender,
} from './util/type';
import { EventType as ET } from './util/type';
import {
	onIncomingBundle,
	onIncomingConnect,
	onInComingHover,
} from './handlers';

const app = express();
const socket = injectSocket(app);

const duelClients: Record<string, Array<Client>> = {};
const jwtSecret = 'shh!!';

socket.app.ws('/', (ws) => {
	ws.on('message', async (rawData) => {
		try {
			const data: CommandPayload = JSON.parse(rawData.toString());
			console.log('on event', data);
			const { userId, duelId } = verify(data.jwt, jwtSecret) as JwtPayload;

			const players = duelClients[duelId] || [];
			const findPlayer = (client: Client) => client.id === userId;
			const playerIndex = players.findIndex(findPlayer);

			const send: ResponseSender = async (payload, command): Promise<void> => {
				const clients = socket.getWss().clients;

				clients.forEach((client) => {
					const response: CommandResponse = {
						type: command || data.type,
						userId,
						timestamp: new Date().getTime(),
						payload,
					};
					client.send(JSON.stringify(response));
				});
			};

			const context: Context = {
				duelId,
				userId,
				type: data.type,
				send,
			};

			if (playerIndex === -1) {
				players.push({ id: userId, ws });
				duelClients[duelId] = players;
			}
			if (data.type === ET.ConnectMatch) {
				await onIncomingConnect(duelId, duelClients[duelId]);
			} else if (data.type === ET.SendBundle) {
				await onIncomingBundle(context, data.payload);
			} else if (data.type === ET.CardHover) {
				await onInComingHover(context, data.payload);
			}
		} catch (err) {
			await ws.send(JSON.stringify({ message: 'error', error: err }));
		}
	});
});

socket.app.listen(3006, () => {
	console.log('Address: localhost:3006');
});

const duelId = nanoId();

const signAndPrintSignature = (userId: string) => {
	const signature = sign({ userId, duelId } as JwtPayload, jwtSecret);

	console.log(
		`Player ${userId}: `,
		`http://localhost:7456/?ws=ws://localhost:3006&jwt=${signature}`,
	);
};

console.log('Duel:', duelId);

signAndPrintSignature('A');
signAndPrintSignature('B');
