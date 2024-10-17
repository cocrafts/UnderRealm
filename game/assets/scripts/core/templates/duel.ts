import type { ComponentMap, Config } from '../components';
import { CardPlace, CardType, ComponentType, DuelPhase } from '../components';
import type { ExportedECS } from '../ecs';
import { ECS } from '../ecs';
import type { EventType } from '../events';

export const defaultSetting: Omit<Config, 'type'> = {
	initialCardCount: 5,
	initialPlayerHealth: 150,
	elementalFactor: 0.1,
	handSize: 9,
	groundSize: 11,
	maxDeckSize: 30,
	maxAttachment: 2,
	spellIncreaseCycle: 3,
	perTurnDraw: 1,
	perTurnHero: 1,
	perTurnSpell: 2,
	perTurnTroop: 1,
};

export const initializeDuel = (
	cardTemplate: ExportedECS,
	config: Omit<Config, 'type'>,
	[firstPlayer, secondPlayer]: Array<{ id: string }>,
) => {
	const template = ECS.fromJSON<ComponentMap, EventType>(cardTemplate);
	const duelECS = new ECS();
	const { initialPlayerHealth, initialCardCount, maxDeckSize } = config;

	duelECS.createEntity().addComponent(ComponentType.Config, config);
	duelECS.createEntity().addComponent(ComponentType.DuelManager, {
		phase: DuelPhase.InitialDistribution,
		turnOf: firstPlayer.id,
	});
	createTroopTemplate(duelECS, template);

	generatePlayer(duelECS, firstPlayer.id, initialPlayerHealth);
	generatePlayer(duelECS, secondPlayer.id, initialPlayerHealth);

	generateRandomDeck(
		duelECS,
		template,
		maxDeckSize,
		initialCardCount,
		firstPlayer.id,
	);
	generateRandomDeck(
		duelECS,
		template,
		maxDeckSize,
		initialCardCount,
		secondPlayer.id,
	);

	return duelECS;
};

const createTroopTemplate = (
	duel: ECS<ComponentMap, EventType>,
	template: ECS<ComponentMap, EventType>,
) => {
	const troopCards = template
		.query(ComponentType.CardMetadata, { kind: CardType.Troop })
		.exec();

	troopCards.forEach((entity) => {
		const card = duel.createEntity();
		Object.keys(entity.components).forEach(
			(componentKey: keyof ComponentMap) => {
				card.addComponent(componentKey, entity.getComponent(componentKey));
			},
		);
		card.addComponent(
			ComponentType.CardFightAttribute,
			card.getComponent(ComponentType.CardAttribute),
		);
	});
};

const generatePlayer = (
	duel: ECS<ComponentMap, EventType>,
	playerId: string,
	playerHealth: number,
) => {
	duel.createEntity().addComponent(ComponentType.PlayerAttribute, {
		id: playerId,
		health: playerHealth,
	});
};

const generateRandomDeck = (
	duel: ECS<ComponentMap, EventType>,
	template: ECS<ComponentMap, EventType>,
	maxDeckSize: number,
	initialCards: number,
	playerId: string,
) => {
	const heroCards = template
		.query(ComponentType.CardMetadata, { kind: CardType.Hero })
		.exec();
	const maxSize = Math.floor(heroCards.length);
	const safeSize = Math.min(maxSize, maxDeckSize);
	let count = 0;

	while (count < safeSize) {
		const randomIndex = Math.floor(Math.random() * heroCards.length);
		const newCard = duel
			.createEntity()
			.addComponent(ComponentType.CardOwnership, { owner: playerId })
			.addComponent(ComponentType.CardPlace, {
				index: count,
				place: CardPlace.Deck,
			})
			.addComponent(
				ComponentType.CardFightAttribute,
				heroCards[randomIndex].getComponent(ComponentType.CardAttribute),
			);

		Object.keys(heroCards[randomIndex].components).forEach(
			(component: keyof ComponentMap) => {
				newCard.addComponent(
					component,
					heroCards[randomIndex].getComponent(component),
				);
			},
		);

		count++;
	}
};
