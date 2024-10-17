import type { ExportedECS } from '@underrealm/game';
import { model, Schema } from 'mongoose';

import { createSchema } from './utils';

export type IGameDuelV2 = {
	id: string;
	winner?: string;
	ecs: ExportedECS;
	createdAt: Date;
	updatedAt: Date;
};

const EntitySchema = createSchema({
	id: Number,
	components: {
		type: Map,
		of: Schema.Types.Mixed,
	},
});

const GameDuelSchemaV2 = createSchema({
	id: String,
	ecs: {
		entities: {
			type: Array,
			of: EntitySchema,
		},
	},
});

export const GameDuelV2 = model<IGameDuelV2>('GameDuel', GameDuelSchemaV2);

type IMatchFinding = {
	userId: string;
	pubsubTopic: string;
	connectionId: string;
};

const MatchFindingSchemaV2 = createSchema({
	userId: {
		type: String,
		required: true,
		unique: true,
	},
	pubsubTopic: {
		type: String,
		required: true,
		unique: true,
	},
	connectionId: {
		type: String,
		unique: true,
	},
});

export const MatchFindingV2 = model<IMatchFinding>(
	'MatchFinding',
	MatchFindingSchemaV2,
);
