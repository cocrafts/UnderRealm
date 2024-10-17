import type { ComponentMap } from '../components';
import { CardPlace, CardType, ComponentType, DuelPhase } from '../components';
import type { ECS, Entity } from '../ecs';
import { cloneEntity, selectDeck, selectHand } from '../helper';

const drawCards = (
	entities: Entity<ComponentMap>[],
	numberOfCards: number,
	handIndex: number,
) => {
	for (let i = 0; i < numberOfCards; i++) {
		const cardPlace = entities[i].getComponent(ComponentType.CardPlace);
		cardPlace.place = CardPlace.Hand;
		cardPlace.index = handIndex + i;
	}
};

const drawTroop = (
	ecs: ECS<ComponentMap>,
	handIndex: number,
	playerId: string,
) => {
	const [troopTemplate] = ecs
		.query(ComponentType.CardClass, {
			kind: CardType.Troop,
		})
		.and(ComponentType.CardMetadata, { name: 'Troop' })
		.and(ComponentType.Template)
		.exec();
	const newTroop = cloneEntity(ecs, troopTemplate);
	newTroop
		.removeComponent(ComponentType.Template)
		.addComponent(ComponentType.CardPlace, {
			place: CardPlace.Hand,
			index: handIndex,
		})
		.addComponent(ComponentType.CardOwnership, { owner: playerId });
	return newTroop;
};

export const initialCardDraw = () => {
	const update = (ecs: ECS) => {
		const [duelManager] = ecs.query(ComponentType.DuelManager).exec();
		const duelManagerComp = duelManager.getComponent(ComponentType.DuelManager);

		if (duelManagerComp.phase !== DuelPhase.InitialDistribution) return;

		const [player1, player2] = ecs.query(ComponentType.PlayerAttribute).exec();
		const [config] = ecs.query(ComponentType.Config).exec();
		const { initialCardCount } = config.getComponent(ComponentType.Config);

		const firstDeck = selectDeck(
			ecs,
			player1.getComponent(ComponentType.PlayerAttribute).id,
		);
		const firstHand = selectHand(
			ecs,
			player1.getComponent(ComponentType.PlayerAttribute).id,
		);
		const secondDeck = selectDeck(
			ecs,
			player2.getComponent(ComponentType.PlayerAttribute).id,
		);
		const secondHand = selectHand(
			ecs,
			player2.getComponent(ComponentType.PlayerAttribute).id,
		);

		drawCards(firstDeck, initialCardCount, firstHand.length);
		drawCards(secondDeck, initialCardCount, secondHand.length);
		duelManagerComp.phase = DuelPhase.Draw;
	};

	return { update };
};

export const turnCardDraw = () => {
	const update = (ecs: ECS) => {
		const [duelManager] = ecs.query(ComponentType.DuelManager).exec();
		const duelManagerComp = duelManager.getComponent(ComponentType.DuelManager);

		if (duelManagerComp.phase !== DuelPhase.Draw) return;

		const [config] = ecs.query(ComponentType.Config).exec();
		const turnDrawCards = config.getComponent(ComponentType.Config).perTurnDraw;
		const players = ecs.query(ComponentType.PlayerAttribute).exec();
		const [player1Id, player2Id] = players.map(
			(player) => player.getComponent(ComponentType.PlayerAttribute).id,
		);
		const firstDeck = selectDeck(ecs, player1Id);
		const firstHand = selectHand(ecs, player1Id);
		const secondDeck = selectDeck(ecs, player2Id);
		const secondHand = selectHand(ecs, player2Id);

		drawCards(firstDeck, turnDrawCards, firstHand.length);
		drawTroop(ecs, firstHand.length, player1Id);

		drawCards(secondDeck, turnDrawCards, secondHand.length);
		drawTroop(ecs, secondHand.length, player2Id);

		duelManagerComp.phase = DuelPhase.Setup;
	};

	return { update };
};
