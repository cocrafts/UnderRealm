import { CardPlace, CardType, ClassType, ComponentType } from './components';
import { ECS } from './ecs';
import { handleCardFight } from './helper';

describe('Test handleCardFight', () => {
	test('handleCardFight should correctly calculate the remaining heath of card2/defenseCard', () => {
		const cardIndex = 4;
		const duelECS = new ECS();

		duelECS
			.createEntity()
			.addComponent(ComponentType.CardMetadata, {
				id: '00013',
				name: 'Legionnaire',
				kind: CardType.Hero,
				class: ClassType.Knight,
				rarity: 0,
			})
			.addComponent(ComponentType.CardFightAttribute, {
				attack: 25,
				defense: 5,
				health: 50,
			})
			.addComponent(ComponentType.CardBuffAttribute, {
				attack: 0,
				defense: 0,
				health: 0,
			})
			.addComponent(ComponentType.CardDebuffAttribute, {
				attack: 0,
				defense: 0,
				health: 0,
			})
			.addComponent(ComponentType.CardPlace, {
				index: cardIndex,
				place: CardPlace.Ground,
			})
			.addComponent(ComponentType.CardOwnership, { owner: 'A' });

		duelECS
			.createEntity()
			.addComponent(ComponentType.CardMetadata, {
				id: '00014',
				name: 'Head Hunter',
				kind: CardType.Hero,
				class: ClassType.Knight,
				rarity: 0,
			})
			.addComponent(ComponentType.CardFightAttribute, {
				attack: 20,
				defense: 0,
				health: 50,
			})
			.addComponent(ComponentType.CardBuffAttribute, {
				attack: 0,
				defense: 0,
				health: 0,
			})
			.addComponent(ComponentType.CardDebuffAttribute, {
				attack: 0,
				defense: 0,
				health: 0,
			})
			.addComponent(ComponentType.CardPlace, {
				index: cardIndex,
				place: CardPlace.Ground,
			})
			.addComponent(ComponentType.CardOwnership, { owner: 'B' });

		const [card1, card2] = duelECS
			.query(ComponentType.CardPlace, {
				index: cardIndex,
				place: CardPlace.Ground,
			})
			.exec();

		handleCardFight([card1, card2]);
		const [defenseCard] = duelECS
			.query(ComponentType.CardPlace, {
				index: cardIndex,
				place: CardPlace.Ground,
			})
			.and(ComponentType.CardOwnership, {
				owner: 'B',
			})
			.exec();
		const output = defenseCard.getComponent(ComponentType.CardFightAttribute);
		const expectedOutput = {
			type: ComponentType.CardFightAttribute,
			attack: 20,
			defense: 0,
			health: 25,
		};
		expect(output).toEqual(expectedOutput);
	});
});
