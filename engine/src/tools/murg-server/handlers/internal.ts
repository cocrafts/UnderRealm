import type { ComponentMap, ECS, EventType } from '@underrealm/game';
import type { DuelConfig, PlayerConfig } from '@underrealm/murg';
import {
	defaultSetting,
	getInitialState,
	makeMeta,
	move,
} from '@underrealm/murg';

import { generateRandomDeck } from '../util/deck';
import type { DuelRecord } from '../util/type';

const duelCache: Record<string, DuelRecord> = {};

export const fetchDuel = (id: string, version = '00001'): DuelRecord => {
	try {
		if (!duelCache[id]) {
			const meta = makeMeta(version);
			const firstPlayer: PlayerConfig = {
				id: 'A',
				deck: generateRandomDeck(meta),
			};
			const secondPlayer: PlayerConfig = {
				id: 'B',
				deck: generateRandomDeck(meta),
			};
			const config: DuelConfig = {
				version,
				setting: defaultSetting,
				firstMover: firstPlayer.id,
				firstPlayer: firstPlayer,
				secondPlayer: secondPlayer,
			};
			const state = getInitialState({
				version,
				setting: config.setting,
				firstMover: firstPlayer.id,
				firstPlayer: config.firstPlayer,
				secondPlayer: config.secondPlayer,
			});
			const { duel, commandBundles } = move.distributeInitialCards(state);

			if (duel) {
				move.distributeTurnCards(duel).commandBundles.forEach((bundle) => {
					commandBundles.push(bundle);
				});
			}

			duelCache[id] = { config, history: commandBundles };
		}
	} catch (e) {
		console.log(e);
	}

	return duelCache[id];
};

const ecsMap: Record<string, ECS<ComponentMap, EventType>> = {};

export const fetchECS = (duelId: string) => {
	return ecsMap[duelId];
};

export const setECS = (duelId: string, ecs: ECS<ComponentMap, EventType>) => {
	ecsMap[duelId] = ecs;
};
