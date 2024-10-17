import {
	ActivationType,
	CardPlace,
	CommandType,
	ComponentType,
} from '../../components';
import type { ECS } from '../../ecs';

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

export const actions = {
	summon,
};
