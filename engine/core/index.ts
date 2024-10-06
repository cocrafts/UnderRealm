import { inspect } from 'util';

import {
	chargeActivationSystem,
	fightActivationSystem,
	gloryActivationSystem,
	inspireActivationSystem,
	passiveActivationSystem,
	preFightActivationSystem,
	summonActivationSystem,
} from './systems/activations';
import {
	buffAgainstSameEnemy,
	buffNextTurnSystem,
	destroyFacingMinHealthSystem,
	doubleAttackSystem,
	factorCleaverSystem,
	fixedCleaverSystem,
	gainAttackByEnemyDefenseSystem,
	gainAttackByEnemyMissingHealthSystem,
	gainAttackByRemainingHealthSystem,
	ignoreEnemyDefenseSystem,
	multiplyDamageAgainstSystem,
	mutateEnemySystem,
	mutatePlayerSystem,
	mutateRandomEnemySystem,
	selfBuffSystem,
	transformSystem,
} from './systems/skills';
import { ecs } from './templates/v1';

ecs
	/**
	 * Activation systems
	 */
	.addSystem(summonActivationSystem())
	.addSystem(passiveActivationSystem())
	.addSystem(fightActivationSystem())
	.addSystem(preFightActivationSystem())
	.addSystem(chargeActivationSystem())
	.addSystem(inspireActivationSystem())
	.addSystem(gloryActivationSystem())

	/**
	 * Skill systems
	 */
	.addSystem(destroyFacingMinHealthSystem())
	.addSystem(gainAttackByEnemyDefenseSystem())
	.addSystem(gainAttackByEnemyMissingHealthSystem())
	.addSystem(gainAttackByRemainingHealthSystem())
	.addSystem(mutateEnemySystem())
	.addSystem(mutateRandomEnemySystem())
	.addSystem(mutatePlayerSystem())
	.addSystem(ignoreEnemyDefenseSystem())
	.addSystem(selfBuffSystem())
	.addSystem(buffAgainstSameEnemy())
	.addSystem(buffNextTurnSystem())
	.addSystem(fixedCleaverSystem())
	.addSystem(factorCleaverSystem())
	.addSystem(multiplyDamageAgainstSystem())
	.addSystem(doubleAttackSystem())
	.addSystem(transformSystem());

console.log(inspect(ecs.toJSON(), { depth: 10, breakLength: 100 }));
