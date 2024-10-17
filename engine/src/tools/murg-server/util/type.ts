import type { DuelCommandBundle, DuelConfig } from '@underrealm/murg';

export enum EventType {
	ConnectMatch = 'ConnectMatch',
	SendBundle = 'SendBundle',
	CardHover = 'CardHover',
	GameOver = 'GameOver',
}

export interface JwtPayload {
	userId: string;
	duelId: string;
}

export interface CommandPayload<T = never> {
	jwt: string;
	client: string;
	type: EventType;
	payload: T;
}

export type ResponseSender = (
	payload: Record<string, unknown>,
	command?: EventType,
) => Promise<void>;

export interface Context {
	userId: string;
	duelId: string;
	type: EventType;
	send: ResponseSender;
}

export type CommandHandler<T = never> = (
	context: Context,
	payload: T,
) => Promise<void>;

export interface CommandResponse<T = Record<string, unknown>> {
	type: EventType;
	userId: string;
	timestamp: number;
	payload?: T;
}

export interface DuelRecord {
	winner?: string;
	config: DuelConfig;
	history: DuelCommandBundle[];
}

export interface Client {
	id: string;
	ws: unknown;
}
