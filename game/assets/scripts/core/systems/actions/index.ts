import {
	ActivationType,
	CardPlace,
	CommandType,
	ComponentType,
} from '../../components';
import type { ECS } from '../../ecs';
import { handleCardFight } from '../../helper';

const summon = () => {
	const update = (ecs: ECS) => {
		const commands = ecs.query(ComponentType.Command).exec();
		const lastCommand = commands[commands.length - 1].getComponent(
			ComponentType.Command,
		);
		const isValidSummonCommand =
			lastCommand.commandType === CommandType.Summon &&
			lastCommand.from.place === CardPlace.Hand &&
			lastCommand.to.place === CardPlace.Ground;

		if (!isValidSummonCommand) return;

		const [card] = ecs.query(ComponentType.CardPlace, lastCommand.from).exec();
		const cardPlace = card.getComponent(ComponentType.CardPlace);
		cardPlace.place = lastCommand.to.place;
		cardPlace.index = lastCommand.to.index;

		const summonActivation = card.getComponent(ComponentType.SummonActivation);
		if (!summonActivation) return;

		card.addComponent(ComponentType.SkillActivating, {
			activationType: ActivationType.Summon,
		});
	};

	return { update };
};

const fight = () => {
	const update = (ecs: ECS) => {
		const [config] = ecs.query(ComponentType.Config).exec();
		const { groundSize } = config.getComponent(ComponentType.Config);
		for (let i = 0; i < groundSize; i++) {
			const [card1, card2] = ecs
				.query(ComponentType.CardPlace, {
					place: CardPlace.Ground,
					index: i,
				})
				.exec();

			handleCardFight([card1, card2]);
			handleCardFight([card2, card1]);
		}
	};

	return { update };
};

export const actions = {
	summon,
	fight,
};
