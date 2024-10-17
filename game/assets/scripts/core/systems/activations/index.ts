import {
	ActivationType,
	CardPlace,
	ComponentType as CT,
} from '../../components';
import type { ECS } from '../../ecs';
import { selectFacingCard } from '../../helper';

const summon = () => {
	const update = (ecs: ECS) => {
		const entities = ecs.query(CT.SummonActivation).exec();

		entities.forEach((entity) => {
			entity.addComponent(CT.SkillActivating, {});
		});
	};

	return { update };
};

const passive = () => {
	const update = (ecs: ECS) => {
		const entities = ecs.query(CT.PassiveActivation).exec();

		entities.forEach((entity) => {
			entity.addComponent(CT.SkillActivating, {
				activationType: ActivationType.Fight,
			});
		});
	};

	return { update };
};

const fight = () => {
	const update = (ecs: ECS) => {
		const entities = ecs.query(CT.FightActivation).exec();

		entities.forEach((entity) => {
			entity.addComponent(CT.SkillActivating, {
				activationType: ActivationType.Fight,
			});
		});
	};

	return { update };
};

const preFight = () => {
	const update = (ecs: ECS) => {
		const entities = ecs.query(CT.PreFightActivation).exec();

		entities.forEach((entity) => {
			entity.addComponent(CT.SkillActivating, {
				activationType: ActivationType.PreFight,
			});
		});
	};

	return { update };
};

const postFight = () => {
	const update = (ecs: ECS) => {
		const entities = ecs.query(CT.PostFightActivation).exec();

		entities.forEach((entity) => {
			entity.addComponent(CT.SkillActivating, {
				activationType: ActivationType.PostFight,
			});
		});
	};

	return { update };
};

/**
 * Enable SkillActivating by checking charge vs threshold
 */
const charge = () => {
	const update = (ecs: ECS) => {
		const entities = ecs.query(CT.CardChargeable).exec();

		entities.forEach((entity) => {
			const charge = entity.getComponent(CT.ChargeActivation);
			if (charge.current < charge.threshold) return;

			// reset charge
			charge.current = 0;

			entity.addComponent(CT.SkillActivating, {
				activationType: ActivationType.Chargeable,
			});
		});
	};

	return { update };
};

// TODO: Define trigger condition (inspire source)
const inspire = () => {
	const update = (ecs: ECS) => {
		const entities = ecs.query(CT.InspireActivation).exec();

		entities.forEach((entity) => {
			entity.addComponent(CT.SkillActivating, {});
		});
	};

	return { update };
};

const glory = () => {
	const update = (ecs: ECS) => {
		const entities = ecs
			.query(CT.GloryActivation)
			.and(CT.CardPlace, { place: CardPlace.Ground })
			.exec();
		entities.forEach((entity) => {
			const facingCard = selectFacingCard(ecs, entity);
			if (facingCard) return;

			entity.addComponent(CT.SkillActivating, {
				activationType: ActivationType.Glory,
			});

			entity.getComponent(CT.GloryActivation);
		});
	};

	return { update };
};

export const activation = {
	summon,
	passive,
	fight,
	preFight,
	postFight,
	charge,
	inspire,
	glory,
};
