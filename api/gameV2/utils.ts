import type { ComponentMap, ECS } from '@underrealm/game';
import { actions } from '@underrealm/game';

export const addPackageSystems = (ecs: ECS<ComponentMap>) => {
	ecs.addSystem(actions.summon()).addSystem(actions.fight());
};
