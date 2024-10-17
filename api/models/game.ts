import type {
	Attribute,
	AttributeStackEffect,
	BoardTarget,
	CleaverAttackEffect,
	CommandSource,
	DuelCommand,
	DuelCommandBundle,
	DuelCommandPayload,
	DuelCommandTarget,
	DuelConfig,
	DuelSetting,
	Effect,
	ExplodeTimerEffect,
	IgnoreDefenseEffect,
	PlayerConfig,
	RebornEffect,
	RepeatAttackEffect,
	TargetOptions,
} from '@underrealm/murg';
import {
	BundleGroup,
	CleaverType,
	CommandSourceType,
	DuelCommandType,
	DuelPhases,
	DuelPlace,
	EffectIds,
} from '@underrealm/murg';
import { model, Schema } from 'mongoose';

import { StakingPackage } from './staking';
import { createSchema } from './utils';

export type IGameDuel = {
	id: string;
	winner?: string;
	config: DuelConfig;
	history: DuelCommandBundle[];
	createdAt: Date;
	updatedAt: Date;
};

const PlayerConfigSchema = new Schema<PlayerConfig>(
	{
		id: String,
		deck: [String],
	},
	{ id: false },
);

const CommandSourceSchema = new Schema<CommandSource>(
	{
		id: String,
		index: Number,
		owner: String,
		place: { type: String, enum: DuelPlace },
		type: { type: String, enum: CommandSourceType },
	},
	{ id: false },
);

const BoardTargetSchema = new Schema<BoardTarget>(
	{
		id: String,
		index: Number,
		owner: String,
		place: { type: String, enum: DuelPlace },
	},
	{ id: false },
);

const TargetOptions = new Schema<TargetOptions>(
	{
		attack: Number,
		health: Number,
		defense: Number,
		charge: Number,
	},
	{ id: false },
);

const DuelCommandTargetSchema = new Schema<DuelCommandTarget>(
	{
		source: CommandSourceSchema,
		from: BoardTargetSchema,
		to: BoardTargetSchema,
		options: TargetOptions,
	},
	{ id: false },
);

const AttributeSchema = new Schema<Attribute>(
	{
		attack: Number,
		health: Number,
		defense: Number,
		charge: Number,
	},
	{ id: false },
);

const EffectSchema = new Schema<Effect>(
	{
		id: { type: String, enum: EffectIds },
		life: Number,
		reborn: new Schema<RebornEffect>({ count: Number }, { id: false }),
		attributeStack: new Schema<AttributeStackEffect>(
			{
				targetId: { type: String, enum: EffectIds, required: true },
				attribute: {
					type: AttributeSchema,
					required: true,
				},
			},
			{ id: false },
		),
		cleaverAttack: new Schema<CleaverAttackEffect>(
			{
				type: { type: String, enum: CleaverType, required: true },
				radius: { type: Number, required: true },
				damage: Number,
				damageFactor: Number,
			},
			{ id: false },
		),
		repeatAttack: new Schema<RepeatAttackEffect>(
			{
				count: { type: Number, required: true },
			},
			{ id: false },
		),
		ignoreDefense: new Schema<IgnoreDefenseEffect>(
			{
				defense: { type: Number, required: true },
				defenseFactor: Number,
			},
			{ id: false },
		),
		explodeTimer: new Schema<ExplodeTimerEffect>(
			{
				radius: { type: Number, required: true },
				damage: { type: Number, required: true },
			},
			{ id: false },
		),
		attribute: AttributeSchema,
	},
	{ id: false },
);

const DuelCommandPayloadSchema = new Schema<DuelCommandPayload>(
	{
		effectMap: { type: Map, of: EffectSchema },
		gameOver: Boolean,
		turn: Number,
		phase: { type: String, enum: DuelPhases },
		phaseOf: String,
		perTurnDraw: Number,
		perTurnHero: Number,
		perTurnSpell: Number,
		perTurnTroop: Number,
		attack: Number,
		health: Number,
		defense: Number,
		charge: Number,
	},
	{ id: false },
);

const DuelCommandSchema = new Schema<DuelCommand>(
	{
		type: { type: String, enum: DuelCommandType },
		owner: String,
		target: DuelCommandTargetSchema,
		payload: DuelCommandPayloadSchema,
		amount: Number,
	},
	{ id: false },
);

const DuelCommandBundleSchema = new Schema<DuelCommandBundle>(
	{
		turn: { type: Number, required: true },
		group: { type: String, enum: BundleGroup },
		phaseOf: String,
		phase: { type: String, enum: DuelPhases },
		commands: [DuelCommandSchema],
	},
	{ id: false },
);

const GameDuelSchema = createSchema({
	config: new Schema({
		version: String,
		firstMover: String,
		firstPlayer: PlayerConfigSchema,
		secondPlayer: PlayerConfigSchema,
		setting: new Schema<DuelSetting>(
			{
				initialCardCount: Number,
				initialPlayerHealth: Number,
				elementalFactor: Number,
				handSize: Number,
				groundSize: Number,
				maxAttachment: Number,
				spellIncreaseCycle: Number,
				perTurnDraw: Number,
				perTurnHero: Number,
				perTurnSpell: Number,
				perTurnTroop: Number,
			},
			{ id: false },
		),
	}),
	history: [DuelCommandBundleSchema],
});

export const GameDuel = model<IGameDuel>('GameDuel', GameDuelSchema);

export type IMatchFinding = {
	userId: string;
	pubsubTopic: string;
	connectionId: string;
	stakingPackage?: StakingPackage;
};

const MatchFindingSchema = createSchema({
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
	stakingPackage: {
		type: String,
		enum: Object.values(StakingPackage),
	},
});

export const MatchFinding = model<IMatchFinding>(
	'MatchFinding',
	MatchFindingSchema,
);
