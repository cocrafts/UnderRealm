import {
	defaultSetting,
	ecsv1 as cardTemplate,
	initializeDuel,
} from '@underrealm/game';

import type { Client } from '../util/type';

import { setECS } from './internal';

export const onIncomingConnect = async (
	duelId: string,
	duelClients: Array<Client>,
) => {
	const duel = initializeDuel(cardTemplate, defaultSetting, duelClients);
	setECS(duelId, duel);
};
