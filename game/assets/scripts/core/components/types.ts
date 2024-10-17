export enum ComponentType {
	/**
	 * Player components
	 */
	PlayerAttribute = 'PlayerAttribute',

	/**
	 * Card components
	 */
	Variant = 'Variant',
	Template = 'Template',
	CardMetadata = 'CardMetadata',
	CardClass = 'CardClass',
	CardAttribute = 'CardAttribute',
	CardOwnership = 'CardOwnership',
	CardChargeable = 'CardChargeable',
	CardPlace = 'CardPlace',
	CardFightAttribute = 'CardFightAttribute',
	CardBuffAttribute = 'CardBuffAttribute',
	CardDebuffAttribute = 'CardDebuffAttribute',

	SummonActivation = 'SummonActivation',
	PassiveActivation = 'PassiveActivation',
	FightActivation = 'FightActivation',
	PreFightActivation = 'PreFightActivation',
	PostFightActivation = 'PostFightActivation',
	ChargeActivation = 'ChargeActivation',
	InspireActivation = 'InspireActivation',
	GloryActivation = 'GloryActivation',

	/**
	 * This component will be added to entity if the entity's activation matches,
	 * and must be reset at the last system update.
	 */
	SkillActivating = 'SkillActivating',

	DestroyFacingMinHealth = 'DestroyFacingMinHealth',
	GainAttackByEnemyDefense = 'GainAttackByEnemyDefense',
	GainAttackByEnemyMissingHealth = 'GainAttackByEnemyMissingHealth',
	GainAttackByRemainingHealth = 'GainAttackByRemainingHealth',
	MutateEnemy = 'MutateEnemy',
	MutateRandomEnemy = 'MutateRandomEnemy',
	MutatePlayer = 'MutatePlayer',
	IgnoreEnemyDefense = 'IgnoreEnemyDefense',
	SelfBuff = 'SelfBuff',
	BuffAgainstSameEnemy = 'BuffAgainstSameEnemy',
	BuffNextTurn = 'BuffNextTurn',
	FixedCleaver = 'FixedCleaver',
	FactorCleaver = 'FactorCleaver',
	MultiplyDamageAgainst = 'MultiplyDamageAgainst',
	DoubleAttack = 'DoubleAttack',
	Transform = 'Transform',

	/**
	 * Board components
	 */

	/**
	 * Duel components
	 */
	DuelManager = 'DuelManager',
	Command = 'Command',

	/**
	 * Config components
	 */
	Config = 'Config',
}

export enum ClassType {
	Assassin = 'Assassin',
	Knight = 'Knight',
	Tanker = 'Tanker',
	Wizard = 'Wizard',
	Summoner = 'Summoner',
	Beast = 'Beast',
}

export enum CardType {
	Hero = 'Hero',
	Troop = 'Troop',
	Spell = 'Spell',
}

export enum CardPlace {
	Ground = 'Ground',
	Hand = 'Hand',
	Deck = 'Deck',
	Grave = 'Grave',
}

export enum InspireSource {
	Metal = 'Metal',
	Wood = 'Wood',
	Water = 'Water',
	Fire = 'Fire',
	Earth = 'Earth',
	Light = 'Light',
	Dark = 'Dark',
	Summon = 'Summon',
	Death = 'Death',
	Spell = 'Spell',
	Skill = 'Skill',
}

export enum ElementalType {
	Metal = '01',
	Wood = '02',
	Water = '03',
	Fire = '04',
	Earth = '05',
	Light = '06',
	Dark = '07',
}

export enum DuelPhase {
	InitialDistribution = 'InitialDistribution',
	Draw = 'Draw',
	Setup = 'Setup',
	PreFight = 'PreFight',
	Fight = 'Fight',
	PostFight = 'PostFight',
	CleanUp = 'CleanUp',
}

export enum ActivationType {
	Summon = 'Summon',
	PreFight = 'PreFight',
	Fight = 'Fight',
	PostFight = 'PostFight',
	InspireSkill = 'InspireSkill',
	InspireDeath = 'InspireDeath',
	Chargeable = 'Chargeable',
	Glory = 'Glory',
}

export enum CommandType {
	Summon = 'Summon',
	EndTurn = 'EndTurn',
}
